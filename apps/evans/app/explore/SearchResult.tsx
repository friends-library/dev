import React from 'react';
import { Front } from '@friends-library/cover-component';
import Link from 'next/link';
import type { EditionType } from '@/lib/types';
import { getDocumentUrl } from '@/lib/friend';
import { LANG } from '@/lib/env';

interface Props {
  authorName: string;
  authorSlug: string;
  documentSlug: string;
  documentTitle: string;
  isCompilation: boolean;
  editionType: EditionType;
  isbn: string;
  customCss?: string;
  customHtml?: string;
}

const SearchResult: React.FC<Props> = (book) => (
  <Link href={getDocumentUrl(book.authorSlug, book.documentSlug)}>
    <Front
      lang={LANG}
      isCompilation={book.isCompilation}
      edition={book.editionType}
      author={book.authorName}
      customCss={book.customCss ?? ``}
      customHtml={book.customHtml ?? ``}
      title={book.documentTitle}
      isbn={book.isbn}
      className="mx-1"
      scaler={1 / 3}
      scope="1-3"
      size="m"
    />
  </Link>
);

export default SearchResult;
