import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableOpacity,
    Text,
    ImageBackground,
    StatusBar,
    ColorPropType,
    ActivityIndicator,
    TextInput,
    Dimensions,
    Modal,
    Alert,
    Linking,
    Vibration
} from 'react-native';
import { Image, View as ViewAnimatable } from 'react-native-animatable';
import { IProfileReduxProps } from './Profile.Container';
import Navbar from '../_global/Navbar';
import colors from '../../constants/colors';
import { IFeatureHotel } from '../../types/hotel';
import { Navigation } from 'react-native-navigation';
import { mainmenu, ProfileData, restoMain, chat, CardDetails, pickHotel } from '../../utils/navigationControl';
import { heightPercentageToDP as hp , scale, widthPercentageToDP, widthPercentageToDP as wp } from '../../utils/dimensions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { QRScannerView } from 'react-native-qrcode-scanner-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { IQRCodeScanReduxProps } from './QRCode.Container';

// import { TextInput } from 'react-native-gesture-handler';

export interface IQRCodeScanProps extends IQRCodeScanReduxProps {
    componentId: string;
    background : boolean;
    onSuccess : () => void;
    onScanButton : () => void;
}

interface IQRCodeScanState {
    loading: boolean;
    code: string;
    marginLeft: number;
    modalVisible: boolean;
    email: string;
    password: string;
    type: string;
    visible : boolean;
    text : string;
    dataFromQR : string,
    One_second_in_MS : number;
    scanEnable : boolean;
}

class QRCodeScan extends React.Component<IQRCodeScanProps, IQRCodeScanState> {
    constructor(props: IQRCodeScanProps) {
        super(props);

        this.state = {
            loading: false,
            code: '',
            marginLeft: scale.w(100),
            modalVisible: false,
            email: '',
            password: '',
            type: '',
            visible : false,
            text : '',
            dataFromQR : '',
            One_second_in_MS : 1000,
            scanEnable : false
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: colors.LIGHT_BLUE,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this)
        this.onSuccess = this.onSuccess.bind(this)
    }

    _handleBack() {
        Navigation.popToRoot(this.props.componentId)
    }

    onSuccess(e : any) {
        if (this.state.scanEnable) {
        this.setState({
            dataFromQR : e.data,
            scanEnable : false
        })
        Vibration.vibrate()
    }
      };
    

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor : '#000000' }} behavior="padding" enabled={Platform.OS === 'ios'}>
                < QRScannerView
                onScanResult={this.props.onSuccess}
                renderHeaderView={() => <View style={{height : hp(10), justifyContent : 'center'}} >
                <Navbar tintBackColor={'white'}  titleColor={"white"} onClick={this._handleBack} title={"Scan QR Code"} />
                </View>}
                maskColor={'#4B4B4B'}
                rectStyle={{height : hp(35), width : wp(65), marginTop : -170}}
                cornerStyle={{borderColor : colors.BLUE, borderWidth : 3}}
                scanBarStyle={{backgroundColor : colors.BLUE}}
                scanBarAnimateReverse={ true }
                hintText={''}
                renderFooterView={() => <View></View>}
                />
            </KeyboardAvoidingView>
        );
    }
}

export default QRCodeScan;
