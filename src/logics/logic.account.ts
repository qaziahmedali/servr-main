import { createLogic } from 'redux-logic';
import { BackHandler } from 'react-native';
import {
    IDependencies,
    ISuccessGetMe,
    ISuccessCheckIn,
    IFailedResponse,
    ISuccessLogin,
    ISuccessSignUp,
    ISuccessUserLogIn,
    ISuccessGetTransactionHistroy,
    ISuccessAdditionalServices,
} from '../types/responseApi';
import { getHotelDetail, getHotelDetailSuccess } from '../actions/action.hotel';
import {
    SIGN_UP,
    TSignUp,
    CHECK_IN,
    CHECK_OUT,
    GET_PROFILE,
    VERIFY_PHONE_NUMBER,
    VERIFY_PIN,
    TCheckIn,
    TCheckOut,
    TGetProfile,
    TVerifyPhoneNumber,
    TVerifyPin,
    LOGIN,
    TLogin,
    ON_AUTH_STATE_CHANGED,
    TOnAuthStateChanged,
    ON_AUTH_STATE_CHANGED_SUCCESS,
    REMOVE_ON_AUTH_STATE_CHANGED,
    LATE_CHECK_OUT,
    TUserCheckOut,
    GET_TRANSACTION_HISTORY,
    TgetTransactionHistory,
    BILLS,
    QUICK_CHECK_OUT,
    TRANSACTION_HISTORY_PAYMENT,
    TUserLogIn,
    USER_LOGIN,
    GOOGLE_LOGIN,
    TUserGoogleLogIn,
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    TForgotPasswordRequest,
    UPDATE_PASSWORD,
    TUpdatePasswordRequest,
    UPDATE_PROFILE,
    TUpdateProfileRequest,
    GET_ADDITIONAL_SERVICES,
    TGetAdditionalServices,
    TLateCheckOut,
    CARD_DETAILS,
    UPDATE_CARD_DETAILS,
    GO_BACK_TO_HOME,
    TGoBackToHome,
    FIND_BOOKING,
    TFindBooking,
    SEND_VERIFICATION_LINK,
    GET_CURRENT_BOOKINGS,
    SET_BOOKING_ACTIVE,
} from '../types/action.account';
import {
    checkOutSuccess,
    accountFailed,
    getProfileSuccess,
    checkInSuccess,
    verifyPhoneNumberSuccess,
    verifyPinSuccess,
    loginSuccess,
    onAuthStateChangedSuccess,
    lateCheckOutSuccess,
    getProfile,
    getTransactionHistorySuccess,
    quickCheckOutSuccess,
    quickCheckOut,
    transactionHistoryPaymentt,
    userLoginSuccess,
    userGoogleLoginSuccess,
    forgotPasswordSuccess,
    updatePasswordRequest,
    updatePasswordSuccess,
    updateProfile,
    getAddionalServices,
    getAdditionalServicesSuccess,
    AlreadyCheckInSuccess,
    updateCardDetails,
    getCardDetailSuccess,
    sendVerificationLink,
    getCurrentBookingsSuccess,
    getCurrentBookings,
    swtichBookingReference,
} from '../actions/action.account';
import { restoBookATableSuccess } from '../actions/action.restaurant';
import {
    handleError,
    IRulesFormValidation,
    handleFormValidation,
    toast,
    validateEmail,
} from '../utils/handleLogic';
import {
    ME,
    BOOKING,
    LOGIN_CUSTOMER,
    LATE_CHECKOUT,
    USER_CHECKOUT,
    GET_TRANSACTION_HISTORY_API,
    QUICK_CHECKOUT_API,
    BILLS_API,
    TRANSACTION_HISTORY_PAYMENT_API,
    SIGNUP,
    GOOGLELOGIN,
    FORGOTPASSWORD,
    UPDATEPASSWORD,
    UPDATE_PROFILE_API,
    GET_ADDITIONAL_SERVICES_API,
    GET_CARD_DETAILS,
    UPDATE_CARD_DETAILS_API,
    FIND_BOOKING_API,
    SEND_VERIFICATION_LINK_API,
    SWITCH_REFERNCES_API,
    SET_BOOKING_ACTIVE_API,
} from '../constants/api';
import { AxiosResponse, AxiosError } from 'axios';
import { forEach, isArray } from 'lodash';
import { isAfter } from 'date-fns';
import { connectSendBird, disconnectSendBird } from '../actions/action.chat';
import { Alert, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { pickHotel, mainmenu } from '../utils/navigationControl';
import { IForgotPassword, IUpdatePassword } from '../types/account';
import { format } from 'date-fns';
import { printUrl } from '../utils/formating';
import { clearWakeUp, getwakeupCall } from '../actions/action.conciergeService';
import { getHotelTaxes } from '../actions/action.hotelTaxes';
import { getChainData } from '../actions/action.chainData';

const handleBackButton = () => {
    Alert.alert(
        'Are you sure',
        'You want to close the application?',
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => BackHandler.exitApp(),
            },
        ],
        {
            cancelable: false,
        },
    );
    return true;
};

const handleFindBooking = createLogic({
    type: FIND_BOOKING,
    process({ httpClient, action, getState }: IDependencies<ReturnType<TFindBooking>>, dispatch, done) {
        // transform to form data
        const data = new FormData();
        data.append('hotel_id', action.payload.data.hotel_id);
        data.append('reference', action.payload.data.reference);
        httpClient
            .post(FIND_BOOKING_API, data, {
                timeout: 1000 * 5,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                },
            })
            .then((response: AxiosResponse<any>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'signup ==============================');
                return response;
            })
            .then((response) => {
                console.log(response);
                if (response?.data?.status) {
                    if (action.payload.onSuccess) {
                        action.payload.onSuccess(response);
                    }
                } else {
                    if (action.payload.onFailed) {
                        action.payload.onFailed(response);
                    }
                }
            })
            .catch((error) => {
                toast('message', getState().language.error);
            })
            .then(() => done());
    },
});

const signUpLogic = createLogic({
    type: SIGN_UP,
    validate({ action, getState }: IDependencies<ReturnType<TVerifyPin>>, allow, reject) {
        const rules: IRulesFormValidation[] = [
            {
                isValid: validateEmail(action.payload.data.email),
                message: getState().language.please_enter_correct_email,
            },
            {
                isValid: action.payload.data.password.length > 6,
                message: getState().language.password_should_be_greater_than_6,
            },
            {
                isValid: action.payload.data.full_name.length != 0,
                message: getState().language.full_name_can_not_be_empty,
            },
        ];

        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message, getState().language.attention);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(accountFailed(rule.message, action.type));
            },
        );
    },
    process({ httpClient, action, getState }: IDependencies<ReturnType<TSignUp>>, dispatch, done) {
        // transform to form data
        const data = new FormData();
        data.append('full_name', action.payload.data.full_name);
        data.append('email', action.payload.data.email);
        data.append('password', action.payload.data.password);
        // send it
        console.log(SIGNUP);
        console.log(data);
        console.log(action);
        httpClient
            .post(SIGNUP, data, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                },
            })

            .then((response: AxiosResponse<ISuccessSignUp>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'signup ==============================');
                return response;
            })
            .then((response) => {
                console.log(response);
                if (action.payload.onSuccess) {
                    toast(getState().language.signup_succesfully, getState().language.info);
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                if (error.response) {
                    handleError({
                        error,
                        dispatch,
                        failedAction: accountFailed(error, action.type),
                        type: action.type,
                        onFailed: action.payload.onFailed,
                    });
                } else {
                    toast('Please check your network and then try again');
                    if (action.payload.onFailed) {
                        action.payload.onFailed();
                    }
                }
            })
            .then(() => done());
    },
});

const checkInLogic = createLogic({
    type: CHECK_IN,
    validate({ action, getState }: IDependencies<ReturnType<TCheckIn>>, allow, reject) {
        const {
            room_temperature,
            hotel_id,
            arrival_date,
            departure_date,
            reference,
            note_request,
            terms_and_condition,
            user_id,
            signature_photo,
            passport_photos,
        } = action.payload.data;
        // validation
        const rules: IRulesFormValidation[] = [
            {
                isValid: arrival_date !== '',
                message: getState().language.please_enter_the_arrival_date,
            },
            {
                isValid: departure_date !== '',
                message: getState().language.please_enter_the_departure_date,
            },
            {
                isValid: reference !== '' && reference !== null,
                message: getState().language.please_enter_the_booking_reference,
            },
            {
                isValid: signature_photo.name,
                message: getState().language.your_signature_is_required,
            },
            {
                isValid: terms_and_condition,
                message: getState().language.you_must_have_accept_terms_and_condition,
            },
        ];
        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message, getState().language.attention);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(accountFailed(rule.message, CHECK_IN));
            },
        );
    },
    process({ httpClient, action, getState }: IDependencies<ReturnType<TCheckIn>>, dispatch, done) {
        // transform to form data
        const formData = new FormData();
        // action.payload.data['additional_service_id'] = action.payload.data.additional_service_id;
        action.payload.data['arrival_date'] = format(
            `${action.payload.data.arrival_date}`,
            'YYYY-MM-DD HH:mm',
        );
        action.payload.data['departure_date'] = format(
            `${action.payload.data.departure_date}`,
            'YYYY-MM-DD HH:mm',
        );
        forEach(action.payload.data, (value, key) => {
            // un-comment this to skip card_number being send to server
            // if (<keyof typeof action.payload.data>key === 'card_number') {
            //     return false;
            // }

            if (isArray(value) && key !== 'additional_services') {
                value.forEach((photo) => {
                    if (!photo.uri.includes('https://') && !photo.uri.includes('http://')) {
                        formData.append(`${key}[]`, photo);
                        console.log('showing checkin data pic include' + value);
                    } else {
                        console.log('showing checkin data pic do not include' + value);
                    }
                });
            } else if (key === 'additional_services') {
                let ids = [];
                let qtys = [];
                value.forEach(async (additional_service: any) => {
                    ids.push(additional_service.service_id);
                    qtys.push(additional_service.qty);
                });
                console.log(ids.toString(), qtys.toString());
                formData.append('qtys', qtys.toString());
                formData.append('ids', ids.toString());
            }
            // else if (key == 'extra_bed_request') {
            //     console.log('showing checkin data' + value);
            //     formData.append(key, value ? '1' : '0');
            else {
                console.log('showing checkin data' + value + '   ' + key);
                formData.append(key, value);
            }
        });
        // send it
        // formData.append('room_temperature', 22);
        // formData.append('hotel_id', 1);
        // formData.append('arrival_date', '2021-10-13 20:10');
        // formData.append('departure_date', '2021-10-15 16:10');
        // formData.append('reference', 'laksksk');
        // formData.append('note_request', 'ogxkgx');
        // formData.append('terms_and_condition', true);
        // formData.append('additional_services', 189);
        // formData.append('passport_photos', 22);
        // formData.append('signature_photo', 22);
        // console.log(`Bearer ${getState().account.access_token}`)
        // console.log(formData)
        httpClient
            .post(BOOKING, formData, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                },
            })
            .then((response: AxiosResponse<ISuccessCheckIn>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'checkin ==============================');
                return response.data;
            })
            .then((response) => {
                console.log(response);
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                if (Platform.OS == 'ios') {
                    Alert.alert(
                        getState().language.please_try_again_and_contact_your_hotel,
                        error?.response?.data?.message,
                    );
                } else toast(error?.response?.data?.message);

                console.log(error);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
            })
            .then(() => done());
    },
});

const sendVerificationLinkLogic = createLogic({
    type: SEND_VERIFICATION_LINK,
    process({ httpClient, action, getState }: IDependencies<ReturnType<TCheckIn>>, dispatch, done) {
        // transform to form data
        const { email } = action.payload.data;
        const formData = new FormData();

        formData.append('email', email);

        console.log('requesting the call', email);

        httpClient
            .post(SEND_VERIFICATION_LINK_API, formData, {
                timeout: 2000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                },
            })
            .then((response: AxiosResponse<any>) => {
                console.log(response.data);
                return response.data;
            })
            .then((response) => {
                Alert.alert('Success', response?.message);
            })
            .catch((error) => {
                console.log(error);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
            })
            .then(() => done());
    },
});

const goBackToHomeLogic = createLogic({
    type: GO_BACK_TO_HOME,

    process({ httpClient, action, getState }: IDependencies<ReturnType<TGoBackToHome>>, dispatch, done) {
        console.log(BackHandler);
        if (action.payload.value) {
            console.log('treeeeeeueeeeeeeee');
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        } else {
            console.log('faaaaalseeeeeeeeeeee');
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
        done();
    },
});

const quickCheckOutLogic = createLogic({
    type: QUICK_CHECK_OUT,
    validate({ action, getState }: IDependencies<ReturnType<TCheckIn>>, allow, reject) {
        const { number, name, type, exp, amount } = action.payload.type;
        var rules: IRulesFormValidation[] = [];
        console.log('QUICKECHECHOUT', type);

        if (type == 'stripe') {
            // validation
            rules = [
                {
                    isValid: name !== '',
                    message: getState().language.please_enter_the_valid_name_on_card,
                },
                {
                    isValid: number !== '',
                    message: getState().language.please_enter_the_valid_card_number,
                },
                {
                    isValid: exp !== '',
                    message: getState().language.please_enter_the_valid_exp_date,
                },
            ];
        } else {
            rules = [];
        }

        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message, getState().language.attention);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(accountFailed(rule.message, CHECK_IN));
            },
        );
    },
    process(
        { action, httpClient, getState }: IDependencies<ReturnType<typeof quickCheckOut>>,
        dispatch,
        done,
    ) {
        const { number, name, type, exp, amount } = action.payload.type;

        // if (getState().hotel.type == 'resto') {
        //     card_number = action.payload.type.number;
        //     cardholder_name = action.payload.type.name;
        //     card_expiry_date = action.payload.type.exp;
        //     type = action.payload.type.type;
        // } else {
        //     card_number = getState().account.profile.card_number;
        //     card_expiry_date = getState().account.profile.card_expiry_date;
        //     cardholder_name = getState().account.profile.cardholder_name;
        //     type = action.payload.type.type;
        // }
        const { currency } = getState().hotel;
        //  console.log(card_number,cardholder_name,card_expiry_date,type);
        const form = new FormData();
        form.append('card_number', number),
            form.append('exp_month', exp?.split('/')[0]),
            form.append('exp_year', exp?.split('/')[1]),
            form.append('name', name);
        form.append('currency', currency);
        form.append('type', type);
        form.append('amount', amount);
        form.append('hotel_code', getState().hotel.code);
        console.log(form);
        httpClient
            .post(QUICK_CHECKOUT_API, form, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<any>) => {
                if (__DEV__) {
                    console.log(`${action.type}: `, response);
                    console.log(`RESPONSEE`, response);
                }
                return response.data;
            })
            .then(async () => {
                // dispatch(restoBookATableSuccess({}));
                // if(getState().hotel.type == 'hotel'){

                // }
                // if(getState().hotel.type == 'resto'){
                // await Navigation.setRoot({ root: pickHotel });
                // dispatch(quickCheckOutSuccess());
                // }
                // await Navigation.setRoot({ root: mainmenu });
                // if (action.payload.type == 'cash')
                //     Alert.alert('Pay by cash', 'Please proceed to the counter to pay bills');
                // else Alert.alert('Paid by credit card', 'Thank you for using our service.');
                dispatch(quickCheckOutSuccess());
                dispatch(clearWakeUp());
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const updateProfileLogic = createLogic({
    type: UPDATE_PROFILE,

    process(
        { action, httpClient, getState }: IDependencies<ReturnType<typeof updateProfile>>,
        dispatch,
        done,
    ) {
        const form = new FormData();
        form.append('full_name', action.payload.data.full_name),
            form.append('profile_image', action.payload.data.profile_image),
            form.append('phone_number', action.payload.data.phone_number),
            form.append('old_password', action.payload.data.old_password),
            form.append('new_password', action.payload.data.new_password),
            form.append('address_line_1', action.payload.data.address_line_1),
            form.append('address_line_2', action.payload.data.address_line_2),
            form.append('address_type', action.payload.data.address_type),
            form.append('city', action.payload.data.city),
            form.append('state', action.payload.data.state),
            form.append('postal_code', action.payload.data.postal_code),
            form.append('country_code', action.payload.data.country_code),
            console.log(form, getState().account.access_token);
        httpClient
            .post(UPDATE_PROFILE_API, form, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: any) => {
                console.log('response of update profile is here', response);
                return response.data;
            })
            .then((res: any) => {
                console.log(res);
                dispatch(
                    getProfile(
                        getState().account.access_token,
                        getState().hotel.code,
                        () => {
                            // toast(getState().language.profile_updated, getState().language.information);
                            console.log('profile data got successfully');
                        },
                        () => {
                            console.log('Profile data get failed');
                        },
                    ),
                );
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                // handleError({
                //     error,
                //     dispatch,
                //     failedAction: () => {},
                //     type: action.type,
                //     onFailed: action.payload.onFailed,
                // });
                console.log(error.response);
                toast(error.response.data.message);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
            })
            .then(() => done());
    },
});

const bills = createLogic({
    type: BILLS,

    process({ action, httpClient, getState }: IDependencies<ReturnType<any>>, dispatch, done) {
        httpClient
            .get(BILLS_API, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<any>) => {
                if (__DEV__) {
                    console.log(`${action.type}: `, response);
                }
                return response.data;
            })
            .then((response) => {
                // dispatch(quickCheckOutSuccess());
                console.log('Hi Haider', response);
                // dispatch(getProfile(action.payload.onSuccess, action.payload.onFailed));
                dispatch(action.payload.onSuccess(response));
            })
            .catch((error) => {
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const checkOutLogic = createLogic({
    type: CHECK_OUT,
    validate({ action, getState }: IDependencies<ReturnType<TCheckOut>>, allow, reject) {
        if (!getState().account.isCheckedIn) {
            return reject(accountFailed('already checkout', action.type));
        }

        return allow(action);
    },
    async process({ action, getState }: IDependencies<ReturnType<TCheckOut>>, dispatch, done) {
        // await Navigation.setRoot({ root: pickHotel });

        if (action.payload.onSuccess) {
            action.payload.onSuccess();
        }
        // Alert.alert("isChecked", getState().account.isCheckedOut)
        if (getState().account.isCheckedOut == false) {
            Alert.alert(
                getState().language.attention,
                getState().language.you_have_checkout_thank_you_for_using_our_service_have_a_nice_day,
            );
        }
        dispatch(checkOutSuccess());

        done();
    },
});

// const checkOutLogic = createLogic({
//     type: CHECK_OUT,
//     validate({ action, getState }: IDependencies<ReturnType<TCheckOut>>, allow, reject) {
//         console.log('herererererere');
//         if (!getState().account.isCheckedIn) {
//             return reject(accountFailed('already checkout', action.type));
//         }

//         return allow(action);
//     },
//     async process({ action, httpClient, getState }: IDependencies<ReturnType<TCheckOut>>, dispatch, done) {
//         httpClient
//             .post(
//                 USER_CHECKOUT,
//                 {},
//                 {
//                     headers: {
//                         Accept: 'application/json',
//                         Authorization: `Bearer ${getState().account.access_token}`,
//                         // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
//                     },
//                 },
//             )
//             .then((response: AxiosResponse<any>) => {
//                 // if (__DEV__) {
//                 //     console.log(`${action.type}: `, response);
//                 // }
//                 console.log(response, 'checkout');
//                 return response.data;
//             })
//             .then(() => {
//                 dispatch(checkOutSuccess());
//                 Navigation.setRoot({ root: pickHotel });

//                 if (action.payload.onSuccess) {
//                     action.payload.onSuccess();
//                 }

//                 Alert.alert(
//                     'Attention',
//                     'You already checkout. Thank you for using our service, Have a nice day.',
//                 );
//             })
//             .catch((error) => {
//                 console.log(error.response, 'checkout');
//                 handleError({
//                     error,
//                     dispatch,
//                     failedAction: accountFailed(error, action.type),
//                     type: action.type,
//                     onFailed: action.payload.onFailed,
//                 });
//             })
//             .then(() => done());
//     },
// });

const lateCheckOutLogic = createLogic({
    type: LATE_CHECK_OUT,
    process({ action, httpClient, getState }: IDependencies<ReturnType<TLateCheckOut>>, dispatch, done) {
        let data = new FormData();
        data.append('late_checkout_date_time', action.payload.data.late_checkout_date_time);
        data.append('late_checkout_note', action.payload.data.late_checkout_note);
        data.append('hotel_code', getState().hotel.code);
        httpClient
            .post(LATE_CHECKOUT, data, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<any>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'late check out');
                return response.data;
            })
            .then(() => {
                // dispatch(lateCheckOutSuccess());
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
                // dispatch(
                //     getProfile(
                //         getState().account.access_token,
                //         action.payload.onSuccess,
                //         action.payload.onFailed,
                //     ),
                // );
            })
            .catch((error) => {
                console.log(error.response, 'late check out failed');
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const getProfileLogic = createLogic({
    type: GET_PROFILE,
    process({ httpClient, action, getState }: IDependencies<ReturnType<TGetProfile>>, dispatch, done) {
        httpClient
            .get(printUrl(ME, action.payload.hotel_code), {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${action.payload.token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetMe>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get profile');
                return response.data;
            })
            .then((response) => {
                if (response.message == 'Token is Expired.') {
                    checkOutSuccess();
                    Navigation.setRoot({ root: pickHotel });
                } else {
                    console.log(response, 'get profile');
                    dispatch(
                        getProfileSuccess(
                            action.payload.token,
                            response.data.user,
                            response.data.hotel_detail,
                            response.data.booking_token,
                        ),
                    );
                    const logo = {
                        hotel_logo_lg: response.data.hotel_detail?.data.hotel_logo_lg,
                        hotel_logo_md: response.data.hotel_detail?.data.hotel_logo_md,
                        hotel_logo_sm: response.data.hotel_detail?.data.hotel_logo_sm,
                    };
                    dispatch(
                        getHotelDetailSuccess(
                            response.data.hotel_detail?.data.id,
                            response.data.hotel_detail?.data.code,
                            response.data.hotel_detail?.data.description,
                            response.data.hotel_detail?.data.name,
                            logo,
                            response.data.hotel_detail?.data.layout.theme,
                            response.data.hotel_detail?.data.layout.icons,
                            response.data.hotel_detail?.data.hotel_features,
                            response.data.hotel_detail?.data.category,
                            response.data.hotel_detail?.data.currency,
                            response.data.hotel_detail?.data.mobile_hotel_layout_id,
                            response.data.hotel_detail?.data.mobile_hotel_layouts,
                            response.data.hotel_detail?.data.dynamic_buttons,
                            response.data.hotel_detail?.data.type,
                        ),
                    );
                    dispatch(getHotelTaxes(response.data.hotel_detail?.data.id));
                    dispatch(getCurrentBookings());
                    if (action.payload.onSuccess) {
                        action.payload.onSuccess();
                    }
                }
            })
            .catch((error: AxiosError) => {
                console.log(error.response, 'get profile');
                handleError({
                    error,
                    dispatch,
                    failedAction: () => {},
                    type: action.type,
                    onFailed: action.payload.onFailed,
                    displayMessage: action.payload.onFailed !== undefined,
                });
            })
            .then(() => done());
    },
});

const getCurrentBookingsLogic = createLogic({
    type: GET_CURRENT_BOOKINGS,
    process({ httpClient, action, getState }: IDependencies<ReturnType<any>>, dispatch, done) {
        httpClient
            .get(SWITCH_REFERNCES_API, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetMe>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'showing the refernces for switching');
                return response.data;
            })
            .then((response) => {
                console.log('showing the refernces', response);
                dispatch(getCurrentBookingsSuccess(response.booking));
            })
            .catch((error: AxiosError) => {
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
            })
            .then(() => done());
    },
});

const verifyPhoneLogic = createLogic({
    type: VERIFY_PHONE_NUMBER,
    validate({ action, getState }: IDependencies<ReturnType<TVerifyPhoneNumber>>, allow, reject) {
        const rules: IRulesFormValidation[] = [
            {
                isValid: action.payload.phoneNumber !== '',
                message: getState().language.please_enter_the_phone_number,
            },
        ];

        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message, getState().language.attention);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(accountFailed(rule.message, action.type));
            },
        );
    },
    process({ action, firebase }: IDependencies<ReturnType<TVerifyPhoneNumber>>, dispatch, done) {
        firebase
            .auth()
            .signInWithPhoneNumber(action.payload.phoneNumber)
            .then((confirmationResult) => {
                dispatch(verifyPhoneNumberSuccess(confirmationResult));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess(confirmationResult);
                }
            })
            .catch((error) => {
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const getAdditionalServicesLogic = createLogic({
    type: GET_ADDITIONAL_SERVICES,
    process(
        { httpClient, action, getState }: IDependencies<ReturnType<TGetAdditionalServices>>,
        dispatch,
        done,
    ) {
        httpClient
            .get(printUrl(GET_ADDITIONAL_SERVICES_API, getState().hotel.id.toString()), {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${action.payload.token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: any) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get AdditionalServices');
                return response.data;
            })
            .then((response) => {
                console.log(response);
                if (response.message == 'Token is Expired.') {
                    checkOutSuccess();
                    Navigation.setRoot({ root: pickHotel });
                } else {
                    console.log(response, 'get profile');

                    dispatch(getAdditionalServicesSuccess(response.additional_services));

                    if (action.payload.onSuccess) {
                        action.payload.onSuccess();
                    }
                }
            })
            .catch((error: AxiosError) => {
                console.log(error.response, 'get details');
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, GET_PROFILE),
                    type: GET_PROFILE,
                    onFailed: action.payload.onFailed,
                    displayMessage: action.payload.onFailed !== undefined,
                });
            })
            .then(() => done());
    },
});
const verifyPinLogic = createLogic({
    type: VERIFY_PIN,
    validate({ action, getState }: IDependencies<ReturnType<TVerifyPin>>, allow, reject) {
        const rules: IRulesFormValidation[] = [
            {
                isValid: action.payload.pin !== '',
                message: getState().language.pin_is_required,
            },
            {
                isValid: action.payload.pin.length === 6,
                message: getState().language.pin_must_be_6_digit,
            },
            {
                isValid: /[0-9]/gi.test(action.payload.pin),
                message: getState().language.pin_must_be_numeric,
            },
            {
                isValid: getState().account.confirmationResult !== null,
                message: getState().language.something_went_wrong,
            },
        ];

        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message, getState().language.attention);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(accountFailed(rule.message, action.type));
            },
        );
    },
    process({ getState, action }: IDependencies<ReturnType<TVerifyPin>>, dispatch, done) {
        const { confirmationResult } = getState().account;

        if (confirmationResult) {
            confirmationResult
                .confirm(action.payload.pin)
                .then((userResult) => {
                    if (userResult) {
                        return userResult.getIdToken();
                    }

                    return '';
                })
                .then((token) => {
                    if (token !== '') {
                        dispatch(verifyPinSuccess());

                        if (action.payload.onSuccess) {
                            action.payload.onSuccess(token);
                        }

                        return true;
                    }

                    if (action.payload.onFailed) {
                        action.payload.onFailed();
                    }
                })
                .catch((error) => {
                    handleError({
                        error,
                        dispatch,
                        failedAction: accountFailed(error, action.type),
                        type: action.type,
                        onFailed: action.payload.onFailed,
                    });
                })
                .then(() => done());
        }
    },
});

const userLogin = createLogic({
    type: USER_LOGIN,
    validate({ action, getState }: IDependencies<ReturnType<TVerifyPin>>, allow, reject) {
        const rules: IRulesFormValidation[] = [
            {
                isValid: validateEmail(action.payload.data.email),
                message: getState().language.please_enter_correct_email,
            },
            {
                isValid: action.payload.data.password.length >= 6,
                message: getState().language.password_should_be_greater_than_or_equal_to_6,
            },
            {
                isValid: action.payload.data.hotel_code.length != 0,
                message: getState().language.hotel_code_can_not_be_empty,
            },
        ];

        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message, getState().language.attention);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(accountFailed(rule.message, action.type));
            },
        );
    },
    process({ httpClient, action, getState }: IDependencies<ReturnType<TUserLogIn>>, dispatch, done) {
        let data = new FormData();
        data.append('email', action.payload.data.email);
        data.append('password', action.payload.data.password);
        data.append('hotel_code', action.payload.data.hotel_code);
        httpClient({
            method: 'post',
            url: LOGIN_CUSTOMER,
            data: data,
            timeout: 20000,
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response: AxiosResponse<ISuccessUserLogIn>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, { response });
                // }
                console.log(response, 'login');
                return response;
            })
            .then(({ data }) => {
                console.log('is verified', data);

                // console.log(data.data.user);
                // dispatch(loginSuccess(data.token, data));
                if (data.data.booking_token === null) dispatch(userLoginSuccess(data.data.token, data.data));
                else dispatch(AlreadyCheckInSuccess(data.data));
                // id : data.data.user.hotel_detail?.data.id,
                // code : data.data.user.hotel_detail?.data.code,
                // description : data.data.user.hotel_detail?.data.description,
                // name : data.data.user.hotel_detail?.data.name,
                // logo : data.data.user.hotel_detail?.data.logo,
                // layout.theme data.data.user.hotel_detail?.data.theme,
                // layout.icons : data.data.user.hotel_detail?.data.icons,
                // hotel_features,
                // category,
                // currency,
                // mobile_hotel_layout_id,
                // mobile_hotel_layouts,
                // dynamic_buttons,
                // type,
                const logo = {
                    hotel_logo_lg: data.data.hotel_detail?.data.hotel_logo_lg,
                    hotel_logo_md: data.data.hotel_detail?.data.hotel_logo_md,
                    hotel_logo_sm: data.data.hotel_detail?.data.hotel_logo_sm,
                };
                dispatch(
                    getHotelDetailSuccess(
                        data.data.hotel_detail?.data.id,
                        data.data.hotel_detail?.data.code,
                        data.data.hotel_detail?.data.description,
                        data.data.hotel_detail?.data.name,
                        logo,
                        data.data.hotel_detail?.data.layout.theme,
                        data.data.hotel_detail?.data.layout.icons,
                        data.data.hotel_detail?.data.hotel_features,
                        data.data.hotel_detail?.data.category,
                        data.data.hotel_detail?.data.currency,
                        data.data.hotel_detail?.data.mobile_hotel_layout_id,
                        data.data.hotel_detail?.data.mobile_hotel_layouts,
                        data.data.hotel_detail?.data.dynamic_buttons,
                        data.data.hotel_detail?.data.type,
                    ),
                );
                dispatch(getHotelTaxes(data.data.hotel_detail?.data.id));
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
                console.log('dataaaaaaaaaaaaaaaaaaaaa', data);
            })
            .catch((error) => {
                console.log(error.response ? error.response : 'Network problem', 'user login');
                if (error.response?.data?.is_verified == 0) {
                    if (action.payload.onFailed) {
                        action.payload.onFailed('');
                    }
                    Alert.alert(
                        'Verification Alert',
                        'Please Verify your email first. To resend the email for verification please click on "Resend',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => {},
                                style: 'cancel',
                            },
                            {
                                text: 'Resend',
                                onPress: () => {
                                    console.log('dispatching the email again', error?.response?.data?.email);
                                    if (action.payload.onFailed) {
                                        action.payload.onFailed(error.response.data);
                                    }
                                },
                            },
                        ],
                    );
                } else {
                    if (error.response) {
                        handleError({
                            error,
                            dispatch,
                            failedAction: accountFailed(error, action.type),
                            type: action.type,
                            onFailed: action.payload.onFailed,
                        });
                    } else {
                        toast(getState().language.please_check_your_network_and_try_again);
                        if (action.payload.onFailed) {
                            action.payload.onFailed(error.response.data);
                        }
                    }
                }
            })
            .then(() => done());
    },
});

const userforgotPassword = createLogic({
    type: FORGOT_PASSWORD,
    process({ httpClient, action }: IDependencies<ReturnType<TForgotPasswordRequest>>, dispatch, done) {
        let data = new FormData();
        data.append('email', action.payload.data.email);
        console.log(data);
        httpClient
            .post(FORGOTPASSWORD, data, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                },
            })
            .then((response: AxiosResponse<IForgotPassword>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, { response });
                // }
                console.log(response, 'forgotPassword');
                return response;
            })
            .then(({ data }) => {
                // dispatch(userGoogleLoginSuccess(data.data.token, data.data));
                dispatch(forgotPasswordSuccess(data.message, data.code));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
                console.log('dataaaaaaaaaaaaaaaaaaaaa', data);
            })
            .catch((error) => {
                console.log(error, 'user login');
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const userUpdatePassword = createLogic({
    type: UPDATE_PASSWORD,
    process({ httpClient, action }: IDependencies<ReturnType<TUpdatePasswordRequest>>, dispatch, done) {
        let data = new FormData();
        data.append('email', action.payload.data.email);
        data.append('password', action.payload.data.password);
        console.log(data);
        httpClient
            .post(UPDATEPASSWORD, data, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                },
            })
            .then((response: AxiosResponse<IUpdatePassword>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, { response });
                // }
                console.log(response, 'forgotPassword');
                return response;
            })
            .then(({ data }) => {
                // dispatch(userGoogleLoginSuccess(data.data.token, data.data));
                // dispatch(updatePasswordSuccess(data.message));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
                console.log('dataaaaaaaaaaaaaaaaaaaaa', data);
            })
            .catch((error) => {
                console.log(error, 'user login');
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const userGoogleLoginLogic = createLogic({
    type: GOOGLE_LOGIN,
    process({ httpClient, action }: IDependencies<ReturnType<TUserGoogleLogIn>>, dispatch, done) {
        let data = new FormData();
        data.append('full_name', action.payload.data.full_name);
        data.append('profile_image', action.payload.data.profile_image);
        data.append('email', action.payload.data.email);
        data.append('hotel_code', action.payload.data.hotel_code);
        console.log(data);
        httpClient
            .post(GOOGLELOGIN, data, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                },
            })
            .then((response: AxiosResponse<ISuccessUserLogIn>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, { response });
                // }
                console.log(response.data.data, 'login');
                return response;
            })
            .then(({ data }) => {
                // if (data.data.booking_token === null) dispatch(userLoginSuccess(data.data.token, data.data));
                // else dispatch(AlreadyCheckInSuccess(data.data));

                if (data.data.booking_token === null)
                    dispatch(userGoogleLoginSuccess(data.data.token, data.data));
                else dispatch(AlreadyCheckInSuccess(data.data));
                // dispatch(userLoginSuccess(data.token, data));
                const logo = {
                    hotel_logo_lg: data.data.hotel_detail?.data.hotel_logo_lg,
                    hotel_logo_md: data.data.hotel_detail?.data.hotel_logo_md,
                    hotel_logo_sm: data.data.hotel_detail?.data.hotel_logo_sm,
                };
                dispatch(
                    getHotelDetailSuccess(
                        data.data.hotel_detail?.data.id,
                        data.data.hotel_detail?.data.code,
                        data.data.hotel_detail?.data.description,
                        data.data.hotel_detail?.data.name,
                        logo,
                        data.data.hotel_detail?.data.layout.theme,
                        data.data.hotel_detail?.data.layout.icons,
                        data.data.hotel_detail?.data.hotel_features,
                        data.data.hotel_detail?.data.category,
                        data.data.hotel_detail?.data.currency,
                        data.data.hotel_detail?.data.mobile_hotel_layout_id,
                        data.data.hotel_detail?.data.mobile_hotel_layouts,
                        data.data.hotel_detail?.data.dynamic_buttons,
                        data.data.hotel_detail?.data.type,
                    ),
                );
                dispatch(getHotelTaxes(data.data.hotel_detail?.data.id));
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
                console.log('dataaaaaaaaaaaaaaaaaaaaa', data);
            })
            .catch((error) => {
                console.log(error, 'user login');
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const loginLogic = createLogic({
    type: LOGIN,
    process({ httpClient, action }: IDependencies<ReturnType<TLogin>>, dispatch, done) {
        httpClient
            .post(
                LOGIN_CUSTOMER,
                { token: action.payload.token },
                {
                    timeout: 20000,
                    headers: {
                        Accept: 'application/json',
                    },
                },
            )
            .then((response: AxiosResponse<ISuccessLogin>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, { response });
                // }
                console.log(response, 'login');
                return response.data;
            })
            .then(({ data }) => {
                // if (true) {
                //     Alert.alert('Verification Error', 'Please Verify your email first. To resend the email for verification please click on "Resend', [
                //         {
                //             text: 'Cancel',
                //             onPress: () => {

                //             },
                //             style: 'cancel',
                //         },
                //         {
                //             text: 'Resend',
                //             onPress: () => {
                //                 dispatch(sendVerificationLink({ email: response?.data?.email }))
                //             }
                //         },
                //     ]);
                // }

                if (action.payload.onSuccess) {
                    action.payload.onSuccess(data.token, data.booking);
                }
            })
            .catch((error) => {
                console.log(error.response, 'login');
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const onAuthStateChangedLogic = createLogic({
    type: ON_AUTH_STATE_CHANGED,
    cancelType: [REMOVE_ON_AUTH_STATE_CHANGED, ON_AUTH_STATE_CHANGED_SUCCESS],
    warnTimeout: 0,
    process(
        { cancelled$, firebase, action }: IDependencies<ReturnType<TOnAuthStateChanged>>,
        dispatch,
        done,
    ) {
        const onAuthFirebase = firebase.auth().onAuthStateChanged((authSnapshot) => {
            if (authSnapshot) {
                authSnapshot
                    .getIdToken()
                    .then((token) => {
                        if (action.payload.onCallback) {
                            action.payload.onCallback(token);
                        }

                        dispatch(onAuthStateChangedSuccess());
                    })
                    .catch((error) => {
                        handleError({
                            error,
                            dispatch,
                            failedAction: accountFailed(error, action.type),
                            type: action.type,
                            displayMessage: false,
                        });
                    });
            }
        });

        // cancelation
        cancelled$.subscribe(() => {
            onAuthFirebase();
            done();
        });
    },
});

const getTransactionHistoryLogic = createLogic({
    type: GET_TRANSACTION_HISTORY,
    process(
        { httpClient, action, getState }: IDependencies<ReturnType<TgetTransactionHistory>>,
        dispatch,
        done,
    ) {
        httpClient
            .get(GET_TRANSACTION_HISTORY_API, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response) => {
                // if (__DEV__) {
                console.log(`get transaction history`, response);
                // }
                return response.data;
            })
            .then((response) => {
                dispatch(getTransactionHistorySuccess(response));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error: AxiosError) => {
                console.log(error.response, 'get transaction error');
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, GET_TRANSACTION_HISTORY),
                    type: GET_TRANSACTION_HISTORY,
                    onFailed: action.payload.onFailed,
                    displayMessage: action.payload.onFailed !== undefined,
                });
            })
            .then(() => done());
    },
});

const transactionHistoryPayment = createLogic({
    type: TRANSACTION_HISTORY_PAYMENT,

    process(
        { action, httpClient, getState }: IDependencies<ReturnType<typeof transactionHistoryPaymentt>>,
        dispatch,
        done,
    ) {
        var card_number,
            cardholder_name,
            card_expiry_date,
            type,
            service_id,
            service_type,
            amount = '';

        // if (getState().hotel.type == 'resto') {
        //     card_number = action.payload.type.number;
        //     cardholder_name = action.payload.type.name;
        //     card_expiry_date = action.payload.type.exp;
        //     type = action.payload.type.type;
        // } else {
        card_number = getState().account.profile.card_number;
        card_expiry_date = getState().account.profile.card_expiry_date;
        cardholder_name = getState().account.profile.cardholder_name;
        type = action.payload.type.type;
        service_id = action.payload.type.service_id;
        service_type = action.payload.type.service_type;
        amount = action.payload.type.amount;
        // }
        const { currency } = getState().hotel;
        //  console.log(card_number,cardholder_name,card_expiry_date,type);
        const form = new FormData();
        form.append('card_number', card_number),
            form.append('exp_month', card_expiry_date?.split('/')[0]),
            form.append('exp_year', card_expiry_date?.split('/')[1]),
            form.append('name', cardholder_name);
        form.append('currency', currency);
        form.append('amount', amount);
        form.append('type', type);
        form.append('service_type', service_type);
        form.append('service_id', service_id);

        console.log('here we are getting the transaction payment form', form);

        httpClient
            .post(TRANSACTION_HISTORY_PAYMENT_API, form, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<any>) => {
                if (__DEV__) {
                    console.log(`${action.type}: `, response);
                }
                return response.data;
            })
            .then(async () => {
                if (action.payload.onSuccess) action.payload.onSuccess();
            })
            .catch((error) => {
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const getCardDetailsLogic = createLogic({
    type: CARD_DETAILS,

    process({ action, httpClient, getState }: IDependencies<ReturnType<any>>, dispatch, done) {
        httpClient
            .get(GET_CARD_DETAILS, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<any>) => {
                if (__DEV__) {
                    console.log(`${action.type}: `, response);
                }
                return response.data;
            })
            .then((response) => {
                // dispatch(quickCheckOutSuccess());
                console.log('Hi Haider', response);
                // dispatch(getProfile(action.payload.onSuccess, action.payload.onFailed));
                dispatch(getCardDetailSuccess(response));
                if (action.payload.onSuccess) {
                    action.payload.onSuccess(response);
                }
            })
            .catch((error) => {
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const updateCardDetailsLogic = createLogic({
    type: UPDATE_CARD_DETAILS,

    process(
        { action, httpClient, getState }: IDependencies<ReturnType<typeof updateCardDetails>>,
        dispatch,
        done,
    ) {
        //  console.log(card_number,cardholder_name,card_expiry_date,type);
        const form = new FormData();
        form.append('card_number', action.payload.data.card_number),
            form.append('cardholder_name', action.payload.data.cardholder_name),
            form.append('card_expiry_month', action.payload.data.card_expiry_month),
            form.append('card_cvv_number', action.payload.data.card_cvv_number),
            form.append('card_description', action.payload.data.card_description),
            form.append('card_address', action.payload.data.card_address);

        console.log('here we are getting the transaction payment form', form);

        httpClient
            .post(UPDATE_CARD_DETAILS_API, form, {
                timeout: 20000,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<any>) => {
                if (__DEV__) {
                    console.log(`${action.type}: `, response);
                }
                return response;
            })
            .then(async (res) => {
                if (action.payload.onSuccess) {
                    action.payload.onSuccess(res);
                }
            })
            .catch((error) => {
                handleError({
                    error,
                    dispatch,
                    failedAction: accountFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const setBookingActiveLogic = createLogic({
    type: SET_BOOKING_ACTIVE,

    process({ action, httpClient, getState }: IDependencies<ReturnType<any>>, dispatch, done) {
        //  console.log(card_number,cardholder_name,card_expiry_date,type);
        const form = new FormData();
        form.append('booking_id', action.payload.data),
            httpClient
                .post(SET_BOOKING_ACTIVE_API, form, {
                    timeout: 20000,
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${getState().account.access_token}`,
                        // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                    },
                })
                .then((response: AxiosResponse<any>) => {
                    if (__DEV__) {
                        console.log(`${action.type}: `, response);
                    }
                    return response;
                })
                .then(async (res) => {
                    if (action.payload.onSuccess) {
                        // dispatch(swtichBookingReference(res));
                        dispatch(getProfile(getState().account.access_token, res.data.code));
                        dispatch(getAddionalServices(getState().account.access_token));
                        action.payload.onSuccess();
                    }
                })
                .catch((error) => {
                    handleError({
                        error,
                        dispatch,
                        failedAction: accountFailed(error, action.type),
                        type: action.type,
                        onFailed: action.payload.onFailed,
                    });
                })
                .then(() => done());
    },
});

export default [
    signUpLogic,
    checkInLogic,
    checkOutLogic,
    lateCheckOutLogic,
    getProfileLogic,
    verifyPhoneLogic,
    verifyPinLogic,
    loginLogic,
    onAuthStateChangedLogic,
    getTransactionHistoryLogic,
    bills,
    quickCheckOutLogic,
    transactionHistoryPayment,
    userLogin,
    userGoogleLoginLogic,
    userforgotPassword,
    userUpdatePassword,
    updateProfileLogic,
    getAdditionalServicesLogic,
    getCardDetailsLogic,
    updateCardDetailsLogic,
    goBackToHomeLogic,
    handleFindBooking,
    sendVerificationLinkLogic,
    getCurrentBookingsLogic,
    setBookingActiveLogic,
];
