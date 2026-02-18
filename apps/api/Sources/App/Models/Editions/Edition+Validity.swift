extension Edition {
  func isValid() async -> Bool {
    guard let joined = try? await joined() else {
      if type != .updated, editor != nil {
        return false
      }
      return true
    }

    if !joined.document.friend.outOfBand {
      if type != .updated, editor != nil {
        return false
      }
      if joined.document.friend.lang == .es, editor != nil {
        return false
      }
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
