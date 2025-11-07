import Logging

public extension Logger {
  static let null = Logger(label: "(null)", factory: { _ in NullHandler() })

  static func passthrough(
    _ receiver: @escaping @Sendable (Logger.Level, Logger.Message) -> Void,
  ) -> Logger {
    Logger(label: "(passthrough)", factory: { _ in PassthroughHandler(receive: receiver) })
  }
}

private struct PassthroughHandler: LogHandler, Sendable {
  var receive: @Sendable (Logger.Level, Logger.Message) -> Void = { _, _ in }

  func log(
    level: Logger.Level,
    message: Logger.Message,
    metadata: Logger.Metadata?,
    source: String,
    file: String,
    function: String,
    line: UInt,
  ) {
    self.receive(level, message)
  }

  subscript(metadataKey _: String) -> Logger.Metadata.Value? {
    get { nil }
    set {}
  }

  var metadata: Logger.Metadata {
    get { [:] }
    set {}
  }

  var logLevel: Logger.Level {
    get { .trace }
    set {}
  }
}

private struct NullHandler: LogHandler {

  func log(
    level: Logger.Level,
    message: Logger.Message,
    metadata: Logger.Metadata?,
    source: String,
    file: String,
    function: String,
    line: UInt,
  ) {}

  subscript(metadataKey _: String) -> Logger.Metadata.Value? {
    get { nil }
    set {}
  }

  var metadata: Logger.Metadata {
    get { [:] }
    set {}
  }

  var logLevel: Logger.Level {
    get { .trace }
    set {}
  }
}
