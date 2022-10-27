import {
    GET_HOTEL_DETAIL,
    GET_HOTEL_DETAIL_SUCCESS,
    HOTEL_FAILED,
    TGetHotelDetail,
    TGetHotelDetailSuccess,
    THotelFailed,
    TAlreadyCheckedIn,
    ALREADY_CHECKED_IN,
    RESTO_LOGOUT_SUCCESS,
    TRestoLogoutSuccess,
    HOTEL_LIST,
    TGetHotelList,
    THotelListSuccess,
    HOTEL_LIST_SUCCESS,
} from '../types/action.hotel';

export const getHotelDetail: TGetHotelDetail = (code, onSuccess, onFailed) => ({
    type: GET_HOTEL_DETAIL,
    payload: {
        code,
        onSuccess,
        onFailed,
    },
});

export const getHotelList: TGetHotelList = (onSuccess, onFailed) => ({
    type: HOTEL_LIST,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const getHotelListSuccess: THotelListSuccess = (hotels, message) => ({
    type: HOTEL_LIST_SUCCESS,
    payload: {
        hotels,
        message
    },
});

export const alreadyCheckedIn: TAlreadyCheckedIn = (data, onSuccess, onFailed) => ({
    type: ALREADY_CHECKED_IN,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const restoLogoutSuccess: TRestoLogoutSuccess = () => ({
    type: RESTO_LOGOUT_SUCCESS,
});

export const getHotelDetailSuccess: TGetHotelDetailSuccess = (
    id,
    code,
    description,
    name,
    logo,
    theme,
    icon,
    feature,
    category,
    currency,
    mobile_hotel_layout_id,
    mobile_hotel_layouts,
    dynamic_buttons,
    type,
) => ({
    type: GET_HOTEL_DETAIL_SUCCESS,
    payload: {
        id,
        code,
        description,
        name,
        logo,
        theme,
        icon,
        feature,
        category,
        currency,
        mobile_hotel_layout_id,
        mobile_hotel_layouts,
        dynamic_buttons,
        type,
    },
});

export const hotelFailed: THotelFailed = (error, type) => ({
    type: HOTEL_FAILED,
    payload: {
        error: {
            error,
            type,
        },
    },
});
