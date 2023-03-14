import CheckoutApi from './CheckoutApi';
import Cart from '../models/Cart';
import { LANG } from '../../env';
import {
  CreateOrderInput,
  CreateOrderItemInput,
  Lang,
  OrderSource,
  PrintJobStatus,
  PrintSize,
  ShippingLevel,
} from '../../../graphql/globalTypes';

/**
 * CheckoutService exists to orchestrate the series of API invocations
 * necessary for checking out. It builds up necessary intermediate state
 * (things like orderId, paymentIntentId) in order to pass correct
 * values to the various requests throughout the sequence. The CheckoutApi
 * is injected as an independent service for easier unit testing and usage
 * within Storybook.
 */
export default class CheckoutService {
  private stripeError?: string;
  public token = ``;
  public orderId = ``;
  public paymentIntentId = ``;
  public paymentIntentClientSecret = ``;
  public shippingLevel = ShippingLevel.mail;
  public metadata = {
    fees: 0,
    shipping: 0,
    taxes: 0,
    ccFeeOffset: 0,
  };

  public constructor(public cart: Cart, private api: CheckoutApi) {}

  public brickOrder(stateHistory: string[]): void {
    this.api.brickOrder(stateHistory, this.orderId, this.paymentIntentId);
    this.resetState();
  }

  public async getExploratoryMetadata(): Promise<string | void> {
    const items = this.cart.items
      .filter((i) => i.quantity > 0)
      .map((item) => ({
        volumes: item.numPages,
        printSize: item.printSize as PrintSize,
        quantity: item.quantity,
      }));

    if (!this.cart.address) throw new Error(`Missing address`);

    const result = await this.api.getExploratoryMetadata(items, this.cart.address);
    switch (result.status) {
      case `success`:
        this.cart.address.unusable = false;
        this.shippingLevel = result.data.data.shippingLevel;
        this.metadata = {
          fees: result.data.data.feesInCents,
          shipping: result.data.data.shippingInCents,
          taxes: result.data.data.taxesInCents,
          ccFeeOffset: result.data.data.creditCardFeeOffsetInCents,
        };
        return;
      case `shipping_not_possible`:
        this.cart.address.unusable = true;
        return `shipping_not_possible`;
      case `error`:
        return `unknown error`;
    }
  }

  public async createOrderInitialization(): Promise<string | void> {
    const amount = this.cart.subTotal() + this.sumFees();
    const result = await this.api.createOrderInitialization(amount);
    switch (result.success) {
      case true:
        this.token = result.data.data.token;
        this.paymentIntentId = result.data.data.orderPaymentId;
        this.paymentIntentClientSecret = result.data.data.stripeClientSecret;
        this.orderId = result.data.data.orderId;
        return;
      case false:
        return `error creating order initialization`;
    }
  }

  public async createOrder(): Promise<string | void> {
    const success = await this.api.createOrder(...this.createOrderArgs());
    return success ? undefined : `error creating order`;
  }

  public async chargeCreditCard(
    chargeCreditCard: () => Promise<Record<string, any>>,
  ): Promise<string | void> {
    const result = await this.api.chargeCreditCard(chargeCreditCard);
    switch (result.status) {
      case `success`:
        return;
      case `user_actionable_error`:
        this.stripeError = result.error;
        return result.error;
      case `error`:
        return result.error;
    }
  }

  public async sendOrderConfirmationEmail(): Promise<string | void> {
    const success = await this.api.sendOrderConfirmationEmail(this.orderId);
    return success ? undefined : `error creating order`;
  }

  public complete(): void {
    this.resetState();
    this.cart.items = [];
  }

  public peekStripeError(): string | undefined {
    return this.stripeError;
  }

  public popStripeError(): string | undefined {
    const error = this.stripeError;
    delete this.stripeError;
    return error;
  }

  private sumFees(): number {
    return Object.values(this.metadata).reduce((sum, fee) => sum + fee);
  }

  private createOrderArgs(): Parameters<InstanceType<typeof CheckoutApi>['createOrder']> {
    const { shipping, taxes, ccFeeOffset, fees } = this.metadata;
    if (!this.cart.address) throw new Error(`Missing address`);
    const items = this.cart.items
      .filter((i) => i.quantity > 0)
      .map(
        (item): CreateOrderItemInput => ({
          orderId: this.orderId,
          editionId: item.editionId,
          quantity: item.quantity,
          unitPrice: item.price(),
        }),
      );
    const order: CreateOrderInput = {
      id: this.orderId,
      paymentId: this.paymentIntentId,
      amount: this.cart.subTotal() + this.sumFees(),
      shipping,
      taxes,
      ccFeeOffset,
      fees,
      email: this.cart.email!,
      shippingLevel: this.shippingLevel,
      addressName: this.cart.address.name,
      addressStreet: this.cart.address.street,
      addressStreet2: this.cart.address.street2,
      addressCity: this.cart.address.city,
      addressState: this.cart.address.state,
      addressZip: this.cart.address.zip,
      addressCountry: this.cart.address.country,
      source: OrderSource.website,
      printJobStatus: PrintJobStatus.presubmit,
      lang: LANG as Lang,
    };
    return [order, items, this.token];
  }

  private resetState(): void {
    this.token = ``;
    this.orderId = ``;
    this.paymentIntentId = ``;
    this.paymentIntentClientSecret = ``;
    this.shippingLevel = ShippingLevel.mail;
    this.metadata = { fees: 0, shipping: 0, taxes: 0, ccFeeOffset: 0 };
    delete this.stripeError;
  }
}
