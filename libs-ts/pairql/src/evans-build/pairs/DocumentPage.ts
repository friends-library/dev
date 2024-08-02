// auto-generated, do not edit

export namespace DocumentPage {
  export interface Input {
    lang: 'en' | 'es';
    friendSlug: string;
    documentSlug: string;
  }

  export interface Output {
    document: {
      friendName: string;
      friendSlug: string;
      friendGender: 'male' | 'female' | 'mixed';
      title: string;
      htmlTitle: string;
      htmlShortTitle: string;
      originalTitle?: string;
      isComplete: boolean;
      priceInCents: number;
      description: string;
      numDownloads: number;
      isCompilation: boolean;
      ogImageUrl: string;
      editions: Array<{
        id: UUID;
        type: 'updated' | 'original' | 'modernized';
        isbn: string;
        printSize: 's' | 'm' | 'xl';
        numPages: [number, ...number[]];
        loggedDownloadUrls: {
          epub: string;
          pdf: string;
          speech: string;
        };
      }>;
      alternateLanguageDoc?: {
        friendSlug: string;
        slug: string;
      };
      primaryEdition: {
        editionType: 'updated' | 'original' | 'modernized';
        printSize: 's' | 'm' | 'xl';
        paperbackVolumes: [number, ...number[]];
        isbn: string;
        numChapters: number;
        audiobook?: {
          isIncomplete: boolean;
          reader: string;
          sourcePath: {
            lq: string;
            hq: string;
          };
          m4bFilesize: {
            lq: number;
            hq: number;
          };
          mp3ZipFilesize: {
            lq: number;
            hq: number;
          };
          m4bLoggedDownloadUrl: {
            lq: string;
            hq: string;
          };
          mp3ZipLoggedDownloadUrl: {
            lq: string;
            hq: string;
          };
          podcastLoggedDownloadUrl: {
            lq: string;
            hq: string;
          };
          podcastImageUrl: string;
          parts: Array<{
            title: string;
            playbackUrl: {
              lq: string;
              hq: string;
            };
            loggedDownloadUrl: {
              lq: string;
              hq: string;
            };
            sizeInBytes: {
              lq: number;
              hq: number;
            };
            durationInSeconds: number;
            createdAt: ISODateString;
          }>;
        };
      };
      customCss?: string;
      customCssUrl?: string;
    };
    otherBooksByFriend: Array<{
      title: string;
      slug: string;
      editionType: 'updated' | 'original' | 'modernized';
      description: string;
      paperbackVolumes: [number, ...number[]];
      isbn: string;
      audioDuration?: string;
      htmlShortTitle: string;
      documentSlug: string;
      customCss?: string;
      customHtml?: string;
      createdAt: ISODateString;
    }>;
    numTotalBooks: number;
  }
}
