import { v4 as uuid } from 'uuid';
import { type T } from '../api-client';
import { removeClientGeneratedIdPrefix } from './api/entities/helpers';

export function friend(): T.EditableFriend {
  return {
    lang: `en`,
    id: clientGeneratedId(),
    name: ``,
    slug: ``,
    born: undefined,
    died: undefined,
    gender: `male`,
    description: ``,
    published: undefined,
    quotes: [],
    documents: [],
    residences: [],
  };
}

export function friendQuote(friend: T.EditableFriend): T.EditableFriendQuote {
  return {
    id: clientGeneratedId(),
    friendId: friend.id,
    source: ``,
    text: ``,
    order: Math.max(0, ...friend.quotes.map((q) => q.order)) + 1,
  };
}

export function relatedDocument(
  documentId: UUID,
  parentDocumentId: UUID,
): T.EditableRelatedDocument {
  return {
    id: clientGeneratedId(),
    documentId: removeClientGeneratedIdPrefix(documentId),
    parentDocumentId: removeClientGeneratedIdPrefix(parentDocumentId),
    description: ``,
  };
}

export function edition(documentId: UUID): T.EditableEdition {
  return {
    id: clientGeneratedId(),
    documentId: removeClientGeneratedIdPrefix(documentId),
    isDraft: true,
    type: `updated`,
    paperbackOverrideSize: undefined,
    paperbackSplits: undefined,
    isbn: undefined,
    editor: undefined,
    audio: undefined,
  };
}

export function audio(editionId: UUID): T.EditableAudio {
  return {
    id: clientGeneratedId(),
    editionId: removeClientGeneratedIdPrefix(editionId),
    reader: `Jessie Henderson`,
    isIncomplete: false,
    m4bSizeHq: 0,
    m4bSizeLq: 0,
    mp3ZipSizeHq: 0,
    mp3ZipSizeLq: 0,
    parts: [],
  };
}

export function audioPart(audio: T.EditableAudio): T.EditableAudioPart {
  return {
    id: clientGeneratedId(),
    audioId: removeClientGeneratedIdPrefix(audio.id),
    order: Math.max(0, ...audio.parts.map((part) => part.order)) + 1,
    title: ``,
    duration: 0,
    chapters: [0],
    mp3SizeHq: 0,
    mp3SizeLq: 0,
  };
}

export function friendResidence(friendId: UUID): T.EditableFriendResidence {
  return {
    id: clientGeneratedId(),
    friendId: removeClientGeneratedIdPrefix(friendId),
    city: ``,
    region: `England`,
    durations: [],
  };
}

export function friendResidenceDuration(
  friendResidenceId: UUID,
): T.EditableFriendResidence['durations'][number] {
  return {
    id: clientGeneratedId(),
    friendResidenceId: removeClientGeneratedIdPrefix(friendResidenceId),
    start: 1600,
    end: 1700,
  };
}

export function document(friend: T.EditableFriend): T.EditableDocument {
  return {
    id: clientGeneratedId(),
    friendId: removeClientGeneratedIdPrefix(friend.id),
    slug: ``,
    description: ``,
    title: ``,
    filename: ``,
    incomplete: false,
    originalTitle: ``,
    partialDescription: ``,
    featuredDescription: undefined,
    published: undefined,
    friend: {
      id: friend.id,
      lang: friend.lang,
      name: friend.name,
    },
    editions: [],
    altLanguageId: undefined,
    tags: [],
    relatedDocuments: [],
  };
}

export function documentTag(
  type: T.EditableDocumentTag['type'],
  documentId: UUID,
): T.EditableDocumentTag {
  return {
    id: clientGeneratedId(),
    documentId: removeClientGeneratedIdPrefix(documentId),
    type,
  };
}

export function token(): T.EditToken.Output {
  return {
    id: clientGeneratedId(),
    createdAt: new Date().toISOString(),
    description: ``,
    value: uuid(),
    uses: undefined,
    scopes: [],
  };
}

export function tokenScope(
  tokenId: UUID,
  scope: T.EditableTokenScope['scope'],
): T.EditableTokenScope {
  return {
    id: clientGeneratedId(),
    scope,
    tokenId,
  };
}

function clientGeneratedId(): string {
  return `_${uuid()}`;
}
