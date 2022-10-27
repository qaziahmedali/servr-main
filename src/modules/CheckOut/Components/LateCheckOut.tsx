// import React from 'react';
// import { Separator } from '../../_global/Container';
// import { StyleSheet } from 'react-native';
// import { widthPercentageToDP, scale, heightPercentageToDP } from '../../../utils/dimensions';
// import colors from '../../../constants/colors';
// import { H1, H4 } from '../../_global/Text';
// import * as Animatable from 'react-native-animatable';
// import { TLateCheckoutStatus } from '../../../types/account';

// interface IMessageCheckOut {
//     pending: string;
//     accepted: string;
//     rejected: string;
// }

// interface ILateCheckOutProps {
//     checkoutTime: string;
//     lateCheckoutTime: string;
//     lateCheckoutStatus: TLateCheckoutStatus;
//     color?: string;
//     selectedLanguage?: any;
// }

// export default class LateCheckOut extends React.PureComponent<ILateCheckOutProps> {
//     render() {
//         const { lateCheckoutStatus, lateCheckoutTime, checkoutTime } = this.props;

//         const message: IMessageCheckOut = {
//             pending: this.props.selectedLanguage.your_late_check_out_request_has_been_sent,
//             accepted: this.props.selectedLanguage.please_check_back_to_see_if_your_request_was_accepted,
//             rejected: 'Your late check out request has been rejected.',
//         };

//         const messageSecondary: IMessageCheckOut = {
//             pending: this.props.selectedLanguage.please_check_back_to_see_if_your_request_was_accepted,
//             accepted: this.props.selectedLanguage.your_new_check_out_time_is,
//             rejected: this.props.selectedLanguage.your_check_out_time_is,
//         };

//         return (
//             <>
//                 {(lateCheckoutStatus === 'pending' || lateCheckoutStatus === 'accepted') && (
//                     <Animatable.Image
//                         useNativeDriver
//                         animation="bounceIn"
//                         duration={400}
//                         source={require('../../../images/icon_smiley.png')}
//                         style={[styles.image, { tintColor: this.props.color }]}
//                     />
//                 )}

//                 <Animatable.View
//                     useNativeDriver
//                     animation="fadeInUp"
//                     duration={400}
//                     delay={100}
//                     style={styles.input_container}
//                 >
//                     <H1 fontSize={scale.w(24)} textAlign="center" color={this.props.color}>
//                         {message[lateCheckoutStatus ? lateCheckoutStatus : 'pending']}
//                     </H1>
//                     <Separator height={10} />
//                     <H4 textAlign="center" fontSize={scale.w(20)} color={colors.DARK_GREY}>
//                         {messageSecondary[lateCheckoutStatus ? lateCheckoutStatus : 'pending']}
//                     </H4>
//                     <Separator height={10} />
//                     {lateCheckoutStatus && lateCheckoutStatus !== 'pending' && (
//                         <H1 fontSize={scale.w(50)} textAlign="center" color={this.props.color}>
//                             {lateCheckoutStatus === 'accepted' ? lateCheckoutTime : checkoutTime}
//                         </H1>
//                     )}
//                 </Animatable.View>
//             </>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     input_container: {
//         width: widthPercentageToDP(92),
//         alignSelf: 'center',
//         marginBottom: heightPercentageToDP(2),
//         alignItems: 'center',
//         marginTop: scale.w(62),
//     },
//     image: {
//         width: scale.w(120),
//         height: scale.w(120),
//         alignSelf: 'center',
//     },
// });
import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Alert,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    TextInput,
    BackHandler,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import Image from 'react-native-image-progress';
import base from '../../../utils/baseStyles';
import Navbar from '../../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IRestaurant } from '../../../types/restaurant';
import FieldForm from '../../Restaurant/Components/FieldForm';
import { debounce } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../../_global/Button';
import colors from '../../../constants/colors';
import { Calendar as CalendarWidget, DateObject } from 'react-native-calendars';
import { format } from 'date-fns';
import CustomModal from '../../_global/CustomModal';
import ModalTimePicker from '../../Restaurant/Components/ModalTimePicker';
import { ILateCheckOutReduxProps } from './LateCheckOut.Container';
import { Text, View as ViewAnimatable } from 'react-native-animatable';
import ModalDatePicker from '../../Restaurant/Components/ModalDatePicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { H4, H3, H3_medium } from '../../_global/Text';
import ImageZoom from 'react-native-image-pan-zoom';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP,
    heightPercentageToDP,
} from '../../../utils/dimensions';
import Modal from 'react-native-modal';
import AttentionModal from '../../_global/AttentionModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DIcon from 'react-native-vector-icons/MaterialIcons';
import CheckBox from '@react-native-community/checkbox';
import ProcessComplete from '../../_global/processComplete';
import { toast } from '../../../utils/handleLogic';
import DropShadow from 'react-native-drop-shadow';
import moment from 'moment';
import Calendar from '../../../images/calendar.svg';
import { RootContainer } from '../../_global/Container';
export interface ILateCheckOutProps extends ILateCheckOutReduxProps {
    componentId: string;
    restaurant: IRestaurant;
}

interface ILateCheckOutState {
    booking_date: string;
    booking_end_date: string;
    numberPeople: string;
    loading: boolean;
    // table_array: string[];
    table_no: string;
    modalVisible1: boolean;
    image_url: string;
    visible: boolean;
    text: string;
    note: string;
    startSelected: boolean;
}

class LateCheckOut extends React.Component<ILateCheckOutProps, ILateCheckOutState> {
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalDatePicker2 = React.createRef<CustomModal>();
    private _modalConfirm = React.createRef<CustomModal>();
    constructor(props: ILateCheckOutProps) {
        super(props);

        this.state = {
            booking_date: '',
            booking_end_date: '',
            numberPeople: '89',
            loading: false,
            table_no: '',
            modalVisible1: false,
            image_url: '',
            visible: false,
            text: '',
            note: '',
            startSelected: false,
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.Primary_Color,
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

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handleBookATable() {
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
        } else {
            this.setState({ loading: true });
            const {
                restaurant: { id },
            } = this.props;
            const { numberPeople, booking_date, booking_end_date, table_no, note } = this.state;

            this.props.bookATable(
                id,
                Number(numberPeople) !== NaN ? Number(numberPeople) : 0,
                booking_date,
                booking_end_date,
                table_no,
                async () => {
                    this.setState({ loading: false });
                    await Navigation.popToRoot(this.props.componentId);
                    toast(this.props.selectedLanguage.your_reservation_request_has_been_sent);
                },
                () => {
                    this.setState({ loading: false });
                },
                note,
            );
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

        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
                {/* <View style={{ height: hp(20), backgroundColor: colors.BLUE }}>
                    <Navbar
                        tintBackColor={colors.WHITE}
                        titleColor={colors.WHITE}
                        onClick={this._handleBack}
                        title={'Late CheckOut'}
                    />
                </View> */}
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
                        processImage={require('../../../images/paymentPageImg.png')}
                        processTitle={this.props.selectedLanguage.request_successfull}
                        processDescription={
                            this.props.selectedLanguage.you_have_requested_for_late_check_out_successfully
                        }
                        onButtonPress={() => {
                            this._modalConfirm.current?.hide();
                            Navigation.popToRoot(this.props.componentId);
                        }}
                        btnText={this.props.selectedLanguage.go_to_home}
                        backgroundColor={this.props.Primary_Color}
                        chainData={this.props.chainData}
                    />
                </CustomModal>
                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: heightPercentageToDP(20), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: this.props.Primary_Color,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && (
                    <StatusBar backgroundColor={this.props.Primary_Color}></StatusBar>
                )}

                <RootContainer>
                    <ScrollView>
                        <View
                            style={{
                                height: heightPercentageToDP(14),
                                backgroundColor: this.props.Primary_Color,
                            }}
                        >
                            {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                            <Navbar
                                tintBackColor={colors.WHITE}
                                titleColor={colors.WHITE}
                                onClick={this._handleBack}
                                title={this.props.selectedLanguage.late_checkout}
                            />
                            {/* </ImageBackground> */}
                        </View>
                        <View
                            style={{
                                height: heightPercentageToDP(87),
                                width: widthPercentageToDP(100),
                                backgroundColor: colors.WHITE,
                                top: -heightPercentageToDP(4.3),
                                borderTopLeftRadius: scale.w(3.5),
                                borderTopRightRadius: scale.w(3.5),
                                paddingTop: heightPercentageToDP(0.75),
                            }}
                        >
                            <View
                                style={{
                                    marginHorizontal: widthPercentageToDP(5),
                                    marginTop: heightPercentageToDP(3),
                                }}
                            >
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
                            <View style={{ height: heightPercentageToDP(1) }} />
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
                                        borderColor: colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR,
                                        paddingVertical: heightPercentageToDP(1),
                                        alignSelf: 'center',
                                        width: widthPercentageToDP(90),
                                    }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            source={{
                                                uri: this.props.account.hotel_details.data.room_default_img,
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
                                        <View style={{ marginLeft: widthPercentageToDP(2) }}>
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
                                                    {this.props.account.profile.room_number
                                                        ? this.props.account.profile.room_number
                                                        : 'King Double Suit Sea View'}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: this.props.Primary_Color,
                                                        fontSize: scale.w(1.3),
                                                        marginTop: 5,
                                                        fontFamily: 'Roboto-Medium',
                                                    }}
                                                >
                                                    {this.props.selectedLanguage.check_in +
                                                        ` : ${moment(
                                                            this.props.account.profile.arrival_date,
                                                        ).format('DD MMM')}`}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1 }}></View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    width: wp(60),
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <DIcon
                                                        size={20}
                                                        color={this.props.Primary_Color}
                                                        name={'people-alt'}
                                                    ></DIcon>
                                                    <Text
                                                        style={{
                                                            color: this.props.Primary_Color,
                                                            fontFamily: 'Roboto-Medium',
                                                            fontSize: scale.w(1.3),
                                                            marginLeft: 5,
                                                        }}
                                                    >
                                                        1 {this.props.selectedLanguage.guest}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={{
                                                        color: this.props.Primary_Color,
                                                        fontSize: scale.w(1.3),
                                                        marginTop: 5,
                                                        letterSpacing: 0.7,
                                                        fontFamily: 'Roboto-Medium',
                                                    }}
                                                >
                                                    {this.props.selectedLanguage.check_out +
                                                        ` : ${moment(
                                                            this.props.account.profile.departure_date,
                                                        ).format('DD MMM')}`}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1 }}></View>
                                            <View
                                                style={{
                                                    borderWidth: 1,
                                                    color: this.props.Primary_Color,
                                                    paddingVertical: 5,
                                                    paddingHorizontal: 5,
                                                    marginTop: 5,
                                                    borderRadius: 5,
                                                    borderColor: this.props.Primary_Color,
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
                                                    {this.props.selectedLanguage.check_in_at +
                                                        `: ${moment(
                                                            this.props.account.profile.arrival_date,
                                                        ).format('LT')}`}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </ViewAnimatable>
                            </DropShadow>

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
                                        paddingVertical: hp(2.5),
                                        paddingHorizontal: wp(4),
                                        borderRadius: scale.w(2.5),
                                        backgroundColor: colors.WHITE,
                                        borderWidth: 1,
                                        borderColor: colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR,
                                        //    marginHorizontal: 10,
                                        width: wp(90),
                                        marginTop: hp(2),
                                        alignSelf: 'center',
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
                                        {this.props.selectedLanguage.checkout_time_date}
                                    </Text>

                                    <TouchableOpacity
                                        onPress={debounce(this._handleModalDatePicker(false), 1000, {
                                            leading: true,
                                            trailing: false,
                                        })}
                                        // disabled={this.props.isCheckedIn}
                                        activeOpacity={1}
                                        style={{
                                            backgroundColor: colors.COM_BACKGROUND,
                                            paddingHorizontal: wp(4),
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: hp(2),
                                            borderRadius: 15,
                                            height: hp(6),
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
                                        onPress={debounce(this._handleModalDatePicker2(false), 1000, {
                                            leading: true,
                                            trailing: false,
                                        })}
                                        // disabled={this.props.isCheckedIn}
                                        activeOpacity={1}
                                        style={{
                                            backgroundColor: colors.COM_BACKGROUND,
                                            paddingHorizontal: wp(4),
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            //         width: wp(80),
                                            marginTop: hp(2),
                                            borderRadius: 12,
                                            height: hp(6),
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
                            {/*  */}

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
                                        {this.props.selectedLanguage.note}
                                    </Text>
                                    <View style={{ height: heightPercentageToDP(1) }}></View>
                                    <TextInput
                                        placeholder={this.props.selectedLanguage.anything_to_add}
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
                                <View style={{ height: hp(5) }} />

                                <View style={{ paddingHorizontal: wp(5) }}>
                                    <ButtonPrimary
                                        backgroundColor={this.props.Primary_Color}
                                        loading={this.state.loading}
                                        //  onPress={this._handleBookATable}
                                        onPress={() => {
                                            if (
                                                this.state.booking_date !== '' &&
                                                this.state.booking_end_date !== ''
                                            ) {
                                                this.setState({
                                                    loading: true,
                                                });
                                                this.props.lateCheckOut(
                                                    {
                                                        late_checkout_date_time:
                                                            format(this.state.booking_date, 'YYYY-MM-DD') +
                                                            ' ' +
                                                            format(this.state.booking_end_date, 'HH:mm'),
                                                        late_checkout_note: this.state.note,
                                                    },
                                                    () => {
                                                        console.log('Success');
                                                        this._modalConfirm.current?.show();
                                                        this.setState({
                                                            loading: false,
                                                        });
                                                    },
                                                    () => {
                                                        console.log('Fail');
                                                        this.setState({
                                                            loading: false,
                                                        });
                                                    },
                                                );
                                            } else {
                                                toast(
                                                    this.props.selectedLanguage
                                                        .please_check_your_checkout_date_and_time,
                                                );
                                                this.setState({
                                                    loading: false,
                                                });
                                            }
                                        }}
                                        text={this.props.selectedLanguage.request_late_checkOut}
                                        fontSize={scale.w(1.7)}
                                        fontWeight={'bold'}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                            </DropShadow>
                            <View style={{ height: hp(1) }} />
                            {/* </ScrollView> */}
                        </View>
                    </ScrollView>
                </RootContainer>

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

                <CustomModal ref={this._modalDatePicker} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <ModalDatePicker
                        date={new Date(this.state.booking_date)}
                        minimumDate={new Date()}
                        dateSelected={true}
                        color={this.props.Primary_Color}
                        onDateChange={this._onChangeDate}
                        showModal={this._handleModalDatePicker(true)}
                        title={pick_your_booking_date}
                        otherText={{ date, month, year, minutes, hours, ok }}
                        chainData={this.props.chainData}
                    />
                </CustomModal>

                <CustomModal ref={this._modalDatePicker2} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <ModalDatePicker
                        date={new Date(this.state.booking_end_date)}
                        startSelected={true}
                        minimumDate={new Date(this.state.booking_date)}
                        color={this.props.Primary_Color}
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
                                activeOpacity={1}
                            >
                                <Image
                                    source={require('../../../images/headerMask.png')}
                                    style={{ width: scale.w(30), height: scale.w(30) }}
                                    resizeMode={'contain'}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

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

export default LateCheckOut;
