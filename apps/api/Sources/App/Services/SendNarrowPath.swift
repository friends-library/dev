import DuetSQL
import Queues
import Vapor

public struct SendNarrowPath: AsyncScheduledJob {
  public func run(context: QueueContext) async throws {
    let sentQuotes = try await NPSentQuote.query().all()
    let allQuotes = try await NPQuote.query().all()
    let action = determineAction(sentQuotes: sentQuotes, allQuotes: allQuotes)
    switch action {
    case .reset(let lang):
      try await NPSentQuote.query()
        .where(.quoteId |=| allQuotes.filter { $0.lang == lang }.map(\.id))
        .delete()
      return try await run(context: context)
    case .send(let enFriend, let enMixed, let esFriend, let esMixed):
      print(enFriend, enMixed, esFriend, esMixed)
    }
  }

  func determineAction(
    sentQuotes: [NPSentQuote],
    allQuotes: [NPQuote]
  ) -> SendNarrowPath.Action {
    let unsentQuotes = allQuotes.filter { quote in
      !sentQuotes.contains {
        $0.quoteId == quote.id
      }
    }
    let englishUnsentQuotes = unsentQuotes.filter { $0.lang == .en }
    let spanishUnsentQuotes = unsentQuotes.filter { $0.lang == .es }

    if spanishUnsentQuotes.filter(\.isFriend).isEmpty {
      return .reset(.es)
    }
    if englishUnsentQuotes.filter(\.isFriend).isEmpty {
      return .reset(.en)
    }

    let enMixedQuote = random(from: englishUnsentQuotes, mixed: true)
    var enFriendQuote = enMixedQuote
    let esMixedQuote = random(from: spanishUnsentQuotes, mixed: true)
    var esFriendQuote = esMixedQuote

    if !enMixedQuote.isFriend {
      enFriendQuote = random(from: englishUnsentQuotes, mixed: false)
    }
    if !esMixedQuote.isFriend {
      esFriendQuote = random(from: spanishUnsentQuotes, mixed: false)
    }

    return .send(
      enFriend: enFriendQuote.id,
      enMixed: enMixedQuote.id,
      esFriend: esFriendQuote.id,
      esMixed: esMixedQuote.id
    )
  }
}

extension SendNarrowPath {
  enum Action: Equatable {
    case reset(Lang)
    case send(
      enFriend: NPQuote.Id,
      enMixed: NPQuote.Id,
      esFriend: NPQuote.Id,
      esMixed: NPQuote.Id
    )
  }
}

private func random(from quotes: [NPQuote], mixed: Bool) -> NPQuote {
  var rng = Current.randomNumberGenerator()
  if !mixed {
    return quotes.filter(\.isFriend).randomElement(using: &rng)!
  } else {
    return quotes.randomElement(using: &rng)!
  }
}
