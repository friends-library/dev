extension NPQuote {
  func email() async throws -> NPEmail {
    var email = NPEmail(
      lang: lang,
      date: Current.date(),
      htmlQuote: htmlQuote,
      textQuote: textQuote,
      authorName: authorName ?? "",
      authorUrl: nil
    )

    if let friendId {
      let friend = try await Friend.Joined.find(friendId)
      email.authorName = friend.name
      email.authorUrl = "\(lang.website)/\(friend.urlPath)"
    }

    if let documentId {
      let document = try await Document.Joined.find(documentId)
      email.document = (
        name: document.title,
        url: "\(lang.website)/\(document.urlPath)"
      )
    }

    return email
  }

  private var htmlQuote: String {
    var html = ""
    var numUnderscores = 0
    for char in quote {
      if char == "_", numUnderscores % 2 == 0 {
        html += "<em>"
        numUnderscores += 1
      } else if char == "_", numUnderscores % 2 != 0 {
        html += "</em>"
        numUnderscores += 1
      } else if char == "\n" {
        html += "</p><p>"
      } else {
        html += String(char)
      }
    }
    return "<p>\(html)</p>"
  }

  private var textQuote: String {
    quote
      .replacingOccurrences(of: "_", with: "")
      .replacingOccurrences(of: "\n", with: "\n\n")
  }
}