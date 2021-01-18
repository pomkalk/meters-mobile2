import React, { useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView} from 'react-native'
import Constants from 'expo-constants'

const NotofocationsPage = () => {
    useEffect(()=>{
        console.log('notify')
    },[])
    return (
        <ScrollView>
            <Text>{JSON.stringify(Constants, null, 2)}</Text>
        </ScrollView>
    )
}

export default NotofocationsPage
