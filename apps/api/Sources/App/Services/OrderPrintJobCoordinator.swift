import DuetSQL
import NonEmpty
import XCore
import XSlack

enum OrderPrintJobCoordinator {
  typealias JobCreator = (Order) async throws -> Lulu.Api.PrintJob

  static func createNewPrintJobs(_ createPrintJob: JobCreator = PrintJobs.create(_:)) async {
    let orders: [Order]
    do {
      orders = try await Current.db.query(Order.self)
        .where(.printJobStatus == .enum(Order.PrintJobStatus.presubmit))
        .all()
    } catch {
      await slackError("Error querying presubmit orders: \(error)")
      return
    }

    guard !orders.isEmpty else {
      return
    }

    var updated: [Order] = []
    for var order in orders {
      do {
        let job = try await createPrintJob(order)
        if job.status.name != .created {
          await slackError(
            "Unexpected print job status `\(job.status.name.rawValue)` for order \(order |> slackLink)"
          )
        } else {
          order.printJobStatus = .pending
          order.printJobId = .init(rawValue: Int(job.id))
          updated.append(order)
          await slackOrder("Created print job \(job |> slackLink) for order \(order |> slackLink)")
        }
      } catch {
        await slackError("Error creating print job for order \(order |> slackLink): \(error)")
      }
    }

    if !updated.isEmpty {
      do {
        try await Current.db.update(updated)
      } catch {
        await slackError("Error updating orders: \(error)")
      }
    }
  }

  static func checkPendingOrders() async {
    guard let (orders, printJobs) = await getOrdersWithPrintJobs(status: .pending) else {
      return
    }

    var updated: [Order] = []
    for var order in orders {
      guard let printJob = printJobs.first(where: order |> belongsToPrintJob) else {
        await slackError("Failed to find print job belonging to order \(order |> slackLink)")
        continue
      }

      let status = printJob.status.name.rawValue
      switch printJob.status.name {
      case .created:
        if order.createdAt < Date(subtractingDays: 1) {
          await slackError("Print job \(printJob |> slackLink) stuck in `created` state!")
        }
      case .unpaid:
        await slackError("Print job \(printJob |> slackLink) found in state `\(status)`!")
      case .rejected,
           .canceled,
           .error:
        order.printJobStatus = .rejected
        updated.append(order)
        await slackError(
          "Print job \(printJob |> slackLink) for order \(order.id.lowercased) rejected"
        )
      case .paymentInProgress,
           .productionReady,
           .productionDelayed,
           .shipped,
           .inProduction:
        order.printJobStatus = .accepted
        updated.append(order)
        await slackOrder(
          "Verified acceptance of print job \(printJob |> slackLink), status: `\(status)`"
        )
      }
    }

    await updateOrders(updated)
  }

  static func sendTrackingEmails() async {
    guard let (orders, printJobs) = await getOrdersWithPrintJobs(status: .accepted) else {
      return
    }

    var updated: [Order] = []
    for var order in orders {
      guard let printJob = printJobs.first(where: order |> belongsToPrintJob) else {
        await slackError("Failed to find print job belonging to order \(order |> slackLink)")
        continue
      }

      let status = printJob.status.name.rawValue
      switch printJob.status.name {
      case .unpaid:
        await slackError("Print job \(printJob |> slackLink) found in status `\(status)`!")
      case .canceled, .rejected:
        order.printJobStatus = printJob.status.name == .canceled ? .canceled : .rejected
        updated.append(order)
        await slackError("Order \(order |> slackLink) was found in status `\(status)`!")
      case .shipped:
        order.printJobStatus = .shipped
        updated.append(order)
        await sendOrderShippedEmail(order, printJob)
        await slackOrder("Order \(order |> slackLink) shipped")
      case .paymentInProgress,
           .productionReady,
           .productionDelayed,
           .inProduction,
           .error,
           .created:
        break
      }
    }

    await updateOrders(updated)
  }
}

// helpers

private func sendOrderShippedEmail(_ order: Order, _ printJob: Lulu.Api.PrintJob) async {
  do {
    let trackingUrl = printJob.lineItems.compactMap { $0.trackingUrls?.first }.first
    let email = try await EmailBuilder.orderShipped(order, trackingUrl: trackingUrl)
    await Current.postmarkClient.send(email)
  } catch {
    await slackError("Error sending order shipped email for order \(order.id): \(error)")
  }
}

private func updateOrders(_ orders: [Order]) async {
  guard !orders.isEmpty else { return }
  do {
    try await Current.db.update(orders)
  } catch {
    let ids = orders.map(\.id.rawValue.uuidString).joined(separator: ", ")
    await slackError("Error updating orders: [\(ids)]")
  }
}

private func getOrdersWithPrintJobs(
  status: Order.PrintJobStatus
) async -> (orders: [Order], printJobs: [Lulu.Api.PrintJob])? {
  let orders: [Order]
  let printJobs: [Lulu.Api.PrintJob]
  do {
    orders = try await Current.db.query(Order.self)
      .where(.printJobStatus == .enum(status))
      .all()

    guard let printJobIds = await orderPrintJobIds(orders) else {
      return nil
    }

    printJobs = try await Current.luluClient.listPrintJobs(printJobIds)
  } catch {
    await slackError("Error querying orders & print jobs: \(error)")
    return nil
  }
  return (orders: orders, printJobs: printJobs)
}

private func orderPrintJobIds(_ orders: [Order]) async -> NonEmpty<[Int64]>? {
  guard !orders.isEmpty else {
    return nil
  }

  let ids = try? NonEmpty<[Int64]>.fromArray(
    orders.compactMap { $0.printJobId?.rawValue }.map(Int64.init)
  )

  guard let printJobIds = ids, printJobIds.count == orders.count else {
    let ids = orders.map { "\($0.id)" }.joined(separator: ", ")
    await slackError("Unexpected missing print job id in orders: [\(ids)]")
    return nil
  }

  return printJobIds
}

private func belongsToPrintJob(_ order: Order) -> (Lulu.Api.PrintJob) -> Bool {
  { printJob in
    printJob.id == Int64(order.printJobId?.rawValue ?? -1)
  }
}

private func slackLink(_ order: Order) -> String {
  guard Env.mode != .test else { return order.id.lowercased }
  let staging = Env.mode == .staging ? "--staging" : ""
  let url = "https://admin\(staging).friendslibrary.com/orders/\(order.id.lowercased)"
  return Slack.Message.link(to: url, withText: "\(order.id.lowercased)")
}

private func slackLink(_ printJob: Lulu.Api.PrintJob) -> String {
  guard Env.mode != .test else { return "\(printJob.id)" }
  let sandbox = Env.mode == .staging ? "sandbox." : ""
  let url = "https://developers.\(sandbox)lulu.com/print-jobs/detail/\(printJob.id)"
  return Slack.Message.link(to: url, withText: "\(printJob.id)")
}
