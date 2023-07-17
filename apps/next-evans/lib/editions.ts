import type { Edition, EditionType } from './types';

export function mostModernEditionType(editions: EditionType[]): EditionType;
export function mostModernEditionType(editions: Edition[]): EditionType;

export function mostModernEditionType(editions: EditionType[] | Edition[]): EditionType {
  const editionTypes = editions.map((edition) => {
    if (typeof edition === 'string') {
      return edition;
    }
    return edition.type;
  });
  if (editionTypes.includes('updated')) {
    return 'updated';
  }
  if (editionTypes.includes('modernized')) {
    return 'modernized';
  }
  return `original`;
}
