import Tagged
import Testing

@testable import DuetSQL

@Suite struct SqlTests {

  @Test func `limit offset`() throws {
    let stmt = SQL.select(
      .all,
      from: Thing.self,
      orderBy: .init(.string, .asc),
      limit: 2,
      offset: 3,
    )

    let expectedQuery = """
    SELECT * FROM "things"
    ORDER BY "string" ASC
    LIMIT 2
    OFFSET 3;
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [])
  }

  @Test func `count no where`() throws {
    let stmt = SQL.count(Thing.self)

    let expectedQuery = """
    SELECT COUNT(*) FROM "things";
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [])
  }

  @Test func `count where`() throws {
    let stmt = SQL.count(Thing.self, where: .string == "a")

    let expectedQuery = """
    SELECT COUNT(*) FROM "things"
    WHERE "string" = $1;
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == ["a"])
  }

  @Test func `where in`() throws {
    let ids: [Thing.IdValue] = [
      .init(rawValue: UUID(uuidString: "6b9cfcdc-22a8-4c40-9ea8-eb409725dc34")!),
      .init(rawValue: UUID(uuidString: "c5bfe387-1e7a-426a-87ff-1aa472057acc")!),
    ]

    let stmt = SQL.select(.all, from: Thing.self, where: .id |=| ids)

    let expectedQuery = """
    SELECT * FROM "things"
    WHERE "id" IN ($1, $2);
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == ids.map { .uuid($0.rawValue) })
  }

  @Test func `where in empty values`() throws {
    let ids: [Thing.IdValue] = []

    let stmt = SQL.select(.all, from: Thing.self, where: .id |=| ids)

    let expectedQuery = """
    SELECT * FROM "things"
    WHERE FALSE;
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [])
  }

  @Test func `always removed from where clause`() throws {
    var stmt = SQL.select(.all, from: Thing.self)

    var expectedQuery = """
    SELECT * FROM "things";
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [])

    stmt = SQL.select(.all, from: Thing.self, where: .and(.always, .int == 3))

    expectedQuery = """
    SELECT * FROM "things"
    WHERE "int" = $1;
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [3])
  }

  @Test func `simple select`() throws {
    let stmt = SQL.select(.all, from: Thing.self)

    let expectedQuery = """
    SELECT * FROM "things";
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [])
  }

  @Test func `select with limit`() throws {
    let stmt = SQL.select(.all, from: Thing.self, limit: 4)

    let expectedQuery = """
    SELECT * FROM "things"
    LIMIT 4;
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [])
  }

  @Test func `select with single where`() throws {
    let stmt = SQL.select(.all, from: Thing.self, where: .id == 123)

    let expectedQuery = """
    SELECT * FROM "things"
    WHERE "id" = $1;
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [123])
  }

  @Test func `select with multiple wheres`() throws {
    let stmt = SQL.select(.all, from: Thing.self, where: .id == 123 .&& .int == 789)

    let expectedQuery = """
    SELECT * FROM "things"
    WHERE ("id" = $1 AND "int" = $2);
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [123, 789])
  }

  @Test func `delete with constraint`() throws {
    let stmt = SQL.delete(from: Thing.self, where: .id == 123)

    let expectedQuery = """
    DELETE FROM "things"
    WHERE "id" = $1;
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [123])
  }

  @Test func `delete with order by and limit`() throws {
    let stmt = SQL.delete(
      from: Thing.self,
      where: .id == 123,
      orderBy: .init(.createdAt, .asc),
      limit: 1,
    )

    let expectedQuery = """
    DELETE FROM "things"
    WHERE "id" = $1
    ORDER BY "created_at" ASC
    LIMIT 1;
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [123])
  }

  @Test func `delete all`() throws {
    let stmt = SQL.delete(from: Thing.self)

    let expectedQuery = """
    DELETE FROM "things";
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [])
  }

  @Test func `bulk insert`() throws {
    let stmt = try SQL.insert(
      into: Thing.self,
      values: [[.int: 1, .optionalInt: 2], [.optionalInt: 4, .int: 3]],
    )

    let expectedQuery = """
    INSERT INTO "things"
    ("int", "optional_int")
    VALUES
    ($1, $2), ($3, $4);
    """

    #expect(stmt.query == expectedQuery)
    #expect(stmt.bindings == [1, 2, 3, 4])
  }

  @Test func update() {
    let statement = SQL.update(
      Thing.self,
      set: [.optionalInt: 1, .bool: true],
      where: .string == "a",
    )

    let query = """
    UPDATE "things"
    SET "bool" = $1, "optional_int" = $2
    WHERE "string" = $3;
    """

    #expect(statement.query == query)
    #expect(statement.bindings == [true, 1, "a"])
  }

  @Test func `update without where`() {
    let statement = SQL.update(Thing.self, set: [.int: 1])

    let query = """
    UPDATE "things"
    SET "int" = $1;
    """

    #expect(statement.query == query)
    #expect(statement.bindings == [1])
  }

  @Test func `update producing`() {
    let statement = SQL.update(
      Thing.self,
      set: [.int: 1],
      where: .string == "a",
      returning: .all,
    )

    let query = """
    UPDATE "things"
    SET "int" = $1
    WHERE "string" = $2
    RETURNING *;
    """

    #expect(statement.query == query)
    #expect(statement.bindings == [1, "a"])
  }

  @Test func `basic insert`() throws {
    let id = UUID()
    let statement = try SQL.insert(
      into: Thing.self,
      values: [.int: 33, .string: "lol", .id: .uuid(id)],
    )

    let query = """
    INSERT INTO "things"
    ("id", "int", "string")
    VALUES
    ($1, $2, $3);
    """

    #expect(statement.query == query)
    #expect(statement.bindings == [.uuid(id), 33, "lol"])
  }

  @Test func `optional ints`() throws {
    let statement = try SQL.insert(
      into: Thing.self,
      values: [.int: 22, .optionalInt: .int(nil)],
    )

    let query = """
    INSERT INTO "things"
    ("int", "optional_int")
    VALUES
    ($1, $2);
    """

    #expect(statement.query == query)
    #expect(statement.bindings == [22, .int(nil)])
  }

  @Test func `optional strings`() throws {
    let statement = try SQL.insert(
      into: Thing.self,
      values: [.string: "howdy", .optionalString: .string(nil)],
    )

    let query = """
    INSERT INTO "things"
    ("optional_string", "string")
    VALUES
    ($1, $2);
    """

    #expect(statement.query == query)
    #expect(statement.bindings == [.string(nil), "howdy"])
  }

  @Test func enums() throws {
    let statement = try SQL.insert(
      into: Thing.self,
      values: [
        .customEnum: .enum(Thing.CustomEnum.foo),
        .optionalCustomEnum: .enum(nil),
      ],
    )

    let query = """
    INSERT INTO "things"
    ("custom_enum", "optional_custom_enum")
    VALUES
    ($1, $2);
    """

    #expect(statement.query == query)
    #expect(statement.bindings == [.enum(Thing.CustomEnum.foo), .enum(nil)])
  }

  @Test func dates() throws {
    let date = try? Date(fromIsoString: "2021-12-14T17:16:16.896Z")
    let statement = try SQL.insert(
      into: Thing.self,
      values: [.createdAt: .date(date), .updatedAt: .currentTimestamp],
    )

    let query = """
    INSERT INTO "things"
    ("created_at", "updated_at")
    VALUES
    ($1, $2);
    """

    #expect(statement.query == query)
    #expect(statement.bindings == [.date(date), .currentTimestamp])
  }

  @Test func `update removes id and created at from insert values`() throws {
    let thing = Thing(
      string: "foo",
      int: 1,
      bool: true,
      customEnum: .foo,
      optionalCustomEnum: .bar,
      optionalInt: 2,
      optionalString: "opt_foo",
    )
    let statement = SQL.update(Thing.self, set: thing.insertValues)

    let query = """
    UPDATE "things"
    SET "int" = $1, "updated_at" = $2, "bool" = $3, "optional_string" = $4, "custom_enum" = $5, "optional_custom_enum" = $6, "version" = $7, "string" = $8, "optional_int" = $9;
    """

    #expect(statement.query == query)
  }
}
