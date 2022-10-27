import { ISpaTrackingProgressOrderRoomService } from './spa';

export const SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE = 'SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE';
export const SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS =
    'SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS';
export const GET_SPA_All_TREATMENTS = 'GET_SPA_All_TREATMENTS'

export type TSpaTrackingProgressOrderRoomService = (
    onSuccess?: (data: ISpaTrackingProgressOrderRoomService[]) => void,
    onFailed?: () => void,
) => {
    type: typeof SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE;
    payload: {
        onSuccess: typeof onSuccess;
        onFailed: typeof onFailed;
    };
};

export type TSpaTrackingProgressOrderRoomServiceSuccess = (
    spaTrakingProgress: ISpaTrackingProgressOrderRoomService[],
) => {
    type: typeof SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS;
    payload: {
        spaTrakingProgress: typeof spaTrakingProgress;
    };
};
