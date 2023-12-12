import { type T } from '@friends-library/pairql/order';
import type Cart from '../models/Cart';
import type { Lang } from '@friends-library/types';
import type CheckoutApi from './CheckoutApi';
import { LANG } from '../../../lib/env';

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
  public shippingLevel: T.GetPrintJobExploratoryMetadata.Output['shippingLevel'] = `mail`;
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
        printSize: item.printSize,
        quantity: item.quantity,
      }));

    if (!this.cart.address || !this.cart.email)
      throw new Error(`Missing address or email`);

    const result = await this.api.getExploratoryMetadata(items, {
      ...this.cart.address,
      email: this.cart.email,
    });

    switch (result.status) {
      case `success`:
        this.cart.address.unusable = false;
        this.shippingLevel = result.data.shippingLevel;
        this.metadata = {
          fees: result.data.fees,
          shipping: result.data.shipping,
          taxes: result.data.taxes,
          ccFeeOffset: result.data.creditCardFeeOffset,
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
        this.token = result.data.createOrderToken;
        this.paymentIntentId = result.data.orderPaymentId;
        this.paymentIntentClientSecret = result.data.stripeClientSecret;
        this.orderId = result.data.orderId;
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
    if (!this.cart.address) throw new Error(`Missing address in createOrderArgs()`);
    if (!this.cart.email) throw new Error(`Missing email in createOrderArgs()`);
    const items = this.cart.items
      .filter((i) => i.quantity > 0)
      .map((item): T.CreateOrder.Input['items'][0] => ({
        editionId: item.editionId,
        quantity: item.quantity,
        unitPrice: item.price(),
      }));
    const order: Omit<T.CreateOrder.Input, 'items'> = {
      id: this.orderId,
      paymentId: this.paymentIntentId,
      amount: this.cart.subTotal() + this.sumFees(),
      shipping,
      taxes,
      ccFeeOffset,
      fees,
      email: this.cart.email,
      shippingLevel: this.shippingLevel,
      addressName: this.cart.address.name,
      addressStreet: this.cart.address.street,
      addressStreet2: this.cart.address.street2,
      addressCity: this.cart.address.city,
      addressState: this.cart.address.state,
      addressZip: this.cart.address.zip,
      addressCountry: this.cart.address.country,
      source: `website`,
      lang: LANG as Lang,
    };
    return [order, items, this.token];
  }

  private resetState(): void {
    this.token = ``;
    this.orderId = ``;
    this.paymentIntentId = ``;
    this.paymentIntentClientSecret = ``;
    this.shippingLevel = `mail`;
    this.metadata = { fees: 0, shipping: 0, taxes: 0, ccFeeOffset: 0 };
    delete this.stripeError;
  }
}
