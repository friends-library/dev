import React from 'react';
import cx from 'classnames';
import { Front } from '@friends-library/cover-component';
import { htmlTitle } from '@friends-library/adoc-utils';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import type { Document } from '@/lib/types';
import AudioDuration from './AudioDuration';
import Album from '@/components/core/Album';
import { LANG } from '@/lib/env';
import { isCompilations } from '@/lib/friend';
import Button from '@/components/core/Button';
import { mostModernEditionType } from '@/lib/editions';

export type Props = Pick<
  Document,
  'isbn' | 'title' | 'editions' | 'customCSS' | 'authorName' | 'customHTML'
> & {
  audioDuration?: string;
  htmlShortTitle: string;
  documentUrl: string;
  authorUrl: string;
  description: string;
  badgeText?: string;
  className?: string;
};

const BookTeaserCard: React.FC<Props> = (props) => {
  const {
    htmlShortTitle,
    authorName,
    audioDuration,
    className,
    authorUrl,
    description,
    badgeText,
  } = props;
  const isAudio = typeof audioDuration === `string`;
  return (
    <div
      className={cx(
        className,
        `text-white items-start [background-image:linear-gradient(to_bottom,transparent_0,transparent_210px,white_210px,white_100%)]`,
        isAudio &&
          `[background-image:linear-gradient(to_bottom,transparent_0,transparent_100px,white_100px,white_100%)] md:[background-image:linear-gradient(to_right,transparent_0,transparent_85px,white_85px,white_100%)]`,
        `sm:mx-24`,
        `md:flex md:mx-auto md:max-w-[700px] md:[background-image:linear-gradient(to_top,transparent_0,transparent_45px,white_45px,white_100%)]`,
        `xl:min-w-[550px]`,
      )}
    >
      <div
        className={cx(
          `CoverWrap flex justify-center md:pt-12 md:pl-10`,
          isAudio && `md:-ml-10`,
        )}
      >
        <div className="relative">
          {badgeText && <Badge>{badgeText}</Badge>}
          {isAudio && (
            <Link href={`${props.documentUrl}#audiobook`}>
              <Album
                author={authorName}
                edition={mostModernEditionType(props.editions)}
                customCss={``}
                customHtml={``}
                {...props}
                lang={LANG}
                isCompilation={isCompilations(props.authorName)}
                isbn={props.isbn}
                className="md:-ml-12"
              />
            </Link>
          )}
          {!isAudio && (
            <Link href={props.documentUrl}>
              <Front
                author={authorName}
                edition={mostModernEditionType(props.editions)}
                customCss={props.customCSS || ``}
                customHtml={props.customHTML || ``}
                {...props}
                className=""
                size="m"
                scaler={1 / 3}
                scope="1-3"
                shadow
                lang={LANG}
                isCompilation={isCompilations(props.authorName)}
                isbn={props.isbn}
              />
            </Link>
          )}
        </div>
      </div>
      <div
        className={cx(
          `font-sans px-10 pb-10 pt-8 bg-white tracking-wider text-center`,
          `md:text-left md:bg-transparent md:pt-10`,
        )}
      >
        <h3 className="mb-4 text-base text-flgray-900 md:mb-2 md:pb-1">
          <Link
            href={props.documentUrl}
            className="hover:underline"
            dangerouslySetInnerHTML={{ __html: htmlTitle(htmlShortTitle) }}
          />
        </h3>
        <Link href={authorUrl} className="fl-underline text-sm text-flprimary">
          {authorName}
        </Link>
        {isAudio && (
          <AudioDuration className="mt-8 md:justify-start">{audioDuration}</AudioDuration>
        )}
        <p className={cx(`body-text text-left mt-6`, !isAudio && `md:pb-10`)}>
          {description}
        </p>
        {isAudio && (
          <Button
            to={`${props.documentUrl}#audiobook`}
            className="mx-auto md:mx-0 mt-6 md:mb-10 max-w-full"
          >
            {t`Listen`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookTeaserCard;

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className={`absolute antialiased top-0 left-0 bg-fl${
      LANG === `en` ? `gold` : `maroon`
    } flex flex-col items-center justify-center tracking-wide font-sans text-white rounded-full w-16 h-16 z-10 transform -translate-y-6 -translate-x-4`}
  >
    <span>{children}</span>
  </div>
);
