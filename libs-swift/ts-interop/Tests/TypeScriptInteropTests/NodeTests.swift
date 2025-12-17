import Testing

@testable import TypeScriptInterop

@Suite struct NodeTests {

  @Test func `parse node primitive`() throws {
    #expect(try Node(from: String.self) == .primitive(.string))
    #expect(try Node(from: Int.self) == .primitive(.number(.int)))
    #expect(try Node(from: Bool.self) == .primitive(.boolean))
  }

  @Test func `parse array`() throws {
    #expect(try Node(from: [String].self) == .array(.primitive(.string), .string))
    #expect(try Node(from: [Int].self) == .array(.primitive(.number(.int)), .int))
    #expect(try Node(from: [Bool].self) == .array(.primitive(.boolean), .bool))
    #expect(
      try Node(from: [[Bool]].self)
        == .array(.array(.primitive(.boolean), .bool), .init([Bool].self)),
    )

    struct Foo { var bar: Int }
    #expect(try Node(from: [Foo].self) == .array(.object([
      .init(name: "bar", value: .primitive(.number(.int))),
    ], .init(Foo.self)), .init(Foo.self)))
  }

  @Test func `parse dictionary`() throws {
    #expect(try Node(from: [String: String].self) == .record(.primitive(.string)))
    #expect(try Node(from: [String: Int].self) == .record(.primitive(.number(.int))))

    struct Foo { var bar: Int }
    #expect(try Node(from: [String: Foo].self) == .record(.object([
      .init(name: "bar", value: .primitive(.number(.int))),
    ], .init(Foo.self))))

    #expect(throws: (any Error).self) {
      try Node(from: [Int: String].self)
    }
  }

  @Test func `enum with multiple unnamed values throws`() throws {
    enum NotGoodForTs {
      case a
      case b(Int, Int)
    }

    #expect(throws: (any Error).self) {
      try Node(from: NotGoodForTs.self)
    }
  }

  @Test func `unrepresentable tuple throws`() throws {
    #expect(throws: (any Error).self) {
      try Node(from: (Int?, String).self)
    }
  }

  @Test func `parse simple enum`() throws {
    enum Foo {
      case bar
      case baz
    }
    #expect(try Node(from: Foo.self) == .stringUnion(["bar", "baz"], .init(Foo.self)))
  }

  @Test func `flattens enum case with single struct payload`() throws {
    enum Screen {
      struct Connected {
        var flat: String
      }

      case connected(Connected)
      case notConnected
    }
    #expect(try Node(from: Screen.self) == .objectUnion([
      .init(
        caseName: "connected",
        associatedValues: [
          .init(name: "flat", value: .primitive(.string)),
        ],
      ),
      .init(caseName: "notConnected"),
    ], .init(Screen.self)))
  }

  @Test func `parse enum with payload`() throws {
    enum Foo {
      case bar(String)
      case baz(Int?)
      case foo(lol: Bool)
      case named(a: Bool, b: String?)
      case jim
    }
    #expect(try Node(from: Foo.self) == .objectUnion([
      .init(
        caseName: "bar",
        associatedValues: [.init(name: "bar", value: .primitive(.string))],
      ),
      .init(
        caseName: "baz",
        associatedValues: [.init(name: "baz", value: .primitive(.number(.int)), optional: true)],
      ),
      .init(
        caseName: "foo",
        associatedValues: [.init(name: "lol", value: .primitive(.boolean))],
      ),
      .init(
        caseName: "named",
        associatedValues: [
          .init(name: "a", value: .primitive(.boolean)),
          .init(name: "b", value: .primitive(.string), optional: true),
        ],
      ),
      .init(caseName: "jim"),
    ], .init(Foo.self)))
  }

  @Test func `parse struct`() throws {
    struct Foo {
      var bar: String
      let baz: Int
      var jim: Bool?
      var void: Void
      var never: Never
    }
    #expect(try Node(from: Foo.self) == .object([
      .init(name: "bar", value: .primitive(.string), optional: false, readonly: false),
      .init(name: "baz", value: .primitive(.number(.int)), optional: false, readonly: true),
      .init(name: "jim", value: .primitive(.boolean), optional: true, readonly: false),
      .init(name: "void", value: .primitive(.void)),
      .init(name: "never", value: .primitive(.never)),
    ], .init(Foo.self)))
  }
}
