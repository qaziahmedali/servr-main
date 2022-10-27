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
    BackHandler,
} from 'react-native';
import { Image, View as ViewAnimatable } from 'react-native-animatable';
import DropShadow from 'react-native-drop-shadow';
import { ICardDetailsReduxProps } from './CardDetails.container';
import Navbar from '../_global/Navbar';
import colors from '../../constants/colors';
import { IFeatureHotel } from '../../types/hotel';
import { Navigation } from 'react-native-navigation';
import { mainmenu, ProfileData, restoMain, chat } from '../../utils/navigationControl';
import {
    heightPercentageToDP,
    heightPercentageToDP as hp,
    scale,
    widthPercentageToDP,
    widthPercentageToDP as wp,
} from '../../utils/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { debounce, isEqual, padStart, stubString, find, findIndex } from 'lodash';
import { ButtonPrimary } from '../_global/Button';
import Cardscan from 'react-native-cardscan';
import CustomModal from '../_global/CustomModal';
import { TextInputMask } from 'react-native-masked-text';
import { toast, validateMMYY } from '../../utils/handleLogic';
// import { TextInput } from 'react-native-gesture-handler';
import ScanCard from '../../images/ScanCard.svg';
import FieldFormWithMask from '../LostAndFound/Component/FieldFormWithMask';
import Field from '../LostAndFound/Component/field';
import { RootContainer } from '../_global/Container';
export interface ICardDetailsProps extends ICardDetailsReduxProps {
    componentId: string;
}

interface ICardDetailsState {
    loading: boolean;
    code: string;
    marginLeft: number;
    modalVisible: boolean;
    email: string;
    password: string;
    type: string;
    visible: boolean;
    text: string;
    holderName: string;
    cvv: null | string;
    cardNumber: string;
    expiryDate: string;
    description: string;
    cardEdit: boolean;
    fullCardNumber: string;
    requestLoading: boolean;
    nameEdit: boolean;
    edited: number;
    disableScan: boolean;
    CVV: any;
    EXPIRY_DATE: any;
    cardAddress: any;
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

class CardDetails extends React.Component<ICardDetailsProps, ICardDetailsState> {
    private _modalPaymentFormModal = React.createRef<CustomModal>();
    constructor(props: ICardDetailsProps) {
        super(props);

        this.state = {
            loading: true,
            code: '',
            marginLeft: scale.w(100),
            modalVisible: false,
            email: '',
            password: '',
            type: '',
            visible: false,
            text: '',
            holderName: '',
            cardNumber: '',
            cvv: '***',
            expiryDate: '',
            description: '',
            cardEdit: false,
            fullCardNumber: '',
            requestLoading: false,
            nameEdit: false,
            edited: 0,
            disableScan: false,
            EXPIRY_DATE: '',
            CVV: '',
            cardAddress: '',
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
        this.scanCard = this.scanCard.bind(this);
        this._handleUpdateCardDetails = this._handleUpdateCardDetails.bind(this);
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

    scanCard() {
        this.setState({
            disableScan: true,
        });
        Keyboard.dismiss();
        this.setState({
            cardEdit: true,
        });
        Cardscan.isSupportedAsync().then((supported) => {
            console.log(supported);
            if (supported) {
                Cardscan.scan().then(({ action, payload, canceled_reason }) => {
                    if (action === 'scanned') {
                        console.log(payload);
                        const { number, expiryMonth, expiryYear, issuer, cardholderName } = payload;
                        console.log(number, cardholderName, issuer, expiryYear);
                        if (number) {
                            console.log(number, expiryYear, expiryMonth, cardholderName);
                            this.setState({
                                fullCardNumber: number,
                                holderName: cardholderName ? cardholderName : this.state.holderName,
                                expiryDate: expiryMonth
                                    ? `${padStart(expiryMonth.toString(), 2, '0')}/${expiryYear
                                          .toString()
                                          .substr(2)}`
                                    : '',
                                //   edited: 1,
                                disableScan: false,
                            });
                        } else {
                            this.setState({
                                fullCardNumber: '',
                                holderName: '',
                                expiryDate: '',
                                disableScan: false,
                            });
                        }
                        console.log(
                            'number   ',
                            number + ' name      ',
                            cardholderName + 'expiry   ' + expiryMonth + '       ' + expiryYear,
                        );
                        // Display information
                    } else if (action === 'canceled') {
                        this.setState({
                            disableScan: false,
                        });
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

    componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        });
        this.setState({
            cardNumber: this.props.cardDetails?.card_number,
            holderName: this.props.cardDetails?.cardholder_name,
            //ABC
            CVV: this.props.cardDetails?.card_cvv_number,
            EXPIRY_DATE:
                this.props.cardDetails?.card_expiry_date != '0000-00-00'
                    ? this.props.cardDetails?.card_expiry_date
                    : null,
            cvv: this.props.cardDetails?.card_cvv_number,
            expiryDate:
                this.props.cardDetails?.card_expiry_date != '0000-00-00'
                    ? this.props.cardDetails?.card_expiry_date
                    : null,
            description: this.props.cardDetails.card_description,
            fullCardNumber: this.props.cardDetails.card_number_full,
            cardAddress: this.props.cardDetails.card_address,
            loading: false,
        });
        // this.props.getCardDetails(
        //     (res) => {
        //         console.log('CARDDETAILS', res.card_details);
        //         console.log('CARDDETAILS', JSON.stringify(res.card_details));

        //         this.setState({
        //             cardNumber: res.card_details?.card_number,
        //             holderName: res.card_details?.cardholder_name,
        //             //ABC
        //             CVV: res.card_details?.card_cvv_number,
        //             EXPIRY_DATE:
        //                 res.card_details?.card_expiry_date != '0000-00-00'
        //                     ? res.card_details?.card_expiry_date
        //                     : null,
        //             cvv: res.card_details?.card_cvv_number,
        //             expiryDate:
        //                 res.card_details?.card_expiry_date != '0000-00-00'
        //                     ? res.card_details?.card_expiry_date
        //                     : null,
        //             description: res.card_details.card_description,
        //             fullCardNumber: res.card_details.card_number_full,
        //             cardAddress: res.card_details.card_address,
        //             loading: false,
        //         });
        //     },
        //     () => {
        //         console.log('errorrrrrrrr   ');
        //         this.setState({
        //             loading: false,
        //         });
        //     },
        // );
    }

    _handleBack() {
        if (Platform.OS == 'ios') {
            Navigation.pop(this.props.componentId);
        } else {
            if (this.props.backGround) {
                Navigation.push(this.props.componentId, mainmenu);
            } else {
                Navigation.pop(this.props.componentId);
            }
        }
    }

    _handleUpdateCardDetails() {
        if (this.state.edited == 0 && this.state.CVV != null && this.state.EXPIRY_DATE != null) {
            toast(this.props.selectedLanguage.nothing_to_be_updated);
        } else {
            if (this.state.holderName == '' || this.state.holderName == null) {
                toast(this.props.selectedLanguage.please_enter_cardholder_name);
                return 0;
            }
            if (this.state.fullCardNumber == '' || this.state.fullCardNumber == null) {
                toast(this.props.selectedLanguage.please_enter_your_card_number);
                return 0;
            }
            if (this.state.fullCardNumber.length < 19) {
                toast(this.props.selectedLanguage.please_enter_valid_card_number);
                return 0;
            }
            if (this.state.expiryDate == '' || this.state.expiryDate == null) {
                toast(this.props.selectedLanguage.please_enter_your_card_expiry_date);
                return 0;
            }
            if (validateMMYY(this.state.expiryDate) != true) {
                toast(this.props.selectedLanguage.please_enter_valid_card_expiry_date);
                return 0;
            }
            if (this.state.cvv == '' || this.state.cvv == null) {
                toast(this.props.selectedLanguage.please_enter_your_card_cvv);
                return 0;
            }
            if (this.state.cardAddress == '' || this.state.cardAddress == null) {
                toast(this.props.selectedLanguage.please_enter_your_card_address);
                return 0;
            }
            if (this.state.description == '' || this.state.description == null) {
                toast(this.props.selectedLanguage.please_enter_relevant_description);
                return 0;
            }

            this.setState({
                requestLoading: true,
            });
            if (this.state.expiryDate != '' && this.state.holderName != '') {
                this.props.updateCardDetails(
                    {
                        card_number: this.state.fullCardNumber,
                        cardholder_name: this.state.holderName,
                        card_expiry_month: this.state.expiryDate,
                        card_cvv_number: this.state.cvv,
                        card_description: this.state.description,
                        card_address: this.state.cardAddress,
                    },
                    () => {
                        this.props.getCardDetails();
                        this.setState({
                            requestLoading: false,
                        });
                        toast(this.props.selectedLanguage.card_details_updated);
                        Navigation.pop(this.props.componentId);
                    },
                    () => {
                        this.setState({
                            requestLoading: false,
                        });
                    },
                );
            } else {
                this.setState({
                    requestLoading: false,
                });
                toast(this.props.selectedLanguage.please_check_your_entered_Details);
            }
        }
    }

    render() {
        const { attention, ok } = this.props.selectedLanguage;
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        resizeMode="contain"
                        style={{
                            width: widthPercentageToDP(30),

                            tintColor: this.props.color,
                        }}
                        source={{ uri: this.state?.chainData?.data?.logo_gif_light }}
                    />
                </View>
            );
        } else {
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
                                backgroundColor: this.props.color,
                                borderBottomRightRadius: widthPercentageToDP(7),
                            }}
                        />
                    )}
                    {Platform.OS === 'android' && <StatusBar backgroundColor={this.props.color}></StatusBar>}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1 }}>
                            <RootContainer>
                                <View
                                    style={{
                                        height: heightPercentageToDP(14),
                                        backgroundColor: this.props.color,
                                    }}
                                >
                                    {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                                    <Navbar
                                        tintBackColor={colors.WHITE}
                                        titleColor={colors.WHITE}
                                        onClick={this._handleBack}
                                        title={this.props.selectedLanguage.card_details}
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
                                    <View style={{ height: hp(2) }}></View>
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
                                        <View
                                            style={{
                                                marginTop: hp(2),
                                                paddingVertical: hp(3),
                                                paddingHorizontal: wp(4),
                                                borderRadius: scale.w(2),
                                                borderColor: '#EBF0F9',
                                                borderWidth: 1,
                                                backgroundColor: colors.WHITE,
                                                width: wp(90),
                                                alignSelf: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.8),
                                                    fontFamily: 'Roboto-Medium',
                                                    color: colors.DUMMY_COLOR,
                                                }}
                                            >
                                                {' '}
                                                {this.props.selectedLanguage.private_data}
                                            </Text>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: this.props.color,
                                                    paddingVertical: hp(2),
                                                    borderRadius: scale.w(1.3),
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginTop: hp(2),
                                                }}
                                                activeOpacity={1}
                                                disabled={this.state.disableScan}
                                                onPress={() => this.scanCard()}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'Roboto-Bold',
                                                        color: colors.WHITE,
                                                        fontSize: scale.w(1.8),
                                                    }}
                                                >
                                                    {this.props.selectedLanguage.scan_credit_card}
                                                </Text>
                                                <ScanCard style={{ marginLeft: widthPercentageToDP(5) }} />
                                            </TouchableOpacity>
                                            {this.state.CVV == null &&
                                            this.state.EXPIRY_DATE == null &&
                                            this.state.edited == 0 ? (
                                                <>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            paddingHorizontal: wp(1),
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            height: hp(6),
                                                            borderRadius: scale.w(1.5),
                                                        }}
                                                    >
                                                        <Field
                                                            placeholder={
                                                                this.props.selectedLanguage.cardholder_name
                                                            }
                                                            inputStyle={{
                                                                width: widthPercentageToDP(72),
                                                                paddingHorizontal: widthPercentageToDP(3),
                                                            }}
                                                            onChangeText={(val: any) =>
                                                                this.setState({ holderName: val })
                                                            }
                                                            placeholderTextColor={colors.DUMMY_COLOR}
                                                        ></Field>
                                                        {/* <TextInput
                                                        placeholderTextColor={colors.DUMMY_COLOR}
                                                        placeholder={this.props.selectedLanguage.cardholder_name}
                                                        onChangeText={(val: any) =>
                                                            this.setState({ holderName: val })
                                                        }
                                                        //      value={this.state.holderName}
                                                        style={{
                                                            fontSize: scale.w(1.5),
                                                            color: colors.DUMMY_COLOR,
                                                            width: '100%',
                                                        }}
                                                    ></TextInput> */}
                                                    </View>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            paddingHorizontal: wp(1),
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            height: hp(6),
                                                            borderRadius: scale.w(1.5),
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                width: widthPercentageToDP(72),
                                                                paddingHorizontal: widthPercentageToDP(3),
                                                            }}
                                                        >
                                                            <FieldFormWithMask
                                                                type="custom"
                                                                options={{ mask: '9999 9999 9999 9999' }}
                                                                title={
                                                                    this.props.selectedLanguage.card_number
                                                                }
                                                                placeholder={
                                                                    this.props.selectedLanguage.card_number
                                                                }
                                                                keyboardType="phone-pad"
                                                                maxLength={19}
                                                                value={this.state.fullCardNumber}
                                                                onChangeText={(fullCardNumber) =>
                                                                    this.setState({ fullCardNumber })
                                                                }
                                                                // editable={!this.props.isCheckedIn}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            paddingHorizontal: wp(1),
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            height: hp(6),
                                                            borderRadius: scale.w(1.5),
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                width: widthPercentageToDP(72),
                                                                paddingHorizontal: widthPercentageToDP(3),
                                                            }}
                                                        >
                                                            <FieldFormWithMask
                                                                type="custom"
                                                                options={{
                                                                    mask: '99/99',
                                                                }}
                                                                title={
                                                                    this.props.selectedLanguage
                                                                        .enter_card_expiry_date
                                                                }
                                                                keyboardType="phone-pad"
                                                                maxLength={18}
                                                                value={this.state.expiryDate}
                                                                placeholder={
                                                                    this.props.selectedLanguage
                                                                        .enter_card_expiry_date
                                                                }
                                                                onChangeText={(val) =>
                                                                    this.setState({ expiryDate: val })
                                                                }
                                                                // editable={!this.props.isCheckedIn}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            paddingHorizontal: wp(1),
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            height: hp(6),
                                                            borderRadius: scale.w(1.5),
                                                        }}
                                                    >
                                                        <Field
                                                            placeholder={this.props.selectedLanguage.cvv}
                                                            inputStyle={{
                                                                width: widthPercentageToDP(72),
                                                                paddingHorizontal: widthPercentageToDP(3),
                                                            }}
                                                            onChangeText={(val: any) =>
                                                                this.setState({ cvv: val })
                                                            }
                                                            keyboardType="phone-pad"
                                                            maxLength={3}
                                                            placeholderTextColor={colors.DUMMY_COLOR}
                                                        ></Field>
                                                        {/* <TextInput
                                                        placeholderTextColor={colors.DUMMY_COLOR}
                                                        placeholder={this.props.selectedLanguage.cardholder_name}
                                                        onChangeText={(val: any) =>
                                                            this.setState({ holderName: val })
                                                        }
                                                        //      value={this.state.holderName}
                                                        style={{
                                                            fontSize: scale.w(1.5),
                                                            color: colors.DUMMY_COLOR,
                                                            width: '100%',
                                                        }}
                                                    ></TextInput> */}
                                                    </View>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            height: hp(6),
                                                            borderRadius: scale.w(1.5),
                                                            paddingHorizontal: wp(4),
                                                        }}
                                                    >
                                                        <TextInput
                                                            onChangeText={(val: any) =>
                                                                this.setState({ cardAddress: val })
                                                            }
                                                            placeholderTextColor={colors.DUMMY_COLOR}
                                                            placeholder={
                                                                this.state.cardAddress == '' ||
                                                                !this.state.cardAddress
                                                                    ? this.props.selectedLanguage.card_address
                                                                    : null
                                                            }
                                                            defaultValue={this.state.cardAddress}
                                                            multiline={true}
                                                            style={{
                                                                fontFamily: 'Roboto-Regular',
                                                                fontSize: scale.w(1.6),
                                                                width: widthPercentageToDP(74),
                                                                color: colors.DUMMY_COLOR,
                                                                margin: 0,
                                                                padding: 0,
                                                            }}
                                                        ></TextInput>
                                                    </View>
                                                    {this.state.description == '' ? (
                                                        <View
                                                            style={{
                                                                backgroundColor: colors.COM_BACKGROUND,
                                                                paddingHorizontal: wp(4),
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                width: wp(82),
                                                                marginTop: hp(2),
                                                                height: hp(6),
                                                                borderRadius: scale.w(1.5),
                                                            }}
                                                        >
                                                            <TextInput
                                                                onChangeText={(val) =>
                                                                    this.setState({ description: val })
                                                                }
                                                                placeholder={
                                                                    this.props.selectedLanguage.description
                                                                }
                                                                placeholderTextColor={colors.DUMMY_COLOR}
                                                                multiline={true}
                                                                style={{
                                                                    fontFamily: 'Roboto-Regular',
                                                                    fontSize: scale.w(1.6),
                                                                    width: widthPercentageToDP(74),
                                                                    color: colors.DUMMY_COLOR,
                                                                    margin: 0,
                                                                    padding: 0,
                                                                }}
                                                            ></TextInput>
                                                        </View>
                                                    ) : (
                                                        <View
                                                            style={{
                                                                backgroundColor: colors.COM_BACKGROUND,
                                                                paddingHorizontal: wp(4),
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                width: wp(82),
                                                                marginTop: hp(2),
                                                                height: hp(6),
                                                                borderRadius: scale.w(1.5),
                                                            }}
                                                        >
                                                            <TextInput
                                                                onChangeText={(val: any) =>
                                                                    this.setState({ description: val })
                                                                }
                                                                placeholderTextColor={colors.DUMMY_COLOR}
                                                                placeholder={
                                                                    this.props.selectedLanguage.description
                                                                }
                                                                value={this.state.description}
                                                                multiline={true}
                                                                style={{
                                                                    fontFamily: 'Roboto-Regular',
                                                                    fontSize: scale.w(1.6),
                                                                    width: widthPercentageToDP(74),
                                                                    color: colors.DUMMY_COLOR,
                                                                    margin: 0,
                                                                    padding: 0,
                                                                }}
                                                            ></TextInput>
                                                        </View>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            paddingHorizontal: wp(4),
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            height: hp(6),
                                                            borderRadius: scale.w(1.5),
                                                        }}
                                                    >
                                                        <Field
                                                            placeholder={
                                                                this.props.selectedLanguage.cardholder_name
                                                            }
                                                            inputStyle={{
                                                                width: widthPercentageToDP(72),
                                                            }}
                                                            onChangeText={(val: any) =>
                                                                this.setState({ holderName: val, edited: 1 })
                                                            }
                                                            value={this.state.holderName}
                                                            placeholderTextColor={colors.DUMMY_COLOR}
                                                        ></Field>
                                                    </View>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            paddingHorizontal: wp(4),
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            height: hp(6),
                                                            borderRadius: scale.w(1.5),
                                                        }}
                                                    >
                                                        <TextInputMask
                                                            type={'credit-card'}
                                                            options={{
                                                                obfuscated: false,
                                                                issuer: 'visa-or-mastercard',
                                                            }}
                                                            placeholderTextColor={colors.DUMMY_COLOR}
                                                            placeholder={
                                                                this.state.fullCardNumber == ''
                                                                    ? this.props.selectedLanguage.card_number
                                                                    : null
                                                            }
                                                            // placeholder={'Card Number'}
                                                            value={this.state.fullCardNumber}
                                                            style={{
                                                                fontFamily: 'Roboto-Regular',
                                                                fontSize: scale.w(1.6),
                                                                width: widthPercentageToDP(74),
                                                                color: colors.DUMMY_COLOR,
                                                                margin: 0,
                                                                padding: 0,
                                                            }}
                                                            onChangeText={(val) =>
                                                                this.setState({
                                                                    fullCardNumber: val,
                                                                    edited: 1,
                                                                })
                                                            }
                                                        />
                                                        {/* <TextInput placeholder={this.state.cardNumber && this.state.cardNumber != '' ? "**** **** **** "+this.state.cardNumber : "Card Number"} style={{fontSize:14, color : colors.BLACK}}  ></TextInput> */}
                                                    </View>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            paddingHorizontal: wp(4),
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            borderRadius: scale.w(1.5),
                                                            height: hp(6),
                                                        }}
                                                    >
                                                        <TextInputMask
                                                            type={'datetime'}
                                                            options={{
                                                                format: 'MM/YY',
                                                            }}
                                                            placeholderTextColor={colors.DUMMY_COLOR}
                                                            style={{
                                                                fontFamily: 'Roboto-Regular',
                                                                fontSize: scale.w(1.6),
                                                                width: widthPercentageToDP(74),
                                                                color: colors.DUMMY_COLOR,
                                                                margin: 0,
                                                            }}
                                                            placeholder={
                                                                this.state.expiryDate == ''
                                                                    ? this.props.selectedLanguage
                                                                          .card_expiry_date
                                                                    : null
                                                            }
                                                            value={this.state.expiryDate}
                                                            onChangeText={(val) =>
                                                                this.setState({ expiryDate: val, edited: 1 })
                                                            }
                                                        />
                                                        {/* <TextInput placeholder={this.state.expiryDate && this.state.expiryDate != '' ? this.state.expiryDate : "Card Expiry Date"} style={{fontSize:14, color : colors.BLACK}}  ></TextInput> */}
                                                    </View>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            paddingHorizontal: wp(4),
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            height: hp(6),
                                                            borderRadius: scale.w(1.5),
                                                        }}
                                                    >
                                                        <TextInput
                                                            placeholderTextColor={colors.DUMMY_COLOR}
                                                            keyboardType="phone-pad"
                                                            maxLength={3}
                                                            onChangeText={(val: any) =>
                                                                this.setState({ cvv: val, edited: 1 })
                                                            }
                                                            //  value={this.state.cvv}

                                                            placeholder={
                                                                this.state.cvv == ''
                                                                    ? this.props.selectedLanguage.cvv
                                                                    : null
                                                            }
                                                            defaultValue={this.state.cvv}
                                                            style={{
                                                                fontFamily: 'Roboto-Regular',
                                                                fontSize: scale.w(1.6),
                                                                width: widthPercentageToDP(74),
                                                                color: colors.DUMMY_COLOR,
                                                                margin: 0,
                                                                padding: 0,
                                                            }}
                                                        />
                                                    </View>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            paddingHorizontal: wp(4),
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            height: hp(6),
                                                            borderRadius: scale.w(1.5),
                                                        }}
                                                    >
                                                        <Field
                                                            placeholder={
                                                                this.state.cardAddress == '' ||
                                                                !this.state.cardAddress
                                                                    ? this.props.selectedLanguage.card_address
                                                                    : null
                                                            }
                                                            inputStyle={{
                                                                width: widthPercentageToDP(72),
                                                            }}
                                                            onChangeText={(val: any) =>
                                                                this.setState({ cardAddress: val, edited: 1 })
                                                            }
                                                            value={this.state.cardAddress}
                                                            placeholderTextColor={colors.DUMMY_COLOR}
                                                        ></Field>
                                                    </View>
                                                    <View
                                                        style={{
                                                            backgroundColor: colors.COM_BACKGROUND,
                                                            paddingHorizontal: wp(4),
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: wp(82),
                                                            marginTop: hp(2),
                                                            height: hp(6),
                                                            borderRadius: scale.w(1.5),
                                                        }}
                                                    >
                                                        <Field
                                                            inputStyle={{
                                                                width: widthPercentageToDP(72),
                                                            }}
                                                            onChangeText={(val: any) =>
                                                                this.setState({ description: val, edited: 1 })
                                                            }
                                                            value={this.state.description}
                                                            placeholderTextColor={colors.DUMMY_COLOR}
                                                            placeholder={
                                                                this.state.description == ''
                                                                    ? this.props.selectedLanguage.description
                                                                    : null
                                                            }
                                                        ></Field>
                                                    </View>
                                                </>
                                            )}
                                        </View>
                                    </DropShadow>
                                    <View style={{ height: hp(4) }} />
                                    <View style={{ width: wp(90), alignSelf: 'center' }}>
                                        <ButtonPrimary
                                            backgroundColor={this.props.color}
                                            loading={this.state.requestLoading}
                                            onPress={this._handleUpdateCardDetails}
                                            text={this.props.selectedLanguage.update_details}
                                            fontWeight={'bold'}
                                            fontSize={scale.w(1.6)}
                                        />
                                    </View>
                                    {/* <View style={{ height: hp(15) }} /> */}
                                </View>
                            </RootContainer>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                // </ImageBackground>
            );
        }
    }
}
export default CardDetails;
