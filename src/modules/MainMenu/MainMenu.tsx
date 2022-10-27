import React from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ScrollView,
    Platform,
    ImageBackground,
    TouchableOpacity,
    Linking,
    RefreshControl,
    BackHandler,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import Image from 'react-native-image-progress';
import { IMainMenuReduxProps } from './MainMenu.Container';
import base from '../../utils/baseStyles';
import NetInfo, { fetch } from '@react-native-community/netinfo';
import { getBaseUrl } from '../../constants/tempFile';
import axios from 'axios';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import { H1, H2, H4 } from '../_global/Text';
import { RootContainer } from '../_global/Container';
import { ButtonPrimary } from '../_global/Button';
import MenuButton from '../_global/MenuButton';
import RoundView from '../_global/roundView';
import { View as ViewAnimatable, Text } from 'react-native-animatable';
import { Navigation } from 'react-native-navigation';
// import firebase from 'react-native-firebase';
import AttentionModal from '../_global/AttentionModal';
import CustomModal from '../_global/CustomModal';
import DropShadow from 'react-native-drop-shadow';
import ImageZoomModal from '../_global/ImageZoomModal';
import moment from 'moment';
import {
    checkin,
    checkout,
    chat,
    restaurantList,
    conciergeService,
    spaService,
    //cleaningService,
    experienceService,
    trackingProgress,
    parkingValet,
    spaTrackingProgress,
    LostAndFound,
    pickHotel,
    Profile,
    latecheckout,
    transactionHistory,
    conciergeTrackingProgress,
    CardDetails,
    ProfileData,
} from '../../utils/navigationControl';
import { IFeatureHotel } from '../../types/hotel';
import { HotelData } from '../../types/hotelData';
import colors from '../../constants/colors';
import CheckButton from '../_global/CheckInandCheckOut';
import { isIPhoneXrSize } from '../../utils/isIPhoneX';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SnapCarousel from '../_global/Carousel';
import BottomBar from '../_global/BottomBar';
import ProfileNavButton from '../_global/profileNavButton';
import { Payment } from '../../utils/navigationControl';
import HeaderMask from '../../images/headerMask.svg';
import DIcon from 'react-native-vector-icons/MaterialIcons';
import { createChannel, localNotificationDays, toast, WAKE_UP_ID } from '../../utils/handleLogic';
// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance } from '@notifee/react-native';

export interface IMainMenuProps extends IMainMenuReduxProps {
    componentId: string;
    from?: 'restaurant' | 'concierge_service' | 'main_menu';
    color: any;
    goBackToHome: any;
    departureDate: any;
    wakeUpCall: any;
}

interface IMainMenuState {
    visible: boolean;
    text: string;
    images: Array;
    quickCheckOut: boolean;
    lateCheckOut: boolean;
    parkingDetails: Array;
    refreshing: boolean;
    menuTabs: Array;
    modalVisible: boolean;
    disabledServices: Array;
    hotelImage: string;
    chainData: {
        data: {
            name: string;
            logo: string;
            splash_screen: string;
            logo_gif_dark: string;
            logo_gif_light: string;
            signup_bg: string;
            signin_bg: string;
            login_color: string;
            private_policy: string;
            terms_n_conditions: string;
            about_us: string;
            contact_us: string;
            google_play_store: string;
            app_store: string;
        };
    };
}

class MainMenu extends React.Component<IMainMenuProps, IMainMenuState> {
    private _modalConfirm = React.createRef<CustomModal>();
    constructor(props: IMainMenuProps) {
        super(props);
        Navigation.events().bindComponent(this);
        this._isLockFeature = this._isLockFeature.bind(this);
        this._handleCheckIn = this._handleCheckIn.bind(this);
        this._handleCheckOut = this._handleCheckOut.bind(this);
        this._handleRestaurant = this._handleRestaurant.bind(this);
        this._handleSpa = this._handleSpa.bind(this);
        this._handleLostAndFound = this._handleLostAndFound.bind(this);
        this._handleExperience = this._handleExperience.bind(this);
        this._handleConciergeService = this._handleConciergeService.bind(this);
        // this._handleCleaningService = this._handleCleaningService.bind(this);
        this._handleChat = this._handleChat.bind(this);
        this._handleParking = this._handleParking.bind(this);
        this._handleAccount = this._handleAccount.bind(this);
        this._handleQuickCheckout = this._handleQuickCheckout.bind(this);
        this._handleRequest = this._handleRequest.bind(this);
        this._handlePhone = this._handlePhone.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._handlehardwareBackPress = this._handlehardwareBackPress.bind(this);

        this.state = {
            modalVisible: false,
            visible: false,
            text: 'string',
            images: this.props.promotionalImages,
            quickCheckOut: false,
            lateCheckOut: false,
            parkingDetails: this.props.parkingDetails,
            refreshing: false,
            disabledServices: [],
            hotelImage: '',
            menuTabs: [
                {
                    isEnabled: this.props.feature.is_restaurant_enabled,
                    source: require('../../images/icon_restaurant.png'),
                    onPress: this._handleRestaurant,
                    text: this.props.selectedLanguage.restaurant,
                    color: this.props.icon.restaurant_color,
                },
                {
                    isEnabled: this.props.feature.is_spa_enabled,
                    source: require('../../images/icon_spa.png'),
                    onPress: this._handleSpa,
                    text: this.props.selectedLanguage.spa,
                    color: this.props.icon.spa_color,
                },
                {
                    isEnabled: this.props.feature.is_concierge_enabled,
                    source: require('../../images/icon_concierge_home_page.png'),
                    onPress: this._handleConciergeService,
                    text: this.props.selectedLanguage.conceirge_service,
                    color: this.props.icon.concierge_color,
                },
                {
                    isEnabled: this.props.feature.is_experience,
                    source: require('../../images/icon_star.png'),
                    onPress: this._handleExperience,
                    text: this.props.selectedLanguage.experience,
                    color: this.props.icon.spa_color, //shazim told me that spa and experience color is same,we also verified from previous app
                },
            ],

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
                    google_play_store: '',
                    app_store: '',
                    login_color: '',
                },
            },
        };

        this.props.goBackToHome(
            true,
            () => console.log('true called'),
            () => console.log('failed'),
        );
    }

    // static getDerivedStateFromProps(props: IMainMenuProps, state: IMainMenuState) {
    //     console.log('pro', props, state);
    //     if (props.menuTabs !== state.menuTabs) {
    //         //Change in props
    //         return {
    //             // menuTabs: props.menuTabs,
    //         };
    //     }
    //     return null; // No change to state
    // }

    _onRefresh() {
        console.log(this.props.promotionalImages);
        this.setState({ refreshing: true });
        this.props.getProfile(
            this.props.token,
            this.props.hotel.code,
            () => {
                if (this.props.status === 'accepted') {
                    this.props.getwakeupCall(
                        () => {
                            console.log('Success api is called of the wake up');
                        },
                        () => {
                            console.log('failed api is called of the wake up');
                        },
                    );
                } else {
                    console.log('check in first to get wake up call details');
                }
                let tempArray = [];
                this.setState({
                    menuTabs: [
                        {
                            isEnabled: this.props.feature.is_restaurant_enabled,
                            source: require('../../images/icon_restaurant.png'),
                            onPress: this._handleRestaurant,
                            text: this.props.selectedLanguage.restaurant,
                            color: this.props.icon.restaurant_color,
                        },
                        {
                            isEnabled: this.props.feature.is_spa_enabled,
                            source: require('../../images/icon_spa.png'),
                            onPress: this._handleSpa,
                            text: this.props.selectedLanguage.spa,
                            color: this.props.icon.spa_color,
                        },
                        {
                            isEnabled: this.props.feature.is_concierge_enabled,
                            source: require('../../images/icon_concierge_home_page.png'),
                            onPress: this._handleConciergeService,
                            text: this.props.selectedLanguage.conceirge_service,
                            color: this.props.icon.concierge_color,
                        },
                        {
                            isEnabled: this.props.feature.is_experience,
                            source: require('../../images/icon_star.png'),
                            onPress: this._handleExperience,
                            text: this.props.selectedLanguage.experience,
                            color: this.props.icon.spa_color, //shazim told me that spa and experience color is same,we also verified from previous app
                        },
                    ],
                    refreshing: false,
                });
                this.state.menuTabs.map((item, index) => {
                    if (item.isEnabled == false) {
                        tempArray.push(item);
                    }
                });
                this.setState({
                    disabledServices: tempArray,
                });
            },
            () => {
                this.setState({ refreshing: false });
            },
        );
    }
    _handlehardwareBackPress() {
        this.props.goBackToHome(
            true,
            () => console.log('true called'),
            () => console.log('failed'),
        );
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 0,
            },
        });
        return true;
    }
    async componentDidMount() {
        console.log('Saqlain', this.props.parkingDetails);
        this.props.getChainData();
        this.props.goBackToHome(
            true,
            () => console.log('true called'),
            () => console.log('true'),
        );

        this.setState({
            chainData: this.props?.chainData,
        });

        this.setState({
            hotelImage: this.props.hotel_logo,
        });

        this.setState({
            chainData: this.props?.chainData,
        });

        NetInfo.fetch().then(async (state) => {
            if (state.isConnected == true) {
                console.log('baseUrl', getBaseUrl());
                const hotelData = await axios.get(`${getBaseUrl()}auth/me/${this.props.code}/`, {
                    headers: {
                        Authorization: `Bearer ${this.props.token}`,
                    },
                });
                console.log('HotelData', hotelData);
                console.log('HotelImage', hotelData.data.data.hotel_detail.data.hotel_logo_md);
                this.setState({
                    hotelImage: hotelData.data.data.hotel_detail.data.hotel_logo_md,
                });
            }
        });
        // this.backHandler = BackHandler.addEventListener(
        //     "hardwareBackPress",
        //     function() {
        //         Alert.alert(
        //           'Are you sure',
        //           'You want to close the application?', [{
        //               text: 'Cancel',
        //               onPress: () => console.log('Cancel Pressed'),
        //               style: 'cancel'
        //           }, {
        //               text: 'OK',
        //               onPress: () => BackHandler.exitApp()
        //           }, ], {
        //               cancelable: false
        //           }
        //        )
        //        return true;
        //     }
        //     );

        // Link: https://notifee.app/react-native/reference/displaynotification

        // messaging().setBackgroundMessageHandler(async remoteMessage => {
        //     console.log('hi')

        //     notifee.displayNotification({
        //         id: 'asda',
        //         title: 'Background Handler',
        //         subtitle: `Number of unread messages: 2`,
        //         body: 'asdads',
        //         // Link: https://notifee.app/react-native/reference/notificationandroid
        //         android: {
        //             channelId,
        //             importance: AndroidImportance.DEFAULT,
        //         },
        //         // Link: https://notifee.app/react-native/reference/notificationios
        //         ios: {
        //             foregroundPresentationOptions: {
        //                 alert: true,
        //                 badge: true,
        //                 sound: true,
        //             },
        //         },
        //     });
        //   });
        // messaging().onNotificationOpenedApp(remoteMessage => {
        //     console.log('hi')

        //     notifee.displayNotification({
        //         id: 'asda',
        //         title: 'Notification Openened Hnadler',
        //         subtitle: `Number of unread messages: 2`,
        //         body: 'asdads',
        //         // Link: https://notifee.app/react-native/reference/notificationandroid
        //         android: {
        //             channelId,
        //             importance: AndroidImportance.DEFAULT,
        //         },
        //         // Link: https://notifee.app/react-native/reference/notificationios
        //         ios: {
        //             foregroundPresentationOptions: {
        //                 alert: true,
        //                 badge: true,
        //                 sound: true,
        //             },
        //         },
        //     });
        //   });

        // Check whether an initial notification is available
        //   messaging()
        //     .getInitialNotification()
        //     .then(remoteMessage => {
        //         console.log('hi')
        //       if (remoteMessage) {
        //         notifee.displayNotification({
        //             id: '123',
        //             title: 'New message has arrived!',
        //             subtitle: `Number of unread messages: 2`,
        //             body: 'asdas',
        //             // Link: https://notifee.app/react-native/reference/notificationandroid
        //             android: {
        //                 channelId,
        //                 importance: AndroidImportance.DEFAULT,
        //             },
        //             // Link: https://notifee.app/react-native/reference/notificationios
        //             ios: {
        //                 foregroundPresentationOptions: {
        //                     alert: true,
        //                     badge: true,
        //                     sound: true,
        //                 },
        //             },
        //         });
        //       }
        //     });
        // firebase.notifications().onNotification((notification) => {
        //     console.log(
        //         '==========================================================================================================================',
        //         notification,
        //     );
        //     if (Platform.OS === 'android') {
        //         const localNotification = new firebase.notifications.Notification().android
        //             .setChannelId('servr')
        //             .android.setSmallIcon('ic_launcher_round')
        //             .android.setPriority(firebase.notifications.Android.Priority.High)
        //             .setSound(firebase.notifications.Android.Defaults.Sound.toString())
        //             .setNotificationId(notification.notificationId)
        //             .setTitle('New message')
        //             .setSubtitle(
        //                 `Unread message: ${JSON.parse(notification.data.sendbird).unread_message_count}`,
        //             )
        //             .setBody(notification.data.message)
        //             .setData(JSON.parse(notification.data.sendbird));

        //         firebase
        //             .notifications()
        //             .displayNotification(localNotification)
        //             .catch((err) => console.error(err));
        //     } else if (Platform.OS === 'ios') {
        //         const localNotification = new firebase.notifications.Notification()
        //             .setNotificationId(notification.messageId)
        //             .setTitle('New message')
        //             .setSubtitle(
        //                 `Unread message: ${JSON.parse(notification.data.sendbird).unread_message_count}`,
        //             )
        //             .setBody(notification.data.message)
        //             .setData(JSON.parse(notification.data.sendbird))
        //             .ios.setBadge(notification.ios.badge);

        //         firebase
        //             .notifications()
        //             .displayNotification(localNotification)
        //             .catch((err) => console.error(err));
        //     }
        // });
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // firebase
        //     .notifications()
        //     .getInitialNotification()
        //     .then((notificationOpen) => {
        //         if (notificationOpen) {
        //             console.log(notificationOpen);

        //             console.log('1---OPEND');
        //             firebase.notifications().removeAllDeliveredNotifications();
        //             console.log('1---OPEND-After');
        //         }
        //     });
        // firebase.notifications().onNotificationOpened((notificationOpen) => {
        //     console.log('notification', notificationOpen);
        //     if (notificationOpen && notificationOpen.notification.data.message) {
        //         console.log('1234 == ', notificationOpen);
        //         if (
        //             notificationOpen.notification.data.message.includes('Check In request has been accepted')
        //         ) {
        //             Navigation.push(this.props.componentId, checkin({ backGround: true }));
        //         }
        //         //laundry order
        //         else if (
        //             notificationOpen.notification.data.message.includes('Your laundry order is Confirmed')
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.message.includes('Your laundry order is Completed')
        //         ) {
        //             // Navigation.setRoot({ root: mainmenu });

        //             // Navigation.push('conciergeService',conciergeService);
        //             console.log('Laundry order is completed ---> ', notificationOpen.notification.data.text);
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.message.includes('Your laundry order is Rejected')
        //         ) {
        //             Navigation.push(
        //                 notificationOpen.notification.data.message,
        //                 conciergeService({ backGround: true }),
        //             );
        //         }
        //         // else if(notificationOpen.notification.data.text.includes('Laundry service has been requested')){
        //         //     Navigation.push(this.props.componentId, conciergeService);
        //         // }
        //         //room cleaning
        //         else if (
        //             notificationOpen.notification.data.message.includes(
        //                 'Your room cleaning order is Confirmed',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.message.includes('Your room cleaning order is Done')
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.message.includes(
        //                 'Your room cleaning order is Rejected',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.message.includes(
        //                 'Your room cleaning order is Completed',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         }
        //         //conciergeService
        //         else if (
        //             notificationOpen.notification.data.message.includes(
        //                 'Your Concierge Service Request is confirmed',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.message.includes(
        //                 'Your Concierge Service Request is Done',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.message.includes(
        //                 'Your Concierge Service Request is Rejected',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         }
        //         //restaurantList
        //         else if (
        //             notificationOpen.notification.data.message.includes('Your restaurant order is Confirmed')
        //         ) {
        //             // Navigation.push(this.props.componentId, restaurantList({backGround:true}));
        //             Navigation.push(this.props.componentId, trackingProgress);
        //         } else if (
        //             notificationOpen.notification.data.message.includes('Your restaurant order is Preparing')
        //         ) {
        //             // Navigation.push(this.props.componentId, restaurantList({backGround:true}));
        //             Navigation.push(this.props.componentId, trackingProgress);
        //         } else if (
        //             notificationOpen.notification.data.message.includes('Your restaurant order is On The Way')
        //         ) {
        //             // Navigation.push(this.props.componentId, restaurantList({backGround:true}));
        //             Navigation.push(this.props.componentId, trackingProgress);
        //         } else if (
        //             notificationOpen.notification.data.message.includes('Your restaurant order is Done')
        //         ) {
        //             // Navigation.push(this.props.componentId, restaurantList({backGround:true}));
        //             Navigation.push(this.props.componentId, trackingProgress);
        //         } else if (
        //             notificationOpen.notification.data.message.includes('Your restaurant order is Rejected')
        //         ) {
        //             // Navigation.push(this.props.componentId, restaurantList({backGround:true}));
        //             Navigation.push(this.props.componentId, trackingProgress);
        //         }
        //         //Restaurant Book Table
        //         else if (
        //             notificationOpen.notification.data.message.includes(
        //                 'Your restaurant reservation has been accepted',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, restaurantList({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.message.includes(
        //                 'Unfortunatly your restaurant reservation has been declined, please try to book again or contact your hotel',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, restaurantList({ backGround: true }));
        //         }
        //         //Spa Booking
        //         else if (
        //             notificationOpen.notification.data.message.includes(
        //                 'Your spa reservation has been accepted',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, spaService({ backGround: true }));
        //             // Navigation.push(this.props.componentId, spaTrackingProgress);
        //         } else if (
        //             notificationOpen.notification.data.message.includes(
        //                 'Restaurant room order has been requested',
        //             ) ||
        //             notificationOpen.notification.data.message.includes(
        //                 'Spa room service has been requested',
        //             ) ||
        //             notificationOpen.notification.data.message.includes(
        //                 'Spa reservation has been requested',
        //             ) ||
        //             notificationOpen.notification.data.message.includes(
        //                 'Room cleaning service has been requested',
        //             ) ||
        //             notificationOpen.notification.data.message.includes(
        //                 'A Concierge Service has been requested',
        //             )
        //         ) {
        //         } else {
        //             // this._handleChat;
        //             Navigation.push(this.props.componentId, chat());
        //         }
        //     } else if (notificationOpen && notificationOpen.notification.data.text) {
        //         console.log('1234 == ', notificationOpen);

        //         if (notificationOpen.notification.data.text.includes('Check In request has been accepted')) {
        //             Navigation.push(this.props.componentId, checkin({ backGround: true }));
        //         }
        //         //laundry order
        //         else if (
        //             notificationOpen.notification.data.text.includes('Your laundry order is Confirmed')
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.text.includes('Your laundry order is Completed')
        //         ) {
        //             // Navigation.setRoot({ root: mainmenu });

        //             // Navigation.push('conciergeService',conciergeService);
        //             console.log('Laundry order is completed ---> ', notificationOpen.notification.data.text);
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.text.includes('Your laundry order is Rejected')
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         }
        //         // else if(notificationOpen.notification.data.text.includes('Laundry service has been requested')){
        //         //     Navigation.push(this.props.componentId, conciergeService);
        //         // }
        //         //room cleaning
        //         else if (
        //             notificationOpen.notification.data.text.includes('Your room cleaning order is Confirmed')
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.text.includes('Your room cleaning order is Done')
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.text.includes('Your room cleaning order is Rejected')
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.text.includes('Your room cleaning order is Completed')
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         }
        //         //conciergeService
        //         else if (
        //             notificationOpen.notification.data.text.includes(
        //                 'Your Concierge Service Request is confirmed',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.text.includes('Your Concierge Service Request is Done')
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.text.includes(
        //                 'Your Concierge Service Request is Rejected',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, conciergeService({ backGround: true }));
        //         }
        //         //restaurantList
        //         else if (
        //             notificationOpen.notification.data.text.includes('Your restaurant order is Confirmed')
        //         ) {
        //             // Navigation.push(this.props.componentId, restaurantList({backGround:true}));
        //             Navigation.push(this.props.componentId, trackingProgress);
        //         } else if (
        //             notificationOpen.notification.data.text.includes('Your restaurant order is Preparing')
        //         ) {
        //             // Navigation.push(this.props.componentId, restaurantList({backGround:true}));
        //             Navigation.push(this.props.componentId, trackingProgress);
        //         } else if (
        //             notificationOpen.notification.data.text.includes('Your restaurant order is On The Way')
        //         ) {
        //             // Navigation.push(this.props.componentId, restaurantList({backGround:true}));
        //             Navigation.push(this.props.componentId, trackingProgress);
        //         } else if (
        //             notificationOpen.notification.data.text.includes('Your restaurant order is Done')
        //         ) {
        //             // Navigation.push(this.props.componentId, restaurantList({backGround:true}));
        //             Navigation.push(this.props.componentId, trackingProgress);
        //         } else if (
        //             notificationOpen.notification.data.text.includes('Your restaurant order is Rejected')
        //         ) {
        //             // Navigation.push(this.props.componentId, restaurantList({backGround:true}));
        //             Navigation.push(this.props.componentId, trackingProgress);
        //         }
        //         //Restaurant Book Table
        //         else if (
        //             notificationOpen.notification.data.text.includes(
        //                 'Your restaurant reservation has been accepted',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, restaurantList({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.text.includes(
        //                 'Unfortunatly your restaurant reservation has been declined, please try to book again or contact your hotel',
        //             )
        //         ) {
        //             Navigation.push(this.props.componentId, restaurantList({ backGround: true }));
        //         }
        //         //Spa Booking
        //         else if (
        //             notificationOpen.notification.data.text.includes('Your spa reservation has been accepted')
        //         ) {
        //             Navigation.push(this.props.componentId, spaService({ backGround: true }));
        //         } else if (
        //             notificationOpen.notification.data.text.includes(
        //                 'Restaurant room order has been requested',
        //             ) ||
        //             notificationOpen.notification.data.text.includes('Spa room service has been requested') ||
        //             notificationOpen.notification.data.text.includes('Spa reservation has been requested') ||
        //             notificationOpen.notification.data.text.includes(
        //                 'Room cleaning service has been requested',
        //             ) ||
        //             notificationOpen.notification.data.text.includes('A Concierge Service has been requested')
        //         ) {
        //         } else {
        //             // this._handleChat;
        //             Navigation.push(this.props.componentId, chat());
        //         }
        //     }

        //     console.log('OPEND');
        //     firebase.notifications().removeAllDeliveredNotifications();
        //     console.log('OPEND-After');
        // });
        console.log('hellooooooooooooooo');
        let tempArray = [];
        this.state.menuTabs.map((item, index) => {
            if (item.isEnabled == false) {
                tempArray.push(item);
            }
        });
        this.setState({
            disabledServices: tempArray,
        });
        ////////////////////////////////////////////////////////////////////////////////////////
        // connect sendbird if user already checked in
        let execOnce = false;
        this.props.connectSendBird();

        this.props.getTotalUnreadMessage();
        this.props.onMessageReceived(() => {
            if (!execOnce) {
                this.props.getProfile(
                    this.props.token,
                    this.props.hotel.code,
                    () => {
                        if (this.props.profile?.reference) createChannel(this.props.profile?.reference);
                        if (this.props.status === 'accepted') {
                            this.props.getwakeupCall(
                                () => {
                                    console.log('Success api is called of the wake up');
                                },
                                () => {
                                    console.log('failed api is called of the wake up');
                                },
                            );
                        } else {
                            console.log('check in first to get wake up call details');
                        }
                        this.setState({ refreshing: false });
                    },
                    () => {
                        this.setState({ refreshing: false });
                    },
                );
                execOnce = true;
            }
        });
        this.props.onTokenNotifRefresh();
        this.props.handleAppStateChange();
        this.props.getAddionalServices(
            this.props.token,
            () => console.log('Success'),
            () => console.log('Failed'),
        );
        this.props.getCardDetails();
    }

    componentDidAppear() {
        this.props.getCardDetails();
        console.log('hello props', this.props.icon.restaurant_color);
        console.log('propssssssss   ', this.props);
        this.props.getAddionalServices(
            this.props.token,
            () => console.log('Success'),
            () => console.log('Failed'),
        );
        this.props.getProfile(
            this.props.token,
            this.props.hotel.code,
            () => {
                if (this.props.status === 'pending') this.props.connectSendBird();
                if (this.props.status === 'accepted') {
                    this.props.getwakeupCall(
                        () => {
                            console.log('Success api is called of the wake up');
                        },
                        () => {
                            console.log('failed api is called of the wake up');
                        },
                    );
                } else {
                    console.log('check in first to get wake up call details');
                }
                this.setState({ refreshing: false });
            },
            () => {
                this.setState({ refreshing: false });
            },
        );
    }

    UNSAFE_componentWillReceiveProps(nextProps: IMainMenuProps) {
        // if user just checked in, then connect sendbird
        if (this.props.isCheckedIn !== nextProps.isCheckedIn && nextProps.isCheckedIn) {
            // for checked in, listen all incoming data
            let execOnce = false;
            this.props.getTotalUnreadMessage();
            this.props.onMessageReceived(() => {
                if (!execOnce) {
                    this.props.getProfile(
                        this.props.token,
                        this.props.hotel.code,
                        () => {
                            if (this.props.status === 'accepted') {
                                this.props.getwakeupCall(
                                    () => {
                                        if (
                                            this.props.wakeUpCall != null &&
                                            this.props.wakeUpCall != undefined &&
                                            this.props.wakeUpCall?.length > 0 &&
                                            this.props.wakeUpCall?.days?.length > 0
                                        ) {
                                            localNotificationDays(
                                                this.props.departureDate,
                                                WAKE_UP_ID,
                                                this.props.wakeUpCall?.days,
                                                this.props.wakeUpCall?.wakeup_call_time,
                                            );
                                        }
                                        console.log('Success api is called of the wake up');
                                    },
                                    () => {
                                        console.log('failed api is called of the wake up');
                                    },
                                );
                            } else {
                                console.log('check in first to get wake up call details');
                            }
                            this.setState({ refreshing: false });
                        },
                        () => {
                            this.setState({ refreshing: false });
                        },
                    );
                    execOnce = true;
                }
            });
            this.props.onTokenNotifRefresh();
            this.props.handleAppStateChange();
        }
    }

    // componentWillUnmount() {
    //     // if (this.props.isCheckedIn) {
    //     //     this.props.removeOnTokenNotifRefresh();
    //     //     this.props.removeOnMessageReceived();
    //     //     this.props.removeAppStateChange();
    //     //     this.props.disconnectSendBird();
    //     // }
    //     BackHandler.removeEventListener("hardwareBackPress", this._handlehardwareBackPress)
    // }

    _isLockFeature(feature?: keyof IFeatureHotel) {
        console.log('is checked innnnnn          ', this.props.isCheckedIn);
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

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _handleCheckIn() {
        if (this._isLockFeature('is_check_in_enabled')) {
            return false;
        }
        Navigation.push('MAIN_MENU_TAB', checkin({ backGround: false }));
        // if (
        //     this.props.account?.cardDetails?.card_number_full == undefined ||
        //     this.props.account?.cardDetails?.card_number_full == null ||
        //     this.props.account?.cardDetails?.card_number_full == ''
        // ) {
        //     Alert.alert('Attention!', 'Please complete your payment details to check in', [
        //         {
        //             text: 'Cancel',
        //             onPress: () => console.log('Cancel Pressed'),
        //             style: 'cancel',
        //         },
        //         {
        //             text: 'OK',
        //             onPress: () => Navigation.push('MAIN_MENU_TAB', CardDetails({ backGround: false })),
        //         },
        //     ]);
        // } else if (
        //     this.props.account?.profile?.phone_number == '' ||
        //     this.props.account?.profile?.phone_number == undefined ||
        //     this.props.account?.profile?.phone_number == null
        // ) {
        //     Alert.alert('Attention!', 'Please complete your profile to check in', [
        //         {
        //             text: 'Cancel',
        //             onPress: () => console.log('Cancel Pressed'),
        //             style: 'cancel',
        //         },
        //         {
        //             text: 'OK',
        //             onPress: () => Navigation.push('MAIN_MENU_TAB', ProfileData({ backGround: false })),
        //         },
        //     ]);
        // } else {
        //     Navigation.push('MAIN_MENU_TAB', checkin({ backGround: false }));
        // }
    }

    _handleLostAndFound() {
        this.props.goBackToHome(
            false,
            () => console.log('false called'),
            () => console.log('false failed'),
        );
        BackHandler.addEventListener('hardwareBackPress', this._handlehardwareBackPress);
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 2,
            },
        });
    }

    _handleAccount() {
        this.props.goBackToHome(
            false,
            () => console.log('false called'),
            () => console.log('false failed'),
        );
        BackHandler.addEventListener('hardwareBackPress', this._handlehardwareBackPress);
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 3,
            },
        });
    }

    _handleCheckOut() {
        this.props.getTransactionHistory();
        if (this._isLockFeature('is_check_out_enabled')) {
            return false;
        }
        this._modalConfirm.current?.show();
        // Navigation.push(this.props.componentId, checkout);
    }

    _handleQuickCheckout() {
        this.setState({
            quickCheckOut: true,
            lateCheckOut: false,
        });
        this.props.bills(
            (response: any) => {
                this.setState({ loading: false, request: true });
                console.log(response);
                if (response?.dishes?.length == 0 && response?.spas?.length == 0) {
                    response['vat'] = 0;
                    response['service_charges'] = 0;
                }
                this._modalConfirm.current?.hide();
                Navigation.push(
                    this.props.componentId,
                    // Payment({
                    //     backGround: false,
                    //     color: this.props.color2,
                    //     selectedLanguage: this.props.selectedLanguage,
                    //     getTransactionHistory: () => {},
                    //     data: this.props.quickCheckOut,
                    //     response: response,
                    //     profile: this.props.profile,
                    //     typeData: this.props.type,
                    // }),
                    transactionHistory({
                        response: response,
                    }),
                );
                this.setState({
                    quickCheckOut: false,
                    lateCheckOut: false,
                });
            },
            () => {
                this.setState({ loading: false });
            },
        );
    }

    _handleRequest() {
        // if(!this.state.request){
        this.setState({ quickCheckOut: false, lateCheckOut: true });
        this.props.lateCheckOut(
            () => {
                this._modalConfirm.current?.hide();
                this.setState({ quickCheckOut: false, lateCheckOut: false });
                // Navigation.pop(this.props.componentId);
            },
            () => {
                this.setState({ quickCheckOut: false, lateCheckOut: false });
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

    _handleRestaurant() {
        Navigation.push('MAIN_MENU_TAB', restaurantList({ backGround: false }));
        // if (this._isLockFeature('is_restaurant_enabled')) {
        //     return false;
        // }
        // if (this.props.isCheckedIn && this.props.status != 'pending') {
        //     Navigation.push(this.props.componentId, restaurantList({ backGround: false }));
        // } else {
        //     if (this.props.feature.is_guest_enabled) {
        //     } else if (!this.props.isCheckedIn) {
        //         this.setState({
        //             text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
        //             visible: true,
        //         });
        //     } else {
        //         this.setState({
        //             text: this.props.selectedLanguage
        //                 .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
        //             visible: true,
        //         });
        //     }
        // }
    }

    _handleSpa() {
        // if (this._isLockFeature('is_spa_enabled')) {
        //     return false;
        // }
        if (this.props.isCheckedIn && this.props.status != 'pending') {
            Navigation.push('MAIN_MENU_TAB', spaService({ backGround: false }));
        } else {
            if (this.props.feature.is_guest_enabled) {
                Navigation.push(this.props.componentId, spaService({ backGround: false }));
            } else if (!this.props.isCheckedIn) {
                this.setState({
                    text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
                    visible: true,
                });
            } else {
                this.setState({
                    text: this.props.selectedLanguage
                        .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
                    visible: true,
                });
            }
        }
    }
    ///////////////////////////////////////////////////////////////////////////
    _handleExperience() {
        Navigation.push('MAIN_MENU_TAB', experienceService);
    }

    _handleConciergeService() {
        // if (this._isLockFeature('is_concierge_enabled')) {
        //     return false;
        // }

        if (this.props.isCheckedIn && this.props.status != 'pending') {
            Navigation.push('MAIN_MENU_TAB', conciergeService({ backGround: false }));
        } else {
            if (this.props.feature.is_guest_enabled) {
                Navigation.push(this.props.componentId, conciergeService({ backGround: false }));
            } else if (!this.props.isCheckedIn) {
                this.setState({
                    text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
                    visible: true,
                });
            } else {
                this.setState({
                    text: this.props.selectedLanguage
                        .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
                    visible: true,
                });
            }
        }
    }

    // _handleCleaningService() {
    //     if (this._isLockFeature('is_cleaning_enabled')) {
    //         return false;
    //     }

    //     Navigation.push(this.props.componentId, cleaningService);
    // }

    _handlePhone(number: any) {
        if (number || number !== '') {
            Linking.openURL(`tel:${{ number }}`);
        } else {
            Linking.openURL(`tel:{+1}`);
        }
    }

    _handleChat() {
        if (this._isLockFeature()) {
            return false;
        }
        this.props.goBackToHome(
            false,
            () => console.log('fasle called'),
            () => console.log('false failed'),
        );
        BackHandler.addEventListener('hardwareBackPress', this._handlehardwareBackPress);
        this.props.toggleIsInChatScreen(true);
        this.props.updateTotalUnreadMessageSuccess(0);
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 1,
            },
        });
    }

    _handleParking(added, item) {
        if (this._isLockFeature('is_parking_enabled')) {
            return false;
        }
        this.props.goBackToHome(
            false,
            () => console.log('fasle called'),
            () => console.log('false failed'),
        );
        Navigation.push(this.props.componentId, parkingValet({ added: added, item: item }));
    }

    _renderItem({ item, index }) {
        return <Image key={index} source={{ uri: item.path }} resizeMode="contain"></Image>;
    }

    render() {
        const {
            icon,
            color,
            title,
            countUnreadMessage,
            mobile_hotel_layout_id,
            mobile_hotel_layouts,
            hotel_logo,
        } = this.props;
        const {
            check_in,
            check_out,
            restaurant,
            spa,
            conceirge_service,
            experience,
            live_chat,
            parking_and_valet,
            attention,
            please_check_in_first_to_use_this_service,
            to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
            ok,
            lostAndFound,
        } = this.props.selectedLanguage;
        console.log('in mainmenuu renderrrrr countUnreadMessage======', this.props);
        // if (mobile_hotel_layout_id != 0 && mobile_hotel_layouts.layout_name != 'default') {
        //     return (
        //         <View style={[base.container, { backgroundColor: '#FDFDFD' }]}>
        //             <RootContainer>
        //                 <View style={styles.container}>
        //                     <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        //                         <ViewAnimatable
        //                             useNativeDriver
        //                             animation="fadeIn"
        //                             duration={400}
        //                             style={{
        //                                 paddingHorizontal: scale.w(10),
        //                                 // height:wp(30),
        //                                 //     width:wp(100)
        //                             }}
        //                         >
        //                             {/* <Image source = {{uri:hotel_logo}} resizeMode={'contain'} style={{height:hp(20),width :wp(20)}} /> */}
        //                             <H1
        //                                 fontSize={scale.w(36)}
        //                                 textAlign="center"
        //                                 color={color.primary_color || colors.BLUE}
        //                             >
        //                                 {title !== '' ? title : 'Hotel Name'}
        //                             </H1>
        //                         </ViewAnimatable>
        //                     </View>
        //                     <ScrollView showsVerticalScrollIndicator={false}>
        //                         <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        //                             {this.props.feature.is_check_in_enabled && (
        //                                 <MenuButton
        //                                     height={wp(30)}
        //                                     width={wp(100)}
        //                                     source={require('../../images/icon_check_in.png')}
        //                                     text={check_in}
        //                                     onPress={this._handleCheckIn}
        //                                     iconSize={wp(13)}
        //                                     styleImage={{ marginRight: scale.w(20), tintColor: colors.WHITE }}
        //                                     showImageBackground={true}
        //                                     borderRadius={0}
        //                                     marginVertical={scale.w(1)}
        //                                     paddingVertical={scale.w(1)}
        //                                     white={true}
        //                                     fontSize={scale.w(18)}
        //                                     bold={true}
        //                                     elevation={false}
        //                                     source2={{ uri: mobile_hotel_layouts.checkin_image }}
        //                                 />
        //                             )}

        //                             {this.props.feature.is_check_out_enabled && (
        //                                 <MenuButton
        //                                     height={wp(30)}
        //                                     width={wp(100)}
        //                                     source={require('../../images/icon_check_out.png')}
        //                                     text={check_out}
        //                                     iconSize={wp(13)}
        //                                     onPress={this._handleCheckOut}
        //                                     styleImage={{ tintColor: colors.WHITE }}
        //                                     showImageBackground={true}
        //                                     borderRadius={0}
        //                                     marginVertical={scale.w(1)}
        //                                     paddingVertical={scale.w(1)}
        //                                     white={true}
        //                                     bold={true}
        //                                     elevation={false}
        //                                     source2={{ uri: mobile_hotel_layouts.checkout_image }}
        //                                 />
        //                             )}

        //                             {this.props.feature.is_restaurant_enabled && (
        //                                 <MenuButton
        //                                     height={wp(30)}
        //                                     width={wp(100)}
        //                                     source={require('../../images/icon_restaurant.png')}
        //                                     text={restaurant}
        //                                     iconSize={wp(13)}
        //                                     onPress={this._handleRestaurant}
        //                                     styleImage={{ tintColor: colors.WHITE }}
        //                                     showImageBackground={true}
        //                                     borderRadius={0}
        //                                     marginVertical={scale.w(1)}
        //                                     paddingVertical={scale.w(1)}
        //                                     white={true}
        //                                     bold={true}
        //                                     elevation={false}
        //                                     source2={{ uri: mobile_hotel_layouts.restaurant_image }}
        //                                 />
        //                             )}

        //                             {this.props.feature.is_spa_enabled && (
        //                                 <MenuButton
        //                                     height={wp(30)}
        //                                     width={wp(100)}
        //                                     source={require('../../images/icon_spa.png')}
        //                                     text={spa}
        //                                     iconSize={wp(13)}
        //                                     onPress={this._handleSpa}
        //                                     styleImage={{ tintColor: colors.WHITE }}
        //                                     showImageBackground={true}
        //                                     borderRadius={0}
        //                                     marginVertical={scale.w(1)}
        //                                     paddingVertical={scale.w(1)}
        //                                     white={true}
        //                                     bold={true}
        //                                     elevation={false}
        //                                     source2={{ uri: mobile_hotel_layouts.spa_image }}
        //                                 />
        //                             )}

        //                             {this.props.feature.is_concierge_enabled && (
        //                                 <MenuButton
        //                                     height={wp(30)}
        //                                     width={wp(100)}
        //                                     source={require('../../images/icon_concierge_home_page.png')}
        //                                     text={conceirge_service}
        //                                     iconSize={wp(13)}
        //                                     onPress={this._handleConciergeService}
        //                                     styleImage={{ tintColor: colors.WHITE }}
        //                                     showImageBackground={true}
        //                                     borderRadius={0}
        //                                     marginVertical={scale.w(1)}
        //                                     paddingVertical={scale.w(1)}
        //                                     white={true}
        //                                     bold={true}
        //                                     elevation={false}
        //                                     source2={{ uri: mobile_hotel_layouts.concierge_image }}
        //                                 />
        //                             )}

        //                             {this.props.feature.is_experience && (
        //                                 <MenuButton
        //                                     height={wp(30)}
        //                                     width={wp(100)}
        //                                     source={require('../../images/icon_star.png')}
        //                                     text={experience}
        //                                     iconSize={wp(13)}
        //                                     onPress={this._handleExperience}
        //                                     styleImage={{ tintColor: colors.WHITE }}
        //                                     showImageBackground={true}
        //                                     borderRadius={0}
        //                                     marginVertical={scale.w(1)}
        //                                     paddingVertical={scale.w(1)}
        //                                     white={true}
        //                                     bold={true}
        //                                     elevation={false}
        //                                     source2={{ uri: mobile_hotel_layouts.experience_image }}
        //                                 />
        //                             )}

        //                             <MenuButton
        //                                 height={wp(30)}
        //                                 width={wp(100)}
        //                                 source={require('../../images/icon-lost-and-found.png')}
        //                                 text={lostAndFound}
        //                                 iconSize={wp(13)}
        //                                 onPress={this._handleLostAndFound}
        //                                 styleImage={{ tintColor: colors.WHITE }}
        //                                 showImageBackground={true}
        //                                 borderRadius={0}
        //                                 marginVertical={scale.w(1)}
        //                                 paddingVertical={scale.w(1)}
        //                                 white={true}
        //                                 bold={true}
        //                                 elevation={false}
        //                                 source2={{ uri: mobile_hotel_layouts.experience_image }}
        //                             />

        //                             {/* {this.props.feature.is_parking_enabled && (
        //                                 <MenuButton
        //                                     height={wp(30)}
        //                                     width={wp(100)}
        //                                     source={require('../../images/car-icon.png')}
        //                                     text={parking_and_valet}
        //                                     iconSize={wp(13)}
        //                                     onPress={this._handleParking}
        //                                     styleImage={{ tintColor: colors.WHITE }}
        //                                     showImageBackground={true}
        //                                     borderRadius={0}
        //                                     marginVertical={scale.w(1)}
        //                                     paddingVertical={scale.w(1)}
        //                                     white={true}
        //                                     bold={true}
        //                                     elevation={false}
        //                                     source2={{ uri: mobile_hotel_layouts.experience_image }}
        //                                 />
        //                             )} */}
        //                         </View>
        //                     </ScrollView>

        //                     <View style={{ justifyContent: 'center' }}>
        //                         <ViewAnimatable
        //                             useNativeDriver
        //                             animation="fadeIn"
        //                             duration={300}
        //                             style={{
        //                                 paddingHorizontal: scale.w(57),
        //                                 paddingTop: scale.w(6),
        //                                 paddingBottom: scale.w(6),
        //                             }}
        //                         >
        //                             <ButtonPrimary
        //                                 backgroundColor={color.primary_color || colors.LIGHT_BLUE}
        //                                 onPress={this._handleChat}
        //                                 text={live_chat}
        //                             />
        //                             {countUnreadMessage > 0 && (
        //                                 <View style={styles.notif_badge_container}>
        //                                     <H2 fontSize={scale.w(12)} color={colors.WHITE}>
        //                                         {countUnreadMessage > 99 ? '99+' : countUnreadMessage}
        //                                     </H2>
        //                                 </View>
        //                             )}
        //                         </ViewAnimatable>
        //                     </View>
        //                 </View>
        //             </RootContainer>
        //             <AttentionModal
        //                 visible={this.state.visible}
        //                 toggleModal={this.toggleModal}
        //                 text={this.state.text}
        //                 attention={attention}
        //                 ok={ok}
        //             />
        //         </View>
        //     );
        // } else {
        console.log('hotel code is hre ', this.props.code);
        return (
            <ViewAnimatable
                useNativeDriver
                animation="fadeInLeft"
                duration={400}
                delay={Math.floor(Math.random() * 100)}
                style={[base.container, { backgroundColor: '#FDFDFD' }]}
            >
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
                <CustomModal
                    ref={this._modalConfirm}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    <View
                        style={{
                            width: wp(80),
                            borderRadius: scale.w(3.0),
                            backgroundColor: colors.WHITE,
                            paddingHorizontal: 20,
                        }}
                    >
                        <TouchableOpacity
                            onPress={this._handleQuickCheckout}
                            style={{
                                paddingVertical: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={{ fontSize: scale.w(1.6), fontWeight: 'bold' }}>
                                {this.props.selectedLanguage.quick_checkout}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: colors.LIGHT_GREY }} />
                        <TouchableOpacity
                            onPress={() => {
                                Navigation.push(this.props.componentId, latecheckout);
                                this._modalConfirm.current?.hide();
                            }}
                            style={{
                                paddingVertical: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={{ fontSize: scale.w(1.6), fontWeight: 'bold' }}>
                                {this.props.selectedLanguage.late_checkout}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </CustomModal>
                <RootContainer>
                    <View>
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
                                    paddingHorizontal: widthPercentageToDP(5.5),
                                    backgroundColor: 'transparent',
                                    justifyContent: 'flex-end',
                                    paddingBottom: hp(2),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(2.6),
                                        color: '#FFFF',
                                        textTransform: 'capitalize',
                                        fontFamily: 'Harabara',
                                    }}
                                >
                                    {this.state?.chainData?.data?.name}
                                </Text>
                            </View>
                        </View>
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
                    </View>
                    {this.props.code ? (
                        <>
                            <View style={{ height: heightPercentageToDP(2.5) }}></View>
                            <RoundView
                                source={{ uri: hotel_logo }}
                                styleImage={{
                                    height: heightPercentageToDP(7.5),
                                    width: heightPercentageToDP(7.5),
                                    borderRadius: heightPercentageToDP(7.5) / 2,
                                }}
                                text={title !== '' ? title : 'Hotel Name'}
                                text1={
                                    this.props.account?.hotel_details?.data?.city
                                        ? this.props.account?.hotel_details?.data?.city.length > 15
                                            ? this.props.account?.hotel_details?.data?.city.substring(0, 15) +
                                              '...'
                                            : this.props.account?.hotel_details?.data?.city
                                        : '' + ' ' + this.props.account?.hotel_details?.data?.country
                                        ? this.props.account?.hotel_details?.data?.country.length > 15
                                            ? this.props.account?.hotel_details?.data?.country.substring(
                                                  0,
                                                  15,
                                              ) + '...'
                                            : this.props.account?.hotel_details?.data?.country
                                        : ''
                                }
                                source1={'phone'}
                                sourcehotelImage={this.state.hotelImage}
                                onIconTwo={this._handleChat}
                                onIconOne={() =>
                                    this._handlePhone(this.props.account.hotel_details.data.phone)
                                }
                                bold={true}
                                source1Color={'#43D4AA'}
                                backgrondColor1={'#E3F9F2'}
                                source2={'message-square'}
                                source2Color={'#4E66F0'}
                                backgrondColor2={'#E4E7FD'}
                            />
                        </>
                    ) : (
                        <View />
                    )}
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: wp(5),
                            marginTop: this.props.code ? heightPercentageToDP(2.5) : 0,
                            justifyContent: 'space-between',
                        }}
                    >
                        <CheckButton
                            text={check_in}
                            onPress={this._handleCheckIn}
                            icon={require('../../images/icon_check_in.png')}
                            color={icon.check_in_color}
                        />
                        <CheckButton
                            text={check_out}
                            onPress={this._handleCheckOut}
                            icon={require('../../images/icon_check_out.png')}
                            color={icon.check_out_color}
                        />
                    </View>
                    <View style={{ height: heightPercentageToDP(4.5) }}></View>
                    {this.props.code ? (
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                />
                            }
                            style={{ flex: 1 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {this.state.menuTabs?.length == this.state.disabledServices?.length ? (
                                <H4
                                    // textAlign="center"
                                    fontSize={scale.w(2.2)}
                                    // marginLeft={5}
                                    bold={true}
                                    marginHorizontal={widthPercentageToDP(6)}
                                    opacity={1}
                                    letterSpacing={0.45}
                                    fontFamily={'Harabara'}
                                    textAlign={'center'}
                                    paddingVertical={heightPercentageToDP(7)}
                                    paddingHorizontal={widthPercentageToDP(5)}
                                    // white={this.props.white}
                                >
                                    {'No serices are available please contact your hotel admin'}
                                </H4>
                            ) : (
                                <>
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
                                        {this.props.selectedLanguage.our_services}
                                    </H4>
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: widthPercentageToDP(5),
                                            marginTop: heightPercentageToDP(1),
                                            width: '100%',
                                        }}
                                    >
                                        {this.state.menuTabs.map((i, index) => {
                                            return i.isEnabled ? (
                                                <View
                                                    style={{
                                                        // marginLeft: count % 2 !=0 ?  widthPercentageToDP(3) :0,

                                                        //      marginLeft: index % 2 == 0 ? 0 : widthPercentageToDP(3),
                                                        marginTop: widthPercentageToDP(3),
                                                    }}
                                                >
                                                    <MenuButton
                                                        height={hp(16.5)}
                                                        width={wp(43)}
                                                        home={true}
                                                        source={i.source}
                                                        text={i.text}
                                                        fontSize={scale.w(1.8)}
                                                        iconSize={scale.w(6.5)}
                                                        onPress={i.onPress}
                                                        white
                                                        styleImage={{ tintColor: i.color }}
                                                    />
                                                </View>
                                            ) : (
                                                <View />
                                            );
                                        })}
                                    </View>
                                </>
                            )}
                            {this.props.isCheckedIn && (
                                <>
                                    <View style={{ height: heightPercentageToDP(3.7) }} />
                                    <ProfileNavButton
                                        home={true}
                                        IconBackground={colors.WHITE}
                                        title={this.props.selectedLanguage.order_and_bookings}
                                        backgrondColor={this.props.color}
                                        details={this.props.selectedLanguage.check_your_recent_orders}
                                        iconColor={this.props.color}
                                        onPress={() => {
                                            if (this._isLockFeature()) {
                                                return false;
                                            }
                                            Navigation.push(
                                                this.props.componentId,
                                                conciergeTrackingProgress,
                                            );
                                        }}
                                        white
                                    />
                                </>
                            )}
                            {this.props.isCheckedIn && (
                                <>
                                    <View style={{ height: heightPercentageToDP(4.5) }}></View>

                                    {/* <View style={{height : heightPercentageToDP(3)}}></View> */}
                                    <H4
                                        // textAlign="center"
                                        fontSize={scale.w(2.2)}
                                        // marginLeft={5}
                                        bold={true}
                                        marginLeft={widthPercentageToDP(6)}
                                        opacity={1}
                                        letterSpacing={0.45}
                                        fontFamily={'Harabara'}
                                        // white={this.props.white}
                                    >
                                        {this.props.selectedLanguage.room_details}
                                    </H4>
                                    <View style={{ height: widthPercentageToDP(3) }}></View>

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
                                            paddingHorizontal: widthPercentageToDP(5),
                                        }}
                                    >
                                        <View
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
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({
                                                            modalVisible: true,
                                                        })
                                                    }
                                                >
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
                                                </TouchableOpacity>
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
                                                                color: this.props.color,
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
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <DIcon
                                                                size={20}
                                                                color={this.props.color}
                                                                name={'people-alt'}
                                                            ></DIcon>
                                                            <Text
                                                                style={{
                                                                    color: this.props.color,
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
                                                                color: this.props.color,
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
                                                            borderColor: this.props.color,
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
                                                            {this.props.selectedLanguage.check_in_at +
                                                                `: ${moment(
                                                                    this.props.account.profile.arrival_date,
                                                                ).format('LT')}`}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </DropShadow>

                                    <View style={{ height: heightPercentageToDP(4.5) }}></View>

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
                                        {this.props.selectedLanguage.vehicle_parking}
                                    </H4>
                                    <View style={{ height: widthPercentageToDP(3) }}></View>

                                    {this.props.parkingDetails && this.props.parkingDetails?.length > 0 ? (
                                        this.props.parkingDetails.map((item, index) => {
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    onPress={() => this._handleParking(true, item)}
                                                    key={index}
                                                    style={{ marginBottom: 10 }}
                                                >
                                                    <RoundView
                                                        source={{ uri: item.number_plate }}
                                                        styleImage={{
                                                            height: heightPercentageToDP(7.5),
                                                            width: heightPercentageToDP(7.5),
                                                            borderRadius: heightPercentageToDP(7.5) / 2,
                                                        }}
                                                        // source1
                                                        text={'My Car'}
                                                        text1={`${
                                                            this.props.account?.hotel_details?.data
                                                                ?.country !== null ||
                                                            this.props.account?.hotel_details?.data?.city !==
                                                                null ||
                                                            this.props.account?.hotel_details?.data?.city !==
                                                                ''
                                                                ? this.props.account?.hotel_details?.data
                                                                      ?.city +
                                                                  ' ' +
                                                                  this.props.account?.hotel_details?.data
                                                                      ?.country
                                                                : ''
                                                        } `}
                                                        // text1={`${
                                                        //     this.props.account?.hotel_details?.data
                                                        //         ?.country !== null
                                                        //         ? 'Parked:' +
                                                        //           this.props.account?.hotel_details?.data
                                                        //               ?.address
                                                        //         : ''
                                                        // } `}
                                                        sourcehotelImage={item.number_plate}
                                                        bold={true}
                                                        onIconTwo={() => this._handleParking(true, item)}
                                                        backgrondColor1={'#E3F9F2'}
                                                        source2={'message-square'}
                                                        // source1
                                                        source2Color={'#4E66F0'}
                                                        backgrondColor2={'#E4E7FD'}
                                                    />
                                                </TouchableOpacity>
                                            );
                                        })
                                    ) : (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => this._handleParking(false, {})}
                                        >
                                            <RoundView
                                                source={require('../../images/car_Parking.png')}
                                                styleImage={{
                                                    height: heightPercentageToDP(7.5),
                                                    width: heightPercentageToDP(7.5),
                                                    borderRadius: heightPercentageToDP(7.5) / 2,
                                                    alignItems: 'center',
                                                }}
                                                text={'My Car'}
                                                text1={`${
                                                    this.props.account?.hotel_details?.data?.country !==
                                                        null ||
                                                    this.props.account?.hotel_details?.data?.city !== null ||
                                                    this.props.account?.hotel_details?.data?.city !== ''
                                                        ? this.props.account?.hotel_details?.data?.city +
                                                          ' ' +
                                                          this.props.account?.hotel_details?.data?.country
                                                        : ''
                                                } `}
                                                bold={true}
                                                onIconTwo={() => this._handleParking(false, {})}
                                                backgrondColor1={'#E3F9F2'}
                                                source2={'message-square'}
                                                source2Color={'#4E66F0'}
                                                backgrondColor2={'#E4E7FD'}
                                                icon={true}
                                                Primary_Color={this.props.Primary_Color}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: heightPercentageToDP(3.2),
                                }}
                            >
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
                                    {this.props.selectedLanguage.specially_for_you}
                                </H4>
                                <TouchableOpacity
                                    style={{ paddingHorizontal: heightPercentageToDP(3.5) }}
                                    onPress={this._handleExperience}
                                >
                                    <H4
                                        // textAlign="center"
                                        fontSize={scale.w(1.5)}
                                        bold={true}
                                        opacity={0.7}
                                        color={this.props.color}
                                        // white={this.props.white}
                                    >
                                        {this.props.selectedLanguage.see_all}
                                    </H4>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: heightPercentageToDP(3) }}></View>

                            <View
                                style={{
                                    height: heightPercentageToDP(35),
                                    width: wp(90),
                                    alignSelf: 'center',
                                }}
                            >
                                <SnapCarousel onPress={this._handleExperience} images={this.state.images} />
                            </View>

                            {/* <MenuButton
                                        height={hp(18)}
                                        width={wp(38)}
                                        source={require('../../images/icon-lost-and-found.png')}
                                        text={lostAndFound}
                                        iconSize={wp(13)}
                                        onPress={this._handleLostAndFound}
                                        styleImage={{ tintColor: icon.cleaning_color }}
                                    /> */}
                            <View style={{ height: heightPercentageToDP(5) }} />
                        </ScrollView>
                    ) : (
                        <View
                            style={{
                                height: heightPercentageToDP(55),
                                paddingHorizontal: wp(5),
                            }}
                        >
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />
                                }
                                showsVerticalScrollIndicator={false}
                            >
                                {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                                <View style={{ marginHorizontal: wp(6) }}>
                                    <H4
                                        // textAlign="center"
                                        fontSize={scale.w(2.0)}
                                        // marginLeft={5}
                                        bold={true}
                                        // white={this.props.white}
                                    >
                                        {'Our Services'}
                                    </H4>
                                </View>
                                {/* {this.props.feature.is_restaurant_enabled && ( */}
                                <View
                                    style={{
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        flexDirection: 'row',
                                        paddingHorizontal: wp(1),
                                        marginTop: hp(1),
                                    }}
                                >
                                    <MenuButton
                                        height={hp(20)}
                                        width={wp(42)}
                                        home={true}
                                        source={require('../../images/icon_restaurant.png')}
                                        text={restaurant}
                                        iconSize={wp(15)}
                                        fontSize={scale.w(1.4)}
                                        white
                                        onPress={this._handleRestaurant}
                                        styleImage={{ tintColor: colors.VIOLET }}
                                        // buttonStyle={{backgroundColor : colors.VIOLET}}
                                    />
                                    {/* )} */}

                                    {/* {this.props.feature.is_spa_enabled && ( */}
                                    <MenuButton
                                        height={hp(20)}
                                        width={wp(42)}
                                        source={require('../../images/icon_spa.png')}
                                        text={spa}
                                        white
                                        home={true}
                                        iconSize={wp(15)}
                                        fontSize={scale.w(1.4)}
                                        onPress={this._handleSpa}
                                        styleImage={{ tintColor: colors.BLUE }}
                                    />
                                    {/* )} */}
                                    {/* {this.props.feature.is_concierge_enabled && ( */}
                                    <MenuButton
                                        height={hp(20)}
                                        width={wp(42)}
                                        home={true}
                                        source={require('../../images/icon_concierge_home_page.png')}
                                        text={conceirge_service}
                                        iconSize={wp(15)}
                                        fontSize={scale.w(1.4)}
                                        onPress={this._handleConciergeService}
                                        styleImage={{ tintColor: colors.LIGHT_BLUE }}
                                    />
                                    {/* )} */}

                                    {/* {this.props.feature.is_experience && ( */}
                                    <MenuButton
                                        height={hp(20)}
                                        width={wp(42)}
                                        home={true}
                                        source={require('../../images/icon_star.png')}
                                        text={experience}
                                        fontSize={scale.w(1.4)}
                                        iconSize={wp(15)}
                                        onPress={this._handleExperience}
                                        white
                                        styleImage={{ tintColor: colors.BUTTON_GREY }}
                                    />
                                </View>
                            </ScrollView>
                            {/* )} */}
                            {/* </ScrollView> */}
                        </View>
                    )}
                    <View
                        style={{
                            position: 'absolute',
                            width: wp(100),
                            height: Platform.OS == 'android' ? '100%' : null,
                            bottom: Platform.OS == 'android' ? null : 0,
                            justifyContent: 'flex-end',
                        }}
                    >
                        <BottomBar
                            onChatPress={this._handleChat}
                            onAccount={this._handleAccount}
                            onPromoClick={this._handleLostAndFound}
                            profile={false}
                            home={true}
                            backgroundColor={this.props.color}
                            countUnreadMessage={this.props.isCheckedIn ? countUnreadMessage : 0}
                            checkWindow={'home'}
                            title={this.props.selectedLanguage.home}
                        />
                        {/* {this.props.isCheckedIn ? (
                                    <ViewAnimatable
                                        useNativeDriver
                                        animation="fadeIn"
                                        duration={300}
                                        style={{ paddingHorizontal: scale.w(57), paddingTop: scale.w(10) }}
                                    >
                                        <ButtonPrimary
                                            backgroundColor={color.primary_color || colors.LIGHT_BLUE}
                                            onPress={this._handleChat}
                                            text={live_chat}
                                        />
                                        {countUnreadMessage > 0 && (
                                            <View style={styles.notif_badge_container}>
                                                <H2 fontSize={scale.w(12)} color={colors.WHITE}>
                                                    {countUnreadMessage > 99 ? '99+' : countUnreadMessage}
                                                </H2>
                                            </View>
                                        )}
                                    </ViewAnimatable>
                                ) : (
                                    <ViewAnimatable
                                        useNativeDriver
                                        animation="fadeIn"
                                        duration={300}
                                        style={{
                                            paddingHorizontal: scale.w(57),
                                            paddingVertical: scale.w(9),
                                        }}
                                    >
                                        <ButtonPrimary
                                            backgroundColor={color.primary_color || colors.LIGHT_BLUE}
                                            onPress={async () => {
                                                await this.props.checkOutSuccess();
                                                Navigation.setRoot({ root: pickHotel });
                                            }}
                                            text={this.props.selectedLanguage.log_out}
                                        />
                                    </ViewAnimatable>
                                )} */}
                    </View>
                </RootContainer>
                <AttentionModal
                    visible={this.state.visible}
                    toggleModal={this.toggleModal}
                    text={this.state.text}
                    attention={attention}
                    ok={ok}
                />
                <ImageZoomModal
                    modalVisible={this.state.modalVisible}
                    onBack={() => this.setState({ modalVisible: false })}
                    onBackDrop={() => this.setState({ modalVisible: false })}
                    Image={require('../../images/restaurant-sample.jpg')}
                    onBackArrow={() => this.setState({ modalVisible: false })}
                />
            </ViewAnimatable>
        );
        // }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container_menu: {
        height: heightPercentageToDP(60),
        alignItems: 'center',
    },
    notif_badge_container: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: colors.RED,
        height: scale.w(30),
        width: scale.w(30),
        borderRadius: scale.w(30 / 2),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale.w(45),
    },
});

export default MainMenu;
