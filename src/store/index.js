import { createStore, applyMiddleware} from 'redux'
import Thunk from 'redux-thunk'
import * as axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { ToastAndroid, Alert } from 'react-native'

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
    }
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

export const getStatus = () => (dispatch) => {
    dispatch(setLoading('status', true))
    axios.get(`${url}/api/access`).then(({data}) => {
        setStatus(data)
        dispatch(setLoading('status', false))
    }).catch(e=>{
        alert(JSON.stringify(e))
    })
}

export const initMeters = () => (dispatch) => {
    AsyncStorage.getItem('saved_meters').then(data=>{
        dispatch(setSaved(JSON.parse(data)))
    }).catch(e=>{
        alert(JSON.stringify(e))
    })
}

export const getStreets = (force = false) => (dispatch, getState) => {
    const streets = getState().streets
    if (streets===null || force) {
        dispatch(setDisabled('streets', true))
        dispatch(setLoading('streets', true))
        axios.get(`${url}/api/address`).then(({data})=>{
            dispatch(setData('streets', data))
        }).catch(e=>{
            alert(JSON.stringify(e))
        })
    }
}

export const getBuildings = (id, force = false) => (dispatch, getState) => {
    const buildings = getState().buildings
    if (buildings===null || force) {
        dispatch(setDisabled('buildings', true))
        dispatch(setLoading('buildings', true))
        axios.get(`${url}/api/address/s${id}`).then(({data})=>{
            dispatch(setData('buildings', data))
        }).catch(e=>{
            alert(JSON.stringify(e))
        })
    }
}

export const getApartments = (id, force = false) => (dispatch, getState) => {
    const apartments = getState().apartments
    if (apartments===null || force) {
        dispatch(setDisabled('apartments', true))
        dispatch(setLoading('apartments', true))
        axios.get(`${url}/api/address/b${id}`).then(({data})=>{
            dispatch(setData('apartments', data))
        }).catch(e=>{
            alert(JSON.stringify(e))
        })
    }
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
    dispatch(setLoading('request', true))
    const { expoToken, selected } = getState()
    let values = {
        apartment: selected.apartment.id,
        ls: selected.ls,
        space: selected.space,
    }
    if (expoToken !== null) {
        values.did = Constants.installationId
        values.exp = expoToken
    }
    axios.post(`${url}/api/get-token`, values).then(({data})=>{
        dispatch(setLoading('request', false))
        if (data.error) {
           // ToastAndroid.showWithGravity(data.error, ToastAndroid.LONG, ToastAndroid.CENTER)
           Alert.alert('Ошибка', data.error)
        }
        console.log(data)
    }).catch(e=>{
        alert(JSON.stringify(e))
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
        default: return state
    }
}

const store = createStore(reducer, applyMiddleware(Thunk))

export default store
