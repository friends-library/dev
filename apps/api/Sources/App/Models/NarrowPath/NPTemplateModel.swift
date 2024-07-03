import Foundation

struct NPEmail {
  var lang: Lang
  var date: Date
  var htmlQuote: String
  var textQuote: String
  var document: (name: String, url: String)?
  var authorName: String
  var authorUrl: String?
}

extension NPEmail {
  var postmarkModel: [String: String] {
    [
      "subject": subject,
      "html_quote": htmlQuote,
      "text_quote": textQuote,
      "html_cite": htmlCite,
      "text_cite": textCite,
      "date": dateString,
      "website_name": websiteName,
      "footer_blurb": footerBlurb,
    ]
  }

  private var textCite: String {
    switch (authorUrl, document) {
    case (nil, nil):
      return "— \(authorName)"
    case (_, .some(let (docName, docUrl))):
      return "— \(authorName), \(docName)\n\n\(docUrl)"
    case (.some(let friendUrl), nil):
      return "— \(authorName)\n\n\(friendUrl)"
    }
  }

  private var subject: String {
    switch lang {
    case .en:
      return "The Narrow Path"
    case .es:
      return "El Camino Estrecho"
    }
  }

  private var htmlCite: String {
    var cite = "&mdash;\(authorName)"
    if let authorUrl {
      cite = "<a href=\"\(authorUrl)\">\(cite)</a>"
    }
    if let (docName, docUrl) = document {
      cite += "\n<br />\n<a href=\"\(docUrl)\">\(docName)</a>"
    }
    return cite
  }

  private var websiteName: String {
    switch lang {
    case .en:
      return "Friends Library"
    case .es:
      return "Biblioteca de los Amigos"
    }
  }

  private var footerBlurb: String {
    switch lang {
    case .en:
      return "Find free ebooks, audiobooks and more from early Quakers at <a href=\"https://www.friendslibrary.com\">www.friendslibrary.com</a>."
    case .es:
      // TODO: real translation, no offense copilot
      return "Encuentra libros electrónicos, audiolibros y más de los primeros Cuáqueros en <a href=\"https://www.bibliotecadelosamigos.org\">www.bibliotecadelosamigos.org</a>."
    }
  }

  private var dateString: String {
    let formatter = DateFormatter()
    formatter.locale = lang.locale
    if lang == .es {
      formatter.setLocalizedDateFormatFromTemplate("d 'de' MMMM")
    } else {
      formatter.setLocalizedDateFormatFromTemplate("MMMM d")
    }
    return formatter.string(from: date)
  }
}
