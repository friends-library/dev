import React from 'react';
import invariant from 'tiny-invariant';
import { price } from '@friends-library/lulu';
import { t } from '@friends-library/locale';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { Doc } from '@/lib/types';
import { getAllDocuments, getDocument } from '@/lib/db/documents';
import DocBlock from '@/components/pages/document/DocBlock';
import ListenBlock from '@/components/pages/document/ListenBlock';
import BookTeaserCards from '@/components/pages/explore/BookTeaserCards';
import ExploreBooksBlock from '@/components/pages/home/ExploreBooksBlock';
import { isCompilations } from '@/lib/friend';
import { formatFilesize } from '@/lib/filesize';
import { bookSize } from '@/lib/book-sizes';
import { LANG } from '@/lib/env';
import Seo from '@/components/core/Seo';
import { bookPageMetaDesc } from '@/lib/seo';

export const getStaticPaths: GetStaticPaths = async () => {
  const documents = Object.keys(await getAllDocuments()).map((path) => ({
    friendSlug: path.split(`/`)[0],
    bookSlug: path.split(`/`)[1],
  }));

  return {
    paths: documents.map(({ friendSlug, bookSlug }) => ({
      params: { friend_slug: friendSlug, book_slug: bookSlug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const friendSlug = context.params?.friend_slug;
  const bookSlug = context.params?.book_slug;
  invariant(typeof friendSlug === `string`);
  invariant(typeof bookSlug === `string`);

  const primaryDocument = await getDocument(friendSlug, bookSlug);
  invariant(primaryDocument);
  const newestEdition = primaryDocument.mostModernEdition;

  const allBooks = Object.values(await getAllDocuments());
  const alternateLanguageBook = Object.values(
    await getAllDocuments(LANG === `en` ? `es` : `en`),
  ).find((doc) => doc.altLanguageId === primaryDocument.id);
  const otherBooksByAuthor = allBooks
    .filter((book) => book.authorSlug === friendSlug)
    .filter((book) => book.slug !== bookSlug);
  const numTotalBooks = allBooks.length;

  return {
    props: {
      primaryDocument: {
        ...primaryDocument,
        price: price(bookSize(newestEdition.size), newestEdition.numPages),
        alternateLanguageSlug: alternateLanguageBook?.slug ?? null,
      },
      otherBooksByAuthor,
      numTotalBooks,
    },
  };
};

interface Props {
  primaryDocument: Doc<
    | 'editions'
    | 'authorName'
    | 'shortDescription'
    | 'mostModernEdition'
    | 'authorGender'
    | 'authorSlug'
    | 'hasAudio'
    | 'isComplete'
    | 'originalTitle'
    | 'numDownloads'
    | 'blurb'
  > & { price: number; alternateLanguageSlug: string | null };
  otherBooksByAuthor: Array<
    Doc<'shortDescription' | 'editions' | 'authorGender' | 'createdAt'>
  >;
  numTotalBooks: number;
}

const DocumentPage: React.FC<Props> = ({
  primaryDocument,
  otherBooksByAuthor,
  numTotalBooks,
}) => {
  const audiobook = primaryDocument.mostModernEdition.audiobook;
  const baseDownloadUrl = `https://api.friendslibrary.com/download/${primaryDocument.mostModernEdition.id}/audio`;
  return (
    <>
      <Seo
        title={primaryDocument.title}
        description={bookPageMetaDesc(
          primaryDocument.authorName,
          primaryDocument.blurb,
          primaryDocument.title,
          primaryDocument.hasAudio,
          isCompilations(primaryDocument.authorSlug),
          LANG,
        )}
        ogImage={`https://flp-assets.nyc3.digitaloceanspaces.com/${LANG}/${primaryDocument.authorSlug}/${primaryDocument.slug}/${primaryDocument.mostModernEdition.type}/images/cover-3d--w700.png`}
      />
      <div>
        <DocBlock {...primaryDocument} />
        {audiobook && (
          <ListenBlock
            complete={!audiobook.isIncomplete}
            m4bFilesizeLq={formatFilesize(audiobook.lq.m4bFilesize)}
            m4bFilesizeHq={formatFilesize(audiobook.hq.m4bFilesize)}
            mp3ZipFilesizeLq={formatFilesize(audiobook.lq.mp3ZipFilesize)}
            mp3ZipFilesizeHq={formatFilesize(audiobook.hq.mp3ZipFilesize)}
            m4bUrlLq={`${baseDownloadUrl}/m4b/lq`}
            m4bUrlHq={`${baseDownloadUrl}/m4b/hq`}
            mp3ZipUrlLq={`${baseDownloadUrl}/mp3s/lq`}
            mp3ZipUrlHq={`${baseDownloadUrl}/mp3s/hq`}
            podcastUrlLq={`${baseDownloadUrl}/podcast/lq/podcast.rss`}
            podcastUrlHq={`${baseDownloadUrl}/podcast/hq/podcast.rss`}
            title={primaryDocument.title}
            trackIdLq={audiobook.parts[0]?.lqExternalTrackId ?? 0}
            trackIdHq={audiobook.parts[0]?.hqExternalTrackId ?? 0}
            playlistIdHq={audiobook.hq.externalPlaylistId}
            playlistIdLq={audiobook.lq.externalPlaylistId}
            numAudioParts={audiobook.parts.length}
          />
        )}
        <BookTeaserCards
          title={
            isCompilations(primaryDocument.authorName)
              ? t`Other Compilations`
              : t`Other Books by this Author`
          }
          titleEl={`h2`}
          bgColor={`flgray-100`}
          titleTextColor={`flblack`}
          books={otherBooksByAuthor}
        />
        {(!primaryDocument.hasAudio || otherBooksByAuthor.length === 0) && (
          <ExploreBooksBlock numTotalBooks={numTotalBooks} />
        )}
      </div>
    </>
  );
};

export default DocumentPage;
