import React from 'react';
import NextBgImage from 'next-bg-image';
import Books from '@/public/images/explore-books.jpg';

const BooksBgBlock: React.FC<{ children: React.ReactNode; eager?: boolean }> = ({
  children,
  eager,
}) => (
  <NextBgImage
    eager={eager}
    src={[`radial-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.6) 65%)`, Books]}
    className="px-10 py-20 sm:px-16 sm:py-32 lg:px-24"
    size="826px 625px"
  >
    {children}
  </NextBgImage>
);

export default BooksBgBlock;
