import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import NextBgImage, { bgColor } from 'next-bg-image';
import type { Lang } from '@friends-library/types';
import FriendsLogo from '../core/LogoFriends';
import AmigosLogo from '../core/LogoAmigos';
import GetAppLink from '../core/GetAppLink';
import { LANG } from '@/lib/env';
import Mountains from '@/public/images/mountains.jpg';

const Footer: React.FC = () => {
  const Logo = LANG === `en` ? FriendsLogo : AmigosLogo;
  return (
    <NextBgImage
      src={[bgColor(`rgba(108,49,66,0.8)`), Mountains]}
      className="text-gray-300 font-hairline mt-auto min-[930px]:pl-12 lg:pl-0"
      position="0 40%"
      lazyLoad
    >
      <div
        className={cx(
          `text-center flex flex-col items-center px-8 py-12`,
          `md:text-left md:flex-row md:items-start md:justify-between`,
          LANG === `es` && `md:pr-0`,
          `lg:p-20`,
          `xl:px-40 xl:py-24`,
        )}
      >
        <Logo
          iconColor="white"
          friendsColor="white"
          libraryColor="white"
          className={cx(`fill-current`, `mb-10 py-2`, `md:mr-4`, {
            'w-48': LANG === `es`,
            'w-40': LANG === `en`,
          })}
        />
        <div
          className={cx(
            `flex-grow md:flex md:ml-8 lg:ml-20 max-w-screen-lg`,
            LANG === `en`
              ? `min-[930px]:max-w-[620px] lg:max-w-none`
              : `min-[930px]:max-w-[680px] lg:max-w-none`,
          )}
        >
          <LinkList
            title={t`Books`}
            links={[
              [t`/getting-started`, t`Getting Started`],
              [t`/explore`, t`Explore Books`],
              [t`/audiobooks`, t`Audiobooks`],
              [t`/friends`, t`All Friends`],
              () => (
                <GetAppLink
                  inFooter
                  className={cx(
                    `inline-block md:transform-none`,
                    LANG === `en` ? `translate-x-[3em]` : `translate-x-[3.6em]`,
                  )}
                />
              ),
            ]}
          />
          <LinkList
            title={t`About`}
            links={[
              [t`/quakers`, t`About the Quakers`],
              [`/what-early-quakers-believed`, `Early Quaker Beliefs`, `en`],
              [`/modernization`, `About modernization`, `en`],
              [`/editions`, `About book editions`, `en`],
              [`/spanish-translations`, `About Spanish translations`, `en`],
              [`/nuestras-traducciones`, `Nuestras Traducciones`, `es`],
              [t`/about`, t`About this Site`],
            ]}
          />
          <LinkList
            last
            title={t`Help`}
            links={[
              [t`/audio-help`, t`Audio Help`],
              [t`/ebook-help`, t`E-Book Help`],
              [t`/contact`, t`Contact Us`],
            ]}
          />
        </div>
      </div>

      <p className="bg-gray-900 text-gray-500 p-6 text-center text-xs font-hairline font-serif">
        &copy; {new Date().getFullYear()} {t`Friends Library Publishing`} <b>[,]</b>
      </p>
    </NextBgImage>
  );
};

export default Footer;

type LinkItem = [string, string, Lang?] | (() => JSX.Element);

const LinkList: React.FC<{
  title: string;
  links: LinkItem[];
  last?: boolean;
}> = ({ title, links, last }) => (
  <dl className={cx(!last && `mb-10 md:mb-0 md:pr-8`, `md:flex-grow`)}>
    <dt className="text-xl font-semibold mb-5 tracking-widest before:content-['['] before:opacity-50 before:pr-2 after:content-[']'] after:opacity-50 after:pl-2">
      {title}
    </dt>
    <dd>
      <ul className="text-gray-300">
        {links
          .filter((item) => {
            if (!Array.isArray(item)) {
              return true;
            }
            const [, , lang] = item;
            return !lang || lang === LANG;
          })
          .map((item, idx) => (
            <li
              key={`item-${idx}`}
              className="mb-2 tracking-wider leading-tight pb-1 opacity-75 hover:opacity-90 text-md"
            >
              {Array.isArray(item) ? <Link href={item[0]}>{item[1]}</Link> : item()}
            </li>
          ))}
      </ul>
    </dd>
  </dl>
);
