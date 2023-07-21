import type { Edition, EditionType, Region, Residence } from './types';
import { primaryResidence } from './residences';

export function publishedYear(
  authorResidences: Residence[],
  authorBirthDate: number | null,
  authorDeathDate: number | null,
): number | null {
  const residence = primaryResidence(authorResidences);
  const firstStay = residence?.durations[0];
  const publicationDate = firstStay ? firstStay.start ?? firstStay.end : null;
  return publicationDate ?? authorDeathDate ?? authorBirthDate ?? null;
}

export function publicationRegion(authorResidences: Residence[]): Region {
  const primaryResidenceRegion = primaryResidence(authorResidences)?.region;
  if (!primaryResidenceRegion) {
    return `Other`;
  }
  return documentRegion(primaryResidenceRegion);
}

export function documentRegion(region: string): Region {
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

export function editionTypes(editions: Edition[]): EditionType[] {
  return editions.map(({ type }) => type);
}
