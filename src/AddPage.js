import React, { useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, ToastAndroid } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-native'
import Appbar from './components/Appbar'
import Button from './components/Button'
import { QrIcon } from './components/Icons'
import Input from './components/Input'
import { getStreets, sendAddress, setSelected } from './store'

const AddPage = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { disabled, loading, selected } = useSelector(state=>({
        disabled: state.disabled,
        selected: state.selected,
        loading: {
            streets: state.loading.streets,
            buildings: state.loading.buildings,
            apartments: state.loading.apartments,
            request: state.loading.request,
        }
    }))

    useEffect(() => {
        dispatch(getStreets())
    }, [])

    const onBack = () => {
        history.goBack()
    }

    const onSubmit = () => {
        if (selected.street === null) {
            return ToastAndroid.showWithGravity('Укажите улицу.', ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
        if (selected.building === null) {
            return ToastAndroid.showWithGravity('Укажите дом.', ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
        if (selected.apartment === null) {
            return ToastAndroid.showWithGravity('Укажите квартиру.', ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
        if (selected.ls===null) {
            return ToastAndroid.showWithGravity('Укажите лицевой счет.', ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
        if (selected.ls.trim().length < 6) {
            return ToastAndroid.showWithGravity('Укажите лицевой счет (6 цифр).', ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
        if (selected.space === null) {
            return ToastAndroid.showWithGravity('Укажите площадь.', ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
        if (selected.ls.trim().length === 0) {
            return ToastAndroid.showWithGravity('Укажите лицевой счет (6 цифр).', ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
        history.replace('/main')
        dispatch(sendAddress())
    }

    return (
        <View style={{flex: 1}}>
            <Appbar title="Добавить адрес" back onBack={onBack}/>
            <ScrollView style={styles.container}>
                <Button text="Сканировать QR код на счете" icon={<QrIcon />} onPress={()=>console.log('qr')} />
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Указать адрес вручную</Text>
                    <View style={styles.dividerLine} />
                </View>
                <Input placeholder="Улица" value={selected.street&&selected.street.value} readonly disabled={disabled.streets} loading={loading.streets} onPress={()=>history.push('/select/street')} />
                <Input placeholder="Дом" value={selected.building&&selected.building.value} readonly disabled={disabled.buildings} loading={loading.buildings} onPress={()=>history.push('/select/building')} />
                <Input placeholder="Квартира" value={selected.apartment&&selected.apartment.value} readonly disabled={disabled.apartments} loading={loading.apartments} onPress={()=>history.push('/select/apartment')} />
                <Input placeholder="Лицевой счет" number value={selected.ls} onChange={e=>dispatch(setSelected('ls', e))} />
                <Input placeholder="Площадь помещения" number value={selected.space} onChange={e=>dispatch(setSelected('space', e))} />
                <Button text="Добавить адрес" textColor="white" flat color="#4A7CFE" onPress={onSubmit} loading={loading.request} />
            </ScrollView>
        </View>
    )
}

export default AddPage

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16
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
        fontSize: 14,
        fontFamily: 'Roboto',
        color: '#222'
    }
})