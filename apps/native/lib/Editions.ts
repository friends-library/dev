import { isNotNull } from 'x-ts-utils';
import type {
  EditionId,
  EditionResource,
  Audio,
  AudioPart,
  AudioQuality,
} from '../types';
import type { DocumentEntityInterface } from './models';
import logError, { safeStringify } from './errors';

type EditionMap = Record<EditionId, EditionResource>;
type Resources =
  | { state: 'loading' }
  | { state: 'loaded'; map: EditionMap }
  | { state: 'error' };

class Editions {
  private resources: Resources = { state: `loading` };
  private changeListeners: Array<() => unknown> = [];

  public state(): 'loading' | 'loaded' | 'error' {
    return this.resources.state;
  }

  public get(editionId: EditionId): EditionResource | null {
    if (this.resources.state === `loaded`) {
      return this.resources.map[editionId] ?? null;
    }
    return null;
  }

  public getAudio(editionId: EditionId): Audio | null {
    return this.get(editionId)?.audio ?? null;
  }

  public getDocumentEditions(document: DocumentEntityInterface): EditionResource[] {
    return this.getEditions().filter((ed) => ed.document.id === document.documentId);
  }

  public getAllAudios(): Array<[Audio, EditionResource]> {
    return this.getEditions()
      .map<[Audio, EditionResource] | null>((resource) => {
        if (resource.audio) {
          return [resource.audio, resource];
        } else {
          return null;
        }
      })
      .filter(isNotNull);
  }

  public getAudioPart(
    editionId: EditionId,
    partIndex: number,
  ): null | [AudioPart, EditionResource, Audio] {
    const resource = this.get(editionId);
    if (!resource || !resource.audio) {
      return null;
    }

    const part = resource.audio.parts[partIndex];
    return part ? [part, resource, resource.audio] : null;
  }

  public getAudioPartFilesize(
    editionId: EditionId,
    partIndex: number,
    quality: AudioQuality,
  ): null | number {
    const part = this.getAudioPart(editionId, partIndex)?.[0];
    return part?.[quality === `HQ` ? `size` : `sizeLq`] || null;
  }

  public numDocuments(): number {
    return this.getEditions().filter((e) => e.isMostModernized).length;
  }

  public numAudios(): number {
    return this.getEditions().filter((e) => e.audio !== null).length;
  }

  public getEditions(): EditionResource[] {
    if (this.resources.state === `loaded`) {
      return Object.values(this.resources.map);
    }
    return [];
  }

  public handleLoadError(): void {
    // preserve previously loaded/cached resources on update load error
    if (this.state() === `loading`) {
      this.resources = { state: `error` };
      this.changeListeners.forEach((listener) => listener());
    }
  }

  public setResourcesIfValid(resources: unknown): boolean {
    if (editionResourcesValid(resources)) {
      this.setResources(resources);
      this.changeListeners.forEach((listener) => listener());
      return true;
    }
    logError(
      null,
      `invalid edition resources`,
      `resources=${safeStringify(resources)}`.slice(0, 500),
    );
    this.handleLoadError();
    return false;
  }

  private setResources(resources: EditionResource[]): void {
    const map = resources.reduce<EditionMap>((data, resource) => {
      data[resource.id] = resource;
      return data;
    }, {});
    this.resources = { state: `loaded`, map };
    this.changeListeners.forEach((listener) => listener());
  }

  public addChangeListener(listener: () => unknown): void {
    this.changeListeners.push(listener);
  }

  public removeAllChangeListeners(): void {
    this.changeListeners = [];
  }
}

export default new Editions();

export { Editions as EditionsClass };

function editionResourcesValid(resources: any): resources is EditionResource[] {
  return Array.isArray(resources) && resources.every(resourceValid);
}

function resourceValid(resource: any): resource is EditionResource {
  return (
    resource &&
    typeof resource === `object` &&
    `images` in resource &&
    `chapters` in resource &&
    Array.isArray(resource.images.square) &&
    resource.images.square.every((image: any) => typeof image?.url === `string`) &&
    Array.isArray(resource.chapters) &&
    resource.chapters.every((ch: any) => typeof ch?.shortHeading === `string`)
  );
}
