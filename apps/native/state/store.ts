import { Platform } from 'react-native';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import SplashScreen from 'react-native-splash-screen';
import throttle from 'lodash.throttle';
import merge from 'lodash.merge';
import type { Store, AnyAction } from '@reduxjs/toolkit';
import type { State } from './';
import FS, { FileSystem } from '../lib/fs';
import Player from '../lib/player';
import Editions from '../lib/Editions';
import rootReducer from './root-reducer';
import migrate from './migrate/migrate';
import { INITIAL_STATE } from './';

export default async function getStore(): Promise<Store<any, AnyAction>> {
  Player.init();
  await FS.init();

  if (FS.hasFile({ fsPath: FileSystem.paths.editions })) {
    const editions = await FS.readJson(FileSystem.paths.editions);
    Editions.setResourcesIfValid(editions);
  }

  let savedState: Partial<State> = {};
  if (FS.hasFile({ fsPath: FileSystem.paths.state })) {
    savedState = await FS.readJson(FileSystem.paths.state);
    savedState = migrate(savedState);
  }

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: merge({}, INITIAL_STATE, savedState),
    middleware: getDefaultMiddleware({
      serializableCheck:
        Platform.OS === `ios` ? { warnAfter: 100, ignoredPaths: [`audios`] } : false,
      immutableCheck: Platform.OS === `ios` ? { warnAfter: 200 } : false,
    }),
    devTools: Platform.OS === `ios`,
  });

  // eslint-disable-next-line require-atomic-updates
  Player.dispatch = store.dispatch;

  store.subscribe(
    throttle(
      () => {
        const state = store.getState();
        const saveState: State = {
          version: state.version,
          audio: {
            ...state.audio,
            playback: {
              ...state.audio.playback,
              state: `STOPPED`,
            },
            filesystem: {},
          },
          ebook: state.ebook,
          dimensions: state.dimensions,
          resume: state.resume,
          preferences: {
            ...state.preferences,
            audioSearchQuery: ``,
          },
          network: { ...INITIAL_STATE.network },
          ephemeral: { ...INITIAL_STATE.ephemeral },
        };
        FS.writeJson(FileSystem.paths.state, saveState);
      },
      5000,
      { leading: false, trailing: true },
    ),
  );

  if (Platform.OS !== `android`) {
    // rebuilding for sdk target 31 for google play compliance, amongst many
    // terrible issues i fumbled through, i was getting a java fatal error
    // `java.lang.IllegalArgumentException: View=DecorView[...] not attached to window manager`
    // removing this fixed (maybe in combination with adding the onPause override)
    // see https://github.com/crazycodeboy/react-native-splash-screen/issues/32
    // ... strangely, the splash screen seems to hide fine without this, maybe due
    // to the onPause override as well... ¯\_(ツ)_/¯
    SplashScreen.hide();
  }

  return store;
}
