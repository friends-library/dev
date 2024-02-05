import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import type { Lang } from '@friends-library/types';
import Logo from '../core/Logo';
import GetAppLink from '../core/GetAppLink';
import { useCartTotalQuantity } from '../checkout/hooks';
import { LANG } from '@/lib/env';

const SlideoverMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [cartQty, , store] = useCartTotalQuantity();
  return (
    <nav
      className={cx(
        `bg-flprimary text-white min-h-screen`,
        `[&_ul]:after:h-1 [&_ul]:after:w-[150px] [&_ul]:after:block [&_ul]:after:bg-white [&_ul]:after:mt-[1.95rem] [&_ul]:after:ml-[0.925rem] [&_ul]:after:opacity-25 last:[&_ul]:after:hidden`,
      )}
    >
      <header className="p-5 flex border-b-4 border-flprimary-800 items-center">
        <span
          className="w-12 text-xl md:text-2xl p-1 cursor-pointer text-white/80 hover:text-white/100"
          onClick={onClose}
        >
          &#x2715;
        </span>
        <div className="flex-grow">
          <Logo
            className={cx(`m-auto w-[140px]`, LANG === `es` && `w-[190px] h-[45px]`)}
            iconColor="white"
            friendsColor="white"
            libraryColor="white"
          />
        </div>
        <i className="w-12" />
      </header>
      <div className="py-12 pl-16 md:pl-24">
        <LinkGroup
          links={[
            [t`/getting-started`, t`Getting Started`],
            [t`/explore`, t`Explore Books`],
            [t`/audiobooks`, t`Audio Books`],
            [t`/friends`, t`All Friends`],
          ]}
        />
        <LinkGroup
          links={[
            [t`/quakers`, t`About the Quakers`],
            [`/what-early-quakers-believed`, `Early Quaker Beliefs`, `en`],
            [`/modernization`, `About Modernization`, `en`],
            [`/editions`, `About Book Editions`, `en`],
            [`/spanish-translations`, `About Spanish Books`, `en`],
            [`/nuestras-traducciones`, `Nuestras Traducciones`, `es`],
            [t`/about`, t`About this Site`],
          ]}
        />
        <LinkGroup
          links={[
            () => <GetAppLink />,
            [t`/audio-help`, t`Audio Help`],
            [t`/ebook-help`, t`E-Book Help`],
            [t`/contact`, t`Contact Us`],
            () => (
              <button
                onClick={() => {
                  onClose();
                  store.open();
                }}
              >
                {t`Cart`} ({cartQty})
              </button>
            ),
          ]}
        />
        <LinkGroup
          links={[
            [`https://www.bibliotecadelosamigos.org`, `Biblioteca de los Amigos`, `en`],
            [`https://www.friendslibrary.com`, `Friends Library`, `es`],
          ]}
        />
      </div>
    </nav>
  );
};

export default SlideoverMenu;

const LinkGroup: React.FC<{ links: LinkItem[] }> = ({ links }) => (
  <ul
    className={cx(
      `LinkGroup py-4 text-lg md:text-xl tracking-wider antialiased [&_li]:after:content-["]"] [&_li]:after:opacity-0 [&_li]:after:pl-[0.4rem] [&_li]:before:content-["["] [&_li]:before:opacity-0 [&_li]:before:pr-[0.4rem] hover:[&_li]:before:opacity-100 hover:[&_li]:after:opacity-100`,
      LANG === `en`
        ? `hover:[&_li]:opacity-60 hover:[&_li]:text-[rgb(200,129,151)]`
        : `hover:[&_li]:text-flgold-800`,
    )}
  >
    {links
      .filter((link) => (Array.isArray(link) ? !link[2] || link[2] === LANG : true))
      .map((link, idx) => {
        if (typeof link === `function`) {
          return (
            <li className="py-2 flex" key={`fn-${idx}`}>
              {link()}
            </li>
          );
        }
        const [href, text] = link;
        return (
          <li className="py-2" key={href}>
            {href.startsWith(`https`) ? (
              <a href={href}>{text}</a>
            ) : (
              <Link prefetch={false} href={href}>
                {text}
              </Link>
            )}
          </li>
        );
      })}
  </ul>
);

type LinkItem = [string, string, Lang?] | (() => JSX.Element);
