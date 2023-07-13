import type { EditionType } from './types';

export function mostModernEdition(editions: EditionType[]): EditionType {
  if (editions.includes(`updated`)) return `updated`;
  if (editions.includes(`modernized`)) return `modernized`;
  return `original`;
}
