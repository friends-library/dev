import React from 'react';
import Link from 'next/link';
import cx from 'classnames';
import { ThreeD as Front } from '@friends-library/cover-component';
import { t } from '@friends-library/locale';
import { LANG } from '@/lib/env';
import Button from '@/components/core/Button';
import { getDocumentUrl, getFriendUrl } from '@/lib/friend';
import { toCoverProps } from '@/lib/cover';

interface Props {
  isbn: string;
  title: string;
  htmlShortTitle: string;
  paperbackVolumes: [number, ...number[]];
  customCss?: string;
  customHtml?: string;
  isCompilation: boolean;
  friendName: string;
  friendSlug: string;
  friendGender: `male` | `female` | `mixed`;
  documentSlug: string;
  featuredDescription: string;
  isCurrent: boolean;
}

const Book: React.FC<Props> = (props) => (
  <div
    className={cx(
      `Book px-12 md:px-16 flex flex-col md:flex-row w-screen`,
      props.isCurrent && `order-first`,
    )}
  >
    <div className="flex flex-col items-center md:items-end md:w-2/5 md:mr-16">
      <div className="mb-8 md:hidden">
        <Front
          {...toCoverProps({
            ...props,
            description: ``,
            printSize: `m`,
            editionType: `updated`,
          })}
          onlyFront
          scope="1-2"
          scaler={1 / 2}
        />
      </div>
      <div className="hidden md:block">
        <Front
          {...toCoverProps({
            ...props,
            description: ``,
            printSize: `m`,
            editionType: `updated`,
          })}
          onlyFront
          scope="3-5"
          scaler={3 / 5}
        />
      </div>
    </div>
    <div className="Text md:w-3/5 flex-grow flex flex-col justify-start">
      <h2
        className="font-sans text-gray-800 text-2xl mb-4 md:mb-6 leading-relaxed tracking-wider font-bold"
        dangerouslySetInnerHTML={{ __html: props.htmlShortTitle }}
      />
      {LANG === `en` && (
        <p className="hidden sm:block font-sans uppercase text-gray-800 text-lg tracking-widest font-black mb-6">
          Modernized Edition
        </p>
      )}
      <p
        className="font-serif text-lg md:text-xl opacity-75 leading-relaxed max-w-2xl"
        dangerouslySetInnerHTML={{ __html: props.featuredDescription }}
      />
      {!props.isCompilation && (
        <p className="mb-10 md:mb-0 my-6">
          <em className="font-serif font-black text-lg antialiased pr-2">{t`by`}:</em>
          {` `}
          <Link
            href={getFriendUrl(props.friendSlug, props.friendGender)}
            className="font-serif uppercase text-lg antialiased font-bold text-flblue bracketed"
          >
            {props.friendName}
          </Link>
        </p>
      )}
      <Button
        bg="green"
        to={getDocumentUrl(props.friendSlug, props.documentSlug)}
        className={cx(`mx-auto md:mx-0`, {
          'mt-12': props.isCompilation,
          'sm:mt-0 md:mt-10': !props.isCompilation,
        })}
      >
        {t`Download`} &rarr;
      </Button>
    </div>
  </div>
);

export default Book;
