import { IAccountState } from '../types/account';
import {
    ActionAccountType,
    GET_PROFILE_SUCCESS,
    CHECK_IN_SUCCESS,
    ACCOUNT_FAILED,
    CHECK_OUT_SUCCESS,
    VERIFY_PHONE_NUMBER_SUCCESS,
    LOGIN_SUCCESS,
    GET_TRANSACTION_HISTORY,
    GET_TRANSACTION_HISTORY_SUCCESS,
    QUICK_CHECK_OUT_SUCCESS,
    RESTO_BOOK_A_TABLE_ACCESS_TOKEN_SUCCESS,
    ALREADY_CHECKED_IN_SUCCESS,
    USER_LOGIN_SUCCESS,
    USER_GOOGLE_LOGIN_SUCCESS,
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    GET_ADDITIONAL_SERVICES_SUCCESS,
    CARD_DETAILS_SUCCESS,
    SIGN_OUT_SUCCESS,
    GET_CURRENT_BOOKINGS_SUCCESS,
    SET_BOOKING_ACTIVE,
} from '../types/action.account';

export const initialState: IAccountState = {
    access_token: '',
    profile: {},
    isCheckedIn: false,
    confirmationResult: null,
    error: {},
    transaction_data: [],
    bills: {},
    userData: {},
    verificationCode: 0,
    message: '',
    additional_services: [],
    checkin_token: '',
    hotel_details: {},
    isCheckedOut: false,
    bookingRefernces: [],
    getActiveBooking: {},
};

export default (state = initialState, action: ActionAccountType): IAccountState => {
    switch (action.type) {
        case LOGIN_SUCCESS:
        case CHECK_IN_SUCCESS:
            return {
                ...state,
                checkin_token: action.payload.token,
                profile: action.payload.profile,
                userData: action.payload.profile,
                isCheckedIn: true,
            };
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                access_token: action.payload.token,
                userData: action.payload.userData.user,
                profile: action.payload.userData.user,
                hotel_details: action.payload.userData.hotel_detail,
            };
        case USER_GOOGLE_LOGIN_SUCCESS:
            return {
                ...state,
                access_token: action.payload.token,
                userData: action.payload.userData.user,
                profile: action.payload.userData.user,
                hotel_details: action.payload.userData.hotel_detail,
            };
        case ALREADY_CHECKED_IN_SUCCESS:
            return {
                ...state,
                profile: action.payload.response.user,
                checkin_token: action.payload.response.booking_token,
                access_token: action.payload.response.token,
                userData: action.payload.response.user,
                hotel_details: action.payload.response.hotel_detail,
                isCheckedIn: true,
            };
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                verificationCode: action.payload.code,
            };
        case VERIFY_PHONE_NUMBER_SUCCESS:
            return {
                ...state,
                confirmationResult: action.payload.confirmationResult,
            };
        case RESTO_BOOK_A_TABLE_ACCESS_TOKEN_SUCCESS:
            return {
                ...state,
                access_token: action.payload.access_token,
            };
        case GET_PROFILE_SUCCESS:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    ...action.payload.profile,
                },
                userData: {
                    ...state.userData,
                    ...action.payload.profile,
                },
                hotel_details: {
                    ...state.hotel_details,
                    ...action.payload.hotelDetail,
                },
                checkin_token: action.payload.booking_token,
                isCheckedIn: action.payload.booking_token != null ? true : false,
            };

        case CHECK_OUT_SUCCESS:
            return {
                ...state,
                isCheckedIn: false,
                confirmationResult: null,
                error: {},
                transaction_data: [],
                bills: {},
                isCheckedOut: true,
            };
        case SIGN_OUT_SUCCESS:
            return {
                ...state,
                access_token: '',
                isCheckedOut: false,
            };

        case QUICK_CHECK_OUT_SUCCESS:
            return {
                ...state,
                profile: {},
                isCheckedIn: false,
                confirmationResult: null,
                error: {},
                transaction_data: [],
                bills: {},
            };
        case ACCOUNT_FAILED:
            return {
                ...state,
                error: action.payload.error,
            };
        case GET_TRANSACTION_HISTORY:
            return {
                ...state,
                transaction_data: [],
            };
        case GET_TRANSACTION_HISTORY_SUCCESS:
            return {
                ...state,
                transaction_data: action.payload.transaction,
            };
        case GET_ADDITIONAL_SERVICES_SUCCESS:
            return {
                ...state,
                additional_services: action.payload.additionalServices,
            };
        case CARD_DETAILS_SUCCESS:
            return {
                ...state,
                cardDetails: action.payload.cardDetails.card_details,
            };
        case GET_CURRENT_BOOKINGS_SUCCESS:
            return {
                ...state,
                bookingRefernces: action.payload.data,
            };
        case SET_BOOKING_ACTIVE:
            return {
                ...state,
                getActiveBooking: action.payload.data.code,
            };
        default:
            return state;
    }
};
