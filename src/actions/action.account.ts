import { FIND_BOOKING_API, GET_CARD_DETAILS, UPDATE_PROFILE_API } from '../constants/api';
import TransactionHistory from '../modules/CheckOut/TransactionHistory';
import {
    CHECK_IN,
    CHECK_IN_SUCCESS,
    CHECK_OUT,
    CHECK_OUT_SUCCESS,
    GET_PROFILE,
    GET_PROFILE_SUCCESS,
    VERIFY_PHONE_NUMBER,
    VERIFY_PHONE_NUMBER_SUCCESS,
    VERIFY_PIN,
    VERIFY_PIN_SUCCESS,
    ACCOUNT_FAILED,
    TCheckIn,
    TCheckInSuccess,
    TCheckOut,
    TCheckOutSuccess,
    TGetProfile,
    TGetProfileSuccess,
    TVerifyPhoneNumber,
    TVerifyPhoneNumberSuccess,
    TVerifyPin,
    TVerifyPinSuccess,
    TAccountFailed,
    TOnAuthStateChanged,
    ON_AUTH_STATE_CHANGED,
    TOnAuthStateChangedSuccess,
    ON_AUTH_STATE_CHANGED_SUCCESS,
    TLogin,
    LOGIN,
    TLoginSuccess,
    LOGIN_SUCCESS,
    TRemoveOnAuthStateChanged,
    REMOVE_ON_AUTH_STATE_CHANGED,
    TLateCheckOut,
    LATE_CHECK_OUT,
    TLateCheckOutSuccess,
    LATE_CHECK_OUT_SUCCESS,
    TUserCheckOut,
    TUserCheckOutSuccess,
    USER_CHECK_OUT,
    USER_CHECK_OUT_SUCCESS,
    GET_TRANSACTION_HISTORY,
    TgetTransactionHistory,
    GET_TRANSACTION_HISTORY_SUCCESS,
    TgetTransactionHistorySuccess,
    QUICK_CHECK_OUT,
    QUICK_CHECK_OUT_SUCCESS,
    BILLS,
    TBookARestoTableAccessTokenSuccess,
    RESTO_BOOK_A_TABLE_ACCESS_TOKEN_SUCCESS,
    ALREADY_CHECKED_IN_SUCCESS,
    TAlreadyCheckInSuccess,
    TRANSACTION_HISTORY_PAYMENT,
    TSignUp,
    SIGN_UP,
    TUserLoginSuccess,
    USER_LOGIN_SUCCESS,
    USER_LOGIN,
    TUserLogIn,
    GOOGLE_LOGIN,
    TUserGoogleLogIn,
    TUserGoogleLoginSuccess,
    USER_GOOGLE_LOGIN_SUCCESS,
    TForgotPasswordRequest,
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    TForgotPasswordSuccess,
    TUpdatePasswordRequest,
    UPDATE_PASSWORD,
    UPDATE_PASSWORD_SUCCESS,
    TUpdatePasswordSuccess,
    UPDATE_PROFILE,
    TUpdateProfileRequest,
    GET_ADDITIONAL_SERVICES,
    TGetAdditionalServices,
    TGetAdditionalServicesSuccess,
    GET_ADDITIONAL_SERVICES_SUCCESS,
    TGetCardDetails,
    CARD_DETAILS,
    TUpdateCardDetails,
    UPDATE_CARD_DETAILS,
    TGetCardDetailsSuccess,
    CARD_DETAILS_SUCCESS,
    TGoBackToHome,
    GO_BACK_TO_HOME,
    TFindBooking,
    FIND_BOOKING,
    SIGN_OUT_SUCCESS,
    TSingOutSuccess,
    SEND_VERIFICATION_LINK,
    TSendVerificationLink,
    GET_CURRENT_BOOKINGS,
    GET_CURRENT_BOOKINGS_SUCCESS,
    SET_BOOKING_ACTIVE,
} from '../types/action.account';

export const goBackToHome: TGoBackToHome = (value, onSuccess, onFailed) => ({
    type: GO_BACK_TO_HOME,
    payload: {
        value,
        onSuccess,
        onFailed,
    },
});

export const signup: TSignUp = (data, onSuccess, onFailed) => ({
    type: SIGN_UP,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const signupSuccess: TSignUp = (data, onSuccess, onFailed) => ({
    type: SIGN_UP,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const userLogin: TUserLogIn = (data, onSuccess, onFailed) => ({
    type: USER_LOGIN,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const userGoogleLogin: TUserGoogleLogIn = (data, onSuccess, onFailed) => ({
    type: GOOGLE_LOGIN,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const userGoogleLoginSuccess: TUserGoogleLoginSuccess = (token, userData) => ({
    type: USER_GOOGLE_LOGIN_SUCCESS,
    payload: {
        token,
        userData,
    },
});

export const userLoginSuccess: TUserLoginSuccess = (token, userData) => ({
    type: USER_LOGIN_SUCCESS,
    payload: {
        token,
        userData,
    },
});

export const forgotPasswordRequest: TForgotPasswordRequest = (data, onSuccess, onFailed) => ({
    type: FORGOT_PASSWORD,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const forgotPasswordSuccess: TForgotPasswordSuccess = (message, code) => ({
    type: FORGOT_PASSWORD_SUCCESS,
    payload: {
        message,
        code,
    },
});

export const updateProfile: TUpdateProfileRequest = (data, onSuccess, onFailed) => ({
    type: UPDATE_PROFILE,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const updatePasswordRequest: TUpdatePasswordRequest = (data, onSuccess, onFailed) => ({
    type: UPDATE_PASSWORD,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const updatePasswordSuccess: TUpdatePasswordSuccess = (message) => ({
    type: UPDATE_PASSWORD_SUCCESS,
    payload: {
        message,
    },
});

export const checkIn: TCheckIn = (data, onSuccess, onFailed) => ({
    type: CHECK_IN,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const sendVerificationLink: TSendVerificationLink = (data, onSuccess, onFailed) => ({
    type: SEND_VERIFICATION_LINK,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const checkInSuccess: TCheckInSuccess = (token, profile) => ({
    type: CHECK_IN_SUCCESS,
    payload: {
        token,
        profile,
    },
});

export const checkOut: TCheckOut = (onSuccess, onFailed) => ({
    type: CHECK_OUT,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const checkOutSuccess: TCheckOutSuccess = () => ({
    type: CHECK_OUT_SUCCESS,
});

export const signOutSuccess: TSingOutSuccess = () => ({
    type: SIGN_OUT_SUCCESS,
});

export const lateCheckOut: TLateCheckOut = (data, onSuccess, onFailed) => ({
    type: LATE_CHECK_OUT,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const quickCheckOut = (type: any, onSuccess?: () => void, onFailed?: () => void) => ({
    type: QUICK_CHECK_OUT,
    payload: {
        type,
        onSuccess,
        onFailed,
    },
});

export const transactionHistoryPaymentt = (type: any, onSuccess?: () => void, onFailed?: () => void) => ({
    type: TRANSACTION_HISTORY_PAYMENT,
    payload: {
        type,
        onSuccess,
        onFailed,
    },
});

export const bills = (onSuccess?: any, onFailed?: () => void) => ({
    type: BILLS,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const restoBookATableSuccessAccessToken: TBookARestoTableAccessTokenSuccess = (access_token: any) => ({
    type: RESTO_BOOK_A_TABLE_ACCESS_TOKEN_SUCCESS,
    payload: {
        access_token,
    },
});

export const quickCheckOutSuccess = () => ({
    type: QUICK_CHECK_OUT_SUCCESS,
});

export const lateCheckOutSuccess: TLateCheckOutSuccess = () => ({
    type: LATE_CHECK_OUT_SUCCESS,
});

export const getProfile: TGetProfile = (token, hotel_code, onSuccess, onFailed) => ({
    type: GET_PROFILE,
    payload: {
        token,
        hotel_code,
        onSuccess,
        onFailed,
    },
});

export const getProfileSuccess: TGetProfileSuccess = (token, profile, hotelDetail, booking_token) => ({
    type: GET_PROFILE_SUCCESS,
    payload: {
        token,
        profile,
        hotelDetail,
        booking_token,
    },
});

export const verifyPhoneNumber: TVerifyPhoneNumber = (phoneNumber, onSuccess, onFailed) => ({
    type: VERIFY_PHONE_NUMBER,
    payload: {
        phoneNumber,
        onSuccess,
        onFailed,
    },
});

export const verifyPhoneNumberSuccess: TVerifyPhoneNumberSuccess = (confirmationResult) => ({
    type: VERIFY_PHONE_NUMBER_SUCCESS,
    payload: {
        confirmationResult,
    },
});

export const verifyPin: TVerifyPin = (pin, onSuccess, onFailed) => ({
    type: VERIFY_PIN,
    payload: {
        pin,
        onSuccess,
        onFailed,
    },
});

export const verifyPinSuccess: TVerifyPinSuccess = () => ({
    type: VERIFY_PIN_SUCCESS,
});

export const onAuthStateChanged: TOnAuthStateChanged = (onCallback) => ({
    type: ON_AUTH_STATE_CHANGED,
    payload: {
        onCallback,
    },
});

export const onAuthStateChangedSuccess: TOnAuthStateChangedSuccess = () => ({
    type: ON_AUTH_STATE_CHANGED_SUCCESS,
});

export const removeOnAuthStateChanged: TRemoveOnAuthStateChanged = () => ({
    type: REMOVE_ON_AUTH_STATE_CHANGED,
});

export const login: TLogin = (token, onSuccess, onFailed) => ({
    type: LOGIN,
    payload: {
        token,
        onSuccess,
        onFailed,
    },
});

export const loginSuccess: TLoginSuccess = (token, profile) => ({
    type: LOGIN_SUCCESS,
    payload: {
        token,
        profile,
    },
});

export const accountFailed: TAccountFailed = (error, type) => ({
    type: ACCOUNT_FAILED,
    payload: {
        error: {
            error,
            type,
        },
    },
});

export const userCheckOut: TUserCheckOut = (onSuccess, onFailed) => ({
    type: USER_CHECK_OUT,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const userCheckOutSuccess: TUserCheckOutSuccess = () => ({
    type: USER_CHECK_OUT_SUCCESS,
});

export const getTransactionHistory: TgetTransactionHistory = (onSuccess, onFailed) => ({
    type: GET_TRANSACTION_HISTORY,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const getTransactionHistorySuccess: TgetTransactionHistorySuccess = (transaction) => ({
    type: GET_TRANSACTION_HISTORY_SUCCESS,
    payload: {
        transaction,
    },
});

export const AlreadyCheckInSuccess: TAlreadyCheckInSuccess = (response) => ({
    type: ALREADY_CHECKED_IN_SUCCESS,
    payload: {
        response,
    },
});

export const getAddionalServices: TGetAdditionalServices = (token, onSuccess, onFailed) => ({
    type: GET_ADDITIONAL_SERVICES,
    payload: {
        token,
        onSuccess,
        onFailed,
    },
});

export const getAdditionalServicesSuccess: TGetAdditionalServicesSuccess = (additionalServices) => ({
    type: GET_ADDITIONAL_SERVICES_SUCCESS,
    payload: {
        additionalServices,
    },
});

export const getCardDetails: TGetCardDetails = (onSuccess, onFailed) => ({
    type: CARD_DETAILS,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const getCardDetailSuccess: TGetCardDetailsSuccess = (cardDetails) => ({
    type: CARD_DETAILS_SUCCESS,
    payload: {
        cardDetails,
    },
});

export const updateCardDetails: TUpdateCardDetails = (data, onSuccess, onFailed) => ({
    type: UPDATE_CARD_DETAILS,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const swtichBookingReference: any = (data: any, onSuccess: any, onFailed: any) => ({
    type: SET_BOOKING_ACTIVE,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const findBooking: TFindBooking = (data, onSuccess, onFailed) => ({
    type: FIND_BOOKING,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const getCurrentBookings: any = (onSuccess: any, onFailed: any) => ({
    type: GET_CURRENT_BOOKINGS,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const getCurrentBookingsSuccess: any = (data: any) => ({
    type: GET_CURRENT_BOOKINGS_SUCCESS,
    payload: {
        data,
    },
});
