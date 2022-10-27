import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Alert,
    ScrollView,
    Platform,
    Image,
    KeyboardAvoidingView,
    TextInput,
    StatusBar,
} from 'react-native';
import base from '../../utils/baseStyles';
// import { scale } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IRestaurant } from '../../types/restaurant';
import FieldForm from './Components/FieldForm';
import { debounce } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import colors from '../../constants/colors';
import { Calendar as CalendarWidget, DateObject } from 'react-native-calendars';
import { format } from 'date-fns';
import CustomModal from '../_global/CustomModal';
import ModalTimePicker from './Components/ModalTimePicker';
import { IBookATableReduxProps } from './BookATable.Container';
import { Text, View as ViewAnimatable } from 'react-native-animatable';
import ModalDatePicker from './Components/ModalDatePicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { H4 } from '../_global/Text';
import ImageZoom from 'react-native-image-pan-zoom';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import Modal from 'react-native-modal';
import AttentionModal from '../_global/AttentionModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DIcon from 'react-native-vector-icons/MaterialIcons';
import { IFeatureHotel } from '../../types/hotel';
import CompleteProcess from '../_global/processComplete';
import { chat, PaymentDetailScreen } from '../../utils/navigationControl';
import { toast } from '../../utils/handleLogic';
import DropShadow from 'react-native-drop-shadow';
import Calendar from '../../images/calendar.svg';
import User from '../../images/user.svg';
import { RootContainer } from '../_global/Container';
import Field from '../LostAndFound/Component/field';
export interface IBookATableProps extends IBookATableReduxProps {
    componentId: string;
    restaurant: IRestaurant;
}

interface IBookATableState {
    booking_date: string;
    booking_end_date: string;
    numberPeople: string;
    loading: boolean;
    // table_array: string[];
    table_no: number;
    modalVisible1: boolean;
    image_url: string;
    visible: boolean;
    text: string;
    note: string;
    startSelected: boolean;
    selectedDateTime: string;
    tableNoState: boolean;
}

class BookATable extends React.Component<IBookATableProps, IBookATableState> {
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalDatePicker2 = React.createRef<CustomModal>();
    private _modalCompleteProcess = React.createRef<CustomModal>();

    constructor(props: IBookATableProps) {
        super(props);
        this.state = {
            booking_date: '',
            booking_end_date: '',
            numberPeople: props.numberPeople.toString(),
            loading: false,
            table_no: 0,
            modalVisible1: false,
            image_url: '',
            visible: false,
            text: '',
            note: '',
            startSelected: false,
            selectedDateTime: '',
            tableNoState: false,
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleBookATable = this._handleBookATable.bind(this);
        this._handleModalDatePicker = this._handleModalDatePicker.bind(this);
        // this._onDayPress = this._onDayPress.bind(this);
        // this._getMarkedDates = this._getMarkedDates.bind(this);
        this._handleModalDatePicker2 = this._handleModalDatePicker2.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._onChangeDate2 = this._onChangeDate2.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
        this._handleChat = this._handleChat.bind(this);
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handleBookATable() {
        console.log(
            format(this.state.booking_date, 'YYYY-MM-DD ') + format(this.state.booking_end_date, ' HH:mm:ss'),
        );
        if (this._isLockFeature()) {
            return false;
        }
        this.setState({
            selectedDateTime:
                format(this.state.booking_date, 'YYYY-MM-DD ') +
                format(this.state.booking_end_date, ' HH:mm:ss'),
        });
        console.log('this state', this.state);
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let now_time = `${hours}:${minutes}`;
        if (!this.props.isCheckedIn) {
            // Alert.alert('Attention', 'Please check in first, to use this service');
            this.setState({
                text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
                visible: true,
            });
        } else if (this.props.status == 'pending') {
            // Alert.alert('Attention', 'To use this feature, your check in must be accepted by hotel admin');
            this.setState({
                text: this.props.selectedLanguage
                    .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
                visible: true,
            });
        } else if (this.state.booking_date == '' || this.state.booking_date == null) {
            toast(this.props.selectedLanguage.please_select_your_booking_date);
            return 0;
        } else if (this.state.booking_end_date == '' || this.state.booking_end_date == null) {
            toast(this.props.selectedLanguage.plese_select_your_booking_time);
            return 0;
        } else if (isNaN(Number(this.state.numberPeople))) {
            //     this.ref_numberPeople.current.focus();
            // .current.focus()
            toast(this.props.selectedLanguage.please_enter_valid_numeric_value_only);
            return 0;
        } else if (Number(this.state.numberPeople) < 1) {
            //   this.ref_numberPeople.current.focus();
            // .current.focus()
            toast(this.props.selectedLanguage.number_of_people_must_be_at_least_one);
            return 0;
        } else if (Number(this.state.numberPeople) > 10) {
            //  this.ref_numberPeople.current.focus();
            // .current.focus()
            toast(this.props.selectedLanguage.number_of_people_can_not_be_more_than_10);
            return 0;
        } else {
            if (
                this.state.numberPeople !== '' &&
                Number(this.state.numberPeople) !== NaN &&
                Number(this.state.numberPeople) < 15
            ) {
                this.setState({ loading: true });
                const {
                    restaurant: { id },
                } = this.props;
                const { numberPeople, booking_date, booking_end_date, table_no, note } = this.state;

                this.props.bookATable(
                    this.props.restaurant.id,
                    Number(numberPeople) !== NaN ? Number(numberPeople) : 0,
                    booking_date,
                    booking_end_date,
                    table_no,
                    note,
                    () => {
                        this.setState({ loading: false });
                        this._modalCompleteProcess.current?.show();
                    },
                    () => {
                        this.setState({ loading: false });
                    },
                );
            } else {
                toast(
                    this.props.selectedLanguage
                        .please_enter_number_of_people_and_check_if_its_valid_number_of_people,
                );
            }
            // Navigation.push(this.props.componentId,PaymentDetailScreen({
            //     backGround: false,
            // }))
        }
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    setModalVisible(visible: boolean) {
        this.setState({ modalVisible1: visible });
    }

    // _onDayPress(date: DateObject) {
    //     this.setState({ date: date.dateString });
    // }

    // _getMarkedDates() {
    //     if (this.state.date !== '') {
    //         return {
    //             [this.state.date]: {
    //                 selected: true,
    //             },
    //         };
    //     }

    //     return {};
    // }
    _handleModalDatePicker(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalDatePicker.current) {
                if (closeModal) {
                    this._modalDatePicker.current.hide();
                } else {
                    this._modalDatePicker.current.show();
                    this.setState({ booking_date: new Date().toString() });
                }
            }
        };
    }

    _handleModalDatePicker2(closeModal?: boolean) {
        console.log('close modalll', closeModal);
        return () => {
            if (this.state.booking_date != '') {
                Keyboard.dismiss();
                if (this._modalDatePicker2.current) {
                    if (closeModal) {
                        this._modalDatePicker2.current.hide();
                    } else {
                        this._modalDatePicker2.current.show();
                        this.setState({ booking_end_date: new Date().toString() });
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
            booking_date: date.toString(),
            startSelected: true,
        });
    }

    _onChangeDate2(date: Date) {
        console.log('dateeee', date);
        this.setState((prevState) => {
            if (prevState.booking_end_date) {
                return {
                    ...prevState,
                    booking_end_date: date.toString(),
                };
            }

            return {
                ...prevState,
                booking_end_date: date.toString(),
            };
        });
    }

    _isLockFeature(feature?: keyof IFeatureHotel) {
        console.log('=======feature', feature);
        if (feature !== 'is_check_in_enabled' && !this.props.isCheckedIn) {
            this.setState({
                text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
                visible: true,
            });
            return true;
        }
        if (feature !== 'is_check_in_enabled' && this.props.status === 'pending') {
            this.setState({
                text: this.props.selectedLanguage
                    .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
                visible: true,
            });
            return true;
        }
        return false;
    }

    _handleChat() {
        if (this._isLockFeature()) {
            return false;
        }
        // this._modalCompleteProcess.current?.hide()
        Navigation.push(this.props.componentId, chat());
        // console.log(this.props.componentId)
    }

    render() {
        const { restaurant, color } = this.props;
        const {
            number_of_people,
            time_of_booking,
            confirm_booking,
            select_table,
            select_table_no,
            date,
            hours,
            minutes,
            ok,
            month,
            year,
            pick_your_booking_date,
            pick_your_time_booking,
            booking_from,
            booking_until,
        } = this.props.selectedLanguage;
        var table_array = [];
        Array(Number(restaurant.res_table_numbers))
            .fill('')
            .map((item, index) => {
                table_array.push({ label: (index + 1).toString(), value: (index + 1).toString() });
            });

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
                            backgroundColor: this.props.icon.restaurant_color,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && (
                    <StatusBar backgroundColor={this.props.icon.restaurant_color}></StatusBar>
                )}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ height: heightPercentageToDP(100), width: widthPercentageToDP(100) }}>
                        {/* <RootContainer> */}
                        <View
                            style={{
                                height: heightPercentageToDP(15),
                                backgroundColor: this.props.icon.restaurant_color,
                            }}
                        >
                            {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                            <Navbar
                                tintBackColor={colors.WHITE}
                                titleColor={colors.WHITE}
                                onClick={this._handleBack}
                                title={this.props.selectedLanguage.table_booking}
                            />
                            {/* </ImageBackground> */}
                        </View>
                        <View
                            style={{
                                height: heightPercentageToDP(90),
                                width: widthPercentageToDP(100),
                                backgroundColor: colors.WHITE,
                                top: -heightPercentageToDP(5),
                                borderTopLeftRadius: scale.w(3.5),
                                borderTopRightRadius: scale.w(3.5),
                                paddingTop: heightPercentageToDP(0.75),
                            }}
                        >
                            <ScrollView>
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
                                                    {this.state.booking_date === ''
                                                        ? this.props.selectedLanguage.date
                                                        : this.props.selectedLanguage.date +
                                                          ': ' +
                                                          format(this.state.booking_date, 'DD-MM-YYYY ')}
                                                </Text>
                                            </View>
                                            <Calendar style={{ paddingHorizontal: widthPercentageToDP(4) }} />
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
                                                    {this.state.booking_end_date === ''
                                                        ? this.props.selectedLanguage.time
                                                        : this.props.selectedLanguage.time +
                                                          ': ' +
                                                          format(this.state.booking_end_date, ' HH:mm')}
                                                </Text>
                                            </View>
                                            <Calendar style={{ paddingHorizontal: widthPercentageToDP(4) }} />
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
                                            paddingHorizontal: wp(4),
                                            borderRadius: scale.w(2.5),
                                            marginTop: hp(2),
                                            paddingVertical: hp(1.5),

                                            //   height : heightPercentageToDP(26),
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
                                                color: colors.DUMMY_COLOR,
                                                fontFamily: 'Roboto-Medium',
                                                marginTop: hp(2),
                                            }}
                                        >
                                            {' '}
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
                                        <View style={{ height: this.state.tableNoState ? hp(21) : hp(11) }}>
                                            <DropDownPicker
                                                zIndex={500}
                                                items={table_array}
                                                placeholder={this.props.selectedLanguage.select_table_no}
                                                placeholderStyle={{ paddingHorizontal: wp(1.7) }}
                                                labelStyle={{
                                                    fontFamily: 'Roboto-Regular',
                                                    color: colors.DUMMY_COLOR,
                                                }}
                                                activeLabelStyle={{
                                                    fontFamily: 'Roboto-Bold',
                                                    color: colors.DUMMY_COLOR,
                                                }}
                                                style={{
                                                    backgroundColor: colors.COM_BACKGROUND,
                                                    borderTopLeftRadius: scale.w(1.8),
                                                    borderTopRightRadius: scale.w(1.8),
                                                    borderBottomLeftRadius: scale.w(1.8),
                                                    borderBottomRightRadius: scale.w(1.8),
                                                    paddingHorizontal:
                                                        this.state.table_no == 0 ? wp(2) : wp(3),
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',

                                                    width: wp(82),
                                                    marginTop: hp(2),
                                                    borderWidth: 0,
                                                    borderRadius: scale.w(20),
                                                    paddingRight: wp(3),
                                                }}
                                                // labelStyle={{
                                                //     color: colors.ANONYMOUS2,
                                                //     fontFamily: 'Roboto-Regular',
                                                //     fontSize: scale.w(15),
                                                // }}
                                                // activeLabelStyle={{ fontFamily: 'Roboto-Bold', color: colors.BLACK }}
                                                itemStyle={{
                                                    justifyContent: 'flex-start',
                                                }}
                                                // placeholderStyle={{
                                                //     color: colors.ANONYMOUS2,
                                                //     fontFamily: 'Roboto-Regular',
                                                //     fontSize: scale.w(15),
                                                // }}
                                                arrowStyle={{
                                                    marginRight: scale.w(1),
                                                }}
                                                arrowColor={'#121924'}
                                                dropDownStyle={{
                                                    width: '100%',
                                                    marginTop: heightPercentageToDP(2.5),
                                                    height: hp(12),
                                                }}
                                                containerStyle={{
                                                    height: hp(8.5),
                                                }}
                                                onOpen={() => {
                                                    this.setState({
                                                        tableNoState: true,
                                                    });
                                                }}
                                                onClose={() => {
                                                    this.setState({
                                                        tableNoState: false,
                                                    });
                                                }}
                                                onChangeItem={(item) => {
                                                    this.setState({
                                                        table_no: item.value,
                                                    });
                                                }}
                                            />
                                        </View>
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
                                                fontSize: scale.w(1.6),
                                                fontFamily: 'Roboto-Medium',
                                                color: colors.DUMMY_COLOR,
                                            }}
                                        >
                                            {this.props.selectedLanguage.description}
                                        </Text>
                                        <View style={{ height: heightPercentageToDP(1) }}></View>
                                        <Field
                                            multiline={true}
                                            title={this.state.note}
                                            // height={heightPercentageToDP(20)}
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
                                <View style={{ height: hp(3) }} />

                                <View style={{ width: wp(90), alignSelf: 'center' }}>
                                    <ButtonPrimary
                                        backgroundColor={this.props.icon.restaurant_color}
                                        loading={this.state.loading}
                                        onPress={() => this._handleBookATable()}
                                        text={confirm_booking}
                                        fontWeight={'bold'}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                                <View style={{ height: hp(3) }} />
                            </ScrollView>
                        </View>
                        {/* </RootContainer> */}

                        {/* <CustomModal ref={this._modalTimePicker} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <ModalTimePicker
                        time={this.state.time !== '' ? new Date(this.state.time) : new Date()}
                        onTimeChange={(time) => this.setState({ time: time.toString() })}
                        minimumDate={new Date()}
                        showModal={this._handleModalDatePicker(true)}
                        title={pick_your_time_booking}
                        color={color}
                        otherText={{ hours: hours, minutes: minutes, ok: ok }}
                    />
                </CustomModal> */}

                        <CustomModal
                            ref={this._modalDatePicker}
                            animationIn="fadeInUp"
                            animationOut="fadeOutDown"
                        >
                            <ModalDatePicker
                                date={new Date(this.state.booking_date)}
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

                        <CustomModal
                            ref={this._modalDatePicker2}
                            animationIn="fadeInUp"
                            animationOut="fadeOutDown"
                        >
                            <ModalDatePicker
                                date={new Date(this.state.booking_end_date)}
                                startSelected={true}
                                minimumDate={new Date(this.state.booking_date)}
                                color={color}
                                onDateChange={this._onChangeDate2}
                                showModal={this._handleModalDatePicker2(true)}
                                title={pick_your_time_booking}
                                otherText={{ date, month, year, minutes, hours, ok }}
                                chainData={this.props.chainData}
                            />
                        </CustomModal>

                        <Modal
                            onBackdropPress={() => {
                                this.setModalVisible(false);
                            }}
                            onBackButtonPress={() => {
                                this.setModalVisible(false);
                            }}
                            isVisible={this.state.modalVisible1}
                            animationType="slide"
                            animationInTiming={500}
                            backdropOpacity={0.9}
                            style={styles.modal}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={styles.modalContainer}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            height: '100%',
                                        }}
                                    >
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                alignSelf: 'center',
                                            }}
                                        >
                                            <ImageZoom
                                                cropWidth={wp(100)}
                                                cropHeight={hp(100)}
                                                imageWidth={wp(100)}
                                                imageHeight={hp(100)}
                                            >
                                                <Image
                                                    resizeMode="contain"
                                                    source={{ uri: this.state.image_url }}
                                                    style={styles.image}
                                                ></Image>
                                            </ImageZoom>
                                        </View>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        position: 'absolute',
                                        height: '100%',
                                        alignSelf: 'flex-start',
                                        paddingHorizontal: wp(1.2),
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setModalVisible(false);
                                        }}
                                    >
                                        <Image
                                            source={require('../../images/icon_back.png')}
                                            style={{ width: scale.w(30), height: scale.w(30) }}
                                            resizeMode={'contain'}
                                        ></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <CustomModal
                            ref={this._modalCompleteProcess}
                            animationIn="fadeInUp"
                            animationOut="fadeOutDown"
                            style={{ margin: -1 }}
                        >
                            <CompleteProcess
                                backgroundColor={this.props.icon.restaurant_color}
                                processImage={require('../../images/paymentPageImg.png')}
                                processTitle={this.props.selectedLanguage.table_booked_successfully}
                                processDescription={
                                    this.props.selectedLanguage.your_table_booking_request_has_been_received
                                }
                                // twoButton={true}
                                btnText={this.props.selectedLanguage.go_to_home}
                                // btnText={this.props.selectedLanguage.chat_now}
                                onButtonPress={() => {
                                    this._modalCompleteProcess.current?.hide();
                                    Navigation.pop(this.props.componentId);
                                }}
                                chainData={this.props.chainData}
                                // onButtonPress={this._handleChat}
                            />
                        </CustomModal>

                        <AttentionModal
                            visible={this.state.visible}
                            toggleModal={this.toggleModal}
                            text={this.state.text}
                            attention={this.props.selectedLanguage.attention}
                            ok={this.props.selectedLanguage.ok}
                        />
                        {/* <ScrollView>
<View style={{ height: scale.h(100) }} />
<FieldForm
    label={number_of_people}
    placeholder="No."
    value={this.state.numberPeople}
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
    // disabled={this.props.isCheckedIn}
    activeOpacity={0.8}
>
    <FieldForm
        label={booking_from}
        value={
            this.state.booking_date === ''
                ? 'DD/MM/YY HH:mm'
                : format(this.state.booking_date, 'DD/MM/YYYY HH:mm')
        }
        isEmpty={this.state.booking_date === ''}
        textOnly
    />
</TouchableOpacity>
<View style={{ height: scale.w(20) }} />
<TouchableOpacity
    onPress={debounce(this._handleModalDatePicker2(false), 1000, {
        leading: true,
        trailing: false,
    })}
    // disabled={this.props.isCheckedIn}
    activeOpacity={0.8}
>
    <FieldForm
        label={booking_until}
        value={
            this.state.booking_end_date === ''
                ? 'DD/MM/YY HH:mm'
                : format(this.state.booking_end_date, 'DD/MM/YYYY HH:mm')
        }
        isEmpty={this.state.booking_end_date === ''}
        textOnly
    />
</TouchableOpacity>
<View style={{ height: scale.w(20) }} />
<FieldForm
    label={this.props.selectedLanguage.note}
    placeholder={this.props.selectedLanguage.anything_to_add}
    value={this.state.note}
    onChangeText={(note) => this.setState({ note: note })}
    autoCapitalize="none"
    multiline={true}
    numberOfLines={2}
/>
<View style={{ height: scale.w(20) }} />
<View
    style={{
        flex: 1,
        paddingRight: scale.w(8),
        paddingLeft: scale.w(20),
        marginBottom: scale.h(5),
    }}
>
    <H4 fontSize={scale.w(18)}>{select_table_no}</H4>
</View>
<DropDownPicker
    zIndex={500}
    items={table_array}
    placeholder={select_table}
    containerStyle={{
        height: scale.h(50),
        marginLeft: scale.w(20),
    }}
    style={{
        backgroundColor: 'white',
        borderWidth: 0,
        width: scale.w(321),
        borderTopRightRadius: scale.w(25),
        borderTopLeftRadius: scale.w(25),
        borderBottomLeftRadius: scale.w(25),
        borderBottomRightRadius: scale.w(25),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
        paddingLeft: scale.w(26),
    }}
    labelStyle={{
        fontFamily: 'Roboto-Light',
        color: colors.BLACK,
    }}
    activeLabelStyle={{ fontFamily: 'Roboto-Bold', color: colors.BLACK }}
    itemStyle={{
        justifyContent: 'flex-start',
    }}
    placeholderStyle={{
        color: '#888',
        fontFamily: 'Roboto-Light',
        fontSize: scale.w(18),
    }}
    arrowStyle={{
        marginRight: scale.w(10),
    }}
    arrowColor={'black'}
    dropDownStyle={{
        backgroundColor: colors.WHITE,
        width: scale.w(321),
        borderTopLeftRadius: scale.w(25),
        borderTopRightRadius: scale.w(25),
        borderBottomRightRadius: scale.w(25),
        borderBottomLeftRadius: scale.w(25),
        marginTop: scale.h(5),
    }}
    onChangeItem={(item) => {
        this.setState({
            table_no: item.value,
        });
    }}
/>
<View style={{ height: scale.w(20) }} />
<View
    style={{
        paddingHorizontal: scale.w(20),
    }}
>
    {restaurant.res_table_layout !== null ? (
        <TouchableOpacity
            onPress={() => {
                this.setState({ image_url: restaurant.res_table_layout });
                setTimeout(() => {
                    this.setModalVisible(true);
                }, 500);
            }}
            style={{
                width: scale.w(320),
                height: scale.h(250),
            }}
        >
            <Image
                source={{ uri: restaurant.res_table_layout }}
                style={{
                    width: '100%',
                    height: '100%',
                    marginBottom: scale.w(8),
                    borderRadius: scale.h(15),
                }}
                resizeMode="cover"
            />
        </TouchableOpacity>
    ) : (
        <View />
    )}
</View>
<Animatable.View
    useNativeDriver
    animation="fadeIn"
    duration={300}
    style={styles.submit_btn_container}
>
    <ButtonPrimary
        onPress={this._handleBookATable}
        text={confirm_booking}
        backgroundColor={color || colors.BROWN}
        loading={this.state.loading}
        disabled={this.state.loading}
    />
</Animatable.View>
</ScrollView> */}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    calendar_container: {
        paddingHorizontal: wp(5),
        marginTop: hp(2),
    },
    submit_btn_container: {
        paddingHorizontal: scale.w(57),
        marginTop: scale.w(18),
        flex: 1,
        marginBottom: scale.h(150),
        zIndex: 100,
    },

    modalContainer: {
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginHorizontal: 10,
    },
    modal: {
        height: '100%',
        marginLeft: -1,
        paddingVertical: 20,
        marginBottom: -1,
    },
    image: {
        alignContent: 'center',
        width: '100%',
        height: hp('100%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        // position: 'relative',
    },
});

export default BookATable;
