import type { EditionType } from '@friends-library/types';
import type { ArrowRightIcon } from '@heroicons/react/24/outline';

export { type EditionType };
export type HeroIcon = typeof ArrowRightIcon;
export type Period = 'early' | 'mid' | 'late';

export type Params<T> = { params: T };

export type Region =
  | 'Eastern US'
  | 'Western US'
  | 'England'
  | 'Scotland'
  | 'Ireland'
  | 'Other';

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

export interface Address {
  name: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  recipientTaxId?: string;
  unusable?: boolean;
}

export type AddressWithEmail = Address & { email: string };
