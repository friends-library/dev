import Duet

struct Isbn: Codable, Sendable {
  var id: Id
  var code: ISBN
  var editionId: Edition.Id?
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var edition = OptionalParent<Edition>.notLoaded

  var isValid: Bool {
    code.rawValue.match(#"^978-1-64476-\d\d\d-\d$"#)
  }

  init(id: Id = .init(), code: ISBN, editionId: Edition.Id?) {
    self.id = id
    self.code = code
    self.editionId = editionId
  }
}
