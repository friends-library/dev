import OrderClient, { type T } from '@friends-library/pairql/order';
import { LANG } from '@/lib/env';

export default class CheckoutApi {
  private client: OrderClient;
  private token: string | undefined;

  public constructor() {
    const href = typeof globalThis.window === `undefined` ? `` : window.location.href;
    this.client = OrderClient.web(href, () => this.token);
  }

  public async brickOrder(
    stateHistory: string[],
    orderId: string,
    orderPaymentId: string,
  ): Promise<void> {
    await this.client.brickOrder({
      orderId,
      orderPaymentId,
      stateHistory,
      userAgent: navigator ? navigator.userAgent : undefined,
    });
  }

  public async createOrderInitialization(
    amountInCents: number,
  ): Promise<{ success: true; data: T.InitOrder.Output } | { success: false }> {
    const result = await this.client.initOrder(amountInCents);
    if (result.isSuccess) {
      return { success: true, data: result.unwrap() };
    } else {
      return { success: false };
    }
  }

  public async getExploratoryMetadata(
    items: T.GetPrintJobExploratoryMetadata.Input['items'],
    address: T.ShippingAddress & { email: string },
  ): Promise<
    | { status: `success`; metadata: T.ExploratoryMetadata }
    | { status: `shipping_address_error`; message: string }
    | { status: `shipping_not_possible` }
    | { status: `error` }
  > {
    const reqResult = await this.client.getPrintJobExploratoryMetadata({
      items,
      address,
      email: address.email,
      lang: LANG,
    });
    if (reqResult.isSuccess) {
      const result = reqResult.unwrap();
      switch (result.case) {
        case `success`:
          return { status: `success`, metadata: result.metadata };
        case `shippingAddressError`:
          return { status: `shipping_address_error`, message: result.message };
        case `shippingNotPossible`:
          return { status: `shipping_not_possible` };
      }
    }
    return { status: `error` };
  }

  public async createOrder(
    order: Omit<T.CreateOrder.Input, 'items'>,
    items: T.CreateOrder.Input['items'],
    token: string,
  ): Promise<boolean> {
    this.token = token;
    const result = await this.client.createOrder({ ...order, items: items });
    return result.isSuccess;
  }

  public async chargeCreditCard(
    charge: () => Promise<{ error?: Error }>,
  ): Promise<
    | { status: `success` }
    | { status: `user_actionable_error`; error: string }
    | { status: `error`; error: string }
  > {
    try {
      const response = await charge();
      if (response.error) {
        return { status: `user_actionable_error`, error: response.error.message };
      } else {
        return { status: `success` };
      }
    } catch (error) {
      return { status: `error`, error: String(error) };
    }
  }

  public async sendOrderConfirmationEmail(orderId: string): Promise<boolean> {
    try {
      await this.client.sendOrderConfirmationEmail(orderId);
      return true;
    } catch {
      return false;
    }
  }
}
