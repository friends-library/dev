import React from 'react';
import cx from 'classnames';
import { connectStateResults, Index, Configure } from 'react-instantsearch-dom';
import { t } from '@friends-library/locale';
import Image from 'next/image';
import IndexResults from './IndexResults';
import { BookHit, FriendHit, PageHit } from './SearchHits';
import Pagination from './Pagination';
import { LANG } from '@/lib/env';
import AlgoliaLogo from '/public/images/algolia-logo.png';

interface Props {
  className?: string;
  allSearchResults: Record<string, { nbHits: number }>;
  searchState: { query?: string; page: number };
}

const DropdownSearchResults: React.FC<Props> = ({
  className,
  allSearchResults: allResults,
  searchState: { query = `` },
}) => {
  const hasResults =
    allResults && Object.values(allResults).some((r) => r && r.nbHits > 0);
  if (!hasResults && query.length < 3) {
    return (
      <div className={cx(query.length < 3 && `hidden`)}>
        <Index indexName={`${LANG}_docs`} />
        <Index indexName={`${LANG}_friends`} />
        <Index indexName={`${LANG}_pages`} />
      </div>
    );
  }
  return (
    <div
      className={cx(
        className,
        `[box-shadow:_10px_22px_45px_-5px_rgba(0,_0,_0,_0.3),1px_39px_40px_-5px_rgba(0,0,0,0.4)] border border-flgray-400 rounded-md bg-white max-w-[calc(100vw-20px)] min-w-[calc(100vw-16px)] translate-x-[13px]`,
        `min-[490px]:max-w-[560px] min-[490px]:min-w-[450px] transform-none`,
        `absolute right-0 top-0 mt-16`,
        `before:block before:absolute before:w-[14px] before:h-[14px] before:bg-white before:z-50 before:-top-2 before:right-10 before:border-t before:border-r before:border-flgray-400 before:-rotate-45 before:rounded-[2px]`,
        `[&_.ais-Hits-item:hover]:bg-flgray-200 [&_.ais-Hits-item_a:focus]:bg-flgray-200 [&_.ais-Hits-item:last-child_a]:border-0 md:min-w-[560px]`,
      )}
    >
      <div className="p-3 max-h-[calc(100vh-75px)] overflow-auto">
        {!hasResults && (
          <p className="text-center px-2 py-3 text-gray-800 tracking-wide">
            {t`No results for query`}:{` `}
            <b className="antialiased">&ldquo;{query}&rdquo;</b>
          </p>
        )}
        <Configure hitsPerPage={3} />
        <Index indexName={`${LANG}_docs`}>
          <IndexResults title={t`Books`} icon="fa-book" HitComponent={BookHit} />
          <Pagination />
        </Index>
        <Index indexName={`${LANG}_friends`}>
          <IndexResults title={t`Friends`} icon="fa-users" HitComponent={FriendHit} />
          <Pagination />
        </Index>
        <Index indexName={`${LANG}_pages`}>
          <IndexResults title={t`Pages`} icon="fa-file-text" HitComponent={PageHit} />
          <Pagination />
        </Index>
      </div>
      <div className="flex px-2 pb-2 justify-end items-center gap-1">
        <span className="text-sm text-gray-400">
          {LANG === `en` ? `Search by Algolia` : `Buscar por Algolia`}
        </span>
        <Image src={AlgoliaLogo} alt="Algolia logo" className="w-8 h-8" />
      </div>
    </div>
  );
};

// @ts-ignore
export default connectStateResults(DropdownSearchResults) as React.FC<{
  className?: string;
}>;
