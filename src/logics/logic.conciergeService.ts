import { createLogic } from 'redux-logic';
import {
    GET_CONCIERGE_SERVICE_ITEMS,
    CREATE_REQUEST,
    TGetConciergeServiceItems,
    TCreateRequest,
    CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    TGetConciergeTrackingProgress,
    TGetConciergeTrackingProgressSuccess,
    DELETE_CONCIERGE_ORDER,
    TDeleteConciergeOrder,
    WAKEUP_CALL,
    TWakeupCall,
    GET_WAKEUP_CALL,
    TGetWakeupCall,
} from '../types/action.conciergeService';
import {
    CONCIERGE_SERVICE_ITEMS,
    CONCIERGE_CREATE_REQUEST,
    CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_API,
    DELETE_CONCIERGE_ORDER_API,
    WAKEUP_CALL_API,
    GET_WAKEUP_CALL_API,
} from '../constants/api';
import {
    IDependencies,
    ISuccessConciergeServiceItems,
    ISuccessCreateRequest,
    TSuccessConciergeTrackingProgressSuccess,
    ISuccessDeleteOrder,
    ISuccessWakeupCall,
} from '../types/responseApi';
import { AxiosResponse } from 'axios';
import {
    getConciergeServiceItemsSuccess,
    conciergeServiceFailed,
    createRequestSuccess,
    conciergeTrackingProgressOrderRoomServiceSuccess,
    deleteConciergeOrderSuccess,
    wakeupCallSuccess,
    getwakeupCallSuccess,
    getwakeupCall,
} from '../actions/action.conciergeService';
import { handleError, IRulesFormValidation, handleFormValidation, toast } from '../utils/handleLogic';
import moment from 'moment';
import { printUrl } from '../utils/formating';
import { conciergeService } from '../utils/navigationControl';

const getConciergeServiceItemsLogic = createLogic({
    type: GET_CONCIERGE_SERVICE_ITEMS,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<TGetConciergeServiceItems>>,
        dispatch,
        done,
    ) {
        const { code } = action.payload;
        httpClient
            .get(printUrl(CONCIERGE_SERVICE_ITEMS, code.toString()), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessConciergeServiceItems>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'concerige service items');
                return response.data;
            })
            .then((response) => {
                dispatch(getConciergeServiceItemsSuccess(response));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'concerige service items');
                handleError({
                    error,
                    dispatch,
                    failedAction: conciergeServiceFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const getWakeUpCallLogic = createLogic({
    type: GET_WAKEUP_CALL,
    process({ httpClient, getState, action }: IDependencies<ReturnType<TGetWakeupCall>>, dispatch, done) {
        httpClient
            .get(GET_WAKEUP_CALL_API, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<any>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'concerige service items');
                return response.data;
            })
            .then((response) => {
                dispatch(getwakeupCallSuccess(response.wakeup_call));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'concerige service items');
                handleError({
                    error,
                    dispatch,
                    failedAction: {},
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const createRequestLogic = createLogic({
    type: CREATE_REQUEST,
    // validate({ action }: IDependencies<ReturnType<TCreateRequest>>, allow, reject) {
    //     const rules: IRulesFormValidation[] = [
    //         { isValid: action.payload.items.length > 0, message: 'At least select one service' },
    //     ];

    //     handleFormValidation(
    //         rules,
    //         () => allow(action),
    //         (rule) => {
    //             toast(rule.message, 'Attention');
    //             if (action.payload.onFailed) {
    //                 action.payload.onFailed();
    //             }
    //             reject(conciergeServiceFailed(rule.message, action.type));
    //         },
    //     );
    // },

    process({ httpClient, getState, action }: IDependencies<ReturnType<any>>, dispatch, done) {
        console.log(action.payload.items);
        httpClient
            .post(CONCIERGE_CREATE_REQUEST, action.payload.items, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessCreateRequest>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'request items');

                return response.data;
            })
            .then((response) => {
                dispatch(createRequestSuccess());

                if (action.payload.onSuccess) {
                    action.payload.onSuccess(response.message);
                }
            })
            .catch((error) => {
                console.log(error.response, 'request items');
                handleError({
                    error,
                    dispatch,
                    failedAction: conciergeServiceFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const getConciergeTrackingProgressLogic = createLogic({
    type: CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<TGetConciergeTrackingProgress>>,
        dispatch,
        done,
    ) {
        httpClient
            .get(CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_API, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<TSuccessConciergeTrackingProgressSuccess>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }

                console.log(response, 'concierge tracking progress');

                return response.data;
            })
            .then((response) => {
                dispatch(conciergeTrackingProgressOrderRoomServiceSuccess(response));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'concierge tracking progress');
                handleError({
                    error,
                    dispatch,
                    failedAction: conciergeServiceFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const deleteConciergeOrderLogic = createLogic({
    type: DELETE_CONCIERGE_ORDER,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<TDeleteConciergeOrder>>,
        dispatch,
        done,
    ) {
        const { id, type } = action.payload;
        console.log('data', id, type);
        httpClient
            .delete(printUrl(DELETE_CONCIERGE_ORDER_API, [id.toString(), type.toString()]), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessDeleteOrder>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'delete concierge order');
                return response.data;
            })
            .then((response) => {
                dispatch(deleteConciergeOrderSuccess());

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'delete concierge order');
                // handleError({
                //     error,
                //     dispatch,
                //     failedAction: restaurantFailed(error, action.type),
                //     type: action.type,
                //     onFailed: action.payload.onFailed,
                // });
            })
            .then(() => done());
    },
});

const wakeupCallLogic = createLogic({
    type: WAKEUP_CALL,
    process({ httpClient, getState, action }: IDependencies<ReturnType<TWakeupCall>>, dispatch, done) {
        const { days, wakeup_call_time, wakeup_call_note, is_active } = action.payload.wakeup_call_time;
        console.log('helllo ==============>', action.payload);
        httpClient
            .post(
                WAKEUP_CALL_API,
                {
                    wakeup_call_time,
                    wakeup_call_note,
                    is_active,
                    days,
                },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${getState().account.checkin_token}`,
                        // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                    },
                },
            )
            .then((response: AxiosResponse<ISuccessWakeupCall>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'wakeup call we have called');
                return response.data;
            })
            .then((response) => {
                console.log('Hello response wake up call api', response);
                dispatch(
                    getwakeupCall(
                        () => {
                            console.log('Success api is called of the wake up');
                        },
                        () => {
                            console.log('failed api is called of the wake up');
                        },
                    ),
                );

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'wakeup call');
                handleError({
                    error,
                    dispatch,
                    failedAction: {
                        message: getState().language.error_in_the_wake_up_call,
                    },
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

export default [
    getConciergeServiceItemsLogic,
    createRequestLogic,
    getConciergeTrackingProgressLogic,
    deleteConciergeOrderLogic,
    wakeupCallLogic,
    getWakeUpCallLogic,
];
