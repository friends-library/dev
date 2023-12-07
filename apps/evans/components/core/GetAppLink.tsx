import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import { LANG } from '@/lib/env';

interface Props {
  className?: string;
  inFooter?: boolean;
}

const GetAppLink: React.FC<Props> = ({ className, inFooter }) => (
  <Link className={cx(`relative flex items-center`, className)} href={t`/app`}>
    {LANG === `en` ? `Get the app` : `Aplicación`}
    <i
      aria-hidden
      className={cx(
        `fa fa-mobile text-md opacity-70 ml-2`,
        inFooter ? `scale-125 -translate-y-px` : `translate-y-px`,
      )}
    />
  </Link>
);

export default GetAppLink;
