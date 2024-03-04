import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import type { AudioQuality, AudioQualities } from '@friends-library/types';
import WaveBottomBlock from '../getting-started/WaveBottomBlock';
import DownloadAudiobook from './DownloadAudiobook';
import { LANG } from '@/lib/env';
import AudioPlayer from '@/components/core/AudioPlayer';

export type AudioPart = {
  title: string;
  mp3Url: AudioQualities<string>;
  duration: number;
};

export interface Props {
  isIncomplete: boolean;
  tracks: AudioPart[];
  m4bFilesize: AudioQualities<number>;
  mp3ZipFilesize: AudioQualities<number>;
  m4bLoggedDownloadUrl: AudioQualities<string>;
  mp3ZipLoggedDownloadUrl: AudioQualities<string>;
  podcastLoggedDownloadUrl: AudioQualities<string>;
  mp3LoggedDownloadUrls: Array<AudioQualities<string>>;
}

const ListenBlock: React.FC<Props> = ({ tracks, ...props }) => {
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
        className="mb-8 sm:mb-16 lg:border lg:border-l-0 lg:-mt-12 lg:pt-12 lg:px-12 border-flgray-200 lg:mr-6 shrink-0"
        title={tracks[0]?.title ?? ``}
        {...props}
        quality={quality}
        setQuality={setQuality}
      />
      <div className="flex-grow lg:max-w-[480px] min-[1160px]:max-w-xl min-[1340px]:max-w-3xl lg:mx-auto flex flex-col">
        <h3
          className={cx(
            `text-2xl tracking-wide text-center mt-10 mb-6`,
            `lg:text-left xl:pt-6`,
            tracks.length > 1 ? `text-black` : `text-white`,
            tracks.length > 4 ? `sm:text-black` : `lg:text-black`,
          )}
        >
          {LANG === `en` && (
            <span className="italic lowercase font-serif font-normal pr-1">Or</span>
          )}
          {t`Listen online`}
        </h3>
        <div className="mx-4 xs:mx-6 sm:mb-8 lg:ml-0">
          <AudioPlayer
            tracks={tracks.map((track) => ({
              title: track.title,
              duration: track.duration,
              mp3Url: track.mp3Url[quality],
            }))}
          />
        </div>
      </div>
    </WaveBottomBlock>
  );
};

export default ListenBlock;
