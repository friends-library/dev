import React from 'react';
import NewsFeed from './NewsFeed';
import BackgroundImage from '@/components/core/BackgroundImage';
import Dual from '@/components/core/Dual';
import BgImage from '@/public/images/books-diagonal.jpg';

interface Props {
  items: React.ComponentProps<typeof NewsFeed>['items'];
}

const NewsFeedBlock: React.FC<Props> = ({ items }) => (
  <BackgroundImage src={BgImage} fit="cover">
    <div className="[background:linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8))] pt-8 pb-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center backdrop-blur-sm">
      <Dual.H1 className="sans-widest text-3xl font-bold mb-6 antialiased text-white text-center px-6">
        <>What&rsquo;s New</>
        <>Añadidos Recientemente</>
      </Dual.H1>
      <div className="flex self-stretch justify-center">
        <NewsFeed className="max-w-screen-lg flex-grow self-stretch" items={items} />
      </div>
    </div>
  </BackgroundImage>
);

export default NewsFeedBlock;
