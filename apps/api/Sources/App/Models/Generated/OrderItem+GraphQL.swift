// auto-generated, do not edit
import Graphiti
import Vapor

extension AppSchema {
  static var OrderItemType: ModelType<OrderItem> {
    Type(OrderItem.self) {
      Field("id", at: \.id.rawValue.lowercased)
      Field("orderId", at: \.orderId.rawValue.lowercased)
      Field("editionId", at: \.editionId.rawValue.lowercased)
      Field("quantity", at: \.quantity)
      Field("unitPriceInCents", at: \.unitPrice.rawValue)
      Field("createdAt", at: \.createdAt)
      Field("isValid", at: \.isValid)
      Field("order", with: \.order)
      Field("edition", with: \.edition)
    }
  }

  struct CreateOrderItemInput: Codable {
    let id: UUID?
    let orderId: UUID
    let editionId: UUID
    let quantity: Int
    let unitPrice: Int
  }

  struct UpdateOrderItemInput: Codable {
    let id: UUID
    let orderId: UUID
    let editionId: UUID
    let quantity: Int
    let unitPrice: Int
  }

  static var CreateOrderItemInputType: AppInput<CreateOrderItemInput> {
    Input(CreateOrderItemInput.self) {
      InputField("id", at: \.id)
      InputField("orderId", at: \.orderId)
      InputField("editionId", at: \.editionId)
      InputField("quantity", at: \.quantity)
      InputField("unitPrice", at: \.unitPrice)
    }
  }

  static var UpdateOrderItemInputType: AppInput<UpdateOrderItemInput> {
    Input(UpdateOrderItemInput.self) {
      InputField("id", at: \.id)
      InputField("orderId", at: \.orderId)
      InputField("editionId", at: \.editionId)
      InputField("quantity", at: \.quantity)
      InputField("unitPrice", at: \.unitPrice)
    }
  }

  static var getOrderItem: AppField<OrderItem, IdentifyEntityArgs> {
    Field("getOrderItem", at: Resolver.getOrderItem) {
      Argument("id", at: \.id)
    }
  }

  static var getOrderItems: AppField<[OrderItem], NoArgs> {
    Field("getOrderItems", at: Resolver.getOrderItems)
  }

  static var createOrderItem: AppField<OrderItem, InputArgs<CreateOrderItemInput>> {
    Field("createOrderItem", at: Resolver.createOrderItem) {
      Argument("input", at: \.input)
    }
  }

  static var createOrderItems: AppField<[OrderItem], InputArgs<[CreateOrderItemInput]>> {
    Field("createOrderItems", at: Resolver.createOrderItems) {
      Argument("input", at: \.input)
    }
  }

  static var updateOrderItem: AppField<OrderItem, InputArgs<UpdateOrderItemInput>> {
    Field("updateOrderItem", at: Resolver.updateOrderItem) {
      Argument("input", at: \.input)
    }
  }

  static var updateOrderItems: AppField<[OrderItem], InputArgs<[UpdateOrderItemInput]>> {
    Field("updateOrderItems", at: Resolver.updateOrderItems) {
      Argument("input", at: \.input)
    }
  }

  static var deleteOrderItem: AppField<OrderItem, IdentifyEntityArgs> {
    Field("deleteOrderItem", at: Resolver.deleteOrderItem) {
      Argument("id", at: \.id)
    }
  }
}

extension OrderItem {
  convenience init(_ input: AppSchema.CreateOrderItemInput) {
    self.init(
      orderId: .init(rawValue: input.orderId),
      editionId: .init(rawValue: input.editionId),
      quantity: input.quantity,
      unitPrice: .init(rawValue: input.unitPrice)
    )
    if let id = input.id {
      self.id = .init(rawValue: id)
    }
  }

  convenience init(_ input: AppSchema.UpdateOrderItemInput) {
    self.init(
      id: .init(rawValue: input.id),
      orderId: .init(rawValue: input.orderId),
      editionId: .init(rawValue: input.editionId),
      quantity: input.quantity,
      unitPrice: .init(rawValue: input.unitPrice)
    )
  }

  func update(_ input: AppSchema.UpdateOrderItemInput) {
    orderId = .init(rawValue: input.orderId)
    editionId = .init(rawValue: input.editionId)
    quantity = input.quantity
    unitPrice = .init(rawValue: input.unitPrice)
  }
}
