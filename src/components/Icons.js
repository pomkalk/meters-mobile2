import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/FontAwesome5'

export const SettingsIcon = (props) => (<Icon name="setting" {...props} color="#222" size={props.size||24}/>)
export const BackIcon = (props) => (<Icon name="arrowleft" {...props} color="#222" size={props.size||24}/>)
export const NewsIcon = (props) => (<Icon2 name="newspaper" {...props} color="#222" size={props.size||24}/>)
export const MeterIcon = (props) => (<Icon name="dashboard" {...props} color="#222" size={props.size||24}/>)
export const NotifyIcon = (props) => (<Icon name="notification" {...props} color="#222" size={props.size||24}/>)
export const PlusIcon = (props) => (<Icon name="plus" {...props} color="#222" size={props.size||24}/>)
export const QrIcon = (props) => (<Icon name="qrcode" {...props} color="#222" size={props.size||24}/>)
export const InfoIcon = (props) => (<Icon name="infocirlceo" {...props} color="#222" size={props.size||24}/>)