import { describe, test, it, expect } from 'vitest';
import stripIndent from 'strip-indent';
import unspacedClass from '../unspaced-class';

const opts = { lang: `en` as const };

describe(`unspacedClass()`, () => {
  it(`creates a lint for violation of \`unspaced-class\` rule`, () => {
    const adoc = `Foo\n[.class]`;
    const lines = adoc.split(`\n`);
    const results = unspacedClass(lines[1]!, lines, 2, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 2,
      column: false,
      type: `error`,
      rule: `unspaced-class`,
      message: `Class/id designations (like \`[.something]\`) must be preceded by an empty line`,
      fixable: true,
      recommendation: `--> add an empty line before line 2`,
    });
  });

  const violations: [string, number][] = [
    [
      stripIndent(`
        == Ch 1

        [.asterism]
        '''
        [.foo]
        Some bar.
      `).trim(),
      5,
    ],
  ];

  test.each(violations)(`multiline adoc should have lint error`, (adoc, lineNum) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(unspacedClass(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(1);
    expect(results[0]?.line).toBe(lineNum);
  });

  const allowed = [
    [`[#ch1, short="My title"]\n== Chapter 1`],
    [`Foo\n[.book-title]#Collection of Writings,# 1704, p. 29.]`],
  ];

  test.each(allowed)(`multiline adoc should not have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(unspacedClass(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(0);
  });
});
