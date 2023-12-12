import React from 'react';
import NextBgImage from '@friends-library/next-bg-image';
import NewsFeed from './NewsFeed';
import Dual from '@/components/core/Dual';
import BgImage from '@/public/images/books-diagonal-2.jpg';

interface Props {
  items: React.ComponentProps<typeof NewsFeed>['items'];
}

const NewsFeedBlock: React.FC<Props> = ({ items }) => (
  <NextBgImage
    className="pt-8 pb-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center"
    src={[`linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))`, BgImage]}
  >
    <Dual.H1 className="font-sans tracking-widest text-3xl font-bold mb-6 antialiased text-white text-center px-6">
      <>What&rsquo;s New</>
      <>Añadidos Recientemente</>
    </Dual.H1>
    <div className="flex self-stretch justify-center">
      <NewsFeed className="max-w-screen-lg flex-grow self-stretch" items={items} />
    </div>
  </NextBgImage>
);

export default NewsFeedBlock;
