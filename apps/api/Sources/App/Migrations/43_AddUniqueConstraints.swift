import Fluent
import FluentSQL
import Vapor

struct AddUniqueConstraints: AsyncMigration {
  private struct Constraint {
    let up: String
    let down: String
  }

  private var constraints: [Constraint] {
    [
      Constraint(
        up: """
        ALTER TABLE edition_audio_parts
        ADD CONSTRAINT uq_edition_audio_parts_audio_id_title UNIQUE (audio_id, title)
        """,
        down: """
        ALTER TABLE edition_audio_parts
        DROP CONSTRAINT uq_edition_audio_parts_audio_id_title
        """,
      ),
      Constraint(
        up: """
        ALTER TABLE isbns ADD CONSTRAINT uq_isbns_edition_id UNIQUE (edition_id)
        """,
        down: """
        ALTER TABLE isbns DROP CONSTRAINT uq_isbns_edition_id
        """,
      ),
      Constraint(
        up: """
        ALTER TABLE orders ADD CONSTRAINT uq_orders_payment_id UNIQUE (payment_id)
        """,
        down: """
        ALTER TABLE orders DROP CONSTRAINT uq_orders_payment_id
        """,
      ),
      Constraint(
        up: """
        ALTER TABLE orders ADD CONSTRAINT uq_orders_print_job_id UNIQUE (print_job_id)
        """,
        down: """
        ALTER TABLE orders DROP CONSTRAINT uq_orders_print_job_id
        """,
      ),
      Constraint(
        up: """
        ALTER TABLE order_items
        ADD CONSTRAINT uq_order_items_order_id_edition_id UNIQUE (order_id, edition_id)
        """,
        down: """
        ALTER TABLE order_items DROP CONSTRAINT uq_order_items_order_id_edition_id
        """,
      ),
      Constraint(
        up: """
        ALTER TABLE related_documents
        ADD CONSTRAINT uq_related_documents_parent_id_document_id
        UNIQUE (parent_document_id, document_id)
        """,
        down: """
        ALTER TABLE related_documents
        DROP CONSTRAINT uq_related_documents_parent_id_document_id
        """,
      ),
      Constraint(
        up: """
        ALTER TABLE related_documents
        ADD CONSTRAINT ck_related_documents_not_self
        CHECK (parent_document_id <> document_id)
        """,
        down: """
        ALTER TABLE related_documents DROP CONSTRAINT ck_related_documents_not_self
        """,
      ),
      Constraint(
        up: """
        ALTER TABLE documents
        ADD CONSTRAINT uq_documents_alt_language_id UNIQUE (alt_language_id)
        """,
        down: """
        ALTER TABLE documents DROP CONSTRAINT uq_documents_alt_language_id
        """,
      ),
      Constraint(
        up: """
        ALTER TABLE np_sent_quotes
        ADD CONSTRAINT uq_np_sent_quotes_quote_id UNIQUE (quote_id)
        """,
        down: """
        ALTER TABLE np_sent_quotes DROP CONSTRAINT uq_np_sent_quotes_quote_id
        """,
      ),
      // partial, so a soft-deleted document doesn't hold its slug forever
      Constraint(
        up: """
        CREATE UNIQUE INDEX uq_documents_friend_id_slug
        ON documents (friend_id, slug) WHERE deleted_at IS NULL
        """,
        down: """
        DROP INDEX uq_documents_friend_id_slug
        """,
      ),
      // custom_id becomes the chapter's html id, so a collision within
      // an edition silently breaks in-book anchor links
      Constraint(
        up: """
        CREATE UNIQUE INDEX uq_edition_chapters_edition_id_custom_id
        ON edition_chapters (edition_id, custom_id) WHERE custom_id IS NOT NULL
        """,
        down: """
        DROP INDEX uq_edition_chapters_edition_id_custom_id
        """,
      ),
    ]
  }

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddUniqueConstraints UP")
    let sql = database as! SQLDatabase
    for constraint in self.constraints {
      _ = try await sql.raw("\(unsafeRaw: constraint.up)").all()
    }
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddUniqueConstraints DOWN")
    let sql = database as! SQLDatabase
    for constraint in self.constraints.reversed() {
      _ = try await sql.raw("\(unsafeRaw: constraint.down)").all()
    }
  }
}
