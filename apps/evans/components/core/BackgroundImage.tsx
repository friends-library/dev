import React from 'react';
import Image from 'next/image';
import cx from 'classnames';
import type { CSSProperties } from 'react';
import type { StaticImageData } from 'next/image';

type Props = {
  src: string | StaticImageData;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  position?: string;
  priority?: boolean;
  children?: React.ReactNode;
  className?: string;
  fineTuneImageStyles?: CSSProperties;
};

const fitMap = {
  cover: `object-cover`,
  contain: `object-contain`,
  fill: `object-fill`,
  none: `object-none`,
  'scale-down': `object-scale-down`,
};

const BackgroundImage: React.FC<Props> = ({
  src,
  className,
  children,
  fit,
  priority,
  position,
  fineTuneImageStyles,
}) => (
  <div className={cx(`relative`, className)}>
    <Image
      src={src}
      width={1000}
      height={1000}
      alt=""
      priority={priority}
      role="presentation"
      className={cx(fit && fitMap[fit], position, `absolute top-0 left-0`)}
      style={{ width: `100%`, height: `100%`, ...fineTuneImageStyles }}
    />
    <div className="relative Content h-full">{children}</div>
  </div>
);

export default BackgroundImage;
