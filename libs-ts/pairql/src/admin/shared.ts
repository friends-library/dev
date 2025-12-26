// auto-generated, do not edit

export interface EditableAudio {
  id: UUID;
  editionId: UUID;
  reader: string;
  isIncomplete: boolean;
  mp3ZipSizeHq: number;
  mp3ZipSizeLq: number;
  m4bSizeHq: number;
  m4bSizeLq: number;
  parts: EditableAudioPart[];
}

export interface EditableAudioPart {
  id: UUID;
  audioId: UUID;
  order: number;
  title: string;
  duration: number;
  chapters: number[];
  mp3SizeHq: number;
  mp3SizeLq: number;
}

export interface EditableDocument {
  id: UUID;
  friendId: UUID;
  altLanguageId?: UUID;
  title: string;
  slug: string;
  filename: string;
  published?: number;
  originalTitle?: string;
  incomplete: boolean;
  description: string;
  partialDescription: string;
  featuredDescription?: string;
  friend: { id: UUID; name: string; lang: `en` | `es` };
  editions: EditableEdition[];
  tags: Array<{
    id: UUID;
    documentId: UUID;
    type:
      | `journal`
      | `letters`
      | `exhortation`
      | `doctrinal`
      | `treatise`
      | `history`
      | `allegory`
      | `spiritualLife`;
  }>;
  relatedDocuments: Array<{
    id: UUID;
    documentId: UUID;
    parentDocumentId: UUID;
    description: string;
  }>;
}

export interface EditableDocumentTag {
  id: UUID;
  documentId: UUID;
  type:
    | `journal`
    | `letters`
    | `exhortation`
    | `doctrinal`
    | `treatise`
    | `history`
    | `allegory`
    | `spiritualLife`;
}

export interface EditableEdition {
  id: UUID;
  documentId: UUID;
  type: `updated` | `original` | `modernized`;
  paperbackSplits?: number[];
  paperbackOverrideSize?: `s` | `m` | `xl` | `xlCondensed`;
  editor?: string;
  isbn?: string;
  isDraft: boolean;
  audio?: EditableAudio;
}

export interface EditableFriend {
  id: UUID;
  lang: `en` | `es`;
  name: string;
  slug: string;
  gender: `male` | `female` | `mixed`;
  born?: number;
  died?: number;
  description: string;
  published?: ISODateString;
  residences: EditableFriendResidence[];
  quotes: EditableFriendQuote[];
  documents: EditableDocument[];
}

export interface EditableFriendQuote {
  id: UUID;
  friendId: UUID;
  source: string;
  text: string;
  order: number;
}

export interface EditableFriendResidence {
  id: UUID;
  friendId: UUID;
  city: string;
  region: string;
  durations: Array<{ id: UUID; friendResidenceId: UUID; start: number; end: number }>;
}

export interface EditableFriendResidenceDuration {
  id: UUID;
  friendResidenceId: UUID;
  start: number;
  end: number;
}

export interface EditableRelatedDocument {
  id: UUID;
  documentId: UUID;
  parentDocumentId: UUID;
  description: string;
}

export interface EditableToken {
  id: UUID;
  value: UUID;
  description: string;
  uses?: number;
  scopes: EditableTokenScope[];
  createdAt: ISODateString;
}

export interface EditableTokenScope {
  id: UUID;
  tokenId: UUID;
  scope:
    | `all`
    | `queryDownloads`
    | `mutateDownloads`
    | `queryOrders`
    | `mutateOrders`
    | `queryArtifactProductionVersions`
    | `mutateArtifactProductionVersions`
    | `queryEntities`
    | `mutateEntities`
    | `queryTokens`
    | `mutateTokens`;
}

export type EntityType =
  | `friendQuote`
  | `friendResidence`
  | `friendResidenceDuration`
  | `document`
  | `documentTag`
  | `relatedDocument`
  | `edition`
  | `audio`
  | `audioPart`
  | `token`
  | `tokenScope`
  | `friend`;

export interface SelectableDocument {
  id: UUID;
  title: string;
  lang: `en` | `es`;
  friendAlphabeticalName: string;
}

export interface UpsertAudio {
  id: UUID;
  editionId: UUID;
  isIncomplete: boolean;
  m4bSizeHq: number;
  m4bSizeLq: number;
  mp3ZipSizeHq: number;
  mp3ZipSizeLq: number;
  reader: string;
}

export interface UpsertAudioPart {
  id: UUID;
  audioId: UUID;
  chapters: number[];
  duration: number;
  mp3SizeHq: number;
  mp3SizeLq: number;
  order: number;
  title: string;
}

export interface UpsertDocument {
  id: UUID;
  friendId: UUID;
  altLanguageId?: UUID;
  description: string;
  featuredDescription?: string;
  filename: string;
  incomplete: boolean;
  originalTitle?: string;
  partialDescription: string;
  published?: number;
  slug: string;
  title: string;
}

export interface UpsertDocumentTag {
  id: UUID;
  documentId: UUID;
  type:
    | `journal`
    | `letters`
    | `exhortation`
    | `doctrinal`
    | `treatise`
    | `history`
    | `allegory`
    | `spiritualLife`;
}

export interface UpsertEdition {
  id: UUID;
  documentId: UUID;
  type: `updated` | `original` | `modernized`;
  editor?: string;
  isDraft: boolean;
  paperbackOverrideSize?: `s` | `m` | `xl` | `xlCondensed`;
  paperbackSplits?: number[];
}

export type UpsertEntity =
  | { case: `audio`; entity: UpsertAudio }
  | { case: `audioPart`; entity: UpsertAudioPart }
  | { case: `document`; entity: UpsertDocument }
  | { case: `documentTag`; entity: UpsertDocumentTag }
  | { case: `edition`; entity: UpsertEdition }
  | { case: `friend`; entity: UpsertFriend }
  | { case: `friendQuote`; entity: UpsertFriendQuote }
  | { case: `friendResidence`; entity: UpsertFriendResidence }
  | { case: `friendResidenceDuration`; entity: UpsertFriendResidenceDuration }
  | { case: `relatedDocument`; entity: UpsertRelatedDocument }
  | { case: `token`; entity: UpsertToken }
  | { case: `tokenScope`; entity: UpsertTokenScope };

export interface UpsertFriend {
  id: UUID;
  description: string;
  died?: number;
  born?: number;
  gender: `male` | `female` | `mixed`;
  lang: `en` | `es`;
  name: string;
  slug: string;
  published?: ISODateString;
}

export interface UpsertFriendQuote {
  id: UUID;
  friendId: UUID;
  context?: string;
  order: number;
  source: string;
  text: string;
}

export interface UpsertFriendResidence {
  id: UUID;
  friendId: UUID;
  city: string;
  region: string;
}

export interface UpsertFriendResidenceDuration {
  id: UUID;
  friendResidenceId: UUID;
  end: number;
  start: number;
}

export interface UpsertRelatedDocument {
  id: UUID;
  documentId: UUID;
  parentDocumentId: UUID;
  description: string;
}

export interface UpsertToken {
  id: UUID;
  value: UUID;
  uses?: number;
  description: string;
}

export interface UpsertTokenScope {
  id: UUID;
  tokenId: UUID;
  scope:
    | `all`
    | `queryDownloads`
    | `mutateDownloads`
    | `queryOrders`
    | `mutateOrders`
    | `queryArtifactProductionVersions`
    | `mutateArtifactProductionVersions`
    | `queryEntities`
    | `mutateEntities`
    | `queryTokens`
    | `mutateTokens`;
}
