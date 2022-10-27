import { IServiceItem, IConciergeTrackingProgressOrderRoomService } from './conciergeService';
import { IError } from './responseApi';

export const GET_CONCIERGE_SERVICE_ITEMS = 'GET_CONCIERGE_SERVICE_ITEMS';
export const GET_CONCIERGE_SERVICE_ITEMS_SUCCESS = 'GET_CONCIERGE_SERVICE_ITEMS_SUCCESS';

export const CREATE_REQUEST = 'CREATE_REQUEST';
export const CREATE_REQUEST_SUCCESS = 'CREATE_REQUEST_SUCCESS';

export const CONCIERGE_SERVICE_FAILED = 'CONCIERGE_SERVICE_FAILED';

export const CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE =
    'CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE';
export const CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS =
    'CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS';

export const DELETE_CONCIERGE_ORDER = 'DELETE_CONCIERGE_ORDER';
export const DELETE_CONCIERGE_ORDER_SUCCESS = 'DELETE_CONCIERGE_ORDER_SUCCESS';

export const WAKEUP_CALL = 'WAKEUP_CALL';
export const WAKEUP_CALL_SUCCESS = 'WAKEUP_CALL_SUCCESS';
export const ROOM_CLEANING_SERVICES = 'ROOM_CLEANING_SERVICES';
export const GET_WAKEUP_CALL = 'GET_WAKEUP_CALL';
export const GET_WAKEUP_CALL_SUCCESS = 'GET_WAKEUP_CALL_SUCCESS';
export const CLEAR_WAKE_UP_SERVICE = 'CLEAR_WAKE_UP_SERVICE';
export const GET_LAUNDRY_SERVICE = 'GET_LAUNDRY_SERVICE';
export const GET_LAUNDRY_SERVICE_SUCCESS = 'GET_LAUNDRY_SERVICE_SUCCESS';

export type TGetConciergeServiceItems<K = string, T = () => void> = (
    code: K,
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof GET_CONCIERGE_SERVICE_ITEMS;
    payload: {
        code: K;
        onSuccess?: T;
        onFailed?: T;
    };
};

export type TGetConciergeServiceItemsSuccess<T = IServiceItem[]> = (serviceItems: T) => {
    type: typeof GET_CONCIERGE_SERVICE_ITEMS_SUCCESS;
    payload: {
        serviceItems: T;
    };
};

export interface ICreateRequestItem {
    service_id: number;
    qty: number;
    note?: string;
}

export type TCreateRequest<T = any, K = (message: string) => void, I = () => void> = (
    items: T,
    onSuccess?: K,
    onFailed?: I,
) => {
    type: typeof CREATE_REQUEST;
    payload: {
        items: T;
        onSuccess?: K;
        onFailed?: I;
    };
};

export type TCreateRequestSuccess = () => {
    type: typeof CREATE_REQUEST_SUCCESS;
};

export type TConciergeServiceFailed<T = any, K = string> = (
    error: T,
    type: K,
) => {
    type: typeof CONCIERGE_SERVICE_FAILED;
    payload: {
        error: IError;
    };
};

export type TGetConciergeTrackingProgress<T = () => void> = (
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE;
    payload: {
        onSuccess?: T;
        onFailed?: T;
    };
};

export type TGetConciergeTrackingProgressSuccess<T = IConciergeTrackingProgressOrderRoomService[]> = (
    conciergeTrakingProgress: T,
) => {
    type: typeof CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS;
    payload: {
        conciergeTrakingProgress: T;
    };
};

export type TDeleteConciergeOrder<T = number, I = () => void, J = () => void, K = string> = (
    id: T,
    type: K,
    onSuccess: I,
    onFailed: J,
) => {
    type: typeof DELETE_CONCIERGE_ORDER;
    payload: {
        id: T;
        type: K;
        onSuccess?: I;
        onFailed?: J;
    };
};

export type TDeleteConciergeOrderSuccess = () => {
    type: typeof DELETE_CONCIERGE_ORDER_SUCCESS;
};

export type TWakeupCall<I = () => void, J = () => void, K = object, T = string> = (
    wakeup_call_time: K,
    wakeup_call_note: T,
    onSuccess: I,
    onFailed: J,
) => {
    type: typeof WAKEUP_CALL;
    payload: {
        wakeup_call_time: K;
        wakeup_call_note: T;
        onSuccess?: I;
        onFailed?: J;
    };
};

export type TGetWakeupCall<I = () => void, J = () => void> = (
    onSuccess: I,
    onFailed: J,
) => {
    type: typeof GET_WAKEUP_CALL;
    payload: {
        onSuccess?: I;
        onFailed?: J;
    };
};

export type TWakeupCallSuccess = () => {
    type: typeof WAKEUP_CALL_SUCCESS;
};

export type TGETWakeupCallSuccess = (get_wakeup_call: any) => {
    type: typeof GET_WAKEUP_CALL_SUCCESS;
    payload: {
        get_wakeup_call: any;
    };
};

export type TRoomCleaningService = () => {
    type: typeof ROOM_CLEANING_SERVICES;
};

export type TLaundryService = () => {
    type: typeof GET_LAUNDRY_SERVICE;
    payload: {
        hotel_code: any;
    };
};
export type TLaundryServiceSuccess = () => {
    type: typeof GET_LAUNDRY_SERVICE_SUCCESS;
    payload: {
        id: number;
        hotel_id: number;
        name: string;
        description: string;
        image: string;
        created_at: string;
        updated_at: string;
        deleted_at?: any;
        price: number;
    };
};

export type TClearWakeUpService = () => {
    type: typeof CLEAR_WAKE_UP_SERVICE;
};

export type ActionConciergeServiceType =
    | ReturnType<TGetConciergeServiceItems>
    | ReturnType<TGetConciergeServiceItemsSuccess>
    | ReturnType<TCreateRequest>
    | ReturnType<TCreateRequestSuccess>
    | ReturnType<TConciergeServiceFailed>
    | ReturnType<TGetConciergeTrackingProgress>
    | ReturnType<TGetConciergeTrackingProgressSuccess>
    | ReturnType<TWakeupCall>
    | ReturnType<TWakeupCallSuccess>
    | ReturnType<TGetWakeupCall>
    | ReturnType<TGETWakeupCallSuccess>
    | ReturnType<TRoomCleaningService>
    | ReturnType<TClearWakeUpService>
    | ReturnType<TLaundryService>
    | ReturnType<TLaundryServiceSuccess>;
