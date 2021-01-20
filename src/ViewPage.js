import React from 'react'
import { StyleSheet, View, Text, Alert, FlatList} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-native'
import Appbar from './components/Appbar'
import { DeleteIcon, RightIcon } from './components/Icons'
import Loader from './components/Loader'
import { removeMeter, setActiveEdit } from './store'
import Message from "./components/Message";
import Ripple from 'react-native-material-ripple'

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

const ViewPage = ({ match }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const { view, data, loading, updating } = useSelector(state=>({
        view: state.activeView,
        data: state.activeData,
        loading: state.loading.meter,
        updating: state.updating
    }))

    const onBack = () => {
        history.replace('/main')
    }

    const onEdit = (item) => {
        let meter = {
            address: view.address,
            token: view.token,
            meter: item,
            access: data.access,
            period: data.period
        }
        if (!data.access) {
            meter.message = data.message
        }
        dispatch(setActiveEdit(meter))
        history.push('/edit')
    }

    const onDelete = () => {
        Alert.alert('Удалить', `Удалить ${view.address}?`, 
            [
                {
                    text: 'Да',
                    onPress: () => {
                        dispatch(removeMeter(view.ls))
                        history.replace('/main')
                    }
                }, {
                    text: 'Нет',
                    onPress: () => {
                        // 
                    }
                }
            ],
            {
                cancelable: false
            }
        )
    }
    
    let message = null
    let period = null
    let meters = null

    const renderItem = ({item}) => {
        const icon = updating==item.id?<Loader />:<RightIcon size={22} />
        return (
            <Ripple style={styles.item} onPress={()=>onEdit(item)} disabled={item.id===updating}>
                <View style={styles.itemContent}>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>Счетчик: {services[item.service]}</Text>
                    <Text style={[styles.text]}>Дата последних показаний: {monthName[item.last_month]} {item.last_year} г.</Text>
                    <Text style={[styles.text]}>Последнее показание: {item.last_value}</Text>
                    <Text style={[styles.text]}>Текущее показание: {item.new_value}</Text>
                </View>
                {icon}
            </Ripple>
        )
    }

    if (data) {
        if (!data.access) {
            message = <Message title="Внимание" body={data.message} />
        }

        period = (
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Период: {monthName[data.period.month]} {data.period.year} г.</Text>
                <View style={styles.dividerLine} />
            </View>
        )

        meters = (
            <FlatList  data={data.meters} keyExtractor={item=>item.id.toString()} renderItem={renderItem} ListEmptyComponent={()=><Text>Пусто</Text>} ItemSeparatorComponent={()=><View style={styles.separator} />} />
        )
    }

    return (
        <View>
            <Appbar title="Список счетчиков" back onBack={onBack} action actionIcon={<DeleteIcon size={22}/>} onAction={onDelete}/>
            <View style={{padding: 16}}>
                {message}
                <Text style={styles.title}>{ (view||{}).address }</Text>
                {loading&&<View style={styles.loading}><Loader /></View>}
                {period}
                {meters}
            </View>
        </View>
    )
}

export default ViewPage

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Roboto',
        fontSize: 20,
        color: '#222',
        marginBottom: 16
    },
    divider: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16
    },
    dividerLine: {
        backgroundColor: '#222',
        width: 10,
        height: 1
    },
    dividerText: {
        paddingHorizontal: 8,
        fontSize: 16,
        fontFamily: 'Roboto',
        color: '#222'
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#222',
        opacity: 0.2
    },
    item: {
        paddingVertical: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemContent: {
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