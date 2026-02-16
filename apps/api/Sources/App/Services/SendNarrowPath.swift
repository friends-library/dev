import DuetSQL
import Queues
import Vapor
import XPostmark

extension SendNarrowPath {
  struct Group: Equatable {
    var recipients: [String]
    var quote: NPQuote
  }

  enum Action: Equatable {
    case reset(Lang)
    case send([Group])
  }
}

public struct SendNarrowPath: AsyncScheduledJob {
  public func run(context: QueueContext) async throws {
    try await self.exec()

    // delete unconfirmed subscribers after 3 days
    try await NPSubscriber.query()
      .where(.not(.isNull(.pendingConfirmationToken)))
      .where(.createdAt < get(dependency: \.date.now).advanced(by: .days(-3)))
      .delete(in: Current.db)
  }

  public func exec() async throws {
    let sentQuotes = try await NPSentQuote.query().all(in: Current.db)
    let allQuotes = try await NPQuote.query().all(in: Current.db)
    let subscribers = try await NPSubscriber.query()
      .where(.isNull(.unsubscribedAt))
      .all(in: Current.db)
    let action = self.determineAction(
      sentQuotes: sentQuotes,
      allQuotes: allQuotes,
      subscribers: subscribers,
    )
    switch action {
    case .reset(let lang):
      await slackInfo("Narrow path `\(lang)` quotes exhausted, resetting cycle")
      try await NPSentQuote.query()
        .where(.quoteId |=| allQuotes.filter { $0.lang == lang }.map(\.id))
        .delete(in: Current.db)
      return try await self.exec()
    case .send(let groups):
      try await self.send(groups)
    }
  }

  func send(_ groups: [Group]) async throws {
    var emails: [TemplateEmail] = []
    var sentQuotes: Set<NPQuote.Id> = []
    for group in groups {
      sentQuotes.insert(group.quote.id)
      let email = try await group.quote.email()
      for address in group.recipients {
        emails.append(email.template(to: address))
      }
    }

    if emails.count > 300 {
      await slackError("SendNarrowPath: Approaching Postmark 10k/mo price tier limit")
    }

    if emails.count > 450 {
      await slackError("SendNarrowPath: approaching batch send limit \(emails.count)/500")
    }

    switch await get(dependency: \.postmarkClient).sendTemplateEmailBatch(emails) {
    case .success(let messageErrors):
      for messageError in messageErrors {
        await slackError("SendNarrowPath message error: \(messageError)")
      }
    case .failure(let batchError):
      await slackError("SendNarrowPath batch error: \(batchError)")
    }

    try await Current.db.create(sentQuotes.map { NPSentQuote(quoteId: $0) })
  }

  func determineAction(
    sentQuotes: [NPSentQuote],
    allQuotes: [NPQuote],
    subscribers: [NPSubscriber],
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

    let esFriendSubscribers = subscribers.filter {
      $0.lang == .es && $0.confirmed && !$0.mixedQuotes
    }
    let esMixedSubscribers = subscribers.filter {
      $0.lang == .es && $0.confirmed && $0.mixedQuotes
    }
    let enFriendSubscribers = subscribers.filter {
      $0.lang == .en && $0.confirmed && !$0.mixedQuotes
    }
    let enMixedSubscribers = subscribers.filter {
      $0.lang == .en && $0.confirmed && $0.mixedQuotes
    }

    return .send(
      [
        .init(recipients: enFriendSubscribers.map(\.email), quote: enFriendQuote),
        .init(recipients: enMixedSubscribers.map(\.email), quote: enMixedQuote),
        .init(recipients: esFriendSubscribers.map(\.email), quote: esFriendQuote),
        .init(recipients: esMixedSubscribers.map(\.email), quote: esMixedQuote),
      ],
    )
  }
}

private func random(from quotes: [NPQuote], mixed: Bool) -> NPQuote {
  var rng = get(dependency: \.randomNumberGenerator)()
  if !mixed {
    return quotes.filter(\.isFriend).randomElement(using: &rng)!
  } else {
    return quotes.randomElement(using: &rng)!
  }
}
