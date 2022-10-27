import { ISpa, ISpaTreatment, ISpaTrackingProgressOrderRoomService } from '../types/spa';
import { IError } from '../types/responseApi';
import { types } from '@babel/core';
import { GET_SPA_All_TREATMENTS } from '../types/action.spa';
// import {
//     TSpaTrackingProgressOrderRoomService,
//     TSpaTrackingProgressOrderRoomServiceSuccess,
//     SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
//     SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS
// } from '../types/action.spa'

export const GET_SPA = 'GET_SPA';
export const GET_SPA_SUCCESS = 'GET_SPA_SUCCESS';

export const GET_SPA_TREATMENT = 'GET_SPA_TREATMENT';
export const GET_SPA_TREATMENT_SUCCESS = 'GET_SPA_TREATMENT_SUCCESS';

export const RESERVE_SPA = 'RESERVE_SPA';
export const RESERVE_SPA_SUCCESS = 'RESERVE_SPA_SUCCESS';

export const ORDER_ROOM_SPA = 'ORDER_ROOM_SPA';
export const ORDER_ROOM_SPA_SUCCESS = 'ORDER_ROOM_SPA_SUCCESS';

export const SPA_FAILED = 'SPA_FAILED';

export const SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE = 'SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE';
export const SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS =
    'SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS';

export const DELETE_SPA_ORDER = 'DELETE_SPA_ORDER';
export const DELETE_SPA_ORDER_SUCCESS = 'DELETE_SPA_ORDER_SUCCESS';
export const GET_SPA_All_TREATMENTS_SUCCESS = 'GET_SPA_All_TREATMENTS_SUCCESS'

export const getSpa = (code?: string, onSuccess?: (spa: ISpa) => void, onFailed?: () => void) => ({
    type: GET_SPA as typeof GET_SPA,
    payload: {
        code,
        onSuccess,
        onFailed,
    },
});

export const getSpaSuccess = (spa : any) => ({
    type: GET_SPA_SUCCESS as typeof GET_SPA_SUCCESS,
    payload: {
        spa,
    },
});

export const getSpaTreatment = (
    spaId: number,
    code: string,
    onSuccess?: (treatments: ISpaTreatment[]) => void,
    onFailed?: () => void,
) => ({
    type: GET_SPA_TREATMENT as typeof GET_SPA_TREATMENT,
    payload: {
        spaId,
        code,
        onSuccess,
        onFailed,
    },
});

export const getSpaAllTreatments = (
    spaId: number,
    onSuccess?: () => void,
    onFailed?: () => void,
) => ({
    type: GET_SPA_All_TREATMENTS as typeof GET_SPA_All_TREATMENTS,
    payload: {
        spaId,
        onSuccess,
        onFailed,
    },
});

export const getSpaTreatmentSuccess = (treatments: ISpaTreatment[]) => ({
    type: GET_SPA_TREATMENT_SUCCESS as typeof GET_SPA_TREATMENT_SUCCESS,
    payload: {
        treatments,
    },
});

export const getSpaAllTreatmentSuccess = (treatments: any) => ({
    type: GET_SPA_All_TREATMENTS_SUCCESS as typeof GET_SPA_All_TREATMENTS_SUCCESS,
    payload: {
        treatments,
    },
});

interface IPostSpaBody {
    spa_id: number;
    treatments: any;
    number_people: number;
    date: string;
    time: string;
    currency : string;
    booking_type : string;
    card_number : string;
    card_expiry_month : string;
    card_cvv_number : string;
    cardholder_name : string;
    is_card_save : boolean;
    type : string;
    notes : any;
    tip : any;
    vip_note : any
}

export const reserveSpa = (body: IPostSpaBody, onSuccess?: () => void, onFailed?: () => void) => ({
    type: RESERVE_SPA as typeof RESERVE_SPA,
    payload: {
        body,
        onSuccess,
        onFailed,
    },
});

export const reserveSpaSuccess = () => ({
    type: RESERVE_SPA_SUCCESS as typeof RESERVE_SPA_SUCCESS,
});

export const orderRoomSpa = (body: IPostSpaBody, onSuccess?: () => void, onFailed?: () => void) => ({
    type: ORDER_ROOM_SPA as typeof ORDER_ROOM_SPA,
    payload: {
        body,
        onSuccess,
        onFailed,
    },
});

export const orderRoomSpaSuccess = () => ({
    type: ORDER_ROOM_SPA_SUCCESS as typeof ORDER_ROOM_SPA_SUCCESS,
});

export const spaFailed = (error: any, type: string) => ({
    type: SPA_FAILED as typeof SPA_FAILED,
    payload: {
        error: {
            error,
            type,
        } as IError,
    },
});

export const spaTrackingProgressOrderRoomService = (
    onSuccess?: (spaTrakingProgress: ISpaTrackingProgressOrderRoomService[]) => void,
    onFailed?: () => void,
) => ({
    type: SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE as typeof SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const spaTrackingProgressOrderRoomServiceSuccess = (
    spaTrakingProgress: ISpaTrackingProgressOrderRoomService[],
) => ({
    type: SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS as typeof SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS,
    payload: {
        spaTrakingProgress,
    },
});

export type TDeleteOrder<T = number, I = () => void, J = () => void> = (
    id: T,
    onSuccess: I,
    onFailed: J,
) => {
    type: typeof DELETE_SPA_ORDER;
    payload: {
        id: T;
        onSuccess?: I;
        onFailed?: J;
    };
};

export type TDeleteOrderSuccess = () => {
    type: typeof DELETE_SPA_ORDER_SUCCESS;
};

export const deleteSpaOrder: TDeleteOrder = (id, onSuccess, onFailed) => ({
    type: DELETE_SPA_ORDER,
    payload: {
        id,
        onSuccess,
        onFailed,
    },
});

export const deleteSpaOrderSuccess: TDeleteOrderSuccess = () => ({
    type: DELETE_SPA_ORDER_SUCCESS,
});

export type ActionSpaType = ReturnType<
    | typeof getSpa
    | typeof getSpaSuccess
    | typeof getSpaTreatment
    | typeof getSpaTreatmentSuccess
    | typeof reserveSpa
    | typeof reserveSpaSuccess
    | typeof orderRoomSpa
    | typeof orderRoomSpaSuccess
    | typeof spaFailed
    | typeof spaTrackingProgressOrderRoomService
    | typeof spaTrackingProgressOrderRoomServiceSuccess
    | typeof deleteSpaOrder
    | typeof deleteSpaOrderSuccess
    | typeof getSpaAllTreatmentSuccess
>;
