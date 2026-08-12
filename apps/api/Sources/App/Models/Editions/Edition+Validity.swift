import DuetSQL

extension Edition {
  func isValid() async -> Bool {
    // not-found means not yet persisted (create path), so nothing to cross-check
    let loaded: Edition.Joined?
    do {
      loaded = try await self.joined()
    } catch DuetSQLError.notFound {
      loaded = nil
    } catch {
      get(dependency: \.logger).warning("Invalid edition: failed to load joined: \(error)")
      return false
    }

    guard let joined = loaded else {
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

    // the gapless check below passes vacuously when empty, so guard explicitly
    if deletedAt == nil, !isDraft, joined.chapters.isEmpty {
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
