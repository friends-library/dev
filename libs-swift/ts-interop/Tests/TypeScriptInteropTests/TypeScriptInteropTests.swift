import Testing

@testable import TypeScriptInteropCLI

@Suite struct TypeScriptInteropTests {
  @Test func example() throws {
    #expect(TypeScriptInterop().text == "Hello, World!")
  }
}
