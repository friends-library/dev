import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { t, setLocale } from '@friends-library/locale';
import { APP_NAME } from './env';

function App(): JSX.Element {
  setLocale(`es`);
  return (
    <SafeAreaView>
      <Text>
        {APP_NAME} howdy {t`Download`}
      </Text>
    </SafeAreaView>
  );
}

export default App;
