import React from 'react';
import {
    TouchableOpacity,
    Platform,
    Image,
    Keyboard,
    View,
    Text,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    StatusBar,
} from 'react-native';
import colors from '../../constants/colors';
import {
    heightPercentageToDP,
    heightPercentageToDP as hp,
    scale,
    widthPercentageToDP,
    widthPercentageToDP as wp,
} from '../../utils/dimensions';

import Navbar from './Navbar';

import { toast } from '../../utils/handleLogic';

import DropDownPicker from 'react-native-dropdown-picker';
import DropShadow from 'react-native-drop-shadow';
import Calendar from '../../images/calendar.svg';
import CustomModal from './CustomModal';
import ModalDatePicker from '../Restaurant/Components/ModalDatePicker';
import { format } from 'date-fns';
import { debounce, isEqual, padStart, stubString } from 'lodash';
import { Navigation } from 'react-native-navigation';
import Dot_checked from '../../images/radio_btn_checked.svg';
import Dot_unchecked from '../../images/radio_btn_unchecked.svg';
import VAT_Icon from '../../images/vat.svg';
import Tip_Icon from '../../images/tip.svg';
import PaymentFormModal from './paymentFormModal';
import Cardscan from 'react-native-cardscan';
import { RootContainer } from './Container';
import { IPaymentDetailReduxProps } from './paymentDetailScreenContainer';

export interface Taxes {
    tax_title: string;
    tax_value: string;
}
export interface IPaymentDetailScreenProps extends IPaymentDetailReduxProps {
    onPress: () => void;
    price: string;
    btnText: string;
    holderName: string;
    onChangeHolderName: (val: string) => void;
    cardNumber: string;
    onChangeCardNumber: (val: string) => void;
    cardAddress: string;
    onChangeCardAddress: (val: string) => void;
    cardExpiryDate: string;
    onChangeCardExpiry: (val: string) => void;
    cvv: string;
    onChangeCVV: (val: string) => void;
    onScanIconClick: () => void;
    onPrimaryClick: () => void;
    onBackClick: () => void;
    showModal: () => void;
    isLoading: boolean;
    onCardSave: (data?: any) => void;
    cardSave: boolean;
    cardSaveDisable: boolean;
    orderItems: any;
    selectedLanguage: any;
    taxes: Taxes[];
    componentId: any;
}

interface IPaymentDetailScreenState {
    active: string;
    dropDownOpened: boolean;
    date: string;
    time: string;
    checkBoxState: boolean;
    paymentType: string;
    nowOrSpecificTime: boolean;
    tip: number;
    vat: number;
    note: string;
    startSelected: boolean;
    loading: boolean;
    holderName: string;
    cardNumber: string;
    cardAddress: string;
    expiryDate: string;
    cvv: string;
    saveCards: boolean;
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

class PaymentDetailScreen extends React.Component<IPaymentDetailScreenProps, IPaymentDetailScreenState> {
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalDatePicker2 = React.createRef<CustomModal>();
    private _modalPaymentFormModal = React.createRef<CustomModal>();

    constructor(state: IPaymentDetailScreenState, props: IPaymentDetailScreenProps) {
        super(props);
        this.state = {
            active: 'home',
            dropDownOpened: false,
            date: '',
            time: '',
            checkBoxState: true,
            paymentType: '',
            nowOrSpecificTime: true,
            tip: 0,
            vat: 5,
            note: '',
            startSelected: false,
            loading: false,
            holderName: this.props?.holderName || '',
            cardNumber: this.props?.cardNumber || '',
            cardAddress: this.props?.cardAddress || '',
            expiryDate: this.props?.cardExpiryDate || '',
            cvv: this.props?.cvv || '',
            saveCards: false,
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
        Navigation.mergeOptions(this.props.componentId, {
            statusBar: {
                backgroundColor: this.props.backgroundColor,
                style: 'light',
            },
        });
        this._handleModalDatePicker = this._handleModalDatePicker.bind(this);
        // this._onDayPress = this._onDayPress.bind(this);
        // this._getMarkedDates = this._getMarkedDates.bind(this);
        this._handleModalDatePicker2 = this._handleModalDatePicker2.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._onChangeDate2 = this._onChangeDate2.bind(this);
        this._handleModalBack = this._handleModalBack.bind(this);
        this.scanCard = this.scanCard.bind(this);
        this._placeOrder = this._placeOrder.bind(this);
    }

    async componentDidMount() {
        let total_tax = 0;
        this.props.taxes === null
            ? (total_tax = 0)
            : this.props.taxes.map((item, i) => {
                  total_tax = total_tax + parseFloat(item.tax_value);
              });
        console.log('total tax', total_tax);
        this.setState({
            chainData: this?.props?.chainData,
            holderName: this?.props?.holderName,
            cardNumber: this?.props?.cardNumber,
            cardAddress: this?.props?.cardAddress,
            expiryDate: this?.props?.cardExpiryDate,
            cvv: this?.props?.cvv,
            vat: total_tax,
        });

        console.log(
            'TIPS',
            this.props.charges,
            this.state.tip,
            typeof this.props.charges,
            typeof this.state.tip,
        );
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
                                holderName: cardholderName,
                                expiryDate: expiryMonth
                                    ? `${padStart(expiryMonth.toString(), 2, '0')}/${expiryYear
                                          .toString()
                                          .substr(2)}`
                                    : '',
                            });
                            this._modalPaymentFormModal.current?.show();
                        } else {
                            this._modalPaymentFormModal.current?.show();
                        }
                        console.log(
                            'number   ',
                            number + ' name      ',
                            cardholderName + 'expiry   ' + expiryMonth + '       ' + expiryYear,
                        );
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
                            // this._modalManualData.current?.show();
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
                console.log('nottttttttt supporteddddddddddddddddd', supported);
            }
        });
    }

    _handleModalBack() {
        this._modalPaymentFormModal.current?.hide();
    }

    _handleModalDatePicker(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalDatePicker.current) {
                if (closeModal) {
                    this._modalDatePicker.current.hide();
                } else {
                    this._modalDatePicker.current.show();
                    this.setState({ date: new Date().toString() });
                }
            }
        };
    }

    _handleModalDatePicker2(closeModal?: boolean) {
        console.log('close modalll', closeModal);
        return () => {
            if (this.state.date != '') {
                Keyboard.dismiss();
                if (this._modalDatePicker2.current) {
                    if (closeModal) {
                        this._modalDatePicker2.current.hide();
                    } else {
                        this._modalDatePicker2.current.show();
                        this.setState({ time: new Date().toString() });
                    }
                }
            } else {
                toast(this.props.selectedLanguage.please_select_date_and_time_first);
            }
        };
    }

    _onChangeDate(date: Date) {
        console.log('dateeee', date);
        // this.setState((prevState) => {
        //     if (prevState.booking_date) {
        //         return {
        //             ...prevState,
        //             booking_date: date.toString(),
        //         };
        //     }

        //     return {
        //         ...prevState,
        //         booking_date: date.toString(),
        //     };
        // });
        this.setState({
            date: date.toString(),
            nowOrSpecificTime: false,
            startSelected: true,
        });
    }

    _onChangeDate2(date: Date) {
        this.setState((prevState) => {
            if (prevState.time) {
                return {
                    ...prevState,
                    time: date.toString(),
                    nowOrSpecificTime: false,
                };
            }

            return {
                ...prevState,
                time: date.toString(),
                nowOrSpecificTime: false,
            };
        });
    }

    _placeOrder() {
        if (
            this.state.paymentType == '' ||
            this.state.paymentType == undefined ||
            this.state.paymentType == null
        ) {
            toast(this.props.selectedLanguage.please_select_payment_type);
            return 0;
        }
        if (this.state.nowOrSpecificTime == false && (this.state.date == '' || this.state.time == '')) {
            toast(this.props.selectedLanguage.date_and_time_cant_be_empty);
            return 0;
        }
        // if(this.state.holderName == '' || this.state.cvv == '' || this.state.expiryDate == '' || this.state.cardNumber == '' || this.state.cardAddress == ''){
        //     toast('Please enter the valid card details')
        // }

        this.setState({
            loading: true,
        });
        if (this.state.paymentType == 'cash') {
            this.props
                .orderItems({
                    paymentType: this.state.paymentType,
                    now: this.state.nowOrSpecificTime,
                    date: this.state.nowOrSpecificTime ? new Date() : this.state.date,
                    time: this.state.nowOrSpecificTime ? new Date() : this.state.time,
                    tip: this.state.tip,
                    notes: this.state.note,
                    cvv: this.state.cvv,
                    expiryDate: this.state.expiryDate,
                    cardNumber: this.state.cardNumber,
                    cardAddress: this.state.cardAddress,
                    holderName: this.state.holderName,
                    saveCards: this.state.saveCards,
                })
                .then((i) => {
                    Navigation.pop(this.props.componentId);
                    this.setState({
                        loading: false,
                    });
                })
                .catch((err) => {
                    this.setState({
                        loading: false,
                    });
                });
        } else {
            this.setState({
                loading: false,
            });
            this._modalPaymentFormModal.current?.show();
        }
    }

    render() {
        console.log(this.props);
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: heightPercentageToDP(20), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: this.props.backgroundColor,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && (
                    <StatusBar backgroundColor={this.props.backgroundColor}></StatusBar>
                )}

                <RootContainer>
                    <View
                        style={{
                            height: heightPercentageToDP(14),
                            backgroundColor: this.props.backgroundColor,
                        }}
                    >
                        {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                        <Navbar
                            tintBackColor={colors.WHITE}
                            titleColor={colors.WHITE}
                            onSearchClick={() => console.log('clicked')}
                            onClickRight={() => console.log('clicked')}
                            onClick={() => {
                                Navigation.pop(this.props.componentId);
                            }}
                            title={this?.props?.selectedLanguage?.payment_screen}
                        />
                        {/* </ImageBackground> */}
                    </View>

                    <View
                        style={{
                            width: widthPercentageToDP(100),
                            backgroundColor: colors.WHITE,
                            top: -heightPercentageToDP(4.3),
                            borderTopLeftRadius: scale.w(3.5),
                            borderTopRightRadius: scale.w(3.5),
                            paddingTop: heightPercentageToDP(0.75),
                        }}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View
                                style={{
                                    marginTop: heightPercentageToDP(2),
                                }}
                            >
                                <DropShadow
                                    style={{
                                        shadowOffset: {
                                            width: 0,
                                            height: 5,
                                        },
                                        shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            paddingVertical: hp(3),
                                            paddingHorizontal: wp(4),
                                            width: wp(90),
                                            height: this.state.dropDownOpened ? hp(26) : hp(17),
                                            alignSelf: 'center',
                                            borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                            borderWidth: 1,
                                            borderRadius: 15,
                                            backgroundColor: colors.WHITE,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.6),
                                                fontFamily: 'Roboto-Medium',
                                                color: colors.DUMMY_COLOR,
                                            }}
                                        >
                                            {' '}
                                            {this?.props?.selectedLanguage?.payment_type}
                                        </Text>
                                        <View style={{ height: hp(2) }} />
                                        {/* <View
                                        style={{
                                            backgroundColor: colors.COM_BACKGROUND,
                                            paddingHorizontal: wp(1),
                                            //    flexDirection: 'row',
                                            //  alignItems: 'center',
                                            //justifyContent: 'space-between',
                                            width: wp(82),
                                            height: hp(8),
                                            marginTop: hp(2),
                                        }}
                                    > */}

                                        <DropDownPicker
                                            //   disabled={this.props.isCheckedIn}
                                            items={[
                                                {
                                                    label: this?.props?.selectedLanguage?.cash,
                                                    value: 'cash',
                                                },
                                                {
                                                    label: this?.props?.selectedLanguage?.card,
                                                    value: 'card',
                                                },
                                            ]}
                                            placeholder={this?.props?.selectedLanguage?.select_payment_type}
                                            labelStyle={{ color: colors.DUMMY_COLOR }}
                                            activeLabelStyle={{ color: colors.DUMMY_COLOR }}
                                            onOpen={() => {
                                                this.setState({
                                                    dropDownOpened: !this.state.dropDownOpened,
                                                });
                                            }}
                                            onClose={() => {
                                                this.setState({
                                                    dropDownOpened: !this.state.dropDownOpened,
                                                });
                                            }}
                                            containerStyle={{
                                                height: hp(6),

                                                width: '100%',
                                            }}
                                            style={{
                                                //   alignItems: 'center',
                                                // justifyContent: 'center',
                                                //  width: wp(100),
                                                height: hp(15),
                                                borderTopLeftRadius: scale.w(1.8),
                                                borderTopRightRadius: scale.w(1.8),
                                                borderBottomLeftRadius: scale.w(1.8),
                                                borderBottomRightRadius: scale.w(1.8),
                                                borderWidth: 1,
                                                borderColor: colors.WHITE,
                                                borderRadius: 15,
                                                backgroundColor: colors.COM_BACKGROUND,
                                            }}
                                            arrowStyle={{
                                                marginRight: widthPercentageToDP(2),
                                            }}
                                            arrowColor={'#121924'}
                                            itemStyle={{
                                                justifyContent: 'flex-start',
                                                width: wp(90),
                                                borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                            }}
                                            dropDownStyle={{
                                                backgroundColor: colors.WHITE,
                                                width: wp(81),
                                                alignSelf: 'center',
                                                borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                            }}
                                            onChangeItem={async (item) => {
                                                await this.setState({
                                                    paymentType: item.value,
                                                });
                                            }}
                                        />

                                        {/* </View> */}
                                    </View>
                                </DropShadow>
                                <View style={{ height: hp(2.5) }} />
                                <DropShadow
                                    style={{
                                        shadowOffset: {
                                            width: 0,
                                            height: 5,
                                        },
                                        shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            paddingVertical: hp(3),
                                            paddingHorizontal: wp(4),
                                            width: wp(90),
                                            alignSelf: 'center',
                                            borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                            borderWidth: 1,
                                            borderRadius: 15,
                                            backgroundColor: colors.WHITE,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.6),
                                                fontFamily: 'Roboto-Medium',
                                                opacity: 1,
                                                color: colors.DUMMY_COLOR,
                                            }}
                                        >
                                            {' '}
                                            {this?.props?.selectedLanguage?.time}
                                        </Text>
                                        <View style={{ height: hp(2) }} />
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                            onPress={() => {
                                                this.setState({
                                                    nowOrSpecificTime: true,
                                                    date: '',
                                                    time: '',
                                                });
                                            }}
                                        >
                                            <DropShadow
                                                style={{
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 3,
                                                    },
                                                    shadowColor: '#000',
                                                    shadowOpacity: 0.16,
                                                    shadowRadius: 6,
                                                }}
                                            >
                                                {this.state.nowOrSpecificTime ? (
                                                    <Dot_checked
                                                        height={heightPercentageToDP(3)}
                                                        width={heightPercentageToDP(3)}
                                                        fill="red"
                                                    />
                                                ) : (
                                                    <Dot_unchecked
                                                        height={heightPercentageToDP(3)}
                                                        width={heightPercentageToDP(3)}
                                                    ></Dot_unchecked>
                                                )}
                                            </DropShadow>

                                            <View style={{ width: widthPercentageToDP(2) }} />
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Medium',
                                                    color: colors.DUMMY_COLOR,
                                                    paddingHorizontal: widthPercentageToDP(1),
                                                }}
                                            >
                                                {this?.props?.selectedLanguage?.now}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,

                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justiifyContent: 'space-between',
                                                //  width: wp(82),
                                                marginTop: hp(2),
                                                paddingHorizontal: wp(4),
                                                borderRadius: 15,
                                                height: heightPercentageToDP(6),
                                            }}
                                            onPress={debounce(this._handleModalDatePicker(false), 1000, {
                                                leading: true,
                                                trailing: false,
                                            })}
                                        >
                                            <View style={{ width: wp(66), color: colors.DUMMY_COLOR }}>
                                                <Text
                                                    style={{
                                                        color: colors.DUMMY_COLOR,
                                                        fontFamily: 'Roboto-Regular',
                                                    }}
                                                >
                                                    {this.state.date === ''
                                                        ? this?.props?.selectedLanguage?.specific_date
                                                        : this.props.selectedLanguage.date +
                                                          ' : ' +
                                                          format(this.state.date, 'DD/MM/YYYY')}
                                                </Text>
                                            </View>
                                            <Calendar style={{ paddingHorizontal: widthPercentageToDP(4) }} />
                                            {/* <DIcon
                                    name={'calendar-today'}
                                    style={{ opacity: 0.5 }}
                                    size={20}
                                    color={colors.DARK_GREY}
                                ></DIcon> */}
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,

                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justiifyContent: 'space-between',
                                                //  width: wp(82),
                                                marginTop: hp(2),
                                                paddingHorizontal: wp(4),
                                                borderRadius: 15,
                                                height: heightPercentageToDP(6),
                                            }}
                                            onPress={debounce(this._handleModalDatePicker2(false), 1000, {
                                                leading: true,
                                                trailing: false,
                                            })}
                                        >
                                            <View style={{ width: wp(66), color: colors.DUMMY_COLOR }}>
                                                <Text
                                                    style={{
                                                        color: colors.DUMMY_COLOR,
                                                        fontFamily: 'Roboto-Regular',
                                                    }}
                                                >
                                                    {this.state.time === ''
                                                        ? this?.props?.selectedLanguage?.specific_time
                                                        : this.props.selectedLanguage.time +
                                                          ' : ' +
                                                          format(this.state.time, ' HH:mm')}
                                                </Text>
                                            </View>
                                            <Calendar style={{ paddingHorizontal: widthPercentageToDP(4) }} />
                                        </TouchableOpacity>
                                    </View>
                                </DropShadow>
                                <View style={{ height: hp(2.5) }} />
                                <DropShadow
                                    style={{
                                        shadowOffset: {
                                            width: 0,
                                            height: 5,
                                        },
                                        shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            // paddingVertical: hp(3),
                                            // paddingHorizontal: wp(4),
                                            // width: wp(90),
                                            // height: this.state.dropDownOpened ? hp(30) : hp(19),
                                            // alignSelf: 'center',
                                            // borderColor : colors.CHECKIN_SCREEN_BORDER_COLOR,
                                            // borderWidth : 1,
                                            // borderRadius: 15,
                                            // backgroundColor: colors.WHITE,
                                            paddingVertical: hp(3),
                                            paddingHorizontal: wp(4),
                                            width: wp(90),
                                            alignSelf: 'center',
                                            borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                            borderWidth: 1,
                                            borderRadius: 15,
                                            backgroundColor: colors.WHITE,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.6),
                                                fontFamily: 'Roboto-Medium',
                                                color: colors.DUMMY_COLOR,
                                            }}
                                        >
                                            {' '}
                                            {this?.props?.selectedLanguage?.want_to_add_tip} (
                                            {this?.props?.selectedLanguage?.optional})
                                        </Text>
                                        {/* <View style={{height : hp(2)}}/> */}
                                        {/* <View
                                        style={{
                                            backgroundColor: colors.COM_BACKGROUND,
                                            paddingHorizontal: wp(1),
                                            //    flexDirection: 'row',
                                            //  alignItems: 'center',
                                            //justifyContent: 'space-between',
                                            width: wp(82),
                                            height: hp(8),
                                            marginTop: hp(2),
                                        }}
                                    > */}
                                        <View
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,
                                                height: heightPercentageToDP(6),
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justiifyContent: 'space-between',
                                                //  width: wp(82),
                                                marginTop: hp(2),
                                                //      paddingHorizontal: wp(4),
                                                borderRadius: 15,
                                            }}
                                        >
                                            <TextInput
                                                // label={booking_from}
                                                editable={true}
                                                style={{
                                                    width: wp(66),
                                                    paddingHorizontal: wp(4),
                                                    backgroundColor: colors.COM_BACKGROUND,
                                                    alignItems: 'center',
                                                    borderRadius: 15,
                                                    color: colors.DUMMY_COLOR,
                                                }}
                                                placeholderTextColor={colors.DUMMY_COLOR}
                                                // editable={this.props.isCheckedIn == false ? true : false}
                                                // value={reference}
                                                keyboardType={'numeric'}
                                                maxLength={2}
                                                onChangeText={(tip) => {
                                                    this.setState({
                                                        tip:
                                                            tip === ''
                                                                ? 0
                                                                : tip.startsWith('.')
                                                                ? `0${tip}`
                                                                : tip,
                                                    });
                                                }}
                                                value={this.state.tip}
                                            ></TextInput>

                                            <Tip_Icon style={{ marginLeft: widthPercentageToDP(6.5) }} />
                                        </View>
                                        {/* </View> */}
                                    </View>
                                </DropShadow>
                                <View style={{ height: hp(2.5) }} />
                                {this.props?.taxes?.map((item, index) => (
                                    <>
                                        <DropShadow
                                            style={{
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 5,
                                                },
                                                shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                                shadowOpacity: 0.25,
                                                shadowRadius: 10,
                                            }}
                                            key={index}
                                        >
                                            <View
                                                style={{
                                                    paddingVertical: hp(3),
                                                    paddingHorizontal: wp(4),
                                                    width: wp(90),
                                                    alignSelf: 'center',
                                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                                    borderWidth: 1,
                                                    borderRadius: 15,
                                                    backgroundColor: colors.WHITE,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.6),
                                                        fontFamily: 'Roboto-Medium',
                                                        color: colors.DUMMY_COLOR,
                                                    }}
                                                >
                                                    {' '}
                                                    {/* {this?.props?.selectedLanguage?.vat}{' '}
                                                    {this?.props?.selectedLanguage?.and}{' '}
                                                    {this?.props?.selectedLanguage?.service_fee} */}
                                                    {item.tax_title}
                                                </Text>
                                                <View
                                                    style={{
                                                        backgroundColor: colors.COM_BACKGROUND,
                                                        height: heightPercentageToDP(6),

                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justiifyContent: 'space-between',
                                                        //  width: wp(82),
                                                        marginTop: hp(2),
                                                        //  paddingHorizontal: wp(4),
                                                        borderRadius: 15,
                                                    }}
                                                >
                                                    <TextInput
                                                        // label={booking_from}
                                                        editable={false}
                                                        style={{
                                                            width: wp(66),
                                                            paddingHorizontal: wp(4),
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            alignItems: 'center',
                                                            borderRadius: 15,
                                                            color: colors.DUMMY_COLOR,
                                                        }}
                                                        placeholderTextColor={colors.DUMMY_COLOR}
                                                        editable={false}
                                                        value={this.state.vat}
                                                        // onChangeText={(note) => this.setState({ note })}
                                                        placeholder={item?.tax_value?.toString()}
                                                    ></TextInput>
                                                    {/* <VAT_Icon style={{ marginLeft: widthPercentageToDP(6.5) }} /> */}
                                                    <Tip_Icon
                                                        style={{ marginLeft: widthPercentageToDP(6.5) }}
                                                    />
                                                </View>
                                                {/* </View> */}
                                            </View>
                                        </DropShadow>
                                        <View style={{ height: hp(2.5) }} />
                                    </>
                                ))}

                                <DropShadow
                                    style={{
                                        shadowOffset: {
                                            width: 0,
                                            height: 5,
                                        },
                                        shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            paddingVertical: hp(3),
                                            paddingHorizontal: wp(4),
                                            marginTop: hp(2),
                                            width: wp(90),
                                            alignSelf: 'center',
                                            borderWidth: 1,
                                            borderRadius: scale.w(2),
                                            borderColor: '#EBF0F9',
                                            backgroundColor: colors.WHITE,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.6),
                                                fontFamily: 'Roboto-Medium',
                                                color: colors.DUMMY_COLOR,
                                            }}
                                        >
                                            {this?.props?.selectedLanguage?.notes} (
                                            {this?.props?.selectedLanguage?.optional})
                                        </Text>
                                        <View style={{ height: heightPercentageToDP(1) }}></View>
                                        <TextInput
                                            placeholder={
                                                this?.props?.selectedLanguage?.type_something_you_want_here
                                            }
                                            // value={this.state.note_request}
                                            multiline={true}
                                            numberOfLines={3}
                                            textAlignVertical="top"
                                            value={this.state.note}
                                            onChangeText={(note) => this.setState({ note })}
                                            autoCapitalize="none"
                                            style={{
                                                fontSize: scale.w(1.6),
                                                color: '#C5CEE0',
                                                width: wp(80),
                                                height: hp(7),
                                            }}
                                            placeholderTextColor={'#C5CEE0'}
                                        ></TextInput>
                                    </View>
                                </DropShadow>

                                {/* <View style={{ flexDirection: 'row', alignItems : 'center' }}>
                            {
                                
                                this.state.checkBoxState ?
                                <TouchableOpacity
                                onPress={()=>this.setState({checkBoxState:!this.state.checkBoxState})}
                                >
                                    <Checked_Box
                                style={{ alignSelf: 'flex-start' ,paddingHorizontal:widthPercentageToDP(5)}}
                                    />
                                </TouchableOpacity>
                               :
                                <TouchableOpacity
                                onPress={()=>this.setState({checkBoxState:!this.state.checkBoxState})}
                                >
                                     <UnChecked_Box
                            style={{ alignSelf: 'flex-start' ,paddingHorizontal:widthPercentageToDP(5)}}
                                />
                                </TouchableOpacity>
                               
                                }
                                <Text
                                    style={{
                                        //    textAlign: 'center',
                                        fontFamily: 'Roboto-Regular',
                                        color: '#1A1A1A',
                                        fontSize: scale.w(2),
                                    }}
                                >
                                    Save this card for future payments?
                                </Text>
                            </View> */}

                                <View style={{ height: hp(5) }} />
                                <DropShadow
                                    style={{
                                        shadowOffset: {
                                            width: 0,
                                            height: 3,
                                        },
                                        shadowColor: '#000',
                                        shadowOpacity: 0.15,
                                        shadowRadius: 6,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            height: wp(15),
                                            paddingHorizontal: wp(5),
                                            width: wp(90),
                                            alignSelf: 'center',
                                            borderRadius: 15,
                                            marginTop: hp(3),
                                            backgroundColor: this.props.backgroundColor,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                        activeOpacity={1}
                                        onPress={this._placeOrder}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.4),
                                                    color: colors.WHITE,
                                                    alignSelf: 'center',
                                                    fontFamily: 'Roboto-Light',
                                                }}
                                            >
                                                {this?.props?.selectedLanguage?.order_price} :{' '}
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.6),
                                                        color: colors.WHITE,
                                                        alignSelf: 'center',
                                                        fontFamily: 'Roboto-Bold',
                                                        paddingHorizontal: wp(3.5),
                                                    }}
                                                >
                                                    {`${this.props.currency} ${Number.parseFloat(
                                                        parseFloat(this.props.charges) +
                                                            (parseFloat(this.props.charges) *
                                                                parseFloat(this.state.tip)) /
                                                                100 +
                                                            (parseFloat(this.props.charges) *
                                                                parseFloat(this.state.vat)) /
                                                                100,
                                                    ).toFixed(2)}`}
                                                </Text>
                                            </Text>
                                        </View>
                                        {this.state.loading ? (
                                            <View
                                                style={{
                                                    width: widthPercentageToDP(20),
                                                    height: heightPercentageToDP(3.5),
                                                    alignSelf: 'center',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Image
                                                    resizeMode="cover"
                                                    style={{
                                                        height: heightPercentageToDP(4),
                                                        width: widthPercentageToDP(18),
                                                        marginTop: -heightPercentageToDP(1),
                                                    }}
                                                    source={{
                                                        uri: this?.state?.chainData?.data?.logo_gif_light,
                                                    }}
                                                />
                                            </View>
                                        ) : (
                                            <Text
                                                style={{
                                                    fontSize: scale.w(2.0),
                                                    color: colors.WHITE,
                                                    fontFamily: 'Roboto-Bold',
                                                    alignSelf: 'center',
                                                }}
                                            >
                                                {this?.props?.selectedLanguage?.checkout}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </DropShadow>
                            </View>
                            <View style={{ height: hp(15) }} />
                        </ScrollView>
                    </View>

                    <CustomModal
                        ref={this._modalDatePicker}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <ModalDatePicker
                            date={new Date(this.state.date)}
                            minimumDate={new Date()}
                            dateSelected={true}
                            color={this.props.backgroundColor}
                            onDateChange={this._onChangeDate}
                            showModal={this._handleModalDatePicker(true)}
                            title={this?.props?.selectedLanguage?.select_date}
                            otherText={{
                                date: this?.props?.selectedLanguage?.date,
                                month: this?.props?.selectedLanguage?.month,
                                year: this?.props?.selectedLanguage?.year,
                                minutes: this?.props?.selectedLanguage?.minutes,
                                hours: this?.props?.selectedLanguage?.hours,
                                ok: this?.props?.selectedLanguage?.okay,
                            }}
                            chainData={this.props.chainData}
                        />
                    </CustomModal>

                    <CustomModal
                        ref={this._modalDatePicker2}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <ModalDatePicker
                            date={new Date(this.state.time)}
                            startSelected={true}
                            minimumDate={new Date(this.state.time)}
                            color={this.props.backgroundColor}
                            onDateChange={this._onChangeDate2}
                            showModal={this._handleModalDatePicker2(true)}
                            title={this.props.selectedLanguage.select_time}
                            otherText={{
                                date: this.props.selectedLanguage.date,
                                month: this.props.selectedLanguage.month,
                                year: this.props.selectedLanguage.year,
                                minutes: this.props.selectedLanguage.minutes,
                                hours: this.props.selectedLanguage.hours,
                                ok: this.props.selectedLanguage.okay,
                            }}
                            chainData={this.props.chainData}
                        />
                    </CustomModal>
                    <CustomModal
                        style={{ margin: -1 }}
                        ref={this._modalPaymentFormModal}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <PaymentFormModal
                            backgroundColor={this.props.backgroundColor}
                            onBackClick={this._handleModalBack}
                            onScanIconClick={() => this.scanCard()}
                            holderName={this.state.holderName}
                            onChangeHolderName={(val) => this.setState({ holderName: val })}
                            cardNumber={this.state.cardNumber}
                            onChangeCardNumber={(val) => this.setState({ cardNumber: val })}
                            cardAddress={this.state.cardAddress}
                            isLoading={this.state.loading}
                            onChangeCardAddress={(val) => this.setState({ cardAddress: val })}
                            cardExpiryDate={this.state.expiryDate}
                            onChangeCardExpiry={(val) => this.setState({ expiryDate: val })}
                            onChangeCVV={(val) => this.setState({ cvv: val })}
                            cardSave={this.state.saveCards}
                            cvv={this.state.cvv}
                            selectedLanguage={this.props.selectedLanguage}
                            chainData={this.props.chainData}
                            onCardSave={(val) => {
                                this.setState({
                                    saveCards: val,
                                });
                            }}
                            onPrimaryClick={() => {
                                if (
                                    this.state.holderName == '' ||
                                    this.state.cardNumber == '' ||
                                    this.state.cardAddress == '' ||
                                    this.state.expiryDate == '' ||
                                    this.state.cvv == ''
                                ) {
                                    toast(this.props.selectedLanguage.please_enter_all_details_to_proceed);
                                } else {
                                    this.setState({
                                        loading: true,
                                    });
                                    this.props
                                        .orderItems({
                                            paymentType: this.state.paymentType,
                                            now: this.state.nowOrSpecificTime,
                                            date: this.state.nowOrSpecificTime ? new Date() : this.state.date,
                                            time: this.state.nowOrSpecificTime ? new Date() : this.state.time,
                                            tip: this.state.tip,
                                            notes: this.state.note,
                                            cvv: this.state.cvv,
                                            expiryDate: this.state.expiryDate,
                                            cardNumber: this.state.cardNumber,
                                            cardAddress: this.state.cardAddress,
                                            holderName: this.state.holderName,
                                            saveCards: this.state.saveCards,
                                        })
                                        .then((i) => {
                                            this._modalPaymentFormModal.current?.hide();
                                            Navigation.pop(this.props.componentId);
                                            this.setState({
                                                loading: false,
                                            });
                                        })
                                        .catch((err) => {
                                            this.setState({
                                                loading: false,
                                            });
                                        });
                                }
                            }}

                            //onPrimaryClick={() => console.log('Hello')}
                        />
                    </CustomModal>
                </RootContainer>
            </KeyboardAvoidingView>
        );
    }
}

export default PaymentDetailScreen;
