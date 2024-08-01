import React from 'react';
import invariant from 'tiny-invariant';
import { t } from '@friends-library/locale';
import type { NextPage, Metadata } from 'next';
import DocBlock from './DocBlock';
import ListenBlock from './ListenBlock';
import { LANG } from '@/lib/env';
import { getDocumentUrl, getFriendUrl } from '@/lib/friend';
import ExploreBooksBlock from '@/app/(home)/ExploreBooksBlock';
import BookTeaserCards from '@/components/core/BookTeaserCards';
import * as code from '@/lib/ssg/custom-code';
import * as seo from '@/lib/seo';
import api, { type Api } from '@/lib/ssg/api-client';
import { generatePodcastFeeds } from '@/lib/ssg/podcast';

type Props = Api.DocumentPage.Output;
type Params = { friend_slug: string; document_slug: string };

export async function generateStaticParams(): Promise<Array<Params>> {
  const output = await api.publishedDocumentSlugs(LANG);
  return output.map(({ friendSlug, documentSlug }) => ({
    friend_slug: friendSlug,
    document_slug: documentSlug,
  }));
}

async function getPageData(params: Params): Promise<Props> {
  const friendSlug = params.friend_slug;
  const documentSlug = params.document_slug;
  invariant(typeof friendSlug === `string`);
  invariant(typeof documentSlug === `string`);
  const input = { lang: LANG, friendSlug, documentSlug } as const;
  const [props, docCustomCode] = await Promise.all([
    api.documentPage(input),
    code.document(friendSlug, documentSlug),
  ]);
  const otherCode = await code.some(
    props.otherBooksByFriend.map((document) => ({
      friendSlug,
      documentSlug: document.slug,
    })),
  );
  if (process.env.VERCEL) {
    generatePodcastFeeds(props.document);
  }
  return {
    otherBooksByFriend: props.otherBooksByFriend.map(
      code.merging(otherCode, (doc) => [friendSlug, doc.slug]),
    ),
    numTotalBooks: props.numTotalBooks,
    document: code.merge(props.document, docCustomCode),
  };
}

const Page: NextPage<{ params: Params }> = async ({ params }) => {
  const { otherBooksByFriend, numTotalBooks, document } = await getPageData(params);
  return (
    <div>
      <DocBlock {...document} hasAudio={!!document.primaryEdition.audiobook} />
      {document.primaryEdition.audiobook && (
        <ListenBlock
          tracks={document.primaryEdition.audiobook.parts.map((part) => ({
            title: part.title,
            mp3Url: part.playbackUrl,
            duration: part.durationInSeconds,
          }))}
          isIncomplete={document.primaryEdition.audiobook.isIncomplete}
          m4bFilesize={document.primaryEdition.audiobook.m4bFilesize}
          mp3ZipFilesize={document.primaryEdition.audiobook.mp3ZipFilesize}
          m4bLoggedDownloadUrl={document.primaryEdition.audiobook.m4bLoggedDownloadUrl}
          mp3ZipLoggedDownloadUrl={
            document.primaryEdition.audiobook.mp3ZipLoggedDownloadUrl
          }
          podcastLoggedDownloadUrl={
            document.primaryEdition.audiobook.podcastLoggedDownloadUrl
          }
          mp3LoggedDownloadUrls={document.primaryEdition.audiobook.parts.map(
            (part) => part.loggedDownloadUrl,
          )}
        />
      )}
      <BookTeaserCards
        title={
          document.isCompilation ? t`Other Compilations` : t`Other Books by this Author`
        }
        titleEl="h2"
        bgColor="flgray-100"
        titleTextColor="flblack"
        books={otherBooksByFriend.map((book) => ({
          title: book.title,
          description: book.description,
          paperbackVolumes: book.paperbackVolumes,
          htmlShortTitle: book.htmlShortTitle,
          isbn: book.isbn,
          createdAt: book.createdAt,
          editionType: book.editionType,
          customCss: book.customCss,
          customHtml: book.customHtml,
          friendName: document.friendName,
          isCompilation: document.isCompilation,
          documentUrl: getDocumentUrl(document.friendSlug, book.documentSlug),
          friendUrl: getFriendUrl(document.friendSlug, document.friendGender),
        }))}
      />
      {(!document.primaryEdition.audiobook || otherBooksByFriend.length === 0) && (
        <ExploreBooksBlock numTotalBooks={numTotalBooks} />
      )}
    </div>
  );
};

export default Page;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { document } = await getPageData(props.params);
  return seo.nextMetadata(
    document.title,
    seo.bookPageMetaDesc(
      document.friendName,
      document.description,
      document.title,
      document.primaryEdition.audiobook !== undefined,
      document.isCompilation,
    ),
    document.ogImageUrl,
  );
}

export const revalidate = 10800; // 3 hours
