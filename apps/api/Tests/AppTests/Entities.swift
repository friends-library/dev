import Duet

@testable import App

struct Entities {
  struct Unjoined {
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
  }

  var friend: JoinedFriend
  var friendResidence: JoinedFriendResidence
  var friendResidenceDuration: FriendResidenceDuration
  var friendQuote: FriendQuote
  var document: JoinedDocument
  var documentTag: DocumentTag
  var edition: Edition
  var editionChapter: EditionChapter
  var editionImpression: JoinedEditionImpression
  var isbn: Isbn
  var audio: JoinedAudio
  var audioPart: JoinedAudioPart

  static func create(
    beforePersist: (inout Entities.Unjoined) -> Void = { _ in }
  ) async -> Entities {
    let friend: Friend = .valid

    var friendResidence: FriendResidence = .random
    friendResidence.friendId = friend.id

    var friendResidenceDuration: FriendResidenceDuration = .valid
    friendResidenceDuration.friendResidenceId = friendResidence.id

    var friendQuote: FriendQuote = .valid
    friendQuote.friendId = friend.id

    var document: Document = .valid
    document.altLanguageId = nil
    document.friendId = friend.id

    var documentTag: DocumentTag = .random
    documentTag.documentId = document.id

    var edition: Edition = .valid
    edition.documentId = document.id

    var editionChapter: EditionChapter = .valid
    editionChapter.editionId = edition.id

    var editionImpression: EditionImpression? = .valid
    editionImpression!.editionId = edition.id

    var isbn: Isbn? = .random
    isbn!.editionId = edition.id

    var audio: Audio? = .valid
    audio!.editionId = edition.id

    var audioPart: AudioPart = .valid
    audioPart.audioId = audio!.id
    audioPart.order = 1

    var entities = Unjoined(
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

    _ = try! await Current.db.create(entities.friend)
    _ = try! await Current.db.create(entities.friendQuote)
    _ = try! await Current.db.create(entities.friendResidence)
    _ = try! await Current.db.create(entities.friendResidenceDuration)
    _ = try! await Current.db.create(entities.document)
    _ = try! await Current.db.create(entities.documentTag)
    _ = try! await Current.db.create(entities.edition)
    _ = try! await Current.db.create(entities.editionChapter)
    _ = try! await Current.db.create(entities.editionImpression)
    _ = try! await Current.db.create(entities.isbn)
    _ = try! await Current.db.create(entities.audio)
    _ = try! await Current.db.create(entities.audioPart)

    return entities.join()
  }
}

extension Entities.Unjoined {
  func join() -> Entities {
    let friendResidence = JoinedFriendResidence(
      friendResidence,
      durations: [friendResidenceDuration]
    )

    let friend = JoinedFriend(
      friend,
      residences: [friendResidence],
      quotes: [friendQuote]
    )

    let document = JoinedDocument(
      document,
      friend: friend,
      tags: [documentTag.type]
    )
    friend.documents.append(document)

    let edition = JoinedEdition(
      edition,
      document: document,
      chapters: [editionChapter],
      isbn: isbn
    )
    document.editions.append(edition)

    let impression = JoinedEditionImpression(editionImpression, edition: edition)
    edition.impression = impression

    let audio = JoinedAudio(audio, edition: edition)
    let audioPart = JoinedAudioPart(audioPart, audio: audio)
    audio.parts.append(audioPart)
    edition.audio = audio

    return Entities(
      friend: friend,
      friendResidence: friendResidence,
      friendResidenceDuration: friendResidenceDuration,
      friendQuote: friendQuote,
      document: document,
      documentTag: documentTag,
      edition: self.edition,
      editionChapter: editionChapter,
      editionImpression: impression,
      isbn: isbn,
      audio: audio,
      audioPart: audioPart
    )
  }
}
