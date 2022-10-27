import { createLogic } from 'redux-logic';
import {
    GET_PARKING_DETAILS,
    GET_PARKING_DETAILS_SUCCESS,
    TGetParkingDetails,
    REQUEST_PARKING_VALET,
    REQUEST_PARKING_VALET_SUCCESS,
    TRequestParkingValet,
    ADD_VALET_PARKING,
    TAddValetParking,
    UPDATE_VALET_PARKING,
    TUpdateValetParking,
    GRAB_REQUEST,
    GRAB_REQUEST_SUCCESS,
    RE_PARK_REQUEST,
    TGrapRequest,
    TGrapRequestSuccess,
    TReParkRequest,
} from '../types/action.parkingValet';
import {
    IDependencies,
    ISuccessGetGrabRequest,
    ISuccessGetParkingValet,
    ISuccessGetReParkRequest,
    ISuccessRequestParkingValet,
} from '../types/responseApi';
import {
    GET_PARKING_VALET_API,
    REQUEST_PARKING_VALET_API,
    UPDATE_VALET_PARKING_API,
    VALET_PARKING,
    GET_GRAB_REQUEST,
    GET_RE_PARK_REQUEST_API,
} from '../constants/api';
import { AxiosResponse } from 'axios';
import {
    getParkingDetails,
    getParkingDetailsSuccess,
    parkingValetFailed,
    requestParkingValetSuccess,
    updateValetParking,
    grapRequest,
} from '../actions/action.parkingValet';
import { handleError, IRulesFormValidation, handleFormValidation, toast } from '../utils/handleLogic';
import { printUrl } from '../utils/formating';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import moment from 'moment';
import { isAfter } from 'date-fns';
import { getProfile } from '../actions/action.account';

const getParkingDetailsLogic = createLogic({
    type: GET_PARKING_DETAILS,
    process({ httpClient, getState, action }: IDependencies<ReturnType<TGetParkingDetails>>, dispatch, done) {
        httpClient
            .get(GET_PARKING_VALET_API, {
                headers: {
                    Accept: 'application/json',
                    // Authorization: `Bearer ${getState().account.access_token}`,
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetParkingValet>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get parking details');
                return response.data;
            })
            .then((response) => {
                dispatch(getParkingDetailsSuccess(response));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'get parking details');
                handleError({
                    error,
                    dispatch,
                    failedAction: parkingValetFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const getGrabRequestLogic = createLogic({
    type: GRAB_REQUEST,
    process({ httpClient, getState, action }: IDependencies<ReturnType<TGrapRequest>>, dispatch, done) {
        httpClient
            .get(GET_GRAB_REQUEST, {
                headers: {
                    Accept: 'application/json',
                    // Authorization: `Bearer ${getState().account.access_token}`,
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetGrabRequest>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get grab request');
                return response.data;
            })
            .then((response) => {
                dispatch(getParkingDetailsSuccess(response));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'get grab details');
                handleError({
                    error,
                    dispatch,
                    failedAction: parkingValetFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const getReParkRequestLogic = createLogic({
    type: RE_PARK_REQUEST,
    process({ httpClient, getState, action }: IDependencies<ReturnType<TReParkRequest>>, dispatch, done) {
        httpClient
            .get(GET_RE_PARK_REQUEST_API, {
                headers: {
                    Accept: 'application/json',
                    // Authorization: `Bearer ${getState().account.access_token}`,
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetReParkRequest>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get repark request');
                return response.data;
            })
            .then((response) => {
                dispatch(getParkingDetailsSuccess(response));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'get repark details');
                handleError({
                    error,
                    dispatch,
                    failedAction: parkingValetFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const requestParkingValetLogic = createLogic({
    type: REQUEST_PARKING_VALET,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<TRequestParkingValet>>,
        dispatch,
        done,
    ) {
        const { item } = action.payload;
        console.log('ITEMXX', item);

        const form = new FormData();
        form.append('request_type', item.request_type),
            form.append('manufacturer', item.manufacturer),
            form.append('color', item.color),
            form.append('license_plate', item.license_plate),
            item?.request_type === 'self' && form.append('location', item.location),
            form.append('vehicle_image', item.image),
            form.append('description', item.description),
            httpClient
                .post(VALET_PARKING, form, {
                    headers: {
                        Accept: 'application/json',
                        // Authorization: `Bearer ${getState().account.access_token}`,
                        Authorization: `Bearer ${getState().account.checkin_token}`,
                    },
                })
                .then((response: AxiosResponse<ISuccessRequestParkingValet>) => {
                    // if (__DEV__) {
                    //     console.log(`${action.type}: `, response);
                    // }
                    console.log('Request parking valet', response);
                    return response.data;
                })
                .then((response) => {
                    console.log(response, 'Request parking valet');
                    dispatch(requestParkingValetSuccess());
                    if (action.payload.onSuccess) {
                        action.payload.onSuccess();
                    }
                })
                .catch((error) => {
                    console.log(error.response, 'Request parking valet');
                    handleError({
                        error,
                        dispatch,
                        failedAction: parkingValetFailed(error, action.type),
                        type: action.type,
                        onFailed: action.payload.onFailed,
                    });
                })
                .then(() => done());
    },
});

const addValetParkingLogic = createLogic({
    type: ADD_VALET_PARKING,
    validate({ action, getState }: IDependencies<ReturnType<TCheckIn>>, allow, reject) {
        const { model_name, number_plate, parking_slot_no, booking_reference } = action.payload.data;
        // validation
        const rules: IRulesFormValidation[] = [
            {
                isValid: model_name.length != 0,
                message: getState().language.please_enter_the_valid_model_number,
            },
            {
                isValid: number_plate.uri != undefined && number_plate.uri != null && number_plate.uri != '',
                message: getState().language.please_enter_the_valid_license_plate_number,
            },
            {
                isValid: parking_slot_no.length != 0,
                message: getState().language.please_enter_the_valid_parking_slot_number,
            },
            {
                isValid: booking_reference.length != 0,
                message: getState().language.your_booking_refernece_is_not_valid,
            },
        ];

        console.log(action.payload.data, 'Making the request of the valet parking');
        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message, getState().language.attention);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(parkingValetFailed('Error', action.type));
            },
        );
    },
    process({ httpClient, action, getState }: IDependencies<ReturnType<TAddValetParking>>, dispatch, done) {
        console.log('action.payload.data');
        const data = new FormData();
        data.append('model_name', action.payload.data.model_name);
        data.append('number_plate', action.payload.data.number_plate);
        data.append('parking_slot_no', action.payload.data.parking_slot_no);
        data.append('booking_reference', action.payload.data.booking_reference);
        console.log('form data is here', data);
        console.log('form data is here', VALET_PARKING);
        httpClient
            .post(VALET_PARKING, data, {
                headers: {
                    Accept: 'application/json',
                    // Authorization: `Bearer ${getState().account.access_token}`,
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                },
            })
            .then((response: any) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'Request parking valet');
                return response;
            })
            .then((response) => {
                console.log(response);
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'Request parking valet');
                handleError({
                    error,
                    dispatch,
                    failedAction: parkingValetFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const updateValetParkingLogic = createLogic({
    type: UPDATE_VALET_PARKING,
    process(
        { httpClient, action, getState }: IDependencies<ReturnType<TUpdateValetParking>>,
        dispatch,
        done,
    ) {
        console.log('action.payload.data');
        const data = new FormData();
        data.append('model_name', action.payload.data.model_name);
        data.append('number_plate', action.payload.data.number_plate);
        data.append('parking_slot_no', action.payload.data.parking_slot_no);
        data.append('parking_id', action.payload.data.parking_id);
        console.log('form data is here', data);
        console.log('form data is here', VALET_PARKING);
        httpClient
            .post(UPDATE_VALET_PARKING_API, data, {
                headers: {
                    Accept: 'application/json',
                    // Authorization: `Bearer ${getState().account.access_token}`,
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                },
            })
            .then((response: any) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'Request parking valet');
                return response;
            })
            .then((response) => {
                console.log(response);
                getProfile(getState().account.access_token, getState().hotel.code);
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'Request parking valet');
                handleError({
                    error,
                    dispatch,
                    failedAction: parkingValetFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

export default [
    getParkingDetailsLogic,
    getGrabRequestLogic,
    getReParkRequestLogic,
    requestParkingValetLogic,
    addValetParkingLogic,
    updateValetParkingLogic,
];
