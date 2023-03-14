// auto-generated, do not edit
import Graphiti
import Vapor

extension AppSchema {
  static var FriendResidenceDurationType: ModelType<FriendResidenceDuration> {
    Type(FriendResidenceDuration.self) {
      Field("id", at: \.id.rawValue.lowercased)
      Field("friendResidenceId", at: \.friendResidenceId.rawValue.lowercased)
      Field("start", at: \.start)
      Field("end", at: \.end)
      Field("createdAt", at: \.createdAt)
      Field("isValid", at: \.isValid)
      Field("residence", with: \.residence)
    }
  }

  struct CreateFriendResidenceDurationInput: Codable {
    let id: UUID?
    let friendResidenceId: UUID
    let start: Int
    let end: Int
  }

  struct UpdateFriendResidenceDurationInput: Codable {
    let id: UUID
    let friendResidenceId: UUID
    let start: Int
    let end: Int
  }

  static var CreateFriendResidenceDurationInputType: AppInput<CreateFriendResidenceDurationInput> {
    Input(CreateFriendResidenceDurationInput.self) {
      InputField("id", at: \.id)
      InputField("friendResidenceId", at: \.friendResidenceId)
      InputField("start", at: \.start)
      InputField("end", at: \.end)
    }
  }

  static var UpdateFriendResidenceDurationInputType: AppInput<UpdateFriendResidenceDurationInput> {
    Input(UpdateFriendResidenceDurationInput.self) {
      InputField("id", at: \.id)
      InputField("friendResidenceId", at: \.friendResidenceId)
      InputField("start", at: \.start)
      InputField("end", at: \.end)
    }
  }

  static var getFriendResidenceDuration: AppField<FriendResidenceDuration, IdentifyEntityArgs> {
    Field("getFriendResidenceDuration", at: Resolver.getFriendResidenceDuration) {
      Argument("id", at: \.id)
    }
  }

  static var getFriendResidenceDurations: AppField<[FriendResidenceDuration], NoArgs> {
    Field("getFriendResidenceDurations", at: Resolver.getFriendResidenceDurations)
  }

  static var createFriendResidenceDuration: AppField<
    FriendResidenceDuration,
    InputArgs<CreateFriendResidenceDurationInput>
  > {
    Field("createFriendResidenceDuration", at: Resolver.createFriendResidenceDuration) {
      Argument("input", at: \.input)
    }
  }

  static var createFriendResidenceDurations: AppField<
    [FriendResidenceDuration],
    InputArgs<[CreateFriendResidenceDurationInput]>
  > {
    Field("createFriendResidenceDurations", at: Resolver.createFriendResidenceDurations) {
      Argument("input", at: \.input)
    }
  }

  static var updateFriendResidenceDuration: AppField<
    FriendResidenceDuration,
    InputArgs<UpdateFriendResidenceDurationInput>
  > {
    Field("updateFriendResidenceDuration", at: Resolver.updateFriendResidenceDuration) {
      Argument("input", at: \.input)
    }
  }

  static var updateFriendResidenceDurations: AppField<
    [FriendResidenceDuration],
    InputArgs<[UpdateFriendResidenceDurationInput]>
  > {
    Field("updateFriendResidenceDurations", at: Resolver.updateFriendResidenceDurations) {
      Argument("input", at: \.input)
    }
  }

  static var deleteFriendResidenceDuration: AppField<FriendResidenceDuration, IdentifyEntityArgs> {
    Field("deleteFriendResidenceDuration", at: Resolver.deleteFriendResidenceDuration) {
      Argument("id", at: \.id)
    }
  }
}

extension FriendResidenceDuration {
  convenience init(_ input: AppSchema.CreateFriendResidenceDurationInput) {
    self.init(
      friendResidenceId: .init(rawValue: input.friendResidenceId),
      start: input.start,
      end: input.end
    )
    if let id = input.id {
      self.id = .init(rawValue: id)
    }
  }

  convenience init(_ input: AppSchema.UpdateFriendResidenceDurationInput) {
    self.init(
      id: .init(rawValue: input.id),
      friendResidenceId: .init(rawValue: input.friendResidenceId),
      start: input.start,
      end: input.end
    )
  }

  func update(_ input: AppSchema.UpdateFriendResidenceDurationInput) {
    friendResidenceId = .init(rawValue: input.friendResidenceId)
    start = input.start
    end = input.end
  }
}
