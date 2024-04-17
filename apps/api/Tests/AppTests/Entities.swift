import Duet

@testable import App

struct Entities {
  var friend: Friend
  var friendResidence: FriendResidence
  var friendResidenceDuration: FriendResidenceDuration
  var friendQuote: FriendQuote
  var document: Document
  var documentTag: DocumentTag
  var edition: Edition
  var editionChapter: EditionChapter
  var editionImpression: EditionImpression
  var isbn: Isbn
  var audio: Audio
  var audioPart: AudioPart

  static func create(beforePersist: (inout Entities) -> Void = { _ in }) async -> Entities {
    let friend: Friend = .valid

    var friendResidence: FriendResidence = .random
    friendResidence.friendId = friend.id
    // // connect(&friend, \.residences, to: &friendResidence, \.friend)

    var friendResidenceDuration: FriendResidenceDuration = .valid
    friendResidenceDuration.friendResidenceId = friendResidence.id
    // // connect(&friendResidence, \.durations, to: &friendResidenceDuration, \.residence)

    var friendQuote: FriendQuote = .valid
    friendQuote.friendId = friend.id
    // connect(&friend, \.quotes, to: &friendQuote, \.friend)

    var document: Document = .valid
    document.altLanguageId = nil
    document.friendId = friend.id
    // connect(&friend, \.documents, to: &document, \.friend)

    var documentTag: DocumentTag = .random
    documentTag.documentId = document.id
    // connect(&document, \.tags, to: &documentTag, \.document)

    var edition: Edition = .valid
    edition.documentId = document.id
    // connect(&document, \.editions, to: &edition, \.document)

    var editionChapter: EditionChapter = .valid
    editionChapter.editionId = edition.id
    // connect(&edition, \.chapters, to: &editionChapter, \.edition)

    var editionImpression: EditionImpression? = .valid
    editionImpression!.editionId = edition.id
    // connect(&edition, \.impression, to: &editionImpression, \.edition)

    var isbn: Isbn? = .random
    isbn!.editionId = edition.id
    // connect(&edition, \.isbn, to: &isbn, \.edition)

    var audio: Audio? = .valid
    audio!.editionId = edition.id
    // connect(&edition, \.audio, to: &audio, \.edition)

    var audioPart: AudioPart = .valid
    audioPart.audioId = audio!.id
    audioPart.order = 1
    // connect(&audio!, \.parts, to: &audioPart, \.audio)

    var entities = Entities(
      friend: friend,
      friendResidence: friendResidence,
      friendResidenceDuration: friendResidenceDuration,
      friendQuote: friendQuote,
      document: document,
      documentTag: documentTag,
      edition: edition,
      editionChapter: editionChapter,
      editionImpression: editionImpression!,
      isbn: isbn!,
      audio: audio!,
      audioPart: audioPart
    )

    beforePersist(&entities)

    _ = try! await Current.db.create(friend)
    _ = try! await Current.db.create(friendQuote)
    _ = try! await Current.db.create(friendResidence)
    _ = try! await Current.db.create(friendResidenceDuration)
    _ = try! await Current.db.create(document)
    _ = try! await Current.db.create(documentTag)
    _ = try! await Current.db.create(edition)
    _ = try! await Current.db.create(editionChapter)
    _ = try! await Current.db.create(editionImpression!)
    _ = try! await Current.db.create(isbn!)
    _ = try! await Current.db.create(audio!)
    _ = try! await Current.db.create(audioPart)

    return entities
  }
}
