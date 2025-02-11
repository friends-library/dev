'use client';

import React, { useState } from 'react';
import cx from 'classnames';
import type NewsFeedItem from './NewsFeedItem';
import NewsFeedYear from './NewsFeedYear';
import Dual from '@/components/core/Dual';

type ItemProps = Omit<React.ComponentProps<typeof NewsFeedItem>, 'alt'>;

interface Props {
  items: (ItemProps & { year: string })[];
  className?: string;
}

const NewsFeed: React.FC<Props> = ({ items, className }) => {
  const [showing, setShowing] = useState<number>(6);
  const years = groupYears(items.slice(0, showing));
  return (
    <div className={cx(className, `flex flex-col items-center`)}>
      {years.map((props) => (
        <NewsFeedYear key={props.year} {...props} />
      ))}
      {showing < items.length && (
        <button
          className="flex subtle-focus items-center justify-center text-white text-center m-2 mb-0 py-0 px-4 rounded-lg uppercase font-sans tracking-widest text-sm"
          onClick={() => setShowing(showing + 5)}
        >
          <Dual.Span>
            <>Load More</>
            <>Ver Más</>
          </Dual.Span>
          <span className="pl-3 text-4xl mb-2 tracking-tighter">• • •</span>
        </button>
      )}
    </div>
  );
};

export default NewsFeed;

function groupYears(items: Props['items']): { year: string; items: ItemProps[] }[] {
  let idx = -1;
  const years: string[] = [];
  const groups: { year: string; items: ItemProps[] }[] = [];

  items.forEach((item) => {
    if (!years.includes(item.year)) {
      years.push(item.year);
      idx++;
      groups.push({ year: item.year, items: [] });
    }
    groups[idx]?.items.push(item);
  });

  return groups;
}
