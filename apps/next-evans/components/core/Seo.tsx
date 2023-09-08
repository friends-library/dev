import { t } from '@friends-library/locale';
import Head from 'next/head';
import React from 'react';
import { LANG } from '@/lib/env';

type Props = {
  title: string;
  description: string;
  withoutEnding?: boolean;
  ogImage?: string;
};

const Seo: React.FC<Props> = (props) => (
  <Head>
    <title>{`${props.title}${
      props.withoutEnding ? `` : ` | ${t`Friends Library`}`
    }`}</title>
    <meta name="description" content={props.description} />
    <meta
      property="og:title"
      content={`${props.title}${props.withoutEnding ? `` : ` | ${t`Friends Library`}`}`}
    />
    <meta property="og:description" content={props.description} />
    <meta
      property="og:image"
      content={
        props.ogImage ||
        `https://raw.githubusercontent.com/friends-library/dev/f487c5bae17501abb91d8f18323391075577ff9b/apps/native/release-assets/android/${LANG}/phone/feature.png`
      }
    />
  </Head>
);

export default Seo;
