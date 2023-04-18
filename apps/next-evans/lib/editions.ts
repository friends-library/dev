export type Edition = 'original' | 'modernized' | 'updated';

export function mostModernEdition(editions: Edition[]): Edition {
  if (editions.includes(`updated`)) return `updated`;
  if (editions.includes(`modernized`)) return `modernized`;
  return `original`;
}
