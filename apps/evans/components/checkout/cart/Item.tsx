import React from 'react';
import { Front as FrontCover } from '@friends-library/cover-component';
import type { EditionType, PrintSize } from '@friends-library/types';
import ItemQuantity from './ItemQuantity';
import { LANG } from '@/lib/env';

interface Props {
  title: string;
  displayTitle: string;
  edition: EditionType;
  printSize: PrintSize;
  isCompilation: boolean;
  author: string;
  quantity: number;
  price: number;
  isbn: string;
  customCss?: string;
  customHtml?: string;
  changeQty(qtn: number): unknown;
  remove(): unknown;
}

const Item: React.FC<Props> = ({
  title,
  displayTitle,
  author,
  price,
  quantity,
  customCss,
  customHtml,
  isCompilation,
  isbn,
  printSize,
  edition,
  changeQty,
  remove,
}) => (
  <div className="Cart__Item flex py-2 md:py-6 border-b border-gray-300">
    <div className="w-1/2 md:w-3/5 flex">
      <div className="hidden sm:flex mr-1 flex-col justify-center">
        <FrontCover
          lang={LANG}
          isCompilation={isCompilation}
          size={printSize}
          author={author}
          title={title}
          customCss={customCss ?? ``}
          customHtml={customHtml ?? ``}
          isbn={isbn}
          edition={edition}
          scaler={1 / 4}
          scope="1-4"
        />
      </div>
      <dl className="border-r border-gray-300 p-2 md:px-6 flex-grow">
        <dt
          className="max-w-sm font-sans font-bold text-md md:text-lg tracking-wide md:tracking-widest pb-2 pt-2"
          dangerouslySetInnerHTML={{ __html: displayTitle }}
        />
        <dd className="font-serif font-thin text-gray-700 antialiased text-md md:text-lg md:tracking-wide">
          {author}
        </dd>
      </dl>
    </div>
    <div className="w-1/2 md:w-2/5 flex text-center">
      <ItemQuantity quantity={quantity} changeQuantity={changeQty} />
      <div className="w-1/2 md:w-1/3 flex flex-col justify-center price">
        <code className="px-1 font-sans text-gray-700 text-md md:text-lg antialiased md:tracking-wider">
          ${(price / 100).toFixed(2)}
        </code>
      </div>
      <div className="flex w-1/3 flex-col justify-center cursor-pointer" onClick={remove}>
        <span>&#x2715;</span>
      </div>
    </div>
  </div>
);

export default Item;
