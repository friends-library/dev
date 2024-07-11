import Foundation
import XPostmark

struct NPEmail: Equatable, Sendable {
  struct Document: Equatable {
    var htmlName: String
    var textName: String
    var url: String
  }

  var quoteId: NPQuote.Id
  var lang: Lang
  var date: Date
  var htmlQuote: String
  var textQuote: String
  var document: Document?
  var authorName: String
  var authorUrl: String?
}

extension NPEmail {
  func template(to recipient: String) -> TemplateEmail {
    .init(
      to: recipient,
      from: fromAddress,
      templateAlias: "narrow-path",
      templateModel: postmarkModel,
      messageStream: "narrow-path-\(lang)"
    )
  }

  var postmarkModel: [String: String] {
    [
      "subject": subject,
      "html_quote": htmlQuote,
      "text_quote": textQuote,
      "html_cite": htmlCite,
      "text_cite": textCite,
      "date": dateString,
      "website_name": websiteName,
      "html_footer_blurb": htmlFooterBlurb,
      "text_footer_blurb": textFooterBlurb,
      "lang": lang.rawValue,
      "unsubscribe_text": unsubscribe,
    ]
  }

  private var fromAddress: String {
    switch lang {
    case .en:
      return "narrow-path@friendslibrary.com"
    case .es:
      return "camino-estrecho@bibliotecadelosamigos.org"
    }
  }

  private var textCite: String {
    switch (authorUrl, document) {
    case (nil, nil):
      return "- \(authorName)"
    case (_, .some(let doc)):
      return "- \(authorName), \(doc.textName)\n\n\(doc.url)"
    case (.some(let friendUrl), nil):
      return "- \(authorName)\n\n\(friendUrl)"
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
    if let document {
      cite += "\n<br />\n<a class=\"doc\" href=\"\(document.url)\">\(document.htmlName)</a>"
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

  private var htmlFooterBlurb: String {
    switch lang {
    case .en:
      return "Find free ebooks, audiobooks and more from early Quakers at <a href=\"https://www.friendslibrary.com\">www.friendslibrary.com</a>."
    case .es:
      return "Puedes encontrar libros electrónicos y audiolibros gratuitos de los primeros Cuáqueros en <a href=\"https://www.bibliotecadelosamigos.org\">www.bibliotecadelosamigos.org</a>."
    }
  }

  private var textFooterBlurb: String {
    switch lang {
    case .en:
      return "Find free ebooks, audiobooks and more from early Quakers at https://friendslibrary.com"
    case .es:
      return "Puedes encontrar libros electrónicos y audiolibros gratuitos de los primeros Cuáqueros en https://bibliotecadelosamigos.org"
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

  private var unsubscribe: String {
    switch lang {
    case .en:
      return "Unsubscribe"
    case .es:
      return "Cancelar suscripción"
    }
  }
}
