import React from 'react';
import {
    View,
    Text,
    FlatList,
    Platform,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    BackHandler,
    KeyboardAvoidingView,
    Alert,
    StatusBar,
    Keyboard,
} from 'react-native';
import Image from 'react-native-image-progress';
import base from '../../utils/baseStyles';
import {
    heightPercentageToDP,
    scale,
    screenWidth,
    widthPercentageToDP,
    widthPercentageToDP as wp,
} from '../../utils/dimensions';
import { H3, H1, H3_medium, H2 } from '../_global/Text';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { ITransactionReduxProps } from './TransactionHistory.Container';
import colors from '../../constants/colors';
import { upperFirst, startCase } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import { transactionHistory } from '../../utils/navigationControl';
import { BoxShadow } from 'react-native-shadow';
import Icon from 'react-native-vector-icons/Feather';
import DIcon from 'react-native-vector-icons/MaterialIcons';
import { View as ViewAnimatable } from 'react-native-animatable';
import { DatePicker } from '@davidgovea/react-native-wheel-datepicker';
import moment, { months } from 'moment';
import { Payment } from '../../utils/navigationControl';
import numeral from 'numeral';
import { FormatMoney } from '../../utils/handleLogic';
import DropShadow from 'react-native-drop-shadow';
import { hp } from '../../utils/dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import Card from './Components/card';
import PaymentFormModal from '../_global/paymentFormModal';
import ProcessComplete from '../_global/processComplete';
import CustomModal from '../_global/CustomModal';
import Cardscan from 'react-native-cardscan';
import { toast } from '../../utils/handleLogic';
import { RootContainer } from '../_global/Container';
import PushNotification from 'react-native-push-notification';

interface ITransactionProps extends ITransactionReduxProps {
    componentId: string;
}

interface ITransactionState {
    isLoading: boolean;
    type: string;
    loading: boolean;
    loadingGet: boolean;
    page: number;
    selectedIndex: number;
    cardNumber: string;
    cardName: string;
    cardExpiryDate: string;
    cvv: string;
    cardAddress: string;
    saveCard: boolean;
    holderName: string;
    subTotal: number;
    grandTotal: number;
    transaction_data: any;
}

class TransactionHistory extends React.Component<ITransactionProps, ITransactionState> {
    private _modalVisible = React.createRef<CustomModal>();
    private _modalPaymentFormModal = React.createRef<CustomModal>();
    private _processComplete = React.createRef<CustomModal>();
    private _modalConfirm = React.createRef<CustomModal>();

    constructor(props: ITransactionProps) {
        super(props);

        this.state = {
            transaction_data: this.props.transaction_data,
            isLoading: false,
            type: '',
            loading: false,
            loadingGet: true,
            page: 0,
            selectedIndex: 0,
            cardName: props?.profile?.cardholder_name || '',
            cardNumber: props?.profile?.card_number_full || '',
            cardAddress: props?.profile?.card_address || '',
            cardExpiryDate: props?.profile?.card_expiry_date || '',
            cvv: props?.profile?.card_cvv_number || '',
            saveCard: false,
            subTotal: 0,
            grandTotal: 0,
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.PrimaryColor,
                style: 'light',
            },
        });
        this._handlePayNow = this._handlePayNow.bind(this);
        // this._handleQuickCheckOutRequest = this._handleQuickCheckOutRequest.bind(this);

        this._getTransactionHistory = this._getTransactionHistory.bind(this);
        this._handleBack = this._handleBack.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this.listEmpty = this.listEmpty.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this._handlePayByCash = this._handlePayByCash.bind(this);
        this._handlePayByCard = this._handlePayByCard.bind(this);
        this.scanCard = this.scanCard.bind(this);

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        Navigation.pop(this.props.componentId);
        return true;
    }

    _getTransactionHistory() {
        this.setState({
            isLoading: true,
        });
        this.props.getTransactionHistory(
            () => {
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
    }

    componentDidMount() {
        // this._getTransactionHistory();
        const transaction_history = this.state.transaction_data.transaction_history;
        let sub_total = 0;
        let GrandTotal = 0;
        transaction_history?.map((item, index) => {
            sub_total += item?.total_price;
            GrandTotal += item?.price;
        });
        this.setState({
            subTotal: sub_total,

            grandTotal: GrandTotal,
        });

        console.log('Noman', this.props.transaction_data);
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handlePayNow() {
        // if (this.state.type == 'stripe') this.cardPayment('stripe');
        // else

        this._modalVisible.current?.show();
    }

    _handlePayByCash() {
        this.setState({
            type: 'quick_checkout_pending',
        });
        this._handleQuickCheckOutRequest('quick_checkout_pending');
    }

    _handlePayByCard() {
        // this.setState({
        //     type :'stripe'
        // })
        this._modalVisible.current?.hide();
        this._modalPaymentFormModal.current?.show();
        // this.cardPayment('stripe');
    }

    cardPayment(val) {
        if (
            this.state.cardNumber == '' ||
            this.state.cardAddress == '' ||
            this.state.cvv == '' ||
            this.state.cardName == ''
        ) {
            toast('Please enter card details');
        } else {
            this._modalVisible.current?.hide();
            // console.log(this.props.typeData)
            var card: any = {};
            // if(this.props.type == 'resto'){
            // Alert.alert('in resto');
            card['number'] = this.state.cardNumber;
            card['name'] = this.state.cardName;
            card['type'] = val;
            card['exp'] = this.state.cardExpiryDate;
            // }else{
            card['amount'] = this.props?.response?.total_price_after_tax;

            // }
            console.log(card);
            this.setState({ loading: true });
            this.props.quickCheckOut(
                card,
                () => {
                    this.setState({ loading: false });
                    console.log('done');
                    // this.props.getTransactionHistory();
                    // setTimeout(() => {
                    this._processComplete.current?.show();
                    PushNotification.cancelAllLocalNotifications();

                    // }, 500);
                    Keyboard.dismiss();
                    if (this._modalConfirm.current) {
                        this._modalConfirm.current.hide();
                    }
                },
                () => {
                    this.setState({ loading: false });

                    Keyboard.dismiss();
                    if (this._modalConfirm.current) {
                        this._modalConfirm.current.hide();
                    }
                },
            );
        }
    }
    scanCard() {
        Keyboard.dismiss();
        Cardscan.isSupportedAsync().then((supported) => {
            console.log(supported);
            if (supported) {
                Cardscan.scan().then(({ action, payload, canceled_reason }) => {
                    console.log('fffffffffffffffffff vvvvvvvvvvvvvvvvvvvv', Cardscan);
                    if (action === 'scanned') {
                        console.log(payload);
                        const { number, expiryMonth, expiryYear, issuer, cardholderName } = payload;
                        console.log(number, cardholderName, issuer, expiryYear);
                        if (number) {
                            console.log(number, expiryYear, expiryMonth, cardholderName);
                            this.setState({
                                cardNumber: number,
                                cardName: cardholderName,
                                cardExpiryDate: expiryMonth
                                    ? `${padStart(expiryMonth.toString(), 2, '0')}/${expiryYear
                                          .toString()
                                          .substr(2)}`
                                    : '',
                            });
                            this._modalPaymentFormModal.current?.show();
                        } else {
                            this._modalPaymentFormModal.current?.show();
                        }
                        // Display information
                    } else if (action === 'canceled') {
                        // console.log(Cardscan.getConstants())
                        if (canceled_reason === 'enter_card_manually') {
                            console.log(canceled_reason);
                            // the user elected to enter a card manually
                        } else if (canceled_reason === 'camera_error') {
                            console.log(canceled_reason);
                            // there was an error with the camera
                        } else if (canceled_reason === 'fatal_error') {
                            console.log(canceled_reason);
                            // there was an error during the scan
                        } else if (canceled_reason === 'user_canceled') {
                            console.log(canceled_reason);
                            // the user canceled the scan
                        } else {
                            console.log(action);
                        }
                    } else if (action === 'skipped') {
                        console.log(canceled_reason);
                        // User skipped
                    } else if (action === 'unknown') {
                        console.log(canceled_reason);
                        // Unknown reason for scan canceled
                    }
                });
            } else {
                console.log('nottttttttt supporteddddddddddddddddd <-- thora d bahi!', supported);
            }
        });
    }

    _handleQuickCheckOutRequest(val) {
        this._modalVisible.current?.hide();
        Alert.alert(
            this.props.selectedLanguage?.confirmation,
            this.props.selectedLanguage?.are_you_sure_you_want_to_pay_by_cash,
            [
                {
                    text: this.props.selectedLanguage.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: this.props.selectedLanguage.proceed,
                    onPress: () => {
                        this.setState({ loading: true });
                        var card: any = {};
                        card['number'] = this.state.cardNumber;
                        card['name'] = this.state.cardName;
                        card['exp'] = this.state.cardExpiryDate;
                        card['amount'] = this.props?.response?.total_price_after_tax;
                        card['type'] = val;
                        console.log(card);
                        this.props.quickCheckOut(
                            card,
                            () => {
                                console.log('done');
                                this._modalPaymentFormModal.current?.hide();
                                PushNotification.cancelAllLocalNotifications();
                                // setTimeout(() => {
                                this._processComplete.current?.show();
                                // }, 500);
                                // this.props.getTransactionHistory();
                                this.setState({ loading: false });
                            },
                            () => {
                                this.setState({ loading: false });
                            },
                        );
                    },
                },
            ],
            { cancelable: false },
        );
    }

    _renderItem({ item }: { item: any }) {
        const { currency } = this.props;
        console.log(item);
        return (
            <TouchableOpacity
                // disabled={item.items.length > 0 && item.is_paid == 0 ? false : true}
                disabled={true}
                onPress={() => {
                    console.log(this.props.transaction_data);
                    Navigation.push(
                        this.props.componentId,
                        Payment({
                            backGround: false,
                            color: this.props.color,
                            selectedLanguage: this.props.selectedLanguage,
                            data: this.props.transactionHistoryPaymentt,
                            getTransactionHistory: () => {
                                this._getTransactionHistory();
                            },
                            response: {
                                vat: this.props.transaction_data.vat,
                                service_charges: this.props.transaction_data.service_charges,
                                total_price_after_tax: item.total_price,
                                service_id: item.id,
                                service_type: item.type,
                            },
                            profile: this.props.profile,
                            typeData: this.props.type,
                        }),
                    );
                }}
                style={styles.transactionItem}
            >
                <View>
                    <Text
                        style={{
                            fontSize: scale.w(2.3),
                            color: colors.DARK_GREY,
                            fontFamily: 'Roboto-Bold',
                        }}
                    >
                        {item.title}
                    </Text>
                </View>
                <View style={{ height: heightPercentageToDP(1) }}></View>
                {item.items.map((data, index) => {
                    return (
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: heightPercentageToDP(2),
                                opacity: 0.5,
                                justifyContent: 'space-between',
                            }}
                        >
                            <View style={{ width: widthPercentageToDP(50) }}>
                                <Text
                                    style={{
                                        fontSize: scale.w(1.6),
                                        color: '#000',
                                        fontFamily: 'Roboto-Regular',
                                    }}
                                >
                                    {data.name}
                                </Text>
                            </View>
                            <View style={{}}>
                                {item.price !== '' && item.is_paid == 0 && (
                                    <Text
                                        style={{
                                            fontSize: scale.w(1.6),
                                            color: '#000',
                                            fontFamily: 'Roboto-Bold',
                                        }}
                                    >{`${currency} ${numeral(data.price)
                                        .format('0,0a')
                                        .toUpperCase()}`}</Text>
                                )}
                            </View>
                        </View>
                    );
                })}
                {/* <View style={{ marginBottom: scale.h(5), marginTop: scale.h(5) }}>
                    <H3>{moment(item.timeStamp).format('DD-MM-YYYY HH:mm')}</H3>
                </View> */}
            </TouchableOpacity>
        );
    }

    listEmpty() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: heightPercentageToDP(20),
                }}
            >
                {this.state.isLoading ? (
                    <View
                        style={{
                            width: widthPercentageToDP(80),
                            height: heightPercentageToDP(80),
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {this.props.primaryColor == '#72D7FF' ? (
                            // <Image
                            //     resizeMode="contain"
                            //     style={{
                            //         height: '100%',
                            //         width: '100%',
                            //     }}
                            //     source={{ uri: this.props.chainData.data.logo_gif_dark }}
                            // />
                            <ActivityIndicator />
                        ) : (
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                source={{ uri: this.props.chainData.data.logo_gif_dark }}
                            />
                        )}
                    </View>
                ) : (
                    <View
                        style={{
                            paddingTop: heightPercentageToDP(2),
                        }}
                    >
                        <H3>{this.props.selectedLanguage.no_data_found}</H3>
                    </View>
                )}
            </View>
        );
    }

    render() {
        const { color, selectedLanguage } = this.props;

        return (
            <KeyboardAvoidingView style={{ flex: 1 }}>
                {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: heightPercentageToDP(20), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: this.props.PrimaryColor,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && (
                    <StatusBar backgroundColor={this.props.PrimaryColor}></StatusBar>
                )}
                <View style={{ flex: 1 }}>
                    <RootContainer>
                        <View
                            style={{
                                height: heightPercentageToDP(14),
                                backgroundColor: this.props.PrimaryColor,
                            }}
                        >
                            {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                            <Navbar
                                tintBackColor={colors.WHITE}
                                titleColor={colors.WHITE}
                                onClick={this._handleBack}
                                title={this.props.selectedLanguage.check_out}
                            />
                            {/* </ImageBackground> */}
                        </View>
                        <View
                            style={{
                                height: heightPercentageToDP(82),
                                width: widthPercentageToDP(100),
                                backgroundColor: colors.WHITE,
                                top: -heightPercentageToDP(4.3),
                                borderTopLeftRadius: scale.w(3.5),
                                borderTopRightRadius: scale.w(3.5),
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {this.state.isLoading ? (
                                    <View
                                        style={{
                                            width: widthPercentageToDP(80),
                                            height: heightPercentageToDP(80),
                                            alignSelf: 'center',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {this.props.primaryColor == '#72D7FF' ? (
                                            // <Image
                                            //     resizeMode="contain"
                                            //     style={{
                                            //         height: '100%',
                                            //         width: '100%',
                                            //     }}
                                            //     source={{ uri: this.props.chainData.data.logo_gif_dark }}
                                            // />
                                            // <Text>ddd</Text>
                                            <ActivityIndicator size="large" color="gray" />
                                        ) : (
                                            // <ActivityIndicator />
                                            // <Image
                                            //     resizeMode="contain"
                                            //     style={{
                                            //         height: '100%',
                                            //         width: '100%',
                                            //     }}
                                            //     source={{ uri: this.props.chainData.data.logo_gif_dark }}
                                            // />
                                            // <Text>sfdgsdfg</Text>
                                            <ActivityIndicator size="large" color="gray" />
                                        )}
                                    </View>
                                ) : (
                                    <>
                                        <View
                                            style={{
                                                height: heightPercentageToDP(55),
                                                width: widthPercentageToDP(100),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    marginHorizontal: widthPercentageToDP(5),
                                                    marginTop: heightPercentageToDP(3),
                                                }}
                                            >
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(2.3),
                                                            color: colors.DARK_GREY,
                                                            fontFamily: 'Roboto-Bold',
                                                        }}
                                                    >
                                                        {this.props.selectedLanguage.room_details}
                                                    </Text>
                                                </View>
                                            </View>
                                            <ScrollView
                                                showsVerticalScrollIndicator={true}
                                                persistentScrollbar={true}
                                            >
                                                <View style={{ height: heightPercentageToDP(1) }}></View>
                                                <DropShadow
                                                    style={{
                                                        width: widthPercentageToDP(100),
                                                        shadowOffset: {
                                                            width: 20,
                                                            height: 19,
                                                        },
                                                        shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                                                        shadowOpacity: 0.09,
                                                        shadowRadius: 30,
                                                        alignSelf: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <ViewAnimatable
                                                        useNativeDriver
                                                        animation="fadeInLeft"
                                                        duration={400}
                                                        delay={Math.floor(Math.random() * 100)}
                                                        style={{
                                                            borderRadius: 10,
                                                            backgroundColor: '#FFFF',
                                                            paddingHorizontal: widthPercentageToDP(2),
                                                            borderWidth: 1,
                                                            borderColor:
                                                                colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR,
                                                            paddingVertical: heightPercentageToDP(1),
                                                            alignSelf: 'center',
                                                            width: widthPercentageToDP(90),
                                                        }}
                                                    >
                                                        <View style={{ flexDirection: 'row' }}>
                                                            {/* <Image
                                                                source={require('../../images/restaurant-sample.jpg')}
                                                                style={{
                                                                    height: scale.w(10),
                                                                    width: scale.w(10),
                                                                    borderRadius: 5,
                                                                }}
                                                            /> */}
                                                            <Image
                                                                source={{
                                                                    uri: this.props.account.hotel_details.data
                                                                        .room_default_img,
                                                                }}
                                                                style={{
                                                                    height: scale.w(10),
                                                                    width: scale.w(10),
                                                                    borderRadius: 5,
                                                                }}
                                                                indicator={<ActivityIndicator />}
                                                                resizeMode={'cover'}
                                                                indicatorProps={{
                                                                    size: 20,
                                                                    borderWidth: 0,
                                                                    color: 'rgba(150, 150, 150, 1)',
                                                                    unfilledColor: 'rgba(200, 200, 200, 0.2)',
                                                                }}
                                                                imageStyle={{
                                                                    borderRadius: 5,
                                                                }}
                                                            />
                                                            <View
                                                                style={{ marginLeft: widthPercentageToDP(2) }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'space-between',
                                                                        width: wp(60),
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            color: colors.ROOM_DETAILS_HEADER,
                                                                            fontSize: scale.w(1.8),
                                                                            fontFamily: 'Roboto-Bold',
                                                                        }}
                                                                    >
                                                                        {this.props.account.profile
                                                                            .room_number
                                                                            ? this.props.account.profile
                                                                                  .room_number
                                                                            : 'King Double Suit Sea View'}
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: this.props.PrimaryColor,
                                                                            fontSize: scale.w(1.3),
                                                                            marginTop: 5,
                                                                            fontFamily: 'Roboto-Medium',
                                                                        }}
                                                                    >
                                                                        {this.props.selectedLanguage
                                                                            .check_in +
                                                                            ` : ${moment(
                                                                                this.props.account.profile
                                                                                    .arrival_date,
                                                                            ).format('DD MMM')}`}
                                                                    </Text>
                                                                </View>
                                                                <View style={{ flex: 1 }}></View>
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'space-between',
                                                                        width: widthPercentageToDP(60),
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            alignItems: 'center',
                                                                        }}
                                                                    >
                                                                        <DIcon
                                                                            size={20}
                                                                            color={this.props.PrimaryColor}
                                                                            name={'people-alt'}
                                                                        ></DIcon>
                                                                        <Text
                                                                            style={{
                                                                                color: this.props
                                                                                    .PrimaryColor,
                                                                                fontFamily: 'Roboto-Medium',
                                                                                fontSize: scale.w(1.3),
                                                                                marginLeft: 5,
                                                                            }}
                                                                        >
                                                                            1{' '}
                                                                            {
                                                                                this.props.selectedLanguage
                                                                                    .guest
                                                                            }
                                                                        </Text>
                                                                    </View>
                                                                    <Text
                                                                        style={{
                                                                            color: this.props.PrimaryColor,
                                                                            fontSize: scale.w(1.3),
                                                                            marginTop: 5,
                                                                            letterSpacing: 0.7,
                                                                            fontFamily: 'Roboto-Medium',
                                                                        }}
                                                                    >
                                                                        {this.props.selectedLanguage
                                                                            .check_out +
                                                                            ` : ${moment(
                                                                                this.props.account.profile
                                                                                    .departure_date,
                                                                            ).format('DD MMM')}`}
                                                                    </Text>
                                                                </View>
                                                                <View style={{ flex: 1 }}></View>
                                                                <View
                                                                    style={{
                                                                        borderWidth: 1,
                                                                        borderColor: this.props.PrimaryColor,
                                                                        paddingVertical: 5,
                                                                        paddingHorizontal: 5,
                                                                        marginTop: 5,
                                                                        borderRadius: 5,
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            color: this.props.color,
                                                                            fontSize: scale.w(1.3),
                                                                            textAlign: 'center',
                                                                            letterSpacing: 1.5,
                                                                            fontFamily: 'Roboto-Regular',
                                                                        }}
                                                                    >
                                                                        {this.props.selectedLanguage
                                                                            .check_in_at +
                                                                            `: ${moment(
                                                                                this.props.account.profile
                                                                                    .arrival_date,
                                                                            ).format('LT')}`}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </ViewAnimatable>
                                                </DropShadow>
                                                <View
                                                    style={{
                                                        marginHorizontal: widthPercentageToDP(5),
                                                        marginTop: heightPercentageToDP(1.5),
                                                    }}
                                                >
                                                    <View>
                                                        <Text
                                                            style={{
                                                                fontSize: scale.w(2.3),
                                                                color: colors.DARK_GREY,
                                                                fontFamily: 'Roboto-Bold',
                                                            }}
                                                        >
                                                            {this.props.selectedLanguage.charges}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ height: heightPercentageToDP(1) }}></View>

                                                {/* <View
                        style={{
                            paddingHorizontal: widthPercentageToDP(5),
                            height: heightPercentageToDP(38),
                        }}
                    > */}
                                                {/* <FlatList
                            refreshControl={
                                <RefreshControl refreshing={false} onRefresh={this._getTransactionHistory} />
                            }
                            data={this.props.transaction_data.transaction_history}
                            ListEmptyComponent={this.listEmpty}
                            renderItem={this._renderItem}
                            showsVerticalScrollIndicator={false}
                        /> */}
                                                {this.props.transaction_data.transaction_history &&
                                                    this.props.transaction_data.transaction_history.map(
                                                        (item, index) => {
                                                            const { currency } = this.props;
                                                            console.log('item==================>', item);
                                                            console.log(
                                                                'item lenght==================>',
                                                                item,
                                                            );

                                                            return (
                                                                item.items?.length > 0 && (
                                                                    <TouchableOpacity
                                                                        // disabled={item.items.length > 0 && item.is_paid == 0 ? false : true}
                                                                        disabled={true}
                                                                        onPress={() => {
                                                                            console.log(
                                                                                this.props.transaction_data,
                                                                            );
                                                                            Navigation.push(
                                                                                this.props.componentId,
                                                                                Payment({
                                                                                    backGround: false,
                                                                                    color: this.props.color,
                                                                                    selectedLanguage:
                                                                                        this.props
                                                                                            .selectedLanguage,
                                                                                    data: this.props
                                                                                        .transactionHistoryPaymentt,
                                                                                    getTransactionHistory:
                                                                                        () => {
                                                                                            this._getTransactionHistory();
                                                                                        },
                                                                                    response: {
                                                                                        vat: this.props
                                                                                            .transaction_data
                                                                                            .vat,
                                                                                        service_charges:
                                                                                            this.props
                                                                                                .transaction_data
                                                                                                .service_charges,
                                                                                        total_price_after_tax:
                                                                                            item.total_price,
                                                                                        service_id: item.id,
                                                                                        service_type:
                                                                                            item.type,
                                                                                    },
                                                                                    profile:
                                                                                        this.props.profile,
                                                                                    typeData: this.props.type,
                                                                                }),
                                                                            );
                                                                        }}
                                                                        style={styles.transactionItem}
                                                                    >
                                                                        <View>
                                                                            <Text
                                                                                style={{
                                                                                    fontSize: scale.w(2.3),
                                                                                    color: colors.DARK_GREY,
                                                                                    fontFamily: 'Roboto-Bold',
                                                                                }}
                                                                            >
                                                                                {item.title}
                                                                            </Text>
                                                                        </View>
                                                                        <View
                                                                            style={{
                                                                                height: heightPercentageToDP(
                                                                                    1,
                                                                                ),
                                                                            }}
                                                                        ></View>
                                                                        {item.items.map((data, index) => {
                                                                            return (
                                                                                <View
                                                                                    style={{
                                                                                        flexDirection: 'row',
                                                                                        marginTop:
                                                                                            heightPercentageToDP(
                                                                                                2,
                                                                                            ),
                                                                                        opacity: 0.5,
                                                                                        justifyContent:
                                                                                            'space-between',
                                                                                    }}
                                                                                >
                                                                                    {/* <View
                                                                                        style={{
                                                                                            width: widthPercentageToDP(
                                                                                                50,
                                                                                            ),
                                                                                        }}
                                                                                    > */}
                                                                                    <Text
                                                                                        style={{
                                                                                            fontSize:
                                                                                                scale.w(1.6),
                                                                                            color: '#000',
                                                                                            fontFamily:
                                                                                                'Roboto-Regular',
                                                                                        }}
                                                                                    >
                                                                                        {data.name
                                                                                            ? data.name
                                                                                                  ?.length >
                                                                                              15
                                                                                                ? data.name.substring(
                                                                                                      0,
                                                                                                      15,
                                                                                                  ) + '...'
                                                                                                : data.name
                                                                                            : null}
                                                                                    </Text>
                                                                                    {/* </View> */}
                                                                                    <View style={{}}>
                                                                                        {item.price !== '' &&
                                                                                            item.is_paid ==
                                                                                                0 && (
                                                                                                <Text
                                                                                                    style={{
                                                                                                        fontSize:
                                                                                                            scale.w(
                                                                                                                1.6,
                                                                                                            ),
                                                                                                        color: '#000',
                                                                                                        textAlign:
                                                                                                            'right',
                                                                                                        fontFamily:
                                                                                                            'Roboto-Bold',
                                                                                                    }}
                                                                                                >
                                                                                                    {
                                                                                                        this
                                                                                                            .props
                                                                                                            .currency
                                                                                                    }{' '}
                                                                                                    {Number(
                                                                                                        data.price,
                                                                                                    ).toFixed(
                                                                                                        2,
                                                                                                    )}
                                                                                                    {/* {`${currency} ${numeral(
                                                                                                    data.price,
                                                                                                )
                                                                                                    .format(
                                                                                                        '0,0a',
                                                                                                    )
                                                                                                    .toUpperCase()}`} */}
                                                                                                </Text>
                                                                                            )}
                                                                                    </View>
                                                                                </View>
                                                                            );
                                                                        })}
                                                                        {/* <View style={{ marginBottom: scale.h(5), marginTop: scale.h(5) }}>
                    <H3>{moment(item.timeStamp).format('DD-MM-YYYY HH:mm')}</H3>
                </View> */}
                                                                    </TouchableOpacity>
                                                                )
                                                            );
                                                        },
                                                    )}
                                                <View style={{ height: heightPercentageToDP(5) }}></View>
                                            </ScrollView>
                                        </View>
                                        <View
                                            style={[
                                                styles.transactionItem,
                                                {
                                                    marginHorizontal: widthPercentageToDP(5),
                                                    backgroundColor: '',
                                                },
                                            ]}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                {/* <View style={{ width: scale.w(25.0) }}> */}
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.6),
                                                        color: '#82879D',
                                                        fontFamily: 'Roboto-Bold',
                                                    }}
                                                >
                                                    {this.props.selectedLanguage.sub_total}
                                                </Text>
                                                {/* </View> */}
                                                <View style={{}}>
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.6),
                                                            color: '#82879D',
                                                            fontFamily: 'Roboto-Bold',
                                                        }}
                                                    >
                                                        {this.props.currency}{' '}
                                                        {Number(this.state?.subTotal).toFixed(2)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    marginTop: heightPercentageToDP(2),
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.6),
                                                            color: '#82879D',
                                                            fontFamily: 'Roboto-Bold',
                                                        }}
                                                    >
                                                        {/* {this.props.selectedLanguage.tip} */}
                                                        Tip
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.6),
                                                            color: '#82879D',
                                                            fontFamily: 'Roboto-Bold',
                                                        }}
                                                    >
                                                        {this.props.currency}{' '}
                                                        {FormatMoney(
                                                            this.props.transaction_data?.service_charges,
                                                        )}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    marginTop: heightPercentageToDP(2),
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.6),
                                                            color: '#82879D',
                                                            fontFamily: 'Roboto-Bold',
                                                        }}
                                                    >
                                                        {/* {this.props.selectedLanguage.tax} */}
                                                        Tax
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.6),
                                                            color: '#82879D',
                                                            fontFamily: 'Roboto-Bold',
                                                        }}
                                                    >
                                                        {/* {this.props.currency}{' '} */}
                                                        {/* {FormatMoney(this.props.response?.vat.toFixed(1))} */}
                                                        {/* {this.props.response} */}
                                                        {this.props.currency}{' '}
                                                        {FormatMoney(this.props.transaction_data?.vat)}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    marginTop: heightPercentageToDP(2),
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.6),
                                                            color: '#82879D',
                                                            fontFamily: 'Roboto-Bold',
                                                        }}
                                                    >
                                                        {this.props.selectedLanguage.grand_total}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.6),
                                                            color: '#82879D',
                                                            fontFamily: 'Roboto-Bold',
                                                        }}
                                                    >
                                                        {this.props.currency}{' '}
                                                        {Number(this.state?.grandTotal).toFixed(2)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ height: heightPercentageToDP(1.5) }}></View>
                                        <View
                                            style={{
                                                // paddingHorizontal: scale.w(4.5),
                                                paddingBottom: scale.w(2.0),
                                                width: widthPercentageToDP(90),
                                                alignSelf: 'center',
                                            }}
                                        >
                                            <ButtonPrimary
                                                backgroundColor={this.props.PrimaryColor}
                                                //   onPress={()=>alert(JSON.stringify(this.props.response.vat))}
                                                onPress={this._handlePayNow}
                                                // onPress={() => {
                                                //     Navigation.push(
                                                //         this.props.componentId,
                                                //         Payment({
                                                //             backGround: false,
                                                //             color: this.props.color2,
                                                //             backgroundColor:this.props.PrimaryColor,
                                                //             selectedLanguage: this.props.selectedLanguage,
                                                //             getTransactionHistory: () => {},
                                                //             data: this.props.quickCheckOut,
                                                //             response: this.props.response,
                                                //             profile: this.props.profile,
                                                //             typeData: this.props.type,
                                                //         }),
                                                //     );
                                                // }}
                                                fontSize={scale.w(2)}
                                                fontFamily={'Roboto-Bold'}
                                                loading={this.state.loading}
                                                disabled={this.state.loading}
                                                text={this.props.selectedLanguage?.pay_now}
                                                chainData={this.props.chainData}
                                            />
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </RootContainer>
                </View>
                <CustomModal
                    ref={this._modalVisible}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    <View
                        style={{
                            width: widthPercentageToDP(80),
                            borderRadius: scale.w(3.0),
                            backgroundColor: colors.WHITE,
                            paddingHorizontal: 20,
                        }}
                    >
                        <TouchableOpacity
                            onPress={this._handlePayByCash}
                            style={{
                                paddingVertical: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={{ fontSize: scale.w(1.6), fontWeight: 'bold' }}>
                                {this.props.selectedLanguage?.pay_by_cash}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: colors.LIGHT_GREY }} />
                        <TouchableOpacity
                            onPress={this._handlePayByCard}
                            style={{
                                paddingVertical: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={{ fontSize: scale.w(1.6), fontWeight: 'bold' }}>
                                {this.props.selectedLanguage?.pay_by_credit_card}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </CustomModal>

                <CustomModal
                    style={{ margin: -1 }}
                    ref={this._modalPaymentFormModal}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDown"
                >
                    <PaymentFormModal
                        backgroundColor={this.props.PrimaryColor}
                        onBackClick={() => this._modalPaymentFormModal.current?.hide()}
                        onScanIconClick={() => this.scanCard()}
                        holderName={this.state.cardName}
                        onChangeHolderName={(val) => this.setState({ cardName: val })}
                        cardNumber={this.state.cardNumber}
                        onChangeCardNumber={(val) => this.setState({ cardNumber: val })}
                        cardAddress={this.state.cardAddress}
                        isLoading={this.state.loading}
                        onChangeCardAddress={(val) => this.setState({ cardAddress: val })}
                        cardExpiryDate={this.state.cardExpiryDate}
                        onChangeCardExpiry={(val) => this.setState({ cardExpiryDate: val })}
                        onChangeCVV={(val) => this.setState({ cvv: val })}
                        onPrimaryClick={() => this.cardPayment('stripe')}
                        cardSaveDisable={true}
                        cvv={this.state.cvv}
                        selectedLanguage={this.props.selectedLanguage}
                        chainData={this.props.chainData}
                    />
                </CustomModal>

                <CustomModal
                    style={{ margin: -1 }}
                    ref={this._processComplete}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDown"
                >
                    <ProcessComplete
                        backgroundColor={this.props.PrimaryColor}
                        onBackClick={() => console.log("don't go back")}
                        processImage={require('../../images/paymentPageImg.png')}
                        processTitle={this.props.selectedLanguage.checkout_successfull}
                        processDescription={
                            this.state.type == 'quick_checkout_pending'
                                ? this.props.selectedLanguage.please_proceed_to_the_counter_to_pay_bills
                                : this.props.selectedLanguage.thank_you_for_using_our_service
                        }
                        btnText={this.props.selectedLanguage.go_to_home}
                        loading={this.state.loading}
                        onButtonPress={() => {
                            Navigation.popToRoot(this.props.componentId);
                        }}
                        chainData={this.props.chainData}
                    />
                </CustomModal>
                <CustomModal ref={this._modalConfirm} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <Card
                        value={''}
                        cardHolderName={this.props.profile.cardholder_name}
                        cardNumber={this.props.profile.card_number}
                        onChangeText={(text) => {}}
                        loading={this.state.loading}
                        closeModal={() => {
                            this._modalConfirm.current?.hide();
                        }}
                        showModal={() => {
                            this.cardPayment();
                        }}
                        title={this.props.selectedLanguage?.note}
                        color={this.props.color}
                        selectedLanguage={this.props.selectedLanguage}
                        chainData={this.props.chainData}
                    />
                </CustomModal>

                {/* </ScrollView> */}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    center_mid: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navbar: {
        height: scale.h(56),
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionContainer: {
        borderTopLeftRadius: widthPercentageToDP(10),
        borderTopRightRadius: widthPercentageToDP(10),
        paddingTop: heightPercentageToDP(1),
        top: heightPercentageToDP(-5),
        backgroundColor: colors.WHITE,
    },
    transactionItem: {
        backgroundColor: 'white',
        borderRadius: scale.w(1.5),
        marginVertical: heightPercentageToDP(0.5),
        paddingVertical: heightPercentageToDP(2),
        width: widthPercentageToDP(90),
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#C1C8E4',
        paddingHorizontal: widthPercentageToDP(6),
    },
});

export default TransactionHistory;
