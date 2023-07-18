import type { gender as Gender } from '@prisma/client';
import type { ArrowRightIcon } from '@heroicons/react/24/outline';

export type HeroIcon = typeof ArrowRightIcon;

export interface Friend {
  name: string;
  slug: string;
  id: string;
  gender: 'male' | 'female' | 'mixed';
  description: string;
  quotes: Array<{ quote: string; cite: string }>;
  born: number | null;
  died: number | null;
  dateAdded: string;
  residences: Residence[];
  documents: DocumentType[];
}

export interface Edition {
  type: EditionType;
  numPages: number[];
  size: 's' | 'm' | 'xl' | 'xlCondensed';
  audiobook: Audiobook | null;
  impressionCreatedAt: string;
}

export interface DocumentType {
  title: string;
  altLanguageId: string | null;
  slug: string;
  id: string;
  editions: Array<Edition>;
  mostModernEdition: Edition;
  shortDescription: string;
  featuredDescription: string | null;
  hasAudio: boolean;
  tags: Array<string>;
  numDownloads: number;
  customCSS: string | null;
  customHTML: string | null;
  dateAdded: string;
  isbn: string;
}

export type DocumentWithMeta = DocumentType & {
  authorSlug: string;
  authorName: string;
  authorGender: Gender;
  publishedRegion: Region;
  publishedDate: number | null;
};

export interface Audiobook {
  id: string;
  isIncomplete: boolean;
  dateAdded: string;
}

export type EditionType = 'original' | 'modernized' | 'updated';

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
