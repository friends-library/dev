extension Edition {
  var isValid: Bool {
    if type != .updated, editor != nil {
      return false
    }

    if case .loaded = document, case .loaded = document.require().friend {
      if lang == .es, editor != nil {
        return false
      }
    }

    // TODO: sad
    // test for sequential chapters, when loaded
    // if case .loaded(let chapters) = chapters {
    //   let sorted = chapters.sorted { $0.order < $1.order }
    //   var prev = 0
    //   for chapter in sorted {
    //     if chapter.order != prev + 1 {
    //       return false
    //     }
    //     prev = chapter.order
    //   }
    // }

    return true
  }
}
