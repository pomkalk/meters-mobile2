import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Ripple from 'react-native-material-ripple'
import Loader from './Loader'

const Button = ({text, icon, flat, color, loading, textColor, onPress}) => {

    let content = (
        <View style={styles.content}>
            {icon}
            <Text style={[styles.text, {color: textColor||"#222"}]}>{text}</Text>
        </View>
    )

    if (loading) {
        content = <Loader {...(flat?{color: 'white'}:{})}/>
    }

    const onClick = () => {
        if (onPress) {
            if (!loading) {
                onPress()
            }
        }
        
    }

    return (
        <Ripple disabled={loading} style={[styles.button, { backgroundColor: color||null, borderWidth: flat?0:styles.button.borderWidth}]} rippleContainerBorderRadius={4} onPress={onClick}>
            {content}    
        </Ripple>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48
    },
    content: {
        display: 'flex',
        flexDirection: 'row'
    },
    text: {
        fontFamily: 'Roboto',
        fontSize: 16,
        marginLeft: 8,
        color: '#222'
    }
})