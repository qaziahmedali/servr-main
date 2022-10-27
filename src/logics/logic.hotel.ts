import { createLogic } from 'redux-logic';
import { ToastAndroid, Platform, Alert } from 'react-native';
import {
    ALREADY_CHECKED_IN,
    GET_HOTEL_DETAIL,
    HOTEL_LIST,
    RESTO_LOGOUT_SUCCESS,
    TAlreadyCheckedIn,
    TGetHotelDetail,
    TGetHotelList,
} from '../types/action.hotel';
import { IDependencies, ISuccessGetHotelDetail, ISuccessHotelList } from '../types/responseApi';
import { printUrl } from '../utils/formating';
import { HOTEL_DETAIL, ALREADY_CHECKED_IN_API, PAYMENT_TRANSACTION, HOTEL_LIST_API } from '../constants/api';
import { AxiosResponse } from 'axios';
import {
    getHotelDetailSuccess,
    hotelFailed,
    restoLogoutSuccess,
    getHotelListSuccess,
} from '../actions/action.hotel';
import {
    handleError,
    IRulesFormValidation,
    handleFormValidation,
    toast,
    validateEmail,
} from '../utils/handleLogic';
import { getRestaurantCategoryDishSuccess, getRestaurantListSuccess } from '../actions/action.restaurant';
import { connectSendBird } from '../actions/action.chat';
import { AlreadyCheckInSuccess, checkInSuccess } from '../actions/action.account';
import { getHotelTaxes } from '../actions/action.hotelTaxes';

const getHotelDetail = createLogic({
    type: GET_HOTEL_DETAIL,
    validate({ action, getState }: IDependencies<ReturnType<TGetHotelDetail>>, allow, reject) {
        const { code } = action.payload;

        // validation
        const rules: IRulesFormValidation[] = [
            {
                isValid: code !== '',
                message: getState().language.code_hotel_is_required,
            },
            {
                isValid: /^[a-zA-Z0-9]*$/gi.test(code),
                message: getState().language.code_hotel_must_be_alphabet_or_number,
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
                reject(hotelFailed(rule.message, GET_HOTEL_DETAIL));
            },
        );
    },
    process({ httpClient, action, getState }: IDependencies<ReturnType<TGetHotelDetail>>, dispatch, done) {
        httpClient
            .get(printUrl(HOTEL_DETAIL, action.payload.code), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                },
            })
            .then((response: AxiosResponse<ISuccessGetHotelDetail>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get hotel');
                if (
                    response &&
                    response.data &&
                    response.data.message == 'Sorry, that hotel code is incorrect, please try again'
                ) {
                    return response.data;
                } else return response.data;
            })
            .then((response) => {
                console.log(response, 'get hotel detail');
                if (response.message !== 'Sorry, that hotel code is incorrect, please try again') {
                    const {
                        id,
                        description,
                        code,
                        layout,
                        hotel_features,
                        name,
                        category,
                        currency,
                        mobile_hotel_layout_id,
                        mobile_hotel_layouts,
                        dynamic_buttons,
                        ...logo
                    } = response.data;
                    const { type } = response;
                    const { resto } = response;
                    if (resto) {
                        dispatch(getRestaurantListSuccess([resto]));
                        dispatch(getRestaurantCategoryDishSuccess(response.data.dishes));
                    }
                    dispatch(
                        getHotelDetailSuccess(
                            id,
                            code,
                            description,
                            name,
                            logo,
                            layout.theme,
                            layout.icons,
                            hotel_features,
                            category,
                            currency,
                            mobile_hotel_layout_id,
                            mobile_hotel_layouts,
                            dynamic_buttons,
                            type,
                        ),
                    );
                    dispatch(getHotelTaxes(id));
                    // dispatch(getAddionalServices(id));
                    if (action.payload.onSuccess) {
                        action.payload.onSuccess();
                    }
                } else {
                    toast(response.message, getState().language.attention);
                    if (action.payload.onFailed) {
                        action.payload.onFailed();
                    }
                }
            })
            .catch((error) => {
                console.log(error.response, 'get hotel');
                handleError({
                    error,
                    dispatch,
                    failedAction: hotelFailed(error, GET_HOTEL_DETAIL),
                    type: GET_HOTEL_DETAIL,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const getHotelList = createLogic({
    type: HOTEL_LIST,
    process({ httpClient, action, getState }: IDependencies<ReturnType<TGetHotelList>>, dispatch, done) {
        httpClient
            .get(HOTEL_LIST_API, {
                headers: {
                    Accept: 'application/json',
                },
            })
            .then((response: AxiosResponse<ISuccessHotelList>) => {
                return response.data;
            })
            .then((response) => {
                dispatch(getHotelListSuccess(response.hotels, response.message));
            })
            .catch((error) => {
                handleError({
                    error,
                    dispatch,
                    failedAction: hotelFailed(error, GET_HOTEL_DETAIL),
                    type: GET_HOTEL_DETAIL,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const AlreadyCheckedInLogic = createLogic({
    type: ALREADY_CHECKED_IN,
    validate({ action, getState }: IDependencies<ReturnType<TAlreadyCheckedIn>>, allow, reject) {
        const { data } = action.payload;

        // validation
        const rules: IRulesFormValidation[] = [
            {
                isValid: validateEmail(data?.email),
                message: getState().language.you_have_entered_an_invalid_e_mail_address,
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
            },
        );
    },
    process({ httpClient, action }: IDependencies<ReturnType<TAlreadyCheckedIn>>, dispatch, done) {
        const form = new FormData();
        const { data } = action.payload;
        form.append('email', data?.email);
        form.append('password', data?.password);
        form.append('hotel_code', data?.hotel_code);
        httpClient
            .post(ALREADY_CHECKED_IN_API, form, {
                headers: {
                    Accept: 'application/json',
                },
            })
            .then(async (response: AxiosResponse<any>) => {
                if (__DEV__) {
                    console.log(`${action.type}: `, response);
                    console.log('HOTEL__DETAILS response 1=== ', response);
                }

                return response.data;
            })
            .then((response) => {
                console.log('Already checked in api data', response);
                if (response.data.token == null) {
                    dispatch(
                        AlreadyCheckInSuccess({
                            ...response.data.booking,
                            card_number: response.data.booking.card_number,
                            alreadyCheckedIn: true,
                        }),
                    );
                } else {
                    dispatch(
                        checkInSuccess(response.data.token, {
                            ...response.data.booking,
                            card_number: response.data.booking.card_number,
                            alreadyCheckedIn: false,
                        }),
                    );
                    dispatch(connectSendBird());
                }
                console.log('HOTEL__DETAILS response 2=== ', response);
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                toast(error.response.data.message);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
            })
            .then(() => done());
    },
});

const restoLogOut = createLogic({
    type: RESTO_LOGOUT_SUCCESS,
    process({ httpClient, action }: IDependencies<ReturnType<any>>, dispatch, done) {
        console.log('its dispatched');
        dispatch(restoLogoutSuccess());
    },
});

export default [getHotelDetail, restoLogOut, AlreadyCheckedInLogic, getHotelList];
