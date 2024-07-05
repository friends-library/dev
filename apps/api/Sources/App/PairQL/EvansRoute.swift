import DuetSQL
import Foundation
import PairQL
import TaggedMoney
import Vapor

enum EvansRoute: PairRoute {
  case logJsError(LogJsError.Input)
  case submitContactForm(SubmitContactForm.Input)
  case subscribeToNarrowPath(SubscribeToNarrowPath.Input)

  nonisolated(unsafe) static let router = OneOf {
    Route(/Self.logJsError) {
      Operation(LogJsError.self)
      Body(.input(LogJsError.self))
    }
    Route(/Self.submitContactForm) {
      Operation(SubmitContactForm.self)
      Body(.input(SubmitContactForm.self))
    }
    Route(/Self.subscribeToNarrowPath) {
      Operation(SubscribeToNarrowPath.self)
      Body(.input(SubscribeToNarrowPath.self))
    }
  }
}

extension EvansRoute: RouteResponder {
  static func respond(to route: Self, in context: Context) async throws -> Response {
    switch route {
    case .logJsError(let input):
      let output = try await LogJsError.resolve(with: input, in: context)
      return try respond(with: output)
    case .submitContactForm(let input):
      let output = try await SubmitContactForm.resolve(with: input, in: context)
      return try respond(with: output)
    case .subscribeToNarrowPath(let input):
      let output = try await SubscribeToNarrowPath.resolve(with: input, in: context)
      return try respond(with: output)
    }
  }
}
