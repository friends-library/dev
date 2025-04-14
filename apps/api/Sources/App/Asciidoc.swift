import RomanNumeralKit

enum HtmlEntities {
  enum Numbered: String {
    case leftDoubleQuote = "&#8220;"
    case rightDoubleQuote = "&#8221;"
    case leftSingleQuote = "&#8216;"
    case rightSingleQuote = "&#8217;"
    case mdash = "&#8212;"
    case ampersand = "&#38;"
    case ellipses = "&#8230;"
    case nonBreakingSpace = "&#160;"
  }

  enum Named: String {
    case leftDoubleQuote = "&ldquo;"
    case rightDoubleQuote = "&rdquo;"
    case leftSingleQuote = "&lsquo;"
    case rightSingleQuote = "&rsquo;"
    case mdash = "&mdash;"
    case ampersand = "&amp;"
    case ellipses = "&hellip;"
    case nonBreakingSpace = "&nbsp;"
  }
}

enum Asciidoc {
  static func trimmedUtf8ShortDocumentTitle(_ title: String, lang: Lang) -> String {
    if lang == .en {
      return
        self.utf8ShortTitle(title)
          .replacingOccurrences(
            of: #"^(The|A) "#,
            with: "",
            options: .regularExpression
          )
          .replacingOccurrences(
            of: #"^Selection from the (.*)"#,
            with: "$1 (Selection)",
            options: .regularExpression
          )
    }

    let shortTitle = self.utf8ShortTitle(title)
    if shortTitle.count < 25 { return shortTitle }

    return
      shortTitle
        .replacingOccurrences(
          of: #"^Selección de(l| la) (.*)"#,
          with: "$2 (Selección)",
          options: .regularExpression
        )
        .replacingOccurrences(
          of: #"^(El|La|Los|Una?) (?!(Camino|Verdad|Vida)\b)"#,
          with: "",
          options: .regularExpression
        )
        .replacingOccurrences(
          of: #"^Vida "#,
          with: "La Vida ",
          options: .regularExpression
        )
  }

  static func utf8ShortTitle(_ title: String) -> String {
    self.htmlShortTitle(title)
      .replacingOccurrences(of: HtmlEntities.Named.mdash.rawValue, with: "–")
      .replacingOccurrences(of: HtmlEntities.Numbered.mdash.rawValue, with: "–")
      .replacingOccurrences(of: HtmlEntities.Named.nonBreakingSpace.rawValue, with: " ")
      .replacingOccurrences(of: HtmlEntities.Numbered.nonBreakingSpace.rawValue, with: " ")
      .replacingOccurrences(of: HtmlEntities.Named.leftDoubleQuote.rawValue, with: "“")
      .replacingOccurrences(of: HtmlEntities.Numbered.leftDoubleQuote.rawValue, with: "“")
      .replacingOccurrences(of: HtmlEntities.Named.rightDoubleQuote.rawValue, with: "”")
      .replacingOccurrences(of: HtmlEntities.Numbered.rightDoubleQuote.rawValue, with: "”")
      .replacingOccurrences(of: HtmlEntities.Named.leftSingleQuote.rawValue, with: "‘")
      .replacingOccurrences(of: HtmlEntities.Numbered.leftSingleQuote.rawValue, with: "‘")
      .replacingOccurrences(of: HtmlEntities.Named.rightSingleQuote.rawValue, with: "’")
      .replacingOccurrences(of: HtmlEntities.Numbered.rightSingleQuote.rawValue, with: "’")
  }

  static func htmlShortTitle(_ title: String) -> String {
    Asciidoc.htmlTitle(title)
      .replacingOccurrences(
        of: #"\bvolumen?\b "#,
        with: "Vol.\(HtmlEntities.Numbered.nonBreakingSpace.rawValue)",
        options: [.regularExpression, .caseInsensitive]
      )
  }

  static func htmlTitle(_ title: String) -> String {
    var shortened = ""
    var number: String?

    // lol swift regexes... maybe look into https://github.com/crossroadlabs/Regex
    for (index, char) in title.enumerated() {
      let nextIndex = title.index(title.startIndex, offsetBy: index + 1)
      let nextChar: Character? = title.indices.contains(nextIndex) ? title[nextIndex] : nil
      switch (char.isNumber, number == nil, index == title.count - 1) {
      case (true, true, false):
        number = "\(char)"
      case (true, false, false):
        number! += "\(char)"
      case (true, true, true):
        shortened += toRoman("\(char)", nextChar)
      case (false, true, _):
        shortened += "\(char)"
      case (false, false, _):
        shortened += toRoman(number, nextChar) + "\(char)"
        number = nil
      case (true, false, true):
        number! += "\(char)"
        shortened += toRoman(number, nextChar)
        number = nil
      }
    }
    return shortened.replacingOccurrences(of: "--", with: HtmlEntities.Numbered.mdash.rawValue)
  }
}

private func toRoman(_ string: String?, _ nextChar: Character?) -> String {
  guard let string else { return "" }
  if let int = Int(string),
     int < 1000, int != 160 || nextChar != ";",
     let rn = try? RomanNumeral(from: int) {
    return rn.stringValue
  }
  return string
}
