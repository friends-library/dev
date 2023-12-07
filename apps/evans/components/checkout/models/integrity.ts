import { isEdition, isPrintSize } from '@friends-library/types';
import type { Address } from '@/lib/types';
import type { CartItemData } from './CartItem';

export function isAddress(obj: unknown): obj is Address {
  try {
    if (typeof obj !== `object` || obj === null) {
      return false;
    }

    const strings = [`name`, `street`, `city`, `state`, `zip`, `country`];
    for (const str of strings) {
      // @ts-ignore
      if (typeof obj[str] !== `string`) {
        return false;
      }
    }

    // @ts-ignore
    if (![`undefined`, `string`].includes(typeof obj.street2)) {
      return false;
    }
    // @ts-ignore
    if (![`undefined`, `boolean`].includes(typeof obj.unusable)) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export function isItem(item: unknown): item is CartItemData {
  try {
    if (typeof item !== `object` || item === null) {
      return false;
    }

    const { edition, quantity, printSize, numPages } = item as Record<string, unknown>;
    for (const prop of [`displayTitle`, `editionId`, `title`, `author`]) {
      // @ts-ignore
      if (typeof item[prop] !== `string`) {
        return false;
      }
    }

    if (!isEdition(edition) || !isPrintSize(printSize)) {
      return false;
    }

    if (typeof quantity !== `number`) {
      return false;
    }

    if (!Array.isArray(numPages)) {
      return false;
    }

    for (const pages of numPages as unknown[]) {
      if (typeof pages !== `number`) {
        return false;
      }
    }

    return true;
  } catch (err) {
    return false;
  }
}
