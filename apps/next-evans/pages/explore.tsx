import React from 'react';
import { PrismaClient } from '@prisma/client';
import type { GetStaticProps } from 'next';
import type { BookPreviewProps, Residence } from '@/lib/types';
import BackgroundImage from '@/components/core/BackgroundImage';
import Dual from '@/components/core/Dual';
import HeroImg from '@/public/images/explore-books.jpg';
import NavBlock from '@/components/pages/explore/NavBlock';
import UpdatedEditionsBlock from '@/components/pages/explore/UpdatedEditionsBlock';
import { LANG } from '@/lib/env';
import getCustomCode from '@/lib/get-custom-code';
import { mostModernEdition } from '@/lib/editions';
import GettingStartedLinkBlock from '@/components/pages/explore/GettingStartedLinkBlock';
import AudioBooksBlock from '@/components/pages/explore/AudioBooksBlock';
import NewBooksBlock from '@/components/pages/explore/NewBooksBlock';
import ExploreRegionsBlock from '@/components/pages/explore/RegionBlock';
import { getBookUrl, getFriendUrl } from '@/lib/friend';
import { months } from '@/lib/dates';
import { documentRegion, getPrimaryResidence } from '@/lib/residences';

export const getStaticProps: GetStaticProps<Props> = async () => {
  const prisma = new PrismaClient();
  // TODO ~ replace with new optimized functions
  const friends = await prisma.friends.findMany({
    where: { lang: LANG },
    select: {
      slug: true,
      name: true,
      gender: true,
      friend_residences: {
        select: {
          city: true,
          region: true,
          friend_residence_durations: {
            select: {
              start: true,
              end: true,
            },
          },
        },
      },
      documents: {
        select: {
          slug: true,
          title: true,
          partial_description: true,
          created_at: true,
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

  const allBooks = friends.flatMap((friend, index) => {
    const codeForFriend = customCode[index];
    return friend.documents
      .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
      .map((doc) => {
        const codeForDocument = codeForFriend ? codeForFriend[doc.slug] : undefined;
        return {
          authorSlug: friend.slug,
          authorGender: friend.gender,
          author: friend.name,
          authorResidences: friend.friend_residences.map((residence) => ({
            city: residence.city,
            region: residence.region,
            durations: residence.friend_residence_durations,
          })),
          title: doc.title,
          edition: mostModernEdition(doc.editions.map((edition) => edition.type)),
          customCss: codeForDocument ? codeForDocument.css || `` : ``,
          customHtml: codeForDocument ? codeForDocument.html || `` : ``,
          hasAudio: doc.editions.some((edition) => edition.edition_audios),
          documentSlug: doc.slug,
          createdAt: doc.created_at.toISOString(),
          audioDuration: ``,
          htmlShortTitle: doc.title,
          documentUrl: getBookUrl(friend.slug, doc.slug),
          authorUrl: getFriendUrl(friend.slug, friend.gender),
          description: doc.partial_description,
          badgeText: `${months[LANG][doc.created_at.getMonth()]?.substring(
            0,
            3,
          )} ${doc.created_at.getDate()}`,
        };
      });
  });
  return {
    props: {
      numBooks: allBooks.length,
      books: allBooks,
    },
  };
};

interface Props {
  numBooks: number;
  books: Array<
    BookPreviewProps & {
      createdAt: string;
      audioDuration?: string;
      htmlShortTitle: string;
      documentUrl: string;
      authorUrl: string;
      description: string;
      authorResidences: Array<Residence>;
      badgeText?: string;
      className?: string;
    }
  >;
}

const ExploreBooks: React.FC<Props> = ({ numBooks, books }) => (
  <div>
    <BackgroundImage src={HeroImg} fineTuneImageStyles={{ objectFit: `cover` }}>
      <div className="p-8 sm:p-16 lg:p-24 bg-black/60 lg:backdrop-blur-sm">
        <WhiteOverlay>
          <Dual.H1 className="sans-wider text-3xl mb-6">
            <>Explore Books</>
            <>Explorar Libros</>
          </Dual.H1>
          <Dual.P className="body-text">
            <>
              We currently have {numBooks} books freely available on this site.
              Overwhelmed? On this page you can browse all the titles by edition, region,
              time period, tags, and more&mdash;or search the full library to find exactly
              what you’re looking for.
            </>
            <>
              Actualmente tenemos {numBooks} libros disponibles de forma gratuita en este
              sitio, y más están siendo traducidos y añadidos regularmente. En nuestra
              página de “Explorar” puedes navegar por todos nuestros libros y audiolibros,
              o buscar libros en la categoría particular que más te interese.
            </>
          </Dual.P>
        </WhiteOverlay>
      </div>
    </BackgroundImage>
    <NavBlock />
    <UpdatedEditionsBlock books={books.filter((book) => book.edition === `updated`)} />
    <GettingStartedLinkBlock />
    <AudioBooksBlock books={books.filter((book) => book.hasAudio)} />
    <NewBooksBlock
      books={books
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)
        .map((book) => ({ ...book, audioDuration: undefined }))}
    />
    {LANG === `en` && (
      <ExploreRegionsBlock
        books={books
          .filter((book) => book.authorResidences.length > 0)
          .map((book) => ({
            ...book,
            region: documentRegion(getPrimaryResidence(book.authorResidences).region),
          }))}
      />
    )}
  </div>
);

export default ExploreBooks;

export const WhiteOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white text-center py-12 md:py-16 lg:py-20 px-10 sm:px-16 my-6 max-w-screen-md mx-auto">
    {children}
  </div>
);
