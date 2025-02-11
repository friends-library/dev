import type { CommandBuilder } from 'yargs';

export const command = `make <pattern>`;

export const describe = `make consumable artifacts from a local path`;

export const builder: CommandBuilder = function (yargs) {
  return yargs
    .positional(`pattern`, {
      type: `string`,
      required: true,
      describe: `pattern to match repo dirs against`,
    })
    .option(`skip-open`, {
      alias: `o`,
      type: `boolean`,
      describe: `do not open created file/s`,
      default: false,
    })
    .option(`head`, {
      alias: `h`,
      type: `boolean`,
      describe: `render only first 100 lines of asciidoc`,
      default: false,
    })
    .option(`no-frontmatter`, {
      alias: `f`,
      type: `boolean`,
      describe: `skip frontmatter`,
      default: false,
    })
    .option(`isolate`, {
      alias: `i`,
      type: `number`,
      describe: `isolate a file by number`,
    })
    .option(`condense`, {
      type: `boolean`,
      describe: `condense size (very large books)`,
      default: false,
    })
    .option(`print-size`, {
      describe: `print size (target=\`pdf-print\` only)`,
      choices: [`s`, `m`, `xl`],
    })
    .option(`check`, {
      alias: `c`,
      type: `boolean`,
      describe: `validate epub`,
      default: false,
    })
    .option(`email`, {
      type: `string`,
      describe: `email address to send to`,
      default: false,
    })
    .option(`send`, {
      alias: `s`,
      type: `boolean`,
      describe: `send documents via email`,
      default: false,
    })
    .option(`skip-lint`, {
      type: `boolean`,
      describe: `bypass asciidoc linting`,
      default: false,
    })
    .option(`toc`, {
      type: `boolean`,
      describe: `only render chapter titles (useful for quickly working on table of contents TOC)`,
      default: false,
    })
    .option(`fix`, {
      type: `boolean`,
      describe: `auto-fix asciidoc lint errors`,
      default: false,
    })
    .option(`target`, {
      alias: `t`,
      type: `array`,
      coerce: (targets) => {
        return targets.reduce((acc: string[], target: string) => {
          switch (target) {
            case `pdf`:
              acc.push(`paperback-interior`, `web-pdf`);
              break;
            case `all`:
              acc.push(`paperback-interior`, `web-pdf`, `epub`);
              break;
            case `pi`:
              acc.push(`paperback-interior`);
              break;
            case `speech`:
            case `epub`:
            case `web-pdf`:
            case `paperback-interior`:
            case `app-ebook`:
              acc.push(target);
              break;
            default:
              throw new Error(`Unknown target: \`${target}\``);
          }
          return acc;
        }, []);
      },
      describe: `target format/s`,
      default: [`paperback-interior`],
    });
};

export { default as handler } from './handler';
