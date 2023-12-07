import React from 'react';
import cx from 'classnames';
import { PlayIcon } from '@heroicons/react/24/outline';

interface Props {
  textColor?: string;
  className?: string;
  children: React.ReactNode;
}

const AudioDuration: React.FC<Props> = ({
  children,
  textColor = `flprimary`,
  className,
}) => (
  <div
    className={cx(
      className,
      `text-${textColor}`,
      `text-sm flex items-center justify-center`,
    )}
  >
    <PlayIcon className="h-5 mr-1" />
    {children}
  </div>
);

export default AudioDuration;
