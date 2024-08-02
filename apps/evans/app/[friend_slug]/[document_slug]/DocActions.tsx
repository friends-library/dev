import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import {
  BookOpenIcon,
  CloudArrowDownIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline';
import MultiPill from '@/components/core/MultiPill';

interface Props {
  className?: string;
  price: number;
  hasAudio: boolean;
  addToCart(): unknown;
  download(): unknown;
  gotoAudio(): unknown;
}

const DocActions: React.FC<Props> = ({
  price,
  addToCart,
  hasAudio,
  download,
  gotoAudio,
  className = ``,
}) => (
  <MultiPill
    className={cx(`MultiPill`, className)}
    buttons={[
      {
        text: t`Download`,
        icon: CloudArrowDownIcon,
        onClick: download,
      },
      {
        text: `${t`Paperback`} $${(price / 100).toFixed(2)}`,
        icon: BookOpenIcon,
        onClick: addToCart,
      },
      ...(hasAudio
        ? [{ text: t`Audiobook`, icon: MicrophoneIcon, onClick: gotoAudio }]
        : []),
    ]}
  />
);

export default DocActions;
