import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import type { AudioQuality, AudioQualities } from '@friends-library/types';
import WaveBottomBlock from '../getting-started/WaveBottomBlock';
import DownloadAudiobook from './DownloadAudiobook';
import { LANG } from '@/lib/env';
import EmbeddedAudio from '@/components/core/EmbeddedAudio';

export interface Props {
  title: string;
  isIncomplete: boolean;
  numAudioParts: number;
  m4bFilesize: AudioQualities<number>;
  mp3ZipFilesize: AudioQualities<number>;
  m4bLoggedDownloadUrl: AudioQualities<string>;
  mp3ZipLoggedDownloadUrl: AudioQualities<string>;
  podcastLoggedDownloadUrl: AudioQualities<string>;
  embedId: AudioQualities<number>;
}

const ListenBlock: React.FC<Props> = ({ title, numAudioParts, embedId, ...props }) => {
  const [quality, setQuality] = useState<AudioQuality>(`hq`);

  useEffect(() => {
    // @ts-ignore
    if (window.navigator?.connection?.downlink < 1.5) {
      setQuality(`lq`);
    }
  }, []);

  return (
    <WaveBottomBlock
      color="maroon"
      className={cx(
        `ListenBlock z-10 bg-flgray-100 pt-8 pb-12 py-12 relative`,
        `sm:p-16 lg:flex items-start lg:p-0`,
      )}
    >
      <DownloadAudiobook
        className="mb-8 sm:mb-16 lg:border lg:border-l-0 lg:-mt-12 lg:pt-12 lg:px-12 border-flgray-200 xl:mr-6"
        {...props}
        quality={quality}
        setQuality={setQuality}
      />
      <div className="flex-grow lg:ml-8 xl:max-w-screen-md xl:mx-auto">
        <h3
          className={cx(
            `text-2xl tracking-wide text-center my-6`,
            `sm:mb-16 sm:text-black`,
            `lg:mb-0 lg:text-left xl:pt-6`,
            numAudioParts > 1 ? `text-black` : `text-white`,
          )}
        >
          {LANG === `en` && (
            <span className="italic lowercase font-serif font-normal pr-1">Or</span>
          )}
          {t`Listen online`}
        </h3>
        <div className="flex flex-col items-center shadow-xl mt-8 mx-6 sm:mb-8 lg:ml-0">
          <EmbeddedAudio
            trackId={embedId[quality]}
            playlistId={numAudioParts > 1 ? embedId[quality] : undefined}
            height={
              numAudioParts > 1
                ? SC_MAIN_SECTION_HEIGHT +
                  SC_FOOTER_HEIGHT +
                  SC_TRACK_HEIGHT * numAudioParts
                : SC_MAIN_SECTION_HEIGHT
            }
            title={title}
          />
        </div>
      </div>
    </WaveBottomBlock>
  );
};

export default ListenBlock;

const SC_MAIN_SECTION_HEIGHT = 165;
const SC_FOOTER_HEIGHT = 55;
const SC_TRACK_HEIGHT = 31;
