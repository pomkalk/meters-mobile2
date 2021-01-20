import React from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-native'
import Appbar from './components/Appbar'
import Loader from './components/Loader'

const zero = (d) => {
    return ('0'+d).slice(-2)
}

export const ParseDate = (dateString) => {
    let d = new Date(dateString)
    return `${zero(d.getDate())}.${zero(d.getMonth()+1)}.${d.getFullYear()} ${zero(d.getHours())}:${zero(d.getMinutes())}:${zero(d.getSeconds())}`
}

export const ParseDate2 = (dateString) => {
    let d = new Date(dateString)
    return `${zero(d.getDate())}.${zero(d.getMonth()+1)}.${d.getFullYear()}`
}


const monthName = {
    1: 'Январь',
    2: 'Февраль',
    3: 'Март',
    4: 'Апрель',
    5: 'Май',
    6: 'Июнь',
    7: 'Июль',
    8: 'Август',
    9: 'Сентябрь',
    10: 'Октябрь',
    11: 'Ноябрь',
    12: 'Декабрь',
}

const services = {
    1: 'Холодная вода',
    2: 'Горячая вода',
    3: 'Электроэнергия',
    4: 'Отопление'
}

const HistoryPage = () => {
    const history = useHistory()
    const { data, loading } = useSelector(state=>({
        data: state.history,
        loading: state.loading.history
    }))
    const onBack = () => {
        history.goBack()
    }

    const renderItem = ({item}) => {
        const d = item.new_date ? ParseDate2(item.new_date) : ''
        return (
                <View style={styles.itemContent}>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>Месяц: {monthName[item.month]} {item.year} г.</Text>
                    <Text style={[styles.text]}>Счетчик: {services[item.service]}</Text>
                    <Text style={[styles.text]}>Дата последних показаний: {monthName[item.last_month]} {item.last_year} г.</Text>
                    <Text style={[styles.text]}>Последнее показание: {item.last_value}</Text>
                    <Text style={[styles.text]}>Показание: {item.new_value}</Text>
                    <Text style={[styles.text]}>Дата: {d}</Text>
                </View>
        )
    }

    let page = null
    if (data) {
        page = (
            <View style={{flex: 1}}>
                <Text style={styles.title}>{ data.address }</Text>
                <FlatList style={{paddingHorizontal: 16}} data={data.meters} keyExtractor={item=>item.id.toString()} renderItem={renderItem} ListEmptyComponent={()=><Text>Пусто</Text>} ItemSeparatorComponent={()=><View style={styles.separator} />} />
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
            <Appbar title="История показаний" back onBack={onBack}/>
            <View style={{flex: 1}}>
                {loading&&<View style={styles.loading}><Loader /></View>}
                {page}
            </View>
        </View>
    )
}

export default HistoryPage

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Roboto',
        fontSize: 20,
        color: '#222',
        marginBottom: 16,
        paddingHorizontal: 16
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#222',
        opacity: 0.2
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemContent: {
        paddingVertical: 16,
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    text: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#222'
    }
})