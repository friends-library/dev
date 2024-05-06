import Queues
import Vapor

public struct SendNarrowPath: AsyncScheduledJob {
  public func run(context: QueueContext) async throws {
    // do something
  }
}
