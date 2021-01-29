import React, { useRef } from 'react'
import { StyleSheet, View, Text, RefreshControl, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './components/Loader'
import Message from './components/Message'
import { ParseDate2 } from './HistoryPage'
import { getNews, loadNews } from './store'

const NewsPage = () => {
    const scrollView = useRef()
    const dispatch = useDispatch()
    const { news, loading, updating, updated } = useSelector(state=>({
        news: state.news,
        loading: state.loading.news,
        updating: state.loading.newsUpdating,
        updated: state.newsUpdated
    }))

    let page = null

    if (!news) {
        page = (
            <View>
                <Text></Text>
            </View>
        )
    }

    const onRefresh = () => {
        dispatch(getNews('newsUpdating'))
    }

    const onScroll = (e) => {
        const p = 20
        const n = e.nativeEvent
        if (n.layoutMeasurement.height+n.contentOffset.y>=n.contentSize.height - p) {
            if (!loading) {
                if (news) {
                    let page = parseInt(news.page)
                    let pageSize = parseInt(news.pageSize)
                    let total = parseInt(news.total)
                    if (page*pageSize < total) {
                        dispatch(loadNews(parseInt(news.page)+1))
                        setTimeout(()=>{
                            scrollView.current.scrollToEnd()
                        }, 200)
                    }
                }
            }
        }
    }

    return (
        <View style={styles.news}>
            <ScrollView ref={scrollView} style={styles.list} refreshControl={<RefreshControl refreshing={updating} colors={['#4A7CFE']} onRefresh={onRefresh} />} onScroll={onScroll}>
                {updated&&<View style={styles.updated}>
                    <Text style={styles.updatedText}>Свайп вниз, чтобы обновить новости</Text>
                </View>}
                {news&&news.data.map(x=>{
                    return (
                        <View key={x.id} style={{paddingHorizontal: 16}}>
                            <Message ripple title={x.title} body={x.body} date={ParseDate2(x.created_at)}/>
                        </View>
                    )
                })}
                {loading&&<View style={{padding: 8}}>
                    <Loader />
                </View>}
            </ScrollView>
        </View>
    )
}

export default NewsPage

const styles = StyleSheet.create({
    news: {
        flex: 1
    },
    list: {
        flex: 1,
    },
    updated: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    updatedText: {
        fontFamily: 'Roboto',
        color: '#222', 
        
        padding: 8,
        margin: 8,
        borderRadius: 50,
        backgroundColor: 'white'
    },
    box: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 4,
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        display: 'flex',
        flexDirection: 'column'
    }
})