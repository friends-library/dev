import type { EditionType, Lang } from '@friends-library/types';

export type PlayerState = 'STOPPED' | 'PLAYING' | 'PAUSED' | 'DUCKED';

export type BookSortMethod = 'duration' | 'published' | 'author' | 'title';

export type EbookColorScheme = 'white' | 'black' | 'sepia';

/**
 * string in format: `"<document-id>--<EditionType>"`
 * eg `"f413cec8-c609-4d58-9721-4ad552cb27ae--modernized"`
 */
export type EditionId = string;

/**
 * Document UUID
 * eg `"f413cec8-c609-4d58-9721-4ad552cb27ae"`
 */
export type DocumentId = string;

// this was taken from the old `@friends-library/types` package
// if/when this app updates to graphql/pairql, this can be removed
export type EditionResource = {
  id: string;
  lang: Lang;
  document: {
    id: string;
    title: string;
    utf8ShortTitle: string;
    trimmedUtf8ShortTitle: string;
    description: string;
    shortDescription: string;
  };
  revision: string;
  type: EditionType;
  publishedDate: string;
  friend: {
    name: string;
    nameSort: string;
    isCompilations: boolean;
  };
  ebook: {
    loggedDownloadUrl: string;
    directDownloadUrl: string;
    numPages: number;
  };
  isMostModernized: boolean;
  audio: null | {
    reader: string;
    totalDuration: number;
    publishedDate: string;
    parts: Array<{
      editionId: string;
      index: number;
      title: string;
      utf8ShortTitle: string;
      duration: number;
      size: number;
      sizeLq: number;
      url: string;
      urlLq: string;
    }>;
  };
  images: {
    square: Array<{
      width: SquareCoverImageSize;
      height: SquareCoverImageSize;
      url: string;
    }>;
    threeD: Array<{
      width: ThreeDCoverImageWidth;
      height: number;
      url: string;
    }>;
  };
  chapters: Array<{
    index: number;
    id: string;
    slug: string;
    shortHeading: string;
    isIntermediateTitle: boolean;
    isSequenced: boolean;
    hasNonSequenceTitle: boolean;
    sequenceNumber: number | null;
    nonSequenceTitle: string | null;
  }>;
};

export type Audio = ReturnType<typeof deriveAudioType>;

export type AudioPart = ReturnType<typeof deriveAudioPartType>;

export interface EbookData {
  md5: string;
  innerHtml: string;
}

export type StackParamList = {
  Home: undefined;
  Read: { editionId: EditionId; chapterId?: string };
  Ebook: { editionId: EditionId };
  Listen: { editionId: EditionId };
  Settings: undefined;
  AudioBookList: { listType: 'audio' };
  EBookList: { listType: 'ebook' };
};

export interface BookListItem {
  navigateTo: keyof StackParamList;
  editionId: EditionId;
  isNew: boolean;
  progress: number;
  duration: string;
  nameDisplay: string;
  title: string;
  name: string;
}

export interface TrackData {
  id: string;
  filepath: string;
  title: string;
  artist: string;
  artworkUrl: string;
  album: string;
  duration: number;
}

export interface Gesture {
  isSwipe: boolean;
  isHorizontalSwipe: boolean;
  isVerticalSwipe: boolean;
  isRightSwipe: boolean;
  isLeftSwipe: boolean;
  isBackSwipe: boolean;
  isLong: boolean;
}

export interface SearchResult {
  before: string;
  match: string;
  after: string;
  percentage: number;
  elementId: string;
  startIndex: number;
  endIndex: number;
  siblingIndex: number;
  numResultsInElement: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function deriveAudioType(edition: EditionResource) {
  return edition.audio!;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function deriveAudioPartType(edition: EditionResource) {
  return edition.audio!.parts[0]!;
}

// below taken from old @friends-library/types repo
// when we convert to using graphql, refactor and remove
export const THREE_D_COVER_IMAGE_WIDTHS = [
  55, 110, 250, 400, 550, 700, 850, 1000, 1120,
] as const;

export type ThreeDCoverImageWidth = (typeof THREE_D_COVER_IMAGE_WIDTHS)[number];

export const SQUARE_COVER_IMAGE_SIZES = [
  45, 90, 180, 270, 300, 450, 600, 750, 900, 1150, 1400,
] as const;

export type SquareCoverImageSize = (typeof SQUARE_COVER_IMAGE_SIZES)[number];

export const LARGEST_THREE_D_COVER_IMAGE_WIDTH: ThreeDCoverImageWidth =
  THREE_D_COVER_IMAGE_WIDTHS[THREE_D_COVER_IMAGE_WIDTHS.length - 1]!;
