// auto-generated, do not edit
import DuetSQL
import Tagged

extension FreeOrderRequest: ApiModel {
  typealias Id = Tagged<FreeOrderRequest, UUID>
}

extension FreeOrderRequest: Model {
  static let tableName = M6.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .name:
      .string(name)
    case .email:
      .string(email.rawValue)
    case .requestedBooks:
      .string(requestedBooks)
    case .aboutRequester:
      .string(aboutRequester)
    case .addressStreet:
      .string(addressStreet)
    case .addressStreet2:
      .string(addressStreet2)
    case .addressCity:
      .string(addressCity)
    case .addressState:
      .string(addressState)
    case .addressZip:
      .string(addressZip)
    case .addressCountry:
      .string(addressCountry)
    case .source:
      .string(source)
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    }
  }
}

extension FreeOrderRequest {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable, ModelColumns {
    case id
    case name
    case email
    case requestedBooks
    case aboutRequester
    case addressStreet
    case addressStreet2
    case addressCity
    case addressState
    case addressZip
    case addressCountry
    case source
    case createdAt
    case updatedAt
  }
}

extension FreeOrderRequest {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .name: .string(name),
      .email: .string(email.rawValue),
      .requestedBooks: .string(requestedBooks),
      .aboutRequester: .string(aboutRequester),
      .addressStreet: .string(addressStreet),
      .addressStreet2: .string(addressStreet2),
      .addressCity: .string(addressCity),
      .addressState: .string(addressState),
      .addressZip: .string(addressZip),
      .addressCountry: .string(addressCountry),
      .source: .string(source),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }
}
