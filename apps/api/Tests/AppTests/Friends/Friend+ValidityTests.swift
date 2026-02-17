import XCTest
import XExpect

@testable import App

final class FriendValidityTests: AppTestCase, @unchecked Sendable {
  func testNonCapitalizedNameInvalid() async {
    var friend = Friend.valid
    friend.name = "george fox"
    await expect(friend.isValid()).toBeFalse()
  }

  func testNonSluggySlugInvalid() async {
    var friend = Friend.valid
    friend.slug = "This is not A Sluggy Slug"
    await expect(friend.isValid()).toBeFalse()
  }

  func testOnlyCompilationsAllowedToHaveMixedGender() async {
    var friend = Friend.valid
    friend.lang = .en
    friend.slug = "compilations"
    friend.gender = .mixed
    friend.born = nil
    friend.died = nil
    await expect(friend.isValid()).toBeTrue()
    friend.lang = .es
    friend.slug = "compilaciones"
    friend.gender = .mixed
    friend.born = nil
    friend.died = nil
    await expect(friend.isValid()).toBeTrue()
    friend.lang = .es
    friend.slug = "george-fox"
    friend.gender = .mixed
    friend.born = nil
    friend.died = nil
    await expect(friend.isValid()).toBeFalse()
  }

  func testCertainCharsNotAllowedInDesc() async {
    var friend = Friend.valid
    friend.description = "This desc \" has a straight quote"
    await expect(friend.isValid()).toBeFalse()
    friend.description = "This desc ' has a straight apostrophe"
    await expect(friend.isValid()).toBeFalse()
    friend.description = "This desc -- has a double dash"
    await expect(friend.isValid()).toBeFalse()
  }

  func testTodoDescOnlyAllowedIfNotPublished() async {
    var friend = Friend.valid
    friend.description = "TODO"
    friend.published = Date()
    await expect(friend.isValid()).toBeFalse()
  }

  func testPublishedShouldNotBeNilIfFriendHasNonDraftDocument() async throws {
    let entities = await Entities.create {
      $0.edition.isDraft = false
      $0.friend.published = nil // <-- not allowed, has a non draft document
    }
    await expect(entities.friend.model.isValid()).toBeFalse()
  }

  func testQuoteOrdersMustBeSequentialIfLoaded() async throws {
    let entities = await Entities.create {
      $0.friendQuote.order = 1
    }
    try await self.db.create(FriendQuote(
      friendId: entities.friend.id,
      source: "",
      text: "",
      order: 3, // <-- unexpected non-sequential order
    ))
    let friend = try await Friend.Joined.find(entities.friend.id)
    await expect(friend.model.isValid()).toBeFalse()
  }

  func testDiedRequiredIfNotCompilations() async {
    var friend = Friend.valid
    friend.born = 1650
    friend.died = nil
    await expect(friend.isValid()).toBeFalse()
  }

  func testCompilationsMustHaveNilBornAndDied() async {
    var friend = Friend.valid
    friend.slug = "compilations"
    friend.died = 1700
    await expect(friend.isValid()).toBeFalse()
  }

  func testDiedMustBeLaterThanBorn() async {
    var friend = Friend.valid
    friend.born = 1700
    friend.died = 1650
    await expect(friend.isValid()).toBeFalse()
  }

  func testBornMustBeInProperRange() async {
    var friend = Friend.valid
    friend.born = 1400
    await expect(friend.isValid()).toBeFalse()
    friend.born = 2000
    await expect(friend.isValid()).toBeFalse()
  }

  func testDiedMustBeInProperRange() async {
    var friend = Friend.valid
    friend.died = 1400
    await expect(friend.isValid()).toBeFalse()
    friend.died = 2000
    await expect(friend.isValid()).toBeFalse()
  }
}
