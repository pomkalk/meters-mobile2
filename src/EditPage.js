import React, { useState } from 'react'
import { StyleSheet, View, Text, ScrollView} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-native'
import Appbar from './components/Appbar'
import Button from './components/Button'
import Input from './components/Input'
import { getHistory, saveMeter, setUpdating } from './store'
import Message from './components/Message'

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

const EditPage = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const { data, loading } = useSelector(state=>({
        data: state.activeEdit,
        loading: state.updating===null?false:true
    }))
    const [value, setValue] = useState((data.meter.new_value||'').toString())

    let last_value = parseFloat(data.meter.last_value)

    const onBack = () => {
        history.replace('/view')
    }

    const onSave = () => {
        dispatch(saveMeter({
            value,
            meter_id: data.meter.id,
            token: data.token
        }))
        history.replace('/view')
    }

    const onHistory = () => {
        dispatch(getHistory({
            meter_id: data.meter.id,
            token: data.token
        }))
        history.replace('/history')
    }

    let spent = ''

    let message = null
    let meter_value = null

    if (!data.access) {
        message = <Message title="Внимание" body={data.message} />
        meter_value = <Text style={[styles.text]}>Показание: {data.meter.new_value}</Text>
    } else {
        meter_value = (
            <>
                <Input placeholder="Текущее показание" number float value={value} onChange={(e)=>setValue(e)} />
                <Button flat color="#4A7CFE" text="Сохранить" onPress={onSave} loading={loading} />
            </>
        )
    }

    if (data.meter.last_value) {
        if (!isNaN(last_value)) {
            let x = parseFloat(value)
            if (!isNaN(x)) {
                spent = `${x} - ${last_value} = ${Math.round(((x - last_value) + Number.EPSILON) * 100) / 100}`
            }
        }
    }


    return (
        <View style={{flex: 1}}>
            <Appbar title="Ввод показаний" back onBack={onBack}/>
            <ScrollView style={{padding: 16, flex: 1}}>
                { message }
                <Text style={styles.title}>{ data.address }</Text>
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Период: {monthName[data.period.month]} {data.period.year} г.</Text>
                    <View style={styles.dividerLine} />
                </View>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>Счетчик: {services[data.meter.service]}</Text>
                    <Text style={[styles.text]}>Дата последних показаний: {monthName[data.meter.last_month]} {data.meter.last_year} г.</Text>
                    <Text style={[styles.text]}>Последнее показание: {data.meter.last_value}</Text>
                    <Text style={[styles.text, { fontStyle: 'italic'} ]}>Расход: {spent}</Text>
                    { meter_value }
                    <View style={{paddingTop: 24}}>
                        <Button text="История показаний" onPress={onHistory} />
                    </View>
            </ScrollView>
        </View>
    )
}

export default EditPage

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
    text: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#222',
        marginBottom: 4
    }
})