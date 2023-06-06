import type { gender as Gender } from '@prisma/client';
import type { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { CoverProps } from '@friends-library/types';

export type HeroIcon = typeof ArrowRightIcon;

export interface FriendProps {
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
  documents: Document[];
}

export interface Residence {
  city: string;
  region: string;
  durations: Array<{ start: string; end: string }>;
}

export interface Document {
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
}

export type DocumentWithFriendMeta = Document & {
  authorSlug: string;
  authorName: string;
  authorGender: Gender;
};

export type Edition = 'original' | 'modernized' | 'updated';
