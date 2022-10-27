import { createLogic } from 'redux-logic';
import { IDependencies, IFailedResponse } from '../types/responseApi';
import { getHotelTaxes, getHotelTaxesFailed, getHotelTaxesSuccess } from '../actions/action.hotelTaxes';
import {
    TGetHotelTaxes,
    TGetHotelTaxesFailed,
    TGetHotelTaxesSuccess,
    GET_HOTEL_TAXES,
    GET_HOTEL_TAXES_FAILED,
    GET_HOTEL_TAXES_SUCCESS,
} from '../types/action.hotelTaxes';
import { GET_STAGES_HOTELS_TAXES_API } from '../constants/api';
import { AxiosResponse, AxiosError } from 'axios';
import { printUrl } from '../utils/formating';
import { toast } from '../utils/handleLogic';
import { accountFailed } from '../actions/action.account';

const hotelDataLogic = createLogic({
    type: GET_HOTEL_TAXES,
    process(
        { httpClient, action, getState }: IDependencies<ReturnType<typeof getHotelTaxes>>,
        dispatch,
        done,
    ) {
        console.log('hotelTaxes==========>', action);
        httpClient
            .get(printUrl(GET_STAGES_HOTELS_TAXES_API, action.payload.idHotel.toString()), {
                headers: {
                    Accept: 'application/json',
                },
            })
            .then((response: AxiosResponse<any>) => {
                console.log('hotelTaxes response================>', response?.data);
                return response.data;
            })
            .then((response) => {
                console.log('hotel taxes======================>>>', response);
                // if (response.value) {
                dispatch(getHotelTaxesSuccess(response));
                // }
            })
            .catch((error) => {
                console.log(error);
                console.log('hotelTaxes error======================>>>', error);
                dispatch(getHotelTaxesFailed(error));
                const { message, errors } = <IFailedResponse>error.response.data;
                toast(message, getState().language.error);
            })
            .then(() => done());
    },
});
export default [hotelDataLogic];
