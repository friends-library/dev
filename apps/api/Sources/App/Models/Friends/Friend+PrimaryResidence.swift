import Foundation

extension Friend.Joined {
  var primaryResidence: FriendResidence.Joined? {
    var primary: FriendResidence.Joined?
    for residence in residences {
      guard let current = primary else {
        primary = residence
        continue
      }
      let currentTotal = totalAdultYears(current.durations, model.born)
      let nextTotal = totalAdultYears(residence.durations, model.born)
      if nextTotal > currentTotal {
        primary = residence
      }
    }
    return primary
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
