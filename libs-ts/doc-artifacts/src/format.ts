import prettier from 'prettier';
import env from '@friends-library/env';
import { red } from 'x-chalk';

export default function format(
  path: string,
  code: string | Buffer | undefined,
): string | Buffer {
  if (code === undefined) {
    throw new Error(`Unexpected missing source code at \`${path}\``);
  }

  if (typeof code !== `string`) {
    return code;
  }

  try {
    let formatted = code;
    if (path.endsWith(`.html`) || path.endsWith(`.xhtml`)) {
      formatted = pformat(formatted, {
        parser: `html`,
        htmlWhitespaceSensitivity: `strict`,
      });
    } else if (path.endsWith(`.css`)) {
      formatted = pformat(formatted, { parser: `css` });
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

// workaround issue where pnpm loads the correct 2.x.x version of prettier
// but typescript typechecks agains the workspace 3.x.x version
// prettier 3.x has an async api for format, plus breaks xhtml compat
// by uppercasing `!doctype`, which causes problems for our epubs
function pformat(
  code: string,
  opts: {
    parser: 'css' | 'html';
    htmlWhitespaceSensitivity?: 'css' | 'strict' | 'ignore';
  },
): string {
  // ensure we're loading the version we think we are
  if (!prettier.version.startsWith(`2`)) {
    throw new Error(`Prettier version must be with 2.x.x`);
  }
  // @ts-ignore (typescript sees wrong version)
  return prettier.format(code, opts);
}
