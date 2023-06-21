import React from 'react';
import cx from 'classnames';
import { Front } from '@friends-library/cover-component';
import type { CoverProps } from '@friends-library/types';
import LogoFriends from './LogoFriends';
import LogoAmigos from './LogoAmigos';
import { LANG } from '@/lib/env';

type Props = Omit<CoverProps, 'blurb' | 'pages' | 'size'> & {
  className?: string;
  scaler?: number;
  scope?: string;
};

const Album: React.FC<Props> = (props) => {
  const Logo = LANG === `en` ? LogoFriends : LogoAmigos;
  return (
    <div
      className={cx(
        props.className,
        `box-content shadow-xl relative w-[1.8333333in] h-[1.8333333in] overflow-hidden [border:10px_solid_white] [&_.Cover]:translate-y-[-0.58in] [&_.Cover_.author]:opacity-0 rounded`,
      )}
    >
      <Logo
        iconColor="white"
        friendsColor="white"
        libraryColor="white"
        className="absolute z-50 h-3 bottom-0 right-0 opacity-50 m-1"
      />
      <Front
        {...props}
        className=""
        size="m"
        scaler={props.scaler ?? 1 / 3}
        scope={props.scope ?? `1-3`}
      />
    </div>
  );
};

export default Album;
