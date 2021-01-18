import React, { useEffect } from 'react'
import { StyleSheet, View, Text} from 'react-native'

const NewsPage = () => {
    useEffect(()=>{
        console.log('news')
    },[])
    return (
        <View style={styles.news}>
            <Text style={styles.newsEmptyText}>Новостей пока нет</Text>
        </View>
    )
}

export default NewsPage

const styles = StyleSheet.create({
    news: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    newsEmptyText: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#222'
    }
})