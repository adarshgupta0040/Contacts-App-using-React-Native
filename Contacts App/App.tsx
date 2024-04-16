/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View, } from 'react-native';

import { Colors, Header, } from 'react-native/Libraries/NewAppScreen';

import AppNavigator from './src/AppNavigator';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'white',
      secondary: 'yellow',
      surface:'e76f51',
      tertiary:'red'
    },
  };
  return (
    
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
   
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
