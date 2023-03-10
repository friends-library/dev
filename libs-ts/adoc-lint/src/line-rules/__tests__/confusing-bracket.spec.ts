import { describe, test, it, expect } from 'vitest';
import confusingBracket from '../confusing-bracket';

const opts = { lang: `en` as const };

describe(`confusingBracket()`, () => {
  it(`lints invalid syntax caused by trailing bracket`, () => {
    const adoc = `[.book-title]#Apology#, foo]`;
    const results = confusingBracket(adoc, [], 2, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 2,
      column: false,
      type: `error`,
      rule: `confusing-bracket`,
      message: `Line-ending bracket needs to be escaped because the line starts with a [.book-title]`,
      recommendation: `[.book-title]#Apology#, foo+++]+++`,
    });
  });

  const violations = [
    [`[.book-title]#Some book#, blah ]`, `[.book-title]#Some book#, blah +++]+++`],
  ];

  test.each(violations)(`%s should be %s`, (line, reco) => {
    const results = confusingBracket(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]?.recommendation).toBe(reco);
  });

  const allowed = [
    [`Foo [.book-title]#Apology#, foo]`],
    [`[.book-title]#Apology#, foo+++]+++`],
    [`[.some-random-class, short="foo"]`],
  ];

  test.each(allowed)(`%s is not a lint violation`, (line) => {
    expect(confusingBracket(line, [], 1, opts)).toHaveLength(0);
  });
});
