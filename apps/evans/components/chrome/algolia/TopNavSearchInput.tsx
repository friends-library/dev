import React, { useState, useRef } from 'react';
import throttle from 'lodash.throttle';
import { connectSearchBox } from 'react-instantsearch-dom';
import SearchInput from '@/components/core/SearchInput';

interface Props {
  searching: boolean;
  refine: (newRefinement: string) => any;
}

const TopNavSearchInput: React.FC<Props> = ({ searching, refine }) => {
  const [query, setQuery] = useState<string>(``);
  // @ts-ignore
  const throttledSearch = useRef<(s: string) => any>(throttle(refine, 150));
  return (
    <SearchInput
      small
      lineColor="flprimary"
      inNav
      // purgeCSS: text-flgray-600
      textColor="flprimary-600"
      open={searching}
      query={query}
      setQuery={(newQuery) => {
        setQuery(newQuery);
        throttledSearch.current && throttledSearch.current(newQuery);
      }}
    />
  );
};

export default connectSearchBox(TopNavSearchInput);
