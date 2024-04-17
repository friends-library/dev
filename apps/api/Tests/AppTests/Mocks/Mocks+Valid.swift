import Foundation

@testable import App

extension Friend {
  static var valid: Friend {
    var friend = Friend.empty
    friend.name = "George Fox"
    friend.slug = "george-fox-\(UUID().lowercased)"
    friend.born = 1620
    friend.died = 1693
    precondition(friend.isValid)
    return friend
  }
}

extension FriendQuote {
  static var valid: FriendQuote {
    var quote = FriendQuote.empty
    quote.source = "Bob Smith"
    quote.text = "So good"
    quote.order = 1
    precondition(quote.isValid)
    return quote
  }
}

extension FriendResidenceDuration {
  static var valid: FriendResidenceDuration {
    var duration = FriendResidenceDuration.empty
    duration.start = 1690
    duration.end = 1700
    precondition(duration.isValid)
    return duration
  }
}

extension Document {
  static var valid: Document {
    var document = Document.empty
    document.filename = "No_Cross_No_Crown_\(UUID())"
    document.title = "No Cross, No Crown \(Int.random)"
    document.slug = "no-cross-no-crown-\(UUID().lowercased)"
    document.published = nil
    precondition(document.isValid)
    return document
  }
}

extension Edition {
  static var valid: Edition {
    var edition = Edition.empty
    edition.type = .original
    edition.editor = nil
    precondition(edition.isValid)
    return edition
  }
}

extension EditionChapter {
  static var valid: EditionChapter {
    var chapter = EditionChapter.empty
    chapter.order = Int.random(in: 1 ... 300)
    chapter.shortHeading = "Chapter 1"
    chapter.sequenceNumber = 1
    precondition(chapter.isValid)
    return chapter
  }
}

extension EditionImpression {
  static var valid: EditionImpression {
    var impression = EditionImpression.empty
    impression.paperbackVolumes = .init(100)
    impression.adocLength = 10000
    impression.publishedRevision = "e6d5b8d007f2e459d4f1ae2237c6e92625e1a3ca"
    impression.productionToolchainRevision = "0db3f8aeffa47ba13760ca6de4fe01808cefb581"
    precondition(impression.isValid)
    return impression
  }
}

extension AudioPart {
  static var valid: AudioPart {
    var part = AudioPart.empty
    part.title = "Chapter 7"
    part.order = 7
    part.duration = 3704.5
    part.chapters = .init(4, 5)
    part.mp3SizeHq = 2_000_001
    part.mp3SizeLq = 1_000_001
    precondition(part.isValid)
    return part
  }
}

extension Audio {
  static var valid: Audio {
    var audio = Audio.empty
    audio.reader = "Bob Smith"
    audio.m4bSizeLq = 3_000_000
    audio.m4bSizeHq = 8_000_000
    audio.mp3ZipSizeLq = 2_000_000
    audio.mp3ZipSizeHq = 5_000_000
    precondition(audio.isValid)
    return audio
  }
}

extension Isbn {
  static var valid: Isbn {
    var isbn = Isbn.empty
    isbn.code = "978-1-64476-999-9"
    precondition(isbn.isValid)
    return isbn
  }
}
