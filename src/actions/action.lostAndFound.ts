import { ILostAndFound } from '../types/lostAndFound';
import { IError } from '../types/responseApi';

export const POST_LOST_AND_FOUND = 'POST_LOST_AND_FOUND';
export const LOST_AND_FOUND_SUCCESS = 'LOST_AND_FOUND_SUCCESS';
export const LOST_AND_FOUND_FAILED = 'LOST_AND_FOUND_FAILED';

export const postLostAndFoundRequest = (
    body: ILostAndFound,
    onSuccess?: () => void,
    onFailed?: () => void,
) => ({
    type: POST_LOST_AND_FOUND as typeof POST_LOST_AND_FOUND,
    payload: {
        body,
        onSuccess,
        onFailed,
    },
});

export const postLostAndFoundRequestSuccess = (data: any) => ({
    type: LOST_AND_FOUND_SUCCESS as typeof LOST_AND_FOUND_SUCCESS,
    payload: {
        data,
    },
});

export const postLostAndFoundRequestFailed = (error: any, type: string) => ({
    type: LOST_AND_FOUND_FAILED as typeof LOST_AND_FOUND_FAILED,
    payload: {
        error: {
            error,
            type,
        } as IError,
    },
});

export type ActionLostAndFoundType = ReturnType<
    | typeof postLostAndFoundRequestFailed
    | typeof postLostAndFoundRequestSuccess
    | typeof postLostAndFoundRequest
>;
