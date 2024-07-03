extension NPQuote {
  func email() async throws -> NPEmail {
    var email = NPEmail(
      lang: lang,
      date: Current.date(),
      htmlQuote: "",
      textQuote: "",
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
      email.document = (name: document.title, url: "\(lang.website)/\(document.urlPath)")
    }
    return email
  }
}
