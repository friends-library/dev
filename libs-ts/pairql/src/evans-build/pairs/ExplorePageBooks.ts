// auto-generated, do not edit
import type { DocumentTag } from '../shared';

export namespace ExplorePageBooks {
  export type Input = 'en' | 'es';

  export type Output = Array<{
    slug: string;
    title: string;
    shortDescription: string;
    isCompilation: boolean;
    hasAudio: boolean;
    publishedYear?: number;
    tags: DocumentTag[];
    customCss?: string;
    customHtml?: string;
    htmlShortTitle: string;
    friendGender: 'male' | 'female' | 'mixed';
    friendName: string;
    friendSlug: string;
    friendBorn?: number;
    friendDied?: number;
    editions: Array<{
      isbn: string;
      type: 'updated' | 'original' | 'modernized';
    }>;
    primaryEdition: {
      isbn: string;
      type: 'updated' | 'original' | 'modernized';
      paperbackVolumes: [number, ...number[]];
    };
    friendPrimaryResidence?: {
      region: string;
      durations: Array<{
        start?: number;
        end?: number;
      }>;
    };
    createdAt: ISODateString;
  }>;
}
