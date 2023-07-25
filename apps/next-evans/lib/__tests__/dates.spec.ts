import { describe, expect, test } from 'vitest';
import { formatDuration } from '../dates';

describe(`test formatDuration function`, () => {
  const cases: Array<[number, string]> = [
    [185, `3:05`],
    [11105, `3:05:05`],
    [19183, `5:19:43`],
    [3318, `55:18`],
    [3203, `53:23`],
    [9720, `2:42:00`],
    [3, `3`],
  ];
  test.each(cases)(`formatDuration(%d) === %s`, (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });
});
