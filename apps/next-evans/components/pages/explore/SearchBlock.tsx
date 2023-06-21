import React, { useState, useEffect } from 'react';
import { t } from '@friends-library/locale';
import type { DocumentWithMeta, Edition, Period, Region } from '@/lib/types';
import SearchControls from './SearchControls';
import SearchResult from './SearchResult';
import { getDocumentUrl } from '@/lib/friend';
import BackgroundImage from '@/components/core/BackgroundImage';
import RiverPath from '@/public/images/water-path.jpg';

interface Props {
  initialFilters?: string[];
  initialUsed?: boolean;
  books: Array<
    Omit<DocumentWithMeta, 'numPages' | 'size'> & {
      period: Period;
      region: Region;
      edition: Edition;
    }
  >;
}

const SearchBlock: React.FC<Props> = ({ books, initialFilters, initialUsed }) => {
  const [filters, setFilters] = useState<string[]>(initialFilters || []);
  const [used, setUsed] = useState<boolean>(initialUsed || false);
  const [query, setQuery] = useState<string>(``);
  const matches = match(books, filters, query.toLowerCase().trim());

  useEffect(() => {
    if (!used && userHasInteractedWithSearch(query, filters, initialFilters)) {
      setUsed(true);
    }
  }, [filters, query, initialFilters, used]);

  return (
    <div id="SearchBlock">
      <SearchControls
        books={books}
        filters={filters}
        setFilters={setFilters}
        searchQuery={query}
        setSearchQuery={setQuery}
      />
      {matches.length > 0 && (
        <div className="flex flex-wrap justify-center py-8 bg-flgray-100">
          {matches.map((book) => (
            <SearchResult
              key={`${getDocumentUrl(book.authorSlug, book.slug)}/${book.edition}`}
              {...book}
            />
          ))}
        </div>
      )}
      {matches.length === 0 && (
        <BackgroundImage src={RiverPath} fit="cover" position="object-bottom">
          <div className="bg-gradient-to-b from-black/30 to-black/30 px-16 sm:px-32 flex flex-col justify-center min-h-[45vh]">
            <p className="text-white text-2xl sm:text-3xl sans-wider text-center">
              {used
                ? t`Your search returned no results`
                : `^ ${t`Select a filter or search to get started!`}`}
            </p>
          </div>
        </BackgroundImage>
      )}
    </div>
  );
};

export default SearchBlock;

function match(books: Props['books'], filters: string[], search: string): Props['books'] {
  if (!filters.length && search.length < 2) {
    return [];
  }

  return books.filter((book) => {
    if (search && search.length > 1) {
      if (
        !book.title.toLowerCase().includes(search) &&
        !book.authorName.toLowerCase().includes(search)
      ) {
        return false;
      }
    }

    for (const filter of filters) {
      const [type = ``, value = ``] = filter.split(`.`);
      if (type === `edition` && book.edition !== value) {
        return false;
      }
      if (type === `period` && book.period !== value) {
        return false;
      }
      if (type === `region` && !regionMatches(value, book)) {
        return false;
      }
      if (type === `tag` && !book.tags.includes(value)) {
        return false;
      }
    }
    return true;
  });
}

function regionMatches(region: string, book: Props['books'][0]): boolean {
  const compare = book.region.toLowerCase().replace(/ /g, `-`);
  return region === compare;
}

function userHasInteractedWithSearch(
  query: string,
  filters: string[],
  initialFilters?: string[],
): boolean {
  return !!(
    query !== `` || JSON.stringify(filters) !== JSON.stringify(initialFilters || [])
  );
}
