import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from 'vitest';

test(`paths in static-pages.json`, () => {
  const rootDir = path.resolve(__dirname, `../../`);
  const json = fs.readFileSync(`${rootDir}/static-pages.json`, `utf8`);
  const pages: Array<[string, string | null]> = JSON.parse(json);
  let numFilesExpected = 0;
  for (const [srcSlug, esSlug] of pages) {
    numFilesExpected += 1;
    expect(fs.existsSync(`${rootDir}/mdx/${srcSlug}.en.mdx`)).toBe(true);
    if (esSlug) {
      expect(fs.existsSync(`${rootDir}/mdx/${srcSlug}.es.mdx`)).toBe(true);
      numFilesExpected += 1;
    }
  }

  const allStaticFiles = fs.readdirSync(`${rootDir}/mdx`);
  expect(allStaticFiles.length).toBe(numFilesExpected);
});
