import Testing

@testable import App

@Suite struct AsciidocTests {

  @Test func `non-entity 160 roman numeraled`() {
    #expect(
      Asciidoc.htmlShortTitle("Epistles 133 &#8212; 160")
        == "Epistles CXXXIII &#8212; CLX",
    )
  }

  @Test func `html title turns double dash into emdash entity`() {
    #expect(Asciidoc.htmlTitle("Foo -- bar") == "Foo &#8212; bar")
  }

  @Test func `html title changes trailing digits into roman numerals`() {
    #expect(Asciidoc.htmlTitle("Foo 3") == "Foo III")
  }

  @Test func `html title does not change years to roman`() {
    #expect(
      Asciidoc.htmlTitle("Chapter 9. Letters from 1818--1820")
        == "Chapter IX. Letters from 1818&#8212;1820",
    )
  }

  @Test func `html short title shortens volume to vol`() {
    #expect(
      Asciidoc.htmlShortTitle("Foo -- Volume 1")
        == "Foo &#8212; Vol.&#160;I",
    )
  }

  @Test func `html short title shortens spanish volume to vol`() {
    #expect(
      Asciidoc.htmlShortTitle("Foo -- volumen 4")
        == "Foo &#8212; Vol.&#160;IV",
    )
  }

  @Test func `utf8 short title shortens correctly`() {
    #expect(
      Asciidoc.utf8ShortTitle("Chapter 9. Letters from 1818--1820")
        == "Chapter IX. Letters from 1818–1820",
    )
  }

  @Test func `trimmed utf8 short document title`() {
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
      #expect(Asciidoc.trimmedUtf8ShortDocumentTitle(input, lang: lang) == expected)
    }
  }
}
