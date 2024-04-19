import DuetSQL
import PairQL

struct AllDocumentPages: Pair {
  static let auth: Scope = .queryEntities
  typealias Input = Lang
  typealias Output = [String: DocumentPage.Output]
}

extension AllDocumentPages: Resolver {
  static func resolve(with lang: Lang, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    // let documents = try await JoinedEntities.shared.documents()

    fatalError("mega query")
    // async let allDocuments = Document.query().all()

    // let langDocuments = try await allDocuments
    //   .filter(\.hasNonDraftEdition)
    //   .filter { $0.lang == lang }

    // let downloads = try await Current.db.customQuery(
    //   AllDocumentDownloads.self,
    //   withBindings: [.enum(lang), .null]
    // )

    // return try langDocuments.reduce(into: [:]) { result, document in
    //   result[document.urlPath] = try DocumentPage.Output(
    //     document,
    //     downloads: downloads.urlPathDict,
    //     numTotalBooks: langDocuments.count,
    //     in: context
    //   )
    // }
  }
}

struct AllDocumentDownloads: CustomQueryable {
  static func query(numBindings: Int) -> String {
    """
    SELECT
      \(Document.tableName).\(Document.columnName(.slug)) AS document_slug,
      \(Friend.tableName).\(Friend.columnName(.slug)) AS friend_slug,
      COUNT(*) AS total
    FROM \(Download.tableName)
    JOIN \(Edition.tableName)
      ON \(Download.tableName).\(Download.columnName(.editionId)) = \(Edition.tableName).id
    JOIN \(Document.tableName)
      ON \(Edition.tableName).\(Edition.columnName(.documentId)) = \(Document.tableName).id
    JOIN \(Friend.tableName)
      ON \(Document.tableName).\(Document.columnName(.friendId)) = \(Friend.tableName).id
    WHERE
      \(Friend.tableName).\(Friend.columnName(.lang)) = $1
      AND ($2::UUID IS NULL OR \(Friend.tableName).id = $2::UUID)
    GROUP BY
      \(Document.tableName).\(Document.columnName(.slug)),
      \(Friend.tableName).\(Friend.columnName(.slug))
    """
  }

  var friendSlug: String
  var documentSlug: String
  var total: Int
}

extension Array where Element == AllDocumentDownloads {
  var urlPathDict: [String: Int] {
    reduce(into: [:]) { result, download in
      result["\(download.friendSlug)/\(download.documentSlug)"] = download.total
    }
  }
}
