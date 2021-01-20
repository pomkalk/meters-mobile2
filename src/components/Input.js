import React from 'react'
import { StyleSheet, View, Text, TextInput} from 'react-native'
import Loader from './Loader'
import Ripple from 'react-native-material-ripple'

const Input = ({ value, onChange, placeholder, disabled, loading, readonly, onPress, number, float}) => {

    const showValue = value ? value : placeholder

    const onEdit = (e) => {
        if (onChange) {
            let a = e.nativeEvent.text
            if (number) {
                if (float) {
                    a = a.replace(',','.')
                    if (a==='.') {
                        return onChange('')
                    }
                    if ((a.match(/\./g)||[]).length > 1) {
                        return
                    }
                    a = (a.match(/([\d\.])/g)||[]).join('')
                } else {
                    a = (a.match(/([\d])/g)||[]).join('')
                }
            }
            onChange(a)
        }
    }

    if (readonly) {
        return (
            <View style={styles.container}>
                <Ripple onPress={onPress} disabled={disabled} style={[styles.input, {...(disabled?{backgroundColor: '#dadada', borderColor: '#c0c0c0'}:{})}]} editable={disabled} >
                    <Text style={[styles.readonlyText, {...(value?{opacity: 1}:{})}]}>{showValue}</Text>
                </Ripple>
                {loading&&<View style={styles.loader}>
                    <Loader />
                </View>}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <TextInput keyboardType={number ? 'decimal-pad': 'default'} value={value} onChange={onEdit} style={[styles.input, {...(disabled?{backgroundColor: '#f0f0f0', borderColor: '#c0c0c0'}:{})}]} placeholder={placeholder||''} editable={disabled} />
            {loading&&<View style={styles.loader}>
                <Loader />
            </View>}
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    input: {
        width: '100%',
        marginVertical: 8,
        height: 40,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: '#CACACA',
        backgroundColor: '#FAFAFA',
        padding: 8,
        color: '#222',
        fontFamily: 'Roboto'
    },
    loader: {
        position: 'absolute',
        right: 10,
        
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    readonlyText: {
        fontFamily: 'Roboto',
        color: '#222',
        opacity: 0.5
    }
})