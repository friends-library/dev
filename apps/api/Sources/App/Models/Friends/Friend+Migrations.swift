import Fluent

extension Friend {
  enum M11 {
    static let tableName = "friends"
    static let lang = FieldKey("lang")
    static let name = FieldKey("name")
    static let slug = FieldKey("slug")
    static let gender = FieldKey("gender")
    static let description = FieldKey("description")
    static let born = FieldKey("born")
    static let died = FieldKey("died")
    static let published = FieldKey("published")
    enum GenderEnum {
      static let name = "gender"
      static let caseMale = "male"
      static let caseFemale = "female"
      static let caseMixed = "mixed"
    }
  }
}
