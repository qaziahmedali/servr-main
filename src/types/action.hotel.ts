import { ILogoHotel, IThemeHotel, IIconHotel, IFeatureHotel } from './hotel';
import { IError, ISuccessHotelList } from './responseApi';

export const GET_HOTEL_DETAIL = 'GET_HOTEL_DETAIL';
export const GET_HOTEL_DETAIL_SUCCESS = 'GET_HOTEL_DETAIL_SUCCESS';

export const HOTEL_FAILED = 'HOTEL_FAILED';

export const ALREADY_CHECKED_IN = 'ALREADY_CHECKED_IN';

export const RESTO_LOGOUT_SUCCESS = 'RESTO_LOGOUT_SUCCESS';

export const HOTEL_LIST = 'HOTEL_LIST';
export const HOTEL_LIST_SUCCESS = 'HOTEL_LIST_SUCCESS';
export const HOTEL_LIST_FAILED = 'HOTEL_LIST_FAILED';

export type TGetHotelDetail<T = string, K = () => void> = (
    code: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof GET_HOTEL_DETAIL;
    payload: {
        code: string;
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TGetHotelList<K = () => void> = (
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof HOTEL_LIST;
    payload: {
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TAlreadyCheckedIn<T = {}, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof ALREADY_CHECKED_IN;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TRestoLogoutSuccess = () => {
    type: typeof RESTO_LOGOUT_SUCCESS;
};

export type TGetHotelDetailSuccess = (
    id: number,
    code: string,
    description: string,
    name: string,
    logo: ILogoHotel,
    theme: IThemeHotel,
    icon: IIconHotel,
    feature: IFeatureHotel,
    category: string,
    currency: string,
    mobile_hotel_layout_id: number,
    mobile_hotel_layouts: any,
    dynamic_buttons: any,
    type: any,
) => {
    type: typeof GET_HOTEL_DETAIL_SUCCESS;
    payload: {
        id: number;
        code: string;
        description: string;
        name: string;
        logo: ILogoHotel;
        theme: IThemeHotel;
        icon: IIconHotel;
        feature: IFeatureHotel;
        category: string;
        currency: string;
        mobile_hotel_layout_id: number;
        mobile_hotel_layouts: any;
        dynamic_buttons: any;
        type: any;
    };
};

export type THotelFailed<T = any, K = string> = (
    error: T,
    type: K,
) => {
    type: typeof HOTEL_FAILED;
    payload: {
        error: IError;
    };
};
export type THotelListSuccess<T = any, K = string, A = []> = (
    hotels: T,
    message: K,
) => {
    type: typeof HOTEL_LIST_SUCCESS;
    payload: {
        hotels: T,
        message: K
    };
};

export type ActionHotelType =
    | ReturnType<TGetHotelDetail>
    | ReturnType<TGetHotelList>
    | ReturnType<TGetHotelDetailSuccess>
    | ReturnType<THotelFailed>
    | ReturnType<THotelListSuccess>
    | ReturnType<TRestoLogoutSuccess>;
