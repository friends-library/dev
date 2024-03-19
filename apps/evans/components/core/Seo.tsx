import Head from 'next/head';
import React from 'react';
import * as seo from '@/lib/seo';

type Props = {
  title: string;
  description: string;
  ogImage?: string;
};

const Seo: React.FC<Props> = (props) => {
  const meta = seo.data(props.title, props.description, props.ogImage);
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.ogImage} />
    </Head>
  );
};

export default Seo;
export { pageMetaDesc } from '@/lib/seo';
