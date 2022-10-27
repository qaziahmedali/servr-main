import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    Text,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableHighlight,
    ImageBackground,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
    BackHandler,
    StatusBar,
} from 'react-native';
import base from '../../utils/baseStyles';
import { H4, H2, H1 } from '../_global/Text';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import MenuButton from '../_global/MenuButton';
import {
    chat,
    requestItems,
    cleaningRequestComplete,
    laundryService,
    additionalservices,
    mainmenu,
    conciergeTrackingProgress,
    wakeupCall,
    parkingValet,
    RoomCleaningService,
    wakeupCallComplete,
} from '../../utils/navigationControl';

import { IConciergeServiceReduxProps } from './ConciergeService.Container';
import colors from '../../constants/colors';
import { ICleaningServiceReduxProps } from '../CleaningService/CleaningService.Container';
import CustomModal from '../_global/CustomModal';
import ProcessComplete from '../_global/processComplete';
import NoteOrderItem from './Components/NoteOrderItem';
import { debounce, find } from 'lodash';
import Modal from 'react-native-modal';
import { IFeatureHotel } from '../../types/hotel';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import AttentionModal from '../_global/AttentionModal';
import { View as ViewAnimatable } from 'react-native-animatable';
import RoundView from '../_global/roundView';
import moment, { Moment } from 'moment';
import {
    cancelSchduleNotification,
    localNotificationDays,
    LocalNotificationSchedule,
    LocalNotificationScheduleCahnnel,
    toast,
    WAKE_UP_ID,
} from '../../utils/handleLogic';
import HeaderMask from '../../images/headerMask.svg';
import BackArrow from '../../images/backArrow.svg';
import { RootContainer } from '../_global/Container';
import AdditonalService from '../CheckIn/AdditionalService';

export interface IConciergeServiceProps extends IConciergeServiceReduxProps {
    componentId: string;
    backGround?: boolean;
    departureDate: Moment;
}

interface ISelectedItems {
    qty: string;
    id: Number;
    name: string;
}

interface IConciergeServiceState {
    items: ISelectedItems[];
    price: number;
    loading: boolean;
    note: string;
    modalVisible: boolean;
    visible: boolean;
    text: string;
    noteModal: boolean;
    develop: boolean;
    on: boolean;
    wakeUpTime: string;
    wakeUpNote: string;
    wakeUpDay: [];
    days: any;
    requestedWakeUpCall: boolean;
    conceriageServiceTabs: Array;
}
// export interface ICleaningServiceProps extends ICleaningServiceReduxProps {
//     componentId: string;
// }

// interface ICleaningServiceState {
//     loading: boolean;
// }

class ConciergeService extends React.Component<IConciergeServiceProps, IConciergeServiceState> {
    private _modalAlert = React.createRef<CustomModal>();
    private _modalNoteOrderItem = React.createRef<CustomModal>();
    private _modalPaymentSuccessfullModal = React.createRef<CustomModal>();

    constructor(props: IConciergeServiceProps) {
        super(props);
        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        console.log(this.state);
        this._handleBack = this._handleBack.bind(this);
        this._handleRequestItems = this._handleRequestItems.bind(this);
        this._handleMyOrders = this._handleMyOrders.bind(this);
        this._handleRoomCleaning = this._handleRoomCleaning.bind(this);
        this._handleLaundryService = this._handleLaundryService.bind(this);
        this._handleAdditionalService = this._handleAdditionalService.bind(this);
        this._onChangeText = this._onChangeText.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this._handleWakeupCall = this._handleWakeupCall.bind(this);
        this._handleParking = this._handleParking.bind(this);
        this._handlePhone = this._handlePhone.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
        this._handleChat = this._handleChat.bind(this);
        this._WakeUpTime = this._WakeUpTime.bind(this);
        this.onAdditionalServiceBack = this.onAdditionalServiceBack.bind(this);
        const tempObj = [
            { name: 'M', value: 'Monday', selected: false },
            { name: 'T', value: 'Tuesday', selected: false },
            { name: 'W', value: 'Wednesday', selected: false },
            { name: 'T', value: 'Thursday', selected: false },
            { name: 'F', value: 'Friday', selected: false },
            { name: 'S', value: 'Saturday', selected: false },
            { name: 'S', value: 'Sunday', selected: false },
        ];
        this.state = {
            loading: false,
            note: '',
            price: 0,
            modalVisible: false,
            visible: false,
            text: '',
            noteModal: false,
            develop: true,
            on: false,
            wakeUpTime: '04:51 AM',
            wakeUpNote: '',
            days: tempObj,
            requestedWakeUpCall: false,
            items: props.profile.additional_services,
            conceriageServiceTabs: [
                {
                    source: require('../../images/requestItems.png'),
                    onPress: this._handleRequestItems,
                    text: this.props.selectedLanguage.request_items,
                    color: this.props.icon.concierge_color,
                },
                {
                    source: require('../../images/roomCleaning.png'),
                    onPress: this._handleRoomCleaning,
                    text: this.props.selectedLanguage.request_room_cleaning,
                    color: this.props.icon.concierge_color,
                },
                {
                    source: require('../../images/Laundry.png'),
                    onPress: this._handleLaundryService,
                    text: this.props.selectedLanguage.request_laundry_service,
                    color: this.props.icon.concierge_color,
                },
                {
                    source: require('../../images/additional_service.png'),
                    onPress: this._handleAdditionalService,
                    text: this.props.selectedLanguage.request_additional_service,
                    color: this.props.icon.concierge_color,
                },
            ],
        };
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

    async componentDidMount() {
        const tempObj = [
            { name: 'M', value: 'Monday', selected: false },
            { name: 'T', value: 'Tuesday', selected: false },
            { name: 'W', value: 'Wednesday', selected: false },
            { name: 'T', value: 'Thursday', selected: false },
            { name: 'F', value: 'Friday', selected: false },
            { name: 'S', value: 'Saturday', selected: false },
            { name: 'S', value: 'Sunday', selected: false },
        ];
        // if (this.props.wakeUpCall?.is_active == 1) {
        //     LocalNotificationScheduleCahnnel('Wake_up_id')
        //     LocalNotificationSchedule('Wake_up_id');
        // }
        this.props.getConciergeServiceItems(this.props.code);
        const matchingArr = [];
        const data = await tempObj.map((i) => {
            var matched = false;
            this.props.wakeUpCall?.days?.filter((val) => {
                if (val.toLowerCase() == i.value.toLowerCase()) {
                    i.selected = true;
                    matched = true;
                    matchingArr.push(i);
                }
            });
            if (!matched) matchingArr.push(i);
        });
        this.setState({
            days: matchingArr,
            on:
                this.props.wakeUpCall != undefined &&
                this.props.wakeUpCall != null &&
                this.props.wakeUpCall?.is_active == 1
                    ? true
                    : false,
            wakeUpTime:
                this.props.wakeUpCall != undefined &&
                this.props.wakeUpCall != null &&
                this.props.wakeUpCall?.wakeup_call_time
                    ? this.props.wakeUpCall?.wakeup_call_time
                    : '--:--',
        });
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

    _handleRequestItems() {
        Navigation.push(this.props.componentId, requestItems);
    }

    _handleMyOrders() {
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
            Navigation.push(this.props.componentId, conciergeTrackingProgress);
        }
    }

    _WakeUpTime(val = '', nt = '') {
        this.setState({
            wakeUpTime: val,
            wakeUpNote: nt,
        });
    }

    _handleWakeupCall() {
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
        } else if (this._lockWakeUpTIme()) {
            Navigation.push(
                this.props.componentId,
                wakeupCall({
                    _WakeUpTime: this._WakeUpTime,
                }),
            );
        }
    }

    _handleParking() {
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
            Navigation.push(this.props.componentId, parkingValet);
        }
    }

    setModalVisible(params: boolean) {
        this.setState({
            modalVisible: params,
        });
    }

    _handleRoomCleaning() {
        // Alert.alert("hello")
        // if (!this.props.isCheckedIn) {
        //     // Alert.alert('Attention', 'Please check in first, to use this service');
        //     this.setState({
        //         text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
        //         visible: true,
        //     });
        // } else if (this.props.status == 'pending') {
        //     Alert.alert('Attention', 'To use this feature, your check in must be accepted by hotel admin');
        //     this.setState({
        //         text: this.props.selectedLanguage
        //             .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
        //             visible: true,
        //         });
        //     } else {
        Navigation.push(this.props.componentId, RoomCleaningService);
        // this.setModalVisible(true);
        // }
    }

    _handleLaundryService() {
        // if (!this.props.isCheckedIn) {
        //     this.setState({
        //         text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
        //         visible: true,
        //     });
        // } else if (this.props.status == 'pending') {
        //     this.setState({
        //         text: this.props.selectedLanguage
        //             .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
        //         visible: true,
        //     });
        // } else {
        Navigation.push(this.props.componentId, laundryService);
        // }
    }
    onAdditionalServiceBack(additionalItems: any) {
        this.setState({
            items: additionalItems,
        });
        let totalPrice = 0;
        for (let i = 0; i < additionalItems.length; i++) {
            totalPrice = totalPrice + additionalItems[i].price * additionalItems[i].qty;
        }
        this.setState({
            price: totalPrice,
        });
        // Alert.alert(date.toString())
    }

    _handleAdditionalService() {
        // if (!this.props.isCheckedIn) {
        //     this.setState({
        //         text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
        //         visible: true,
        //     });
        // } else if (this.props.status == 'pending') {
        //     this.setState({
        //         text: this.props.selectedLanguage
        //             .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
        //         visible: true,
        //     });
        // } else {
        const prevScreen = this.props.componentId;
        Navigation.push(
            this.props.componentId,
            additionalservices({
                backGround: false,
                onAdditionalServiceBack: this.onAdditionalServiceBack,
                items: this.state.items,
                prevScreen,
            }),
        );
        // }
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _onChangeText(text: string) {
        this.setState({
            note: text,
        });
    }

    _handlePhone() {
        Linking.openURL('tel:{+923405666212}');
    }

    _handleChat() {
        if (this._isLockFeature()) {
            return false;
        }
        Navigation.setRoot({
            root: {
                bottomTabs: {
                    children: [
                        {
                            stack: {
                                id: 'MAIN_MENU_TAB',
                                children: [
                                    {
                                        component: {
                                            id: 'mainmenu',
                                            name: 'MainMenu',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            stack: {
                                id: 'CHAT_TAB',
                                children: [
                                    {
                                        component: {
                                            id: 'chat',
                                            name: 'Chat',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            stack: {
                                id: 'LOST_AND_FOUND_TAB',
                                children: [
                                    {
                                        component: {
                                            id: 'lostAndFound',
                                            name: 'LostAndFound',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            stack: {
                                id: 'PROFILE_TAB',
                                children: [
                                    {
                                        component: {
                                            id: 'profile',
                                            name: 'Profile',
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    options: {
                        bottomTabs: {
                            visible: false,
                            currentTabIndex: 1,
                        },
                    },
                },
            },
        });
    }

    _lockWakeUpTIme() {
        if (this.state.on) {
            toast(this.props.selectedLanguage.please_turn_off_the_alarm_and_do_settings);
            return false;
        }
        return true;
    }

    _handleWakeupDay(day, index) {
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
        } else if (this._lockWakeUpTIme()) {
            const tempArray: any = Object.assign([], this.state.days);
            if (day.selected) {
                day['selected'] = false;
            } else {
                day['selected'] = true;
            }
            tempArray[index] = day;
            this.setState({
                days: tempArray,
            });
        }
    }

    async onAndOffWakeUp(condition) {
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
            this.setState({
                requestedWakeUpCall: true,
            });
            const tempArray = [];
            this.state.days.map((i) => {
                if (i.selected) {
                    tempArray.push(i.value);
                }
            });
            if (
                (condition == 'active' && this.state.wakeUpTime != '-- : --' && tempArray.length > 0) ||
                (condition == 'inactive' && tempArray.length > 0)
            ) {
                this.props.wakeupCall(
                    {
                        days: tempArray,
                        wakeup_call_time: this.state.wakeUpTime,
                        wakeup_call_note: this.state.wakeUpNote,
                        is_active: condition === 'active' ? true : false,
                    },
                    () => {
                        this.setState({
                            loading: false,
                            on: condition == 'active' ? true : false,
                            requestedWakeUpCall: false,
                        });
                        if (condition == 'active') {
                            this._modalPaymentSuccessfullModal.current?.show();
                            localNotificationDays(
                                this.props.departureDate,
                                WAKE_UP_ID,
                                tempArray,
                                this.state.wakeUpTime,
                                this.state.wakeUpNote,
                            );
                        } else {
                            cancelSchduleNotification(WAKE_UP_ID);
                        }
                    },
                    () => {
                        this.setState({
                            loading: false,
                            on: condition == 'active' ? false : true,
                            requestedWakeUpCall: false,
                        });
                    },
                );
            } else {
                toast(this.props.selectedLanguage.please_select_date_and_time_first);
                this.setState({ requestedWakeUpCall: false });
            }
        }
    }
    render() {
        const { color } = this.props;
        const {
            conceirge_service,
            here_you_can_request_various_items_to_be_delivered_straight_to_you_room,
            request_items,
            request_room_cleaning,
            live_chat,
            my_orders,
            parking_and_valet,
        } = this.props.selectedLanguage;
        console.log('propssssss============', this.props);
        return (
            <View style={base.container}>
                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: hp(9), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: this.props.color,
                            borderBottomRightRadius: wp(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && <StatusBar backgroundColor={this.props.color}></StatusBar>}
                <RootContainer>
                    <View>
                        <View
                            style={{
                                position: 'absolute',
                                marginTop: heightPercentageToDP(6),
                                backgroundColor: this.props.color,
                                width: widthPercentageToDP(0.1),
                            }}
                        >
                            <HeaderMask fill={this.props.color} />
                        </View>
                        <View
                            style={{
                                width: widthPercentageToDP(100),
                                alignItems: 'flex-end',
                                borderBottomRightRadius: wp(7),
                                backgroundColor: this.props.color,
                                height: heightPercentageToDP(6),
                                justifyContent: 'flex-end',
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: 'transparent',
                                    justifyContent: 'flex-end',
                                    paddingBottom: hp(2),
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flex: 1,
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={{
                                            paddingVertical: 10,
                                            flex: 0.15,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() => this._handleBack()}
                                    >
                                        <BackArrow
                                            width={widthPercentageToDP(4)}
                                            height={widthPercentageToDP(4)}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            flex: 0.7,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: scale.w(2.2),
                                                color: '#FFFF',
                                                fontFamily: 'Roboto-Bold',
                                            }}
                                        >
                                            {this.props.selectedLanguage.concierge_service}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 0.15,
                                        }}
                                    />
                                    <View />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: heightPercentageToDP(2.5) }}></View>
                    <RoundView
                        source={{ uri: this.props.hotel_logo }}
                        styleImage={{
                            height: heightPercentageToDP(7.5),
                            width: heightPercentageToDP(7.5),
                            borderRadius: heightPercentageToDP(7.5) / 2,
                        }}
                        text={this.props.title ? this.props.title : 'Hotel Name'}
                        text1={
                            this.props.account?.hotel_details?.data?.city
                                ? this.props.account?.hotel_details?.data?.city.length > 15
                                    ? this.props.account?.hotel_details?.data?.city.substring(0, 15) + '...'
                                    : this.props.account?.hotel_details?.data?.city
                                : '' + ' ' + this.props.account?.hotel_details?.data?.country
                                ? this.props.account?.hotel_details?.data?.country.length > 15
                                    ? this.props.account?.hotel_details?.data?.country.substring(0, 15) +
                                      '...'
                                    : this.props.account?.hotel_details?.data?.country
                                : ''
                        }
                        source1={'phone'}
                        onIconTwo={this._handleChat}
                        onIconOne={this._handlePhone}
                        bold={true}
                        source1Color={'#43D4AA'}
                        backgrondColor1={'#E3F9F2'}
                        source2={'message-square'}
                        source2Color={'#4E66F0'}
                        backgrondColor2={'#E4E7FD'}
                    />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.container_menu}>
                            <View style={{ height: heightPercentageToDP(4) }} />
                            <H4
                                // textAlign="center"
                                fontSize={scale.w(2.2)}
                                // marginLeft={5}
                                bold={true}
                                marginHorizontal={widthPercentageToDP(6)}
                                opacity={1}
                                letterSpacing={0.5}
                                fontFamily={'Harabara'}
                                // white={this.props.white}
                            >
                                {this.props.selectedLanguage.wakeup_call}
                            </H4>
                            <View style={{ height: heightPercentageToDP(2) }} />
                            {this.props.feature.is_wakeup_call_enabled && (
                                <View
                                    style={{
                                        backgroundColor: this.props.icon.concierge_color,
                                        paddingVertical: hp(2),
                                        paddingHorizontal: wp(4),
                                        width: wp(90),
                                        alignSelf: 'center',
                                        borderRadius: 15,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity activeOpacity={1} onPress={this._handleWakeupCall}>
                                            <Text
                                                style={{
                                                    fontSize: scale.w(2.4),
                                                    color: colors.WHITE,
                                                    fontFamily: 'Roboto-Bold',
                                                }}
                                            >
                                                {this.state.wakeUpTime}
                                            </Text>
                                        </TouchableOpacity>
                                        {this.state.requestedWakeUpCall ? (
                                            <ActivityIndicator
                                                color={colors.WHITE}
                                                size="small"
                                            ></ActivityIndicator>
                                        ) : (
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    onPress={() => {
                                                        if (!this.state.on) {
                                                            this.onAndOffWakeUp('active');
                                                        }
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.9),
                                                            color: colors.WHITE,
                                                            opacity: this.state.on ? 1 : 0.4,
                                                            fontFamily: 'Roboto-Regular',
                                                        }}
                                                    >
                                                        {this.props.selectedLanguage.on}{' '}
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    onPress={() => {
                                                        if (this.state.on) this.onAndOffWakeUp('inactive');
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.9),
                                                            fontFamily: 'Roboto-Regular',
                                                            color: colors.WHITE,
                                                            opacity: this.state.on ? 0.4 : 1,
                                                        }}
                                                    >
                                                        {' '}
                                                        {this.props.selectedLanguage.off}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: hp(1),
                                        }}
                                    >
                                        {this.state.days.map((day, index) => {
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    onPress={() => this._handleWakeupDay(day, index)}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(2.0),
                                                            color: colors.WHITE,
                                                            paddingVertical: hp(1),
                                                            paddingHorizontal: wp(1.7),
                                                            opacity: day.selected ? 1 : 0.4,
                                                        }}
                                                    >
                                                        {day.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                            <View style={{ height: heightPercentageToDP(4) }} />
                            <H4
                                // textAlign="center"
                                fontSize={scale.w(2.2)}
                                // marginLeft={5}
                                bold={true}
                                marginHorizontal={widthPercentageToDP(6)}
                                opacity={1}
                                letterSpacing={0.45}
                                fontFamily={'Harabara'}
                                // white={this.props.white}
                            >
                                {this.props.selectedLanguage.concierge_service}
                            </H4>
                            <View
                                style={{
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    flexDirection: 'row',
                                    paddingHorizontal: widthPercentageToDP(6),
                                    marginTop: heightPercentageToDP(1),
                                }}
                            >
                                {this.state.conceriageServiceTabs.map((i, index) => {
                                    return (
                                        <View
                                            style={{
                                                marginLeft: index % 2 == 0 ? 0 : widthPercentageToDP(3),
                                                marginTop: widthPercentageToDP(3),
                                            }}
                                        >
                                            <MenuButton
                                                height={hp(18.5)}
                                                width={wp(42)}
                                                home={true}
                                                source={i.source}
                                                text={i.text}
                                                fontSize={scale.w(1.8)}
                                                iconSize={scale.w(8.5)}
                                                onPress={i.onPress}
                                                haveBorderWidth={false}
                                                white
                                                styleImage={{ tintColor: i.color }}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                            <View
                                style={{
                                    height: heightPercentageToDP(6.7),
                                    backgroundColor: 'transparent',
                                }}
                            />
                        </View>
                    </ScrollView>
                </RootContainer>
                <CustomModal
                    style={{ margin: -1 }}
                    ref={this._modalPaymentSuccessfullModal}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDown"
                >
                    <ProcessComplete
                        backgroundColor={this.props.icon.concierge_color}
                        onBackClick={() => console.log("don't go back")}
                        processImage={require('../../images/paymentPageImg.png')}
                        processTitle={this.props.selectedLanguage.request_successfull}
                        processDescription={
                            this.props.selectedLanguage.you_have_requested_successfully_for_Wake_up_call
                        }
                        btnText={this.props.selectedLanguage.go_to_home}
                        loading={this.state.loading}
                        onButtonPress={() => {
                            this._modalPaymentSuccessfullModal.current?.hide();
                        }}
                        chainData={this.props.chainData}
                    />
                </CustomModal>
                <Modal
                    backdropOpacity={0.7}
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => {
                        this.setModalVisible(false);
                    }}
                >
                    <TouchableHighlight
                        onPress={() => {
                            this.setModalVisible(false);
                        }}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingHorizontal: wp(2),
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: scale.w(35.0),
                                height: scale.w(18.0),
                                backgroundColor: '#fff',
                                borderRadius: scale.w(2.0),
                                alignItems: 'center',
                                // justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    marginTop: scale.h(3.0),
                                }}
                            >
                                <H2 fontSize={18}>Do you want to add a note</H2>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: scale.w(4.5),
                                }}
                            >
                                <View
                                    style={{
                                        width: '45%',
                                        paddingHorizontal: scale.w(1.0),
                                    }}
                                >
                                    <ButtonPrimary
                                        backgroundColor={
                                            this.props.color !== '' ? this.props.color : undefined
                                        }
                                        onPress={() => {
                                            this.setModalVisible(false);
                                            this.setState({ loading: true });
                                            this.props.roomCleaningService(
                                                this.state.note,
                                                async () => {
                                                    await Navigation.push(
                                                        this.props.componentId,
                                                        cleaningRequestComplete({ isRoomCleaning: true }),
                                                    );
                                                    this.setState({ loading: false });
                                                },
                                                () => {
                                                    this.setState({ loading: false });
                                                },
                                            );
                                        }}
                                        loading={false}
                                        disabled={false}
                                        fontSize={scale.w(1.65)}
                                        text={'No'}
                                    />
                                </View>
                                <View
                                    style={{
                                        width: '45%',
                                        paddingHorizontal: scale.w(1.0),
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
                                            setTimeout(() => {
                                                this.setState({
                                                    noteModal: true,
                                                });
                                            }, 500);
                                        }}
                                        loading={false}
                                        disabled={false}
                                        fontSize={scale.w(1.65)}
                                        text={'Yes'}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                </Modal>

                <Modal
                    backdropOpacity={0.7}
                    isVisible={this.state.noteModal}
                    onBackdropPress={() => {
                        this.setState({
                            noteModal: false,
                        });
                    }}
                >
                    <TouchableHighlight
                        onPress={() => {
                            this.setState({
                                noteModal: false,
                            });
                        }}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingHorizontal: wp(2),
                            alignItems: 'center',
                        }}
                    >
                        <KeyboardAvoidingView
                            behavior="padding"
                            keyboardVerticalOffset={120}
                            enabled={Platform.OS === 'ios'}
                        >
                            <View style={styles.container}>
                                <View style={styles.titleContainer}>
                                    <H2 fontSize={scale.w(1.6)}>{'Add Note'}</H2>
                                </View>

                                <TextInput
                                    multiline
                                    value={this.state.note}
                                    onChangeText={this._onChangeText}
                                    placeholder="Write anything about this order item..."
                                    style={{
                                        backgroundColor: colors.WHITE,
                                        fontFamily: 'Roboto-Regular',
                                        fontSize: 15,
                                        color: colors.DARK,
                                        height: scale.w(17.0),
                                        textAlignVertical: 'top',
                                        margin: 0,
                                        padding: 0,
                                    }}
                                    autoFocus
                                />

                                <View style={styles.buttonContainer}>
                                    <ButtonPrimary
                                        onPress={() => {
                                            this.props.roomCleaningService(
                                                this.state.note,
                                                async () => {
                                                    await Navigation.push(
                                                        this.props.componentId,
                                                        cleaningRequestComplete({ isRoomCleaning: true }),
                                                    );
                                                    this.setState({ loading: false });
                                                },
                                                () => {
                                                    this.setState({ loading: false });
                                                },
                                            );
                                            this.setState({
                                                noteModal: false,
                                            });
                                        }}
                                        backgroundColor={this.props.color || colors.BROWN}
                                        text="Done"
                                        chainData={this.props.chainData}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableHighlight>
                </Modal>

                <AttentionModal
                    visible={this.state.visible}
                    toggleModal={this.toggleModal}
                    text={this.state.text}
                    attention={this.props.selectedLanguage.attention}
                    ok={this.props.selectedLanguage.ok}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text_container: {
        marginTop: scale.w(1.0),
        marginHorizontal: scale.w(2.8),
        marginBottom: scale.h(1.0),
    },
    image_container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.6,
        marginVertical: scale.w(1.0),
    },
    menu_btn_container: {
        paddingHorizontal: scale.w(5.5),
        // marginBottom: scale.w(30),
        alignItems: 'center',
        // paddingVertical:scale.w(5)
    },
    notif_badge_container: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: colors.RED,
        height: scale.w(3.0),
        width: scale.w(3.0),
        borderRadius: scale.w(3.0 / 2),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale.w(4.5),
    },
    container: {
        backgroundColor: colors.WHITE,
        paddingHorizontal: scale.w(1.6),
        paddingVertical: scale.h(2.4),
        borderRadius: scale.w(3.0),
        width: scale.w(33.0),
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? scale.w(1.2) : scale.w(2.0),
    },
    headerPickerAndroid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: scale.w(1.2),
        marginBottom: scale.w(-1.2),
    },
    datePicker: {
        width: '100%',
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
    },
    buttonContainer: {
        marginTop: Platform.OS === 'ios' ? scale.w(1.2) : 0,
    },
});

export default ConciergeService;
