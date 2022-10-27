import { createLogic } from 'redux-logic';
import {
    GET_INIT_NOTIF,
    GET_FOREGROUND_NOTIF,
    REMOVE_GET_FOREGROUND_NOTIF,
    GET_BACKGROUND_NOTIF,
    REMOVE_GET_BACKGROUND_NOTIF,
    ON_TOKEN_NOTIF_REFRESH,
    REMOVE_ON_TOKEN_NOTIF_REFRESH,
    REQUEST_NOTIF_PERMISSION,
    TGetInitNotif,
    TGetForegroundNotif,
    TGetBackgroundNotif,
    TOnTokenNotifRefresh,
    TRequestNotifPermission,
} from '../types/action.notification';
import { IDependencies } from '../types/responseApi';
import {
    getInitNotifSuccess,
    notifFailed,
    requestNotifPermissionSuccess,
} from '../actions/action.notification';
import { Platform } from 'react-native';

const getInitNotifLogic = createLogic({
    type: GET_INIT_NOTIF,
    async process({ firebase, action }: IDependencies<ReturnType<TGetInitNotif>>, dispatch, done) {
        try {
            const notificationOpen = await firebase.notifications().getInitialNotification();

            if (__DEV__) {
                console.log('BACKGROUND_KILLED_NOTIFICATION: ', { notificationOpen });
            }

            // parsing payload
            const payload: object | null =
                notificationOpen && notificationOpen.notification.data.payload
                    ? JSON.parse(notificationOpen.notification.data.payload)
                    : null;

            // just dispatch success, i dont care
            dispatch(getInitNotifSuccess());

            // send callback
            if (action.payload.onCallback) {
                action.payload.onCallback(payload);
            }
        } catch (error) {
            // just dispatch fail
            dispatch(notifFailed(error, action.type));
        }
        done();
    },
});

const getForegroundNotifLogic = createLogic({
    type: GET_FOREGROUND_NOTIF,
    cancelType: REMOVE_GET_FOREGROUND_NOTIF,
    warnTimeout: 0,
    process(
        { firebase, action, cancelled$ }: IDependencies<ReturnType<TGetForegroundNotif>>,
        dispatch,
        done,
    ) {
        // const notificationListener = firebase.notifications().onNotification((notification) => {
        //     if (__DEV__) {
        //         console.log(`${action.type}: `, { notification });
        //     }
        //     const { title, body, data } = notification;
        //     const payload: object | null = data.payload ? JSON.parse(data.payload) : null;
        //     // just send callback
        //     if (action.payload.onCallback) {
        //         action.payload.onCallback({ title, body, payload });
        //     }
        // });
        // // destroy listener on cancel logic
        // cancelled$.subscribe(() => {
        //     if (notificationListener) {
        //         notificationListener();
        //     }
        //     done();
        // });
    },
});

const getBackgroundNotifLogic = createLogic({
    type: GET_BACKGROUND_NOTIF,
    cancelType: REMOVE_GET_BACKGROUND_NOTIF,
    warnTimeout: 0,
    process(
        { firebase, action, cancelled$ }: IDependencies<ReturnType<TGetBackgroundNotif>>,
        dispatch,
        done,
    ) {
        // const notificationOpenedListener = firebase
        //     .notifications()
        //     .onNotificationOpened((notificationOpen) => {
        //         if (__DEV__) {
        //             console.log(`${action.type}: `, { notificationOpen });
        //         }
        //         const payload: object | null = notificationOpen.notification.data.payload
        //             ? JSON.parse(notificationOpen.notification.data.payload)
        //             : null;
        //         if (action.payload.onCallback) {
        //             action.payload.onCallback(payload);
        //         }
        //     });
        // // just destroy listener on cancel logic
        // cancelled$.subscribe(() => {
        //     if (notificationOpenedListener) {
        //         notificationOpenedListener();
        //     }
        //     done();
        // });
    },
});

const onTokenNotifRefreshLogic = createLogic({
    type: ON_TOKEN_NOTIF_REFRESH,
    cancelType: REMOVE_ON_TOKEN_NOTIF_REFRESH,
    warnTimeout: 0,
    process(
        { firebase, action, sendbird, cancelled$ }: IDependencies<ReturnType<TOnTokenNotifRefresh>>,
        dispatch,
        done,
    ) {
        const onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken) => {
            if (fcmToken) {
                // Register FCM token to server
                if (__DEV__) {
                    console.log(`${action.type}: `, fcmToken);
                }

                // register refreshed token on sendbird
                if (Platform.OS === 'ios') {
                    sendbird.registerAPNSPushTokenForCurrentUser(fcmToken);
                } else {
                    sendbird.registerGCMPushTokenForCurrentUser(fcmToken);
                }

                // send callback
                if (action.payload.onCallback) {
                    action.payload.onCallback(fcmToken);
                }
            }
        });

        // just destroy listener on cancel logic
        cancelled$.subscribe(() => {
            if (onTokenRefreshListener) {
                onTokenRefreshListener();
            }
            done();
        });
    },
});

const requestNotifPermissionLogic = createLogic({
    type: REQUEST_NOTIF_PERMISSION,
    warnTimeout: 0,
    async process({ firebase, action }: IDependencies<ReturnType<TRequestNotifPermission>>, dispatch, done) {
        try {
            if (!(await firebase.messaging().hasPermission())) {
                // user doesn't have permission
                await firebase.messaging().requestPermission();
            }

            dispatch(requestNotifPermissionSuccess());

            if (action.payload.onCallback) {
                action.payload.onCallback();
            }
        } catch (error) {
            dispatch(notifFailed(error, action.type));
        }
    },
});

export default [
    getInitNotifLogic,
    getForegroundNotifLogic,
    getBackgroundNotifLogic,
    onTokenNotifRefreshLogic,
    requestNotifPermissionLogic,
];
