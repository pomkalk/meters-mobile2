import React from 'react'
import { ActivityIndicator } from 'react-native'

const Loader = (props) => {
    return <ActivityIndicator {...props} color={props.color || "#4A7CFE"} />
}

export default Loader
