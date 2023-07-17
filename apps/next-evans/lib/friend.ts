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

export function getDocumentUrl(doc: { authorSlug: string; slug: string }): string;
export function getDocumentUrl(friendSlug: string, documentSlug: string): string;
export function getDocumentUrl(
  arg1: { authorSlug: string; slug: string } | string,
  arg2?: string,
): string {
  if (typeof arg1 === `string`) {
    return `/${arg1}/${arg2}`;
  }
  return `/${arg1.authorSlug}/${arg1.slug}`;
}

export function isCompilations(friendNameOrSlug: string): boolean {
  return friendNameOrSlug.toLowerCase().startsWith(`compila`);
}
