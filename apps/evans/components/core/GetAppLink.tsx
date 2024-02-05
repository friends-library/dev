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
        `fa fa-mobile opacity-70 ml-2`,
        inFooter
          ? `!text-[1.2rem] scale-[1.4] -translate-y-px`
          : `!text-[1.7rem] translate-y-px`,
      )}
    />
  </Link>
);

export default GetAppLink;
