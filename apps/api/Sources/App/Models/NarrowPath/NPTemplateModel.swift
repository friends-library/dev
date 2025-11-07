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
      from: self.fromAddress,
      templateAlias: "narrow-path",
      templateModel: self.postmarkModel,
      messageStream: "narrow-path-\(self.lang)",
    )
  }

  var postmarkModel: [String: String] {
    [
      "subject": self.subject,
      "html_quote": self.htmlQuote,
      "text_quote": self.textQuote,
      "html_cite": self.htmlCite,
      "text_cite": self.textCite,
      "date": self.dateString,
      "website_name": self.websiteName,
      "html_footer_blurb": self.htmlFooterBlurb,
      "text_footer_blurb": self.textFooterBlurb,
      "lang": self.lang.rawValue,
      "unsubscribe_text": self.unsubscribe,
    ]
  }

  private var fromAddress: String {
    switch self.lang {
    case .en:
      "narrow-path@friendslibrary.com"
    case .es:
      "camino-estrecho@bibliotecadelosamigos.org"
    }
  }

  private var textCite: String {
    switch (self.authorUrl, self.document) {
    case (nil, nil):
      "- \(self.authorName)"
    case (_, .some(let doc)):
      "- \(self.authorName), \(doc.textName)\n\n\(doc.url)"
    case (.some(let friendUrl), nil):
      "- \(self.authorName)\n\n\(friendUrl)"
    }
  }

  private var subject: String {
    switch self.lang {
    case .en:
      "The Narrow Path"
    case .es:
      "El Camino Estrecho"
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
    switch self.lang {
    case .en:
      "Friends Library"
    case .es:
      "Biblioteca de los Amigos"
    }
  }

  private var htmlFooterBlurb: String {
    switch self.lang {
    case .en:
      "Find free ebooks, audiobooks and more from early Quakers at <a href=\"https://www.friendslibrary.com\">www.friendslibrary.com</a>."
    case .es:
      "Puedes encontrar libros electrónicos y audiolibros gratuitos de los primeros Cuáqueros en <a href=\"https://www.bibliotecadelosamigos.org\">www.bibliotecadelosamigos.org</a>."
    }
  }

  private var textFooterBlurb: String {
    switch self.lang {
    case .en:
      "Find free ebooks, audiobooks and more from early Quakers at https://friendslibrary.com"
    case .es:
      "Puedes encontrar libros electrónicos y audiolibros gratuitos de los primeros Cuáqueros en https://bibliotecadelosamigos.org"
    }
  }

  private var dateString: String {
    let formatter = DateFormatter()
    formatter.locale = self.lang.locale
    if self.lang == .es {
      formatter.setLocalizedDateFormatFromTemplate("d 'de' MMMM")
    } else {
      formatter.setLocalizedDateFormatFromTemplate("MMMM d")
    }
    return formatter.string(from: self.date)
  }

  private var unsubscribe: String {
    switch self.lang {
    case .en:
      "Unsubscribe"
    case .es:
      "Cancelar suscripción"
    }
  }
}
