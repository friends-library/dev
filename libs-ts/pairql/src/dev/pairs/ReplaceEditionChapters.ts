// auto-generated, do not edit

export namespace ReplaceEditionChapters {
  export interface Input {
    editionId: UUID;
    chapters: Array<{
      order: number;
      shortHeading: string;
      isIntermediateTitle: boolean;
      customId?: string;
      sequenceNumber?: number;
      nonSequenceTitle?: string;
    }>;
  }

  export type Output = void;
}
