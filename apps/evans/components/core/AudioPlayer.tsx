'use client';

import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import styles from '@/styles/AudioPlayer.module.css';
import { formatDuration } from '@/lib/dates';

interface Props {
  tracks: Array<{
    title: string;
    mp3Url: string;
    duration: number;
  }>;
}

const AudioPlayer: (props: Props) => React.JSX.Element | null = ({ tracks }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const track = tracks[currentTrackIndex];

  if (audio && audio.currentTime === audio.duration) {
    if (currentTrackIndex === tracks.length - 1) {
      setIsPlaying(false);
    } else {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(true);
    }
    setCurrentTime(0);
    audio.currentTime = 0;
  }

  useEffect(() => {
    setAudio(audioRef.current);
  }, [audioRef]);

  useEffect(() => {
    if (isPlaying) {
      audio?.play();
    } else {
      audio?.pause();
    }
  }, [isPlaying, audio, currentTrackIndex]);

  useEffect(() => {
    if (audio) {
      audio.addEventListener(`timeupdate`, () => {
        setCurrentTime(audio.currentTime);
      });
    }
  }, [audio]);

  if (!track) return null;

  return (
    <div className="border border-flgray-200 bg-white p-4 min-[400px]:p-6 xs:p-8 flex flex-col">
      <audio ref={audioRef} src={track.mp3Url} />
      <div
        className={cx(
          `flex flex-col gap-4`,
          tracks.length > 1 && `mb-8`,
          !audio && `opacity-75 cursor-not-allowed [&>*]:pointer-events-none`,
        )}
      >
        <div className="flex items-center justify-center md:justify-between">
          <button
            aria-label={isPlaying ? t`Pause` : t`Play`}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-flprimary rounded-full flex justify-center items-center *hover:opacity-90 transition-[opacity,transform] duration-200 active:scale-95 active:!opacity-100 shrink-0 order-1 md:order-0 mx-8 md:mx-0"
          >
            <i
              aria-hidden
              className={cx(
                `fa text-white pt-px !text-xl`, // ! for mdx
                isPlaying ? `fa-pause` : `fa-play pl-[3px]`,
              )}
            />
          </button>
          <div className="flex-grow bg-flprimary/5 py-2 px-5 rounded-full flex justify-start overflow-hidden relative mx-6 hidden md:block md:order-1">
            <span className="text-xl font-bold font-sans text-flprimary whitespace-nowrap">
              {track.title}
            </span>
            <div className="absolute h-full w-24 right-0 top-0 bg-gradient-to-l from-[#F7F5F5] to-transparent" />
          </div>
          <button
            aria-label={t`Back 15 seconds`}
            onClick={() => {
              setCurrentTime(currentTime - 15);
              audio && (audio.currentTime = currentTime - 15);
            }}
            className="w-10 h-10 rounded-full hover:bg-flprimary/10 active:bg-flprimary/20 active:scale-95 transition-[background-color,transform] flex justify-center items-center md:mr-2 order-0 md:order-2 shrink-0"
          >
            <i
              aria-hidden
              className="w-6 h-6 text-flprimary fa fa-rotate-left !text-lg" // ! for mdx
            />
          </button>
          <button
            aria-label={t`Forward 15 seconds`}
            onClick={() => {
              setCurrentTime(currentTime + 15);
              audio && (audio.currentTime = currentTime + 15);
            }}
            className="w-10 h-10 rounded-full hover:bg-flprimary/10 active:bg-flprimary/20 active:scale-95 transition-[background-color,transform] flex justify-center items-center order-2 md:order-3 shrink-0"
          >
            <i
              aria-hidden
              className="w-6 h-6 text-flprimary fa fa-rotate-right !text-lg" // ! for mdx
            />
          </button>
        </div>
        <div className="flex-grow flex items-center">
          <span className="text-flgray-500 w-14 flex justify-start">
            {formatDuration(currentTime)}
          </span>
          <div className="flex-grow flex items-center relative">
            <div
              className="absolute left-0 -top-px rounded-l-full bg-flprimary pointer-events-none h-[8px]"
              style={{
                width: `${(currentTime / track.duration) * 100}%`,
              }}
            />
            <input
              type="range"
              className={cx(`flex-grow`, styles.progressBar)}
              min={0}
              max={track.duration}
              value={currentTime}
              onChange={(e) => {
                setCurrentTime(Number(e.target.value));
                audio && (audio.currentTime = Number(e.target.value));
              }}
            />
          </div>
          <span className="text-flgray-500 w-16 flex justify-end">
            -{formatDuration(duration(audio, track.duration) - currentTime)}
          </span>
        </div>
      </div>
      {tracks.length > 1 &&
        tracks.map((track, i) => (
          <button
            aria-label={t`Play part ${i + 1}`}
            onClick={() => {
              if (!audio) return;
              setIsPlaying(false);
              audio.currentTime = 0;
              setCurrentTime(0);
              setCurrentTrackIndex(i);
              setIsPlaying(true);
            }}
            key={i}
            className={cx(
              `odd:bg-flgray-100 px-4 py-2 flex items-center justify-between hover:bg-flgray-200 transition-[background-color,transform] duration-100 cursor-pointer active:bg-flgray-300 text-left`,
              i === currentTrackIndex && `!bg-flprimary`,
            )}
          >
            <div className="flex items-center font-serif">
              <span
                className={cx(
                  `font-bold opacity-50`,
                  i === currentTrackIndex ? `text-white` : `text-flblack`,
                )}
              >
                {i + 1}
              </span>
              <span
                className={cx(
                  `ml-4 sm:text-lg py-0.5 !leading-[1.3em]`,
                  i === currentTrackIndex ? `text-white` : `text-flblack antialiased`,
                )}
              >
                {track.title}
              </span>
            </div>
          </button>
        ))}
    </div>
  );
};

export default AudioPlayer;

function duration(element: HTMLAudioElement | null, serverDuration: number): number {
  if (element && !Number.isNaN(element.duration)) {
    return element.duration;
  }
  return serverDuration;
}
