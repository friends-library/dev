import RNTrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  IOSCategory,
  IOSCategoryMode,
  IOSCategoryOptions,
  PitchAlgorithm,
  State,
} from 'react-native-track-player';
import type { Event } from 'react-native-track-player';
import type { EmitterSubscription } from 'react-native/types';
import type { TrackData, PlayerState } from '../types';
import type { Dispatch } from '../state';

class Player {
  private ducked = false;

  public dispatch: Dispatch = (): any => {};

  public skipNext(): Promise<void> {
    return RNTrackPlayer.skipToNext();
  }

  public skipBack(): Promise<void> {
    return RNTrackPlayer.skipToPrevious();
  }

  public resume(): Promise<void> {
    this.ducked = false;
    return RNTrackPlayer.play();
  }

  public duck(): Promise<void> {
    this.ducked = true;
    return RNTrackPlayer.pause();
  }

  public pause(): Promise<void> {
    return RNTrackPlayer.pause();
  }

  public getPosition(): Promise<number> {
    return RNTrackPlayer.getPosition();
  }

  public seekTo(position: number): Promise<void> {
    return RNTrackPlayer.seekTo(position);
  }

  public async seekRelative(delta: number): Promise<void> {
    const currentPosition = await RNTrackPlayer.getPosition();
    this.seekTo(currentPosition + delta);
  }

  public async getState(): Promise<PlayerState> {
    const RNState = await RNTrackPlayer.getState();
    switch (RNState) {
      case State.Playing:
      case State.Buffering:
        return `PLAYING`;
      case State.Paused:
        return this.ducked ? `DUCKED` : `PAUSED`;
      default:
        return `STOPPED`;
    }
  }

  public async playPart(trackId: string, tracks: TrackData[]): Promise<void> {
    this.ducked = false;
    await RNTrackPlayer.reset();
    const index = await RNTrackPlayer.add(
      tracks.map((track) => ({
        id: track.id,
        url: track.filepath,
        title: track.title,
        artist: track.artist,
        artwork: track.artworkUrl,
        duration: track.duration,
        pitchAlgorithm: PitchAlgorithm.Voice,
      })),
    );
    if (index) {
      await RNTrackPlayer.skip(index);
    }
    return RNTrackPlayer.play();
  }

  public init(): void {
    RNTrackPlayer.setupPlayer({
      iosCategory: IOSCategory.Playback,
      iosCategoryMode: IOSCategoryMode.SpokenAudio,
      iosCategoryOptions: [IOSCategoryOptions.AllowAirPlay],
    });

    RNTrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.PausePlayback,
      },
      forwardJumpInterval: 30,
      backwardJumpInterval: 15,
      alwaysPauseOnInterruption: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.Stop,
        Capability.JumpForward,
        Capability.JumpBackward,
      ],
    });
  }

  public addEventListener(
    event: Event,
    listener: (data: any) => void,
  ): EmitterSubscription {
    // todo: migrate docs say not to use this, to use hooks
    // https://react-native-track-player.js.org/docs/v2-migration
    return RNTrackPlayer.addEventListener(event, listener);
  }
}

export default new Player();
