@testable import App

extension Download {
  static var mock: Download {
    Download(editionId: .init(), format: .epub, source: .website, isMobile: true)
  }

  static var empty: Download {
    Download(editionId: .init(), format: .epub, source: .website, isMobile: false)
  }

  static var random: Download {
    Download(
      editionId: .init(),
      format: Format.allCases.shuffled().first!,
      source: DownloadSource.allCases.shuffled().first!,
      isMobile: Bool.random(),
    )
  }
}
