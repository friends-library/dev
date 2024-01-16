import { describe, it, expect } from 'vitest';
import { formatDuration } from '../dates';

describe(`formatDuration()`, () => {
  it(`correctly formats durations`, () => {
    expect(formatDuration(0)).toBe(`00:00`);
    expect(formatDuration(1)).toBe(`00:01`);
    expect(formatDuration(60)).toBe(`01:00`);
    expect(formatDuration(60 + 1)).toBe(`01:01`);
    expect(formatDuration(10 * 60 + 1)).toBe(`10:01`);
    expect(formatDuration(60 * 60 + 1)).toBe(`1:00:01`);
    expect(formatDuration(10 * 60 * 60 + 60 + 1)).toBe(`10:01:01`);
  });
});
