import React from 'react'
import { StyleSheet, View } from 'react-native'
import { PlusIcon } from './Icons'
import Ripple from 'react-native-material-ripple'

const FAB = ({ onPress }) => {
    return (
        <Ripple style={styles.fab} rippleContainerBorderRadius={styles.fab.borderRadius} onPress={onPress} rippleColor="white">
            <PlusIcon size={32} />
        </Ripple>
    )
}

export default FAB

const styles = StyleSheet.create({
    fab: {
        backgroundColor: '#4A7CFE',
        position: 'absolute',
        width: 56,
        height: 56,
        right: 16,
        bottom: 16,
        borderRadius: 50,
        elevation: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})