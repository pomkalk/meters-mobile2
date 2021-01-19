import React, {useEffect} from 'react'
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native'
import Loader from './components/Loader'
import Message from './components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { getStatus, setLoading } from './store'
import SavedList from './components/SavedList'
import FAB from './components/FAB'
import { useHistory } from 'react-router-native'

const MetersPage = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { status, statusLoading, requesting } = useSelector(state => ({
        status: state.status,
        statusLoading: state.loading.status,
        requesting: state.loading.request
    }))

    const onStatusRefresh = () => {
        dispatch(getStatus())
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView style={styles.container} refreshControl={<RefreshControl colors={['#4A7CFE']} refreshing={(statusLoading||requesting)} onRefresh={onStatusRefresh}/>}>
                {!status.access&&<Message title="Внимание" body={status.message} />}
                <SavedList />
                
            </ScrollView>
            <FAB onPress={()=>history.push('/add')} />
        </View>
    )
}

export default MetersPage

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        
    }
})