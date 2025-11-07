import PairQL
import TypeScriptInterop
import Vapor

enum CodegenRoute: RouteHandler {
  struct Output: Content {
    struct Pair: Content {
      let decl: String
      let resultFetcher: String
      let unwrappedFetcher: String
      let fnNameCamel: String
      let fnNamePascal: String
    }

    var shared: [String: String]
    var pairs: [String: Pair]
  }

  @Sendable static func handler(_ request: Request) async throws -> Response {
    switch request.parameters.get("domain") {
    case "dev":
      return try await CodegenRoute.Dev.handler(request)
    case "admin":
      return try await CodegenRoute.Admin.handler(request)
    case "order":
      return try await CodegenRoute.Order.handler(request)
    case "evans":
      return try await CodegenRoute.Evans.handler(request)
    case "evans-build":
      return try await CodegenRoute.EvansBuild.handler(request)
    default:
      throw Abort(.notFound, reason: "invalid pairql domain")
    }
  }
}

// domains

extension CodegenRoute {
  enum Dev {}
  enum Order {}
  enum Admin {}
  enum Evans {}
  enum EvansBuild {}
}

// extensions

extension CodegenRoute.Output.Pair {
  init<P: Pair>(
    for type: P.Type,
    with config: Config,
  ) throws {
    let codegen = CodeGen(config: config)
    let name = "\(P.self)"
    var decl = try """
    export namespace \(name) {
      \(codegen.declaration(for: P.Input.self, as: "Input"))

      \(codegen.declaration(for: P.Output.self, as: "Output"))
    }
    """

    // pairs that are only typealiases get compacted more
    let pairLines = decl.split(separator: "\n")
    if pairLines.count == 4, pairLines.allSatisfy({ $0.count < 60 }) {
      decl = pairLines.joined(separator: "\n")
    }

    let fnNamePascal = "\(name)".regexReplace("_.*$", "")
    var fetchName = fnNamePascal
    let firstLetter = fetchName.removeFirst()
    let fnNameCamel = String(firstLetter).lowercased() + fetchName

    let resultFetcher = """
    __FN_NAME__(input: P.\(name).Input): Promise<Result<P.\(name).Output>> {
      return this.query<P.\(name).Output>(input, `\(P.name)`);
    }
    """

    let unwrappedFetcher = """
    async __FN_NAME__(input: P.\(name).Input): Promise<P.\(name).Output> {
      const result = await this.query<P.\(name).Output>(input, `\(P.name)`);
      return result.unwrap();
    }
    """
    self = .init(
      decl: decl,
      resultFetcher: resultFetcher,
      unwrappedFetcher: unwrappedFetcher,
      fnNameCamel: fnNameCamel,
      fnNamePascal: fnNamePascal,
    )
  }
}
