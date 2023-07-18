import React from 'react';
import cx from 'classnames';
import {
  BookOpenIcon,
  BookmarkIcon,
  GlobeAmericasIcon,
  MicrophoneIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import type { NewsFeedType } from '@/lib/types';
import { COLOR_MAP } from './news-feed';

interface Props {
  type: NewsFeedType;
  className?: string;
}

const NewsFeedIcon: React.FC<Props> = ({ className, type }) => {
  let Icon = BookOpenIcon;

  switch (type) {
    case `audiobook`:
      Icon = MicrophoneIcon;
      break;
    case `spanish_translation`:
      Icon = GlobeAmericasIcon;
      break;
    case `feature`:
      Icon = StarIcon;
      break;
    case `chapter`:
      Icon = BookmarkIcon;
      break;
  }
  return (
    <div
      className={cx(
        className,
        `flex justify-center items-center text-white w-10 h-10 rounded-full bg-${COLOR_MAP[type]} shrink-0`,
      )}
    >
      <Icon className={type === `audiobook` ? `h-6` : `h-7`} />
    </div>
  );
};

export default NewsFeedIcon;
