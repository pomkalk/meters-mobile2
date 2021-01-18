import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import store from './src/store'
import { NativeRouter, Route, BackButton, Redirect } from 'react-router-native'
import { Provider as StoreProvider } from 'react-redux'
import Main from './src/Main'
import SettingsPage from './src/SettingsPage';


export default function App() {
  return (
    <StoreProvider store={store}>
      <NativeRouter>
        <BackButton>
          <View style={styles.container}>
            

            <Route path="/" exact>
              <Redirect to="main" />
            </Route>
            <Route path="/main" component={Main} />
            <Route path="/settings" component={SettingsPage} />
          </View>
        </BackButton>
      </NativeRouter>
    </StoreProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
