import DuetSQL
import NonEmpty
import XCore
import XSlack

enum OrderPrintJobCoordinator {
  typealias JobCreator = (Order) async throws -> Lulu.Api.PrintJob

  static func createNewPrintJobs(_ createPrintJob: JobCreator = PrintJobs.create(_:)) async {
    let db = get(dependency: \.db)
    let orders: [Order]
    do {
      orders = try await db.query(Order.self)
        .where(.printJobStatus == .enum(Order.PrintJobStatus.presubmit))
        .all(in: get(dependency: \.db))
    } catch {
      await notifyErr("27fad259", "Error querying presubmit orders", error)
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
          await notifyErr(
            "96a0baa6",
            "Unexpected print job status `\(job.status.name.rawValue)` for order \(order |> slackLink)",
          )
        } else {
          order.printJobStatus = .pending
          order.printJobId = .init(rawValue: Int(job.id))
          updated.append(order)
          await slackOrder("Created print job \(job |> slackLink) for order \(order |> slackLink)")
        }
      } catch {
        await notifyErr(
          "015b6291",
          "Error creating print job for order \(order |> slackLink)",
          error,
        )
      }
    }

    if !updated.isEmpty {
      do {
        try await db.update(updated)
      } catch {
        await notifyErr("4ffa0b87", "Error updating orders", error)
      }
    }
  }

  static func checkPendingOrders() async {
    let db = get(dependency: \.db)
    guard let (orders, printJobs) = await getOrdersWithPrintJobs(status: .pending, in: db) else {
      return
    }

    var updated: [Order] = []
    for var order in orders {
      guard let printJob = printJobs.first(where: order |> belongsToPrintJob) else {
        await notifyErr(
          "8292d78f",
          "Failed to find print job belonging to order \(order |> slackLink)",
        )
        continue
      }

      let status = printJob.status.name.rawValue
      switch printJob.status.name {
      case .created:
        if order.createdAt < Date(subtractingDays: 1) {
          await notifyErr(
            "095989fa",
            "Print job \(printJob |> slackLink) stuck in `created` state!",
          )
        }
      case .unpaid:
        await notifyErr(
          "8d4dbd48",
          "Print job \(printJob |> slackLink) found in state `\(status)`!",
        )
      case .rejected,
           .canceled,
           .error:
        order.printJobStatus = .rejected
        updated.append(order)
        await notifyErr(
          "7434ada4",
          "Print job \(printJob |> slackLink) for order \(order.id.lowercased) rejected",
        )
      case .paymentInProgress,
           .productionReady,
           .productionDelayed,
           .shipped,
           .inProduction:
        order.printJobStatus = .accepted
        updated.append(order)
        await slackOrder(
          "Verified acceptance of print job \(printJob |> slackLink), status: `\(status)`",
        )
      }
    }

    await updateOrders(updated, in: db)
  }

  static func sendTrackingEmails() async {
    let db = get(dependency: \.db)
    guard let (orders, printJobs) = await getOrdersWithPrintJobs(status: .accepted, in: db) else {
      return
    }

    var updated: [Order] = []
    for var order in orders {
      guard let printJob = printJobs.first(where: order |> belongsToPrintJob) else {
        await notifyErr(
          "f0ca012a",
          "Failed to find print job belonging to order \(order |> slackLink)",
        )
        continue
      }

      let status = printJob.status.name.rawValue
      switch printJob.status.name {
      case .unpaid:
        await notifyErr(
          "89de00c5",
          "Print job \(printJob |> slackLink) found in status `\(status)`!",
        )
      case .canceled, .rejected:
        order.printJobStatus = printJob.status.name == .canceled ? .canceled : .rejected
        updated.append(order)
        await notifyErr("c214d3a7", "Order \(order |> slackLink) was found in status `\(status)`!")
      case .shipped:
        order.printJobStatus = .shipped
        updated.append(order)
        await sendOrderShippedEmail(order, printJob, in: db)
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

    await updateOrders(updated, in: db)
  }
}

// helpers

private func sendOrderShippedEmail(
  _ order: Order,
  _ printJob: Lulu.Api.PrintJob,
  in db: any DuetSQL.Client,
) async {
  do {
    let trackingUrl = printJob.lineItems.compactMap { $0.trackingUrls?.first }.first
    let email = try await EmailBuilder.orderShipped(order, trackingUrl: trackingUrl, in: db)
    await get(dependency: \.postmarkClient).send(email)
  } catch {
    await notifyErr("8190eb37", "Error sending order shipped email for order \(order.id)", error)
  }
}

private func updateOrders(_ orders: [Order], in db: any DuetSQL.Client) async {
  guard !orders.isEmpty else { return }
  do {
    try await db.update(orders)
  } catch {
    let ids = orders.map(\.id.rawValue.uuidString).joined(separator: ", ")
    await notifyErr("15cc926e", "Error updating orders: [\(ids)]", error)
  }
}

private func getOrdersWithPrintJobs(
  status: Order.PrintJobStatus,
  in db: any DuetSQL.Client,
) async -> (orders: [Order], printJobs: [Lulu.Api.PrintJob])? {
  let orders: [Order]
  let printJobs: [Lulu.Api.PrintJob]
  do {
    orders = try await db.query(Order.self)
      .where(.printJobStatus == .enum(status))
      .all(in: get(dependency: \.db))

    guard let printJobIds = await orderPrintJobIds(orders) else {
      return nil
    }

    printJobs = try await get(dependency: \.luluClient).listPrintJobs(printJobIds)
  } catch {
    // don't log/notify near daily lulu signature expiration time
    if "\(error)".contains("Signature has expired") {
      let hour = Calendar.current.component(.hour, from: Date())
      let minute = Calendar.current.component(.minute, from: Date())
      if hour == 8, (10 ... 20).contains(minute) {
        return nil
      }
    }

    await notifyErr("441b5e97", "Error querying orders & print jobs", error)
    return nil
  }
  return (orders: orders, printJobs: printJobs)
}

private func orderPrintJobIds(_ orders: [Order]) async -> NonEmpty<[Int64]>? {
  guard !orders.isEmpty else {
    return nil
  }

  let ids = try? NonEmpty<[Int64]>.fromArray(
    orders.compactMap { $0.printJobId?.rawValue }.map(Int64.init),
  )

  guard let printJobIds = ids, printJobIds.count == orders.count else {
    let ids = orders.map { "\($0.id)" }.joined(separator: ", ")
    await notifyErr("93da8586", "Unexpected missing print job id in orders: [\(ids)]")
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

func notifyErr(_ id: String, _ slackMessage: String, _ error: (any Error)? = nil) async {
  var message = slackMessage
  if let error {
    if "\(error)".contains("leakage of sensitive data") {
      message += ", Error: `\(String(reflecting: error))`"
    } else {
      message += ", Error: `\(error)`"
    }
  }
  await get(dependency: \.postmarkClient).send(.init(
    to: Env.JARED_CONTACT_FORM_EMAIL,
    from: "info@friendslibrary.com",
    subject: "[FLP Api] Print job error \(id)",
    textBody: message,
  ))
  await slackError(message)
}
