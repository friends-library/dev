import Foundation

extension Friend {
  var primaryResidence: FriendResidence? {
    fatalError("mega query") // only used in two pairql build queries
    // var primary: FriendResidence?
    // for residence in residences.require() {
    //   guard let current = primary else {
    //     primary = residence
    //     continue
    //   }
    //   let currentTotal = totalAdultYears(current.durations.require(), born)
    //   let nextTotal = totalAdultYears(residence.durations.require(), born)
    //   if nextTotal > currentTotal {
    //     primary = residence
    //   }
    // }
    // return primary
  }
}

// helpers

let START_OF_ADULTHOOD = 16

private func totalAdultYears(_ durations: [FriendResidenceDuration], _ born: Int?) -> Int {
  durations.reduce(0) { total, duration in
    let start = duration.start
    let adultStart = born != nil && start == born! ? start + START_OF_ADULTHOOD : start
    return total + duration.end - adultStart
  }
}
