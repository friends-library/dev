import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { BackwardIcon, ForwardIcon } from '@heroicons/react/24/solid';
import styles from '../../styles/AudioPlayer.module.css';
import { formatDuration } from '@/lib/dates';

interface Props {
  tracks: Array<{
    title: string;
    url: string;
  }>;
}

const AudioPlayer: React.FC<Props> = ({ tracks }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const currentTrackIndex = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const currentTitle = tracks[currentTrackIndex.current]?.title ?? ``;

  if (audio) {
    if (audio.currentTime === audio.duration) {
      if (currentTrackIndex.current === tracks.length - 1) {
        setIsPlaying(false);
        setCurrentTime(0);
        audio.currentTime = 0;
      } else {
        currentTrackIndex.current++;
        setCurrentTime(0);
        setIsPlaying(true);
        audio.currentTime = 0;
      }
    }
  }

  useEffect(() => {
    setAudio(audioRef.current);
  }, [audioRef]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex.current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!audio) return;
    audioRef.current?.addEventListener(`timeupdate`, () => {
      setCurrentTime(audio.currentTime);
    });
  }, [audio]);

  return (
    <div className="border border-flgray-200 bg-white p-4 min-[400px]:p-6 xs:p-8 flex flex-col">
      <audio ref={audioRef} src={tracks[currentTrackIndex.current]?.url ?? ``} />
      {audio && (
        <div className={cx(`flex flex-col gap-4`, tracks.length > 1 && `mb-8`)}>
          <div className="flex items-center justify-center md:justify-between">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 bg-flprimary rounded-full flex justify-center items-center hover:opacity-90 transition-[opacity,transform] duration-200 active:scale-95 active:!opacity-100 shrink-0 order-1 md:order-0 mx-8 md:mx-0"
            >
              <i
                className={cx(
                  `fa-solid text-lg text-white`,
                  isPlaying ? `fa-pause` : `fa-play`,
                )}
              />
            </button>
            <div className="flex-grow bg-flprimary/5 py-2 px-6 rounded-full flex justify-start overflow-hidden relative mx-8 hidden md:block md:order-1">
              <span className="text-xl font-bold text-flprimary whitespace-nowrap">
                {currentTitle}
              </span>
              <div className="absolute h-full w-24 right-0 top-0 bg-gradient-to-l from-[#F7F5F5] to-transparent" />
            </div>
            <button
              onClick={() => {
                setCurrentTime(currentTime - 10);
                audio.currentTime = currentTime - 10;
              }}
              className="w-10 h-10 rounded-full hover:bg-flprimary/10 active:bg-flprimary/20 active:scale-95 transition-[background-color,transform] flex justify-center items-center md:mr-2 order-0 md:order-2 shrink-0"
            >
              <BackwardIcon className="w-6 h-6 text-flprimary" />
            </button>
            <button
              onClick={() => {
                setCurrentTime(currentTime + 10);
                audio.currentTime = currentTime + 10;
              }}
              className="w-10 h-10 rounded-full hover:bg-flprimary/10 active:bg-flprimary/20 active:scale-95 transition-[background-color,transform] flex justify-center items-center order-2 md:order-3 shrink-0"
            >
              <ForwardIcon className="w-6 h-6 text-flprimary" />
            </button>
          </div>
          <div className="flex-grow flex items-center">
            <span className="text-flgray-500 w-14 flex justify-start">
              {formatDuration(currentTime)}
            </span>
            <div className="flex-grow flex items-center relative">
              <div
                className="absolute left-0 top-[-1px] rounded-l-full bg-flprimary pointer-events-none h-[8px]"
                style={{
                  width: `${(currentTime / audio.duration) * 100}%`,
                }}
              />
              <input
                type="range"
                className={cx(`flex-grow`, styles.progressBar)}
                min={0}
                max={audio.duration}
                value={currentTime}
                onChange={(e) => {
                  audio.currentTime = Number(e.target.value);
                }}
              />
            </div>
            <span className="text-flgray-500 w-14 flex justify-end">
              {
                audio.duration
                  ? formatDuration(audio.duration)
                  : `00:00` /* TODO: after the parql types are changed, this placeholder will become the duration that comes down from the api */
              }
            </span>
          </div>
        </div>
      )}
      {tracks.length > 1 &&
        tracks.map((track, i) => (
          <button
            onClick={() => {
              if (!audio) return;
              setIsPlaying(false);
              audio.currentTime = 0;
              setCurrentTime(0);
              currentTrackIndex.current = i;
              setIsPlaying(true);
            }}
            key={i}
            className={cx(
              `odd:bg-flgray-100 px-4 py-2 flex items-center justify-between hover:bg-flgray-200 transition-[background-color,transform] duration-100 cursor-pointer active:bg-flgray-300 text-left`,
              i === currentTrackIndex.current && `!bg-flprimary`,
            )}
          >
            <div className="flex items-center">
              <span
                className={cx(
                  `font-bold opacity-50`,
                  i === currentTrackIndex.current ? `text-white` : `text-black`,
                )}
              >
                {i + 1}
              </span>
              <span
                className={cx(
                  `ml-4 sm:text-lg leading-[1.4em]`,
                  i === currentTrackIndex.current ? `text-white` : `text-black`,
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
