// auto-generated, do not edit
import type { Env } from '../types';
import type Result from '../Result';
import type * as P from './pairs';
import Client from '../Client';

export default class EvansClient extends Client {
  public constructor(env: Env, getToken: () => string | undefined) {
    super(env, `evans`, getToken);
  }

  public static node(
    process: { argv: string[]; env: Record<string, string | undefined> },
    pattern?: string | undefined,
  ): EvansClient {
    return Client.inferNode(EvansClient, process, pattern);
  }

  public static web(href: string, getToken: () => string | undefined): EvansClient {
    return Client.inferWeb(EvansClient, href, getToken);
  }

  public logJsError(input: P.LogJsError.Input): Promise<Result<P.LogJsError.Output>> {
    return this.query<P.LogJsError.Output>(input, `LogJsError`);
  }

  public submitContactForm(
    input: P.SubmitContactForm.Input,
  ): Promise<Result<P.SubmitContactForm.Output>> {
    return this.query<P.SubmitContactForm.Output>(input, `SubmitContactForm`);
  }

  public subscribeToNarrowPath(
    input: P.SubscribeToNarrowPath.Input,
  ): Promise<Result<P.SubscribeToNarrowPath.Output>> {
    return this.query<P.SubscribeToNarrowPath.Output>(input, `SubscribeToNarrowPath`);
  }
}
