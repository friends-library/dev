import dotenv from 'dotenv';

function load(path: string): void {
  dotenv.config({ path });
}

function getEnv<T extends string>(required: boolean, ...keys: T[]): { [k in T]: string } {
  const obj = {} as { [k in T]: string };
  keys.forEach((key) => {
    const val = process.env[key];
    if (
      required &&
      typeof val !== `string` &&
      typeof process.env.VITEST === `undefined`
    ) {
      throw new Error(`Env var \`${key}\` is required.`);
    }
    obj[key] = typeof val === `string` ? val : ``;
  });
  return obj;
}

const get: <T extends string>(...keys: T[]) => { [k in T]: string } = (...keys) => {
  return getEnv(false, ...keys);
};

const req: <T extends string>(...keys: T[]) => { [k in T]: string } = (...keys) => {
  return getEnv(true, ...keys);
};

function has(key: string): boolean {
  try {
    /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
    req(key)[key];
    return true;
  } catch {
    return false;
  }
}

function truthy(key: string): boolean {
  const value = get(key)[key];
  return value !== `` && value !== `false` && value !== `0`;
}

function requireVar(key: string): string {
  return req(key)[key] ?? ``;
}

function variable(key: string): string {
  return get(key)[key] ?? ``;
}

export default {
  get,
  require: req,
  has,
  truthy,
  var: variable,
  requireVar,
  load,
};
