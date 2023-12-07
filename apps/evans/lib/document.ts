import type { EditionType, Region } from './types';

export function documentDate(doc: {
  isCompilation: boolean;
  publishedYear?: number;
  friendBorn?: number;
  friendDied?: number;
  slug: string;
}): number {
  const { friendBorn, friendDied, isCompilation, publishedYear } = doc;
  if (publishedYear) {
    return publishedYear;
  }

  // the James Parnell case
  if (friendBorn && friendDied && friendDied - friendBorn < 31) {
    return friendDied;
  }

  if (friendDied && !friendBorn) {
    return friendDied - 10;
  }

  if (friendBorn && friendDied) {
    return Math.floor(friendBorn + 0.75 * (friendDied - friendBorn));
  }

  if (!isCompilation) {
    throw new Error(`Unexpected failure to determine document date: ${doc.slug}`);
  }

  // compilations don't need a date, this will cause them
  // to not show up on the /explore page timeline picker
  return -1;
}

export function documentRegion(document: {
  isCompilation: boolean;
  friendPrimaryResidence?: { region: string };
}): Region {
  if (document.isCompilation) {
    return `Other`;
  }
  const region = document.friendPrimaryResidence?.region;
  switch (region) {
    case `Ireland`:
      return `Ireland`;
    case `England`:
      return `England`;
    case `Scotland`:
      return `Scotland`;
    case `Wales`:
    case `Netherlands`:
    case `France`:
      return `Other`;
    case `Ohio`:
      return `Western US`;
    case `Delaware`:
    case `Pennsylvania`:
    case `New Jersey`:
    case `Rhode Island`:
    case `New York`:
    case `Vermont`:
      return `Eastern US`;
    default:
      throw new Error(`Error inferring explore region for friend: ${region}`);
  }
}

type SortableDoc = {
  primaryEdition: { type: EditionType };
  title: string;
};

export function sortDocuments(a: SortableDoc, b: SortableDoc): number {
  if (a.primaryEdition?.type !== b.primaryEdition?.type) {
    if (a.primaryEdition?.type === `updated`) {
      return -1;
    }
    if (a.primaryEdition?.type === `modernized`) {
      return b.primaryEdition?.type === `updated` ? 1 : -1;
    }
    return 1;
  }
  return a.title < b.title ? -1 : 1;
}
