import {
    TGetParkingDetails,
    GET_PARKING_DETAILS,
    TGrapRequest,
    GRAB_REQUEST,
    TGetParkingDetailsSuccess,
    GET_PARKING_DETAILS_SUCCESS,
    TParkingValetFailed,
    PARKING_VALET_FAILED,
    REQUEST_PARKING_VALET,
    REQUEST_PARKING_VALET_SUCCESS,
    TRequestParkingValet,
    TRequestParkingValetSuccess,
    TAddValetParking,
    ADD_VALET_PARKING,
    UPDATE_VALET_PARKING,
    TUpdateValetParking,
    TReParkRequest,
    TReParkRequestSuccess,
    RE_PARK_REQUEST,
    RE_PARK_REQUEST_SUCCESS,
} from '../types/action.parkingValet';

export const getParkingDetails: TGetParkingDetails = (onSuccess, onFailed) => ({
    type: GET_PARKING_DETAILS,
    payload: {
        onSuccess,
        onFailed,
    },
});
export const grabRequest: TGrapRequest = (onSuccess, onFailed) => ({
    type: GRAB_REQUEST,
    payload: {
        onSuccess,
        onFailed,
    },
});
export const reParkRequest: TReParkRequest = (onSuccess, onFailed) => ({
    type: RE_PARK_REQUEST,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const addValetParking: TAddValetParking = (data, onSuccess, onFailed) => ({
    type: ADD_VALET_PARKING,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const updateValetParking: TUpdateValetParking = (data, onSuccess, onFailed) => ({
    type: UPDATE_VALET_PARKING,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const getParkingDetailsSuccess: TGetParkingDetailsSuccess = (parkingValetDetails) => ({
    type: GET_PARKING_DETAILS_SUCCESS,
    payload: {
        parkingValetDetails,
    },
});

export const requestParkingValet: TRequestParkingValet = (item, onSuccess, onFailed) => ({
    type: REQUEST_PARKING_VALET,
    payload: {
        item,
        onSuccess,
        onFailed,
    },
});

export const requestParkingValetSuccess: TRequestParkingValetSuccess = () => ({
    type: REQUEST_PARKING_VALET_SUCCESS,
});

export const parkingValetFailed: TParkingValetFailed = (error, type) => ({
    type: PARKING_VALET_FAILED,
    payload: {
        error: {
            error,
            type,
        },
    },
});
