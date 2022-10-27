// export default PickHotel;
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
    Pressable,
    Vibration,
    PermissionsAndroid,
    BackHandler,
} from 'react-native';
import { BlurView } from 'react-native-blur';
import { Image, View as ViewAnimatable } from 'react-native-animatable';
import { IPickHotelReduxProps } from './PickHotel.Container';
import DropDownPicker from 'react-native-dropdown-picker';
import base from '../../utils/baseStyles';
import colors from '../../constants/colors';
import { H1, H4, H3 } from '../_global/Text';
import { ButtonPrimary } from '../_global/Button';
import FieldForm from '../CheckIn/Components/FieldForm';
import { Navigation } from 'react-native-navigation';
import { mainmenu, restoMain } from '../../utils/navigationControl';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../utils/dimensions';
import { clockRunning, color } from 'react-native-reanimated';
import Field from './Component/Text_Input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';

// import { TextInput } from 'react-native-gesture-handler';
import {
    getTrackingStatus,
    requestTrackingPermission,
    TrackingStatus,
} from 'react-native-tracking-transparency';
import CustomModal from '../_global/CustomModal';
import QRCodeScan from '../QRCodeScan/QRCode.Container';
import { QRScannerView } from 'react-native-qrcode-scanner-view';
import Navbar from '../_global/Navbar';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { isThisSecond, isThursday } from 'date-fns';
import AsyncStorage from '@react-native-community/async-storage';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { toast, validateEmail, validateName } from '../../utils/handleLogic';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { wp } from '../../utils/dimensions';
import { hp } from '../../utils/dimensions';
import { userLogin } from '../../actions/action.account';
interface IPickHotelProps extends IPickHotelReduxProps {
    componentId: string;
}

interface IPickHotelState {
    screenIncrement: number;
    loading: boolean;
    code: string;
    marginLeft: number;
    modalVisible: boolean;
    email: string;
    password: string;
    type: string;
    newAuthScreen: boolean;
    signIn: boolean;
    forgetPassword: boolean;
    updatePassword: boolean;
    sendOTP: boolean;
    isPassword: boolean;
    scanEnable: boolean;
    text: string;
    dataFromQR: string;
    One_second_in_MS: number;
    googleSign: boolean;
    fullName: string;
    otpCode: number;
    newPassword: string;
    reEnterNewPassword: string;
    reference: string;
    selectedItem: object;
    nameValid: boolean;
    emailValid: boolean;
    QRCODEStatus: boolean;
    OTPAttemptCount: number;
    chainData: {
        data: {
            name: string;
            logo: string;
            splash_screen: string;
            private_policy: string;
            terms_n_conditions: string;
            about_us: string;
            contact_us: string;
            logo_gif_dark: string;
            logo_gif_light: string;
            signup_bg: string;
            signin_bg: string;
        };
    };
}

class PickHotel extends React.Component<IPickHotelProps, IPickHotelState> {
    private _modalQRScan = React.createRef<CustomModal>();
    constructor(props: IPickHotelProps) {
        super(props);

        this.state = {
            loading: false,
            code: '',
            marginLeft: scale.w(100),
            modalVisible: false,
            email: '',
            signIn: true,
            password: '',
            type: '',
            newAuthScreen: true,
            forgetPassword: false,
            updatePassword: false,
            sendOTP: false,
            isPassword: true,
            scanEnable: false,
            text: '',
            dataFromQR: '',
            One_second_in_MS: 1000,
            googleSign: false,
            fullName: '',
            otpCode: 0,
            newPassword: '',
            reEnterNewPassword: '',
            reference: '',
            selectedItem: {
                name: this.props.selectedLanguage.select_hotel,
            },
            emailValid: false,
            nameValid: false,
            QRCODEStatus: false,
            OTPAttemptCount: 0,
            screenIncrement: 0,
            chainData: {
                data: {
                    name: '',
                    logo: '',
                    splash_screen: '',
                    private_policy: '',
                    terms_n_conditions: '',
                    about_us: '',
                    contact_us: '',
                    logo_gif_dark: '',
                    logo_gif_light: '',
                    signup_bg: '',
                    signin_bg: '',
                },
            },
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: colors.BLUE,
                style: 'light',
            },
        });
        this.trackingTransparencyIssue();
        this.onSuccess = this.onSuccess.bind(this);
        this.onScanButton = this.onScanButton.bind(this);
        this._CheckButtonState = this._CheckButtonState.bind(this);
        this._handleOnEyePress = this._handleOnEyePress.bind(this);
        this.onGoogleSignin = this.onGoogleSignin.bind(this);
        this.onGoogleLogoout = this.onGoogleLogoout.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);

        GoogleSignin.configure({
            // Mandatory method to call before calling signIn()
            scopes: ['email', 'profile'],
            // Repleace with your webClientId
            // Generated from Firebase console
            webClientId: '899929579969-fr3o6e32nbai6p2moksmdpnbf4722bth.apps.googleusercontent.com',
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        if (this.state.screenIncrement == 1) {
            this.setState({
                screenIncrement: 0,
                forgetPassword: false,
                sendOTP: false,
                updatePassword: false,
            });
        } else {
            Navigation.pop(this.props.componentId);
        }
        return true;
    }

    async componentDidMount() {
        this.props.getHotelList();
        console.log('hotels data===========>', this.props.hotels);
        const isSignedIn = await GoogleSignin.isSignedIn();
        try {
            console.log(isSignedIn);
            if (isSignedIn) {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                this.setState({
                    googleSign: false,
                });
            }
        } catch (error) {
            console.error(error);
        }
        if (isSignedIn) {
            console.log('User is already signed in');
        } else {
            console.log('Please Login');
        }

        this.setState({
            chainData: this.props.chainData,
        });
    }

    async trackingTransparencyIssue() {
        try {
            const status = await requestTrackingPermission();
            console.log(status);
        } catch (e) {
            toast(e?.toString?.() ?? e);
        }
    }

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                title: `${this.props.chainData.data.name} App Camera Permission`,
                message: `${this.props.chainData.data.name} app need to access your camera' + 'so you can use the QR Code Scanner`,
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setTimeout(() => {
                    this._modalQRScan.current?.show();
                    this.setState({
                        QRCODEStatus: true,
                    });
                }, 1000);
            } else {
                toast('Request Camera access permission denied');
            }
        } catch (err) {
            toast(err);
        }
    };

    _handleContinue = () => {
        Keyboard.dismiss();
        this.setState({ loading: true });
        // this.props.getHotelDetail(
        //     this.props.hotel_Code,
        //     () => {
        //         this.setState({ loading: false });
        //         // if (type == 'alreadyLoggedIn') {
        //         //     this.setModalVisible(true);
        //         // } else {
        //         setTimeout(() => {
        //             console.log("token is here on pick hotel        ", this.props.token)
        //             <ButtonPrimary.setItem('token', this.props.token)
        //             if (this.props.type != 'resto')
        Navigation.setRoot({
            root: {
                bottomTabs: {
                    children: [
                        {
                            stack: {
                                id: 'MAIN_MENU_TAB',
                                children: [
                                    {
                                        component: {
                                            id: 'mainmenu',
                                            name: 'MainMenu',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            stack: {
                                id: 'CHAT_TAB',
                                children: [
                                    {
                                        component: {
                                            id: 'chat',
                                            name: 'Chat',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            stack: {
                                id: 'LOST_AND_FOUND_TAB',
                                children: [
                                    {
                                        component: {
                                            id: 'lostAndFound',
                                            name: 'LostAndFound',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            stack: {
                                id: 'PROFILE_TAB',
                                children: [
                                    {
                                        component: {
                                            id: 'profile',
                                            name: 'Profile',
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    options: {
                        bottomTabs: {
                            visible: false,
                        },
                    },
                },
            },
        });
        //             else
        //                 Navigation.setRoot({
        //                     root: restoMain({
        //                         restaurant: this.props.resto,
        //                         color: this.props.color,
        //                         selectedLanguage: this.props.selectedLanguage,
        //                         type: this.props.type,
        //                         restoGuest: this.props.restoGuest,
        //                     }),
        //                 });
        //         }, 2000);
        //         // }
        //     },
        //     () => {
        //         this.setState({ loading: false });
        //     },
        // );
        // this.props.getHotelDetailSuccess(
        //     id,
        //     code,
        //     description,
        //     name,
        //     logo,
        //     layout.theme,
        //     layout.icons,
        //     hotel_features,
        //     category,
        //     currency,
        //     mobile_hotel_layout_id,
        //     mobile_hotel_layouts,
        //     dynamic_buttons,
        //     type,
        // );
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onSuccess(e: any) {
        if (this.state.scanEnable) {
            this.setState({
                dataFromQR: e.data,
                scanEnable: false,
            });
            toast(e.data);
            Vibration.vibrate();
            this._modalQRScan.current?.hide();
            this.setState({
                QRCODEStatus: false,
            });
        }
    }
    onScanButton() {
        this.setState({
            scanEnable: true,
        });
    }

    _CheckButtonState() {
        if (this.state.forgetPassword === true) {
            this.setState({ forgetPassword: false });
            this.setState({ sendOTP: true });
        } else if (this.state.sendOTP === true) {
            this.setState({ sendOTP: false });
            this.setState({ updatePassword: true });
        } else if (this.state.updatePassword === true) {
            this.setState({ updatePassword: false });
        }
    }

    _handleOnEyePress() {
        this.setState({
            isPassword: !this.state.isPassword,
        });
    }

    async onGoogleSignin({ type }) {
        if (this.state.signIn === false) {
            this.setState({
                loading: false,
                code: '',
                marginLeft: scale.w(100),
                modalVisible: false,
                email: '',
                signIn: true,
                password: '',
                type: '',
                newAuthScreen: true,
                forgetPassword: false,
                updatePassword: false,
                sendOTP: false,
                isPassword: true,
                scanEnable: false,
                text: '',
                dataFromQR: '',
                One_second_in_MS: 1000,
                googleSign: false,
                fullName: '',
                otpCode: 0,
                newPassword: '',
                reEnterNewPassword: '',
                reference: '',
                selectedItem: {
                    name: 'Select Hotel',
                },
            });
            return 0;
        }
        if (this.state.selectedItem?.name == 'Select Hotel') {
            toast('Attention, Please Select Hotel');
            return 0;
        }

        try {
            this.setState({
                googleSign: true,
                email: '',
                password: '',
            });
            var userInfo = {};
            if (type === 'google') {
                await GoogleSignin.hasPlayServices({
                    // Check if device has Google Play Services installed
                    // Always resolves to true on iOS
                    showPlayServicesUpdateDialog: true,
                });
                userInfo = await GoogleSignin.signIn();
            } else {
                const appleAuthRequestResponse = await appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
                });

                // Ensure Apple returned a user identityToken
                if (!appleAuthRequestResponse.identityToken) {
                    throw 'Apple Sign-In failed - no identify token returned';
                }
                const { email, email_verified, is_private_email, sub } = jwt_decode(
                    appleAuthRequestResponse.identityToken,
                );
                userInfo = {
                    user: {
                        email: email,
                        photo: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                        name: appleAuthRequestResponse.fullName?.givenName
                            ? appleAuthRequestResponse.fullName?.givenName +
                            ' ' +
                            appleAuthRequestResponse.fullName?.familyName
                            : email?.split('@')[0],
                    },
                };
            }

            console.log('User Info --> ', userInfo);
            this.props.userGoogleLogin(
                {
                    full_name: userInfo.user.name,
                    profile_image: userInfo.user.photo,
                    email: userInfo.user.email,
                    hotel_code: this.state.selectedItem?.code,
                },
                () => {
                    console.log('this.props.hotel_Code', this.props.hotel_Code);
                    this.setState({
                        googleSign: false,
                    });
                    // if (this.props.hotel_Code) {
                    //     this._handleContinue()
                    // }
                    // else {
                    setTimeout(() => {
                        console.log(
                            'token is here on pick hotel        ',
                            this.props.token,
                            '       ',
                            this.props.account,
                        );
                        AsyncStorage.setItem('loginType', 'google');
                        AsyncStorage.setItem('token', this.props.token);
                        if (userInfo) {
                            AsyncStorage.setItem(
                                'full_name',
                                userInfo?.user.name ? userInfo?.user.name : 'null',
                            );
                            AsyncStorage.setItem(
                                'profile_Image',
                                userInfo?.user.photo ? userInfo?.user.photo : 'null',
                            );
                            AsyncStorage.setItem(
                                'email',
                                userInfo?.user.email ? userInfo?.user.email : 'null',
                            );
                        }
                        Navigation.setRoot({
                            root: {
                                bottomTabs: {
                                    children: [
                                        {
                                            stack: {
                                                id: 'MAIN_MENU_TAB',
                                                children: [
                                                    {
                                                        component: {
                                                            id: 'mainmenu',
                                                            name: 'MainMenu',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            stack: {
                                                id: 'CHAT_TAB',
                                                children: [
                                                    {
                                                        component: {
                                                            id: 'chat',
                                                            name: 'Chat',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            stack: {
                                                id: 'LOST_AND_FOUND_TAB',
                                                children: [
                                                    {
                                                        component: {
                                                            id: 'lostAndFound',
                                                            name: 'LostAndFound',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            stack: {
                                                id: 'PROFILE_TAB',
                                                children: [
                                                    {
                                                        component: {
                                                            id: 'profile',
                                                            name: 'Profile',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                    options: {
                                        bottomTabs: {
                                            visible: false,
                                        },
                                    },
                                },
                            },
                        });
                    }, 2000);
                    // }
                },
                () => {
                    this.setState({
                        googleSign: false,
                    });
                    toast('Warning!, Something went wrong please try again');
                },
            );
        } catch (error) {
            console.log('Message', JSON.stringify(error));
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                this.setState({
                    googleSign: false,
                });
                cosnole.log('User Cancelled Google SignIn');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Signing In');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play Services Not Available or Outdated');
                this.setState({
                    googleSign: false,
                });
            } else {
                toast(error.message);
                this.setState({
                    googleSign: false,
                });
            }
        }
    }

    async onGoogleLogoout() {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.setState({
                googleSign: false,
            });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        console.log(this.props);
        console.log('password     ffddddddddddd', this.state.password);
        if (this.state.newAuthScreen) {
            return (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                    <ImageBackground
                        resizeMode={'cover'}
                        source={{
                            uri: this.state.signIn
                                ? this.props.chainData.data.signin_bg
                                : this.props.chainData.data.signup_bg,
                        }}
                        //source={require('../../images/splashBG.png')}
                        style={{
                            height: heightPercentageToDP(100),
                            flex: 1,
                            width: widthPercentageToDP(100),
                            position: 'absolute',
                        }}
                    />
                    <ScrollView keyboardShouldPersistTaps={true}>
                        <StatusBar
                            backgroundColor={
                                this.state.QRCODEStatus ? '#4B4B4B' : 'this.props.chainData.data.login_color'
                            }
                        ></StatusBar>

                        <CustomModal
                            ref={this._modalQRScan}
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <View
                                style={{ height: heightPercentageToDP(100), width: widthPercentageToDP(100) }}
                            >
                                <QRScannerView
                                    onScanResult={this.onSuccess}
                                    renderHeaderView={() => (
                                        <View
                                            style={{
                                                height: heightPercentageToDP(10),
                                                marginTop: heightPercentageToDP(3),
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Navbar
                                                tintBackColor={'white'}
                                                titleColor={'white'}
                                                onClick={() => {
                                                    this._modalQRScan.current?.hide();
                                                    this.setState({
                                                        QRCODEStatus: false,
                                                    });
                                                }}
                                                title={this.props.selectedLanguage.scan_qr_code}
                                            />
                                        </View>
                                    )}
                                    reactivate={true}
                                    reactivateTimeout={5000}
                                    maskColor={'#4B4B4B'}
                                    rectStyle={{
                                        height: heightPercentageToDP(35),
                                        width: widthPercentageToDP(65),
                                        marginTop: -170,
                                    }}
                                    cornerStyle={{ borderColor: colors.BLUE, borderWidth: 3 }}
                                    // scanBarStyle={{backgroundColor : '#5AB9EA'}}
                                    scanBarAnimateReverse={true}
                                    hintText={''}
                                    renderFooterView={() => (
                                        <View
                                            style={{
                                                heigth: heightPercentageToDP(30),
                                                width: widthPercentageToDP(100),
                                                borderTopLeftRadius: 30,
                                                borderTopRightRadius: 30,
                                                backgroundColor: colors.WHITE,
                                                paddingHorizontal: widthPercentageToDP(5),
                                                paddingVertical: heightPercentageToDP(4),
                                            }}
                                        >
                                            <Text style={{ fontSize: scale.w(1.65), fontWeight: 'bold' }}>
                                                Scan Hotel QR Code
                                            </Text>
                                            <View style={{ height: heightPercentageToDP(1.3) }} />
                                            <Text style={{ fontSize: scale.w(1.4), opacity: 0.8 }}>
                                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                                                diam nonumy eirmod tempor invidunt ut labore et
                                            </Text>
                                            <View style={{ height: heightPercentageToDP(2) }} />

                                            <TouchableOpacity
                                                onPress={this.onScanButton}
                                                style={{
                                                    height: widthPercentageToDP(12),
                                                    width: widthPercentageToDP(12),
                                                    borderRadius: widthPercentageToDP(12) / 2,
                                                    backgroundColor: colors.BLUE,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    alignSelf: 'center',
                                                }}
                                            >
                                                <MaterialCommunityIcons
                                                    name={'scan-helper'}
                                                    color={colors.WHITE}
                                                    size={20}
                                                ></MaterialCommunityIcons>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            </View>
                        </CustomModal>
                        <View
                            resizeMode={'cover'}
                            source={{
                                uri: this.state.signIn
                                    ? this.props.chainData.data.signin_bg
                                    : this.props.chainData.data.signup_bg,
                            }}
                            //source={require('../../images/splashBG.png')}
                            style={{
                                height:
                                    Platform.OS == 'android'
                                        ? StatusBar.currentHeight > 24
                                            ? Dimensions.get('window').height
                                            : Dimensions.get('window').height - StatusBar.currentHeight
                                        : Dimensions.get('screen').height,
                                width: widthPercentageToDP(100),
                                justifyContent: 'flex-end',
                                paddingHorizontal: widthPercentageToDP(5),
                                ...ifIphoneX(
                                    {
                                        paddingVertical: heightPercentageToDP(4),
                                    },
                                    {
                                        paddingTop: 0,
                                    },
                                ),
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    paddingTop: heightPercentageToDP(16),
                                    paddingBottom: heightPercentageToDP(2),
                                }}
                            >
                                <Text
                                    style={{
                                        // fontSize: this.state.sWordStyle,
                                        color: colors.WHITE,
                                        fontFamily: 'Harabara',
                                        fontSize: scale.w(8.5),
                                        letterSpacing: widthPercentageToDP(0.3),
                                        // paddingHorizontal: widthPercentageToDP(0.3),
                                    }}
                                >
                                    {this.props.chainData.data.name}
                                </Text>
                            </View>
                            <View
                                style={{
                                    height: this.state.forgetPassword
                                        ? heightPercentageToDP(24.3)
                                        : heightPercentageToDP(3.15),
                                }}
                            ></View>
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    borderTopLeftRadius: widthPercentageToDP(10),
                                    borderTopRightRadius: widthPercentageToDP(10),
                                    paddingHorizontal: widthPercentageToDP(5),
                                    paddingVertical: heightPercentageToDP(2),
                                    paddingBottom: heightPercentageToDP(3.8),
                                }}
                            >
                                {this.state.forgetPassword === true ? (
                                    <>
                                        <View
                                            style={{
                                                paddingTop: heightPercentageToDP(1.4),
                                                paddingBottom: heightPercentageToDP(0.4),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Bold',
                                                    fontSize: scale.w(2.5),
                                                    color: colors.SignInUsingColor,
                                                    paddingHorizontal: widthPercentageToDP(2),
                                                    // color:
                                                    //     this.state.signIn === true ? colors.GREY : colors.BLACK,
                                                }}
                                            >
                                                {this.props.selectedLanguage.forgot_password}
                                            </Text>
                                        </View>
                                    </>
                                ) : this.state.updatePassword === true ? (
                                    <>
                                        <View
                                            style={{
                                                paddingTop: heightPercentageToDP(1.4),
                                                paddingBottom: heightPercentageToDP(0.4),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Bold',
                                                    fontSize: scale.w(2.5),
                                                    color: colors.SignInUsingColor,
                                                    paddingHorizontal: widthPercentageToDP(2),
                                                    // color:
                                                    //     this.state.signIn === true ? colors.GREY : colors.BLACK,
                                                }}
                                            >
                                                {this.props.selectedLanguage.update_password}
                                            </Text>
                                        </View>
                                    </>
                                ) : this.state.sendOTP === true ? (
                                    <View
                                        style={{
                                            paddingTop: heightPercentageToDP(1.4),
                                            paddingBottom: heightPercentageToDP(0.4),
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto-Bold',
                                                fontSize: scale.w(2.6),
                                                color: colors.SignInUsingColor,
                                                paddingHorizontal: widthPercentageToDP(2),

                                                // color:
                                                //     this.state.signIn === true ? colors.GREY : colors.BLACK,
                                            }}
                                        >
                                            {this.props.selectedLanguage.enter_otp}
                                        </Text>
                                    </View>
                                ) : (
                                    <View
                                        style={{
                                            //  margin: 20,
                                            justifyContent: 'space-around',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Pressable
                                            onPress={() => {
                                                this.setState({
                                                    loading: false,
                                                    code: '',
                                                    marginLeft: scale.w(100),
                                                    modalVisible: false,
                                                    email: '',
                                                    signIn: true,
                                                    password: '',
                                                    type: '',
                                                    newAuthScreen: true,
                                                    forgetPassword: false,
                                                    updatePassword: false,
                                                    sendOTP: false,
                                                    isPassword: true,
                                                    scanEnable: false,
                                                    text: '',
                                                    dataFromQR: '',
                                                    One_second_in_MS: 1000,
                                                    googleSign: false,
                                                    fullName: '',
                                                    otpCode: 0,
                                                    newPassword: '',
                                                    reEnterNewPassword: '',
                                                    reference: '',
                                                    selectedItem: {
                                                        name: 'Select Hotel',
                                                    },
                                                });
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Bold',
                                                    fontSize: scale.w(2.7),
                                                    color: colors.SignInUsingColor,
                                                    opacity: this.state.signIn === true ? 1 : 0.43,

                                                    // color:
                                                    //     this.state.signIn === true ? colors.GREY : colors.BLACK,
                                                }}
                                            >
                                                {this.props.selectedLanguage.sign_in}
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => {
                                                this.setState({
                                                    loading: false,
                                                    code: '',
                                                    marginLeft: scale.w(100),
                                                    modalVisible: false,
                                                    email: '',
                                                    signIn: false,
                                                    password: '',
                                                    type: '',
                                                    newAuthScreen: true,
                                                    forgetPassword: false,
                                                    updatePassword: false,
                                                    sendOTP: false,
                                                    isPassword: true,
                                                    scanEnable: false,
                                                    text: '',
                                                    dataFromQR: '',
                                                    One_second_in_MS: 1000,
                                                    googleSign: false,
                                                    fullName: '',
                                                    otpCode: 0,
                                                    newPassword: '',
                                                    reEnterNewPassword: '',
                                                    reference: '',
                                                    selectedItem: {
                                                        name: this.props.selectedLanguage.select_hotel,
                                                    },
                                                });
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Bold',
                                                    fontSize: scale.w(2.4),
                                                    color: colors.SignInUsingColor,
                                                    opacity: this.state.signIn === true ? 0.43 : 1,

                                                    // color:
                                                    //     this.state.signIn === true ? colors.GREY : colors.BLACK,
                                                }}
                                            >
                                                {this.props.selectedLanguage.sign_up}
                                            </Text>
                                        </Pressable>
                                    </View>
                                )}
                                <View style={{ height: heightPercentageToDP(2.5) }}></View>
                                {this.state.signIn === false ? (
                                    <View>
                                        <Field
                                            title={this.props.selectedLanguage.user_name}
                                            placeholder={this.props.selectedLanguage.enter_your_full_name}
                                            IsPassword={false}
                                            color={colors.BLUE}
                                            value={this.state.fullName}
                                            autofocus={true}
                                            onChangeText={(value) => {
                                                if (value.length > 0) {
                                                    this.setState({
                                                        nameValid: true,
                                                    });
                                                } else
                                                    this.setState({
                                                        nameValid: false,
                                                    });
                                                this.setState({
                                                    fullName: value,
                                                });
                                            }}
                                            showCheck={this.state.nameValid}
                                        ></Field>
                                        <View style={{ height: heightPercentageToDP(1) }}></View>
                                    </View>
                                ) : (
                                    <>
                                        {this.props.hotels &&
                                            this.props.hotels?.length > 0 &&
                                            this.state.forgetPassword != true &&
                                            this.state.sendOTP != true &&
                                            this.state.updatePassword != true ? (
                                            <SearchableDropdown
                                                onItemSelect={(item: any) => {
                                                    this.setState({
                                                        selectedItem: item,
                                                    });
                                                }}
                                                itemStyle={{
                                                    marginTop: 2,
                                                    borderColor: '#bbb',
                                                    borderBottomWidth: 1.2,
                                                    borderRadius: 8,
                                                    borderBottomColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                                    height: heightPercentageToDP(6.5),
                                                    justifyContent: 'center',
                                                    paddingHorizontal: 10,
                                                }}
                                                itemTextStyle={{ color: colors.AuthPlaceHolderColor }}
                                                itemsContainerStyle={{
                                                    maxHeight: heightPercentageToDP(15),
                                                    backgroundColor: '#fff',
                                                    position: 'absolute',
                                                    zIndex: 10000,
                                                    width: '100%',
                                                    alignSelf: 'center',
                                                    marginTop: heightPercentageToDP(6.2),
                                                }}
                                                items={this.props.hotels}
                                                textInputProps={{
                                                    placeholder: this.state.selectedItem?.name,
                                                    underlineColorAndroid: 'transparent',
                                                    // autoFocus: true,
                                                    style: {
                                                        padding: 12,
                                                        paddingHorizontal: widthPercentageToDP(5),
                                                        borderWidth: 1.4,
                                                        borderColor: 'rgba(103,114,148,0.115)',
                                                        borderRadius: scale.w(1.3),
                                                        color: colors.AuthPlaceHolderColor,
                                                        fontFamily: 'Roboto-Light',
                                                        fontSize: scale.w(1.6),
                                                    },
                                                    placeholderTextColor:
                                                        this.state.selectedItem?.name ==
                                                            this.props.selectedLanguage.select_hotel
                                                            ? colors.AuthPlaceHolderColor
                                                            : colors.AuthPlaceHolderColor,
                                                }}
                                                listProps={{
                                                    nestedScrollEnabled: true,
                                                }}
                                            />
                                        ) : null}
                                        <View style={{ height: heightPercentageToDP(1) }}></View>
                                    </>
                                )}

                                {this.state.updatePassword === true ? null : this.state.sendOTP === true ? (
                                    <Field
                                        //  placeholder={'OTP'}
                                        IsPassword={false}
                                        color={colors.BLUE}
                                        value={this.state.otpCode}
                                        letterSpacing={true}
                                        //    autofocus={this.state.signIn === true ? true : false}
                                        onChangeText={(value) => {
                                            this.setState({
                                                otpCode: value,
                                            });
                                        }}
                                        showCheck={this.state.otpCode.length > 0 ? true : false}
                                    ></Field>
                                ) : this.state.forgetPassword === true ||
                                    this.state.signIn === true ||
                                    this.state.signIn === false ? (
                                    <View style={{ zIndex: -1 }}>
                                        <Field
                                            placeholder={this.props.selectedLanguage.enter_your_email}
                                            IsPassword={false}
                                            color={colors.BLUE}
                                            value={this.state.email}
                                            //    autofocus={this.state.signIn === true ? true : false}
                                            onChangeText={(value) => {
                                                if (validateEmail(value)) {
                                                    this.setState({
                                                        emailValid: true,
                                                    });
                                                } else {
                                                    this.setState({
                                                        emailValid: false,
                                                    });
                                                }
                                                this.setState({
                                                    email: value,
                                                });
                                            }}
                                            showCheck={this.state.emailValid}
                                        ></Field>
                                    </View>
                                ) : null}
                                <View style={{ height: heightPercentageToDP(1) }}></View>
                                {this.state.forgetPassword === true ? null : this.state.sendOTP ===
                                    true ? null : this.state.updatePassword === true ? (
                                        <View>
                                            <Field
                                                title={'Password'}
                                                placeholder={this.props.selectedLanguage.enter_your_password}
                                                onEyePress={this._handleOnEyePress}
                                                IsPassword={true}
                                                secureText={this.state.isPassword}
                                                color={colors.BLUE}
                                                value={this.state.newPassword}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        newPassword: value,
                                                    });
                                                }}
                                            ></Field>
                                            <View style={{ height: heightPercentageToDP(2) }}></View>
                                            <Field
                                                title={'Password'}
                                                onEyePress={this._handleOnEyePress}
                                                IsPassword={true}
                                                secureText={this.state.isPassword}
                                                value={this.state.reEnterNewPassword}
                                                placeholder={this.props.selectedLanguage.re_enter_your_password}
                                                color={colors.BLUE}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        reEnterNewPassword: value,
                                                    });
                                                }}
                                            ></Field>
                                        </View>
                                    ) : (
                                    <View style={{ zIndex: -1 }}>
                                        <Field
                                            title={'Password'}
                                            placeholder={this.props.selectedLanguage.enter_your_password}
                                            color={colors.BLUE}
                                            onEyePress={this._handleOnEyePress}
                                            IsPassword={true}
                                            value={this.state.password}
                                            secureText={this.state.isPassword}
                                            onChangeText={(value) => {
                                                this.setState({
                                                    password: value,
                                                });
                                            }}
                                        ></Field>
                                    </View>
                                )}
                                <View style={{ height: heightPercentageToDP(1) }}></View>

                                {this.state.forgetPassword === false &&
                                    this.state.sendOTP === false &&
                                    this.state.signIn &&
                                    this.state.updatePassword === false ? (
                                    <Pressable
                                        style={{ alignItems: 'flex-end' }}
                                        onPress={() => {
                                            this.setState({
                                                loading: false,
                                                code: '',
                                                marginLeft: scale.w(100),
                                                modalVisible: false,
                                                email: '',
                                                signIn: true,
                                                password: '',
                                                type: '',
                                                newAuthScreen: true,
                                                forgetPassword: true,
                                                updatePassword: false,
                                                sendOTP: false,
                                                isPassword: true,
                                                scanEnable: false,
                                                text: '',
                                                dataFromQR: '',
                                                One_second_in_MS: 1000,
                                                googleSign: false,
                                                fullName: '',
                                                otpCode: 0,
                                                newPassword: '',
                                                reEnterNewPassword: '',
                                                reference: '',
                                                selectedItem: {
                                                    name: this.props.selectedLanguage.select_hotel,
                                                },
                                                screenIncrement: 1,
                                            });
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto-Regular',
                                                fontSize: scale.w(1.6),
                                                color: colors.BLUE,
                                                paddingBottom: heightPercentageToDP(1),
                                            }}
                                        >
                                            {this.props.selectedLanguage.forgot_password + ' ?'}
                                        </Text>
                                    </Pressable>
                                ) : null}

                                <View style={{ height: heightPercentageToDP(1.5) }}></View>
                                {this.state.forgetPassword || this.state.sendOTP === true ? (
                                    <ButtonPrimary
                                        onPress={() => {
                                            // if (this.state.selectedItem?.name == 'Select Hotel') {
                                            //     this.setState({
                                            //         loading: false,
                                            //     });
                                            //     toast('Attention, Please Select Hotel');
                                            //     return 0;
                                            // }
                                            if (this.state.sendOTP == false) {
                                                if (this.state.email == '') {
                                                    toast(
                                                        this.props.selectedLanguage.please_enter_your_email,
                                                    );
                                                }
                                                if (validateEmail(this.state.email) != true) {
                                                    this.setState({
                                                        loading: false,
                                                    });
                                                    toast(
                                                        this.props.selectedLanguage
                                                            .please_enter_a_valid_email,
                                                    );
                                                    return 0;
                                                } else {
                                                    this.setState({
                                                        loading: true,
                                                    });
                                                    this.props.forgotPasswordRequest(
                                                        {
                                                            email: this.state.email,
                                                        },
                                                        () => {
                                                            this.setState({
                                                                forgetPassword: false,
                                                                sendOTP: true,
                                                                loading: false,
                                                                screenIncrement: 1,
                                                            });
                                                            // this.setState({ sendOTP: true });
                                                        },
                                                        () => {
                                                            this.setState({ loading: false });
                                                        },
                                                    );
                                                }
                                            } else {
                                                console.log(this.props.verificationCode);
                                                if (this.state.otpCode == 0) {
                                                    toast(
                                                        this.props.selectedLanguage
                                                            .please_enter_your_verification_code_that_is_sent_to_your_email,
                                                    );
                                                } else if (
                                                    this.state.otpCode == this.props.verificationCode
                                                ) {
                                                    this.setState({
                                                        sendOTP: false,
                                                        updatePassword: true,
                                                        screenIncrement: 1,
                                                    });
                                                } else {
                                                    this.setState({
                                                        OTPAttemptCount: this.state.OTPAttemptCount + 1,
                                                    });
                                                    if (this.state.OTPAttemptCount >= 3) {
                                                        toast(
                                                            this.props.selectedLanguage
                                                                .you_entered_wrong_otp_code,
                                                        );
                                                        this.setState({
                                                            sendOTP: false,
                                                            updatePassword: false,
                                                            signIn: true,
                                                            email: '',
                                                        });
                                                    } else {
                                                        toast(
                                                            this.props.selectedLanguage
                                                                .please_enter_valid_verification_code_that_is_sent_to_your_email,
                                                        );
                                                    }
                                                }
                                            }
                                        }}
                                        backgroundColor={colors.BLUE}
                                        text={'Reset Password'}
                                        loading={this.state.loading}
                                        disabled={this.state.loading}
                                        fontSize={scale.w(2.0)}
                                        fontWeight={'bold'}
                                        chainData={this.props.chainData}
                                    />
                                ) : this.state.updatePassword === true ? (
                                    <ButtonPrimary
                                        onPress={() => {
                                            if (
                                                this.state.newPassword == null ||
                                                this.state.newPassword.length < 6
                                            ) {
                                                toast(
                                                    this.props.selectedLanguage.enter_new_password_min_6_char,
                                                );
                                                this.setState({ loading: false });
                                            } else if (
                                                this.state.reEnterNewPassword == null ||
                                                this.state.reEnterNewPassword.length < 6
                                            ) {
                                                toast(
                                                    this.props.selectedLanguage
                                                        .confirm_new_password_min_6_char,
                                                );
                                                this.setState({ loading: false });
                                            } else if (
                                                this.state.newPassword != this.state.reEnterNewPassword
                                            ) {
                                                toast(
                                                    this.props.selectedLanguage
                                                        .new_password_and_confirm_password_does_not_match,
                                                );
                                                this.setState({ loading: false });
                                            } else {
                                                this.setState({
                                                    loading: true,
                                                    screenIncrement: 3,
                                                });
                                                this.props.updatePasswordRequest(
                                                    {
                                                        email: this.state.email,
                                                        password: this.state.newPassword,
                                                    },
                                                    () => {
                                                        toast(
                                                            this.props.selectedLanguage
                                                                .you_have_updated_the_password_successfully,
                                                        );
                                                        this.setState({
                                                            loading: false,
                                                            updatePassword: false,
                                                            screenIncrement: 0,
                                                        });
                                                    },
                                                    () => {
                                                        this.setState({ loading: false });
                                                    },
                                                );
                                            }
                                        }}
                                        backgroundColor={colors.BLUE}
                                        text={this.props.selectedLanguage.update_password}
                                        loading={this.state.loading}
                                        disabled={this.state.loading}
                                        fontSize={scale.w(2.0)}
                                        fontWeight={'bold'}
                                        chainData={this.props.chainData}
                                    />
                                ) : this.state.signIn == true ? (
                                    <ButtonPrimary
                                        onPress={() => {
                                            if (
                                                this.state.selectedItem?.name ==
                                                this.props.selectedLanguage.select_hotel
                                            ) {
                                                this.setState({
                                                    loading: false,
                                                });
                                                toast(this.props.selectedLanguage.please_select_hotel);
                                                return 0;
                                            }
                                            if (this.state.email.length == 0) {
                                                this.setState({
                                                    loading: false,
                                                });
                                                toast(this.props.selectedLanguage.please_enter_your_email);
                                                return 0;
                                            }
                                            if (validateEmail(this.state.email) != true) {
                                                this.setState({
                                                    loading: false,
                                                });
                                                toast(this.props.selectedLanguage.please_enter_a_valid_email);
                                                return 0;
                                            }
                                            if (this.state.password.length == 0) {
                                                this.setState({
                                                    loading: false,
                                                });
                                                toast(this.props.selectedLanguage.please_enter_your_password);
                                                return 0;
                                            }
                                            this.setState({
                                                loading: true,
                                            });
                                            this.props.userLogin(
                                                {
                                                    email: this.state.email,
                                                    password: this.state.password,
                                                    hotel_code: this.state.selectedItem?.code,
                                                },
                                                () => {
                                                    setTimeout(() => {
                                                        Navigation.setRoot({
                                                            root: {
                                                                bottomTabs: {
                                                                    children: [
                                                                        {
                                                                            stack: {
                                                                                id: 'MAIN_MENU_TAB',
                                                                                children: [
                                                                                    {
                                                                                        component: {
                                                                                            id: 'mainmenu',
                                                                                            name: 'MainMenu',
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        },
                                                                        {
                                                                            stack: {
                                                                                id: 'CHAT_TAB',
                                                                                children: [
                                                                                    {
                                                                                        component: {
                                                                                            id: 'chat',
                                                                                            name: 'Chat',
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        },
                                                                        {
                                                                            stack: {
                                                                                id: 'LOST_AND_FOUND_TAB',
                                                                                children: [
                                                                                    {
                                                                                        component: {
                                                                                            id: 'lostAndFound',
                                                                                            name: 'LostAndFound',
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        },
                                                                        {
                                                                            stack: {
                                                                                id: 'PROFILE_TAB',
                                                                                children: [
                                                                                    {
                                                                                        component: {
                                                                                            id: 'profile',
                                                                                            name: 'Profile',
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        },
                                                                    ],
                                                                    options: {
                                                                        bottomTabs: {
                                                                            visible: false,
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        });
                                                    }, 3000);
                                                    // Alert.alert("Success!", "Login Success")
                                                },
                                                (data) => {
                                                    if (data?.is_verified == 0) {
                                                        this.props.sendVerificationLink({
                                                            email: data?.email,
                                                        });
                                                    }
                                                    this.setState({
                                                        loading: false,
                                                    });
                                                    // toast(this.props.selectedLanguage.login_failed);
                                                },
                                            );
                                            // Navigation.setRoot({ root : mainmenu })
                                        }}
                                        backgroundColor={this.props.chainData.data.login_color}
                                        text={'Sign In'}
                                        loading={this.state.loading}
                                        disabled={this.state.loading}
                                        fontSize={scale.w(2.0)}
                                        fontWeight={'bold'}
                                        chainData={this.props.chainData}
                                    />
                                ) : (
                                    <ButtonPrimary
                                        onPress={() => {
                                            if (this.state.fullName.length < 2) {
                                                toast(
                                                    this.props.selectedLanguage.please_enter_your_full_name,
                                                );
                                                return 0;
                                            }
                                            if (this.state.email.length == 0) {
                                                toast(this.props.selectedLanguage.please_enter_your_email);
                                                return 0;
                                            }
                                            if (validateEmail(this.state.email) != true) {
                                                this.setState({
                                                    loading: false,
                                                });
                                                toast(this.props.selectedLanguage.please_enter_a_valid_email);
                                                return 0;
                                            }
                                            if (this.state.password.length == 0) {
                                                toast(this.props.selectedLanguage.please_enter_your_password);
                                                return 0;
                                            }
                                            this.setState({
                                                loading: true,
                                            });
                                            this.props.signup(
                                                {
                                                    full_name: this.state.fullName,
                                                    email: this.state.email,
                                                    password: this.state.password,
                                                },
                                                () => {
                                                    this.setState({
                                                        loading: false,
                                                        signIn: true,
                                                    });
                                                },
                                                () => {
                                                    this.setState({
                                                        loading: false,
                                                    });
                                                },
                                            );
                                        }}
                                        backgroundColor={colors.BLUE}
                                        text={this.props.selectedLanguage.sign_up}
                                        loading={this.state.loading}
                                        disabled={this.state.loading}
                                        fontSize={scale.w(2.0)}
                                        fontWeight={'bold'}
                                        chainData={this.props.chainData}
                                    />
                                )}
                                <View style={{ height: heightPercentageToDP(2.5) }}></View>
                                {this.state.forgetPassword === false &&
                                    this.state.sendOTP === false &&
                                    this.state.updatePassword === false ? (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto-Regular',
                                                fontSize: scale.w(1.8),
                                                color: colors.SignInUsingColor,
                                            }}
                                        >
                                            {this.props.selectedLanguage.sign_in_using}
                                        </Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                disabled={this.state.loading}
                                                onPress={() => {
                                                    if (Platform.OS == 'android')
                                                        this.requestCameraPermission();
                                                    else {
                                                        this._modalQRScan.current?.show();
                                                        this.setState({
                                                            QRCODEStatus: true,
                                                        });
                                                    }
                                                }}
                                                style={{
                                                    justifyContent: 'center',
                                                    width: scale.w(4.5),
                                                    alignItems: 'center',
                                                    height: scale.w(4.5),
                                                    borderRadius: scale.w(4.5) / 2,
                                                    backgroundColor: '#5AB9EA',
                                                    marginRight: widthPercentageToDP(1.5),
                                                    // position: 'absolute',
                                                    //bottom: 7,
                                                }}
                                            >
                                                <Ionicons name="scan" size={scale.w(2.5)} color="#fff" />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                disabled={this.state.loading}
                                                style={{
                                                    justifyContent: 'center',
                                                    width: scale.w(4.5),
                                                    alignItems: 'center',
                                                    height: scale.w(4.5),
                                                    borderRadius: scale.w(4.5) / 2,
                                                    backgroundColor: '#FB2238',
                                                    marginRight: widthPercentageToDP(1.5),
                                                    // position: 'absolute',
                                                    //bottom: 7,
                                                }}
                                                onPress={() => this.onGoogleSignin({ type: 'google' })}
                                            >
                                                {this.state.googleSign ? (
                                                    <ActivityIndicator
                                                        size={scale.w(2)}
                                                        color={colors.WHITE}
                                                    />
                                                ) : (
                                                    <MaterialCommunityIcons
                                                        name="google"
                                                        size={scale.w(2.5)}
                                                        color="#fff"
                                                    />
                                                )}
                                            </TouchableOpacity>
                                            {Platform.OS === 'ios' && (
                                                <TouchableOpacity
                                                    disabled={this.state.loading}
                                                    style={{
                                                        justifyContent: 'center',
                                                        width: scale.w(4.5),
                                                        alignItems: 'center',
                                                        height: scale.w(4.5),
                                                        borderRadius: scale.w(4.5) / 2,
                                                        backgroundColor: 'black',
                                                        // position: 'absolute',
                                                        //bottom: 7,
                                                    }}
                                                    onPress={() => this.onGoogleSignin({ type: 'apple' })}
                                                >
                                                    {this.state.googleSign ? (
                                                        <ActivityIndicator
                                                            size={scale.w(2)}
                                                            color={colors.WHITE}
                                                        />
                                                    ) : (
                                                        <Ionicons
                                                            name="ios-logo-apple"
                                                            size={scale.w(2.8)}
                                                            color="#fff"
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </ScrollView>
                    {this.state.forgetPassword || this.state.sendOTP || this.state.updatePassword ? (
                        <View style={{ position: 'absolute' }}>
                            <Navbar
                                RightIconColor={colors.WHITE}
                                RightIconName={'search'}
                                tintBackColor={colors.WHITE}
                                titleColor={colors.WHITE}
                                onClick={() => this.handleBackButton()}
                                title={''}
                            />
                        </View>
                    ) : null}
                </KeyboardAvoidingView>
            );
        } else
            return (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
                    <Modal
                        visible={this.state.modalVisible}
                        style={{
                            width: '100%',
                            marginLeft: -1,
                            paddingVertical: 20,
                            marginBottom: -1,
                            height: '100%',
                        }}
                        transparent={true}
                        animationType="slide"
                    >
                        <View style={{ height: '100%', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                            <View style={{ height: '45%' }}></View>
                            <View
                                style={{
                                    height: '55%',
                                    backgroundColor: '#fff',
                                    borderTopLeftRadius: widthPercentageToDP(5),
                                    borderTopRightRadius: widthPercentageToDP(5),
                                    paddingHorizontal: widthPercentageToDP(5),
                                }}
                            >
                                <ScrollView>
                                    <View style={{ height: heightPercentageToDP(8) }}></View>
                                    <Field
                                        title={'Email'}
                                        placeholder={this.props.selectedLanguage.enter_your_email}
                                        color={colors.BLUE}
                                        value={this.state.email}
                                        onChangeText={(value) => {
                                            this.setState({
                                                email: value,
                                            });
                                        }}
                                        showCheck={this.state.emailValid}
                                    ></Field>
                                    <View style={{ height: heightPercentageToDP(4) }}></View>
                                    <Field
                                        title={'Password'}
                                        placeholder={this.props.selectedLanguage.enter_your_password}
                                        color={colors.BLUE}
                                        onChangeText={(value) => {
                                            this.setState({
                                                password: value,
                                            });
                                        }}
                                    ></Field>
                                    <View style={{ height: heightPercentageToDP(7) }}></View>
                                    <ButtonPrimary
                                        onPress={async () => {
                                            if (
                                                this.state.selectedItem?.name ==
                                                this.props.selectedLanguage.select_hotel
                                            ) {
                                                this.setState({
                                                    loading: false,
                                                });
                                                toast(this.props.selectedLanguage.please_select_hotel);
                                                return 0;
                                            }
                                            if (this.state.email.length == 0) {
                                                this.setState({
                                                    loading: false,
                                                });
                                                toast(this.props.selectedLanguage.please_enter_your_email);
                                                return 0;
                                            }
                                            if (this.state.password.length == 0) {
                                                this.setState({
                                                    loading: false,
                                                });
                                                toast(this.props.selectedLanguage.please_enter_your_password);
                                                return 0;
                                            }

                                            await this.setState({
                                                loading: true,
                                            });
                                            this.props.alreadyCheckedIn(
                                                {
                                                    email: this.state.email,
                                                    password: this.state.password,
                                                    hotel_code: this.state.selectedItem?.code,
                                                },
                                                () => {
                                                    this.setModalVisible(false);
                                                    setTimeout(() => {
                                                        Navigation.setRoot({
                                                            root: {
                                                                bottomTabs: {
                                                                    children: [
                                                                        {
                                                                            stack: {
                                                                                id: 'MAIN_MENU_TAB',
                                                                                children: [
                                                                                    {
                                                                                        component: {
                                                                                            id: 'mainmenu',
                                                                                            name: 'MainMenu',
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        },
                                                                        {
                                                                            stack: {
                                                                                id: 'CHAT_TAB',
                                                                                children: [
                                                                                    {
                                                                                        component: {
                                                                                            id: 'chat',
                                                                                            name: 'Chat',
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        },
                                                                        {
                                                                            stack: {
                                                                                id: 'LOST_AND_FOUND_TAB',
                                                                                children: [
                                                                                    {
                                                                                        component: {
                                                                                            id: 'lostAndFound',
                                                                                            name: 'LostAndFound',
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        },
                                                                        {
                                                                            stack: {
                                                                                id: 'PROFILE_TAB',
                                                                                children: [
                                                                                    {
                                                                                        component: {
                                                                                            id: 'profile',
                                                                                            name: 'Profile',
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        },
                                                                    ],
                                                                    options: {
                                                                        bottomTabs: {
                                                                            visible: false,
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        });
                                                        this.setState({
                                                            loading: false,
                                                        });
                                                    }, 500);
                                                },
                                                () => {
                                                    this.setState({
                                                        loading: false,
                                                    });
                                                },
                                            );
                                        }}
                                        backgroundColor={colors.BLUE}
                                        text="Sign In"
                                        loading={this.state.loading}
                                        disabled={this.state.loading}
                                        chainData={this.props.chainData}
                                    />
                                    <View style={{ height: heightPercentageToDP(3) }}></View>
                                </ScrollView>
                            </View>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                height: '100%',
                                alignSelf: 'flex-start',
                                paddingHorizontal: widthPercentageToDP(1.2),
                                paddingVertical: heightPercentageToDP(3),
                            }}
                        >
                            <TouchableOpacity onPress={() => this.setModalVisible(false)}>
                                <Image
                                    source={require('../../images/icon_back.png')}
                                    style={{ width: scale.w(30), height: scale.w(30) }}
                                    resizeMode={'contain'}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <ImageBackground
                        source={{
                            uri: this.state.signIn
                                ? this.props.chainData.data.signin_bg
                                : this.props.chainData.data.signup_bg,
                        }}
                        style={base.container}
                    >
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <ViewAnimatable duration={400} animation="fadeInUp" style={styles.titleContainer}>
                                <View style={{ flex: 0.4 }}>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 0.65, justifyContent: 'flex-end' }}>
                                            <H1
                                                textAlign="center"
                                                color={colors.WHITE}
                                                fontSize={scale.w(5.5)}
                                            >
                                                {`${this.props.chainData.data.name}`}
                                            </H1>
                                            <View style={{ height: scale.h(5) }}></View>
                                            <H4
                                                textAlign="center"
                                                color={colors.WHITE}
                                                fontSize={scale.w(2.0)}
                                            >
                                                {'Guest experience system'}
                                            </H4>
                                        </View>
                                        <View style={{ flex: 0.35 }}></View>
                                    </View>
                                </View>
                                {/* <View style={{flex : .1033333}}></View> */}
                                <View style={{ flex: 0.3 }}>
                                    {/* <FieldForm
                                label="Hotel code:"
                                placeholder="i.e. ABC"
                                value={this.state.code}
                                onChangeText={(code) => this.setState({ code })}
                                autoCapitalize="none"
                                returnKeyType="done"
                                autoFocus
                                onSubmitEditing={this._handleContinue}
                            /> */}

                                    <View
                                        style={{
                                            marginHorizontal: scale.w(40),
                                            flex: 0.3,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            borderRadius: scale.w(30),
                                        }}
                                    >
                                        {/* <BlurView
                                style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                borderRadius : scale.w(10),
                                right: 0}}
                                blurType="regular"
                                blurAmount={2}
                                overlayColor='transparent'

                                /> */}
                                        <Image
                                            blurRadius={25}
                                            style={{
                                                position: 'absolute',
                                                height: '100%',
                                                width: '100%',
                                                borderRadius: scale.w(30),
                                            }}
                                            source={{
                                                uri: this.state.signIn
                                                    ? this.props.chainData.data.signin_bg
                                                    : this.props.chainData.data.signup_bg,
                                            }}
                                        ></Image>
                                        <View
                                            style={{
                                                position: 'absolute',
                                                height: '100%',
                                                width: '100%',
                                                backgroundColor: 'rgba(255,255,255,0.25)',
                                                borderRadius: scale.w(30),
                                            }}
                                        ></View>

                                        <View style={{ flex: 0.3 }}>
                                            <H3
                                                textAlign="center"
                                                color={colors.WHITE}
                                                fontSize={scale.w(2.0)}
                                            >
                                                {'Code:'}
                                            </H3>
                                        </View>
                                        <View
                                            style={{
                                                flex: 0.7,
                                                alignItems: 'center',
                                                width: '100%',
                                                position: 'absolute',
                                            }}
                                        >
                                            <TextInput
                                                placeholder="i.e MKR001"
                                                placeholderTextColor={'rgba(255,255,255,0.4)'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        code: value.trim(),
                                                    });
                                                }}
                                                style={{
                                                    color: colors.WHITE,
                                                    fontSize: scale.w(2.0),
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    paddingLeft: this.state.marginLeft,
                                                    justifyContent: 'center',
                                                }}
                                            ></TextInput>
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.06 }}></View>
                                    <View style={{ paddingHorizontal: scale.w(50), flex: 0.64 }}>
                                        <H4
                                            color={colors.WHITE}
                                            letterSpacing={0.5}
                                            lineHeight={scale.w(19)}
                                            textAlign="center"
                                            fontSize={scale.w(1.4)}
                                        >
                                            {
                                                'Hotel code should be shown within \n your booking email confirmation, or \n you can ask your hotel'
                                            }
                                        </H4>
                                    </View>

                                    <View style={{ height: scale.w(40) }} />
                                </View>
                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                    <View style={{ marginHorizontal: scale.w(40), flex: 0.25 }}>
                                        <TouchableOpacity
                                            onPress={async () => {
                                                await this.setState({
                                                    type: 'check_in',
                                                });
                                                this._handleContinue('checkIn');
                                            }}
                                            disabled={this.state.loading}
                                            style={{
                                                backgroundColor: colors.BLUE,
                                                height: '100%',
                                                width: '100%',
                                                flex: 1,
                                                borderRadius: scale.w(30),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {this.state.loading && this.state.type == 'check_in' ? (
                                                <ActivityIndicator
                                                    color={colors.WHITE}
                                                    size="large"
                                                ></ActivityIndicator>
                                            ) : (
                                                <H3
                                                    textAlign="center"
                                                    color={colors.WHITE}
                                                    fontSize={scale.w(2.0)}
                                                >
                                                    {'Register & Check in'}
                                                </H3>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 0.1 }}></View>
                                    <View style={{ marginHorizontal: scale.w(40), flex: 0.25 }}>
                                        <TouchableOpacity
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                flex: 1,
                                                borderRadius: scale.w(30),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={async () => {
                                                await this.setState({
                                                    type: 'sign_in',
                                                });
                                                this._handleContinue('alreadyLoggedIn');
                                            }}
                                        >
                                            {/* <Image
                                    blurRadius={60}
                                    style={{ position: 'absolute', height: '100%', width: '100%' ,borderRadius : scale.w(30)}}
                                    source={require('../../images/bg-image.png')}
                                ></Image> */}
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    height: '100%',
                                                    width: '100%',
                                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                                    borderRadius: scale.w(30),
                                                }}
                                            ></View>
                                            {/* <BlurView
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            bottom: 0,
                                            borderRadius: scale.w(30),
                                            right: 0,
                                        }}
                                        blurAmount={10}
                                        blurRadius={25}
                                        blurType="regular"
                                        overlayColor="transparent"
                                    /> */}
                                            {/* <View style={{position : 'absolute', height : '100%', width : '100%', backgroundColor:'rgba(255,255,255,0.05)'}}></View> */}
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    height: '100%',
                                                    width: '100%',
                                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                                    borderRadius: scale.w(30),
                                                }}
                                            ></View>

                                            {this.state.loading && this.state.type == 'sign_in' ? (
                                                <ActivityIndicator
                                                    color={colors.WHITE}
                                                    size="large"
                                                ></ActivityIndicator>
                                            ) : (
                                                <H3
                                                    textAlign="center"
                                                    color={colors.WHITE}
                                                    fontSize={scale.w(2.0)}
                                                >
                                                    {'Sign in & Already Checked in'}
                                                </H3>
                                            )}
                                        </TouchableOpacity>
                                        {/* <Image  style={{ position : 'absolute', height :'100%', width : '100%',borderRadius : scale.w(30)}} blurRadius={100} source={require('../../images/opacityImage.png')}></Image> */}
                                    </View>
                                </View>
                            </ViewAnimatable>
                        </ScrollView>
                    </ImageBackground>
                </KeyboardAvoidingView>
                // </ImageBackground>
            );
    }
}

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        height:
            Platform.OS == 'android'
                ? StatusBar.currentHeight > 24
                    ? Dimensions.get('window').height
                    : Dimensions.get('window').height - StatusBar.currentHeight
                : Dimensions.get('screen').height,
        justifyContent: 'center',
        // marginTop: scale.w(100),
    },

    // form style
    formContainer: {
        marginVertical: scale.w(30),
    },
});

export default PickHotel;
