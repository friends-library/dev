import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import { NextBgStaticCss } from 'next-bg-image';

const Document: React.FC = () => (
  <Html lang="en">
    <Head>
      <NextBgStaticCss />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
