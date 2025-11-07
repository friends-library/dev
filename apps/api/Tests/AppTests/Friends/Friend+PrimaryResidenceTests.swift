import XCTest

@testable import App

final class FriendPrimaryResidenceTests: AppTestCase, @unchecked Sendable {
  func testReturnsUnDatedResidenceIfOnlyOne() async throws {
    let entities = await Entities.create {
      $0.friendResidence.city = "Sheffield"
      $0.friendResidence.region = "England"
    }
    try await entities.friendResidenceDuration.delete() // no durations
    XCTAssertEqual(entities.friendResidence.model, entities.friend.primaryResidence?.model)
  }

  func testReturnsResidenceWithLongestDurationIfSeveral() async throws {
    let entities = await Entities.create {
      $0.friend.born = 1700
      $0.friend.died = 1780
      $0.friendResidence.city = "Sheffield"
      $0.friendResidence.region = "England"
      // short duration
      $0.friendResidenceDuration.start = 1770
      $0.friendResidenceDuration.end = 1780
    }

    let longResidence = try await FriendResidence.create(.init(
      friendId: entities.friend.id,
      city: "York",
      region: "England",
    ))

    try await FriendResidenceDuration.create(.init(
      friendResidenceId: longResidence.id,
      start: 1700,
      end: 1770,
    ))

    let friend = try await Friend.Joined.find(entities.friend.id)
    XCTAssertEqual(longResidence, friend.primaryResidence?.model)
  }

  func testDiscountsGrowingUpYearsWhenChoosingPrimaryResidence() async throws {
    let entities = await Entities.create {
      $0.friend.born = 1700
      $0.friend.died = 1724
      $0.friendResidence.city = "York"
      $0.friendResidence.region = "England"
      // childhood duration:
      $0.friendResidenceDuration.start = 1700
      $0.friendResidenceDuration.end = 1717
    }

    let adultResidence = try await FriendResidence.create(.init(
      friendId: entities.friend.id,
      city: "Sheffield",
      region: "England",
    ))

    try await FriendResidenceDuration.create(.init(
      friendResidenceId: adultResidence.id,
      start: 1717, end: 1724, // <-- shorter, but adult
    ))

    let friend = try await Friend.Joined.find(entities.friend.id)
    XCTAssertEqual(adultResidence, friend.primaryResidence?.model)
  }
}
