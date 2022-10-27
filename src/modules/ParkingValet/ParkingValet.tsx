// Screen no 2

import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image, BackHandler } from 'react-native';

import { IParkingValetReduxProps } from './ParkingValet.Container';

import colors from '../../constants/colors';
import { H3 } from '../_global/Text';
import { ButtonPrimary } from '../_global/Button';
import { createChannel } from '../../utils/handleLogic';
import { Navigation } from 'react-native-navigation';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import Navbar from '../_global/Navbar';

import { chat, mainmenu } from '../../utils/navigationControl';
import * as Animatable from 'react-native-animatable';

import ImagePicker from 'react-native-image-picker';
import CustomModal from '../_global/CustomModal';
import ValetButtons from './Components/ValetButtons';
import ParkingValetComplete from './ParkingValetComplete';
import ProcessComplete from '../_global/processComplete';

interface IParkingValetProps extends IParkingValetReduxProps {
    componentId: string;
    added: boolean;
    item: object;
    parkingValetData: {
        data: {
            id: number;
            date: string;
            time: string;
            key_access: string;
            status: string;
            request_status: string;
            hotel_booking_id: number;
            valet_setting_id?: any;
            valet_time: string;
            valet_date: string;
            vehicle: {
                id: number;
                manufacturer: string;
                color: string;
                license_plate: string;
                location: string;
                image: string;
                description: string;
                valet_id: number;
            };
        };
    };
}

interface IParkingState {
    isLoading: boolean;
    buttonLoader: boolean;
    currentId: number;
    carModel: string;
    licenseNumber: string;
    parkedAt: string;
    licenseImage: object;
    imageSelected: boolean;
    added: boolean;
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

class ParkingValet extends React.Component<IParkingValetProps, IParkingState> {
    private _modalConfirm = React.createRef<CustomModal>();
    private _modalConfirm2 = React.createRef<CustomModal>();
    constructor(props: IParkingValetProps) {
        super(props);
        console.log('NOMIPROPS', props);
        this.state = {
            isLoading: false,
            buttonLoader: false,
            currentId: 0,
            imageSelected: false,
            added: this.props.added,
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
                backgroundColor: props.Primary_Color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._getParkingDetail = this._getParkingDetail.bind(this);
        this.listEmpty = this.listEmpty.bind(this);
        this._handleChat = this._handleChat.bind(this);
        this._UploadLicenseImage = this._UploadLicenseImage.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this._handleGrabRequest = this._handleGrabRequest.bind(this);
        this._handleReParkRequest = this._handleReParkRequest.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        Navigation.pop(this.props.componentId);
        return true;
    }

    componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        });
        this._getParkingDetail();
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _getParkingDetail() {
        this.setState({
            isLoading: true,
        });
        this.props.getParkingDetails(
            () => {
                createChannel('10');
                this.setState({
                    isLoading: false,
                });
            },
            () => {
                this.setState({
                    isLoading: false,
                });
            },
        );
        console.log('parking valet============>', this.props.parkingValetData);
    }

    listEmpty() {
        const { live_chat } = this.props.selectedLanguage;
        const { color } = this.props;
        return (
            <View
                style={{
                    paddingTop: heightPercentageToDP(10),
                }}
            >
                {this.state.isLoading ? (
                    <View
                        style={{
                            width: widthPercentageToDP(70),
                            height: scale.h(80),
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {this.props.primaryColor == '#72D7FF' ? (
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                source={{ uri: this.state.chainData.data.logo_gif_dark }}
                            />
                        ) : (
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                source={{ uri: this.state.chainData.data.logo_gif_dark }}
                            />
                        )}
                    </View>
                ) : (
                    <>
                        <View
                            style={{
                                paddingHorizontal: widthPercentageToDP(5),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <H3 textAlign={'center'}>
                                {
                                    this.props.selectedLanguage
                                        .you_have_no_cars_parked_in_the_valet_please_ask_your_valet_or_concierge_to_register_your_car_within_the_application
                                }
                            </H3>
                        </View>
                        <View
                            style={{
                                marginTop: heightPercentageToDP(3),
                            }}
                        >
                            <Animatable.View
                                useNativeDriver
                                animation="fadeIn"
                                duration={300}
                                style={styles.btn_chat_container}
                            >
                                <ButtonPrimary
                                    onPress={this._handleChat}
                                    text={live_chat}
                                    backgroundColor={color || colors.LIGHT_BLUE}
                                    chainData={this.props.chainData}
                                />
                            </Animatable.View>
                        </View>
                    </>
                )}
            </View>
        );
    }
    _handleChat() {
        Navigation.push(this.props.componentId, chat({ from: 'restaurant' }));
    }

    _UploadLicenseImage() {
        var options = {
            title: 'Select Image',
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            storageOptions: {
                skipBackup: true,
            },
        };

        ImagePicker.showImagePicker(options, (res) => {
            console.log('Response = ', res);

            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
                // } else if (res.customButton) {
                //   console.log('User tapped custom button: ', res.customButton);
                //   alert(res.customButton);
            } else {
                let source = res;
                this.setState({
                    licenseImage: source,
                    imageSelected: true,
                });
            }
        });
        console.log(this.state.licenseNumber);
    }

    _handleGrabRequest() {
        this.setState({
            isLoading: true,
        });
        return new Promise((resolve, reject) => {
            this.props.grabRequest(
                () => {
                    this.setState({ isLoading: false });
                    this._modalConfirm.current?.show();
                    resolve(true);
                },
                () => {
                    this.setState({ isLoading: false });
                    reject(false);
                },
            );
        });
    }

    _handleReParkRequest() {
        this.setState({
            isLoading: true,
        });
        return new Promise((resolve, reject) => {
            this.props.reParkRequest(
                () => {
                    this.setState({ isLoading: false });
                    this._modalConfirm2.current?.show();
                    resolve(true);
                },
                () => {
                    this.setState({ isLoading: false });
                    reject(false);
                },
            );
        });
    }

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
                <CustomModal
                    ref={this._modalConfirm}
                    style={{
                        height: hp(100),
                        width: wp(100),
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: -1,
                    }}
                >
                    <ProcessComplete
                        backgroundColor={this.props.Primary_Color}
                        processImage={require('../../images/paymentPageImg.png')}
                        processTitle={'Pickup Request'}
                        processDescription={'To grab vehicle your request must be accepted by hotel admin'}
                        onButtonPress={() => {
                            this._modalConfirm.current.hide();
                            Navigation.popTo('mainmenu');
                        }}
                        btnText={this.props.selectedLanguage.go_to_home}
                        chainData={this.props.chainData}
                    />
                </CustomModal>
                <CustomModal
                    ref={this._modalConfirm2}
                    style={{
                        height: hp(100),
                        width: wp(100),
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: -1,
                    }}
                >
                    <ProcessComplete
                        backgroundColor={this.props.Primary_Color}
                        processImage={require('../../images/paymentPageImg.png')}
                        processTitle={'Re Park Request'}
                        processDescription={'Valet completion request has been processed successfully.'}
                        onButtonPress={() => {
                            this._modalConfirm2.current.hide();
                            Navigation.popTo('mainmenu');
                        }}
                        btnText={this.props.selectedLanguage.go_to_home}
                        chainData={this.props.chainData}
                    />
                </CustomModal>
                <View style={{ height: hp(10), backgroundColor: colors.WHITE, paddingVertical: hp(1) }}>
                    <Navbar
                        tintBackColor={'black'}
                        titleColor={colors.BLACK}
                        onClick={this._handleBack}
                        title={this.props.selectedLanguage.vehicle_parking}
                    />
                </View>
                {}
                <View style={{ height: hp(20), width: wp(90), alignSelf: 'center' }}>
                    <Image
                        source={require('../../images/VletparkingCar.png')}
                        style={{ alignSelf: 'center' }}
                    />
                </View>
                {/* {this.props.parkingValetData?.length === 0 && (
                    <Text
                        style={{
                            fontSize: 15,
                            fontFamily: 'Roboto-Medium',
                            color: this.props.color,
                        }}
                    >
                        {this.props.selectedLanguage.valet_request}
                    </Text>
                )} */}
                {this.state.isLoading ? (
                    <View style={{ marginTop: hp(20), justifyContent: 'center' }}>
                        <Image
                            source={{
                                uri: this.state.chainData.data.logo_gif_dark,
                            }}
                            style={{ height: 40, width: 80, alignSelf: 'center' }}
                            // source={{uri:this.state.chainData.data.logo_gif_light}}
                            // style={{ height: 40, width: 80, alignSelf: 'center', tintColor: this.props.icon.spa_color }}
                        ></Image>
                    </View>
                ) : this.props.parkingValetData?.length === 0 ? (
                    <ValetButtons
                        updateTotalUnreadMessageSuccess={this.props.updateTotalUnreadMessageSuccess}
                        toggleIsInChatScreen={this.props.toggleIsInChatScreen}
                        selectedLanguage={this.props.selectedLanguage}
                        chainData={this.props.chainData}
                        parkingValetData={this.props.parkingValetData}
                        color={this.props.color}
                        Primary_Color={this.props.Primary_Color}
                        componentId={this.props.componentId}
                        isLoading={this.state.isLoading}
                    />
                ) : this.props.parkingValetData.data?.status === 'self_parked' &&
                  this.props.parkingValetData.data.request_status === 'approved' ? (
                    <ParkingValetComplete
                        selectedLanguage={this.props.selectedLanguage}
                        chainData={this.props.chainData}
                        parkingValetData={this.props.parkingValetData}
                        Primary_Color={this.props.Primary_Color}
                        _handleGrabRequest={this._handleGrabRequest}
                        _handleReParkRequest={this._handleReParkRequest}
                        loading={this.state.isLoading}
                    />
                ) : this.props.parkingValetData?.data?.status === 'park_request' &&
                  this.props.parkingValetData?.data?.request_status === 'pending' ? (
                    <ValetButtons
                        updateTotalUnreadMessageSuccess={this.props.updateTotalUnreadMessageSuccess}
                        toggleIsInChatScreen={this.props.toggleIsInChatScreen}
                        selectedLanguage={this.props.selectedLanguage}
                        chainData={this.props.chainData}
                        parkingValetData={this.props.parkingValetData}
                        color={this.props.color}
                        Primary_Color={this.props.Primary_Color}
                        componentId={this.props.componentId}
                        isLoading={this.state.isLoading}
                    />
                ) : this.props.parkingValetData?.data?.status === 'park_request' &&
                  this.props.parkingValetData?.data?.request_status === 'approved' ? (
                    <ParkingValetComplete
                        selectedLanguage={this.props.selectedLanguage}
                        chainData={this.props.chainData}
                        parkingValetData={this.props.parkingValetData}
                        Primary_Color={this.props.Primary_Color}
                        _handleGrabRequest={this._handleGrabRequest}
                        _handleReParkRequest={this._handleReParkRequest}
                        loading={this.state.isLoading}
                    />
                ) : this.props.parkingValetData?.data?.status === 'grab_request' &&
                  this.props.parkingValetData?.data?.request_status === 'approved' ? (
                    <ParkingValetComplete
                        selectedLanguage={this.props.selectedLanguage}
                        chainData={this.props.chainData}
                        parkingValetData={this.props.parkingValetData}
                        Primary_Color={this.props.Primary_Color}
                        _handleGrabRequest={this._handleGrabRequest}
                        _handleReParkRequest={this._handleReParkRequest}
                        loading={this.state.isLoading}
                    />
                ) : this.props.parkingValetData?.data?.status === 'grab_request' ? (
                    <ParkingValetComplete
                        selectedLanguage={this.props.selectedLanguage}
                        chainData={this.props.chainData}
                        parkingValetData={this.props.parkingValetData}
                        Primary_Color={this.props.Primary_Color}
                        _handleGrabRequest={this._handleGrabRequest}
                        _handleReParkRequest={this._handleReParkRequest}
                        loading={this.state.isLoading}
                    />
                ) : this.props.parkingValetData?.data?.status === 'park_request' &&
                  this.props.parkingValetData?.data?.request_status === 'rejected' ? (
                    <ValetButtons
                        updateTotalUnreadMessageSuccess={this.props.updateTotalUnreadMessageSuccess}
                        toggleIsInChatScreen={this.props.toggleIsInChatScreen}
                        selectedLanguage={this.props.selectedLanguage}
                        chainData={this.props.chainData}
                        parkingValetData={this.props.parkingValetData}
                        color={this.props.color}
                        Primary_Color={this.props.Primary_Color}
                        componentId={this.props.componentId}
                        isLoading={this.state.isLoading}
                    />
                ) : null}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        paddingBottom: scale.h(20),
    },
    navbar: {
        height: scale.h(56),
        alignItems: 'center',
        justifyContent: 'center',
    },
    MainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale.h(10),
    },
    ItemContainer: {
        backgroundColor: 'white',
        borderRadius: scale.h(10),
        marginHorizontal: scale.w(10),
        marginVertical: scale.w(10),
        paddingVertical: scale.w(12),
        paddingHorizontal: scale.w(15),
        width: scale.w(320),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    btn_chat_container: {
        paddingHorizontal: scale.w(100),
        paddingVertical: scale.w(12),
    },
});

export default ParkingValet;
