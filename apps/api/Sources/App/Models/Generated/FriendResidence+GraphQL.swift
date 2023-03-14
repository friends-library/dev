// auto-generated, do not edit
import Graphiti
import Vapor

extension AppSchema {
  static var FriendResidenceType: ModelType<FriendResidence> {
    Type(FriendResidence.self) {
      Field("id", at: \.id.rawValue.lowercased)
      Field("friendId", at: \.friendId.rawValue.lowercased)
      Field("city", at: \.city)
      Field("region", at: \.region)
      Field("createdAt", at: \.createdAt)
      Field("updatedAt", at: \.updatedAt)
      Field("isValid", at: \.isValid)
      Field("friend", with: \.friend)
      Field("durations", with: \.durations)
    }
  }

  struct CreateFriendResidenceInput: Codable {
    let id: UUID?
    let friendId: UUID
    let city: String
    let region: String
  }

  struct UpdateFriendResidenceInput: Codable {
    let id: UUID
    let friendId: UUID
    let city: String
    let region: String
  }

  static var CreateFriendResidenceInputType: AppInput<CreateFriendResidenceInput> {
    Input(CreateFriendResidenceInput.self) {
      InputField("id", at: \.id)
      InputField("friendId", at: \.friendId)
      InputField("city", at: \.city)
      InputField("region", at: \.region)
    }
  }

  static var UpdateFriendResidenceInputType: AppInput<UpdateFriendResidenceInput> {
    Input(UpdateFriendResidenceInput.self) {
      InputField("id", at: \.id)
      InputField("friendId", at: \.friendId)
      InputField("city", at: \.city)
      InputField("region", at: \.region)
    }
  }

  static var getFriendResidence: AppField<FriendResidence, IdentifyEntityArgs> {
    Field("getFriendResidence", at: Resolver.getFriendResidence) {
      Argument("id", at: \.id)
    }
  }

  static var getFriendResidences: AppField<[FriendResidence], NoArgs> {
    Field("getFriendResidences", at: Resolver.getFriendResidences)
  }

  static var createFriendResidence: AppField<
    FriendResidence,
    InputArgs<CreateFriendResidenceInput>
  > {
    Field("createFriendResidence", at: Resolver.createFriendResidence) {
      Argument("input", at: \.input)
    }
  }

  static var createFriendResidences: AppField<
    [FriendResidence],
    InputArgs<[CreateFriendResidenceInput]>
  > {
    Field("createFriendResidences", at: Resolver.createFriendResidences) {
      Argument("input", at: \.input)
    }
  }

  static var updateFriendResidence: AppField<
    FriendResidence,
    InputArgs<UpdateFriendResidenceInput>
  > {
    Field("updateFriendResidence", at: Resolver.updateFriendResidence) {
      Argument("input", at: \.input)
    }
  }

  static var updateFriendResidences: AppField<
    [FriendResidence],
    InputArgs<[UpdateFriendResidenceInput]>
  > {
    Field("updateFriendResidences", at: Resolver.updateFriendResidences) {
      Argument("input", at: \.input)
    }
  }

  static var deleteFriendResidence: AppField<FriendResidence, IdentifyEntityArgs> {
    Field("deleteFriendResidence", at: Resolver.deleteFriendResidence) {
      Argument("id", at: \.id)
    }
  }
}

extension FriendResidence {
  convenience init(_ input: AppSchema.CreateFriendResidenceInput) {
    self.init(
      friendId: .init(rawValue: input.friendId),
      city: input.city,
      region: input.region
    )
    if let id = input.id {
      self.id = .init(rawValue: id)
    }
  }

  convenience init(_ input: AppSchema.UpdateFriendResidenceInput) {
    self.init(
      id: .init(rawValue: input.id),
      friendId: .init(rawValue: input.friendId),
      city: input.city,
      region: input.region
    )
  }

  func update(_ input: AppSchema.UpdateFriendResidenceInput) {
    friendId = .init(rawValue: input.friendId)
    city = input.city
    region = input.region
    updatedAt = Current.date()
  }
}
