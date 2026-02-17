import DuetSQL
import Fluent
import Foundation

struct CreateTags: AsyncMigration {
  private typealias M15 = DocumentTag.M15

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateTags UP")
    let tags = try await database.enum(M15.DocumentTagEnum.name)
      .case(M15.DocumentTagEnum.caseJournal)
      .case(M15.DocumentTagEnum.caseLetters)
      .case(M15.DocumentTagEnum.caseExhortation)
      .case(M15.DocumentTagEnum.caseDoctrinal)
      .case(M15.DocumentTagEnum.caseTreatise)
      .case(M15.DocumentTagEnum.caseHistory)
      .case(M15.DocumentTagEnum.caseAllegory)
      .case(M15.DocumentTagEnum.caseSpiritualLife)
      .create()

    try await database.schema(M15.tableName)
      .id()
      .field(
        M15.documentId,
        .uuid,
        .references(Document.M14.tableName, .id, onDelete: .cascade),
        .required,
      )
      .field(M15.type, tags, .required)
      .field(.createdAt, .datetime, .required)
      .unique(on: M15.type, M15.documentId)
      .create()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateTags DOWN")
    try await database.schema(M15.tableName).delete()
    try await database.enum(M15.DocumentTagEnum.name).delete()
  }
}

extension DocumentTag {
  enum M15 {
    static let tableName = "document_tags"
    static let type = FieldKey("type")
    static let documentId = FieldKey("document_id")
    enum DocumentTagEnum {
      static let name = "document_tags_enum"
      static let caseJournal = "journal"
      static let caseLetters = "letters"
      static let caseExhortation = "exhortation"
      static let caseDoctrinal = "doctrinal"
      static let caseTreatise = "treatise"
      static let caseHistory = "history"
      static let caseAllegory = "allegory"
      static let caseSpiritualLife = "spiritualLife"
    }
  }
}

extension DocumentTag.TagType: PostgresEnum {
  var typeName: String {
    DocumentTag.M15.DocumentTagEnum.name
  }
}
