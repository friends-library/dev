import bookJson from './books.json';
import { toNumber } from './convert';
import { romanSingleOrRange, colonComma, colonSingleOrRange, romanComma } from './verses';
import { incorrectAmbiguous } from './disambiguate';

const books: {
  name: string;
  abbreviations: string[];
}[] = bookJson;

export interface Ref {
  book: string;
  contiguous: boolean;
  verses: {
    chapter: number;
    verse?: number;
  }[];
  match: string;
  position: {
    start: number;
    end: number;
  };
}

const ROM = `(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})`;
const ARAB = `[\\d]{1,3}`;

function absorbRight(ref: Ref, input: string): Ref {
  const {
    position: { end },
  } = ref;
  const afterRef = input.substr(end);
  const match = afterRef.match(/^(?:[.|:|;|,])? *\)/);
  if (!match) {
    return ref;
  }

  const absorbed = match[0].substr(0, match[0].length - 1);
  return {
    ...ref,
    match: ref.match.concat(absorbed),
    position: {
      ...ref.position,
      end: ref.position.end + absorbed.length,
    },
  };
}

function isValidChapter(book: string, chapter: number): boolean {
  if (chapter < 1) return false;
  const bookData = bookJson.find((b) => b.name === book);
  if (!bookData || chapter > bookData.chapters) {
    return false;
  }
  return true;
}

function extractRef(book: string, chapter: number, match: RegExpExecArray): Ref | null {
  if (!isValidChapter(book, chapter)) {
    return null;
  }

  const start = match.index + match[0].length;
  const context = match.input.substring(start, start + 25);

  // order matters!
  const strategies = [romanComma, colonComma, romanSingleOrRange, colonSingleOrRange];

  let ref: Ref = {
    book,
    contiguous: true,
    match: ``,
    verses: [],
    position: {
      start: match.index,
      end: -1,
    },
  };

  strategies.forEach((strategy) => {
    if (ref.position.end !== -1) {
      return;
    }

    ref = strategy(start, context, ref, chapter);
  });

  if (ref.position.end === -1) {
    // try to grab chapter-only refs, but be more selective
    ref.match = match[0];

    // weed out stuff like `is, 1`
    const firstChar = ref.match[0];
    if (!firstChar.match(/^\d$/) && firstChar.toLowerCase() === firstChar) {
      return null;
    }

    // So, I - is not a ref to Song of Solomon 1
    if (ref.match.match(/^So\b/)) {
      return null;
    }

    // Am I... should not be converted to Amos 1
    if (ref.match.match(/^Am I\b/)) {
      return null;
    }

    ref.verses.push({ chapter });
    ref.position.end = ref.position.start + ref.match.length;
    return ref;
  }

  const { position } = ref;
  ref.match = match.input.substr(position.start, position.end - position.start);

  ref = absorbRight(ref, match.input);

  if (incorrectAmbiguous(ref, match.input)) {
    return null;
  }

  return ref;
}

export function find(str: string): Ref[] {
  const refs: Ref[] = [];
  books.forEach((book) => {
    let pattern = book.abbreviations
      .concat([book.name])
      .map((abbrev) => abbrev.replace(`.`, `\\.`))
      .join(`|`);

    pattern = `\\b(?:${pattern})(?:\\.|,)? (${ARAB}|${ROM})\\b`;
    const exp = new RegExp(pattern, `gi`);
    let match: RegExpExecArray | null = null;
    while ((match = exp.exec(str))) {
      const chapter = toNumber(match[1]) as number;
      if (chapter === 0) {
        continue;
      }
      const ref = extractRef(book.name, chapter, match);
      if (ref) {
        refs.push(ref);
      }
    }
  });
  return refs;
}
