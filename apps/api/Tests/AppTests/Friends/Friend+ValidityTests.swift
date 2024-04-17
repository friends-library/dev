import XCTest

@testable import App

final class FriendValidityTests: XCTestCase {
  func testNonCapitalizedNameInvalid() {
    var friend = Friend.valid
    friend.name = "george fox"
    XCTAssertFalse(friend.isValid)
  }

  func testNonSluggySlugInvalid() {
    var friend = Friend.valid
    friend.slug = "This is not A Sluggy Slug"
    XCTAssertFalse(friend.isValid)
  }

  func testOnlyCompilationsAllowedToHaveMixedGender() {
    var friend = Friend.valid
    friend.lang = .en
    friend.slug = "compilations"
    friend.gender = .mixed
    friend.born = nil
    friend.died = nil
    XCTAssertTrue(friend.isValid)
    friend.lang = .es
    friend.slug = "compilaciones"
    friend.gender = .mixed
    friend.born = nil
    friend.died = nil
    XCTAssertTrue(friend.isValid)
    friend.lang = .es
    friend.slug = "george-fox"
    friend.gender = .mixed
    friend.born = nil
    friend.died = nil
    XCTAssertFalse(friend.isValid)
  }

  func testCertainCharsNotAllowedInDesc() {
    var friend = Friend.valid
    friend.description = "This desc \" has a straight quote"
    XCTAssertFalse(friend.isValid)
    friend.description = "This desc ' has a straight apostrophe"
    XCTAssertFalse(friend.isValid)
    friend.description = "This desc -- has a double dash"
    XCTAssertFalse(friend.isValid)
  }

  func testTodoDescOnlyAllowedIfNotPublished() {
    var friend = Friend.valid
    friend.description = "TODO"
    friend.published = Date()
    XCTAssertFalse(friend.isValid)
  }

  // func testPublishedShouldNotBeNilIfFriendHasNonDraftDocument() {
  //   var edition = Edition.valid
  //   edition.isDraft = false
  //   var document = Document.valid
  //   document.editions = .loaded([edition])
  //   var friend = Friend.valid
  //   friend.documents = .loaded([document])
  //   friend.published = nil // <-- not allowed, has a non draft document
  //   XCTAssertFalse(friend.isValid)
  // }

  // func testQuoteOrdersMustBeSequentialIfLoaded() {
  //   var quote1 = FriendQuote.empty
  //   quote1.order = 1
  //   var quote2 = FriendQuote.empty
  //   quote2.order = 3 // <-- unexpected non-sequential order
  //   var friend = Friend.valid
  //   friend.quotes = .loaded([quote1, quote2])
  //   XCTAssertFalse(friend.isValid)
  // }

  func testDiedRequiredIfNotCompilations() {
    var friend = Friend.valid
    friend.born = 1650
    friend.died = nil
    XCTAssertFalse(friend.isValid)
  }

  func testCompilationsMustHaveNilBornAndDied() {
    var friend = Friend.valid
    friend.slug = "compilations"
    friend.died = 1700
    XCTAssertFalse(friend.isValid)
  }

  func testDiedMustBeLaterThanBorn() {
    var friend = Friend.valid
    friend.born = 1700
    friend.died = 1650
    XCTAssertFalse(friend.isValid)
  }

  func testBornMustBeInProperRange() {
    var friend = Friend.valid
    friend.born = 1400
    XCTAssertFalse(friend.isValid)
    friend.born = 2000
    XCTAssertFalse(friend.isValid)
  }

  func testDiedMustBeInProperRange() {
    var friend = Friend.valid
    friend.died = 1400
    XCTAssertFalse(friend.isValid)
    friend.died = 2000
    XCTAssertFalse(friend.isValid)
  }
}
