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
            <View style={{padding: 16}}>
                <Text>Настроек пока нет</Text>
            </View>
        </View>
    )
}

export default SettingsPage
