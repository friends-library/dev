import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import { htmlShortTitle } from '@friends-library/adoc-utils';
import type { Doc } from '@/lib/types';
import Album from '@/components/core/Album';
import AudioDuration from '@/components/core/AudioDuration';
import Button from '@/components/core/Button';
import { getDocumentUrl, getFriendUrl, isCompilations } from '@/lib/friend';
import { LANG } from '@/lib/env';
import { formatDuration } from '@/lib/dates';

type Props = Doc<'authorGender' | 'shortDescription' | 'mostModernEdition'> & {
  bgColor: 'blue' | 'maroon' | 'gold' | 'green';
  duration: number;
  className?: string;
};

const Audiobook: React.FC<Props> = (props) => (
  <div
    className={cx(
      props.className,
      `Audiobook flex flex-col items-center max-w-[380px] px-6 sm:px-8 py-8 rounded-lg`,
      // purgeCSS: bg-flblue bg-flmaroon bg-flgold bg-flgreen
      `bg-fl${props.bgColor} text-white`,
    )}
  >
    <Album
      isbn={props.isbn}
      title={htmlShortTitle(props.title)}
      author={props.authorName}
      lang={LANG}
      isCompilation={isCompilations(props.authorName)}
      edition={props.mostModernEdition.type}
      customCss={props.customCSS || ``}
      customHtml={props.customHTML || ``}
      className="-mt-32"
    />
    <div className="flex flex-col justify-center items-center gap-6 flex-grow mt-4">
      <h3
        key="title"
        className="text-lg sans-wider text-center"
        dangerouslySetInnerHTML={{ __html: htmlShortTitle(props.title) }}
      />
      <h4 className="-mt-3" key="author">
        <Link
          href={getFriendUrl(props.authorSlug, props.authorGender)}
          className="fl-underline"
        >
          {props.authorName}
        </Link>
      </h4>
      <AudioDuration textColor="white" key="duration">
        {formatDuration(props.duration)}
      </AudioDuration>
      <p className="body-text text-white -mt-2 flex-grow text-center" key="desc">
        {props.shortDescription}
      </p>
      <Button
        key="button"
        to={`${getDocumentUrl(props)}#audiobook`}
        bg={null}
        className="!text-black bg-flgray-200 hover:bg-white mx-auto mt-auto"
      >
        {t`Listen`}
      </Button>
    </div>
  </div>
);

export default Audiobook;
