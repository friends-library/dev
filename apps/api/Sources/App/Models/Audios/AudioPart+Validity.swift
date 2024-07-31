extension AudioPart {
  func isValid() async -> Bool {
    // while recording sewel chapter by chapter, we have a 25 second
    // "note to the listener" which is special cased, because it is so small
    let isTempNoteToListener = title == "Nota para el oyente"

    if !isTempNoteToListener, mp3SizeHq < 2_000_000, mp3SizeHq != 0 {
      self.logInvalid("mp3 size hq too small \(mp3SizeHq))")
      return false
    }

    if !isTempNoteToListener, mp3SizeLq < 1_000_000, mp3SizeLq != 0 {
      self.logInvalid("mp3 size lq too small \(mp3SizeLq))")
      return false
    }

    if mp3SizeLq == mp3SizeHq, mp3SizeHq != 0 {
      self.logInvalid("mp3 lq/hq same size \(mp3SizeLq))")
      return false
    }

    if mp3SizeLq >= mp3SizeHq, mp3SizeLq != 0 {
      self.logInvalid("mp3 lq larger than hq, \(mp3SizeLq) >= \(mp3SizeHq))")
      return false
    }

    if isPublished, duration < 200, !isTempNoteToListener {
      self.logInvalid("short duration \(duration))")
      return false
    }

    if title.isEmpty || title.containsUnpresentableSubstring {
      self.logInvalid("empty or unpresentable title \(title))")
      return false
    }

    if order < 1 {
      self.logInvalid("order < 1 \(order))")
      return false
    }

    if !chapters.allSatisfy({ $0 >= 0 }) {
      self.logInvalid("negative chapter \(chapters))")
      return false
    }

    var prevChapter = chapters.first - 1
    for chapter in chapters {
      if chapter != prevChapter + 1 {
        self.logInvalid("non-sequenced chapter \(chapters))")
        return false
      }
      prevChapter = chapter
    }

    return true
  }

  private func logInvalid(_ message: String) {
    Current.logger.warning("Invalid audio part: \(message)")
  }
}
