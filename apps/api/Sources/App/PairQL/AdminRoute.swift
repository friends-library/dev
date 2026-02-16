import DuetSQL
import Foundation
import PairQL
import Vapor

enum AdminRoute: PairRoute {
  case authed(UUID, AuthedAdminRoute)

  nonisolated(unsafe) static let router = OneOf {
    Route(/Self.authed) {
      Headers {
        Field("Authorization") {
          Skip { "Bearer " }
          UUID.parser()
        }
      }
      AuthedAdminRoute.router
    }
  }
}

enum AuthedAdminRoute: PairRoute {
  case createEntity(CreateEntity.Input)
  case deleteEntity(DeleteEntity.Input)
  case editDocument(Document.Id)
  case editFriend(Friend.Id)
  case editToken(Token.Id)
  case getOrder(Order.Id)
  case getFreeOrderRequest(FreeOrderRequest.Id)
  case listDocuments
  case listFriends
  case listOrders
  case listTokens
  case orderEditions
  case selectableDocuments
  case updateEntity(UpdateEntity.Input)

  nonisolated(unsafe) static let router = OneOf {
    Route(/Self.createEntity) {
      Operation(CreateEntity.self)
      Body(.input(CreateEntity.self))
    }
    Route(/Self.deleteEntity) {
      Operation(DeleteEntity.self)
      Body(.input(DeleteEntity.self))
    }
    Route(/Self.editDocument) {
      Operation(EditDocument.self)
      Body(.input(EditDocument.self))
    }
    Route(/Self.editFriend) {
      Operation(EditFriend.self)
      Body(.input(EditFriend.self))
    }
    Route(/Self.editToken) {
      Operation(EditToken.self)
      Body(.input(EditToken.self))
    }
    Route(/Self.getOrder) {
      Operation(GetOrder.self)
      Body(.input(GetOrder.self))
    }
    Route(/Self.getFreeOrderRequest) {
      Operation(GetFreeOrderRequest.self)
      Body(.input(GetFreeOrderRequest.self))
    }
    Route(/Self.listFriends) {
      Operation(ListFriends.self)
    }
    Route(/Self.listOrders) {
      Operation(ListOrders.self)
    }
    Route(/Self.listDocuments) {
      Operation(ListDocuments.self)
    }
    Route(/Self.listTokens) {
      Operation(ListTokens.self)
    }
    Route(/Self.orderEditions) {
      Operation(OrderEditions.self)
    }
    Route(/Self.selectableDocuments) {
      Operation(SelectableDocuments.self)
    }
    Route(/Self.updateEntity) {
      Operation(UpdateEntity.self)
      Body(.input(UpdateEntity.self))
    }
  }
  .eraseToAnyParserPrinter()
}

extension AdminRoute: RouteResponder {
  static func respond(to route: Self, in context: Context) async throws -> Response {
    switch route {
    case .authed(let token, let authedRoute):
      let token = try await Token.query().where(.value == token).first(in: context.db)
      let authed = try await AuthedContext(
        requestId: context.requestId,
        scopes: token.scopes(in: context.db),
      )
      switch authedRoute {
      case .createEntity(let input):
        let output = try await CreateEntity.resolve(with: input, in: authed)
        return try self.respond(with: output)
      case .deleteEntity(let input):
        let output = try await DeleteEntity.resolve(with: input, in: authed)
        return try self.respond(with: output)
      case .editDocument(let id):
        let output = try await EditDocument.resolve(with: id, in: authed)
        return try self.respond(with: output)
      case .editFriend(let id):
        let output = try await EditFriend.resolve(with: id, in: authed)
        return try self.respond(with: output)
      case .editToken(let id):
        let output = try await EditToken.resolve(with: id, in: authed)
        return try self.respond(with: output)
      case .getOrder(let id):
        let output = try await GetOrder.resolve(with: id, in: authed)
        return try self.respond(with: output)
      case .getFreeOrderRequest(let id):
        let output = try await GetFreeOrderRequest.resolve(with: id, in: authed)
        return try self.respond(with: output)
      case .listDocuments:
        let output = try await ListDocuments.resolve(in: authed)
        return try self.respond(with: output)
      case .listFriends:
        let output = try await ListFriends.resolve(in: authed)
        return try self.respond(with: output)
      case .listOrders:
        let output = try await ListOrders.resolve(in: authed)
        return try self.respond(with: output)
      case .listTokens:
        let output = try await ListTokens.resolve(in: authed)
        return try self.respond(with: output)
      case .orderEditions:
        let output = try await OrderEditions.resolve(in: authed)
        return try self.respond(with: output)
      case .selectableDocuments:
        let output = try await SelectableDocuments.resolve(in: authed)
        return try self.respond(with: output)
      case .updateEntity(let input):
        let output = try await UpdateEntity.resolve(with: input, in: authed)
        return try self.respond(with: output)
      }
    }
  }
}
