/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Lang, EditionType, PrintSizeVariant, TagType } from './globalTypes';

// ====================================================
// GraphQL query operation: EditDocument
// ====================================================

export interface EditDocument_document_friend {
  __typename: 'Friend';
  id: string;
  name: string;
  lang: Lang;
}

export interface EditDocument_document_editions_isbn {
  __typename: 'Isbn';
  code: string;
}

export interface EditDocument_document_editions_document {
  __typename: 'Document';
  id: string;
}

export interface EditDocument_document_editions_audio_edition {
  __typename: 'Edition';
  id: string;
}

export interface EditDocument_document_editions_audio_parts_audio {
  __typename: 'Audio';
  id: string;
}

export interface EditDocument_document_editions_audio_parts {
  __typename: 'AudioPart';
  id: string;
  order: number;
  title: string;
  duration: number;
  chapters: number[];
  mp3SizeHq: number;
  mp3SizeLq: number;
  externalIdHq: Int64;
  externalIdLq: Int64;
  audio: EditDocument_document_editions_audio_parts_audio;
}

export interface EditDocument_document_editions_audio {
  __typename: 'Audio';
  id: string;
  reader: string;
  isIncomplete: boolean;
  mp3ZipSizeHq: number;
  mp3ZipSizeLq: number;
  m4bSizeHq: number;
  m4bSizeLq: number;
  externalPlaylistIdHq: Int64 | null;
  externalPlaylistIdLq: Int64 | null;
  edition: EditDocument_document_editions_audio_edition;
  parts: EditDocument_document_editions_audio_parts[];
}

export interface EditDocument_document_editions {
  __typename: 'Edition';
  id: string;
  type: EditionType;
  paperbackSplits: number[] | null;
  paperbackOverrideSize: PrintSizeVariant | null;
  editor: string | null;
  isbn: EditDocument_document_editions_isbn | null;
  isDraft: boolean;
  document: EditDocument_document_editions_document;
  audio: EditDocument_document_editions_audio | null;
}

export interface EditDocument_document_tags_document {
  __typename: 'Document';
  id: string;
}

export interface EditDocument_document_tags {
  __typename: 'DocumentTag';
  id: string;
  type: TagType;
  document: EditDocument_document_tags_document;
}

export interface EditDocument_document_relatedDocuments_document {
  __typename: 'Document';
  id: string;
}

export interface EditDocument_document_relatedDocuments_parentDocument {
  __typename: 'Document';
  id: string;
}

export interface EditDocument_document_relatedDocuments {
  __typename: 'RelatedDocument';
  id: string;
  description: string;
  document: EditDocument_document_relatedDocuments_document;
  parentDocument: EditDocument_document_relatedDocuments_parentDocument;
}

export interface EditDocument_document {
  __typename: 'Document';
  id: string;
  altLanguageId: string | null;
  title: string;
  slug: string;
  filename: string;
  published: number | null;
  originalTitle: string | null;
  incomplete: boolean;
  description: string;
  partialDescription: string;
  featuredDescription: string | null;
  friend: EditDocument_document_friend;
  editions: EditDocument_document_editions[];
  tags: EditDocument_document_tags[];
  relatedDocuments: EditDocument_document_relatedDocuments[];
}

export interface EditDocument_selectableDocuments_friend {
  __typename: 'Friend';
  lang: Lang;
  alphabeticalName: string;
}

export interface EditDocument_selectableDocuments {
  __typename: 'Document';
  id: string;
  title: string;
  friend: EditDocument_selectableDocuments_friend;
}

export interface EditDocument {
  document: EditDocument_document;
  selectableDocuments: EditDocument_selectableDocuments[];
}

export interface EditDocumentVariables {
  id: UUID;
}
