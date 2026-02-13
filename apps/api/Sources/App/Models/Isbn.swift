import Duet

struct Isbn: Codable, Sendable, Equatable {
  var id: Id
  var code: ISBN
  var editionId: Edition.Id?
  var createdAt = Current.date()
  var updatedAt = Current.date()

  init(id: Id = .init(), code: ISBN, editionId: Edition.Id?) {
    self.id = id
    self.code = code
    self.editionId = editionId
  }
}

// extensions

extension Isbn {
  func isValid() async -> Bool {
    self.code.rawValue.match(#"^978-1-64476-\d\d\d-\d$"#)
  }
}
