import React, { useEffect } from 'react';
import cx from 'classnames';
import FocusLock from 'react-focus-lock';
import { InstantSearch } from 'react-instantsearch-dom';
import Search from '../algolia/TopNavSearchInput';
import DropdownSearchResults from './DropdownSearchResults';
import { LANG } from '@/lib/env';
import { getClient } from '@/lib/algolia';

const searchClient = getClient();

interface Props {
  searching: boolean;
  setSearching(newValue: boolean): unknown;
  className?: string;
}

const TopNavSearch: React.FC<Props> = ({ className, searching, setSearching }) => {
  useEffect(() => {
    searching && focusInput();
  }, [searching]);

  return (
    <DismissSearch.Provider value={() => setSearching(false)}>
      <FocusLock
        disabled={!searching}
        returnFocus
        autoFocus={false}
        className={cx(
          className,
          `TopNavSearch flex-col justify-center items-end relative`,
          searching &&
            `flex-grow pl-4 sm:pl-8 md:pl-16 [&_form]:w-full [&_form]:max-w-[550px] [&_input]:w-full [&_input]:max-w-[550px]`,
          !searching && `flex-grow-0`,
        )}
        lockProps={{ onClick: () => !searching && setSearching(true) }}
      >
        <InstantSearch indexName={`${LANG}_docs`} searchClient={searchClient}>
          <Search searching={searching} defaultRefinement="" />
          {searching && <DropdownSearchResults />}
        </InstantSearch>
      </FocusLock>
    </DismissSearch.Provider>
  );
};

export default TopNavSearch;

export const DismissSearch = React.createContext<() => unknown>(() => {});

function focusInput(): void {
  const input: HTMLInputElement | null = document.querySelector(
    `.TopNavSearch .SearchInput__input`,
  );
  input && input.focus();
}
