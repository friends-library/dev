import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { t, setLocale } from '@friends-library/locale';

function App(): JSX.Element {
  setLocale(`es`);
  return (
    <SafeAreaView>
      <Text>Test {t`Download`}</Text>
    </SafeAreaView>
  );
}

export default App;
