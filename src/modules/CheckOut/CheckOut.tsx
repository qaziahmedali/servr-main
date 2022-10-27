import React from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Image, BackHandler } from 'react-native';
import base from '../../utils/baseStyles';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import RequestCheckOut from './Components/RequestCheckOut';
import LateCheckOut from './Components/LateCheckOut';
import { ICheckOutReduxProps } from './CheckOut.Container';
import colors from '../../constants/colors';
// import { H4 } from '../_global/Text';
import { Separator } from '../_global/Container';
// import { scale } from '../../utils/dimensions';
import { Text } from 'react-native-animatable';
import AttentionModal from '../_global/AttentionModal';
import Modal from 'react-native-modal';
import { H4, H2, H1 } from '../_global/Text';
import { scale, widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils/dimensions';
import { ButtonPrimary } from '../_global/Button';
import { transactionHistory } from '../../utils/navigationControl';
import QuickCheckOut from './Components/quickChcekOut';
import { Payment } from '../../utils/navigationControl';
import DropShadow from 'react-native-drop-shadow';

interface ICheckOutProps extends ICheckOutReduxProps {
    componentId: string;
}

interface ICheckOutState {
    loading: boolean;
    loadingGet: boolean;
    request: boolean;
    loadingCheckOut: boolean;
    visible: boolean;
    text: string;
    modalVisible: boolean;
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

class CheckOut extends React.PureComponent<ICheckOutProps, ICheckOutState> {
    constructor(props: ICheckOutProps) {
        super(props);

        this.state = {
            loading: false,
            loadingGet: true,
            request: !!props.late_checkout_status,
            loadingCheckOut: false,
            visible: false,
            text: '',
            modalVisible: false,
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
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleRequest = this._handleRequest.bind(this);
        this._handleCheckOut = this._handleCheckOut.bind(this);
        this.confirmCheckout = this.confirmCheckout.bind(this);
        this._handleTransction = this._handleTransction.bind(this);
        this._handleQuickCheckout = this._handleQuickCheckout.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
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
        this.props.getProfile(
            this.props.token,
            this.props.hotelCode,
            () => {
                this.setState({ loadingGet: false });
            },
            () => {
                this.setState({ loadingGet: false });
            },
        );
    }

    _handleQuickCheckout() {
        this.props.bills(
            (response: any) => {
                this.setState({ loading: false, request: true });
                console.log(response);
                if (response?.dishes?.length == 0 && response?.spas?.length == 0) {
                    response['vat'] = 0;
                    response['service_charges'] = 0;
                }
                Navigation.push(
                    this.props.componentId,
                    Payment({
                        backGround: false,
                        color: this.props.color,
                        selectedLanguage: this.props.selectedLanguage,
                        getTransactionHistory: () => {},
                        data: this.props.quickCheckOut,
                        response: response,
                        profile: this.props.profile,
                        typeData: this.props.type,
                    }),
                );
            },
            () => {
                this.setState({ loading: false });
            },
        );
    }

    UNSAFE_componentWillReceiveProps(nextProps: ICheckOutProps) {
        if (this.props.late_checkout_status !== nextProps.late_checkout_status) {
            this.setState({ request: !!nextProps.late_checkout_status });
        }
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handleRequest() {
        // if(!this.state.request){
        this.setState({ loading: true });
        this.props.lateCheckOut(
            () => {
                this.setState({ loading: false, request: true });
                Navigation.pop(this.props.componentId);
            },
            () => {
                this.setState({ loading: false });
            },
        );
        // }else{
        //     // Alert.alert('Attention','You have already requested late checkout');
        //     this.setState({
        //         text:'You have already requested late checkout',
        //         visible:true
        //     })
        // }
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _handleCheckOut() {
        console.log('checkouttt');
        this.setState({
            modalVisible: true,
        });
    }

    confirmCheckout() {
        this.setState({ modalVisible: false, loadingCheckOut: true });

        this.props.checkOut(
            () => {
                this.setState({ loadingCheckOut: false, request: true });
            },
            () => {
                this.setState({ loadingCheckOut: false });
            },
        );
    }

    _handleTransction() {
        Navigation.push(this.props.componentId, transactionHistory);
    }

    render() {
        const { checkout_time, late_checkout_time, late_checkout_status, color } = this.props;
        const { check_out } = this.props.selectedLanguage;
        return (
            <View style={base.container}>
                <Navbar color={color} onClick={this._handleBack} title={check_out} />

                <View style={StyleSheet.flatten([base.center_mid, { flex: 1, paddingBottom: scale.w(120) }])}>
                    {this.state.loadingGet ? (
                        <>
                            <View
                                style={{
                                    width: scale.w(200),
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
                            <Separator height={10} />
                            <H4 textAlign="center" fontSize={scale.w(16)}>
                                {'Please wait\nChecking your check out time'}
                            </H4>
                        </>
                    ) : (
                        <>
                            <RequestCheckOut
                                time={checkout_time}
                                onPress={this._handleRequest}
                                loading={this.state.loading}
                                disabled={this.state.loading}
                                onPressCheckOut={this._handleCheckOut}
                                loadingCheckOut={this.state.loadingCheckOut}
                                disabledCheckOut={this.state.loadingCheckOut}
                                color={color}
                                selectedLanguage={this.props.selectedLanguage}
                                onPressTransction={this._handleTransction}
                                onPressQuickCheckout={this._handleQuickCheckout}
                            />
                            {/* )} */}
                        </>
                    )}
                </View>
                <AttentionModal
                    visible={this.state.visible}
                    toggleModal={this.toggleModal}
                    text={this.state.text}
                />
                <Modal
                    backdropOpacity={0.7}
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => {
                        this.setState({
                            modalVisible: false,
                        });
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingHorizontal: wp(2),
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: scale.w(350),
                                height: scale.w(185),
                                backgroundColor: '#fff',
                                borderRadius: scale.w(20),
                                alignItems: 'center',
                                // justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    marginTop: scale.h(30),
                                }}
                            >
                                <H2>Are you sure to check out</H2>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: scale.w(50),
                                }}
                            >
                                <View
                                    style={{
                                        width: '45%',
                                        paddingHorizontal: scale.w(15),
                                    }}
                                >
                                    <ButtonPrimary
                                        backgroundColor={
                                            this.props.color !== '' ? this.props.color : undefined
                                        }
                                        onPress={() => {
                                            this.setState({
                                                modalVisible: false,
                                            });
                                        }}
                                        loading={false}
                                        disabled={false}
                                        fontSize={scale.w(16.5)}
                                        text={'No'}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                                <View
                                    style={{
                                        width: '45%',
                                        paddingHorizontal: scale.w(15),
                                    }}
                                >
                                    <ButtonPrimary
                                        backgroundColor={
                                            this.props.color !== '' ? this.props.color : undefined
                                        }
                                        onPress={() => {
                                            this.confirmCheckout();
                                        }}
                                        loading={this.state.loading}
                                        fontSize={scale.w(16.5)}
                                        text={'Yes'}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default CheckOut;
