// auto-generated, do not edit

export namespace GetAudios {
  export type Input = void;

  export type Output = Array<{
    id: UUID;
    isIncomplete: boolean;
    m4bSizeHq: number;
    m4bSizeLq: number;
    mp3ZipSizeHq: number;
    mp3ZipSizeLq: number;
    reader: string;
    parts: Array<{
      id: UUID;
      chapters: number[];
      durationInSeconds: number;
      title: string;
      order: number;
      mp3SizeHq: number;
      mp3SizeLq: number;
    }>;
    edition: {
      id: UUID;
      path: string;
      type: 'updated' | 'original' | 'modernized';
      coverImagePath: string;
    };
    document: {
      filename: string;
      title: string;
      slug: string;
      description: string;
      path: string;
      tags: Array<
        | 'journal'
        | 'letters'
        | 'exhortation'
        | 'doctrinal'
        | 'treatise'
        | 'history'
        | 'allegory'
        | 'spiritualLife'
      >;
    };
    friend: {
      lang: 'en' | 'es';
      name: string;
      slug: string;
      alphabeticalName: string;
      isCompilations: boolean;
    };
  }>;
}
