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
    try context.verify(Self.auth)
    let editions = try await Edition.query()
      .where(.isDraft == false)
      .all()
    return try await editions.concurrentMap { edition -> OrderEdition? in
      guard let impression = try await edition.impression() else {
        return nil
      }
      let document = try await edition.document()
      let friend = try await document.friend()
      return .init(
        id: edition.id,
        type: edition.type,
        title: document.title,
        shortTitle: Asciidoc.trimmedUtf8ShortDocumentTitle(document.title, lang: friend.lang),
        author: friend.name,
        lang: friend.lang,
        priceInCents: impression.paperbackPrice,
        paperbackSize: impression.paperbackSize,
        paperbackVolumes: impression.paperbackVolumes,
        smallImgUrl: "TODO", // edition.images.threeD.w55.url.absoluteString,
        largeImgUrl: "TODO" // edition.images.threeD.w110.url.absoluteString
      )
    }.compactMap { $0 }
  }
}
