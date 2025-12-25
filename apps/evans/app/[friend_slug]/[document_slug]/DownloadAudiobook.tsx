import React, { useState } from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import type { AudioQuality, AudioQualities } from '@friends-library/types';
import QualitySwitch from './QualitySwitch';
import Dual from '@/components/core/Dual';
import { formatFilesize } from '@/lib/filesize';

interface Props {
  className?: string;
  quality: AudioQuality;
  setQuality(quality: AudioQuality): unknown;
  isIncomplete: boolean;
  m4bFilesize: AudioQualities<number>;
  mp3ZipFilesize: AudioQualities<number>;
  m4bLoggedDownloadUrl: AudioQualities<string>;
  mp3ZipLoggedDownloadUrl: AudioQualities<string>;
  podcastLoggedDownloadUrl: AudioQualities<string>;
  mp3LoggedDownloadUrls: Array<AudioQualities<string>>;
  title: string;
}

const DownloadLinks: React.FC<Props> = ({
  className,
  quality,
  setQuality,
  isIncomplete,
  m4bFilesize,
  mp3ZipFilesize,
  m4bLoggedDownloadUrl,
  mp3ZipLoggedDownloadUrl,
  podcastLoggedDownloadUrl,
  mp3LoggedDownloadUrls,
  title,
}) => {
  const [downloading, setDownloading] = useState(false);
  const isSingleAudio = mp3LoggedDownloadUrls.length === 1;

  return (
    <div id="audiobook" className={cx(className, `bg-white font-sans p-8`)}>
      <h3 className="text-2xl text-center mb-6">{t`Download Audiobook`}</h3>
      {isIncomplete && (
        <Dual.P className="text-center sm:pl-10 max-w-sm mx-auto -mt-2 italic font-serif mb-6 text-flblue">
          <>
            <sup>*</sup> The audio for this book is incomplete. The remaining chapters
            will be added soon.
          </>
          <>
            <sup>*</sup> El audio de este libro está incompleto. Los capítulos que faltan
            serán añadidios pronto.
          </>
        </Dual.P>
      )}
      <div className="tracking-widest antialiased flex flex-col items-center">
        <dl className="text-flgray-900 inline-block">
          <dt className="uppercase text-md mb-1">
            <Link href="/app" className="hover:underline">
              <Dual.Span className="sm:hidden">
                <>Get the App</>
                <>Obtén la aplicación</>
              </Dual.Span>
              <Dual.Span className="hidden sm:inline">
                <>Download in the App</>
                <>Descarga en la aplicación</>
              </Dual.Span>
            </Link>
            <Link
              href="/app"
              className="text-xs normal-case bg-flprimary text-white rounded-full -mt-1 ml-4 px-6 py-1"
            >
              {t`Recommended`}
            </Link>
          </dt>
          <dd className="text-flgray-500 text-xs mb-4 pb-1">
            <Dual.Frag>
              <>
                (Listen <span className="hidden sm:inline">on your phone</span> with our
                iOS or Android app)
              </>
              <>
                <span className="sm:hidden">
                  Escucha con nuestra aplicación iOS o Android
                </span>
                <span className="hidden sm:inline">
                  Escucha en tu teléfono con la aplicación iOS o Android
                </span>
              </>
            </Dual.Frag>
          </dd>
          <dt className="uppercase text-md mb-1">
            <a href={podcastLoggedDownloadUrl[quality]} className="hover:underline">
              <span className="hidden sm:inline">{t`Download as`} </span>Podcast
            </a>
          </dt>
          <dd className="text-flgray-500 text-xs mb-4 pb-1">
            (Apple Podcasts, Stitcher,{` `}
            <span className="hidden sm:inline">Overcast, </span>
            etc.)
          </dd>
          <dt className="uppercase text-md mb-1">
            <a
              href={mp3ZipLoggedDownloadUrl[quality]}
              className="hover:underline"
              onClick={
                isSingleAudio
                  ? async (event) => {
                      event.preventDefault();
                      try {
                        if (!mp3LoggedDownloadUrls[0]) {
                          throw new Error(`no mp3 url provided`);
                        }
                        setDownloading(true);
                        const downloadMp3Res = await fetch(
                          mp3LoggedDownloadUrls[0][quality],
                        );
                        if (!downloadMp3Res.ok) {
                          throw new Error(`failed to download mp3`);
                        }
                        const blob = await downloadMp3Res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement(`a`);
                        link.href = url;
                        link.setAttribute(`download`, title);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                        setDownloading(false);
                      } catch {
                        setDownloading(false);
                        window.location.href = mp3ZipLoggedDownloadUrl[quality];
                      }
                    }
                  : undefined
              }
            >
              {downloading
                ? t`Downloading`
                : isSingleAudio
                  ? t`Download mp3 File`
                  : t`Download mp3 Files as Zip`}
              {` `}-{` `}
              <span className="text-flprimary">
                ({formatFilesize(mp3ZipFilesize[quality])})
              </span>
            </a>
          </dt>
          <dd className="text-flgray-500 text-xs mb-4 pb-1">
            <Dual.Frag>
              <>(use in iTunes, or any music app)</>
              <>(Para usar en iTunes, o en cualquier aplicación de música)</>
            </Dual.Frag>
          </dd>
          <dt className="uppercase text-md mb-1">
            <a href={m4bLoggedDownloadUrl[quality]} className="hover:underline">
              <Dual.Frag>
                <>
                  Download .M4B Audiobook <span className="hidden sm:inline">File</span> -
                  {` `}
                </>
                <>
                  Descargar Audiolibro{` `}
                  <span className="hidden sm:inline">en archivo</span> M4b -{` `}
                </>
              </Dual.Frag>
              <span className="text-flprimary">
                ({formatFilesize(m4bFilesize[quality])})
              </span>
            </a>
          </dt>
          <dd className="text-flgray-500 text-xs mb-4 pb-1">
            <Dual.Frag>
              <>
                (Audiobook format for{` `}
                <span className="hidden sm:inline">Apple Books, </span>
                iTunes, etc.)
              </>
              <>
                (Formato de Audiolibro para{` `}
                <span className="hidden sm:inline">Aplicación de Libros, </span>
                iTunes, etc.)
              </>
            </Dual.Frag>
          </dd>
        </dl>
      </div>
      <div className="flex flex-col gap-6 items-center mt-6 mb-4">
        <QualitySwitch key="switch" quality={quality} onChange={setQuality} />
        <p key="text" className="text-flgray-500 text-base antialiased tracking-wider">
          (
          {quality === `hq`
            ? t`Higher quality, larger file size`
            : t`Lower quality, faster download`}
          )
        </p>
        <Link
          key="help"
          className="text-flprimary text-sm tracking-wider"
          href={t`/audio-help`}
        >
          <span className="fl-underline">{t`Need Help?`}</span>
          {` `}
          <i aria-hidden className="fa fa-life-ring opacity-75 pl-1" />
        </Link>
      </div>
    </div>
  );
};

export default DownloadLinks;
