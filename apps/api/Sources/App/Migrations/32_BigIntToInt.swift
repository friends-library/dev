import DuetSQL
import FluentSQL
import Vapor

struct BigIntToInt: AsyncMigration {
  var columns: [(String, FieldKey)] {
    [
      (Document.M14.tableName, Document.M14.published),
      (Download.M1.tableName, Download.M1.audioPartNumber),
      (AudioPart.M21.tableName, AudioPart.M21.order),
      (AudioPart.M21.tableName, AudioPart.M21.mp3SizeHq),
      (AudioPart.M21.tableName, AudioPart.M21.mp3SizeLq),
      (AudioPart.M21.tableName, AudioPart.M21.externalIdHq),
      (AudioPart.M21.tableName, AudioPart.M21.externalIdLq),
      (Audio.M20.tableName, Audio.M20.mp3ZipSizeHq),
      (Audio.M20.tableName, Audio.M20.mp3ZipSizeLq),
      (Audio.M20.tableName, Audio.M20.m4bSizeHq),
      (Audio.M20.tableName, Audio.M20.m4bSizeLq),
      (Audio.M20.tableName, Audio.M20.externalPlaylistIdHq),
      (Audio.M20.tableName, Audio.M20.externalPlaylistIdLq),
      (EditionChapter.M22.tableName, EditionChapter.M22.sequenceNumber),
      (EditionChapter.M22.tableName, EditionChapter.M22.order),
      (EditionImpression.M18.tableName, EditionImpression.M18.adocLength),
      (FriendQuote.M13.tableName, FriendQuote.M13.order),
      (FriendResidenceDuration.M25.tableName, FriendResidenceDuration.M25.start),
      (FriendResidenceDuration.M25.tableName, FriendResidenceDuration.M25.end),
      (Friend.M11.tableName, Friend.M11.born),
      (Friend.M11.tableName, Friend.M11.died),
      (OrderItem.M3.tableName, OrderItem.M3.quantity),
      (OrderItem.M3.tableName, OrderItem.M3.unitPrice),
      (Order.M2.tableName, Order.M2.printJobId),
      (Order.M2.tableName, Order.M2.amount),
      (Order.M2.tableName, Order.M2.shipping),
      (Order.M2.tableName, Order.M2.taxes),
      (Order.M2.tableName, Order.M2.ccFeeOffset),
      (Order.M2.tableName, Order.M28.fees),
      (Token.M4.tableName, Token.M27.uses),
    ]
  }

  var arrayColumns: [(String, FieldKey)] {
    [
      (EditionImpression.M18.tableName, EditionImpression.M18.paperbackVolumes),
      (AudioPart.M21.tableName, AudioPart.M21.chapters),
      (Edition.M17.tableName, Edition.M17.paperbackSplits),
    ]
  }

  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: BigIntToInt UP")
    let sql = database as! SQLDatabase

    for (table, column) in columns {
      try await sql.execute(
        """
        ALTER TABLE \(raw: table)
        ALTER COLUMN "\(raw: column.description)" TYPE INTEGER
        """
      )
    }

    for (table, column) in arrayColumns {
      try await sql.execute(
        """
        ALTER TABLE \(raw: table)
        ALTER COLUMN "\(raw: column.description)" TYPE INTEGER[]
        """
      )
    }
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: BigIntToInt DOWN")
    let sql = database as! SQLDatabase

    for (table, column) in columns {
      try await sql.execute(
        """
        ALTER TABLE \(raw: table)
        ALTER COLUMN "\(raw: column.description)" TYPE BIGINT
        """
      )
    }

    for (table, column) in arrayColumns {
      try await sql.execute(
        """
        ALTER TABLE \(raw: table)
        ALTER COLUMN "\(raw: column.description)" TYPE BIGINT[]
        """
      )
    }
  }
}
