import React, {useEffect} from 'react'
import { StyleSheet, View, Text, ScrollView} from 'react-native'
import Loader from './components/Loader'
import Message from './components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from './store'

const MetersPage = () => {
    const dispatch = useDispatch()
    const { status, statusLoading } = useSelector(state => ({
        status: state.status,
        statusLoading: state.loading.status
    }))

    useEffect(()=>{
        console.log('meters')
        setTimeout(()=>{
            dispatch(setLoading('status', false))
        }, 5000)
    },[])
    return (
        <ScrollView style={styles.container}>
            {statusLoading&&<Loader />}
            {!status.access&&<Message title="Внимание" body="Здравствуйте, ввод показаний доступен в период с 08:00 17 числа по 23:59 25 числа каждого месяца." />}
            <Text>Meters</Text>
        </ScrollView>
    )
}

export default MetersPage

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginVertical: 8
    }
})