import type { EditionType } from '@friends-library/types';
import type { gender as Gender } from '@prisma/client';
import type { ArrowRightIcon } from '@heroicons/react/24/outline';

export { type EditionType };
export type HeroIcon = typeof ArrowRightIcon;

export interface Friend {
  id: UUID;
  name: string;
  slug: string;
  gender: 'male' | 'female' | 'mixed';
  description: string;
  quotes: Array<{ quote: string; cite: string }>;
  born: number | null;
  died: number | null;
  createdAt: ISODateString;
  residences: Residence[];
  documents: FriendDocument[];
}

export interface Edition {
  type: EditionType;
  id: UUID;
  numPages: number[];
  numChapters: number;
  size: 's' | 'm' | 'xl' | 'xlCondensed';
  audiobook: Audiobook | null;
  impressionCreatedAt: ISODateString;
}

export interface FriendDocument {
  id: UUID;
  altLanguageId: UUID | null;
  title: string;
  slug: string;
  editions: Array<Edition>;
  mostModernEdition: Edition;
  shortDescription: string;
  blurb: string;
  featuredDescription: string | null;
  hasAudio: boolean;
  tags: Array<string>;
  numDownloads: number;
  customCSS: string | null;
  customHTML: string | null;
  createdAt: ISODateString;
  isbn: string;
  isComplete: boolean;
  originalTitle: string | null;
}

export type Doc<T extends keyof Document = never> = Pick<
  Document,
  'isbn' | 'title' | 'slug' | 'customCSS' | 'customHTML' | 'authorName' | 'authorSlug' | T
>;

export interface Document extends FriendDocument {
  authorSlug: string;
  authorName: string;
  authorGender: Gender;
  publishedRegion: Region;
  publishedYear: number | null;
}

export interface Audiobook {
  id: UUID;
  isIncomplete: boolean;
  createdAt: ISODateString;
  hq: {
    mp3ZipFilesize: number;
    m4bFilesize: number;
    externalPlaylistId: number | null;
  };
  lq: {
    mp3ZipFilesize: number;
    m4bFilesize: number;
    externalPlaylistId: number | null;
  };
  parts: Array<{
    id: UUID;
    lqExternalTrackId: number | null;
    hqExternalTrackId: number | null;
    duration: number;
  }>;
}

export type Period = 'early' | 'mid' | 'late';

export type Region =
  | 'Eastern US'
  | 'Western US'
  | 'England'
  | 'Scotland'
  | 'Ireland'
  | 'Other';

export type Residence = {
  city: string;
  region: string;
  durations: Array<{ start: number | null; end: number | null }>;
};

export type NewsFeedType =
  | `book`
  | `audiobook`
  | `spanish_translation`
  | `feature`
  | `chapter`;

export type MdxPageFrontmatter = {
  title: string;
  description: string;
};
