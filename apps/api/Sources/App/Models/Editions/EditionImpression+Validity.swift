extension EditionImpression {
  var isValid: Bool {
    if !paperbackVolumes.allSatisfy({ $0 >= 2 && $0 <= 720 }) {
      return false
    }

    if adocLength < 500 || adocLength > 5000000 {
      return false
    }

    if !productionToolchainRevision.rawValue.isValidGitCommitFullSha {
      return false
    }

    if !publishedRevision.rawValue.isValidGitCommitFullSha {
      return false
    }

    return true
  }
}
