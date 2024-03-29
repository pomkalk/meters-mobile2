import React from 'react'
import { StyleSheet, View, Text} from 'react-native'
import Constants from 'expo-constants'
import { BackIcon } from './Icons'
import Ripple from 'react-native-material-ripple'

const Appbar = ({back, onBack, title, subtitle, action, actionIcon, onAction}) => {
    return (
        <View>
            <View style={styles.statusbar} />
            <View style={styles.appbar}>
                {back&&<Ripple style={{ padding: 8}} rippleContainerBorderRadius={50} onPress={onBack}>
                    <BackIcon />
                </Ripple>}
                <View style={[styles.titles, {paddingLeft: back ? 16 : 0}]}>
                    <Text style={styles.title}>{ title }</Text>
                    {subtitle&&<Text style={styles.subtitle}>{ subtitle }</Text>}
                </View>
                {action&&<Ripple style={{ padding: 8 }} rippleContainerBorderRadius={50} onPress={onAction}>
                        {actionIcon}
                </Ripple>}
            </View>
        </View>
    )
}

export default Appbar

const styles = StyleSheet.create({
    statusbar: {
        height: Constants.statusBarHeight,
        backgroundColor: 'white'
    },
    appbar: {
        height: 56,
        backgroundColor: 'white',
        padding: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    titles: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        fontFamily: 'Roboto',
        fontSize: 22,
        color: '#222'
    },
    subtitle: {
        fontFamily: 'Roboto',
        fontSize: 10,
        color: '#222'
    }
})