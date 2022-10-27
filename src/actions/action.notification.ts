import {
    TGetInitNotif,
    GET_INIT_NOTIF,
    TGetInitNotifSuccess,
    GET_INIT_NOTIF_SUCCESS,
    TGetForegroundNotif,
    GET_FOREGROUND_NOTIF,
    TRemoveGetForegroundNotif,
    REMOVE_GET_FOREGROUND_NOTIF,
    TGetBackgroundNotif,
    GET_BACKGROUND_NOTIF,
    TRemoveGetBackgroundNotif,
    REMOVE_GET_BACKGROUND_NOTIF,
    TOnTokenNotifRefresh,
    ON_TOKEN_NOTIF_REFRESH,
    TRemoveOnTokenNotifRefresh,
    REMOVE_ON_TOKEN_NOTIF_REFRESH,
    TRequestNotifPermission,
    REQUEST_NOTIF_PERMISSION,
    TRequestNotifPermissionSuccess,
    REQUEST_NOTIF_PERMISSION_SUCCESS,
    TNotifFailed,
    NOTIF_FAILED,
} from '../types/action.notification';

export const getInitNotif: TGetInitNotif = (onCallback) => ({
    type: GET_INIT_NOTIF,
    payload: {
        onCallback,
    },
});

export const getInitNotifSuccess: TGetInitNotifSuccess = () => ({
    type: GET_INIT_NOTIF_SUCCESS,
});

export const getForegroundNotif: TGetForegroundNotif = (onCallback) => ({
    type: GET_FOREGROUND_NOTIF,
    payload: {
        onCallback,
    },
});

export const removeGetForegroundNotif: TRemoveGetForegroundNotif = () => ({
    type: REMOVE_GET_FOREGROUND_NOTIF,
});

export const getBackgroundNotif: TGetBackgroundNotif = (onCallback) => ({
    type: GET_BACKGROUND_NOTIF,
    payload: {
        onCallback,
    },
});

export const removeGetBackgroundNotif: TRemoveGetBackgroundNotif = () => ({
    type: REMOVE_GET_BACKGROUND_NOTIF,
});

export const onTokenNotifRefresh: TOnTokenNotifRefresh = (onCallback) => ({
    type: ON_TOKEN_NOTIF_REFRESH,
    payload: {
        onCallback,
    },
});

export const removeOnTokenNotifRefresh: TRemoveOnTokenNotifRefresh = () => ({
    type: REMOVE_ON_TOKEN_NOTIF_REFRESH,
});

export const requestNotifPermission: TRequestNotifPermission = (onCallback) => ({
    type: REQUEST_NOTIF_PERMISSION,
    payload: {
        onCallback,
    },
});

export const requestNotifPermissionSuccess: TRequestNotifPermissionSuccess = () => ({
    type: REQUEST_NOTIF_PERMISSION_SUCCESS,
});

export const notifFailed: TNotifFailed = (error, type) => ({
    type: NOTIF_FAILED,
    payload: {
        error: {
            error,
            type,
        },
    },
});
