import type { Edition, EditionType } from './types';

export function mostModernEditionType(editions: Edition[]): EditionType;
export function mostModernEditionType(
  editions: Array<{ type: EditionType }>,
): EditionType;

export function mostModernEditionType(
  editions: EditionType[] | Array<{ type: EditionType }>,
): EditionType {
  const editionTypes = editions.map((edition) => {
    if (typeof edition === `string`) {
      return edition;
    }
    return edition.type;
  });
  if (editionTypes.includes(`updated`)) {
    return `updated`;
  }
  if (editionTypes.includes(`modernized`)) {
    return `modernized`;
  }
  return `original`;
}
