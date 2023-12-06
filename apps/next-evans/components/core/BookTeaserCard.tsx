import React from 'react';
import cx from 'classnames';
import { Front } from '@friends-library/cover-component';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import AudioDuration from './AudioDuration';
import { toCoverProps, type CoverData } from '@/lib/cover';
import Album from '@/components/core/Album';
import Button from '@/components/core/Button';
import { LANG } from '@/lib/env';

export type Props = Omit<CoverData, 'printSize'> & {
  className?: string;
  audioDuration?: string;
  htmlShortTitle: string;
  documentUrl: string;
  friendUrl: string;
  badgeText?: string;
};

const BookTeaserCard: React.FC<Props> = ({
  className,
  audioDuration,
  htmlShortTitle,
  documentUrl,
  friendUrl,
  badgeText,
  ...props
}) => {
  const isAudio = typeof audioDuration === `string`;
  const coverProps = toCoverProps({ ...props, printSize: `m` });
  return (
    <div
      className={cx(
        `bg-white flex flex-col items-center p-8 relative max-w-2xl`,
        isAudio ? `md:pl-36 md:ml-24` : `md:pl-64`,
        className,
      )}
    >
      {badgeText && (
        <Badge
          className={cx(
            `absolute`,
            isAudio
              ? `md:-left-28 md:top-2 -top-28 left-[calc(50%-7rem)]`
              : `md:left-4 md:top-4 -top-44 left-[calc(50%-7rem)]`,
          )}
        >
          {badgeText}
        </Badge>
      )}
      {isAudio ? (
        <Link
          href={documentUrl}
          className="md:absolute md:-left-24 mb-8 md:mb-0 -mt-32 md:mt-0"
        >
          <Album {...props} />
        </Link>
      ) : (
        <Link
          href={documentUrl}
          className={cx(
            `md:absolute md:left-8 mb-8 md:mb-0 -mt-44 md:mt-0`,
            badgeText && `top-12`,
          )}
        >
          <Front {...coverProps} size="m" scaler={1 / 3} scope="1-3" shadow />
        </Link>
      )}
      <div className="flex flex-col items-center md:items-start">
        <Link
          href={documentUrl}
          dangerouslySetInnerHTML={{ __html: htmlShortTitle }}
          className="hover:underline text-lg"
        />
        <Link
          href={friendUrl}
          dangerouslySetInnerHTML={{ __html: props.friendName }}
          className="fl-underline w-fit text-flprimary pb-0.5 text-sm mt-2"
        />
        {isAudio && <AudioDuration className="mt-8">{audioDuration}</AudioDuration>}
        <p className="body-text mt-6">{props.description}</p>
        {isAudio && (
          <Button to={`${documentUrl}#audiobook`} className="mt-6">
            {t`Listen`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookTeaserCard;

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={cx(
      `antialiased bg-fl${
        LANG === `en` ? `gold` : `maroon`
      } flex flex-col items-center justify-center tracking-wide font-sans text-white rounded-full w-16 h-16 z-10 transform`,
      className,
    )}
  >
    <span>{children}</span>
  </div>
);
