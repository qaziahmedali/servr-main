import React from 'react';
import {
    TouchableOpacity,
    Platform,
    Image,
    ImageStyle,
    Keyboard,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Alert,
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
import { TextInputMask } from 'react-native-masked-text';
import { ButtonPrimary } from './Button';
import Navbar from './Navbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import Cardscan from 'react-native-cardscan';
import { Size } from '../../utils/dimensions';
import CardScan from '../../images/CardScan.svg';
import Visa from '../../images/Visa.svg';
import QuestionMarkSymbol from '../../images/QuestionMarkSymbol.svg';
import { toast } from '../../utils/handleLogic';
import { RootContainer } from './Container';

interface IPaymentFormModalProps {
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
    backgroundColor: any;
    selectedLanguage: any;
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

interface IPaymentFormModalState {
    active: string;
}

class PaymentFormModal extends React.PureComponent<IPaymentFormModalProps> {
    constructor(props: IPaymentFormModalState) {
        super(props);
        this.state = {
            active: 'home',
        };
    }

    render() {
        return (
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#ffffff' }}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
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
                <View style={{ flex: 1 }}>
                    <ScrollView>
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
                                    onClick={this.props.onBackClick}
                                    title={this.props.selectedLanguage.enter_card_details}
                                />
                                {/* </ImageBackground> */}
                            </View>

                            <View
                                style={{
                                    height: hp(84),
                                    width: wp(100),
                                    top: -hp(4.3),
                                    backgroundColor: colors.WHITE,
                                    borderTopLeftRadius: scale.w(5),
                                    borderTopRightRadius: scale.w(5),
                                    // paddingHorizontal : wp(2),
                                    paddingTop: hp(3.5),
                                    paddingHorizontal: wp(5),
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            height: heightPercentageToDP(10),
                                        }}
                                    >
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: scale.w(2.0),
                                                    color: colors.SignInUsingColor,
                                                    fontFamily: 'Roboto-Bold',
                                                }}
                                            >
                                                {this.props.selectedLanguage.payment_details}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.5),
                                                    color: '#6C738A',
                                                    fontFamily: 'Roboto-Regular',
                                                }}
                                            >
                                                {this.props.selectedLanguage.enter_your_credit_card_details}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={this.props.onScanIconClick}
                                            disabled={this.props.isLoading}
                                            style={{
                                                height: scale.w(6),
                                                width: scale.w(8),
                                                borderRadius: scale.w(6) / 2,
                                                //   backgroundColor: this.props.backgroundColor,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CardScan fill={this.props.backgroundColor} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: heightPercentageToDP(2) }}></View>
                                    <View style={{ marginTop: hp(2), height: heightPercentageToDP(10) }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto-Bold',
                                                color: colors.PAYMENT_DETAILS_HEADINGS,
                                                fontSize: scale.w(1.7),
                                            }}
                                        >
                                            {this.props.selectedLanguage.cardholder_name}
                                        </Text>
                                        <TextInput
                                            placeholder={this.props.selectedLanguage.cardholder_name}
                                            value={this.props.holderName}
                                            onChangeText={this.props.onChangeHolderName}
                                            style={{
                                                fontSize: scale.w(1.65),
                                                color: colors.DUMMY_COLOR,
                                                fontFamily: 'Roboto-Regular',
                                                paddingVertical: heightPercentageToDP(1.5),
                                                padding: 0,
                                            }}
                                        ></TextInput>
                                        <View
                                            style={{ height: hp(0.2), backgroundColor: colors.LIGHT_GREY }}
                                        />
                                    </View>

                                    <View style={{ marginTop: hp(2), height: heightPercentageToDP(10) }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto-Bold',
                                                color: colors.PAYMENT_DETAILS_HEADINGS,
                                                fontSize: scale.w(1.7),
                                            }}
                                        >
                                            {this.props.selectedLanguage.card_number}
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',

                                                alignItems: 'center',
                                            }}
                                        >
                                            <TextInputMask
                                                type={'credit-card'}
                                                options={{
                                                    mask: '9999 9999 9999 9999',
                                                }}
                                                value={this.props.cardNumber}
                                                style={{
                                                    fontSize: scale.w(1.65),
                                                    fontFamily: 'Roboto-Regular',
                                                    color: colors.DUMMY_COLOR,
                                                    paddingVertical: hp(1.5),
                                                }}
                                                placeholder={this.props.selectedLanguage.card_number}
                                                onChangeText={this.props.onChangeCardNumber}
                                            />
                                            <View style={{ paddingHorizontal: widthPercentageToDP(3) }}>
                                                <Visa />
                                            </View>
                                        </View>
                                        <View
                                            style={{ height: hp(0.2), backgroundColor: colors.LIGHT_GREY }}
                                        />
                                    </View>
                                    <View style={{ marginTop: hp(2), height: heightPercentageToDP(10) }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto-Bold',
                                                color: colors.PAYMENT_DETAILS_HEADINGS,
                                                fontSize: scale.w(1.7),
                                            }}
                                        >
                                            {this.props.selectedLanguage.card_address}
                                        </Text>
                                        <TextInput
                                            style={{
                                                width: '100%',
                                                fontSize: scale.w(1.65),
                                                color: colors.DUMMY_COLOR,
                                                fontFamily: 'Roboto-Regular',
                                                paddingVertical: hp(1.5),
                                            }}
                                            placeholder={this.props.selectedLanguage.card_address}
                                            value={this.props.cardAddress}
                                            onChangeText={this.props.onChangeCardAddress}
                                        />
                                        <View
                                            style={{ height: hp(0.2), backgroundColor: colors.LIGHT_GREY }}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ marginTop: hp(2), height: heightPercentageToDP(10) }}>
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Bold',
                                                    color: colors.PAYMENT_DETAILS_HEADINGS,
                                                    fontSize: scale.w(1.7),
                                                }}
                                            >
                                                {this.props.selectedLanguage.expiry_date}
                                            </Text>
                                            <TextInputMask
                                                type={'datetime'}
                                                options={{
                                                    format: this.props.selectedLanguage.mm_yy,
                                                }}
                                                value={this.props.cardExpiryDate}
                                                style={{
                                                    width: wp(40),
                                                    fontSize: scale.w(1.65),
                                                    color: colors.DUMMY_COLOR,
                                                    fontFamily: 'Roboto-Regular',
                                                    paddingVertical: hp(1.5),
                                                }}
                                                placeholder={'MM/YY'}
                                                onChangeText={this.props.onChangeCardExpiry}
                                            />
                                            <View
                                                style={{
                                                    height: hp(0.2),
                                                    backgroundColor: colors.LIGHT_GREY,
                                                }}
                                            />
                                        </View>
                                        <View style={{ marginTop: hp(2), height: heightPercentageToDP(10) }}>
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Bold',
                                                    color: colors.PAYMENT_DETAILS_HEADINGS,
                                                    fontSize: scale.w(1.7),
                                                }}
                                            >
                                                {this.props.selectedLanguage.cvv}
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <TextInput
                                                    style={{
                                                        width: wp(40),
                                                        fontSize: scale.w(1.65),
                                                        color: colors.DUMMY_COLOR,
                                                        fontFamily: 'Roboto-Regular',
                                                        paddingVertical: hp(1.5),
                                                    }}
                                                    placeholder={'***'}
                                                    value={this.props.cvv}
                                                    secureTextEntry={true}
                                                    keyboardType={'numeric'}
                                                    onChangeText={this.props.onChangeCVV}
                                                    maxLength={3}
                                                />
                                                <View style={{ paddingHorizontal: widthPercentageToDP(2) }}>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            Alert.alert(
                                                                this.props.selectedLanguage.help,
                                                                this.props.selectedLanguage.cvv_help,
                                                            )
                                                        }
                                                    >
                                                        <QuestionMarkSymbol />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    height: hp(0.2),
                                                    backgroundColor: colors.LIGHT_GREY,
                                                }}
                                            />
                                        </View>
                                    </View>

                                    {this.props.cardSaveDisable ? null : (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                paddingVertical: hp(2),
                                                alignItems: 'center',
                                                marginTop: heightPercentageToDP(1),
                                            }}
                                        >
                                            <CheckBox
                                                style={{
                                                    height: widthPercentageToDP(4),
                                                    width: widthPercentageToDP(4),
                                                }}
                                                tintColors={{ true: this.props.backgroundColor }}
                                                value={this.props.cardSave}
                                                onValueChange={this.props.onCardSave}
                                            />
                                            <View style={{ width: widthPercentageToDP(3) }} />
                                            <Text
                                                style={{
                                                    //    textAlign: 'center',
                                                    fontFamily: 'Roboto-Regular',
                                                    color: '#1A1A1A',
                                                    fontSize: scale.w(1.65),
                                                }}
                                            >
                                                {
                                                    this.props.selectedLanguage
                                                        .save_this_card_for_future_payments
                                                }
                                            </Text>
                                        </View>
                                    )}

                                    <View style={{ height: hp(5) }} />
                                    <ButtonPrimary
                                        onPress={() => {
                                            if (this.props.holderName == '') {
                                                toast(
                                                    this.props.selectedLanguage.please_enter_cardholder_name,
                                                );
                                                return 0;
                                            }
                                            if (this.props.cardNumber == '') {
                                                toast(
                                                    this.props.selectedLanguage.please_enter_your_card_number,
                                                );
                                                return 0;
                                            }
                                            if (this.props.cardNumber.length < 19) {
                                                toast(
                                                    this.props.selectedLanguage
                                                        .please_enter_valid_card_number,
                                                );
                                                return 0;
                                            }
                                            if (this.props.cvv == '' || this.props.cvv == null) {
                                                toast(this.props.selectedLanguage.please_enter_your_card_cvv);
                                                return 0;
                                            }
                                            if (
                                                this.props.cardExpiryDate == '' ||
                                                this.props.cardExpiryDate == null
                                            ) {
                                                toast(
                                                    this.props.selectedLanguage
                                                        .please_enter_your_card_expiry_date,
                                                );
                                                return 0;
                                            }
                                            if (
                                                this.props.cardAddress.trim() == '' ||
                                                this.props.cardAddress.trim() == null
                                            ) {
                                                toast(
                                                    this.props.selectedLanguage
                                                        .please_enter_your_card_address,
                                                );
                                                return 0;
                                            }
                                            this.props.onPrimaryClick();
                                        }}
                                        backgroundColor={this.props.backgroundColor}
                                        fontSize={scale.w(2.2)}
                                        fontWeight={'bold'}
                                        loading={this.props.isLoading}
                                        text={this.props.selectedLanguage.pay_now}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                            </View>
                        </RootContainer>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

export default PaymentFormModal;
