import Testing

@testable import App

@Suite struct EditionChapterValidityTests {
  @Test func `order less than 1 or super big invalid`() async {
    var chapter = EditionChapter.valid
    chapter.order = 0
    #expect(await chapter.isValid() == false)
    chapter.order = 400
    #expect(await chapter.isValid() == false)
  }

  @Test func `weird value for sequence number invalid`() async {
    var chapter = EditionChapter.valid
    chapter.sequenceNumber = 0
    #expect(await chapter.isValid() == false)
    chapter.sequenceNumber = 201
    #expect(await chapter.isValid() == false)
  }

  @Test func `empty or non-capitalized short heading invalid`() async {
    var chapter = EditionChapter.valid
    chapter.shortHeading = ""
    #expect(await chapter.isValid() == false)
    chapter.shortHeading = "bad lowercased"
    #expect(await chapter.isValid() == false)
  }

  @Test func `empty or non-capitalized non-sequence title invalid`() async {
    var chapter = EditionChapter.valid
    chapter.nonSequenceTitle = ""
    #expect(await chapter.isValid() == false)
    chapter.nonSequenceTitle = "bad lowercased"
    #expect(await chapter.isValid() == false)
  }

  @Test func `sequence number and non-sequence title both null invalid`() async {
    var chapter = EditionChapter.valid
    chapter.sequenceNumber = nil
    chapter.nonSequenceTitle = nil
    #expect(await chapter.isValid() == false)
  }
}
