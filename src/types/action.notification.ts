import { IError } from './responseApi';

export const GET_INIT_NOTIF = 'GET_INIT_NOTIF';
export const GET_INIT_NOTIF_SUCCESS = 'GET_INIT_NOTIF_SUCCESS';

export const GET_FOREGROUND_NOTIF = 'GET_FOREGROUND_NOTIF';
export const REMOVE_GET_FOREGROUND_NOTIF = 'REMOVE_GET_FOREGROUND_NOTIF';

export const GET_BACKGROUND_NOTIF = 'GET_BACKGROUND_NOTIF';
export const REMOVE_GET_BACKGROUND_NOTIF = 'REMOVE_GET_BACKGROUND_NOTIF';

export const ON_TOKEN_NOTIF_REFRESH = 'ON_TOKEN_NOTIF_REFRESH';
export const REMOVE_ON_TOKEN_NOTIF_REFRESH = 'REMOVE_ON_TOKEN_NOTIF_REFRESH';

export const REQUEST_NOTIF_PERMISSION = 'REQUEST_NOTIF_PERMISSION';
export const REQUEST_NOTIF_PERMISSION_SUCCESS = 'REQUEST_NOTIF_PERMISSION_SUCCESS';

export const NOTIF_FAILED = 'NOTIF_FAILED';

// TODO: dont know the shape of data, check all callback

export type TGetInitNotif<T = (data: object | null) => void> = (
    onCallback?: T,
) => {
    type: typeof GET_INIT_NOTIF;
    payload: {
        onCallback?: T;
    };
};

export type TGetInitNotifSuccess = () => {
    type: typeof GET_INIT_NOTIF_SUCCESS;
};

export interface IForegroundNotifData {
    title: string;
    body: string;
    payload: object | null;
}

export type TGetForegroundNotif<T = (data: IForegroundNotifData) => void> = (
    onCallback?: T,
) => {
    type: typeof GET_FOREGROUND_NOTIF;
    payload: {
        onCallback?: T;
    };
};

export type TRemoveGetForegroundNotif = () => {
    type: typeof REMOVE_GET_FOREGROUND_NOTIF;
};

export type TGetBackgroundNotif<T = (data: object | null) => void> = (
    onCallback?: T,
) => {
    type: typeof GET_BACKGROUND_NOTIF;
    payload: {
        onCallback?: T;
    };
};

export type TRemoveGetBackgroundNotif = () => {
    type: typeof REMOVE_GET_BACKGROUND_NOTIF;
};

export type TOnTokenNotifRefresh<T = (token: string) => void> = (
    onCallback?: T,
) => {
    type: typeof ON_TOKEN_NOTIF_REFRESH;
    payload: {
        onCallback?: T;
    };
};

export type TRemoveOnTokenNotifRefresh = () => {
    type: typeof REMOVE_ON_TOKEN_NOTIF_REFRESH;
};

export type TRequestNotifPermission<T = () => void> = (
    onCallback?: T,
) => {
    type: typeof REQUEST_NOTIF_PERMISSION;
    payload: {
        onCallback?: T;
    };
};

export type TRequestNotifPermissionSuccess = () => {
    type: typeof REQUEST_NOTIF_PERMISSION_SUCCESS;
};

export type TNotifFailed<T = any, K = string> = (
    error: T,
    type: K,
) => {
    type: typeof NOTIF_FAILED;
    payload: {
        error: IError;
    };
};

export type ActionNotificationType =
    | ReturnType<TGetInitNotif>
    | ReturnType<TGetInitNotifSuccess>
    | ReturnType<TGetForegroundNotif>
    | ReturnType<TRemoveGetForegroundNotif>
    | ReturnType<TGetBackgroundNotif>
    | ReturnType<TRemoveGetBackgroundNotif>
    | ReturnType<TOnTokenNotifRefresh>
    | ReturnType<TRemoveOnTokenNotifRefresh>
    | ReturnType<TRequestNotifPermission>
    | ReturnType<TRequestNotifPermissionSuccess>
    | ReturnType<TNotifFailed>;
