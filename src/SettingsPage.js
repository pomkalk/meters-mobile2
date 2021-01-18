import React from 'react'
import { StyleSheet, View, Text} from 'react-native'
import { useHistory } from 'react-router-native'
import Appbar from './components/Appbar'

const SettingsPage = () => {
    const history = useHistory()

    const onBack = () => {
        history.goBack()
    }

    return (
        <View>
            <Appbar title="Настройки" back onBack={onBack}/>
            <Text>Настроек пока нет</Text>
        </View>
    )
}

export default SettingsPage
