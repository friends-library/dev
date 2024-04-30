import Queues
import ShellOut
import Vapor

public struct SyncStagingDbJob: ScheduledJob {

  public func run(context: QueueContext) -> EventLoopFuture<Void> {
    future(of: Void.self, on: context.eventLoop) {
      do {
        let cmdOutput = try shellOut(
          to: "/usr/bin/bash",
          arguments: ["\(Env.get("DEPLOY_DIR") ?? "")/apps/api/sync-staging-db.sh"]
        )
        await slackDebug("Completed prod->staging db sync\n```\n\(cmdOutput)\n```")
      } catch {
        let error = error as! ShellOutError
        await logError(error)
      }
    }
  }
}

private func logError(_ error: ShellOutError) async {
  await slackError(
    """
    Error running `SyncStagingDbJob` bash script:

    *stderr*:
    ```
    \(error.message)
    ```

    *stdout*:
    ```
    \(error.output)
    ```
    """
  )
}
