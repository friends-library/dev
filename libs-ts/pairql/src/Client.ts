import type { Env, Domain } from './types';
import { isPqlError } from './PqlError';
import Result from './Result';

export default abstract class Client {
  private env: Env;
  private domain: Domain;
  private getToken: () => string | undefined;

  protected constructor(env: Env, domain: Domain, getToken: () => string | undefined) {
    this.env = env;
    this.domain = domain;
    this.getToken = getToken;
  }

  protected static inferWeb<T extends Client>(
    Domain: new (env: Env, getToken: () => string | undefined) => T,
    href: string,
    getToken: () => string | undefined,
  ): T {
    let env: Env = `dev`;
    if (
      href.includes(`vercel.app`) ||
      href.startsWith(`https://deploy-preview-`) ||
      (href.startsWith(`https://`) && href.includes(`--staging`))
    ) {
      env = `staging`;
    } else if (href.startsWith(`http://`)) {
      env = `dev`;
    } else {
      env = `prod`;
    }

    if (env !== `prod`) {
      // eslint-disable-next-line no-console
      console.log(`[,] FLP PairQL client configured for env: ${env.toUpperCase()}`);
    }

    return new Domain(env, getToken);
  }

  protected static inferNode<T extends Client>(
    Domain: new (env: Env, getToken: () => string | undefined) => T,
    process: { argv: string[]; env: Record<string, string | undefined> },
    pattern?: string | undefined,
  ): T {
    let env: Env = `dev`;
    if (
      process.argv.includes(`--api-staging`) ||
      process.env.API_STAGING ||
      process.env.VERCEL_ENV === `preview`
    ) {
      env = `staging`;
    } else if (process.argv.includes(`--api-dev`) || process.env.API_DEV) {
      env = `dev`;
    } else {
      env = `prod`;
    }

    // `DEV` | `STAGING` | `PROD`
    const envFrag = env.toUpperCase();
    const placeholder = `{{env}}`;
    let token: string | undefined = undefined;

    if (!pattern) {
      token = requireEnvVar(`FLP_API_TOKEN_${envFrag}`, process.env);
    } else if (!pattern.includes(placeholder)) {
      throw new Error(`Token input pattern must include \`${placeholder}\``);
    } else {
      const key = pattern.replace(placeholder, envFrag);
      token = requireEnvVar(key, process.env);
    }

    // eslint-disable-next-line no-console
    console.log(`\n[,] FLP PairQL client configured for env: ${env.toUpperCase()}\n`);

    return new Domain(env, () => token);
  }

  protected async query<Output>(
    input: unknown,
    operation: string,
  ): Promise<Result<Output>> {
    const headers: Record<string, string> = { 'Content-Type': `application/json` };
    const token = this.getToken();

    if (token) {
      headers[`Authorization`] = `Bearer ${token}`;
    }

    const init: RequestInit = {
      method: `POST`,
      headers,
      body: input === undefined ? undefined : JSON.stringify(input),
    };

    try {
      const res = await fetch(this.endpoint(operation), init);
      const text = await res.text();
      try {
        var json = JSON.parse(text);
      } catch {
        return this.errorResult(`JSON parse error, body=${text}`, 500);
      }
      if (res.status >= 300) {
        return this.errorResult(json, res.status);
      } else {
        return Result.success(json);
      }
    } catch (error) {
      return this.errorResult(error, 500);
    }
  }

  protected endpoint(operation: string): string {
    const path = `pairql/${this.domain.toLowerCase()}/${operation}`;
    switch (this.env) {
      case `dev`:
        return `http://127.0.0.1:8080/${path}`;
      case `staging`:
        return `https://api--staging.friendslibrary.com/${path}`;
      case `prod`:
        return `https://api.friendslibrary.com/${path}`;
    }
  }

  protected errorResult(error: unknown, statusCode: number): Result<never> {
    if (this.env !== `prod`) {
      console.error(`PqlError`, error); // eslint-disable-line no-console
    }
    return Result.error(
      isPqlError(error)
        ? error
        : {
            id: `95375ae5`,
            requestId: `unknown`,
            type: `other`,
            detail: `Unexpected error: ${JSON.stringify(error)}`,
            statusCode,
          },
    );
  }
}

function requireEnvVar(key: string, env: Record<string, string | undefined>): string {
  const value = env[key];
  if (!value) {
    throw new Error(
      `Missing required environment var: \`${key}\` for inferring pairql client token`,
    );
  }
  return value;
}
