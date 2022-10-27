import {
    APP_UPDATE,
    APP_UPDATE_SUCCESS
} from '../types/action.app';

export const appUpdate = (onSuccess: any, onFailed: any) => ({
    type: APP_UPDATE,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const appUpdateSuccess = (app_update: any) => ({
    type: APP_UPDATE_SUCCESS,
    payload: {
        app_update
    },
});