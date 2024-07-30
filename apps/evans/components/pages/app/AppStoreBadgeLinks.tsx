import React from 'react';
import { t } from '@friends-library/locale';
import Image from 'next/image';
import { LANG } from '@/lib/env';
import AppStore_en from '@/public/images/app/app-store.en.png';
import AppStore_es from '@/public/images/app/app-store.es.png';
import GooglePlay_en from '@/public/images/app/google-play.en.png';
import GooglePlay_es from '@/public/images/app/google-play.es.png';

const AppStoreBadgeLinks: () => React.JSX.Element = () => (
  <div className="w-full px-6 flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 items-center sm:justify-center mb-10">
    <Ios />
    <Android />
  </div>
);

export default AppStoreBadgeLinks;

const Ios: React.FC = () => (
  <a
    href={
      LANG === `en`
        ? `https://apps.apple.com/us/app/friends-library/id1537124207`
        : `https://apps.apple.com/us/app/biblioteca-de-los-amigos/id1538800203`
    }
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image
      className="max-w-[275px] sm:max-w-[190px]"
      src={LANG === `en` ? AppStore_en : AppStore_es}
      alt={t`Download on the App Store`}
    />
  </a>
);

const Android: React.FC = () => (
  <a
    href={`https://play.google.com/store/apps/details?id=com.friendslibrary.FriendsLibrary.${LANG}.release`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image
      className="scale-[115%] max-w-[275px] sm:scale-[100%] sm:max-w-[244px]"
      src={LANG === `en` ? GooglePlay_en : GooglePlay_es}
      alt={t`Get it on Google Play`}
    />
  </a>
);
