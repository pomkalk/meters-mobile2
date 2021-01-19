import React, { useState } from 'react'
import { StyleSheet, View, Text, FlatList} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-native'
import Appbar from './components/Appbar'
import Ripple from 'react-native-material-ripple'
import { RightIcon } from './components/Icons'
import { select } from './store'
import Input from './components/Input'

const SelectPage = ({ match }) => {
    const [search, setSearch] = useState('')
    const dispatch = useDispatch()
    const history = useHistory()
    const data = useSelector(state => {
        switch (match.params.type) {
            case 'street': return state.streets.reduce((t, v) => {
                let item = {
                    id: v.id,
                    value: `${v.type}. ${v.name}`
                }
                if (item.value.toLowerCase().indexOf(search)>=0) {
                    return [...t, item]    
                }
                return t
            }, [])
            case 'building': return state.buildings.reduce((t, v) => {
                let item = {
                    id: v.id,
                    value: `${v.number}${v.housing?'/'+v.housing:''}`
                }
                if (item.value.toLowerCase().startsWith(search)) {
                    return [...t, item]    
                }
                return t
            }, [])
            case 'apartment': return state.apartments.reduce((t, v) => {
                let item = {
                    id: v.id,
                    value: `${v.number}${v.part?'/'+v.part:''}`
                }
                if (item.value.toLowerCase().startsWith(search)) {
                    return [...t, item]    
                }
                return t
            }, [])
            default: []
        }
    })


    const onBack = () => {
        history.goBack()
    }

    const getTitle = () => {
        switch (match.params.type) {
            case 'street': return 'улицы'
            case 'building': return 'дома'
            case 'apartment': return 'квартиры'
            default: return match.params.type
        }
    }

    const isNumberpad = match.params.type === 'street' ? false : true

    const onPress = (item) => {
        history.replace('/add')
        dispatch(select(match.params.type, item))
    }

    const renderItem = ({ item }) => {
        return (
            <Ripple style={styles.item} onPress={()=>onPress(item)}>
                <View style={styles.content}>
                    <Text style={styles.value}>{item.value}</Text>
                </View>
                {/* <View style={styles.icon}> */}
                    <RightIcon size={22} />
                {/* </View> */}
            </Ripple>
        )
    }

    return (
        <View style={{flex: 1}}>
            <Appbar title={`Выбор ${getTitle()}`} back onBack={onBack}/>
            <View style={styles.filter}>
                <Input placeholder="Фильтр" value={search} onChange={e=>setSearch(e.toLowerCase())} number={isNumberpad} />
            </View>
            <FlatList style={{paddingHorizontal: 16}} data={data} keyExtractor={item => item.id.toString()} renderItem={renderItem} ItemSeparatorComponent={()=><View style={styles.separator} />} />
        </View>
    )
}

export default SelectPage

const styles = StyleSheet.create({
    filter: {
        paddingHorizontal: 16
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16
    },
    content: {
        flex: 1,
    },
    value: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#222'
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#222',
        opacity: 0.2
    }
})