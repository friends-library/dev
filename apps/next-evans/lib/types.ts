import type { gender as Gender } from '@prisma/client';
import type { ArrowRightIcon } from '@heroicons/react/24/outline';

export type HeroIcon = typeof ArrowRightIcon;

export interface FriendType {
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

export interface DocumentType {
  title: string;
  slug: string;
  id: string;
  editionTypes: Edition[];
  shortDescription: string;
  hasAudio: boolean;
  tags: Array<string>;
  numDownloads: number;
  numPages: number[];
  size: 's' | 'm' | 'xl' | 'xlCondensed';
  customCSS: string | null;
  customHTML: string | null;
  dateAdded: string;
}

export type DocumentWithFriendMeta = DocumentType & {
  authorSlug: string;
  authorName: string;
  authorGender: Gender;
};

export type Edition = 'original' | 'modernized' | 'updated';

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
