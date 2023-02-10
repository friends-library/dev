import escape from 'escape-string-regexp';
import type { File, SearchResult, SearchResultContext } from '../type';

export function searchFiles(
  searchTerm: string,
  files: File[],
  words = true,
  caseSensitive = false,
  regexp = false,
): SearchResult[] {
  const results = files.reduce((acc, file) => {
    const lines = (file.editedContent || file.content || ``).split(/\n/);
    let pattern = regexp ? searchTerm : escape(searchTerm);
    if (words) {
      pattern = `\\b${pattern}\\b`;
    }

    let exp: RegExp;
    try {
      exp = new RegExp(pattern, `g${caseSensitive ? `` : `i`}`);
    } catch {
      return [];
    }

    lines.forEach((line, index) => {
      let match: RegExpExecArray | null = null;
      while ((match = exp.exec(line))) {
        const [documentSlug = ``, editionType = ``, filename = ``] = file.path.split(`/`);
        const result = {
          path: file.path,
          documentSlug,
          editionType,
          filename,
          start: {
            line: index + 1,
            column: match.index,
          },
          end: {
            line: index + 1,
            column: match.index + searchTerm.length,
          },
        };
        acc.push({
          ...result,
          context: getContext(result, lines),
        });
      }
    });
    return acc;
  }, [] as SearchResult[]);
  return results.sort(({ editionType }) => {
    switch (editionType) {
      case `updated`:
        return -1;
      case `modernized`:
        return 0;
      default:
        return 1;
    }
  });
}

function getContext(
  result: Omit<SearchResult, 'context'>,
  lines: string[],
): { lineNumber: number; content: string }[] {
  const context: SearchResultContext[] = [];
  const { start, end } = result;

  const beforeLineIndex = start.line - 2;
  const beforeLine = lines[beforeLineIndex] ?? ``;
  if (beforeLine.trim() !== ``) {
    context.push({
      lineNumber: beforeLineIndex + 1,
      content: beforeLine,
    });
  }

  const resultLines = end.line - start.line + 1;
  for (let i = 1; i <= resultLines; i++) {
    context.push({
      lineNumber: start.line + (i - 1),
      content: lines[start.line + (i - 2)] ?? ``,
    });
  }

  const afterLineIndex = end.line;
  const afterLine = lines[afterLineIndex] ?? ``;
  if (afterLine.trim() !== ``) {
    context.push({
      lineNumber: afterLineIndex + 1,
      content: afterLine,
    });
  }

  return context;
}
