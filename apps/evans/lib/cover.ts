import type { EditionType, PrintSize, CoverProps } from '@friends-library/types';
import { LANG } from './env';

export interface EditionCoverData {
  editionType: EditionType;
  printSize: PrintSize;
  paperbackVolumes: [number, ...number[]];
  isbn: string;
}

export interface DocumentCoverData {
  title: string;
  description: string;
  customCss?: string;
  customHtml?: string;
}

export interface FriendCoverData {
  isCompilation: boolean;
  friendName: string;
}

export type CoverData = EditionCoverData & DocumentCoverData & FriendCoverData;

export function toCoverProps(data: CoverData): CoverProps {
  return {
    lang: LANG,
    title: data.title,
    isCompilation: data.isCompilation,
    author: data.friendName,
    size: data.printSize,
    pages: data.paperbackVolumes[0],
    edition: data.editionType,
    isbn: data.isbn,
    blurb: data.description,
    customCss: data.customCss ?? ``,
    customHtml: data.customHtml ?? ``,
  };
}
