import React, { useEffect } from 'react'
import { StyleSheet, View, Text, FlatList} from 'react-native'
import { useSelector } from 'react-redux'
import Ripple from 'react-native-material-ripple'
import { RightIcon } from './Icons'

const SavedList = () => {
    const meters = useSelector(state=>state.saved)

    if (meters === null) {
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyText}>Список пуст.</Text>
            </View>
        )
    }

    return (
        <View>
            <Text style={styles.title}>Сохраненные счетчики</Text>
            {
                meters.map((item, i) => {
                    const separator = i===0?null:<View style={styles.divider} />
                    return (
                        <View>
                            <Ripple style={styles.item} onPress={()=>console.log(item)}>
                                <View style={styles.content}>
                                    <Text style={styles.address}>{item.address}</Text>
                                    <Text style={styles.ls}>Лицевой счет: {item.ls}</Text>
                                </View>
                                <View style={styles.icon}>
                                    <RightIcon size={22} /> 
                                </View>
                            </Ripple>
                        </View>
                    )
                })
            }
            <View style={{ height: 64}} />
        </View>
    )
}

export default SavedList

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Roboto',
        color: "#222",
        fontSize: 14,
        marginBottom: 16
    },
    empty: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 16
    },
    emptyText: {
        fontFamily: 'Roboto',
        color: "#222",
        fontSize: 14
    },
    divider: {
        backgroundColor: '#222',
        height: 1,
        width: '100%',
        opacity: 0.2
    },
    item: {
        paddingVertical: 4,
        display: 'flex',
        flexDirection: 'row'
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    icon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    address: {
        fontFamily: 'Roboto',
        color: '#222',
        fontSize: 16,
        marginBottom: 4
    },
    ls: {
        fontFamily: 'Roboto',
        color: '#222',
        fontSize: 14,
        opacity: 0.4
    }
})
