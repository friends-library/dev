import React from 'react';
import invariant from 'tiny-invariant';
import { t } from '@friends-library/locale';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { LANG } from '@/lib/env';
import { getDocumentUrl, getFriendUrl } from '@/lib/friend';
import ExploreBooksBlock from '@/components/pages/home/ExploreBooksBlock';
import BookTeaserCards from '@/components/core/BookTeaserCards';
import DocBlock from '@/components/pages/document/DocBlock';
import ListenBlock from '@/components/pages/document/ListenBlock';
import * as code from '@/lib/ssg/custom-code';
import Seo from '@/components/core/Seo';
import { bookPageMetaDesc } from '@/lib/seo';
import api, { type Api } from '@/lib/ssg/api-client';

type Props = Api.DocumentPage.Output;

export const getStaticPaths: GetStaticPaths = async () => {
  const output = await api.publishedDocumentSlugs(LANG);
  return {
    paths: output.map(({ friendSlug, documentSlug }) => ({
      params: { friend_slug: friendSlug, document_slug: documentSlug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const friendSlug = context.params?.friend_slug;
  const documentSlug = context.params?.document_slug;
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
  return {
    props: {
      otherBooksByFriend: props.otherBooksByFriend.map(
        code.merging(otherCode, (doc) => [friendSlug, doc.slug]),
      ),
      numTotalBooks: props.numTotalBooks,
      document: code.merge(props.document, docCustomCode),
    },
  };
};

const DocumentPage: React.FC<Props> = ({
  otherBooksByFriend,
  numTotalBooks,
  document,
}) => (
  <div>
    <Seo
      title={document.title}
      ogImage={document.ogImageUrl}
      description={bookPageMetaDesc(
        document.friendName,
        document.description,
        document.title,
        document.primaryEdition.audiobook !== undefined,
        document.isCompilation,
      )}
    />
    <DocBlock {...document} hasAudio={!!document.primaryEdition.audiobook} />
    {document.primaryEdition.audiobook && (
      <ListenBlock {...document.primaryEdition.audiobook} title={document.title} />
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

export default DocumentPage;
