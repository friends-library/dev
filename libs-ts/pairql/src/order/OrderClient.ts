// auto-generated, do not edit
import type { Env } from '../types';
import type Result from '../Result';
import type * as P from './pairs';
import Client from '../Client';

export default class OrderClient extends Client {
  public constructor(env: Env, getToken: () => string | undefined) {
    super(env, `order`, getToken);
  }

  public static node(
    process: { argv: string[]; env: Record<string, string | undefined> },
    pattern?: string | undefined,
  ): OrderClient {
    return Client.inferNode(OrderClient, process, pattern);
  }

  public static web(href: string, getToken: () => string | undefined): OrderClient {
    return Client.inferWeb(OrderClient, href, getToken);
  }

  public brickOrder(input: P.BrickOrder.Input): Promise<Result<P.BrickOrder.Output>> {
    return this.query<P.BrickOrder.Output>(input, `BrickOrder`);
  }

  public createFreeOrderRequest(
    input: P.CreateFreeOrderRequest.Input,
  ): Promise<Result<P.CreateFreeOrderRequest.Output>> {
    return this.query<P.CreateFreeOrderRequest.Output>(input, `CreateFreeOrderRequest`);
  }

  public createOrder(input: P.CreateOrder.Input): Promise<Result<P.CreateOrder.Output>> {
    return this.query<P.CreateOrder.Output>(input, `CreateOrder`);
  }

  public getOrderInvoice(
    input: P.GetOrderInvoice.Input,
  ): Promise<Result<P.GetOrderInvoice.Output>> {
    return this.query<P.GetOrderInvoice.Output>(input, `GetOrderInvoice`);
  }

  public getPrintJobExploratoryMetadata(
    input: P.GetPrintJobExploratoryMetadata.Input,
  ): Promise<Result<P.GetPrintJobExploratoryMetadata.Output>> {
    return this.query<P.GetPrintJobExploratoryMetadata.Output>(
      input,
      `GetPrintJobExploratoryMetadata`,
    );
  }

  public initOrder(input: P.InitOrder.Input): Promise<Result<P.InitOrder.Output>> {
    return this.query<P.InitOrder.Output>(input, `InitOrder`);
  }

  public logJsError(input: P.LogJsError.Input): Promise<Result<P.LogJsError.Output>> {
    return this.query<P.LogJsError.Output>(input, `LogJsError`);
  }

  public sendOrderConfirmationEmail(
    input: P.SendOrderConfirmationEmail.Input,
  ): Promise<Result<P.SendOrderConfirmationEmail.Output>> {
    return this.query<P.SendOrderConfirmationEmail.Output>(
      input,
      `SendOrderConfirmationEmail`,
    );
  }
}
