import Foundation
import Testing

@testable import TypeScriptInterop

@Suite struct CodeGenTests {
  @Test func `generic enum`() throws {
    enum RequestState<T, E> {
      case idle
      case loading
      case succeeded(T)
      case failed(E)
    }
    struct Wrap {
      var req: RequestState<Bool, String>
    }
    #expect(
      try CodeGen().declaration(for: Wrap.self) ==
        """
        export interface Wrap {
          req: {
            case: 'succeeded';
            succeeded: boolean;
          } | {
            case: 'failed';
            failed: string;
          } | {
            case: 'idle';
          } | {
            case: 'loading';
          };
        }
        """,
    )
  }

  @Test func `root aliases`() throws {
    struct Foo { var bar: Int }
    let codegen = CodeGen(config: .init(aliasing: [.init(Foo.self)]))
    #expect(
      try codegen.declaration(for: Foo.self, as: "Input") ==
        """
        export type Input = Foo
        """,
    )
  }

  @Test func `foundation types`() throws {
    struct FoundationTypes {
      var date: Date
      var uuid: UUID
    }
    #expect(
      try CodeGen().declaration(for: FoundationTypes.self) ==
        """
        export interface FoundationTypes {
          date: Date;
          uuid: UUID;
        }
        """,
    )

    let config = Config(aliasing: [
      .init(Date.self, as: "IsoDateString"),
      .init(UUID.self, as: "string"),
    ])

    #expect(
      try CodeGen(config: config).declaration(for: FoundationTypes.self)
        == """
        export interface FoundationTypes {
          date: IsoDateString;
          uuid: string;
        }
        """,
    )

    #expect(
      try CodeGen(config: config).declaration(for: Date.self)
        == "export type Date = IsoDateString",
    )

    #expect(
      try CodeGen(config: config).declaration(for: UUID.self)
        == "export type UUID = string",
    )
  }

  @Test func screen() throws {
    enum Screen {
      struct Connected {
        var foo: String
      }

      case notConnected
      case connected(Connected)
    }

    #expect(
      try CodeGen().declaration(for: Screen.self) ==
        """
        export type Screen = {
          case: 'connected';
          foo: string;
        } | {
          case: 'notConnected';
        }
        """,
    )
  }

  @Test func `enum with named associated values`() throws {
    enum Bar {
      case a
      case b(foo: String, bar: Int)
      case c(String)
    }

    struct Foo {
      var bar: Bar
    }

    #expect(
      try CodeGen().declaration(for: Foo.self) ==
        """
        export interface Foo {
          bar: {
            case: 'b';
            foo: string;
            bar: number;
          } | {
            case: 'c';
            c: string;
          } | {
            case: 'a';
          };
        }
        """,
    )
  }

  @Test func dictionaries() throws {
    struct Bar {
      var lol: Int
      var rofl: Bool?
    }
    struct Foo {
      var dict: [String: Int]
      var complexDict: [String: Bar]?
    }

    #expect(
      try CodeGen().declaration(for: Foo.self) ==
        """
        export interface Foo {
          dict: { [key: string]: number };
          complexDict?: { [key: string]: {
            lol: number;
            rofl?: boolean;
          } };
        }
        """,
    )
  }

  @Test func `kitchen sink`() throws {
    struct Foo {
      enum Bar {
        case a, b
      }

      struct Tiny {
        var a: String
      }

      struct Nested {
        let a: String
        let b: Int
        let reallyLongPropertyName: Int
      }

      enum Value {
        case string(String)
        case optInt(Int?)
        case named(a: Int, b: String)
        case bare
      }

      let foo: String
      var value: Value
      var inline: Tiny
      var tinyArray: [Tiny]
      var baz: Int?
      var bar: Bar
      let rofl: [String]?
      var nested: Nested
    }

    #expect(
      try CodeGen(config: .init(letsReadOnly: true)).declaration(for: Foo.self) ==
        """
        export interface Foo {
          readonly foo: string;
          value: {
            case: 'string';
            string: string;
          } | {
            case: 'optInt';
            optInt?: number;
          } | {
            case: 'named';
            a: number;
            b: string;
          } | {
            case: 'bare';
          };
          inline: {
            a: string;
          };
          tinyArray: Array<{
            a: string;
          }>;
          baz?: number;
          bar: 'a' | 'b';
          readonly rofl?: string[];
          nested: {
            readonly a: string;
            readonly b: number;
            readonly reallyLongPropertyName: number;
          };
        }
        """,
    )
  }

  @Test func `aliased arrays`() throws {
    struct Foo {
      var a: [Wrapped<Int>]
      var b: Wrapped<Int>
    }
    let expanded = try CodeGen(config: .init(compact: false)).declaration(for: Foo.self)
    let compact = try CodeGen(config: .init(compact: true)).declaration(for: Foo.self)

    #expect(
      expanded ==
        """
        export interface Foo {
          a: Wrapped[];
          b: Wrapped;
        }
        """,
    )

    #expect(
      compact ==
        """
        export interface Foo { a: Wrapped[]; b: Wrapped; }
        """,
    )
  }

  @Test func `inlining struct decls and max line len`() throws {
    struct Tiny {
      var a: String
      var b: Int
    }

    struct Foo {
      var inline: Tiny
    }

    let normal = try CodeGen(config: .init(compact: false)).declaration(for: Foo.self)
    #expect(
      normal ==
        """
        export interface Foo {
          inline: {
            a: string;
            b: number;
          };
        }
        """,
    )

    let alias = try CodeGen(config: .init(aliasing: [.init(Tiny.self)]))
      .declaration(for: Foo.self)

    #expect(
      alias ==
        """
        export interface Foo {
          inline: Tiny;
        }
        """,
    )

    let alias2 = try CodeGen(config: .init(aliasing: [.init(Tiny.self, as: "TinyStruct")]))
      .declaration(for: Foo.self)

    #expect(
      alias2 ==
        """
        export interface Foo {
          inline: TinyStruct;
        }
        """,
    )

    let compact = try CodeGen(config: .init(compact: true)).declaration(for: Foo.self)
    #expect(
      compact ==
        """
        export interface Foo { inline: { a: string; b: number; }; }
        """,
    )
  }

  // TODO: unprepresentable tuple should throw: (String?, Int)
}

struct Wrapped<T> {
  var value: T
}

extension Wrapped: TypeScriptAliased {
  static var typescriptAlias: String { "Wrapped" }
}
