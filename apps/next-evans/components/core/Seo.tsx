import { t } from '@friends-library/locale';
import Head from 'next/head';
import React from 'react';
import { LANG } from '@/lib/env';

interface Props {
  title: string;
  description: string;
  withoutEnding?: boolean;
}

const Seo: React.FC<Props> = ({ title, description, withoutEnding = false }) => (
  <Head>
    <title>{`${title}${withoutEnding ? `` : ` | ${t`Friends Library`}`}`}</title>
    <meta name="description" content={description} />
    <meta
      property="og:title"
      content={`${title}${withoutEnding ? `` : ` | ${t`Friends Library`}`}`}
    />
    <meta property="og:description" content={description} />
    <meta
      property="og:image"
      content={`https://raw.githubusercontent.com/friends-library/dev/f487c5bae17501abb91d8f18323391075577ff9b/apps/native/release-assets/android/${LANG}/phone/feature.png}`}
    />
  </Head>
);

export default Seo;
