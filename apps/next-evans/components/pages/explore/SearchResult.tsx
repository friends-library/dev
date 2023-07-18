import React from 'react';
import { Front } from '@friends-library/cover-component';
import Link from 'next/link';
import type { DocumentWithMeta, EditionType } from '@/lib/types';
import { getDocumentUrl, isCompilations } from '@/lib/friend';
import { LANG } from '@/lib/env';

const SearchResult: React.FC<
  Pick<
    DocumentWithMeta,
    | 'title'
    | 'slug'
    | 'customCSS'
    | 'customHTML'
    | 'isbn'
    | 'authorSlug'
    | 'authorName'
    | 'authorGender'
  > & {
    edition: EditionType;
  }
> = (book) => (
  <Link href={getDocumentUrl(book)}>
    <Front
      lang={LANG}
      isCompilation={isCompilations(book.authorName)}
      author={book.authorName}
      customCss={book.customCSS ?? ``}
      customHtml={book.customHTML ?? ``}
      className="mx-1"
      scaler={1 / 3}
      scope="1-3"
      {...book}
      size="m"
    />
  </Link>
);

export default SearchResult;
