import { ILostAndFound } from './lostAndFound';
import { IError } from './responseApi';

export const POST_LOST_AND_FOUND = 'POST_LOST_AND_FOUND';
export const LOST_AND_FOUND_SUCCESS = 'LOST_AND_FOUND_SUCCESS';
export const LOST_AND_FOUND_FAILURE = 'LOST_AND_FOUND_FAILURE';

export type TPostLostAndFound<T = ILostAndFound, K = () => void> = (
    data: T,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof POST_LOST_AND_FOUND;
    payload: {
        data: T;
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TPostLostAndFoundSuccess = () => {
    type: typeof LOST_AND_FOUND_SUCCESS;
};

export type TPostLostAndFoundFailed<T = any, K = string> = (
    error: T,
    type: K,
) => {
    type: typeof LOST_AND_FOUND_FAILURE;
    payload: {
        error: IError;
    };
};

export type ActionRestaurantType = ReturnType<
    TPostLostAndFound | TPostLostAndFoundFailed | TPostLostAndFoundSuccess
>;
