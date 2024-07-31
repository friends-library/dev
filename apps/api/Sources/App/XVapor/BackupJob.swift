import Queues
import Vapor

public struct BackupJob: AsyncScheduledJob, Sendable {
  let dbName: String
  let pgDumpPath: String
  let excludeDataFromTables: [String]
  let handler: @Sendable (Data) async throws -> Void

  public init(
    dbName: String,
    pgDumpPath: String,
    excludeDataFromTables: [String] = [],
    handler: @Sendable @escaping (Data) async throws -> Void
  ) {
    self.dbName = dbName
    self.pgDumpPath = pgDumpPath
    self.excludeDataFromTables = excludeDataFromTables
    self.handler = handler
  }

  public func run(context: QueueContext) async throws {
    try await self.handler(self.backupFileData)
  }

  private var backupFileData: Data {
    let pgDump = Process()
    pgDump.executableURL = URL(fileURLWithPath: self.pgDumpPath)

    var arguments = [dbName, "-Z", "9"] // -Z 9 means full gzip compression
    for tableName in self.excludeDataFromTables {
      arguments += ["--exclude-table-data", tableName]
    }
    pgDump.arguments = arguments

    let outputPipe = Pipe()
    pgDump.standardOutput = outputPipe
    try? pgDump.run()
    return outputPipe.fileHandleForReading.readDataToEndOfFile()
  }
}

public extension BackupJob {
  static func filedate() -> String {
    Date().description
      .split(separator: "+")
      .dropLast()
      .joined(separator: "")
      .trimmingCharacters(in: .whitespaces)
      .replacingOccurrences(of: ":", with: "-")
      .replacingOccurrences(of: " ", with: "_")
  }
}
