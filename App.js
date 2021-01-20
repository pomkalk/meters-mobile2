import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import store, { getStatus, initMeters, setExpoToken } from './src/store'
import { NativeRouter, Route, BackButton, Redirect } from 'react-router-native'
import { Provider as StoreProvider, useDispatch } from 'react-redux'
import Main from './src/Main'
import SettingsPage from './src/SettingsPage';
import * as Notifications from 'expo-notifications'
import AddPage from './src/AddPage';
import SelectPage from './src/SelectPage'
import ViewPage from './src/ViewPage'
import QrPage from './src/QrPage';
import EditPage from './src/EditPage';
import HistoryPage from './src/HistoryPage';

export default function App() {
  useEffect(()=>{
    store.dispatch(getStatus())
    store.dispatch(initMeters())
    registerForPushNotifications().then(token => {
        store.dispatch(setExpoToken(token))
    })
  }, [])

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
            <Route path="/add" component={AddPage} />
            <Route path="/select/:type" component={SelectPage} />
            <Route path="/view" component={ViewPage} />
            <Route path="/qrscanner" component={QrPage} />
            <Route path="/edit" component={EditPage} />
            <Route path="/history" component={HistoryPage} />
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


async function registerForPushNotifications () {
  let token = null

  if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('uezmeters', {
          name: 'uezmeters',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4A7CFE'
      })
  }
  
  const { status } = await Notifications.getPermissionsAsync()
  let access = status
  if (access !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      access = status
  }
  if (access === 'granted') {
    token = (await Notifications.getExpoPushTokenAsync()).data
  }
  return token
}