import fs from 'fs';
import prettier from '@prettier/sync';
import stripIndent from 'strip-indent';
import { genericDpc } from '@friends-library/types';
import type { DocPrecursor } from '@friends-library/types';

type TestCase = [title: string, expectedContent: string, actualContent: string];

export function getTestCases<T>(
  filename: string,
  evaluator: (dpc: DocPrecursor) => T,
  selector: (src: T) => string,
  supplyMissingChapterHeadings = false,
): Array<TestCase> {
  const file = fs.readFileSync(`${__dirname}/${filename}`, `utf-8`);
  const tests = file.split(/## /g);
  consume(tests, `comment`);

  return (
    tests
      .map((block) => {
        const lines = block.split(`\n`);
        const title = lines.shift() ?? ``;

        consume(lines, `comment`);
        consume(lines, `empty`);

        const files: Array<{ adoc: string; filename: string }> = [];
        let chapterHeadingOmitted = false;

        // create a {adoc: string, filename: string} obj for each "file"
        while (lines[0] === `****`) {
          // buffer up asciidoc into `adocLines`
          const adocLines: string[] = [];
          consume(lines, `adoc-delim`);
          while (lines[0] !== `****`) {
            adocLines.push(lines.shift() ?? ``);
          }

          let adoc = adocLines.join(`\n`);
          if (!adoc.match(/^== /m)) {
            chapterHeadingOmitted = true;
            adoc = `== Preface\n\n${adoc}`;
          }

          files.push({ adoc: adoc, filename: `0${files.length + 1}-journal.adoc` });
          consume(lines, `adoc-delim`);
          consume(lines, `empty`);
        }

        // files array is complete, parse expected outcome html
        consume(lines, `text-delim`);
        const expectedLines: string[] = [];
        while (lines[0] !== `++++`) {
          expectedLines.push(lines.shift() ?? ``);
        }

        let expectedOutput = expectedLines.join(`\n`);
        if (chapterHeadingOmitted && supplyMissingChapterHeadings) {
          expectedOutput = [
            `<div id="chapter-1" class="chapter chapter-1 chapter--no-signed-section">`,
            `<!-- preface chapter heading markup here -->`,
            expectedOutput,
            `</div>`,
          ].join(`\n`);
        }

        expectedOutput = expectedOutput.replace(
          `<!-- preface chapter heading markup here -->`,
          `<header class="chapter-heading" data-short="Preface"><h2>Preface</h2></header>`,
        );

        const dpc = getDpc(...files.map((f) => f.adoc));
        return { title, expected: prettify(expectedOutput), dpc };
      })
      // isolate (only tests)
      .reduce(
        (acc, testCase) => {
          if (testCase.title.includes(`(only)`)) {
            return [testCase];
          }
          return [...acc, testCase];
        },
        [] as Array<{ title: string; expected: string; dpc: DocPrecursor }>,
      )
      .map((testCase) => [
        testCase.title,
        testCase.expected,
        prettify(selector(evaluator(testCase.dpc))),
      ])
  );
}

function consume(
  lines: string[],
  type: `comment` | `empty` | `adoc-delim` | `text-delim`,
) {
  const consumed = lines.shift();
  if (consumed === undefined) {
    throw new Error(`Nothing to consume, expected: ${type}`);
  } else if (type === `adoc-delim` && consumed !== `****`) {
    throw new Error(`Expected to consume "${type}", got ${consumed}`);
  } else if (type === `text-delim` && consumed !== `++++`) {
    throw new Error(`Expected to consume "${type}", got ${consumed}`);
  } else if (type === `empty` && consumed !== ``) {
    throw new Error(`Expected to consume "${type}", got ${consumed}`);
  } else if (type === `comment` && !consumed.startsWith(`// `)) {
    throw new Error(`Expected to consume "${type}", got ${consumed}`);
  }
}

function getDpc(...files: string[]): DocPrecursor {
  const dpc = genericDpc();
  files.forEach((adoc, idx) => {
    dpc.asciidocFiles[idx] = {
      adoc: stripIndent(adoc.trim() + `\n`),
      filename: `0${idx + 1}-journal.adoc`,
    };
  });
  return dpc;
}

function prettify(rawHtml: string): string {
  const preprocessed = rawHtml
    .replace(/\n/g, ``)
    .replace(/  +/g, ` `)
    .replace(/> </g, `><`)
    .replace(/ </g, `<`)
    .replace(/> /g, `>`);
  return prettier.format(preprocessed, {
    parser: `html`,
    htmlWhitespaceSensitivity: `ignore`,
  });
}
