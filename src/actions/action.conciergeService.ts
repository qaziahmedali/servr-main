import {
    TGetConciergeServiceItems,
    GET_CONCIERGE_SERVICE_ITEMS,
    TGetConciergeServiceItemsSuccess,
    GET_CONCIERGE_SERVICE_ITEMS_SUCCESS,
    TCreateRequest,
    CREATE_REQUEST,
    TCreateRequestSuccess,
    CREATE_REQUEST_SUCCESS,
    TConciergeServiceFailed,
    CONCIERGE_SERVICE_FAILED,
    TGetConciergeTrackingProgress,
    TGetConciergeTrackingProgressSuccess,
    CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS,
    DELETE_CONCIERGE_ORDER,
    DELETE_CONCIERGE_ORDER_SUCCESS,
    TDeleteConciergeOrder,
    TDeleteConciergeOrderSuccess,
    TWakeupCall,
    TWakeupCallSuccess,
    WAKEUP_CALL,
    WAKEUP_CALL_SUCCESS,
    TRoomCleaningService,
    ROOM_CLEANING_SERVICES,
    TGetWakeupCall,
    GET_WAKEUP_CALL,
    GET_WAKEUP_CALL_SUCCESS,
    CLEAR_WAKE_UP_SERVICE,
    TGETWakeupCallSuccess,
} from '../types/action.conciergeService';

// import {IConciergeTrackingProgressOrderRoomService} from '../types/conciergeService'

// export const CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE = 'CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE';
// export const CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS = 'CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS';

export const getConciergeServiceItems: TGetConciergeServiceItems = (code, onSuccess, onFailed) => ({
    type: GET_CONCIERGE_SERVICE_ITEMS,
    payload: {
        code,
        onSuccess,
        onFailed,
    },
});

export const getConciergeServiceItemsSuccess: TGetConciergeServiceItemsSuccess = (serviceItems) => ({
    type: GET_CONCIERGE_SERVICE_ITEMS_SUCCESS,
    payload: {
        serviceItems,
    },
});

export const createRequest: TCreateRequest = (items, onSuccess, onFailed) => ({
    type: CREATE_REQUEST,
    payload: {
        items,
        onSuccess,
        onFailed,
    },
});

export const createRequestSuccess: TCreateRequestSuccess = () => ({
    type: CREATE_REQUEST_SUCCESS,
});

export const conciergeServiceFailed: TConciergeServiceFailed = (error, type) => ({
    type: CONCIERGE_SERVICE_FAILED,
    payload: {
        error: {
            error,
            type,
        },
    },
});

export const conciergeTrackingProgressOrderRoomService: TGetConciergeTrackingProgress = (
    onSuccess,
    onFailed,
) => ({
    type: CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const conciergeTrackingProgressOrderRoomServiceSuccess: TGetConciergeTrackingProgressSuccess = (
    conciergeTrakingProgress,
) => ({
    type: CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS,
    payload: {
        conciergeTrakingProgress,
    },
});

export const deleteConciergeOrder: TDeleteConciergeOrder = (id, type, onSuccess, onFailed) => ({
    type: DELETE_CONCIERGE_ORDER,
    payload: {
        id,
        type,
        onSuccess,
        onFailed,
    },
});

export const deleteConciergeOrderSuccess: TDeleteConciergeOrderSuccess = () => ({
    type: DELETE_CONCIERGE_ORDER_SUCCESS,
});

export const wakeupCall: TWakeupCall = (wakeup_call_time, onSuccess, onFailed) => ({
    type: WAKEUP_CALL,
    payload: {
        wakeup_call_time,
        onSuccess,
        onFailed,
    },
});

export const wakeupCallSuccess: TWakeupCallSuccess = () => ({
    type: WAKEUP_CALL_SUCCESS,
});

export const getwakeupCall: TGetWakeupCall = (onSuccess, onFailed) => ({
    type: GET_WAKEUP_CALL,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const getwakeupCallSuccess: TGETWakeupCallSuccess = (get_wakeup_call) => ({
    type: GET_WAKEUP_CALL_SUCCESS,
    payload: {
        get_wakeup_call,
    },
});

export const roomCleaningService: TRoomCleaningService = () => ({
    type: ROOM_CLEANING_SERVICES,
});

export const clearWakeUp: any = () => ({
    type: CLEAR_WAKE_UP_SERVICE,
});
