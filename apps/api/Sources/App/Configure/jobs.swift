import QueuesFluentDriver
import Vapor

public extension Configure {
  static func jobs(_ app: Application) throws {
    guard Env.mode == .prod else { return }

    // since we're not using redis, only have one core (currently)
    // and are just doing very low frequency tasks, throttle way down
    app.queues.configuration.workerCount = 1
    app.queues.configuration.refreshInterval = .seconds(300)
    app.queues.use(.fluent(useSoftDeletes: false))

    app.queues.schedule(ProcessOrdersJob()).hourly().at(15)
    app.queues.schedule(SyncStagingDbJob()).daily().at(7, 15)
    app.queues.schedule(VerifyConsistentChapterHeadingsJob()).daily().at(8, 0)
    app.queues.schedule(VerifyEntityValidityJob()).daily().at(8, 15)
    app.queues.schedule(VerifyCloudAssets()).weekly().on(.friday).at(6, 30)
    app.queues.schedule(SendNarrowPath()).daily().at(5, 00)

    try app.queues.startScheduledJobs()
  }
}
