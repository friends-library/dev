import Queues
import Vapor

struct ProcessOrdersJob: AsyncScheduledJob {
  func run(context: QueueContext) async throws {
    await OrderPrintJobCoordinator.createNewPrintJobs()
    await OrderPrintJobCoordinator.checkPendingOrders()
    await OrderPrintJobCoordinator.sendTrackingEmails()
  }
}
