import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Appbar from './components/Appbar'
import BottomBar from './components/BottomBar'
import { MeterIcon, NewsIcon, NotifyIcon, SettingsIcon } from './components/Icons'
import { setPageKey, setTitle } from './store'
import NewsPage from './NewsPage'
import MetersPage from './MetersPage'
import NotificationsPage from './NotificationsPage'
import { useHistory } from 'react-router-native'


const Main = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const {title, pageKey} = useSelector(state=>({
        title: state.title,
        pageKey: state.pageKey
    }))

    const route = {
        news: <NewsPage />,
        meters: <MetersPage />,
        notifications: <NotificationsPage />
    }

    const page = route[pageKey]

    const menu = [
        {id: 'news', title: 'Новости', icon: NewsIcon},
        {id: 'meters', title: 'Счетчики', icon: MeterIcon },
        {id: 'notifications', title: 'Уведомления', icon: NotifyIcon},
    ]

    const onSelect = (x) => {
        dispatch(setTitle(x.title))
        dispatch(setPageKey(x.id))
    }

    const onSettings = () => {
        history.push('/settings')
    }

    return (
        <View style={styles.container}>
            <Appbar action onAction={onSettings} actionIcon={<SettingsIcon />} title={title} subtitle={`ООО "УЕЗ ЖКУ г. Ленинска-Кузнецкого"`} />
            <View style={{flex: 1}}>
                {page&&page}
            </View>
            <BottomBar selected={pageKey} onSelect={onSelect} menu={menu} />
        </View>
    )
}

export default Main

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollview: {
        marginVertical: 8,
        paddingHorizontal: 16
    }
})


