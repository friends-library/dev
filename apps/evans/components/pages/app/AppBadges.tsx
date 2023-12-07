import React from 'react';
import { t } from '@friends-library/locale';
import Image from 'next/image';
import { LANG } from '@/lib/env';
import AppStore_en from '@/public/images/app/app-store.en.png';
import AppStore_es from '@/public/images/app/app-store.es.png';
import GooglePlay_en from '@/public/images/app/google-play.en.png';
import GooglePlay_es from '@/public/images/app/google-play.es.png';

interface Props {
  className?: string;
}

export const Ios: React.FC<Props> = ({ className }) => (
  <a
    className={className}
    href={
      LANG === `en`
        ? `https://apps.apple.com/us/app/friends-library/id1537124207`
        : `https://apps.apple.com/us/app/biblioteca-de-los-amigos/id1538800203`
    }
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image
      src={LANG === `en` ? AppStore_en : AppStore_es}
      alt={t`Download on the App Store`}
    />
  </a>
);

export const Android: React.FC<Props> = ({ className }) => (
  <a
    className={className}
    href={`https://play.google.com/store/apps/details?id=com.friendslibrary.FriendsLibrary.${LANG}.release`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image
      src={LANG === `en` ? GooglePlay_en : GooglePlay_es}
      alt={t`Get it on Google Play`}
    />
  </a>
);
