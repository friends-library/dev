import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import { NextBgStaticCss } from 'next-bg-image';
import { LANG } from '@/lib/env';

const Document: React.FC = () => (
  <Html lang={LANG} className="scroll-pt-[70px]">
    <Head>
      <NextBgStaticCss />
      <link
        rel="icon"
        href={`/images/icons/favicon-32x32.${LANG}.png`}
        type="image/png"
      />
      {[48, 72, 96, 144, 192, 256, 384, 512].map((size) => (
        <link
          key={size}
          rel="apple-touch-icon"
          sizes={`${size}x${size}`}
          href={`/images/icons/icon-${size}x${size}.${LANG}.png`}
        />
      ))}
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
