import XCTest
import XExpect

@testable import App

final class FriendValidityTests: AppTestCase {
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

  func testPublishedShouldNotBeNilIfFriendHasNonDraftDocument() async throws {
    let entities = await Entities.create {
      $0.edition.isDraft = false
      $0.friend.published = nil // <-- not allowed, has a non draft document
    }
    expect(await entities.friend.model.isValid()).toBeFalse()
  }

  func testQuoteOrdersMustBeSequentialIfLoaded() async throws {
    let entities = await Entities.create {
      $0.friendQuote.order = 1
    }
    try await FriendQuote.create(.init(
      friendId: entities.friend.id,
      source: "",
      text: "",
      order: 3 // <-- unexpected non-sequential order
    ))
    let friend = try await Friend.Joined.find(entities.friend.id)
    expect(await friend.model.isValid()).toBeFalse()
  }

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
