import { createStore, applyMiddleware} from 'redux'
import Thunk from 'redux-thunk'
import * as axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { ToastAndroid, Alert, } from 'react-native'
import NetInfo from '@react-native-community/netinfo'

const url = 'http://meters.uez-lk.ru'

const initStore = {
    title: 'Новости',
    pageKey: 'news',
    expoToken: null,
    status: {
        access: true
    },
    saved: null,
    streets: null,
    buildings: null,
    apartments: null,
    loading: {
        status: true,
        request: false,
        streets: true,
        buildings: false,
        apartments: false,
        meter: false,
        history: false,
        news: false,
        newsUpdating: false
    },
    disabled: {
        streets: true,
        buildings: true,
        apartments: true,
    },
    selected: {
        street: null,
        building: null,
        apartment: null,
        ls: null,
        space: null
    },
    activeView: null,
    activeData: null,
    activeEdit: null,
    updating: null,
    history: null,
    news: null,
    newsUpdated: false
}

export const SET_TITLE = 'SET_TITLE'
export const SET_PAGE_KEY = 'SET_PAGE_KEY'
export const SET_STATUS = 'SET_STATUS'
export const SET_SAVED = 'SET_SAVED'
export const SET_LOADING = 'SET_LOADING'
export const SET_DISABLED = 'SET_DISABLED'
export const SET_SELECTED = 'SET_SELECTED'
export const SET_DATA = 'SET_DATA'
export const CLEAR_DATA = 'CLEAR_DATA'
export const SET_EXPO_TOKEN = 'SET_EXPO_TOKEN'
export const SET_ACTIVE_VIEW = 'SET_ACTIVE_VIEW'
export const SET_ACTIVE_DATA = 'SET_ACTIVE_DATA'
export const SET_ACTIVE_EDIT = 'SET_ACTIVE_EDIT'
export const SET_UPDATING = 'SET_UPDATING'
export const SET_HISTORY = 'SET_HISTORY'
export const SET_NEWS = 'SET_NEWS'
export const SET_NEWS_UPDATED = 'SET_NEWS_UPDATED'

export const setTitle = (title) => ({type: SET_TITLE, title})
export const setPageKey = (key) => ({type: SET_PAGE_KEY, key})
export const setStatus = (status) => ({type: SET_STATUS, status})
export const setSaved = (saved) => ({type: SET_SAVED, saved})
export const setLoading = (name, loading) => ({type: SET_LOADING, name, loading})
export const setDisabled = (name, disabled) => ({type: SET_DISABLED, name, disabled})
export const setSelected = (name, value) => ({type: SET_SELECTED, name, value})
export const setData = (name, value) => ({type: SET_DATA, name, value})
export const clearData = (name) => ({type: CLEAR_DATA, name})
export const setExpoToken = (token) => ({type: SET_EXPO_TOKEN, token})
export const setActiveView = (value) => ({type: SET_ACTIVE_VIEW, value})
export const setActiveData = (value) => ({type: SET_ACTIVE_DATA, value})
export const setActiveEdit = (value) => ({type: SET_ACTIVE_EDIT, value})
export const setUpdating = (value) => ({type: SET_UPDATING, value})
export const setHistory = (history) => ({type: SET_HISTORY, history})
export const setNews = (news) => ({type: SET_NEWS, news})
export const setNewsUpdated = (updated) => ({type: SET_NEWS_UPDATED, updated})

const noInternet = () => {
    ToastAndroid.showWithGravity('Нет соединения с интернетом', ToastAndroid.LONG, ToastAndroid.CENTER)
}

const badRequest = (e) => {
    // TODO: replace with toast
    //Alert.alert('Ошибка', JSON.stringify(e))
    ToastAndroid.show('Ошибка соединения с сервером')
}

export const getStatus = () => (dispatch) => {
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            dispatch(setLoading('status', true))
            axios.get(`${url}/api/access`).then(({data}) => {
                setStatus(data)
                dispatch(setLoading('status', false))
            }).catch(e=>{
                badRequest(e)
            })
        } else {
            noInternet()
        }
    })
}

export const initMeters = () => (dispatch) => {
    AsyncStorage.getItem('saved_meters').then(data=>{
        dispatch(setSaved(JSON.parse(data)))
    }).catch(e=>{
        badRequest(e)
    })
}

export const getStreets = (force = false) => (dispatch, getState) => {
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            const streets = getState().streets
            if (streets===null || force) {
                dispatch(setDisabled('streets', true))
                dispatch(setLoading('streets', true))
                axios.get(`${url}/api/address`).then(({data})=>{
                    dispatch(setData('streets', data))
                }).catch(e=>{
                    badRequest(e)
                })
            }
        } else {
            noInternet()
        }
    })
}

export const getBuildings = (id, force = false) => (dispatch, getState) => {
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            const buildings = getState().buildings
            if (buildings===null || force) {
                dispatch(setDisabled('buildings', true))
                dispatch(setLoading('buildings', true))
                axios.get(`${url}/api/address/s${id}`).then(({data})=>{
                    dispatch(setData('buildings', data))
                }).catch(e=>{
                    badRequest(e)
                })
            }
        } else {
            noInternet()
        }
    })
}

export const getApartments = (id, force = false) => (dispatch, getState) => {
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            const apartments = getState().apartments
            if (apartments===null || force) {
                dispatch(setDisabled('apartments', true))
                dispatch(setLoading('apartments', true))
                axios.get(`${url}/api/address/b${id}`).then(({data})=>{
                    dispatch(setData('apartments', data))
                }).catch(e=>{
                    badRequest(e)
                })
            }
        } else {
            noInternet()
        }
    })
}

export const select = (type, value) => (dispatch) => {
    dispatch(setSelected(type, value))

    if (type === 'street') {
        dispatch(clearData('apartment'))
        dispatch(clearData('building'))
        dispatch(getBuildings(value.id))
    }

    if (type === 'building') {
        dispatch(clearData('apartment'))
        dispatch(getApartments(value.id))
    }
}

export const sendAddress = () => (dispatch, getState) => {
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            dispatch(setLoading('request', true))
            const { expoToken, selected } = getState()
            let values = {
                apartment: selected.apartment.id,
                ls: selected.ls,
                space: selected.space,
                remember: true
            }
            if (expoToken !== null) {
                values.did = Constants.installationId
                values.expo = expoToken
            }
            axios.post(`${url}/api/get-token`, values).then(({data})=>{
                dispatch(setLoading('request', false))
                if (data.error) {
                    return Alert.alert('Ошибка', data.error)
                }
                dispatch(addMeter({...data, notify: false}))
                dispatch(clearData('buildings'))
                dispatch(clearData('apartments'))
                dispatch(setSelected('street', null))
                dispatch(setSelected('ls', null))
                dispatch(setSelected('space', null))
            }).catch(e=>{
                badRequest(e)
            })
        } else {
            noInternet()
        }
    })
}

export const sendQr = (code) => (dispatch, getState) => {
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            dispatch(setLoading('request', true))
            const { expoToken, selected } = getState()
            let values = {
                code
            }
            if (expoToken !== null) {
                values.did = Constants.installationId
                values.expo = expoToken
            }
            console.log(values)
            axios.post(`${url}/api/get-token/qr`, values).then(({data})=>{
                dispatch(setLoading('request', false))
                if (data.error) {
                    return Alert.alert('Ошибка', data.error)
                }
                dispatch(addMeter({...data, notify: false}))
            }).catch(e=>{
                badRequest(e)
            })
        } else {
            noInternet()
        }
    })
}

export const addMeter = (meter) => (dispatch, getState) => {
    let saved = getState().saved
    if (saved === null) {
        AsyncStorage.setItem('saved_meters', JSON.stringify([meter]))
        return dispatch(setSaved([meter]))
    } else if (saved.length === 0) {
        AsyncStorage.setItem('saved_meters', JSON.stringify([meter]))
        return dispatch(setSaved([meter]))
    } else {
        if (saved.findIndex(x=>x.ls===meter.ls)>=0) {
            ToastAndroid.showWithGravity('Счетчик уже существует', ToastAndroid.SHORT, ToastAndroid.CENTER)
        } else {
            saved.push(meter)
            AsyncStorage.setItem('saved_meters', JSON.stringify(saved))
            return dispatch(setSaved(saved))
        }
    }
}

export const getActiveView = (ls) => (dispatch, getState) => {
    let saved = getState().saved
    let meter = saved.find(x=>x.ls===ls)
    dispatch(setActiveView(meter))
}

export const removeMeter = (ls) => (dispatch, getState) => {
    let saved = getState().saved
    if (saved !== null) {
        if (saved.length <= 1) {
            AsyncStorage.removeItem('saved_meters')
            dispatch(setSaved(null))
        } else {
            let index = saved.findIndex(x=>x.ls===ls)
            saved.splice(index, 1)
            AsyncStorage.setItem('saved_meters', JSON.stringify(saved))
            dispatch(setSaved(saved))
        }
    }
}

export const getMeter = (meter) => (dispatch) => {
    dispatch(setActiveView(meter))
    dispatch(setActiveData(null))
    dispatch(setLoading('meter', true))
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            axios.post(`${url}/api/get-meters`, { token: meter.token }).then(({data})=>{
                dispatch(setLoading('meter', false))
                if (data.error) {
                    Alert.alert('Ошибка', data.error)
                }
                console.log(data)
                dispatch(setActiveData(data))
            }).catch(e=>{
                badRequest(e)
            })
        } else {
            noInternet()
        }
    })
}

export const getHistory = (values) => (dispatch) => {
    dispatch(setHistory(null))
    dispatch(setLoading('history', true))
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            axios.post(`${url}/api/get-history`, values).then(({data})=>{
                dispatch(setLoading('history', false))
                dispatch(setHistory(data))
            }).catch(e=>{
                badRequest(e)
            })
        } else {
            noInternet()
        }
    })
}

export const updateMeter = (meter) => (dispatch, getState) => {
    let activeData = getState().activeData
    let meters = activeData.meters
    let index = meters.findIndex(x=>x.id===meter.id)
    if (index >= 0) {
        meters.splice(index, 1, meter)
        dispatch(setActiveData({...activeData, meters}))
    }
}

export const saveMeter = (values) => (dispatch) => {
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            dispatch(setUpdating(values.meter_id))
            axios.post(`${url}/api/save`, values).then(({data})=>{
                dispatch(setUpdating(null))
                if (data.error) {
                    Alert.alert('Ошибка', data.error)
                } else {
                    dispatch(updateMeter(data.meter))
                }
            }).catch(e=>{
                badRequest(e)
            })
        } else {
            noInternet()
        }
    })
}

export const registerDevice = (params) => (dispatch) => {
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            dispatch(setExpoToken(params.expo))
            axios.post(`${url}/api/device/reg`, params).catch((e)=>{
                console.log('reg error')
            })
        } else {
            noInternet()
        }
    })
}

export const getNews = (type='news') => (dispatch) => {
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            dispatch(setLoading(type, true))
            axios.get(`${url}/api/get-news?page=1`).then(({data}) => {
                dispatch(setNews(data))
                dispatch(setNewsUpdated(false))
                dispatch(setLoading('news', false))
                dispatch(setLoading('newsUpdating', false))
            })
        } else {
            noInternet()
        }
    })
}

export const loadNews = (page) => (dispatch, getState) => {
    let news = getState().news
    NetInfo.fetch().then(netstate => {
        if (netstate.isConnected) {
            dispatch(setLoading('news', true))
            axios.get(`${url}/api/get-news?page=${page}`).then(({data}) => {
                dispatch(setLoading('news', false))
                if (news === null) {
                    dispatch(setNews(data))
                } else {
                    dispatch(setNews({
                        ...data,
                        data: [ ...news.data, ...data.data]
                    }))
                }
            })
        } else {
            noInternet()
        }
    })
}

const reducer = (state = initStore, action) => {
    switch (action.type) {
        case SET_TITLE: return {...state, title: action.title}
        case SET_PAGE_KEY: return {...state, pageKey: action.key}
        case SET_STATUS: return {...state, status: action.statu}
        case SET_SAVED: return {...state, saved: action.saved}
        case SET_LOADING: return {...state, loading: {...state.loading, [action.name]: action.loading}}
        case SET_DISABLED: return {...state, disabled: {...state.disabled, [action.name]: action.disabled}}
        case SET_SELECTED: return {...state, selected: {...state.selected, [action.name]: action.value}}
        case SET_DATA: return {...state, [action.name]: action.value, loading: {...state.loading, [action.name]: false}, disabled: {...state.disabled, [action.name]: false}}
        case CLEAR_DATA: return {...state, selected: {...state.selected, [action.name]: null}, disabled: {...state.disabled, [action.name+'s']: true}, [action.name+'s']: null}
        case SET_EXPO_TOKEN: return {...state, expoToken: action.token}
        case SET_ACTIVE_VIEW: return {...state, activeView: action.value}
        case SET_ACTIVE_DATA: return {...state, activeData: action.value}
        case SET_ACTIVE_EDIT: return {...state, activeEdit: action.value}
        case SET_UPDATING: return {...state, updating: action.value}
        case SET_HISTORY: return {...state, history: action.history}
        case SET_NEWS: return {...state, news: action.news}
        case SET_NEWS_UPDATED: return {...state, newsUpdated: action.updated}
        default: return state
    }
}

const store = createStore(reducer, applyMiddleware(Thunk))

export default store
