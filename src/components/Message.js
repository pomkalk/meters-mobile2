import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { InfoIcon } from './Icons'

const Message = ({title, body}) => {
    return (
        <View style={styles.message}>
            <InfoIcon size={56} />
            <View style={styles.body}>
                <Text style={[styles.font, { fontSize: 20}]}>{title}</Text>
                <Text style={[styles.font, { fontSize: 14, marginTop: 4}]}>{body}</Text>
            </View>
        </View>
    )
}

export default Message

const styles = StyleSheet.create({
    message: {
        borderColor: '#4A7CFE',
        borderRadius: 4,
        borderWidth: 2,
        padding: 16,
        backgroundColor: 'rgba(74, 124, 254, 0.26)',
        display: 'flex',
        flexDirection: 'row',
    },
    body: {
        marginLeft: 8,
        flex: 1
    },
    font: {
        fontFamily: 'Roboto',
        color: '#222'
    }
})