import React from 'react';
import Quotes from './Quotes';

interface Props {
  cite: string;
  quote: string;
}

const FeaturedQuoteBlock: React.FC<Props> = ({ cite, quote }) => (
  <blockquote className="text-justify bg-flgreen-600 text-white px-12 py-20 md:py-20 md:px-48 antialiased font-sans leading-loose text-md relative flex flex-col items-center">
    <div>
      <p className="relative max-w-4xl">
        <Quotes className="left-[-19px] top-[-14px] -scale-x-100 md:left-[-110px] md:top-[-20px]" />
        <Quotes className="hidden md:block right-[-60px] bottom-[-37px]" />
        <span
          className="relative block font-serif text-lg"
          dangerouslySetInnerHTML={{
            __html: quote.replace(/“/g, `‘`).replace(/”/g, `’`),
          }}
        />
      </p>
      <cite className="not-italic block mt-4 relative">- {cite}</cite>
    </div>
  </blockquote>
);

export default FeaturedQuoteBlock;
