import type { gender as Gender } from '@prisma/client';
import { LANG } from '@/lib/env';

export function getFriendUrl(friendSlug: string, gender: Gender): string {
  if (gender === `mixed`) return `/${friendSlug}`;
  let firstPart = `friend`;
  if (LANG === `es`) {
    if (gender === `male`) {
      firstPart = `amigo`;
    } else {
      firstPart = `amiga`;
    }
  }
  return `/${firstPart}/${friendSlug}`;
}

export function isCompilations(friendNameOrSlug: string): boolean {
  return friendNameOrSlug.toLowerCase().startsWith(`compila`);
}
