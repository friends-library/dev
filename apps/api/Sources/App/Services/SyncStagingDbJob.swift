import Queues
import ShellOut
import Vapor

struct SyncStagingDbJob: AsyncScheduledJob {
  func run(context: QueueContext) async throws {
    do {
      let cmdOutput = try shellOut(
        to: "/usr/bin/bash",
        arguments: ["/home/jared/sync-staging-db.sh"],
      )
      await slackDebug("Completed prod->staging db sync\n```\n\(cmdOutput)\n```")
    } catch {
      let error = error as! ShellOutError
      await logError(error)
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
    """,
  )
}
