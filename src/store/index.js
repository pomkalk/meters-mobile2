import { createStore, applyMiddleware} from 'redux'
import Thunk from 'redux-thunk'

const initStore = {
    title: 'Новости',
    pageKey: 'news',
    status: {
        access: true
    },
    saved: [
        { address: 'пр. Кирова, д. 108/А, кв. 116', ls: 103030, token: 'asd-dsa-www'},
        { address: 'пр. Ленина, д. 65, кв. 73', ls: 507654, token: 'asd-dsa-www'}
    ],
    loading: {
        status: true
    }
}

export const SET_TITLE = 'SET_TITLE'
export const SET_PAGE_KEY = 'SET_PAGE_KEY'
export const SET_STATUS = 'SET_STATUS'
export const SET_SAVED = 'SET_SAVED'
export const SET_LOADING = 'SET_LOADING'

export const setTitle = (title) => ({type: SET_TITLE, title})
export const setPageKey = (key) => ({type: SET_PAGE_KEY, key})
export const setStatus = (status) => ({type: SET_STATUS, status})
export const setSaved = (saved) => ({type: SET_SAVED, saved})
export const setLoading = (name, loading) => ({type: SET_LOADING, name, loading})

const reducer = (state = initStore, action) => {
    switch (action.type) {
        case SET_TITLE: return {...state, title: action.title}
        case SET_PAGE_KEY: return {...state, pageKey: action.key}
        case SET_STATUS: return {...state, status: action.statu}
        case SET_SAVED: return {...state, saved: action.saved}
        case SET_LOADING: return {...state, loading: {...state.loading, [action.name]: action.loading}}
        default: return state
    }
}

const store = createStore(reducer, applyMiddleware(Thunk))

export default store
