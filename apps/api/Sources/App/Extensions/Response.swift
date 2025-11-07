import Vapor

extension Response {
  convenience init(_ error: PqlError) {
    self.init(
      status: .init(statusCode: error.statusCode),
      body: .init(data: (try? JSONEncoder().encode(error)) ?? .init()),
    )
  }

  convenience init(_ codegenOutput: CodegenRoute.Output) {
    self.init(
      status: .ok,
      body: .init(data: (try? JSONEncoder().encode(codegenOutput)) ?? .init()),
    )
  }
}
