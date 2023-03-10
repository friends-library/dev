import { describe, test, it, expect } from 'vitest';
import floatingClass from '../floating-class';

const opts = { lang: `en` as const };

describe(`floatingClass()`, () => {
  it(`creates a lint violation result for floating class line`, () => {
    const adoc = `[.foobar]\n\nFoo.\n`;
    const lines = adoc.split(`\n`);
    const results = floatingClass(lines[0]!, lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: false,
      type: `error`,
      rule: `floating-class`,
      message: `Class/id designations (like \`[.something]\`) may not be followed by an empty line`,
    });
  });

  const violations = [[`== Ch1\n\n[#foo]\n\nbar.`], [`[.bar]\n`]];

  test.each(violations)(`%s should be linted`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, index) => {
      const lineResults = floatingClass(line, lines, index + 1, opts);
      results = results.concat(...lineResults);
    });
    expect(results).toHaveLength(1);
  });

  const allowed = [
    [`[.foo]\n== Ch 1`],
    [`== Ch 1\n\n[.foobar]\nFoo.`],
    [`[.book-title]#Collection of Writings,# 1704, p. 29.]\n\nFoo.`],
  ];

  test.each(allowed)(`%s should not be linted`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, index) => {
      const lineResults = floatingClass(line, lines, index + 1, opts);
      results = results.concat(...lineResults);
    });
    expect(results).toHaveLength(0);
  });
});
