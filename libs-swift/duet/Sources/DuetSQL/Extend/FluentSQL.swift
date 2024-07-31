import FluentSQL
import Foundation

public extension SQLRow {
  func decode<M: DuetSQL.Model>(_: M.Type) throws -> M {
    try self.decode(model: M.self, prefix: nil, keyDecodingStrategy: .convertFromSnakeCase)
  }
}

public extension SQLQueryString {
  mutating func appendInterpolation<T: RawRepresentable>(id: T) where T.RawValue == UUID {
    self.appendInterpolation(uuid: id.rawValue)
  }

  mutating func appendInterpolation(uuid: UUID) {
    self.appendInterpolation(unsafeRaw: uuid.uuidString)
  }

  mutating func appendInterpolation<M: DuetSQL.Model>(table model: M.Type) {
    self.appendInterpolation(unsafeRaw: model.tableName)
  }

  mutating func appendInterpolation(escaping string: String) {
    self.appendInterpolation(unsafeRaw: string.replacingOccurrences(of: "'", with: "''"))
  }

  mutating func appendInterpolation(col: FieldKey) {
    self.appendInterpolation(unsafeRaw: col.description)
  }

  mutating func appendInterpolation(col: String) {
    self.appendInterpolation(unsafeRaw: col)
  }

  mutating func appendInterpolation(timestamp date: Date) {
    self.appendInterpolation(unsafeRaw: date.postgresTimestampString)
  }

  mutating func appendInterpolation(nullable: String?) {
    if let string = nullable {
      self.appendInterpolation(unsafeRaw: "'")
      self.appendInterpolation(unsafeRaw: string.replacingOccurrences(of: "'", with: "''"))
      self.appendInterpolation(unsafeRaw: "'")
    } else {
      self.appendInterpolation(unsafeRaw: "NULL")
    }
  }

  mutating func appendInterpolation(nullable: Int?) {
    if let string = nullable {
      self.appendInterpolation(literal: string)
    } else {
      self.appendInterpolation(unsafeRaw: "NULL")
    }
  }
}
