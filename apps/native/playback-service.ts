import { Platform } from 'react-native';
import { Event } from 'react-native-track-player';
import Player from './lib/player';
import { setCurrentTrackPosition } from './state/audio/track-position';
import { maybeDownloadNextQueuedTrack } from './state/audio/filesystem';
import { setState as setPlaybackState, maybeAdvanceQueue } from './state/audio/playback';

module.exports = async function () {
  Player.addEventListener(Event.RemotePlay, () => {
    Player.resume();
    Player.dispatch(setPlaybackState(`PLAYING`));
  });

  Player.addEventListener(Event.RemotePause, () => {
    Player.pause();
    Player.dispatch(setPlaybackState(`PAUSED`));
  });

  Player.addEventListener(Event.RemoteStop, () => {
    Player.pause();
    Player.dispatch(setPlaybackState(`PAUSED`));
  });

  Player.addEventListener(Event.RemoteJumpForward, () => Player.seekRelative(30));
  Player.addEventListener(Event.RemoteJumpBackward, () => Player.seekRelative(-30));
  Player.addEventListener(Event.RemoteSeek, ({ position }) => Player.seekTo(position));

  Player.addEventListener(
    Event.RemoteDuck,
    async (event: { paused?: boolean; permanent?: boolean }) => {
      const { paused, permanent } = event;
      const playerState = await Player.getState();
      const notAndroid = Platform.OS !== `android`;
      if (paused) {
        if (playerState === `PLAYING` || notAndroid) {
          Player.duck();
          Player.dispatch(setPlaybackState(`DUCKED`));
        }
      } else if (permanent) {
        Player.pause();
        Player.dispatch(setPlaybackState(`STOPPED`));
      } else if (playerState === `DUCKED` || notAndroid) {
        Player.resume();
        Player.dispatch(setPlaybackState(`PLAYING`));
      }
    },
  );

  Player.addEventListener(
    Event.PlaybackTrackChanged,
    ({ nextTrack }: { nextTrack: null | string }) => {
      if (nextTrack) {
        Player.dispatch(maybeAdvanceQueue(nextTrack));
      }
    },
  );

  // listening to the event instead of the interval seems
  // to work when app is backgrounded on android, so this keeps
  // the player state updated. but switching to ONLY this method
  // caused the player state to not update when foregrounded...
  if (Platform.OS === `android`) {
    let eventCounter = 0;
    Player.addEventListener(
      Event.PlaybackProgressUpdated,
      ({ position }: { position: number }) => {
        eventCounter++;
        Player.dispatch(setCurrentTrackPosition(position));
        if (eventCounter % 10 === 0) {
          Player.dispatch(maybeDownloadNextQueuedTrack(position));
        }
      },
    );
  }

  // ...and this is the original way, which seems to work on ios
  // and seems necessary for android when app is foregrounded
  let counter = 0;
  setInterval(async () => {
    counter++;
    const [position, state] = await Promise.all([
      Player.getPosition(),
      Player.getState(),
    ]);
    if (state !== `PLAYING` || position < 0) {
      return;
    }
    Player.dispatch(setCurrentTrackPosition(position));
    if (counter % 10 === 0) {
      Player.dispatch(maybeDownloadNextQueuedTrack(position));
    }
  }, 1000);

  const events = [
    `playback-state`,
    `playback-track-changed`,
    `playback-error`,
    `remote-pause`,
    `remote-play`,
    `remote-stop`,
    `remote-next`,
    `remote-previous`,
    `remote-seek`,
    `remote-duck`,
    `remote-jump-forward`,
    `remote-jump-backward`,
    `playback-progress-updated`,
    `playback-track-changed`,
    `playback-queue-ended`,
  ];

  const debugEvents = false;
  for (const event of events) {
    if (debugEvents) {
      // @ts-ignore
      Player.addEventListener(event, (...args) => console.log(event, args)); // eslint-disable-line
    }
  }
};
