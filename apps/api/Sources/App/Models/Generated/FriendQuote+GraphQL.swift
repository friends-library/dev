// auto-generated, do not edit
import Graphiti
import Vapor

extension AppSchema {
  static var FriendQuoteType: ModelType<FriendQuote> {
    Type(FriendQuote.self) {
      Field("id", at: \.id.rawValue.lowercased)
      Field("friendId", at: \.friendId.rawValue.lowercased)
      Field("source", at: \.source)
      Field("text", at: \.text)
      Field("order", at: \.order)
      Field("context", at: \.context)
      Field("createdAt", at: \.createdAt)
      Field("updatedAt", at: \.updatedAt)
      Field("isValid", at: \.isValid)
      Field("friend", with: \.friend)
    }
  }

  struct CreateFriendQuoteInput: Codable {
    let id: UUID?
    let friendId: UUID
    let source: String
    let text: String
    let order: Int
    let context: String?
  }

  struct UpdateFriendQuoteInput: Codable {
    let id: UUID
    let friendId: UUID
    let source: String
    let text: String
    let order: Int
    let context: String?
  }

  static var CreateFriendQuoteInputType: AppInput<CreateFriendQuoteInput> {
    Input(CreateFriendQuoteInput.self) {
      InputField("id", at: \.id)
      InputField("friendId", at: \.friendId)
      InputField("source", at: \.source)
      InputField("text", at: \.text)
      InputField("order", at: \.order)
      InputField("context", at: \.context)
    }
  }

  static var UpdateFriendQuoteInputType: AppInput<UpdateFriendQuoteInput> {
    Input(UpdateFriendQuoteInput.self) {
      InputField("id", at: \.id)
      InputField("friendId", at: \.friendId)
      InputField("source", at: \.source)
      InputField("text", at: \.text)
      InputField("order", at: \.order)
      InputField("context", at: \.context)
    }
  }

  static var getFriendQuote: AppField<FriendQuote, IdentifyEntityArgs> {
    Field("getFriendQuote", at: Resolver.getFriendQuote) {
      Argument("id", at: \.id)
    }
  }

  static var getFriendQuotes: AppField<[FriendQuote], NoArgs> {
    Field("getFriendQuotes", at: Resolver.getFriendQuotes)
  }

  static var createFriendQuote: AppField<FriendQuote, InputArgs<CreateFriendQuoteInput>> {
    Field("createFriendQuote", at: Resolver.createFriendQuote) {
      Argument("input", at: \.input)
    }
  }

  static var createFriendQuotes: AppField<[FriendQuote], InputArgs<[CreateFriendQuoteInput]>> {
    Field("createFriendQuotes", at: Resolver.createFriendQuotes) {
      Argument("input", at: \.input)
    }
  }

  static var updateFriendQuote: AppField<FriendQuote, InputArgs<UpdateFriendQuoteInput>> {
    Field("updateFriendQuote", at: Resolver.updateFriendQuote) {
      Argument("input", at: \.input)
    }
  }

  static var updateFriendQuotes: AppField<[FriendQuote], InputArgs<[UpdateFriendQuoteInput]>> {
    Field("updateFriendQuotes", at: Resolver.updateFriendQuotes) {
      Argument("input", at: \.input)
    }
  }

  static var deleteFriendQuote: AppField<FriendQuote, IdentifyEntityArgs> {
    Field("deleteFriendQuote", at: Resolver.deleteFriendQuote) {
      Argument("id", at: \.id)
    }
  }
}

extension FriendQuote {
  convenience init(_ input: AppSchema.CreateFriendQuoteInput) {
    self.init(
      friendId: .init(rawValue: input.friendId),
      source: input.source,
      text: input.text,
      order: input.order,
      context: input.context
    )
    if let id = input.id {
      self.id = .init(rawValue: id)
    }
  }

  convenience init(_ input: AppSchema.UpdateFriendQuoteInput) {
    self.init(
      id: .init(rawValue: input.id),
      friendId: .init(rawValue: input.friendId),
      source: input.source,
      text: input.text,
      order: input.order,
      context: input.context
    )
  }

  func update(_ input: AppSchema.UpdateFriendQuoteInput) {
    friendId = .init(rawValue: input.friendId)
    source = input.source
    text = input.text
    order = input.order
    context = input.context
    updatedAt = Current.date()
  }
}
