import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    ScrollView,
    Alert,
    Text,
    TextInput,
    KeyboardAvoidingView,
    createRef,
    Platform,
    StatusBar,
} from 'react-native';
import base from '../../utils/baseStyles';
import {
    scale,
    heightPercentageToDP,
    widthPercentageToDP,
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import FieldForm from '../Restaurant/Components/FieldForm';
// import Field from './Component/field';
// import FieldFormWithMask from './Component/FieldFormWithMask';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { debounce } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary, ButtonSecondary } from '../_global/Button';
import colors from '../../constants/colors';
import { Calendar as CalendarWidget, DateObject } from 'react-native-calendars';
import { View as ViewAnimatable } from 'react-native-animatable';
import { format } from 'date-fns';
import CustomModal from '../_global/CustomModal';
import ModalTimePicker from '../Restaurant/Components/ModalTimePicker';
import { ISpaBookingTimeReduxProps } from './SpaBookingTime.Container';
import { H4 } from '../_global/Text';
import { spaTreatmentList, spaTrackingProgress, mainmenu } from '../../utils/navigationControl';
import { ISpa, ISpaTreatment } from '../../types/spa';
import DIcon from 'react-native-vector-icons/MaterialIcons';
import ModalDatePicker from '../Restaurant/Components/ModalDatePicker';
import ProcessCompleteModal from '../_global/processComplete';
import AttentionModal from '../_global/AttentionModal';
import { toast } from '../../utils/handleLogic';
import DropShadow from 'react-native-drop-shadow';
import Calendar from '../../images/calendar.svg';
import User from '../../images/user.svg';
import { timestamp } from 'rxjs';
import moment from 'moment';
import { RootContainer } from '../_global/Container';
import Field from '../LostAndFound/Component/field';

export interface ISpaBookingTimeProps extends ISpaBookingTimeReduxProps {
    componentId: string;
    isReserveSpaType?: boolean;
    hotelTaxes: any;
    spa: ISpa;
    selectedItem: any;
}

interface ISpaBookingTimeState {
    selectedTreatments: ISpaTreatment[];
    time: string;
    date: string;
    numberPeople: number;
    loading: boolean;
    visible: boolean;
    text: string;
    booking_date: string;
    booking_end_date: string;
    startSelected: boolean;
    note: string;
    tip: any;
}

class SpaBookingTime extends React.Component<ISpaBookingTimeProps, ISpaBookingTimeState> {
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalDatePicker2 = React.createRef<CustomModal>();
    private _modalProcessCompleteModal = React.createRef<CustomModal>();
    private ref_numberPeople = React.createRef();

    constructor(props: ISpaBookingTimeProps) {
        super(props);

        this.state = {
            selectedTreatments: props.selectedItem,
            time: '',
            date: '',
            numberPeople: 0,
            loading: false,
            visible: false,
            booking_date: '',
            text: '',
            startSelected: false,
            booking_end_date: '',
            note: '',
            tip: 0,
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleSpaBookingTime = this._handleSpaBookingTime.bind(this);
        this._handleModalDatePicker = this._handleModalDatePicker.bind(this);
        this._onDayPress = this._onDayPress.bind(this);
        this._getMarkedDates = this._getMarkedDates.bind(this);
        this._handleChooseTreatment = this._handleChooseTreatment.bind(this);
        this._handleModalDatePicker2 = this._handleModalDatePicker2.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._onChangeDate2 = this._onChangeDate2.bind(this);
    }

    _handleBack() {
        this._modalProcessCompleteModal.current?.hide();
        Navigation.popTo('mainmenu');
    }

    _handleSpaBookingTime() {
        // alert(this.state.date);
        if (!this.props.isCheckedIn) {
            // Alert.alert('Attention', 'Please check in first, to use this service');
            this.setState({
                text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
                visible: true,
            });
            return 0;
        }
        if (this.props.status == 'pending') {
            // Alert.alert('Attention', 'To use this feature, your check in must be accepted by hotel admin');
            this.setState({
                text: this.props.selectedLanguage
                    .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
                visible: true,
            });
            return 0;
        }
        if (this.state.selectedTreatments.length == 0) {
            toast(this.props.selectedLanguage.please_select_at_least_one_treatment);
            return 0;
        }

        if (this.state.date == '' || this.state.date == null) {
            toast(this.props.selectedLanguage.please_select_your_booking_date);
            return 0;
        }
        if (this.state.time == '' || this.state.time == null) {
            toast(this.props.selectedLanguage.plese_select_your_booking_time);
            return 0;
        }
        console.log('this.state.numberPeople =>', this.state.numberPeople);
        if (Number(this.state.numberPeople) == 0) {
            // this.ref_numberPeople.current.focus();
            // .current.focus()
            toast(this.props.selectedLanguage.please_enter_valid_numeric_value_only);
            return 0;
        }
        if (Number(this.state.numberPeople) < 1) {
            // this.ref_numberPeople.current.focus();
            // .current.focus()
            toast(this.props.selectedLanguage.number_of_people_must_be_at_least_one);
            return 0;
        }
        if (Number(this.state.numberPeople) > 10) {
            // this.ref_numberPeople.current.focus();
            // .current.focus()
            toast(this.props.selectedLanguage.number_of_people_can_not_be_more_than_10);
            return 0;
        } else {
            const { numberPeople, date, time, selectedTreatments } = this.state;
            const { componentId, isReserveSpaType, spa } = this.props;
            if (numberPeople && Number(numberPeople) !== NaN && Number(numberPeople) < 15) {
                const body = {
                    spa_id: this.props.spa.id,
                    treatments: selectedTreatments.map((treatment) => {
                        return { id: Number(treatment.id), note: '' };
                    }),
                    number_people: Number(numberPeople) !== NaN ? Number(numberPeople) : 0,
                    date,
                    time,
                    currency: this.props.currency,
                    booking_type: 'normal_reservation',
                    card_number: '',
                    card_expiry_month: '',
                    card_cvv_number: '',
                    cardholder_name: '',
                    is_card_save: false,
                    type: 'cash',
                    tip: this.state.tip,
                    vip_note: this.state.note,
                };

                // is reserved spa
                if (isReserveSpaType) {
                    if (body.treatments.length > 0) {
                        this.setState({ loading: true });
                        return this.props.reserveSpa(
                            body,
                            () => {
                                // Navigation.popTo('spaService');
                                this._modalProcessCompleteModal.current?.show();
                                // await Navigation.push('spaService', spaTrackingProgress);
                                // Alert.alert(
                                //     this.props.selectedLanguage.success,
                                //     this.props.selectedLanguage.success_your_reservation_request_has_been_sent,
                                // );
                            },
                            () => {
                                this.setState({ loading: false });
                            },
                        );
                    } else {
                        this.setState({
                            text: this.props.selectedLanguage.please_select_at_least_one_treatment,
                            visible: true,
                        });
                    }
                }

                // is order room spa
                if (body.treatments.length > 0) {
                    this.setState({ loading: true });
                    this.props.reserveSpa(
                        body,
                        () => {
                            console.log('i am hererererererer second oneee');

                            this.setState({ loading: false });
                            this._modalProcessCompleteModal.current?.show();
                            // await Navigation.push('spaService', spaTrackingProgress);
                            // Alert.alert(
                            //     this.props.selectedLanguage.success,
                            //     this.props.selectedLanguage.success_your_reservation_request_has_been_sent,
                            // );
                        },
                        () => {
                            this.setState({ loading: false });
                        },
                    );
                } else {
                    this.setState({
                        text: this.props.selectedLanguage.please_select_at_least_one_treatment,
                        visible: true,
                    });
                }
            } else {
                toast(
                    this.props.selectedLanguage
                        .please_enter_number_of_people_and_check_if_its_valid_number_of_people,
                );
            }
        }
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _onDayPress(date: DateObject) {
        this.setState({ date: date.dateString });
    }

    _getMarkedDates() {
        if (this.state.date !== '') {
            return { [this.state.date]: { selected: true } };
        }

        return {};
    }

    _handleChooseTreatment() {
        Navigation.pop(this.props.componentId);
        // Navigation.push(
        //     this.props.componentId,
        //     spaTreatmentList({
        //         treatmentSelectedList: this.state.selectedTreatments,
        //         spa: this.props.spa,
        //         onSubmitSelectedTreatments: (selectedTreatments) => this.setState({ selectedTreatments }),
        //     }),
        // );
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
            startSelected: true,
        });
    }

    _onChangeDate2(date: Date) {
        console.log('dateeee', date);
        this.setState((prevState) => {
            if (prevState.time) {
                return {
                    ...prevState,
                    time: date.toString(),
                };
            }

            return {
                ...prevState,
                time: date.toString(),
            };
        });
    }

    render() {
        const { spa, isReserveSpaType, color } = this.props;
        const { numberPeople, time, selectedTreatments, loading } = this.state;
        const {
            reserve_a_spa_treatment,
            order_spa_room_service,
            choose_treatment,
            number_of_people,
            time_of_booking,
            confirm_booking,
            hours,
            minutes,
            ok,
            date,
            month,
            year,
            pick_your_booking_date,
            please_select_at_least_one_treatment,
            booking_from,
            booking_to,
        } = this.props.selectedLanguage;
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <AttentionModal
                    visible={this.state.visible}
                    toggleModal={this.toggleModal}
                    text={this.state.text}
                    attention={'Attention'}
                    ok={'Ok'}
                />

                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: heightPercentageToDP(20), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: this.props.icon.spa_color,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && (
                    <StatusBar backgroundColor={this.props.icon.spa_color}></StatusBar>
                )}
                <ScrollView>
                    <View style={{ height: heightPercentageToDP(100), width: widthPercentageToDP(100) }}>
                        <RootContainer>
                            <View
                                style={{
                                    height: heightPercentageToDP(15),
                                    backgroundColor: this.props.icon.spa_color,
                                }}
                            >
                                {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                                <Navbar
                                    tintBackColor={colors.WHITE}
                                    titleColor={colors.WHITE}
                                    onClick={this._handleBack}
                                    title={spa?.name}
                                />
                                {/* </ImageBackground> */}
                            </View>
                            <View
                                style={{
                                    height: heightPercentageToDP(90),
                                    backgroundColor: colors.WHITE,
                                    width: wp(100),
                                    top: -heightPercentageToDP(5),
                                    borderTopLeftRadius: scale.w(3.5),
                                    borderTopRightRadius: scale.w(3.5),
                                    paddingTop: heightPercentageToDP(0.75),
                                }}
                            >
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ height: hp(3) }} />
                                    <DropShadow
                                        style={{
                                            width: wp(100),
                                            shadowOffset: {
                                                width: 0,
                                                height: 5,
                                            },
                                            shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                            shadowOpacity: 0.25,
                                            shadowRadius: 10,
                                        }}
                                    >
                                        <View style={{ width: wp(90), alignSelf: 'center' }}>
                                            <ButtonSecondary
                                                onPress={this._handleChooseTreatment}
                                                text={
                                                    selectedTreatments.length > 0
                                                        ? `${selectedTreatments.length} ${this.props.selectedLanguage.treatments_selected}`
                                                        : choose_treatment
                                                }
                                                fontSize={scale.w(2)}
                                                height={hp(6.5)}
                                            />
                                        </View>
                                    </DropShadow>

                                    <DropShadow
                                        style={{
                                            width: wp(100),
                                            shadowOffset: {
                                                width: 0,
                                                height: 5,
                                            },
                                            shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                            shadowOpacity: 0.25,
                                            shadowRadius: 10,
                                            paddingTop: heightPercentageToDP(3),
                                        }}
                                    >
                                        <View
                                            style={{
                                                paddingHorizontal: wp(4),
                                                borderRadius: scale.w(2.5),
                                                backgroundColor: colors.WHITE,
                                                width: wp(90),
                                                alignSelf: 'center',
                                                borderWidth: 1,
                                                paddingBottom: hp(3.5),
                                                paddingTop: hp(1),
                                                borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.7),
                                                    fontFamily: 'Roboto-Medium',
                                                    color: colors.DUMMY_COLOR,
                                                    marginTop: hp(2),
                                                }}
                                            >
                                                {' '}
                                                {this.props.selectedLanguage.booking_time_and_date}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={debounce(this._handleModalDatePicker(false), 100, {
                                                    leading: true,
                                                    trailing: false,
                                                })}
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
                                            >
                                                <View style={{ width: wp(66), color: colors.DUMMY_COLOR }}>
                                                    <Text
                                                        style={{
                                                            color: colors.DUMMY_COLOR,
                                                            fontFamily: 'Roboto-Regular',
                                                        }}
                                                    >
                                                        {this.state.date === ''
                                                            ? this.props.selectedLanguage.date
                                                            : this.props.selectedLanguage.date +
                                                              ': ' +
                                                              format(this.state.date, 'DD-MM-YYYY ')}
                                                    </Text>
                                                </View>
                                                <Calendar
                                                    style={{ paddingHorizontal: widthPercentageToDP(4) }}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={debounce(this._handleModalDatePicker2(false), 100, {
                                                    leading: true,
                                                    trailing: false,
                                                })}
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
                                            >
                                                <View style={{ width: wp(66), color: colors.DUMMY_COLOR }}>
                                                    <Text
                                                        style={{
                                                            color: colors.DUMMY_COLOR,
                                                            fontFamily: 'Roboto-Regular',
                                                        }}
                                                    >
                                                        {this.state.time === ''
                                                            ? this.props.selectedLanguage.time
                                                            : this.props.selectedLanguage.time +
                                                              ': ' +
                                                              format(this.state.time, ' HH:mm')}
                                                    </Text>
                                                </View>
                                                <Calendar
                                                    style={{ paddingHorizontal: widthPercentageToDP(4) }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </DropShadow>

                                    <DropShadow
                                        style={{
                                            width: wp(100),
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
                                                borderRadius: 15,
                                                marginTop: hp(3),
                                                backgroundColor: colors.WHITE,
                                                width: wp(90),
                                                alignSelf: 'center',
                                                borderWidth: 1,
                                                borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.7),
                                                    fontFamily: 'Roboto-Medium',
                                                    color: colors.DUMMY_COLOR,
                                                }}
                                            >
                                                {this.props.selectedLanguage.booking_details}
                                            </Text>
                                            <View
                                                style={{
                                                    backgroundColor: colors.COM_BACKGROUND,
                                                    paddingHorizontal: wp(1),
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    width: wp(82),
                                                    marginTop: hp(2),

                                                    paddingVertical: hp(0.9),
                                                    borderRadius: scale.w(1.5),
                                                }}
                                            >
                                                <Field
                                                    title={this.props.selectedLanguage.number_of_people}
                                                    placeholder={this.props.selectedLanguage.number_of_people}
                                                    color={color}
                                                    inputStyle={{
                                                        width: widthPercentageToDP(72),
                                                        paddingHorizontal: widthPercentageToDP(3),
                                                    }}
                                                    onChangeText={(value) => {
                                                        this.setState({
                                                            numberPeople: value.trim(),
                                                        });
                                                    }}
                                                    autoCapitalize="none"
                                                    keyboardType="number-pad"
                                                    value={this.state.numberPeople}
                                                ></Field>

                                                <User
                                                    width={widthPercentageToDP(4)}
                                                    height={heightPercentageToDP(4)}
                                                />
                                            </View>

                                            {/* <View style={{backgroundColor : colors.COM_BACKGROUND, paddingHorizontal : wp(1), flexDirection : 'row', alignItems : 'center', justiifyContent : 'space-between', width : wp(82), marginTop : hp(2)}} > */}
                                        </View>
                                    </DropShadow>

                                    <DropShadow
                                        style={{
                                            width: wp(100),
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
                                                    fontSize: scale.w(1.7),
                                                    fontFamily: 'Roboto-Medium',
                                                    color: colors.DUMMY_COLOR,
                                                }}
                                            >
                                                {this.props.selectedLanguage.notes} (
                                                {this.props.selectedLanguage.optional})
                                            </Text>
                                            <View style={{ height: heightPercentageToDP(1) }}></View>
                                            <Field
                                                multiline={true}
                                                title={this.state.note}
                                                height={heightPercentageToDP(20)}
                                                placeholder={
                                                    this.props.selectedLanguage.type_something_you_want_here
                                                }
                                                color={'red'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        note: value,
                                                    });
                                                }}
                                                value={this.state.note}
                                                inputStyle={{ paddingBottom: heightPercentageToDP(2) }}
                                                textAlignVertical="top"
                                                maxLength={250}
                                            ></Field>
                                        </View>
                                    </DropShadow>
                                    <View style={{ height: hp(5) }} />

                                    <View style={{ width: wp(90), alignSelf: 'center' }}>
                                        <ButtonPrimary
                                            backgroundColor={this.props.icon.spa_color}
                                            loading={this.state.loading}
                                            onPress={this._handleSpaBookingTime}
                                            text={confirm_booking}
                                            fontWeight={'bold'}
                                            chainData={this.props.chainData}
                                        />
                                    </View>
                                    <View style={{ height: hp(10) }} />
                                </ScrollView>
                            </View>
                        </RootContainer>
                    </View>
                </ScrollView>
                <CustomModal
                    style={{ margin: -1 }}
                    ref={this._modalProcessCompleteModal}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDown"
                    splash
                >
                    <ProcessCompleteModal
                        backgroundColor={this.props.icon.spa_color}
                        processTitle={this.props.selectedLanguage.success}
                        processDescription={
                            this.props.selectedLanguage.success_your_reservation_request_has_been_sent
                        }
                        btnText={this.props.selectedLanguage.go_to_home}
                        onButtonPress={this._handleBack}
                        processImage={require('../../images/paymentSuccess.png')}
                        chainData={this.props.chainData}
                    />
                </CustomModal>
                <CustomModal ref={this._modalDatePicker} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <ModalDatePicker
                        date={new Date(this.state.date)}
                        minimumDate={new Date()}
                        dateSelected={true}
                        color={color}
                        onDateChange={this._onChangeDate}
                        showModal={this._handleModalDatePicker(true)}
                        title={pick_your_booking_date}
                        otherText={{ date, month, year, minutes, hours, ok }}
                        chainData={this.props.chainData}
                    />
                </CustomModal>

                <CustomModal ref={this._modalDatePicker2} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <ModalDatePicker
                        date={new Date(this.state.time)}
                        startSelected={true}
                        minimumDate={new Date(this.state.time)}
                        color={color}
                        onDateChange={this._onChangeDate2}
                        showModal={this._handleModalDatePicker2(true)}
                        title={this.props.selectedLanguage.pick_your_time_booking}
                        otherText={{ date, month, year, minutes, hours, ok }}
                        chainData={this.props.chainData}
                    />
                </CustomModal>
                {/* <Navbar isViolet={color === ''} color={color} onClick={this._handleBack} title={spa.name} />

                <ScrollView>
                    <View style={{ height: scale.w(5) }} />
                    <H4 textAlign="center" fontSize={scale.w(16)}>
                        {isReserveSpaType ? reserve_a_spa_treatment : order_spa_room_service}
                    </H4>
                    <View style={{ height: scale.w(20) }} />
                    <View style={{ marginHorizontal: scale.w(55) }}>
                        <ButtonSecondary
                            onPress={this._handleChooseTreatment}
                            text={
                                selectedTreatments.length > 0
                                    ? `${selectedTreatments.length} ${this.props.selectedLanguage.treatments_selected}`
                                    : choose_treatment
                            }
                            fontSize={scale.w(16)}
                            height={scale.w(48)}
                        />
                    </View>
                    <View style={{ height: scale.w(60) }} />
                    <FieldForm
                        label={number_of_people}
                        placeholder="No."
                        value={numberPeople}
                        onChangeText={(numberPeople) => this.setState({ numberPeople: numberPeople })}
                        autoCapitalize="none"
                        keyboardType="number-pad"
                    />
                    <View style={{ height: scale.w(20) }} />
                    <TouchableOpacity
                        onPress={debounce(this._handleModalDatePicker(false), 1000, {
                            leading: true,
                            trailing: false,
                        })}
                        activeOpacity={0.7}
                    >
                        <FieldForm
                            label={time_of_booking + ':'}
                            value={time !== '' ? format(time, 'hh:mma') : this.props.selectedLanguage.time}
                            isEmpty={time === ''}
                            textOnly
                        />
                    </TouchableOpacity>
                    <View style={{ height: scale.w(20) }} />
                    <TouchableOpacity
                        onPress={debounce(this._handleModalDatePicker2(false), 1000, {
                            leading: true,
                            trailing: false,
                        })}
                        activeOpacity={0.7}
                    >
                        <FieldForm
                            label={'Date'}
                            value={
                                this.state.date === '' ? 'DD/MM/YY' : format(this.state.date, 'DD/MM/YYYY')
                            }
                            isEmpty={this.state.date === ''}
                            textOnly
                        />
                    </TouchableOpacity>
                    <Animatable.View
                        useNativeDriver
                        animation="fadeIn"
                        duration={300}
                        style={styles.submit_btn_container}
                    >
                        <ButtonPrimary
                            onPress={this._handleSpaBookingTime}
                            text={confirm_booking}
                            backgroundColor={color || colors.VIOLET}
                            loading={loading}
                            disabled={loading}
                        />
                    </Animatable.View>
                </ScrollView>

                <CustomModal ref={this._modalTimePicker} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <ModalTimePicker
                        time={time !== '' ? new Date(time) : new Date()}
                        onDateChange={(time) => this.setState({ time: time.toString() })}
                        showModal={this._handleModalDatePicker(true)}
                        title={this.props.selectedLanguage.pick_your_time_booking}
                        isViolet={color === ''}
                        color={color}
                        mode={'time'}
                        otherText={{ hours: hours, minutes: minutes, ok: ok }}
                        selectedLanguage={this.props.selectedLanguage}
                    />
                </CustomModal>
                <CustomModal ref={this._modalDatePicker} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <ModalDatePicker
                        date={new Date(this.state.date)}
                        minimumDate={new Date()}
                        color={color}
                        onDateChange={this._onChangeDate}
                        showModal={this._handleModalDatePicker2(true)}
                        title={pick_your_booking_date}
                        otherText={{ date: date, month: month, year: year, ok: ok }}
                    />
                </CustomModal>

                <AttentionModal
                    visible={this.state.visible}
                    toggleModal={this.toggleModal}
                    text={this.state.text}
                    attention={this.props.selectedLanguage.attention}
                    ok={this.props.selectedLanguage.ok}
                /> */}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    calendar_container: {
        paddingHorizontal: scale.w(13),
        marginTop: scale.w(20),
    },
    submit_btn_container: {
        paddingHorizontal: scale.w(57),
        marginTop: scale.h(100),
        flex: 1,
        paddingBottom: scale.h(40),
    },
});

export default SpaBookingTime;
