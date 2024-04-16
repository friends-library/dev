import React from 'react';
import NextBgImage from 'next-bg-image';
import { t } from '@friends-library/locale';
import type { NextPage, Metadata } from 'next';
import * as Blurb from './Blurbs';
import { type Props as PathBlockProps } from './PathBlock';
import DuoToneWaveBlock from './DuoToneWaveBlock';
import GettingStartedPaths from './GettingStartedPaths';
import PathIntro from './PathIntro';
import Dual from '@/components/core/Dual';
import Heading from '@/components/core/Heading';
import BooksGrid from '@/public/images/explore-books.jpg';
import AudioPlayer from '@/components/core/AudioPlayer';
import { LANG } from '@/lib/env';
import recommended from '@/lib/recommended-books';
import { getDocumentUrl, getFriendUrl } from '@/lib/friend';
import * as custom from '@/lib/ssg/custom-code';
import api, { type Api } from '@/lib/ssg/api-client';
import * as seo from '@/lib/seo';

type Book = Api.GettingStartedBooks.Output[number];

interface PageData {
  books: {
    history: Book[];
    doctrine: Book[];
    spiritualLife: Book[];
    journals: Book[];
  };
  numBooks: number;
}

async function getPageData(): Promise<PageData> {
  return await Promise.all([
    api.gettingStartedBooks({ lang: LANG, slugs: recommended.history[LANG] }),
    api.gettingStartedBooks({ lang: LANG, slugs: recommended.doctrine[LANG] }),
    api.gettingStartedBooks({ lang: LANG, slugs: recommended.spiritualLife[LANG] }),
    api.gettingStartedBooks({ lang: LANG, slugs: recommended.journals[LANG] }),
    api.totalPublished(),
    custom.some(customCodeSlugs()),
  ]).then(([history, doctrine, spiritualLife, journals, totalPublished, customCode]) => {
    const merging = custom.merging<Book>(customCode, (d) => [d.friendSlug, d.slug]);
    return {
      books: {
        history: history.map(merging),
        doctrine: doctrine.map(merging),
        spiritualLife: spiritualLife.map(merging),
        journals: journals.map(merging),
      },
      numBooks: totalPublished.books[LANG],
    };
  });
}

const Page: NextPage = async () => {
  const { books, numBooks } = await getPageData();
  return (
    <div>
      <NextBgImage
        eager
        src={[
          `radial-gradient(rgba(0, 0, 0, 0.68), rgba(0, 0, 0, 0.925) 75%)`,
          BooksGrid,
        ]}
        className="flex flex-col items-center justify-center py-20 sm:py-32 px-10 sm:px-16"
      >
        <Heading darkBg className="text-white">
          <Dual.Frag>
            <>Not sure where to get started?</>
            <>¿No estás seguro de dónde empezar?</>
          </Dual.Frag>
        </Heading>
        <Dual.P className="text-center body-text text-white text-lg leading-loose max-w-4xl md:text-left">
          <>
            Interested in reading something from the early Quakers, but picking from{` `}
            {numBooks} books seems daunting? No worries&mdash;on this page we’ve selected
            some of our favorite books and arranged them into four categories. Plus we’ve
            got an introductory audio to help introduce you to the early Friends.
          </>
          <>
            ¿Estás interesado en leer algo de los primeros Cuáqueros, pero no estás seguro
            de dónde empezar? ¡No hay problema! En esta página hemos seleccionado algunos
            de nuestros libros favoritos y los hemos organizado en categorías para
            ayudarte a decidir. Además, hemos puesto un audio introductorio para ayudarte
            a conocer quienes fueron los primeros Amigos.
          </>
        </Dual.P>
      </NextBgImage>
      <DuoToneWaveBlock className="pt-12 px-6 pb-32">
        <div className="flex flex-col sm:items-center">
          <Dual.H2 className="font-sans text-3xl px-6 text-center mb-6 tracking-wide md:text-left">
            <>Step 1: Audio Introduction</>
            <>Paso 1: Audio Introductorio</>
          </Dual.H2>
          <Dual.P className="body-text text-center px-6 mb-10 text-lg leading-loose max-w-3xl md:pr-20">
            <>
              If you haven’t listened to our introductory audio explaining who the early
              Quakers were, we recommend you start here by clicking the play button below:
            </>
            <>
              Si nunca has escuchado nuestro audio introductorio que explica quienes
              fueron los primeros Cuáqueros, te recomendamos que empieces por aquí,
              haciendo clic al botón de reproducir a continuación:
            </>
          </Dual.P>
          <div className="max-w-3xl sm:w-3/4">
            <AudioPlayer
              tracks={[
                {
                  title:
                    LANG === `en`
                      ? `Introduction to the Early Quakers`
                      : `¿Quienes Eran Los Primeros Cuáqueros?`,
                  mp3Url: `https://flp-assets.nyc3.digitaloceanspaces.com/static/intro-to-early-quakers.${LANG}.mp3`,
                  duration: LANG === `en` ? 1215 : 1593,
                },
              ]}
            />
          </div>
        </div>
      </DuoToneWaveBlock>
      <div className="bg-flgray-100 py-12 px-16">
        <Dual.H2 className="font-sans text-3xl text-center mb-6 tracking-wide">
          <>Step 2: Choose A Path</>
          <>Paso 2: Escoge un Camino</>
        </Dual.H2>
        <Dual.P className="body-text text-lg text-center max-w-3xl mx-auto">
          <>
            Now for the only decision you need to make: of the four categories below,
            which one interests you the most? Click one of the colored boxes below to see
            our recommendations for that particular category.
          </>
          <>
            La única decisión que tienes que tomar es la siguiente: de las categorías a
            continuación ¿Cuál es la que más te interesa? Haz clic en uno de los cuadros a
            continuación para ver nuestras recomendaciones para esa categoría en
            particular.
          </>
        </Dual.P>
      </div>
      <div className="md:flex flex-wrap">
        <PathIntro title={t`History`} color="maroon" slug="history">
          <Blurb.History />
        </PathIntro>
        <PathIntro title={t`Doctrine`} color="blue" slug="doctrinal">
          <Blurb.Doctrine />
        </PathIntro>
        <PathIntro title={t`Spiritual Life`} color="green" slug="spiritual-life">
          <Blurb.Devotional />
        </PathIntro>
        <PathIntro
          title={LANG === `en` ? `Journals` : `Biográfico`}
          color="gold"
          slug="journal"
        >
          <Blurb.Journals />
        </PathIntro>
      </div>
      <GettingStartedPaths
        HistoryBlurb={Blurb.History}
        JournalsBlurb={Blurb.Journals}
        DevotionalBlurb={Blurb.Devotional}
        DoctrineBlurb={Blurb.Doctrine}
        books={{
          history: toPathBlock(books.history),
          doctrine: toPathBlock(books.doctrine),
          spiritualLife: toPathBlock(books.spiritualLife),
          journals: toPathBlock(books.journals),
        }}
      />
    </div>
  );
};

export default Page;

export async function generateMetadata(): Promise<Metadata> {
  const { numBooks } = await getPageData();
  return seo.nextMetadata(
    t`Getting Started`,
    seo.pageMetaDesc(`getting-started`, { numBooks }),
  );
}

// helpers

function toPathBlock(books: Array<Book>): PathBlockProps['books'] {
  return books.map((book) => ({
    ...book,
    friendUrl: getFriendUrl(book.friendSlug, book.friendGender),
    documentUrl: getDocumentUrl(book),
  }));
}

function customCodeSlugs(): Array<{ friendSlug: string; documentSlug: string }> {
  let slugs: Array<{ friendSlug: string; documentSlug: string }> = [];
  for (const category of [`history`, `doctrine`, `spiritualLife`, `journals`] as const) {
    slugs = [...slugs, ...recommended[category][LANG]];
  }
  return slugs;
}
