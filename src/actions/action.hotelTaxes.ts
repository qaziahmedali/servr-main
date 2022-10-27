import {
    GET_HOTEL_TAXES,
    GET_HOTEL_TAXES_SUCCESS,
    TGetHotelTaxes,
    TGetHotelTaxesSuccess,
    TGetHotelTaxesFailed,
    GET_HOTEL_TAXES_FAILED,
} from '../types/action.hotelTaxes';
import { IhotelTaxesState } from '../types/hotelTaxes';
export const getHotelTaxes = (idHotel: number) => ({
    type: GET_HOTEL_TAXES as typeof GET_HOTEL_TAXES,
    payload: {
        idHotel,
    },
});

export const getHotelTaxesSuccess: TGetHotelTaxesSuccess = (hotelTaxes) => ({
    type: GET_HOTEL_TAXES_SUCCESS,
    payload: hotelTaxes,
});
export const getHotelTaxesFailed: TGetHotelTaxesFailed = (hotelTaxes) => ({
    type: GET_HOTEL_TAXES_FAILED,
    payload: hotelTaxes,
});
