import type { PqlError } from './PqlError';

export type ResultData<T> /* */ =
  | { type: 'success'; value: T }
  | { type: 'error'; error: PqlError };

export default class Result<T> {
  protected constructor(private data: ResultData<T>) {}

  public static success<T>(value: T): Result<T> {
    return new Result<T>({ type: `success`, value });
  }

  public static error(error: PqlError): Result<never> {
    return new Result<never>({ type: `error`, error });
  }

  public with(config: {
    success?: (value: T) => unknown;
    error?: (error: PqlError) => unknown;
  }): void {
    if (this.data.type === `success`) {
      config.success?.(this.data.value);
    } else {
      config.error?.(this.data.error);
    }
  }

  public reduce<K>(config: {
    success: (value: T) => K;
    error: (error: PqlError) => K;
  }): K {
    if (this.data.type === `success`) {
      return config.success?.(this.data.value);
    } else {
      return config.error(this.data.error);
    }
  }

  public mapOrThrow<K>(mapFn: (value: T) => K): K {
    return this.reduce({
      success: mapFn,
      error: (error) => {
        throw error;
      },
    });
  }

  public async mapOrRethrow<K>(
    mapFn: (value: T) => K,
    errFn: (error: PqlError) => Promise<never>,
  ): Promise<K> {
    if (this.data.type === `success`) {
      return mapFn(this.data.value);
    } else {
      await errFn(this.data.error);
      throw this.data.error; // keep typescript happy
    }
  }

  public unwrap(): T {
    if (this.data.type === `success`) {
      return this.data.value;
    }
    throw new Error(`PqlError: ${JSON.stringify(this.data.error)}`);
  }

  public unwrapWith404(f: (e: PqlError) => unknown): T {
    return this.reduce({
      success: (v) => v,
      error: (e) => {
        if (e.statusCode === 404) {
          f(e);
        }
        throw e;
      },
    });
  }

  public get value(): T | undefined {
    if (this.data.type === `success`) {
      return this.data.value;
    }
    return undefined;
  }

  public get error(): PqlError | undefined {
    if (this.data.type === `error`) {
      return this.data.error;
    }
    return undefined;
  }

  public get isSuccess(): boolean {
    return this.data.type === `success`;
  }

  public get isError(): boolean {
    return this.data.type === `error`;
  }
}
