import CheckoutApi from '@evans/checkout/services/CheckoutApi';
import { ShippingLevel } from '@evans/../graphql/globalTypes';

type Base = CheckoutApi;
type Resolved<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>;
type ExploratoryMetadata = Resolved<Base['getExploratoryMetadata']>;
type CreateOrderInitialization = Resolved<Base['createOrderInitialization']>;

type Responses = {
  createOrder: boolean[];
  getExploratoryMetadata: ExploratoryMetadata[];
};

export default class MockCheckoutApi extends CheckoutApi {
  public responses: Responses = {
    createOrder: [],
    getExploratoryMetadata: [],
  };

  public constructor(private delay: number = 0) {
    super(``);
  }

  public override async getExploratoryMetadata(): ReturnType<
    Base['getExploratoryMetadata']
  > {
    const response = this.responses.getExploratoryMetadata.shift();
    if (response) {
      return this.maybeDelay(response);
    }
    const defaultResponse: ExploratoryMetadata = {
      status: `success`,
      data: {
        data: {
          __typename: `PrintJobExploratoryMetadata`,
          shippingLevel: ShippingLevel.mail,
          feesInCents: 0,
          taxesInCents: 0,
          creditCardFeeOffsetInCents: 0,
          shippingInCents: 0,
        },
      },
    };
    return this.maybeDelay(defaultResponse);
  }

  public override async createOrderInitialization(): ReturnType<
    Base['createOrderInitialization']
  > {
    const response: CreateOrderInitialization = {
      success: true,
      data: {
        data: {
          __typename: `OrderInitialization`,
          orderPaymentId: `pi_123`,
          orderId: `order-id`,
          token: `token-123`,
          stripeClientSecret: `secret-123`,
        },
      },
    };
    return this.maybeDelay(response);
  }

  public override async createOrder(): ReturnType<Base['createOrder']> {
    return this.maybeDelay(this.responses.createOrder.shift() ?? true);
  }

  public override async chargeCreditCard(): ReturnType<Base['chargeCreditCard']> {
    return this.maybeDelay({ status: `success` } as const);
  }

  public override async brickOrder(): ReturnType<Base['brickOrder']> {
    // ¯\_(ツ)_/¯
  }

  public override async sendOrderConfirmationEmail(): ReturnType<
    Base['sendOrderConfirmationEmail']
  > {
    return true;
  }

  private maybeDelay<T>(response: T): Promise<T> {
    if (this.delay === 0) {
      return Promise.resolve(response);
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(response), this.delay);
    });
  }
}
