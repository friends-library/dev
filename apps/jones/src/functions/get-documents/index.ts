import DevClient from '@friends-library/pairql/dev';
import type { Handler } from '@netlify/functions';

const handler: Handler = async () => {
  const result = await client().editorDocumentMapResult();
  return result.reduce({
    success: (map) => ({ statusCode: 200, body: JSON.stringify(map) }),
    error: (error) => ({ statusCode: 500, body: JSON.stringify(error) }),
  });
};

export { handler };

// helpers

function client(): DevClient {
  const env = getEnv();
  const token = process.env[tokenKey(env)];
  return new DevClient(env, () => token);
}

function getEnv(): `staging` | `dev` | `prod` {
  if (process.env.NETLIFY && process.env.CONTEXT !== `production`) {
    return `staging`;
  } else if (process.env.API_DEV) {
    return `dev`;
  } else {
    return `prod`;
  }
}

function tokenKey(env: `staging` | `dev` | `prod`): string {
  switch (env) {
    case `dev`:
      return `FLP_API_TOKEN_DEV`;
    case `staging`:
      return `FLP_API_TOKEN_STAGING`;
    case `prod`:
      return `FLP_API_TOKEN_PROD`;
  }
}
