import XCTest

@testable import App

final class AsciidocTests: XCTestCase {

  func testNonEntity160RomanNumeraled() {
    XCTAssertEqual(
      Asciidoc.htmlShortTitle("Epistles 133 &#8212; 160"),
      "Epistles CXXXIII &#8212; CLX",
    )
  }

  func testHtmlTitleTurnsDoubleDashIntoEmdashEntity() throws {
    XCTAssertEqual(Asciidoc.htmlTitle("Foo -- bar"), "Foo &#8212; bar")
  }

  func testHtmlTitleChangesTrailingDigitsIntoRomanNumerals() throws {
    XCTAssertEqual(Asciidoc.htmlTitle("Foo 3"), "Foo III")
  }

  func testHtmlTitleDoesNotChangeYearsToRoman() throws {
    XCTAssertEqual(
      Asciidoc.htmlTitle("Chapter 9. Letters from 1818--1820"),
      "Chapter IX. Letters from 1818&#8212;1820",
    )
  }

  func testHtmlShortTitleShortensVolumeToVol() throws {
    XCTAssertEqual(
      Asciidoc.htmlShortTitle("Foo -- Volume 1"),
      "Foo &#8212; Vol.&#160;I",
    )
  }

  func testHtmlShortTitleShortensSpanishVolumeToVol() throws {
    XCTAssertEqual(
      Asciidoc.htmlShortTitle("Foo -- volumen 4"),
      "Foo &#8212; Vol.&#160;IV",
    )
  }

  func testUtf8ShortTitleShortensCorrectly() throws {
    XCTAssertEqual(
      Asciidoc.utf8ShortTitle("Chapter 9. Letters from 1818--1820"),
      "Chapter IX. Letters from 1818–1820",
    )
  }

  func testTrimmedUtf8ShortDocumentTitle() throws {
    let cases: [(String, Lang, String)] = [
      ("The Foobar", .en, "Foobar"),
      ("A Foobar", .en, "Foobar"),
      ("Selection from the Foobar", .en, "Foobar (Selection)"),
      ("Selección del Foobar7890123456789012345", .es, "Foobar7890123456789012345 (Selección)"),
      ("Selección de la Foobar7890123456789012345", .es, "Foobar7890123456789012345 (Selección)"),
      ("El Foobar7890123456789012345", .es, "Foobar7890123456789012345"),
      ("El Camino Foobar7890123456789012345", .es, "El Camino Foobar7890123456789012345"),
      ("La Vida Foobar7890123456789012345", .es, "La Vida Foobar7890123456789012345"),
      ("Selección de la Vida de John Crook", .es, "La Vida de John Crook (Selección)"),
    ]

    for (input, lang, expected) in cases {
      XCTAssertEqual(Asciidoc.trimmedUtf8ShortDocumentTitle(input, lang: lang), expected)
    }
  }
}
