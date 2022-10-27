import { AxiosError } from 'axios';
import { IFailedResponse } from '../types/responseApi';
import { Alert, ToastAndroid, Platform } from 'react-native';
import { checkOut } from '../actions/action.account';
import PushNotification from 'react-native-push-notification';
import { timeInterval } from 'rxjs';
// import messaging from '@react-native-firebase/messaging';
// import { Notifications } from 'react-native-notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import moment, { Moment } from 'moment';

export const WAKE_UP_ID = 'WAKE_UP_ID';

export const toast = (msg: string | { message: string }, title: any = null) => {
    // if (__DEV__) {
    //     console.log('TOAST: ', msg);
    // }

    const message = typeof msg !== 'string' ? msg?.message : msg;

    if (Platform.OS === 'ios') {
        Alert.alert('Alert', message);
    } else {
        ToastAndroid.show(message, ToastAndroid.LONG);
    }
};

interface IHandleError {
    error: AxiosError;
    dispatch: any;
    displayMessage?: boolean;
    failedAction: object;
    type: string;
    onFailed?: (error: AxiosError) => void;
    delayShowMessage?: boolean;
}

export const handleError = ({
    error,
    dispatch,
    displayMessage = true,
    failedAction,
    type,
    onFailed,
    delayShowMessage = false,
}: IHandleError) => {
    // dispatch and log first
    dispatch(failedAction);

    // if (__DEV__) {
    //     console.log(`${type}: `, error);
    // }

    // check for unauthorized
    if (error.response && error.response.status === 401) {
        dispatch(checkOut());
    }

    // display message if error from server
    if (displayMessage && error.response && error.response.data) {
        const { message } = <IFailedResponse>error.response.data;
        const msg = message && message !== '' ? message : error.response.data[1]; //"Dont't worry, and please try again."
        if (error.response.data.message != 'Unauthenticated.') {
            if (delayShowMessage) {
                setTimeout(() => {
                    toast(msg, 'Error');
                }, 1500);
            } else {
                toast(msg, 'Error');
            }
        }
    }

    if (onFailed) {
        onFailed(error);
    }
};

export interface IRulesFormValidation {
    isValid: boolean;
    message: string;
}

export const handleFormValidation = (
    rules: IRulesFormValidation[],
    onSuccessValidation?: () => void,
    onFailedValidation?: (props: IRulesFormValidation) => void,
) => {
    let valid = true;
    rules.some((rule) => {
        if (!rule.isValid) {
            if (onFailedValidation) {
                onFailedValidation(rule);
            }
            valid = false;

            return true;
        }

        return false;
    });

    if (valid && onSuccessValidation) {
        onSuccessValidation();
    }
};

export const handleLocalNotification = async (
    text: string,
    messageId: string,
    payload: string,
    refernce: any,
) => {
    // const channelId = await notifee.createChannel({
    //     id: 'servr',
    //     name: 'servr',
    //     visibility: AndroidVisibility.PUBLIC,
    //     sound: 'hollow',
    // });

    // notifee.onForegroundEvent(({ type, detail }) => {
    //     switch (type) {
    //       case EventType.DISMISSED:
    //         console.log('User dismissed notification', detail.notification);
    //         break;
    //       case EventType.PRESS:
    //         console.log('User pressed notification', detail.notification);
    //         break;
    //     }
    //   });
    // Link: https://notifee.app/react-native/reference/displaynotification
    // await notifee.displayNotification({
    //     id: messageId,
    //     title: payload?.user?.name,
    //     body: text,
    //     // Link: https://notifee.app/react-native/reference/notificationandroid
    //     android: {
    //         channelId,
    //         importance: AndroidImportance.HIGH,
    //     },
    //     // Link: https://notifee.app/react-native/reference/notificationios
    //     ios: {
    //         foregroundPresentationOptions: {
    //             alert: true,
    //             badge: true,
    //             sound: true,
    //         },
    //     },
    // });
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //     console.log(
    //       'Notification caused app to open from background state:',
    //       remoteMessage.notification,
    //     );
    //   });

    //   // Check whether an initial notification is available
    //   messaging()
    //     .getInitialNotification()
    //     .then(remoteMessage => {
    //       if (remoteMessage) {
    //         console.log(
    //           'Notification caused app to open from quit state:',
    //           remoteMessage.notification,
    //         );
    //       }
    //     });
    // console.log("typpppppeeeepppppeeeeeeeeeeee",text)
    if (text.includes('has been requested') || text.includes('has been sent')) {
        null;
    } else {
        scheduleNotification(refernce, text, payload);
        // Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
        //     Notifications.postLocalNotification({
        //         title: payload,
        //         body: text,
        //         silent: false,
        //         category: "SOME_CATEGORY",
        //         userInfo: {},
        //     });
        //     // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        //     completion({ alert: true, sound: true, badge: false });
        // });
    }
};

export const validateEmail = (Cnic: any) => {
    var re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,9})$/;
    return re.test(Cnic);
};

export const validateName = (name: any) => {
    var re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    return re.test(name);
};

export const validatePhoneNumber = (phoneNumber: any) => {
    var re = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    return re.test(phoneNumber);
};
export const validateMMYY = (dateformat: any) => {
    var re = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    return re.test(dateformat);
};

export const FormatMoney = (num) => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
};

export const createChannel = (id) => {
    PushNotification.createChannel(
        {
            channelId: id, // (required)
            channelName: 'My channel', // (required)
            channelDescription: 'Here is the reminder 10 minutes before of the event', // (optional) default: undefined.
            playSound: true, // (optional) default: true
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => {
            console.log(`createChannel returned '${created}'` + 'Refrecnece c  ', id);
        }, // (optional) callback returns whether the channel was created, false means it already existed.
    );
};

export const scheduleNotification = (id, body, title) => {
    // if (Platform.OS == 'ios') {
    //     PushNotificationIOS.addNotificationRequest({
    //         id: id,
    //         title: title,
    //         body: body,
    //         criticalSoundVolume: 1,
    //         isCritical: true
    //     });

    // } else
    PushNotification.localNotification({
        //... You can use all the options from localNotifications
        title: title,
        priority: 'high',
        message: body, // (required)
        date: new Date(), // in 60 secs
        allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
        channelId: id,
        visibility: 'public',
        vibrate: true,
        /* Android Only Properties */
        repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
    });
};

export const LocalNotificationScheduleCahnnel = (id) => {
    PushNotification.createChannel(
        {
            channelId: id, // (required)
            channelName: 'My channel', // (required)
            channelDescription: 'Here is the reminder 10 minutes before of the event', // (optional) default: undefined.
            playSound: true, // (optional) default: true
            soundName: 'default',
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => console.log(`create Channel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
};

export const LocalNotificationSchedule = (id: any, time: any, note: any) => {
    PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        // message: `Its your wake up call ${time}`, // (required)
        message: `${note}`, // (required)
        date: new Date(time), // in 60 secs
        allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
        channelId: id,
        /* Android Only Properties */
        repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
        playSound: true,
        soundName: 'default',
    });
};

export const cancelSchduleNotification = (id: String) => {
    PushNotification.cancelLocalNotifications({ id: `${id}` });
};

export const localNotificationDays = (
    checkOutDate: Moment,
    id: String,
    days: Array<any>,
    time: String,
    note: String,
) => {
    cancelSchduleNotification(id);
    var date1 = moment();
    var date2 = moment(checkOutDate, 'YYYY-MM-DD HH:mm:ss');
    LocalNotificationScheduleCahnnel(id);
    for (date1; date1.isBefore(date2); date1.add(1, 'day')) {
        for (var index = 0; index < days.length; index++) {
            if (days[index].toLowerCase() == moment(date1).format('dddd').toLowerCase()) {
                var tempDate = date1.format('YYYY-MM-DD');
                var tempTime = time;
                var timeAndDate = moment(tempDate + ' ' + tempTime).toString();
                LocalNotificationSchedule(id, timeAndDate, note);
                console.log('successfully set the local notifications', timeAndDate);
                console.log('successfully set the local notifications', note);
            }
        }
    }
};
