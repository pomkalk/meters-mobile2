import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { NewsIcon } from './Icons'
import Ripple from 'react-native-material-ripple'

const BottomBar = ({ menu, selected, onSelect }) => {
    return (
        <View style={styles.bottom}>
            {
                menu.map(x=>(
                    <Ripple key={x.id} style={[styles.item, {opacity: selected===x.id?1:0.3}]} onPress={()=>onSelect(x)}>
                        {x.icon}
                        <Text style={styles.itemText}>{x.title}</Text>
                    </Ripple>
                    ))
            }
        </View>
    )
}

export default BottomBar

const styles = StyleSheet.create({
    bottom: {
        backgroundColor: 'white',
        height: 56,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 30
    },
    item: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.3
    },
    itemText: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#222'
    }
})