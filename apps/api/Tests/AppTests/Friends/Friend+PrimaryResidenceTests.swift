import XCTest

@testable import App

// final class FriendPrimaryResidenceTests: XCTestCase {

//   func testReturnsUnDatedResidenceIfOnlyOne() {
//     var residence: FriendResidence = .empty
//     residence.city = "Sheffield"
//     residence.region = "England"
//     residence.durations = .loaded([])

//     var friend: Friend = .empty
//     friend.residences = .loaded([residence])

//     XCTAssertEqual(residence, friend.primaryResidence)
//   }

//   func testReturnsResidenceWithLongestDurationIfSeveral() {
//     var longDuration: FriendResidenceDuration = .empty
//     longDuration.start = 1700
//     longDuration.end = 1770

//     var shortDuration: FriendResidenceDuration = .empty
//     shortDuration.start = 1770
//     shortDuration.end = 1780

//     var longResidence: FriendResidence = .empty
//     longResidence.city = "York"
//     longResidence.region = "England"
//     longResidence.durations = .loaded([longDuration])

//     var shortResidence: FriendResidence = .empty
//     shortResidence.city = "Sheffield"
//     shortResidence.region = "England"
//     shortResidence.durations = .loaded([shortDuration])

//     var friend: Friend = .empty
//     friend.born = 1700
//     friend.died = 1780
//     friend.residences = .loaded([longResidence, shortResidence])

//     XCTAssertEqual(longResidence, friend.primaryResidence)
//   }

//   func testDiscountsGrowingUpYearsWhenChoosingPrimaryResidence() {
//     var childhood: FriendResidenceDuration = .empty
//     childhood.start = 1700
//     childhood.end = 1717

//     var adulthood: FriendResidenceDuration = .empty
//     adulthood.start = 1717
//     adulthood.end = 1724

//     var childhoodResidence: FriendResidence = .empty
//     childhoodResidence.city = "York"
//     childhoodResidence.region = "England"
//     childhoodResidence.durations = .loaded([childhood])

//     var adultResidence: FriendResidence = .empty
//     adultResidence.city = "Sheffield"
//     adultResidence.region = "England"
//     adultResidence.durations = .loaded([adulthood])

//     var friend: Friend = .empty
//     friend.born = 1700
//     friend.died = 1724
//     friend.residences = .loaded([childhoodResidence, adultResidence])

//     XCTAssertEqual(adultResidence, friend.primaryResidence)
//   }
// }
