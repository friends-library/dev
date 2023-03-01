import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { APP_NAME } from '../env';

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <Text>{APP_NAME} howdy</Text>
    </SafeAreaView>
  );
}

export default App;
