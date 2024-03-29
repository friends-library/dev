'use client';

import React, { useState } from 'react';
import type { EditionType, Region } from '@/lib/types';
import BgWordBlock from './BgWordBlock';
import BookSlider from './BookSlider';
import MapSlider from './MapSlider';

interface Props {
  books: Array<{
    url: string;
    title: string;
    htmlShortTitle: string;
    isbn: string;
    friendName: string;
    friendUrl: string;
    isCompilation: boolean;
    editionType: EditionType;
    customCss?: string;
    customHtml?: string;
    region: Region;
  }>;
}

const ExploreRegionsBlock: React.FC<Props> = ({ books }) => {
  const [region, setRegion] = useState<Region>(`England`);
  return (
    <BgWordBlock id="RegionBlock" word="Geography" className="p-10" title="Geography">
      <p className="body-text pb-12">
        Browse books by region. Start by clicking one of the map icons below.
      </p>
      <MapSlider className="-mx-10" region={region} setRegion={setRegion} />
      <div className="-mt-12 flex flex-col items-center">
        <BookSlider
          className="z-10"
          books={books.filter((book) => book.region === region)}
        />
      </div>
    </BgWordBlock>
  );
};

export default ExploreRegionsBlock;
