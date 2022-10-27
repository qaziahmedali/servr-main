import { Alert, AppRegistry, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import registerScreens from './utils/registerScreens';
import * as navigationControl from './utils/navigationControl';
import { persistStore as persistStoreRaw } from 'redux-persist';
import configureStore from './utils/configureStore';
import colors from './constants/colors';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import NetInfo from '@react-native-community/netinfo';

// import firebase from 'react-native-firebase';
import { throttle } from 'lodash';
import {
    checkin,
    checkout,
    chat,
    restaurantList,
    conciergeService,
    spaService,
    //cleaningService,
    experienceService,
    mainmenu,
} from './utils/navigationControl';
import axios from 'axios';
import { setBaseUrl } from './constants/tempFile';
/**
 * Register channel notification for android 8.0
 * @param none
 * @return void
 */
const registerChannelNotification = () => {
    // Build a channel
    // const channel = new firebase.notifications.Android.Channel(
    //     'servr',
    //     'Servr',
    //     firebase.notifications.Android.Importance.Max,
    // )
    //     .setDescription('Servr Channel Notification')
    //     .setSound('default')
    //     .enableLights(true)
    //     .enableVibration(true);

    // // Create the channel
    // firebase.notifications().android.createChannel(channel);
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // firebase.notifications().onNotification((notification) => {
    //     if (Platform.OS === 'android') {
    //         const localNotification = new firebase.notifications.Notification().android

    //             .setChannelId('servr')
    //             .android.setSmallIcon('ic_launcher_round')
    //             .android.setPriority(firebase.notifications.Android.Priority.High)
    //             .setSound(firebase.notifications.Android.Defaults.Sound.toString())
    //             .setNotificationId(notification.notificationId)
    //             .setTitle('New message')
    //             .setSubtitle(`Unread message: ${JSON.parse(notification.data.sendbird).unread_message_count}`)
    //             .setBody(notification.data.message)
    //             .setData(JSON.parse(notification.data.sendbird));

    //         firebase
    //             .notifications()
    //             .displayNotification(localNotification)
    //             .catch((err) => console.error(err));

    //         console.log(notification, 'notification');
    //     } else if (Platform.OS === 'ios') {
    //         const localNotification = new firebase.notifications.Notification()
    //             .setNotificationId(notification.messageId)
    //             .setTitle('New message')
    //             .setSubtitle(`Unread message: ${JSON.parse(notification.data.sendbird).unread_message_count}`)
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
    // .notifications()
    // .getInitialNotification()
    // .then(notificationOpen => {
    //   if (notificationOpen) {
    //     console.log(notificationOpen);

    //     console.log("1---OPEND");
    //     firebase.notifications().removeAllDeliveredNotifications();
    //     console.log("1---OPEND-After");
    //   }
    // });
    //   firebase
    //     .notifications()
    //     .onNotificationOpened(notificationOpen => {

    //   if (notificationOpen) {

    //     console.log('1234 == ',notificationOpen)
    //     if(notificationOpen.notification.data.text.includes('Check In request has been accepted')){

    //         Navigation.push('checkin', checkin);
    //     }
    //     //laundry order
    //     else if(notificationOpen.notification.data.text.includes('Your laundry order is Confirmed')){
    //         Navigation.push('conciergeService', conciergeService);

    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your laundry order is Completed')){
    //         // Navigation.setRoot({ root: mainmenu });

    //         // Navigation.push('conciergeService',conciergeService);
    //         Navigation.mergeOptions('conciergeService',{})

    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your laundry order is Rejected')){
    //         Navigation.push('conciergeService', conciergeService);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Laundry service has been requested')){
    //         Navigation.push('conciergeService', conciergeService);
    //     }
    //     //room cleaning
    //     else if(notificationOpen.notification.data.text.includes('Your room cleaning order is Confirmed')){
    //         Navigation.push('conciergeService', conciergeService);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your room cleaning order is Done')){
    //         Navigation.push('conciergeService', conciergeService);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your room cleaning order is Rejected')){
    //         Navigation.push('conciergeService', conciergeService);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your room cleaning order is Completed')){
    //         Navigation.push('conciergeService', conciergeService);
    //     }
    //     //conciergeService
    //     else if(notificationOpen.notification.data.text.includes('Your Concierge Service Request is confirmed')){
    //         Navigation.push('conciergeService', conciergeService);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your Concierge Service Request is Done')){
    //         Navigation.push('conciergeService', conciergeService);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your Concierge Service Request is Rejected')){
    //         Navigation.push('conciergeService', conciergeService);
    //     }
    //     //restaurantList
    //     else if(notificationOpen.notification.data.text.includes('Your restaurant order is Confirmed')){
    //         Navigation.push('restaurantList', restaurantList);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your restaurant order is Preparing')){
    //         Navigation.push('restaurantList', restaurantList);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your restaurant order is On The Way')){
    //         Navigation.push('restaurantList', restaurantList);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your restaurant order is Done')){
    //         Navigation.push('restaurantList', restaurantList);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Your restaurant order is Rejected')){
    //         Navigation.push('restaurantList', restaurantList);
    //     }
    //     //Restaurant Book Table
    //     else if(notificationOpen.notification.data.text.includes('Your restaurant reservation has been accepted')){
    //         Navigation.push('restaurantList', restaurantList);
    //     }
    //     else if(notificationOpen.notification.data.text.includes('Unfortunatly your restaurant reservation has been declined, please try to book again or contact your hotel')){
    //         Navigation.push('restaurantList', restaurantList);
    //     }
    //     //Spa Booking
    //     else if(notificationOpen.notification.data.text.includes('Your spa reservation has been accepted')){
    //         Navigation.push('spaService', spaService);
    //     }
    //     console.log("OPEND");
    //     firebase.notifications().removeAllDeliveredNotifications();
    //     console.log("OPEND-After");
    //   }
    // });
    console.log('hello');
};

/**
 * Wait till our store is persisted
 * @param {store} storeToPersist - The redux store to persist
 * @returns {Promise} - Promise that resolves when the store is rehydrated
 */
const persistStore = (storeToPersist: any) => {
    return new Promise((resolve: any) => {
        persistStoreRaw(storeToPersist, undefined, () => {
            resolve();
        });
    });
};

/**
 * Set root screen for launch app for the first time
 */
const setRootScreen = () => {
    Navigation.setDefaultOptions({
        statusBar: {
            style: 'light',
            backgroundColor: colors.BLUE,
        },
        topBar: {
            visible: false,
            drawBehind: true,
        },
        layout: {
            backgroundColor: '#fff',
            orientation: ['portrait'],
        },
        animations: {
            push: {
                waitForRender: false,
            },
            setRoot: {
                waitForRender: false,
            },
        },
        bottomTabs: {
            visible: false,
            drawBehind: true,
        },
        animations: {
            push: {
                content: {
                    x: {
                        from: 1000,
                        to: 0,
                        duration: 100,
                        interpolation: 'accelerate',
                    },
                    alpha: {
                        from: 0,
                        to: 1,
                        duration: 100,
                        interpolation: 'accelerate',
                    },
                },
            },
            pop: {
                content: {
                    x: {
                        from: 0,
                        to: 1000,
                        duration: 100,
                        interpolation: 'decelerate',
                    },
                    alpha: {
                        from: 1,
                        to: 0,
                        duration: 100,
                        interpolation: 'decelerate',
                    },
                },
            },
            setRoot: {
                enter: {
                    x: {
                        from: 1000,
                        to: 0,
                        duration: 100,
                        interpolation: 'accelerate',
                    },
                    alpha: {
                        from: 0,
                        to: 1,
                        duration: 100,
                        interpolation: 'accelerate',
                    },
                },
                exit: {
                    x: {
                        from: 1000,
                        to: 0,
                        duration: 100,
                        interpolation: 'accelerate',
                    },
                    alpha: {
                        from: 0,
                        to: 1,
                        duration: 100,
                        interpolation: 'accelerate',
                    },
                },
            },
        },
        // animations: {
        //     setRoot: {
        //         alpha: {
        //             from: 0,
        //             to: 1,
        //             duration: 400,
        //             startDelay: 100,
        //             interpolation: 'accelerate',
        //         },
        //     },
        // },
    });

    Navigation.setRoot({
        root: navigationControl.splashscreen,
    });
};

/**
 * We register screens then we wait for
 *    - Store to be rehydrated
 * and then we finally initialize layout accordingly.
 */
const bootstrap = async () => {
    try {
        // disable yellow box
        console.disableYellowBox = true;

        // create the store
        const store = configureStore();

        // register the screen with the store
        registerScreens(store);

        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                console.log('TOKEN:', token);
            },

            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {
                console.log('NOTIFICATION:', notification);

                // process the notification

                // (required) Called when a remote is received or opened, or local notification is opened
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                console.log('ACTION:', notification.action);
                console.log('NOTIFICATION:', notification);

                // process the action
            },

            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) {
                console.error(err.message, err);
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        });

        // Add any more promises that must be resolved before layout is set
        await Promise.all([persistStore(store), registerChannelNotification()]);

        // fire the screen for the first time
        setRootScreen();
    } catch (error) {
        if (__DEV__) {
            console.log('BOOTSTRAP: ', error);
        }

        Alert.alert('Sorry', 'Calibrate with your phone, please restart application.');
    }
};

export const backgroundPush = async (message: any) => {
    try {
        if (__DEV__) {
            console.log('BACKGROUND_MESSAGE: ', { message });
        }

        const text = message.data.message;
        const payload = JSON.parse(message.data.sendbird);
        const localNotification = new firebase.notifications.Notification().android
            .setChannelId('servr')
            .android.setSmallIcon('ic_launcher_round')
            .android.setPriority(firebase.notifications.Android.Priority.High)
            .setSound(firebase.notifications.Android.Defaults.Sound.toString())
            .setNotificationId(message.messageId)
            .setTitle('New message')
            .setSubtitle(`Unread message: ${payload.unread_message_count}`)
            .setBody(text)
            .setData(payload);
        return firebase.notifications().displayNotification(localNotification);
    } catch (e) {
        return Promise.resolve();
    }
};

if (Platform.OS === 'android') {
    const throtledBackgroundPush = throttle(backgroundPush, 1000, { leading: true, trailing: false });
    AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => throtledBackgroundPush);
}

/**
 * The initial listener of our app,
 * this will get triggered on app start or when the Android activity is recreated.
 * (For example by pressing back button on the root screen)
 */
let executeOnce = true;
Navigation.events().registerAppLaunchedListener(async () => {
    NetInfo.fetch().then(async (state) => {
        if (state.isConnected == true) {
            const a = await axios.get('https://app-url.servrhotels.com/app-url?app_version=3.25&app=ios');
            setBaseUrl(a);
            if (executeOnce) {
                bootstrap();
                executeOnce = false;
            } else {
                setRootScreen();
            }
        } else {
            Alert.alert('Internet Error', 'Please check your internet connection.');
        }
    });
});
