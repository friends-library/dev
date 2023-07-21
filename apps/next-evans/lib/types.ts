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
  documents: DocumentCore[];
}

export interface Edition {
  type: EditionType;
  numPages: number[];
  size: 's' | 'm' | 'xl' | 'xlCondensed';
  audiobook: Audiobook | null;
  impressionCreatedAt: ISODateString;
}

interface DocumentCore {
  id: UUID;
  altLanguageId: UUID | null;
  title: string;
  slug: string;
  editions: Array<Edition>;
  mostModernEdition: Edition;
  shortDescription: string;
  featuredDescription: string | null;
  hasAudio: boolean;
  tags: Array<string>;
  numDownloads: number;
  customCSS: string | null;
  customHTML: string | null;
  createdAt: ISODateString;
  isbn: string;
}

export interface Document extends DocumentCore {
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
