import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text} from 'react-native'
import { useHistory } from 'react-router-native'
import Appbar from './components/Appbar'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useDispatch } from 'react-redux'
import { sendQr } from './store'
import { ExpandIcon } from './components/Icons'
const QrPage = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [hasPermission, setHasPermission] = useState(null)

    const onBack = () => {
        history.goBack()
    }

    useEffect(() => {
        registerBarcodeScanner().then(status => setHasPermission(status))
    }, [])

    const onScan = ({ data }) => {
        dispatch(sendQr(data))
        history.replace('/main')
        // history.replace('/')
    }

    let page = (
        <BarCodeScanner onBarCodeScanned={onScan} type={BarCodeScanner.Constants.Type.back} barCodeTypes={BarCodeScanner.Constants.BarCodeType.qr} style={[StyleSheet.absoluteFill, styles.barcode]}/>
    )

    if (hasPermission===null) {
        page = (
            <View style={styles.nocamera}>
                <Text>Запрашиваю доступ к камере</Text>
            </View>
        )
    }

    if (hasPermission===false) {
        page = (
            <View style={styles.nocamera}>
                <Text>Нет доступа к камере</Text>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
            <Appbar title="Сканировать QR код" back onBack={onBack}/>
            {page}
        </View>
    )
}

export default QrPage

async function registerBarcodeScanner () {
    const { status } = await BarCodeScanner.requestPermissionsAsync()
    return status === 'granted'
}


const styles = StyleSheet.create({
    nocamera: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    barcode: {
        flex: 1,
        zIndex: -2
    },
    target: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})