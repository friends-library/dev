import XCTest
import XExpect

@testable import App

final class FriendValidityTests: XCTestCase {
  func testNonCapitalizedNameInvalid() async {
    var friend = Friend.valid
    friend.name = "george fox"
    expect(await friend.isValid()).toBeFalse()
  }

  func testNonSluggySlugInvalid() async {
    var friend = Friend.valid
    friend.slug = "This is not A Sluggy Slug"
    expect(await friend.isValid()).toBeFalse()
  }

  func testOnlyCompilationsAllowedToHaveMixedGender() async {
    var friend = Friend.valid
    friend.lang = .en
    friend.slug = "compilations"
    friend.gender = .mixed
    friend.born = nil
    friend.died = nil
    expect(await friend.isValid()).toBeTrue()
    friend.lang = .es
    friend.slug = "compilaciones"
    friend.gender = .mixed
    friend.born = nil
    friend.died = nil
    expect(await friend.isValid()).toBeTrue()
    friend.lang = .es
    friend.slug = "george-fox"
    friend.gender = .mixed
    friend.born = nil
    friend.died = nil
    expect(await friend.isValid()).toBeFalse()
  }

  func testCertainCharsNotAllowedInDesc() async {
    var friend = Friend.valid
    friend.description = "This desc \" has a straight quote"
    expect(await friend.isValid()).toBeFalse()
    friend.description = "This desc ' has a straight apostrophe"
    expect(await friend.isValid()).toBeFalse()
    friend.description = "This desc -- has a double dash"
    expect(await friend.isValid()).toBeFalse()
  }

  func testTodoDescOnlyAllowedIfNotPublished() async {
    var friend = Friend.valid
    friend.description = "TODO"
    friend.published = Date()
    expect(await friend.isValid()).toBeFalse()
  }

  // func testPublishedShouldNotBeNilIfFriendHasNonDraftDocument() async {
  //   var edition = Edition.valid
  //   edition.isDraft = false
  //   var document = Document.valid
  //   document.editions = .loaded([edition])
  //   var friend = Friend.valid
  //   friend.documents = .loaded([document])
  //   friend.published = nil // <-- not allowed, has a non draft document
  //   expect(await friend.isValid()).toBeFalse()
  // }

  // func testQuoteOrdersMustBeSequentialIfLoaded() async {
  //   var quote1 = FriendQuote.empty
  //   quote1.order = 1
  //   var quote2 = FriendQuote.empty
  //   quote2.order = 3 // <-- unexpected non-sequential order
  //   var friend = Friend.valid
  //   friend.quotes = .loaded([quote1, quote2])
  //   expect(await friend.isValid()).toBeFalse()
  // }

  func testDiedRequiredIfNotCompilations() async {
    var friend = Friend.valid
    friend.born = 1650
    friend.died = nil
    expect(await friend.isValid()).toBeFalse()
  }

  func testCompilationsMustHaveNilBornAndDied() async {
    var friend = Friend.valid
    friend.slug = "compilations"
    friend.died = 1700
    expect(await friend.isValid()).toBeFalse()
  }

  func testDiedMustBeLaterThanBorn() async {
    var friend = Friend.valid
    friend.born = 1700
    friend.died = 1650
    expect(await friend.isValid()).toBeFalse()
  }

  func testBornMustBeInProperRange() async {
    var friend = Friend.valid
    friend.born = 1400
    expect(await friend.isValid()).toBeFalse()
    friend.born = 2000
    expect(await friend.isValid()).toBeFalse()
  }

  func testDiedMustBeInProperRange() async {
    var friend = Friend.valid
    friend.died = 1400
    expect(await friend.isValid()).toBeFalse()
    friend.died = 2000
    expect(await friend.isValid()).toBeFalse()
  }
}
