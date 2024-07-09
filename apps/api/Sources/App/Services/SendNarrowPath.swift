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
    try await exec()

    // delete unconfirmed subscribers after 3 days
    try await NPSubscriber.query()
      .where(.not(.isNull(.pendingConfirmationToken)))
      .where(.createdAt < Current.date().advanced(by: .days(-3)))
      .delete()
  }

  public func exec() async throws {
    let sentQuotes = try await NPSentQuote.query().all()
    let allQuotes = try await NPQuote.query().all()
    let subscribers = try await NPSubscriber.query().all()
    let action = determineAction(
      sentQuotes: sentQuotes,
      allQuotes: allQuotes,
      subscribers: subscribers
    )
    switch action {
    case .reset(let lang):
      try await NPSentQuote.query()
        .where(.quoteId |=| allQuotes.filter { $0.lang == lang }.map(\.id))
        .delete()
      return try await exec()
    case .send(let groups):
      try await send(groups)
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

    switch await Current.postmarkClient.sendTemplateEmailBatch(emails) {
    case .success(let messageErrors):
      for messageError in messageErrors {
        await slackError("SendNarrowPath message error: \(messageError)")
      }
    case .failure(let batchError):
      await slackError("SendNarrowPath batch error: \(batchError)")
    }

    try await NPSentQuote.create(sentQuotes.map { .init(quoteId: $0) })
  }

  func determineAction(
    sentQuotes: [NPSentQuote],
    allQuotes: [NPQuote],
    subscribers: [NPSubscriber]
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
      ]
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
