import React from 'react';
import { PrismaClient } from '@prisma/client';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { GetStaticProps } from 'next';
import type { CoverProps } from '@friends-library/types';
import Dual from '@/components/core/Dual';
import Heading from '@/components/core/Heading';
import BackgroundImage from '@/components/core/BackgroundImage';
import BooksGrid from '@/public/images/explore-books.jpg';
import DuoToneWaveBlock from '@/components/pages/getting-started/DuoToneWaveBlock';
import EmbeddedAudio from '@/components/core/EmbeddedAudio';
import { LANG } from '@/lib/env';
import { makeScroller } from '@/lib/scroll';
import GettingStartedPaths from '@/components/pages/getting-started/GettingStartedPaths';
import recommendedBooks from '@/lib/recommended-books';
import { mostModernEdition } from '@/lib/editions';
import getCustomCode from '@/lib/get-custom-code';

export const getStaticProps: GetStaticProps<Props> = async () => {
  const prisma = new PrismaClient();

  const friends = await prisma.friends.findMany({
    where: { lang: LANG },
    select: {
      slug: true,
      name: true,
      documents: {
        select: {
          slug: true,
          title: true,
          editions: {
            select: {
              type: true,
              edition_audios: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const customCode = await Promise.all(
    friends.map((friend) =>
      getCustomCode(
        friend.slug,
        friend.documents.map((doc) => doc.slug),
      ),
    ),
  );

  const allBooks: NeededCoverProps[] = friends.flatMap((friend, index) => {
    const codeForFriend = customCode[index];
    return friend.documents.map((doc) => {
      const codeForDocument = codeForFriend ? codeForFriend[doc.slug] : undefined;
      return {
        authorSlug: friend.slug,
        author: friend.name,
        title: doc.title,
        edition: mostModernEdition(doc.editions.map((edition) => edition.type)),
        customCss: codeForDocument ? codeForDocument.css || `` : ``,
        customHtml: codeForDocument ? codeForDocument.html || `` : ``,
        hasAudio: doc.editions.some((edition) => edition.edition_audios),
        slug: doc.slug,
      };
    });
  });

  function filterBooks(
    books: Array<NeededCoverProps>,
    category: 'history' | 'doctrine' | 'spiritualLife' | 'journals',
  ): Array<NeededCoverProps> {
    return books
      .filter((book) =>
        recommendedBooks[category][LANG].some(
          (recommendedBook) =>
            recommendedBook.author === book.authorSlug &&
            recommendedBook.title === book.slug,
        ),
      )
      .sort(
        (a, b) =>
          recommendedBooks[category][LANG].findIndex(
            (book) => book.title === a.slug && book.author === a.authorSlug,
          ) -
          recommendedBooks[category][LANG].findIndex(
            (book) => book.title === b.slug && book.author === b.authorSlug,
          ),
      );
  }

  const organizedBooks = {
    history: filterBooks(allBooks, `history`),
    doctrine: filterBooks(allBooks, `doctrine`),
    spiritualLife: filterBooks(allBooks, `spiritualLife`),
    journals: filterBooks(allBooks, `journals`),
  };

  return { props: { books: organizedBooks, numBooks: allBooks.length } };
};

export type NeededCoverProps = Pick<
  CoverProps,
  'title' | 'author' | 'edition' | 'customCss' | 'customHtml'
> & {
  authorSlug: string;
  hasAudio: boolean;
  slug: string;
};

interface Props {
  books: {
    history: Array<NeededCoverProps>;
    doctrine: Array<NeededCoverProps>;
    spiritualLife: Array<NeededCoverProps>;
    journals: Array<NeededCoverProps>;
  };
  numBooks: number;
}

const GettingStarted: React.FC<Props> = ({ books, numBooks }) => (
  <div>
    <BackgroundImage src={BooksGrid} className="" fit={`cover`} position={`center`}>
      <div className="flex flex-col items-center justify-center py-16 md:py-36 px-8 sm:px-12 md:px-20 lg:px-36 [background:radial-gradient(rgb(0_0_0/0.65),rgb(0_0_0/0.85),rgb(0_0_0/0.95))]">
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
      </div>
    </BackgroundImage>
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
            Si nunca has escuchado nuestro audio introductorio que explica quienes fueron
            los primeros Cuáqueros, te recomendamos que empieces por aquí, haciendo clic
            al botón de reproducir a continuación:
          </>
        </Dual.P>
        <div className="max-w-3xl sm:w-3/4">
          <EmbeddedAudio
            trackId={LANG === `es` ? 783137959 : 242345955}
            title={
              LANG === `es`
                ? `¿Quienes Eran Los Primeros Cuáqueros?`
                : `Introduction to the Early Quakers`
            }
            showArtwork={false}
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
          Now for the only decision you need to make: of the four categories below, which
          one interests you the most? Click one of the colored boxes below to see our
          recommendations for that particular category.
        </>
        <>
          La única decisión que tienes que tomar es la siguiente: de las categorías a
          continuación ¿Cuál es la que más te interesa? Haz clic en uno de los cuadros a
          continuación para ver nuestras recomendaciones para esa categoría en particular.
        </>
      </Dual.P>
    </div>
    <div className="md:flex flex-wrap">
      <PathIntro
        title={t`History`}
        color="maroon"
        onClick={() => makeScroller(`.PathBlock--history`)()}
      >
        <HistoryBlurb />
      </PathIntro>
      <PathIntro
        title={t`Doctrine`}
        color="blue"
        onClick={() => makeScroller(`.PathBlock--doctrinal`)()}
      >
        <DoctrineBlurb />
      </PathIntro>
      <PathIntro
        title={t`Spiritual Life`}
        color="green"
        onClick={() => makeScroller(`.PathBlock--spiritual-life`)()}
      >
        <DevotionalBlurb />
      </PathIntro>
      <PathIntro
        title={LANG === `en` ? `Journals` : `Biográfico`}
        color="gold"
        onClick={() => makeScroller(`.PathBlock--journal`)()}
      >
        <JournalsBlurb />
      </PathIntro>
    </div>
    <GettingStartedPaths
      {...{ HistoryBlurb, DoctrineBlurb, DevotionalBlurb, JournalsBlurb }}
      books={books}
    />
  </div>
);

export default GettingStarted;

interface PathIntroProps {
  title: string;
  className?: string;
  color: 'blue' | 'maroon' | 'gold' | 'green';
  onClick: () => void;
  noBooks?: boolean;
  children: React.ReactNode;
}

const PathIntro: React.FC<PathIntroProps> = ({
  className,
  color,
  title,
  children,
  onClick,
  noBooks,
}) => (
  <section
    onClick={onClick}
    className={cx(
      className,
      !noBooks && `cursor-pointer`,
      `bg-fl${color}`,
      `p-8 pb-4 md:w-1/2 lg:w-1/4 flex flex-col justify-start`,
    )}
  >
    <h3 className="font-sans text-white text-center text-3xl tracking-wide mb-8">
      {title}
    </h3>
    <p className="body-text text-white text-md mb-8">{children}</p>
    {!noBooks && (
      <div className="flex flex-col items-center mb-10 text-xl mt-auto">
        <button className="text-white uppercase font-sans tracking-wider text-base">
          {t`Learn More`}
        </button>
        <ChevronDownIcon className="text-white antialiased pt-2 h-8" />
      </div>
    )}
  </section>
);

export const DevotionalBlurb: React.FC = () => (
  <Dual.Frag>
    <>
      Early Friends left behind a precious treasury of devotional writings which, when
      read by hungry hearts, greatly tend to kindle love towards God, faithfulness in
      obedience, meekness towards all fellow-creatures, and a deep sense of humility and
      sobriety during this time of our sojourning in the body.
    </>
    <>
      Los primeros Amigos dejaron un tesoro de ricos escritos espirituales que, cuando son
      leídos por corazones hambrientos, tienden grandemente a despertar amor hacia Dios,
      fidelidad en la obediencia, mansedumbre para con todos, y un profundo sentido de
      humildad y sobriedad durante el tiempo de nuestra estancia en el cuerpo.
    </>
  </Dual.Frag>
);

export const JournalsBlurb: React.FC = () => (
  <Dual.Frag>
    <>
      The most common of all Quaker writings are their journals. These are incredibly
      inspiring and instructive records of real men and women who walked in the
      &ldquo;ancient path&rdquo; of obedience, humility, faith, and love&mdash;overcoming
      the world not by their own strength, but by clinging to the grace of Jesus Christ
      that springs up in the heart.
    </>
    <>
      De todos los escritos de los Cuáqueros, sus diarios y biografías son los más
      comunes. Estos son relatos increíblemente inspiradores e instructivos de hombres y
      mujeres que caminaron en la “senda antigua” de obediencia, humildad, fe y
      amor—venciendo al mundo, no por su propia fuerza, sino por aferrarse a la gracia de
      Jesucristo que brota en el corazón.
    </>
  </Dual.Frag>
);

export const DoctrineBlurb: React.FC = () => (
  <Dual.Frag>
    <>
      Although they hold much in common with other Bible-believing Christian groups, there
      are a number of distinctive doctrines, principles, and testimonies that they were
      led by the Spirit of Truth to embrace and maintain, and which set them apart from
      other Christian communities.
    </>
    <>
      Aunque ellos tienen mucho en común con otros grupos cristianos que creen en la
      Biblia, hay una cantidad de doctrinas, principios y testimonios distintivos que los
      Cuáqueros fueron llevados por el Espíritu de la Verdad a abrazar y mantener, cosas
      que los diferenciaban de otras comunidades cristianas.
    </>
  </Dual.Frag>
);

export const HistoryBlurb: React.FC = () => (
  <Dual.Frag>
    <>
      Get a feel for the history of the early Society of Friends from their own
      contemporary historians. Learn about the context in which they emerged, the great
      sufferings of the early generations, the spread and progress of Truth in Great
      Britain, colonial America, and beyond, and become familiar with many of the notable
      figures among early Friends.
    </>
    <>
      Actualmente tenemos dos libros históricos disponibles en español; uno que está
      completo, y otro que se encuentra en proceso de traducción. Estos excelentes libros
      te ayudarán a aprender acerca de la historia de la primera Sociedad de Amigos, cómo
      fue su surgimiento, sus grandes sufrimientos y fidelidad, y la difusión de la Verdad
      en Gran Bretaña, Europa, las colonias de América y más allá.
    </>
  </Dual.Frag>
);
