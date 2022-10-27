import React from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
    Keyboard,
    TouchableOpacity,
    Text,
} from 'react-native';
import base from '../../utils/baseStyles';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import RequestCheckOut from './Components/RequestCheckOut';
import LateCheckOut from './Components/LateCheckOut';
import { ICheckOutReduxProps } from './CheckOut.Container';
import colors from '../../constants/colors';

import { heightPercentageToDP, scale, widthPercentageToDP } from '../../utils/dimensions';
import QuickCheckOut from './Components/quickChcekOut';
import CustomModal from '../_global/CustomModal';
import FieldForm from '../CheckIn/Components/FieldForm';
import { View as ViewAnimatable } from 'react-native-animatable';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { ButtonPrimary } from '../_global/Button';
import Card from './Components/card';
import PaymentFormModal from '../_global/paymentFormModal';
import ProcessComplete from '../_global/processComplete';
import { debounce, find, findIndex, padStart } from 'lodash';
import { mainmenu, pickHotel } from '../../utils/navigationControl';
import { CardIOModule } from 'react-native-awesome-card-io';
import ModalMessageScanCC from '../CheckIn/Components/ModalMessageScanCC';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Cardscan from 'react-native-cardscan';
import { toast } from '../../utils/handleLogic';

interface IPaymentProps extends ICheckOutReduxProps {
    componentId: string;
    color?: string;
    selectedLanguage?: string;
    quickCheckOut?: any;
    response?: any;
    data: any;
    profile: any;
    typeData?: any;
    getTransactionHistory?: any;
    backgroundColor: any;
}

interface ICard {
    cardNumber: string;
    cardType: string;
    cardholderName: null | string;
    cvv: string;
    expiryMonth: number;
    expiryYear: number;
    postalCode: null | string;
    redactedCardNumber: string;
}

interface IPaymentState {
    loading: boolean;
    loadingGet: boolean;
    type: string;
    page: number;
    selectedIndex: number;
    cardNumber: string;
    cardName: string;
    cardExpiryDate: string;
    cvv: string;
    cardAddress: string;
    saveCard: boolean;
    holderName: string;
}

class Payment extends React.PureComponent<IPaymentProps, IPaymentState> {
    private _modalConfirm = React.createRef<CustomModal>();
    private _modalMessageScanCC = React.createRef<CustomModal>();
    private _modalVisible = React.createRef<CustomModal>();
    private _modalPaymentFormModal = React.createRef<CustomModal>();
    private _processComplete = React.createRef<CustomModal>();

    constructor(props: IPaymentProps) {
        super(props);

        this.state = {
            loading: false,
            loadingGet: true,
            type: '',
            page: 0,
            selectedIndex: 0,
            cardName: props?.profile?.cardholder_name || '',
            cardNumber: props?.profile?.card_number || '',
            cardAddress: props?.profile?.card_address || '',
            cardExpiryDate: props?.profile?.card_expiry_date || '',
            cvv: props?.profile?.card_cvv_number || '',
            saveCard: false,
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.backgroundColor,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleScanCC = this._handleScanCC.bind(this);
        this._handleQuickCheckOutRequest = this._handleQuickCheckOutRequest.bind(this);
        this._handlePayNow = this._handlePayNow.bind(this);
        this._handlePayByCash = this._handlePayByCash.bind(this);
        this._handlePayByCard = this._handlePayByCard.bind(this);
        this.scanCard = this.scanCard.bind(this);
    }

    scanCard() {
        Keyboard.dismiss();
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
                console.log('nottttttttt supporteddddddddddddddddd', supported);
            }
        });
    }

    // componentDidMount() {
    //     this._modalVisible.current?.show()
    // }

    _handlePayNow() {
        if (this.state.type == 'stripe') this.cardPayment('stripe');
        else this._modalVisible.current?.show();
    }

    _handleQuickCheckOutRequest(val) {
        this._modalVisible.current?.hide();
        Alert.alert(
            this.props.selectedLanguage?.confirmation,
            this.props.selectedLanguage?.are_you_sure_you_want_to_pay_by_cash,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Proceed',
                    onPress: () => {
                        this.setState({ loading: true });
                        var card: any = {};
                        card['number'] = this.state.cardNumber;
                        card['name'] = this.state.cardName;
                        card['exp'] = this.state.cardExpiryDate;
                        card['amount'] = this.props?.response?.total_price_after_tax;
                        card['type'] = val;
                        console.log(card);
                        this.props.data(
                            card,
                            () => {
                                console.log('done');
                                this._modalPaymentFormModal.current?.hide();
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

    _handleMessageScanCC(isShow?: boolean) {
        if (this._modalMessageScanCC.current) {
            // open modal
            if (isShow) {
                return this._modalMessageScanCC.current.show();
            }

            // close modal and open scan cc
            this._modalMessageScanCC.current.hide();

            return setTimeout(this._handleScanCC, 800);
        }

        // open scan cc, in case modal is not rendered
        return this._handleScanCC();
    }

    async _handleScanCC() {
        try {
            Keyboard.dismiss();
            const { cardholderName, cardNumber, expiryMonth, expiryYear }: ICard =
                await CardIOModule.scanCard({
                    hideCardIOLogo: true,
                    requireCVV: false,
                    requireCardholderName: true,
                });

            this.setState({
                cardName: cardholderName ? cardholderName : this.state.cardName,
                cardNumber: cardNumber ? cardNumber : '',
                cardExpiryDate: `${padStart(expiryMonth.toString(), 2, '0')}/${expiryYear
                    .toString()
                    .substr(2)}`,
            });
            this._modalVisible.current?.hide();
        } catch (error) {
            if (__DEV__) {
                console.log('SCAN_CC: ', { error });
            }
        }
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
            this.props.data(
                card,
                () => {
                    this.setState({ loading: false });
                    console.log('done');
                    // this.props.getTransactionHistory();
                    // setTimeout(() => {
                    this._processComplete.current?.show();
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

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handleModalNoteOrderItem() {
        if (this.state.type == 'quick_checkout_pending') {
            return () => this._handleQuickCheckOutRequest('quick_checkout_pending');
        } else if (this.props.typeData == 'hotel')
            return () => {
                this._modalConfirm.current?.show();
            };
        else return () => this.cardPayment();
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

    render() {
        const { check_out } = this.props.selectedLanguage;
        return (
            <View style={base.container}>
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
                <View style={{ height: heightPercentageToDP(15), backgroundColor: this.props.color }}>
                    <Navbar
                        color={this.props.color}
                        titleColor={'#fff'}
                        onClick={this._handleBack}
                        title={this.props.selectedLanguage.payment}
                    />
                </View>
                {/* <View style={{height : heightPercentageToDP(90)}} ></View> */}
                <View
                    style={{
                        borderRadius: scale.w(5),
                        marginTop: -heightPercentageToDP(5),
                        backgroundColor: colors.WHITE,
                    }}
                    animation="fadeInLeft"
                    useNativeDriver
                    duration={300}
                    delay={150}
                >
                    <View style={{ height: heightPercentageToDP(5) }}></View>
                    <ScrollView>
                        <FieldForm
                            label={`${this.props.selectedLanguage.vat} :`}
                            placeholder={this.props.selectedLanguage.vat}
                            value={this.props.response.vat.toString()}
                            editable={false}
                        />
                        <View style={{ height: heightPercentageToDP(2) }}></View>
                        <FieldForm
                            label={`${this.props.selectedLanguage.service_charges} :`}
                            placeholder={this.props.selectedLanguage.service_charges}
                            value={this.props.response.service_charges.toString()}
                            editable={false}
                        />
                        <View style={{ height: heightPercentageToDP(3) }}></View>
                        <FieldForm
                            label={`${this.props.selectedLanguage?.total} :`}
                            placeholder={this.props.selectedLanguage.TOTAL}
                            value={this.props?.response?.total_price_after_tax?.toFixed(2)?.toString()}
                            editable={false}
                        />
                        {this.state.type == 'stripe' && this.props.typeData != 'hotel' && (
                            <TouchableOpacity
                                onPress={async () => {
                                    this._handleMessageScanCC(true);
                                }}
                            >
                                <FieldForm
                                    label={`${this.props.selectedLanguage?.card_holder_name} :`}
                                    placeholder={this.props.selectedLanguage?.enter_card_holder_name}
                                    value={this.state.cardName}
                                    editable={false}
                                />
                            </TouchableOpacity>
                        )}
                        {this.state.type == 'stripe' && this.props.typeData != 'hotel' && (
                            <TouchableOpacity
                                onPress={async () => {
                                    this._handleMessageScanCC(true);
                                }}
                            >
                                <FieldForm
                                    label={`${this.props.selectedLanguage?.card_number} :`}
                                    placeholder={this.props.selectedLanguage?.enter_card_number}
                                    value={this.state.cardNumber}
                                    editable={false}
                                />
                            </TouchableOpacity>
                        )}
                        {this.state.type == 'stripe' && this.props.typeData != 'hotel' && (
                            <TouchableOpacity
                                onPress={async () => {
                                    this._handleMessageScanCC(true);
                                }}
                            >
                                <FieldForm
                                    label={`${this.props.selectedLanguage?.card_expiry_date} :`}
                                    placeholder={this.props.selectedLanguage?.enter_card_expiry_date}
                                    value={this.state.cardExpiryDate}
                                    editable={false}
                                />
                            </TouchableOpacity>
                        )}
                        {/* <View style={{height : heightPercentageToDP(2)}}></View> */}
                        {/* <View style={{justifyContent : 'center',
                                width : widthPercentageToDP(80),
                                alignSelf : 'center',                                
                                backgroundColor : colors.WHITE,
                                ...Platform.select({
                                    ios: {
                                        shadowColor: '#000',
                                        shadowOffset: { width: -1, height: 2 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: scale.w(6),
                                    },
                                    android: {
                                        elevation: 3,
                                    },
                                }),}}> */}
                        {/* <RadioForm
                            radio_props={[
                                {label: 'Pay by cash', value: 0 },
                                {label: 'Pay by credit card', value: 1 }
                            ]}
                            initial={0}
                            onPress={(value) => {}}
                            borderWidth={.3}
                            buttonInnerColor={colors.BLUE}
                            buttonOuterColor={colors.BLUE}
                            buttonSize={10}
                            buttonOuterSize={20}
                            buttonStyle={{marginLeft: 10, marginTop : 10}}
                            buttonWrapStyle={{marginLeft: 10, marginTop : 10}}
                  
                            /> */}
                        <View style={{ height: heightPercentageToDP(5) }}></View>
                        <View
                            style={{
                                paddingHorizontal: scale.w(0.57),
                                paddingTop: scale.w(0.08),
                                paddingBottom: scale.w(0.38),
                                width: '85%',
                                alignSelf: 'center',
                            }}
                        >
                            <ButtonPrimary
                                backgroundColor={
                                    this.props.backgroundColor === ''
                                        ? colors.BLUE
                                        : this.props.backgroundColor
                                }
                                onPress={this._handlePayNow}
                                loading={this.state.loading}
                                disabled={this.state.loading}
                                fontSize={scale.w(1.65)}
                                text={this.props.selectedLanguage?.pay_now}
                                chainData={this.props.chainData}
                            />
                        </View>
                    </ScrollView>
                    {/* </View> */}
                </View>
                <CustomModal
                    style={{ margin: -1 }}
                    ref={this._processComplete}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDown"
                >
                    <ProcessComplete
                        backgroundColor={this.props.backgroundColor}
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
                        onChangeText={(text) => { }}
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
                <CustomModal ref={this._modalMessageScanCC}>
                    <ModalMessageScanCC
                        color={this.props.color !== '' ? this.props.color : undefined}
                        handleMessageScanCC={() => this._handleMessageScanCC(false)}
                        selectedLanguage={this.props.selectedLanguage}
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
            </View>
        );
    }
}

export default Payment;
