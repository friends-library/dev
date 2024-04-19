import Fluent

extension Friend {
  enum M11 {
    static let tableName = "friends"
    nonisolated(unsafe) static let lang = FieldKey("lang")
    nonisolated(unsafe) static let name = FieldKey("name")
    nonisolated(unsafe) static let slug = FieldKey("slug")
    nonisolated(unsafe) static let gender = FieldKey("gender")
    nonisolated(unsafe) static let description = FieldKey("description")
    nonisolated(unsafe) static let born = FieldKey("born")
    nonisolated(unsafe) static let died = FieldKey("died")
    nonisolated(unsafe) static let published = FieldKey("published")
    enum GenderEnum {
      static let name = "gender"
      static let caseMale = "male"
      static let caseFemale = "female"
      static let caseMixed = "mixed"
    }
  }
}
