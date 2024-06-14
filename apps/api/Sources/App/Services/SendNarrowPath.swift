import Queues
import Vapor

public struct SendNarrowPath: AsyncScheduledJob {
  public func run(context: QueueContext) async throws {
    // do something
  }

  func determineAction(
    sentQuotes: [SentNPQuote],
    allQuotes: [NPQuote]
  ) -> SendNarrowPath.Action {
    print("✨ Determining action")
    let unsentQuotes = allQuotes.filter { quote in
      !sentQuotes.contains {
        $0.quoteId == quote.id
      }
    }
    let englishUnsentQuotes = unsentQuotes.filter { $0.lang == Lang.en }
    let spanishUnsentQuotes = unsentQuotes.filter { $0.lang == Lang.es }

    if spanishUnsentQuotes.filter(\.isFriend).isEmpty {
      return .reset(.es)
    }
    if englishUnsentQuotes.filter(\.isFriend).isEmpty {
      return .reset(.en)
    }

    let enNonFriendOptInQuote = getQuote(quotes: englishUnsentQuotes, onlyFriends: false)
    var enFriendsOnlyQuote = enNonFriendOptInQuote
    let esNonFriendOptInQuote = getQuote(quotes: spanishUnsentQuotes, onlyFriends: false)
    var esFriendsOnlyQuote = esNonFriendOptInQuote

    if !enNonFriendOptInQuote.isFriend {
      enFriendsOnlyQuote = getQuote(quotes: englishUnsentQuotes, onlyFriends: true)
    }
    if !esNonFriendOptInQuote.isFriend {
      esFriendsOnlyQuote = getQuote(quotes: spanishUnsentQuotes, onlyFriends: true)
    }

    return .send(
      enFriends: enFriendsOnlyQuote.id,
      enAll: enNonFriendOptInQuote.id,
      esFriends: esFriendsOnlyQuote.id,
      esAll: esNonFriendOptInQuote.id
    )
  }
}

extension SendNarrowPath {
  enum Action {
    case reset(Lang)
    case send(
      enFriends: NPQuote.Id,
      enAll: NPQuote.Id,
      esFriends: NPQuote.Id,
      esAll: NPQuote.Id
    )
  }
}

extension SendNarrowPath.Action: Equatable {}

private func getQuote(quotes: [NPQuote], onlyFriends: Bool) -> NPQuote {
  let onlyFriendQuotes = quotes.filter(\.isFriend)
  var rng = Current.randomNumberGenerator()
  if onlyFriends {
    return onlyFriendQuotes.randomElement(using: &rng)!
  } else {
    return quotes.randomElement(using: &rng)!
  }
}
