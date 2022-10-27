export const APP_UPDATE = 'APP_UPDATE';
export const APP_UPDATE_SUCCESS = 'APP_UPDATE_SUCCESS';

export type TAppUpdate<
    T = () => void,
    K = () => void
> = (
    onSuccess?: T,
    onFailed?: K,
) => {
    type: typeof APP_UPDATE;
    payload: {
        onSuccess?: T;
        onFailed?: K;
    };
};

export type TAppUpdateSuccess<T = any> = (
    app_update : T,
) => {
    type: typeof APP_UPDATE_SUCCESS;
    payload: {
        app_update : T;
    };
};

export type ActionAppType = ReturnType<
    | TAppUpdate
    | TAppUpdateSuccess
>;
