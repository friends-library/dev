import '@friends-library/react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import TrackPlayer from '@friends-library/react-native-track-player';
import { setLocale } from '@friends-library/locale';
import PlaybackService from './playback-service';
import AppShell from './components/AppShell';
import { LANG } from './env';

setLocale(LANG);

TrackPlayer.registerPlaybackService(() => PlaybackService);
AppRegistry.registerComponent(`FriendsLibrary`, () => AppShell);
