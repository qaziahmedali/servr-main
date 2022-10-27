import { IhotelTaxesState } from './hotelTaxes';

export const GET_HOTEL_TAXES = 'GET_CHAIN_DATA';
export const GET_HOTEL_TAXES_SUCCESS = 'GET_HOTEL_TAXES_SUCCESS';
export const GET_HOTEL_TAXES_FAILED = 'GET_HOTEL_TAXES_FAILED';

export type TGetHotelTaxes<T = IhotelTaxesState> = () => {
    type: typeof GET_HOTEL_TAXES;
    payload: IhotelTaxesState;
};

export type TGetHotelTaxesSuccess = (hotelTaxes: IhotelTaxesState) => {
    type: typeof GET_HOTEL_TAXES_SUCCESS;
    payload: IhotelTaxesState;
};
export type TGetHotelTaxesFailed = (hotelTaxes: IhotelTaxesState) => {
    type: typeof GET_HOTEL_TAXES_FAILED;
    payload: IhotelTaxesState;
};

export type ActionHotelTaxesType =
    | ReturnType<TGetHotelTaxes>
    | ReturnType<TGetHotelTaxesSuccess>
    | ReturnType<TGetHotelTaxesFailed>;
