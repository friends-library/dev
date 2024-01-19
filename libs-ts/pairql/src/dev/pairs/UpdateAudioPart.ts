// auto-generated, do not edit

export namespace UpdateAudioPart {
  export interface Input {
    id: UUID;
    audioId: UUID;
    title: string;
    duration: number;
    chapters: number[];
    order: number;
    mp3SizeHq: number;
    mp3SizeLq: number;
  }

  export type Output = void;
}
