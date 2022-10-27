import {
    BOOK_ADDITIONAL_SERVICE,
    BOOK_ADDITIONAL_SERVICE_SUCCESS,
    BOOK_ADDITIONAL_SERVICE_FAILED,
    TBookAdditionalService,
    TBookAdditionalServiceSuccess,
    TBookAdditioalServiceFailed,
} from '../types/action.additionalservice';

export const bookAdditionalService: TBookAdditionalService = (data, onSuccess, onFailed) => ({
    type: BOOK_ADDITIONAL_SERVICE,
    payload: {
        data,
        onSuccess,
        onFailed,
    },
});

export const bookAdditionalServiceSuccess: TBookAdditionalServiceSuccess = () => ({
    type: BOOK_ADDITIONAL_SERVICE_SUCCESS,
});

export const bookAdditioalServiceFailed: TBookAdditioalServiceFailed = (error, type) => ({
    type: BOOK_ADDITIONAL_SERVICE_FAILED,
    payload: {
        error: {
            error,
            type,
        },
    },
});
