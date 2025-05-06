import DuetSQL
import NonEmpty
import PairQL
import TaggedMoney

struct OrderEditions: Pair {
  static let auth: Scope = .queryEntities

  struct OrderEdition: PairOutput {
    let id: Edition.Id
    let type: EditionType
    let title: String
    let shortTitle: String
    let author: String
    let lang: Lang
    let priceInCents: Cents<Int>
    let paperbackSize: PrintSize
    let paperbackVolumes: NonEmpty<[Int]>
    let smallImgUrl: String
    let largeImgUrl: String
  }

  typealias Output = [OrderEdition]
}

extension OrderEditions: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let editions = try await Edition.Joined.all()
      .filter { !$0.isDraft || $0.document.friend.name == "Gerhard Tersteegen" }

    return try await editions.concurrentMap { edition -> OrderEdition? in
      guard let impression = edition.impression else {
        return nil
      }
      return .init(
        id: edition.id,
        type: edition.type,
        title: edition.document.title,
        shortTitle: Asciidoc.trimmedUtf8ShortDocumentTitle(
          edition.document.title,
          lang: edition.document.friend.lang
        ),
        author: edition.document.friend.name,
        lang: edition.document.friend.lang,
        priceInCents: impression.paperbackPrice,
        paperbackSize: impression.paperbackSize,
        paperbackVolumes: impression.paperbackVolumes,
        smallImgUrl: edition.images.threeD.w55.url.absoluteString,
        largeImgUrl: edition.images.threeD.w110.url.absoluteString
      )
    }.compactMap(\.self)
  }
}
