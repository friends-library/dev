extension EditionChapter {
  func isValid() async -> Bool {
    if order < 1 || order > 300 {
      return false
    }

    if !shortHeading.firstLetterIsUppercase {
      return false
    }

    if sequenceNumber == nil, nonSequenceTitle == nil {
      return false
    }

    if let seqNum = sequenceNumber, seqNum < 1 || seqNum > 200 {
      return false
    }

    if let nsTitle = nonSequenceTitle, !nsTitle.firstLetterIsUppercase {
      return false
    }

    return true
  }
}
