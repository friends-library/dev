import Foundation
import PostgresKit
import XCTest
import XExpect

@testable import DuetSQL

final class UpsertTests: XCTestCase {
  func testIgnoringConflict() throws {
    let thing = LilThing(int: 3)
    let stmt = try SQL.Statement.create([thing], ignoringConflictOn: [.int])

    let expected = """
    INSERT INTO public.lil_things
    ("created_at", "deleted_at", "id", "int", "updated_at")
    VALUES
    ($1, $2, $3, $4, $5)
    ON CONFLICT ("int") DO NOTHING
    """

    expect(stmt.prepared).toEqual(expected)
    expect(stmt.params).toEqual([
      .currentTimestamp,
      .date(nil),
      .id(thing),
      .int(3),
      .currentTimestamp,
    ])
  }

  func testIgnoringConflictReturningAll() throws {
    let thing = LilThing(int: 3)
    let stmt = try SQL.Statement.create([thing], ignoringConflictOn: [.int], returning: .all)

    let expected = """
    INSERT INTO public.lil_things
    ("created_at", "deleted_at", "id", "int", "updated_at")
    VALUES
    ($1, $2, $3, $4, $5)
    ON CONFLICT ("int") DO NOTHING
    RETURNING *
    """

    expect(stmt.prepared).toEqual(expected)
  }

  func testConflictMultiColumnTarget() throws {
    let thing = LilThing(int: 3)
    let stmt = try SQL.Statement.create([thing], ignoringConflictOn: [.int, .deletedAt])

    expect(stmt.prepared).toContain(#"ON CONFLICT ("int", "deleted_at") DO NOTHING"#)
  }

  func testConflictUpdateSet() throws {
    let thing = LilThing(int: 3)
    let stmt = try SQL.Statement.create([thing], onConflict: [.id], do: .update(set: [.int]))

    let expected = """
    INSERT INTO public.lil_things
    ("created_at", "deleted_at", "id", "int", "updated_at")
    VALUES
    ($1, $2, $3, $4, $5)
    ON CONFLICT ("id") DO UPDATE SET "int" = EXCLUDED."int"
    """

    expect(stmt.prepared).toEqual(expected)
  }

  func testConflictUpdateReturningColumns() throws {
    let thing = LilThing(int: 3)
    let stmt = try SQL.Statement.create(
      [thing],
      onConflict: [.int],
      do: .update(set: [.deletedAt]),
      returning: .columns([.id, .deletedAt]),
    )

    let expected = """
    INSERT INTO public.lil_things
    ("created_at", "deleted_at", "id", "int", "updated_at")
    VALUES
    ($1, $2, $3, $4, $5)
    ON CONFLICT ("int") DO UPDATE SET "deleted_at" = EXCLUDED."deleted_at"
    RETURNING "id", "deleted_at"
    """

    expect(stmt.prepared).toEqual(expected)
  }

  func testConflictUpdateAllExceptNone() throws {
    let thing = LilThing(int: 3)
    let stmt = try SQL.Statement.create([thing], onConflict: [.id], do: .updateAllExcept([]))

    let expected = """
    INSERT INTO public.lil_things
    ("created_at", "deleted_at", "id", "int", "updated_at")
    VALUES
    ($1, $2, $3, $4, $5)
    ON CONFLICT ("id") DO UPDATE SET "int" = EXCLUDED."int", "updated_at" = EXCLUDED."updated_at"
    """

    expect(stmt.prepared).toEqual(expected)
  }

  func testConflictUpdateAllExceptSome() throws {
    let thing = LilThing(int: 3)
    let stmt = try SQL.Statement.create([thing], onConflict: [.int], do: .updateAllExcept([.int]))

    let expected = """
    INSERT INTO public.lil_things
    ("created_at", "deleted_at", "id", "int", "updated_at")
    VALUES
    ($1, $2, $3, $4, $5)
    ON CONFLICT ("int") DO UPDATE SET "updated_at" = EXCLUDED."updated_at"
    """

    expect(stmt.prepared).toEqual(expected)
  }

  func testConflictUpdateRawAccumulate() throws {
    let thing = Thing()
    let stmt = try SQL.Statement.create([thing], onConflict: [.string], do: .updateRaw { c in
      "\(c.col(.int)) = \(c.target(.int)) + \(c.excluded(.int))"
    })

    let expected = """
    INSERT INTO public.things AS existing
    ("bool", "created_at", "custom_enum", "id", "int", "optional_custom_enum", "optional_int", "optional_string", "string", "updated_at", "version")
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT ("string") DO UPDATE SET "int" = existing."int" + EXCLUDED."int"
    """

    expect(stmt.prepared).toEqual(expected)
  }

  func testConflictUpdateRawConditionalBump() throws {
    let thing = Thing()
    let stmt = try SQL.Statement.create([thing], onConflict: [.id], do: .updateRaw { c in
      """
      \(c.col(.optionalString)) = \(c.excluded(.optionalString)), \
      \(c.col(.updatedAt)) = CASE \
      WHEN \(c.target(.optionalString)) IS DISTINCT FROM \(c.excluded(.optionalString)) \
      THEN CURRENT_TIMESTAMP ELSE \(c.target(.updatedAt)) END
      """
    }, returning: .all)

    let expected = """
    INSERT INTO public.things AS existing
    ("bool", "created_at", "custom_enum", "id", "int", "optional_custom_enum", "optional_int", "optional_string", "string", "updated_at", "version")
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT ("id") DO UPDATE SET "optional_string" = EXCLUDED."optional_string", "updated_at" = CASE WHEN existing."optional_string" IS DISTINCT FROM EXCLUDED."optional_string" THEN CURRENT_TIMESTAMP ELSE existing."updated_at" END
    RETURNING *
    """

    expect(stmt.prepared).toEqual(expected)
  }

  func testEmptyConflictTargetThrows() {
    let thing = LilThing(int: 3)
    XCTAssertThrowsError(
      try SQL.Statement.create([thing], onConflict: [], do: .update(set: [.int])),
    ) { expect($0 as? DuetSQLError).toEqual(.emptyConflictTarget) }
    XCTAssertThrowsError(
      try SQL.Statement.create([thing], ignoringConflictOn: []),
    ) { expect($0 as? DuetSQLError).toEqual(.emptyConflictTarget) }
  }

  func testEmptyUpdateThrows() {
    let thing = LilThing(int: 3)
    XCTAssertThrowsError(
      try SQL.Statement.create([thing], onConflict: [.id], do: .update(set: [])),
    ) { expect($0 as? DuetSQLError).toEqual(.emptyConflictUpdate) }
    XCTAssertThrowsError(
      try SQL.Statement.create(
        [thing],
        onConflict: [.id],
        do: .updateAllExcept([.deletedAt, .int, .updatedAt]),
      ),
    ) { expect($0 as? DuetSQLError).toEqual(.emptyConflictUpdate) }
  }

  func testFindOrCreateEmptyTargetThrows() async throws {
    let client = TestClient()
    do {
      _ = try await client.findOrCreate(LilThing(int: 3), conflictOn: [])
      XCTFail("expected findOrCreate to throw on empty conflict target")
    } catch {
      expect(error as? DuetSQLError).toEqual(.emptyConflictTarget)
    }
  }

  func testClientUpsertDefaultAction() async throws {
    let thing = LilThing(int: 3)
    let client = TestClient()
    _ = try? await client.upsert(thing, conflictOn: [.id])

    let expected = """
    INSERT INTO public.lil_things
    ("created_at", "deleted_at", "id", "int", "updated_at")
    VALUES
    ($1, $2, $3, $4, $5)
    ON CONFLICT ("id") DO UPDATE SET "int" = EXCLUDED."int", "updated_at" = EXCLUDED."updated_at"
    RETURNING *
    """

    expect(client.stmt.prepared).toEqual(expected)
  }

  func testClientUpsertBatch() async throws {
    let thing1 = LilThing(int: 1)
    let thing2 = LilThing(int: 2)
    let client = TestClient()
    _ = try? await client.upsert([thing1, thing2], conflictOn: [.id], do: .update(set: [.int]))

    let expected = """
    INSERT INTO public.lil_things
    ("created_at", "deleted_at", "id", "int", "updated_at")
    VALUES
    ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)
    ON CONFLICT ("id") DO UPDATE SET "int" = EXCLUDED."int"
    RETURNING *
    """

    expect(client.stmt.prepared).toEqual(expected)
  }

  func testClientCreateIgnoringConflict() async throws {
    let thing = LilThing(int: 3)
    let client = TestClient()
    _ = try? await client.create(thing, ignoringConflictOn: [.int])

    let expected = """
    INSERT INTO public.lil_things
    ("created_at", "deleted_at", "id", "int", "updated_at")
    VALUES
    ($1, $2, $3, $4, $5)
    ON CONFLICT ("int") DO NOTHING
    RETURNING *
    """

    expect(client.stmt.prepared).toEqual(expected)
  }

  func testClientFindOrCreate() async throws {
    let thing = LilThing(int: 3)
    let client = TestClient()
    _ = try? await client.findOrCreate(thing, conflictOn: [.int])

    let expected = """
    INSERT INTO public.lil_things
    ("created_at", "deleted_at", "id", "int", "updated_at")
    VALUES
    ($1, $2, $3, $4, $5)
    ON CONFLICT ("int") DO UPDATE SET "int" = EXCLUDED."int"
    RETURNING *
    """

    expect(client.stmt.prepared).toEqual(expected)
  }
}
