import type { Region, Residence } from './types';
import { getPrimaryResidence } from './residences';

export function getPublicationDate(
  authorResidences: Residence[],
  authorBirthDate: number | null,
  authorDeathDate: number | null,
): number | null {
  const primaryResidence = getPrimaryResidence(authorResidences);
  const firstStay = primaryResidence?.durations[0];
  const publicationDate = firstStay ? firstStay.start ?? firstStay.end : null;
  return publicationDate ?? authorDeathDate ?? authorBirthDate ?? null;
}

export function getPublicationRegion(authorResidences: Residence[]): Region {
  const primaryResidenceRegion = getPrimaryResidence(authorResidences)?.region;
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
