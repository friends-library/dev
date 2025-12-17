import Testing
import XCore

@Suite struct StringTests {
  @Test func `snake cased`() {
    #expect("fooBarBaz".snakeCased == "foo_bar_baz")
  }

  @Test func `shouty cased`() {
    #expect("fooBarBaz".shoutyCased == "FOO_BAR_BAZ")
  }

  @Test func `regex replace`() {
    #expect("foobar".regexReplace("^foo", "jim") == "jimbar")
  }

  @Test func `regex remove`() {
    #expect("foobar".regexRemove("^foo") == "bar")
  }

  @Test func `matches regex`() {
    #expect("foobar".matchesRegex("^foo") == true)
    #expect("foobar".matchesRegex("bar$") == true)
    #expect("foobar".matchesRegex("^bar") == false)
  }

  @Test func `pad left`() {
    #expect("foo".padLeft(toLength: 6, withPad: "_") == "___foo")
    #expect("foo".padLeft(toLength: 8, withPad: "*") == "*****foo")
  }
}
