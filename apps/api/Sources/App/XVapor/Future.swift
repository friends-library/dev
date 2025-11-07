import Vapor

typealias Future = EventLoopFuture

func future<M>(
  of: M.Type,
  on eventLoop: EventLoop,
  f: @Sendable @escaping () async throws -> M,
) -> Future<M> {
  let promise = eventLoop.makePromise(of: M.self)
  promise.completeWithTask(f)
  return promise.futureResult
}
