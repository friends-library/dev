import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { t } from '@friends-library/locale';
import FriendsLogo from '../core/LogoFriends';
import AmigosLogo from '../core/LogoAmigos';
import Hamburger from './Hamburger';
import TopNavSearch from './algolia/TopNavSearch';
import CartBadge from './algolia/CartBadge';
import { useEscapeable } from '@/lib/hooks/escapable';
import { LANG } from '@/lib/env';

interface Props {
  showCartBadge: boolean;
  onCartBadgeClick(): unknown;
  onHamburgerClick(): unknown;
  initialSearching?: boolean;
}

const Nav: React.FC<Props> = ({
  initialSearching,
  onHamburgerClick,
  onCartBadgeClick,
  showCartBadge,
}) => {
  const [searching, setSearching] = useState<boolean>(initialSearching || false);
  useEscapeable(`.TopNavSearch`, searching, setSearching);
  const Logo = LANG === `es` ? AmigosLogo : FriendsLogo;

  useEffect(() => {
    const vimActivate: (e: KeyboardEvent) => any = (e) => {
      if (!searching && e.keyCode === FORWARD_SLASH && !e.shiftKey) {
        e.preventDefault();
        setSearching(true);
      }
    };
    document.addEventListener(`keydown`, vimActivate);
    return () => {
      window.removeEventListener(`keydown`, vimActivate);
    };
  }, [searching, setSearching]);

  return (
    <nav
      className={cx(
        `h-[70px] pr-[16px] sm:pr-[20px] flex bg-white border-gray-300 border-b`,
        `fixed top-0 z-[49] w-full`,
        searching &&
          (LANG === `en`
            ? `[&_input]:bg-[rgb(108,49,66,0.05)]`
            : `[&_input]:bg-[rgb(193,49,66,0.05)]`),
      )}
    >
      <Hamburger
        onClick={onHamburgerClick}
        className={cx(`flex-grow-0 max-[340px]:mr-[0.75rem]`, {
          'mr-6': !searching,
          'mr-0 sm:mr-6': searching,
        })}
      />
      <Link
        href="/"
        prefetch={false}
        aria-label={t`Friends Library`}
        className={cx(`m-0 sm:inline mr-4 sm:mr-0`, {
          'hidden flex-grow-0': searching,
          'flex-grow': !searching,
        })}
      >
        <Logo
          className={cx(
            `block mx-auto h-[69px]`,
            LANG === `es` &&
              `w-[160px] translate-y-1 min-[340px]:w-[175px] min-[360px]:w-[190px]`,
            LANG === `en` && `w-[110px] min-[360px]:w-[140px]`,
            showCartBadge &&
              LANG === `es` &&
              `w-[120px] min-[340px]:w-[133px] min-[360px]:w-[160px] min-[400px]:w-[190px]`,
          )}
        />
      </Link>
      <TopNavSearch className="flex" searching={searching} setSearching={setSearching} />
      {showCartBadge && (
        <div
          className={cx(`ml-2 flex-col justify-center items-end sm:flex-grow-0`, {
            'hidden sm:flex': searching,
            flex: !searching,
          })}
        >
          <CartBadge onClick={onCartBadgeClick} />
        </div>
      )}
    </nav>
  );
};

export default Nav;

const FORWARD_SLASH = 191;
