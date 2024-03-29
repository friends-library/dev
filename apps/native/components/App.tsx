import React, { useEffect, useState } from 'react';
import { useDeviceContext } from 'twrnc';
import Orientation from 'react-native-orientation-locker';
import { useWindowDimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { t } from '@friends-library/locale';
import type { StackParamList } from '../types';
import Home from '../screens/Home';
import BookList from '../screens/BookList';
import Audio from '../screens/Audio';
import Ebook from '../screens/Ebook';
import Settings from '../screens/Settings';
import Read from '../screens/ReadContainer';
import { useDispatch, useSelector } from '../state';
import { setConnected } from '../state/network';
import Service from '../lib/service';
import FS, { FileSystem } from '../lib/fs';
import Editions from '../lib/Editions';
import tw from '../lib/tailwind';
import logError from '../lib/errors';
import ReadHeader from './ReadHeader';

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => {
  const window = useWindowDimensions();
  useDeviceContext(tw);

  const [fetchedResources, setFetchedResources] = useState(false);
  const dispatch = useDispatch();
  const { networkConnected, showingEbookHeader } = useSelector((state) => ({
    networkConnected: state.network.connected,
    showingEbookHeader: state.ephemeral.showingEbookHeader,
  }));

  // add a listener for network connectivity events one time
  useEffect(
    () =>
      NetInfo.addEventListener((state) => {
        dispatch(setConnected(state.isConnected ?? false));
      }),
    [dispatch],
  );

  // as soon as we know we're connected to the internet, fetch resources
  useEffect(() => {
    if (networkConnected && !fetchedResources) {
      setFetchedResources(true);
      Service.downloadLatestEbookCss();
      Service.networkFetchEditions()
        .then((result) => {
          switch (result.type) {
            case `error`:
              Editions.handleLoadError();
              break;
            case `success`:
              if (Editions.setResourcesIfValid(result.json)) {
                FS.writeJson(FileSystem.paths.editions, result.json);
              }
              break;
          }
        })
        .catch((e) => logError(e, `App.tsx->Service.networkFetchEditions()`));
    }
  }, [networkConnected, fetchedResources, setFetchedResources]);

  // we can't limit android phones to portrait only in static configuration
  // iPhone simulator was not respecting Info.plist, so apply to iOS too, just in case
  useEffect(() => {
    if (Math.min(window.width, window.height) < 768) {
      Orientation.lockToPortrait();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode="screen" initialRouteName="Home">
          <Stack.Screen
            options={{
              // bg color matches the "matte" of the 3d cover style for <Continue />
              cardStyle: { backgroundColor: `rgb(239, 239, 239)` },
              title: t`Home`,
            }}
            name="Home"
            component={Home}
          />
          <Stack.Screen
            name="EBookList"
            options={{ title: t`Read` }}
            component={BookList}
            initialParams={{ listType: `ebook` }}
          />
          <Stack.Screen
            name="Read"
            options={{
              header: ReadHeader,
              headerTransparent: true,
              headerShown: showingEbookHeader,
            }}
            component={Read}
          />
          <Stack.Screen
            name="AudioBookList"
            options={{ title: t`Listen` }}
            component={BookList}
            initialParams={{ listType: `audio` }}
          />
          <Stack.Screen name="Listen" options={{ title: t`Listen` }} component={Audio} />
          <Stack.Screen name="Ebook" options={{ title: t`Read` }} component={Ebook} />
          <Stack.Screen
            name="Settings"
            options={{ title: t`Settings` }}
            component={Settings}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
