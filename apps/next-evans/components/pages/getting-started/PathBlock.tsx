import React, { useState } from 'react';
import cx from 'classnames';
import { Front } from '@friends-library/cover-component';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import { CloudArrowDownIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import type { CoverProps } from '@friends-library/types';
import WaveBottomBlock from './WaveBottomBlock';
import Button from '@/components/core/Button';
import { LANG } from '@/lib/env';
import ArrowRight from '@/public/images/arrow-right.png';
import ArrowBent from '@/public/images/arrow-bend.png';

interface Props {
  slug: 'history' | 'doctrinal' | 'spiritual-life' | 'journal';
  color: 'blue' | 'gold' | 'maroon' | 'green';
  title: string;
  children: React.ReactNode;
  books: (CoverProps & {
    hasAudio: boolean;
    documentUrl: string;
    authorUrl: string;
    htmlShortTitle: string;
  })[];
}

const PAGE_SIZE = 4;

const PathBlock: React.FC<Props> = ({ slug, books, title, color, children }) => {
  const [page, setPage] = useState<number>(1);
  if (books.length === 0) return null;
  return (
    <WaveBottomBlock
      color={color}
      className={cx(
        `PathBlock PathBlock--${slug} p-12 text-fl${color}`,
        books.length <= page * PAGE_SIZE && `pb-10`,
      )}
    >
      <h2 className="heading-text mb-6">{title}</h2>
      <p className="body-text mb-12 max-w-4xl mx-auto">{children}</p>
      <div
        className={cx(
          `PathBooks md:flex flex-wrap text-gray-500 antialiased font-sans tracking-wider text-center relative`,
          `before:opacity-[0.7]`,
          LANG === `en`
            ? `before:content-['Start_Here']`
            : `before:content-['Empiezar_Aquí'] before:-rotate-90 translate-x-[10px] translate-y-[-18px]`,
          `md:before:absolute md:before:top-[150px] md:before:left-[-18px] md:before:-rotate-90`,
        )}
      >
        {books.slice(0, page * PAGE_SIZE).map((book, index, arr) => (
          <>
            <div
              key={book.documentUrl}
              className={cx(
                `pt-4 mb-6 md:mb-20 md:w-1/2 xl:w-1/4 relative flex flex-col justify-start`,
              )}
            >
              <div
                className={cx(
                  `w-[30px] h-[16px] [margin:0_auto_38px_auto] block rotate-90 opacity-[0.7]`,
                  `md:absolute md:right-[-15px] md:top-[58%] md:rotate-0`,
                  (index + 1) % 2 === 0 &&
                    `md:[transform:rotate(135deg)] md:right-auto md:left-[-15px] md:top-[108%] xl:rotate-0 xl:right-0 xl:top-[58%] xl:left-auto`,
                  index === arr.length - 1 && `md:hidden`,
                  index === 3 &&
                    `xl:[transform:rotate(155deg)] xl:right-auto xl:left-[-108%] xl:top-[111%]`,
                )}
                style={{
                  background: `url("${ArrowRight.src}")`,
                  backgroundSize: `contain`,
                  backgroundRepeat: `no-repeat`,
                }}
              />
              <h3 className="heading-text text-base mb-2 font-normal max-w-xs mx-auto px-2">
                <Link
                  className="hover:underline"
                  href={book.documentUrl}
                  dangerouslySetInnerHTML={{
                    __html: book.htmlShortTitle.replace(/--/g, `—`),
                  }}
                />
              </h3>
              <p className="text-center">
                <Link
                  className="inline-block text-center strong-link text-sm mb-10"
                  href={book.authorUrl}
                >
                  {book.author}
                </Link>
              </p>
              <div className="flex flex-col items-center mt-auto">
                <Link href={book.documentUrl}>
                  <Front {...book} shadow={true} scaler={1 / 3} scope="1-3" />
                </Link>
                <div
                  className={cx(
                    `mt-2 flex items-center space-x-2`,
                    index > arr.length - (arr.length % 4 || 4) - 1
                      ? `xl:text-white`
                      : `xl:text-slate-500`,
                    index > arr.length - (arr.length % 2 || 2) - 1
                      ? `md:text-white`
                      : `md:text-slate-500`,
                    index === arr.length - 1 && `text-white`,
                  )}
                >
                  {book.hasAudio && <SpeakerWaveIcon className="h-5" />}
                  <CloudArrowDownIcon className="h-5" />
                </div>
              </div>
            </div>
          </>
        ))}
        <div
          className="hidden absolute md:block top-[210px] left-[20px] w-[25px] h-[25px]"
          style={{
            backgroundImage: `url("${ArrowBent.src}")`,
            backgroundSize: `contain`,
            backgroundRepeat: `no-repeat`,
          }}
        />
      </div>
      {books.length > page * PAGE_SIZE && (
        <Button
          onClick={() => setPage(page + 1)}
          className="mx-auto mt-12 xl:mb-2"
        >{t`View More`}</Button>
      )}
    </WaveBottomBlock>
  );
};

export default PathBlock;
