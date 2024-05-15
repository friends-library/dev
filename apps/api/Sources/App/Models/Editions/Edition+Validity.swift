extension Edition {
  func isValid() async -> Bool {
    if type != .updated, editor != nil {
      return false
    }

    guard let joined = try? await joined() else {
      return true
    }

    if joined.document.friend.lang == .es, editor != nil {
      return false
    }

    let sorted = joined.chapters.sorted { $0.order < $1.order }
    var prev = 0
    for chapter in sorted {
      if chapter.order != prev + 1 {
        return false
      }
      prev = chapter.order
    }

    return true
  }
}
