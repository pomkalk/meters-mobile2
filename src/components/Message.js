import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { InfoIcon } from './Icons'

const Message = ({title, body}) => {
    return (
        <View style={styles.message}>
            <View style={styles.type}></View>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body}>{body}</Text>
            </View>
        </View>
    )
}

export default Message

const styles = StyleSheet.create({
    message: {
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden'
    },
    type: {
        backgroundColor: '#4A7CFE',
        width: 4
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 16,
        paddingVertical: 8        
    },
    title: {
        fontFamily: 'Roboto',
        color: '#222222',
        fontSize: 20,
        marginBottom: 8
    },
    body: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#222222'
    }
})