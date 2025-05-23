import XCTest
import XExpect

@testable import App

final class DocumentTests: AppTestCase, @unchecked Sendable {
  var validDocument: Document {
    var friend = Friend.empty
    friend.lang = .en
    var edition = Edition.empty
    edition.isDraft = false
    let document = Document.valid
    return document
  }

  func testEmptyTitleInvalid() async {
    var doc = self.validDocument
    doc.title = ""
    await expect(doc.isValid()).toBeFalse()
  }

  func testOriginalTitleTooShortInvalid() async {
    var doc = self.validDocument
    doc.originalTitle = "Abc"
    await expect(doc.isValid()).toBeFalse()
  }

  func testOriginalTitleNotCapitalizedInvalid() async {
    var doc = self.validDocument
    doc.originalTitle = "the life and labors of george dilwynn"
    await expect(doc.isValid()).toBeFalse()
  }

  func testPublishedDateOutOfBoundsInvalid() async {
    var doc = self.validDocument
    doc.published = 1500
    await expect(doc.isValid()).toBeFalse()
    doc = self.validDocument
    doc.published = 1901
    await expect(doc.isValid()).toBeFalse()
  }

  func testTodosOkForDescriptionsIfEditionsNotLoaded() async {
    var doc = Document.valid
    doc.description = "TODO"
    doc.partialDescription = "TODO"
    doc.featuredDescription = "TODO"
    await expect(doc.isValid()).toBeTrue()
  }

  func testTodosInvalidForDescriptionsIfHasNonDraftEdition() async {
    let doc = await Entities.create {
      $0.document.description = "TODO"
      $0.document.partialDescription = "TODO"
      $0.document.featuredDescription = "TODO"
    }.document.model
    await expect(doc.isValid()).toBeFalse()
  }

  func testNonCapitalizedTitleInvalid() async {
    var doc = self.validDocument
    doc.title = "no Cross, No Crown"
    await expect(doc.isValid()).toBeFalse()
  }

  func testTooShortTitleInValid() async {
    var doc = self.validDocument
    doc.title = "No"
    await expect(doc.isValid()).toBeFalse()
  }

  func testNonSluggySlugInvalid() async {
    var doc = self.validDocument
    doc.slug = "This is not A Sluggy Slug"
    await expect(doc.isValid()).toBeFalse()
  }

  func testMalformedFilenameInvalid() async {
    var doc = self.validDocument
    doc.filename = "This is not A good filename :("
    await expect(doc.isValid()).toBeFalse()
  }

  func testPrimaryEdition() async {
    let document = await Entities.create().document
    var updatedModel: Edition = .empty
    updatedModel.type = .updated
    let updated = Edition.Joined(updatedModel, document: document)
    var modernizedModel: Edition = .empty
    modernizedModel.type = .modernized
    let modernized = Edition.Joined(modernizedModel, document: document)
    var originalModel: Edition = .empty
    originalModel.type = .original
    let original = Edition.Joined(originalModel, document: document)

    document.editions = [updated, modernized, original]
    XCTAssertEqual(updated.model, document.primaryEdition?.model)

    document.editions = [modernized, original, updated]
    XCTAssertEqual(updated.model, document.primaryEdition?.model)

    document.editions = [original, updated, modernized]
    XCTAssertEqual(updated.model, document.primaryEdition?.model)

    document.editions = [original, modernized]
    XCTAssertEqual(modernized.model, document.primaryEdition?.model)

    document.editions = [modernized, original]
    XCTAssertEqual(modernized.model, document.primaryEdition?.model)

    document.editions = [updated, original]
    XCTAssertEqual(updated.model, document.primaryEdition?.model)

    document.editions = [original]
    XCTAssertEqual(original.model, document.primaryEdition?.model)

    document.editions = [modernized]
    XCTAssertEqual(modernized.model, document.primaryEdition?.model)
  }
}
