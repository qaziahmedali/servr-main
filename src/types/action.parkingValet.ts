export const GET_PARKING_DETAILS = 'GET_PARKING_DETAILS';
export const GET_PARKING_DETAILS_SUCCESS = 'GET_PARKING_DETAILS_SUCCESS';
export const REQUEST_PARKING_VALET = 'REQUEST_PARKING_VALET';
export const REQUEST_PARKING_VALET_SUCCESS = 'REQUEST_PARKING_VALET_SUCCESS';
export const PARKING_VALET_FAILED = 'PARKING_VALET_FAILED';
export const ADD_VALET_PARKING = 'ADD_VALET_PARKING';
export const UPDATE_VALET_PARKING = 'UPDATE_VALET_PARKING';
export const GRAB_REQUEST = 'GRAB_REQUEST';
export const RE_PARK_REQUEST = 'RE_PARK_REQUEST';
export const RE_PARK_REQUEST_SUCCESS = 'RE_PARK_REQUEST_SUCCESS';
export const GRAB_REQUEST_SUCCESS = 'GRAB_REQUEST_SUCCESS';

import { IParkingState, IParkingValetState, IValetParking } from './parkingValet';
import { IError, ISuccessBookATable } from './responseApi';

export type TGetParkingDetails<T = () => void> = (
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof GET_PARKING_DETAILS;
    payload: {
        onSuccess?: T;
        onFailed?: T;
    };
};

export type TGrapRequest<T = () => void> = (
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof GRAB_REQUEST;
    payload: {
        onSuccess?: T;
        onFailed?: T;
    };
};

export type TGrapRequestSuccess<T = IValetParking> = (grabRequest: T) => {
    type: typeof GRAB_REQUEST_SUCCESS;
    payload: {
        grabRequest: T;
    };
};

export type TReParkRequest<T = () => void> = (
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof RE_PARK_REQUEST;
    payload: {
        onSuccess?: T;
        onFailed?: T;
    };
};

export type TReParkRequestSuccess<T = IValetParking> = (reParkRequest: T) => {
    type: typeof RE_PARK_REQUEST_SUCCESS;
    payload: {
        reParkRequest: T;
    };
};

export type TGetParkingDetailsSuccess<T = IValetParking> = (parkingValetDetails: T) => {
    type: typeof GET_PARKING_DETAILS_SUCCESS;
    payload: {
        parkingValetDetails: T;
    };
};

export type TRequestParkingValet<K = IParkingState, T = () => void> = (
    item: K,
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof REQUEST_PARKING_VALET;
    payload: {
        item: K;
        onSuccess?: T;
        onFailed?: T;
    };
};

export interface IValetParkingBody {
    model_name: string;
    number_plate: object;
    parking_slot_no: null | string;
    booking_reference: null | string;
}

export type TAddValetParking<K = IValetParkingBody, T = () => void> = (
    data: K,
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof ADD_VALET_PARKING;
    payload: {
        data: K;
        onSuccess?: T;
        onFailed?: T;
    };
};

export interface IUpdateValetParkingBody {
    model_name: null | string;
    number_plate: null | object;
    parking_slot_no: null | string;
    parking_id: number;
}

export type TUpdateValetParking<T = IUpdateValetParkingBody, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof UPDATE_VALET_PARKING;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TRequestParkingValetSuccess = () => {
    type: typeof REQUEST_PARKING_VALET_SUCCESS;
};

export type TParkingValetFailed<T = any, K = string> = (
    error: T,
    type: K,
) => {
    type: typeof PARKING_VALET_FAILED;
    payload: {
        error: IError;
    };
};

export type ActionParkingValetType = ReturnType<
    | TGetParkingDetails
    | TGetParkingDetailsSuccess
    | TParkingValetFailed
    | TAddValetParking
    | TUpdateValetParking
    | TGrapRequest
    | TGrapRequestSuccess
>;
