import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import store, { getNews, getStatus, initMeters, registerDevice, setExpoToken, setNewsUpdated, setPageKey, setTitle } from './src/store'
import { NativeRouter, Route, BackButton, Redirect } from 'react-router-native'
import { Provider as StoreProvider } from 'react-redux'
import Main from './src/Main'
import SettingsPage from './src/SettingsPage';
import * as Notifications from 'expo-notifications'
import AddPage from './src/AddPage';
import SelectPage from './src/SelectPage'
import ViewPage from './src/ViewPage'
import QrPage from './src/QrPage';
import EditPage from './src/EditPage';
import HistoryPage from './src/HistoryPage';
import Constants from 'expo-constants'

export default function App() {
  const notificationResponser = useRef()
  const notificationListener = useRef()

  useEffect(()=>{
    store.dispatch(getStatus())
    store.dispatch(initMeters())
    store.dispatch(getNews())

    registerForPushNotifications().then(token => {
      console.log(Constants.installationId, token)
      store.dispatch(registerDevice({
        did: Constants.installationId,
        expo: token,
        info: Constants
      }))
    })

    notificationListener.current = Notifications.addNotificationReceivedListener(response => {
      let action = null
      if (response.request){
        if (response.request.content){
          if (response.request.content.data) {
            if (response.request.content.data.action) {
              action = response.request.content.data.action
            }
          }
        }
      }
      if (action === 'news') {
        store.dispatch(setNewsUpdated(true))
      }
    })

    notificationResponser.current = Notifications.addNotificationResponseReceivedListener(response => {
      let action = null
      if (response.request){
        if (response.request.content){
          if (response.request.content.data) {
            if (response.request.content.data.action) {
              action = response.request.content.data.action
            }
          }
        }
      }
      
      if (action) {
        const title = {
          news: 'Новости',
          meters: 'Счетчики',
          notifications: 'Уведомления'
        }
        if (['news', 'meters'].includes(action)) {
          store.dispatch(setPageKey(action))
          store.dispatch(setTitle(title[action]))
        }
      }
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener)
      Notifications.removeNotificationSubscription(notificationResponser)
    }
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
  try {
    const { status } = await Notifications.getPermissionsAsync()
    let access = status
    if (access !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        access = status
    }

    if (access === 'granted') {
      token = (await Notifications.getExpoPushTokenAsync()).data
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('uezmeters', {
          name: 'uezmeters',
          sound: true,
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4A7CFE'
      })
    }
    return token
  } catch (e) {
    alert (JSON.stringify(e))
  }
}