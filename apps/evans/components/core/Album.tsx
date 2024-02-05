import React from 'react';
import cx from 'classnames';
import { Front } from '@friends-library/cover-component';
import Logo from './Logo';
import { toCoverProps, type CoverData } from '@/lib/cover';

type Props = Omit<CoverData, 'description' | 'paperbackVolumes' | 'printSize'> & {
  className?: string;
  scaler?: number;
  scope?: string;
};

const Album: React.FC<Props> = ({ className, scaler, scope, ...coverData }) => (
  <div
    className={cx(
      className,
      `box-content shadow-xl relative w-[1.8333in] h-[1.8333in] overflow-hidden border-[10px] border-white [&_.Cover]:translate-y-[-0.58in] [&_.Cover_.author]:opacity-0 rounded`,
    )}
  >
    <Logo
      iconColor="white"
      friendsColor="white"
      libraryColor="white"
      className="absolute z-[48] h-3 bottom-0 right-0 opacity-50 m-1"
    />
    <Front
      {...toCoverProps({
        ...coverData,
        printSize: `m`,
        paperbackVolumes: [222],
        description: ``,
      })}
      className=""
      scaler={scaler ?? 1 / 3}
      scope={scope ?? `1-3`}
    />
  </div>
);

export default Album;
