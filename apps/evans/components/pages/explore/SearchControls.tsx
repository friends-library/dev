import React from 'react';
import { t, translate } from '@friends-library/locale';
import type { EditionType } from '@friends-library/types';
import type { Period, Region } from '@/lib/types';
import ActiveFilters from './ActiveFilters';
import FilterControls from './FilterControls';

interface Filter {
  text: string;
  clear(): unknown;
}

type FilterType = 'edition' | 'tag' | 'period' | 'region';

interface Group {
  label: string;
  filters: Filter[];
}

interface BookMeta {
  editionType: EditionType;
  tags: string[];
  period: Period;
  region: Region;
}

interface Props {
  books: BookMeta[];
  filters: string[];
  setFilters(filters: string[]): unknown;
  searchQuery: string;
  setSearchQuery(query: string): unknown;
}

const SearchControls: React.FC<Props> = ({
  books,
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
}) => {
  const groups = groupify(filters, setFilters, books);
  return (
    <>
      <FilterControls
        activeFilters={filters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveFilters={setFilters}
      />
      {groups.length > 0 && (
        <ActiveFilters groups={groups} clearAll={() => setFilters([])} />
      )}
    </>
  );
};

export default SearchControls;

function groupify(
  filters: string[],
  setFilters: (filters: string[]) => unknown,
  books: BookMeta[],
): { label: string; filters: { text: string; clear(): unknown }[] }[] {
  const groups: { [k in FilterType]: Group } = {
    edition: { label: `Editions`, filters: [] },
    tag: { label: t`Tags`, filters: [] },
    period: { label: `Periods`, filters: [] },
    region: { label: `Regions`, filters: [] },
  };

  filters.forEach((filter) => {
    const [type, value] = filter.split(`.`) as [FilterType, string];

    const makeItem: (fn: (book: Props['books'][0]) => boolean) => Filter = (fn) => ({
      text: `${translate(value.replace(/-us$/, ` US`))} (${books.filter(fn).length})`,
      clear: () => setFilters(filters.filter((f) => f !== filter)),
    });

    switch (type) {
      case `edition`:
        groups.edition.filters.push(makeItem((b) => b.editionType === value));
        break;
      case `tag`:
        groups.tag.filters.push(makeItem((b) => b.tags.includes(value)));
        break;
      case `period`:
        groups.period.filters.push(makeItem((b) => b.period === value));
        break;
      case `region`:
        groups.region.filters.push(
          makeItem((b) => b.region.toLowerCase().replace(/ /, `-`) === value),
        );
        break;
    }
  });

  return Object.values(groups).filter((group) => group.filters.length);
}
