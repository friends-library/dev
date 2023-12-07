import React from 'react';
import cx from 'classnames';
import invariant from 'tiny-invariant';
import {
  ArrowDownTrayIcon,
  BookmarkIcon,
  ClockIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline';
import { ThreeD } from '@friends-library/cover-component';
import { t, translate } from '@friends-library/locale';
import type { CoverProps } from '@friends-library/types';
import Dual from '../../core/Dual';
import Button from '../../core/Button';

type Props = Omit<CoverProps, 'pages' | 'blurb'> & {
  htmlShortTitle: string;
  tags: string[];
  numDownloads: number;
  hasAudio: boolean;
  isAlone: boolean;
  pages: number[];
  bookUrl: string;
  description: string;
  className?: string;
};

const BookByFriend: React.FC<Props> = (props) => {
  const { className, isAlone, hasAudio, description, pages, numDownloads } = props;
  invariant(pages[0] !== undefined);
  return (
    <div
      className={cx(
        className,
        `BookByFriend`,
        `bg-white mt-6 flex flex-col items-center p-8 pt-0 max-w-2xl`,
        `md:flex-row md:mt-4 md:ml-32 md:pb-4`,
        `lg:ml-12`,
        `xl:ml-24`,
        {
          'lg:[max-width:calc(50%-70px)] xl:[max-width:calc(50%-130px)]': !isAlone,
        },
      )}
    >
      <ThreeD
        {...props}
        scaler={isAlone ? 1 / 2 : 1 / 3}
        scope={isAlone ? `1-2` : `1-3`}
        className={isAlone ? `-mt-20 md:mt-4 md:-ml-32` : `mt-4 md:-ml-24`}
        pages={pages[0]}
        blurb=""
        onlyFront
        shadow={true}
      />
      <div className="lg:mr-[5%] mt-6 md:pl-6 md:py-6 lg:pl-2 lg:py-2 self-start flex flex-col">
        <h4
          className={cx(
            `text-center font-sans tracking-wider text-lg`,
            `md:text-xl md:text-left`,
            {
              'lg:text-lg': !isAlone,
              'xl:text-xl': !isAlone,
            },
          )}
          dangerouslySetInnerHTML={{ __html: props.htmlShortTitle }}
        />
        <p className="body-text mt-4 md:text-lg lg:text-base xl:text-lg">{description}</p>
        <div className="mt-4 sm:mt-6">
          <ul
            className={cx(
              `grid grid-cols-1 min-[450px]:grid-cols-2 gap-2 w-fit font-sans text-sm antialiased text-flgray-900 leading-tight`,
              `sm:text-base`,
              `md:text-lg`,
              `pl-6 md:pl-0`,
              !isAlone && `lg:text-sm xl:text-lg`,
            )}
          >
            <MetaItem Icon={ClockIcon}>
              {t`${pages.reduce((sum, p) => sum + p, 0)} pages`}
              {pages.length > 1 && (
                <em className="italic pl-1 text-sm">({pages.length} vol)</em>
              )}
            </MetaItem>
            <MetaItem Icon={BookmarkIcon}>
              {props.tags
                .map((t) => translate(t.replace(`spiritualLife`, `spiritual life`)))
                .join(`, `)}
            </MetaItem>
            {hasAudio && <MetaItem Icon={SpeakerWaveIcon}>{t`Audio Book`}</MetaItem>}
            {numDownloads > 10 && (
              <Dual.Frag>
                <MetaItem Icon={ArrowDownTrayIcon}>{numDownloads} Downloads</MetaItem>
                <MetaItem Icon={ArrowDownTrayIcon}>{numDownloads} Descargas</MetaItem>
              </Dual.Frag>
            )}
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <Button className="mt-6 md:mt-10" to={props.bookUrl}>
            {t`View Book`}
          </Button>
        </div>
      </div>
    </div>
  );
};

const MetaItem: React.FC<{
  Icon: React.FC<{ className?: string }>;
  className?: string;
  children: React.ReactNode;
}> = ({ Icon, children, className }) => (
  <li
    className={cx(
      `capitalize text-sans flex items-center whitespace-no-wrap shrink-0 whitespace-nowrap mr-4`,
      className,
    )}
  >
    <Icon className="mr-2 shrink-0 h-5" />
    {children}
  </li>
);

export default BookByFriend;
