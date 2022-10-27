import { IError } from './responseApi';
import { IProfile, ITransaction, IUserData, IForgotPassword } from './account';
// import { RNFirebase } from 'react-native-firebase';
import { GET_CARD_DETAILS, LOGIN_CUSTOMER } from '../constants/api';

export const CHECK_IN = 'CHECK_IN';
export const CHECK_IN_SUCCESS = 'CHECK_IN_SUCCESS';
export const SEND_VERIFICATION_LINK = 'SEND_VERIFICATION_LINK';

export const ALREADY_CHECKED_IN_SUCCESS = 'ALREADY_CHECKED_IN_SUCCESS';

export const GET_ADDITIONAL_SERVICES = 'GET_ADDITIONAL_SERVICES';
export const GET_ADDITIONAL_SERVICES_SUCCESS = 'GET_ADDITIONAL_SERVICES_SUCCESS';

export const CHECK_OUT = 'CHECK_OUT';
export const CHECK_OUT_SUCCESS = 'CHECK_OUT_SUCCESS';

export const LATE_CHECK_OUT = 'LATE_CHECKOUT';
export const LATE_CHECK_OUT_SUCCESS = 'LATE_CHECKOUT_SUCCESS';

export const GET_PROFILE = 'GET_PROFILE';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';

export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const VERIFY_PHONE_NUMBER = 'VERIFY_PHONE_NUMBER';
export const VERIFY_PHONE_NUMBER_SUCCESS = 'VERIFY_PHONE_NUMBER_SUCCESS';

export const VERIFY_PIN = 'VERIFY_PIN';
export const VERIFY_PIN_SUCCESS = 'VERIFY_PIN_SUCCESS';

export const ON_AUTH_STATE_CHANGED = 'ON_AUTH_STATE_CHANGED';
export const ON_AUTH_STATE_CHANGED_SUCCESS = 'ON_AUTH_STATE_CHANGED_SUCCESS';
export const REMOVE_ON_AUTH_STATE_CHANGED = 'REMOVE_ON_AUTH_STATE_CHANGED';
export const USER_GOOGLE_LOGIN_SUCCESS = 'USER_GOOGLE_LOGIN_SUCCESS';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS';

export const SIGN_UP = 'SIGN_UP';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const GOOGLE_LOGIN = 'GOOGLE_LOGIN';

export const ACCOUNT_FAILED = 'ACCOUNT_FAILED';

export const USER_CHECK_OUT = 'USER_CHECK_OUT';
export const USER_CHECK_OUT_SUCCESS = 'USER_CHECK_OUT_SUCCESS';

export const GET_TRANSACTION_HISTORY = 'GET_TRANSACTION_HISTORY';
export const GET_TRANSACTION_HISTORY_SUCCESS = 'GET_TRANSACTION_HISTORY_SUCCESS';

export const BILLS = 'BILLS';

export const QUICK_CHECK_OUT = 'QUICK_CHECKOUT';
export const QUICK_CHECK_OUT_SUCCESS = 'QUICK_CHECKOUT_SUCCESS';

export const RESTO_BOOK_A_TABLE_ACCESS_TOKEN_SUCCESS = 'RESTO_BOOK_A_TABLE_ACCESS_TOKEN_SUCCESS';

export const TRANSACTION_HISTORY_PAYMENT = 'TRANSACTION_HISTORY_PAYMENT';

export const USER_LOGIN = 'USER_LOGIN';

export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';

export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
export const CARD_DETAILS = 'CARD_DETAILS';
export const UPDATE_CARD_DETAILS = 'UPDATE_CARD_DETAILS';
export const CARD_DETAILS_SUCCESS = 'CARD_DETAILS_SUCCESS';
export const GO_BACK_TO_HOME = 'GO_BACK_TO_HOME';
export const FIND_BOOKING = 'FIND_BOOKING';
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';
export const GET_CURRENT_BOOKINGS = 'GET_CURRENT_BOOKINGS';
export const GET_CURRENT_BOOKINGS_SUCCESS = 'GET_CURRENT_BOOKINGS_SUCCESS';
export const SET_BOOKING_ACTIVE = 'SET_BOOKING_ACTIVE';

export type TGoBackToHome<Val = boolean, K = () => void> = (
    value?: Val,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof GO_BACK_TO_HOME;
    payload: {
        value?: Val;
        onSuccess?: K;
        onFailed?: K;
    };
};

export interface ISignUpBody {
    full_name: string;
    email: string;
    password: string;
}

export type TSignUp<T = ISignUpBody, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof SIGN_UP;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export interface ILogInBody {
    email: string;
    password: string;
    hotel_code: string;
}

export interface ILateCheckOutBody {
    late_checkout_date_time: string;
    late_checkout_note: string;
}
export interface ISetBookingActiveBody {
    code: string;
}

export type TLateCheckOut<T = ILateCheckOutBody, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof LATE_CHECK_OUT;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TSetBookingActive<T = ISetBookingActiveBody, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof SET_BOOKING_ACTIVE;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};
export type TUserLogIn<T = ILogInBody, K = () => void, J = (val: any) => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: J,
) => {
    type: typeof USER_LOGIN;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: J;
    };
};

export type TUserLoginSuccess<T = string, K = IUserData> = (
    token: T,
    userData: K,
) => {
    type: typeof USER_LOGIN_SUCCESS;
    payload: {
        token: T;
        userData: K;
    };
};

export interface IGOOGLELogInBody {
    full_name: null | string;
    profile_image: null | string;
    email: string;
    hotel_code: any;
}

export type TUserGoogleLogIn<T = IGOOGLELogInBody, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof GOOGLE_LOGIN;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TUserGoogleLoginSuccess<T = string, K = IUserData> = (
    token: T,
    userData: K,
) => {
    type: typeof USER_GOOGLE_LOGIN_SUCCESS;
    payload: {
        token: T;
        userData: K;
    };
};

export interface IForgotPasswordBody {
    email: string;
}

export type TForgotPasswordRequest<T = IForgotPasswordBody, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof FORGOT_PASSWORD;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export interface IUpdatePasswordBody {
    password: string;
    email: string;
}

export type TUpdatePasswordRequest<T = IUpdatePasswordBody, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof UPDATE_PASSWORD;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TForgotPasswordSuccess<T = string, K = number> = (
    message: T,
    code: K,
) => {
    type: typeof FORGOT_PASSWORD_SUCCESS;
    payload: {
        message: T;
        code: K;
    };
};

export type TUpdatePasswordSuccess<T = string> = (message: T) => {
    type: typeof UPDATE_PASSWORD_SUCCESS;
    payload: {
        message: T;
    };
};

export interface IUpdateProfileBody {
    full_name: string;
    profile_image: object;
    phone_number: string;
    old_password: string;
    new_password: string;
}

export type TUpdateProfileRequest<T = IUpdateProfileBody, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof UPDATE_PROFILE;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export interface IPhoto {
    uri: string;
    name: string;
    type: 'image/jpeg';
}

export interface ICheckInBody {
    hotel_id: number;
    arrival_date: string;
    departure_date: string;
    cardholder_name: string;
    card_expiry_date: string;
    card_address: string;
    card_number: string;
    phone_number: string;
    reference: string;
    passport_photos: IPhoto[];
    email: string;
    password: string;
    user_id?: number;
    is_checked_in?: string;
    note_request: string;
    signature_photo: Object;
    terms_and_condition: boolean;
    extra_bed_request: boolean;
    room_temperature: number;
    additional_service_id: any;
}

export type TCheckIn<T = ICheckInBody, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof CHECK_IN;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TSendVerificationLink<T = any, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof SEND_VERIFICATION_LINK;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TCheckInSuccess<T = string, K = IProfile> = (
    token: T,
    profile: K,
) => {
    type: typeof CHECK_IN_SUCCESS;
    payload: {
        token: string;
        profile: IProfile;
    };
};

export type TCheckOut<T = () => void> = (
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof CHECK_OUT;
    payload: {
        onSuccess?: T;
        onFailed?: T;
    };
};

export type TCheckOutSuccess = () => {
    type: typeof CHECK_OUT_SUCCESS;
};

export type TSingOutSuccess = () => {
    type: typeof SIGN_OUT_SUCCESS;
};

export type TGetProfile<T = () => void, K = string> = (
    token: K,
    hotel_code: K,
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof GET_PROFILE;
    payload: {
        token: K;
        hotel_code: K;
        onSuccess?: T;
        onFailed?: T;
    };
};

export type TLateCheckOutSuccess = () => {
    type: typeof LATE_CHECK_OUT_SUCCESS;
};

export type TBookARestoTableAccessTokenSuccess<T = any> = (access_token: T) => {
    type: typeof RESTO_BOOK_A_TABLE_ACCESS_TOKEN_SUCCESS;
    payload: {
        access_token: T;
    };
};

export type TAlreadyCheckInSuccess<K = any> = (profile: K) => {
    type: typeof ALREADY_CHECKED_IN_SUCCESS;
    payload: {
        response: K;
    };
};

export type TGetProfileSuccess<T = IProfile, K = string, L = object> = (
    token: K,
    profile: T,
    hotelDetail: L,
    booking_token: K,
) => {
    type: typeof GET_PROFILE_SUCCESS;
    payload: {
        token: K;
        profile: T;
        hotelDetail: L;
        booking_token: K;
    };
};

export type TVerifyPhoneNumber<T = string, K = (confirmationResult: any) => void, I = () => void> = (
    phoneNumber: T,
    onSuccess?: K,
    onFailed?: I,
) => {
    type: typeof VERIFY_PHONE_NUMBER;
    payload: {
        phoneNumber: string;
        onSuccess?: K;
        onFailed?: I;
    };
};

export type TVerifyPhoneNumberSuccess<T = any> = (confirmationResult: T) => {
    type: typeof VERIFY_PHONE_NUMBER_SUCCESS;
    payload: {
        confirmationResult: T;
    };
};

export type TVerifyPin<T = string, K = (token: string) => void, I = () => void> = (
    pin: T,
    onSuccess?: K,
    onFailed?: I,
) => {
    type: typeof VERIFY_PIN;
    payload: {
        pin: string;
        onSuccess?: K;
        onFailed?: I;
    };
};

export type TVerifyPinSuccess = () => {
    type: typeof VERIFY_PIN_SUCCESS;
};

export type TOnAuthStateChanged<T = (token: string) => void> = (onCallback?: T) => {
    type: typeof ON_AUTH_STATE_CHANGED;
    payload: {
        onCallback?: T;
    };
};

export type TOnAuthStateChangedSuccess = () => {
    type: typeof ON_AUTH_STATE_CHANGED_SUCCESS;
};

export type TRemoveOnAuthStateChanged = () => {
    type: typeof REMOVE_ON_AUTH_STATE_CHANGED;
};

export type TLogin<T = string, K = (data: object, userData: IUserData) => void, I = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: I,
) => {
    type: typeof USER_LOGIN;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: I;
    };
};

export type TLoginSuccess<T = string, K = IProfile> = (
    token: T,
    profile: K,
) => {
    type: typeof LOGIN_SUCCESS;
    payload: {
        token: T;
        profile: K;
    };
};

export type TAccountFailed<T = any, K = string> = (
    error: T,
    type: K,
) => {
    type: typeof ACCOUNT_FAILED;
    payload: {
        error: IError;
    };
};

export type TUserCheckOut = (
    onSuccess?: () => void,
    onFailed?: () => void,
) => {
    type: typeof USER_CHECK_OUT;
    payload: {
        onSuccess: typeof onSuccess;
        onFailed: typeof onFailed;
    };
};

export type TUserCheckOutSuccess = () => {
    type: typeof USER_CHECK_OUT_SUCCESS;
};

export type TgetTransactionHistory<T = () => void> = (
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof GET_TRANSACTION_HISTORY;
    payload: {
        onSuccess?: T;
        onFailed?: T;
    };
};

export type TgetTransactionHistorySuccess<T = ITransaction> = (transaction: T) => {
    type: typeof GET_TRANSACTION_HISTORY_SUCCESS;
    payload: {
        transaction: T;
    };
};

export type TQuickCheckOutSuccess = () => {
    type: typeof QUICK_CHECK_OUT_SUCCESS;
};
export type TGetCurrentBooking = () => {
    type: typeof GET_CURRENT_BOOKINGS_SUCCESS;
};
//this is type of action
export type TGetAdditionalServices<T = () => void, K = string> = (
    token: K,
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof GET_ADDITIONAL_SERVICES;
    payload: {
        token: K;
        onSuccess?: T;
        onFailed?: T;
    };
};
//
export type TGetAdditionalServicesSuccess<T = any> = (additionalServices: T) => {
    type: typeof GET_ADDITIONAL_SERVICES_SUCCESS;
    payload: {
        additionalServices: T;
    };
};

export type TGetCardDetails<T = () => void> = (
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof CARD_DETAILS;
    payload: {
        onSuccess?: T;
        onFailed?: T;
    };
};

export interface ICardObject {
    cardholder_name: string;
    card_number: string;
    card_expiry_month: string;
    card_cvv_number: any;
    card_description: string;
    card_address: string;
}

export type TUpdateCardDetails<T = () => void, K = ICardObject> = (
    data: K,
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof UPDATE_CARD_DETAILS;
    payload: {
        data: K;
        onSuccess?: T;
        onFailed?: T;
    };
};

export interface IFindBookingObject {
    hotel_id: any;
    reference: any;
}

export type TFindBooking<T = () => void, K = IFindBookingObject> = (
    data: K,
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof FIND_BOOKING;
    payload: {
        data: K;
        onSuccess?: T;
        onFailed?: T;
    };
};

export type TGetCardDetailsSuccess<T = any> = (cardDetails: T) => {
    type: typeof CARD_DETAILS_SUCCESS;
    payload: {
        cardDetails: T;
    };
};

export type ActionAccountType = ReturnType<
    | TUserLoginSuccess
    | TUserGoogleLoginSuccess
    | TSignUp
    | TCheckIn
    | TCheckInSuccess
    | TCheckOut
    | TCheckOutSuccess
    | TGetProfile
    | TGetProfileSuccess
    | TLateCheckOut
    | TLateCheckOutSuccess
    | TVerifyPhoneNumber
    | TVerifyPhoneNumberSuccess
    | TVerifyPin
    | TVerifyPinSuccess
    | TOnAuthStateChanged
    | TOnAuthStateChangedSuccess
    | TRemoveOnAuthStateChanged
    | TLogin
    | TLoginSuccess
    | TAccountFailed
    | TUserCheckOut
    | TUserCheckOutSuccess
    | TgetTransactionHistory
    | TgetTransactionHistorySuccess
    | TBookARestoTableAccessTokenSuccess
    | TAlreadyCheckInSuccess
    | TQuickCheckOutSuccess
    | TForgotPasswordRequest
    | TForgotPasswordSuccess
    | TGetAdditionalServices
    | TGetAdditionalServicesSuccess
    | TGetCardDetails
    | TSingOutSuccess
    | TSendVerificationLink
    | TGetCurrentBooking
>;
