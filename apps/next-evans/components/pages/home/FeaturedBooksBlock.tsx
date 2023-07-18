import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { Swipeable } from 'react-swipeable';
import { t } from '@friends-library/locale';
import type { DocumentWithMeta } from '@/lib/types';
import FeaturedBook from './FeaturedBook';
import Heading from '@/components/core/Heading';
import WoodgrainSVG from '@/public/images/woodgrain.svg';

interface Props {
  books: DocumentWithMeta[];
}

const FeaturedBooksBlock: React.FC<Props> = ({ books }) => {
  const [index, setIndex] = useState<number>(0);
  const [controlled, setControlled] = useState<boolean>(false);

  useEffect(() => {
    if (controlled) return;
    const timeout = setTimeout(() => {
      setIndex(index === books.length - 1 ? 0 : index + 1);
    }, 6500);
    return () => clearTimeout(timeout);
  });

  return (
    <Swipeable
      nodeName="section"
      className="py-10 sm:py-12 md:py-20 bg-[#f9f9f9] [background-sie:cover] md:[background-size:200%] lg:[background-size:150%] bg-center"
      style={{ backgroundImage: `url(${WoodgrainSVG.src})` }}
      onSwipedRight={() => {
        setControlled(true);
        setIndex(index === 0 ? books.length - 1 : index - 1);
      }}
      onSwipedLeft={() => {
        setControlled(true);
        setIndex(index === books.length - 1 ? 0 : index + 1);
      }}
    >
      <Heading className="text-gray-800">{t`Featured Books`}</Heading>
      <div className="w-[calc(100vw-(100vw-100%))] overflow-hidden">
        <div className="w-[600vw] flex">
          {books.map((book, bkIdx) => (
            <FeaturedBook key={book.title} {...book} isCurrent={bkIdx === index} />
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        {books.map((book, bkIdx) => (
          <i
            key={book.title}
            onClick={() => {
              setControlled(true);
              setIndex(bkIdx);
            }}
            className={cx(
              `block w-2 h-2 mx-2 rounded-full hover:scale-150 cursor-pointer transition duration-100`,
              {
                'bg-gray-700': index === bkIdx,
                'bg-gray-400': index !== bkIdx,
              },
            )}
          />
        ))}
      </div>
    </Swipeable>
  );
};

export default FeaturedBooksBlock;
