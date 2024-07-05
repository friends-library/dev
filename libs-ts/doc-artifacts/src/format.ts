import prettier from 'prettier';
import env from '@friends-library/env';
import { red } from 'x-chalk';

export default async function format(
  path: string,
  code: string | Buffer | undefined,
): Promise<string | Buffer> {
  if (code === undefined) {
    throw new Error(`Unexpected missing source code at \`${path}\``);
  }

  if (typeof code !== `string`) {
    return code;
  }

  try {
    let formatted = code;
    if (path.endsWith(`.html`) || path.endsWith(`.xhtml`)) {
      formatted = await prettier.format(formatted, {
        parser: `html`,
        htmlWhitespaceSensitivity: `strict`,
      });
    } else if (path.endsWith(`.css`)) {
      formatted = await prettier.format(formatted, { parser: `css` });
      formatted = formatted
        .replace(/^};$/gm, `}`)
        .replace(/@page: ([^ ]+)\{/gm, `@page:$1 {`);
    }
    return formatted;
  } catch (err) {
    if (env.truthy(`DEBUG_ARTIFACT_SRC`)) {
      process.stdout.write(`${err}\n`);
      red(`Error formatting cource code at ${path}, using un-formatted source instead`);
      return code;
    } else {
      red(
        `Error formatting source code at ${path}, set DEBUG_ARTIFACT_SRC=true to bypass error and proceed with incorrect and unformatted source code`,
      );
      throw err;
    }
  }
}
