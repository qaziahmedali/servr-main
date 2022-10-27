import { createLogic } from 'redux-logic';
import {
    GET_SPA,
    getSpa,
    GET_SPA_TREATMENT,
    RESERVE_SPA,
    ORDER_ROOM_SPA,
    spaFailed,
    getSpaSuccess,
    getSpaTreatment,
    getSpaTreatmentSuccess,
    reserveSpa,
    orderRoomSpa,
    reserveSpaSuccess,
    orderRoomSpaSuccess,
    spaTrackingProgressOrderRoomServiceSuccess,
    SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS,
    spaTrackingProgressOrderRoomService,
    DELETE_SPA_ORDER,
    deleteSpaOrder,
    TDeleteOrder,
    deleteSpaOrderSuccess,
    getSpaAllTreatmentSuccess
} from '../actions/action.spa';
import {
    IDependencies,
    ISuccessGetSpa,
    ISuccessGetSpaTreatment,
    ISuccessSpaTrackingProgressOrderRoomService,
    ISuccessDeleteOrder,
} from '../types/responseApi';
import {
    GET_SPA_API,
    GET_SPA_TREATMENT_API,
    BOOKING_SPA,
    SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_API,
    DELETE_SPA_ORDER_API,
    GET_SPA_ALL_TREATMENT_CATEGORIES,
} from '../constants/api';
import { AxiosResponse } from 'axios';
import { handleError, IRulesFormValidation, handleFormValidation, toast } from '../utils/handleLogic';
import { printUrl } from '../utils/formating';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import moment from 'moment';
import { GET_SPA_All_TREATMENTS } from '../types/action.spa';
import { deleteOrderSuccess, restaurantFailed } from '../actions/action.restaurant';
import { DELETE_SPA } from '../types/action.restaurant';
// import {SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE, TSpaTrackingProgressOrderRoomServiceSuccess} from '../types/action.spa'

const getSpaLogic = createLogic({
    type: GET_SPA,
    process({ httpClient, getState, action }: IDependencies<ReturnType<typeof getSpa>>, dispatch, done) {
        const { code } = action.payload;
        console.log('actionnnn', action);
        httpClient
            .get(printUrl(GET_SPA_API, code?.toString()), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetSpa>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get spa');
                return response.data;
            })
            .then((response) => {
                // TODO: transform logo url string to array string
                dispatch(
                    getSpaSuccess(response.data),
                );

                if (action.payload.onSuccess) {
                    action.payload.onSuccess(response.data);
                }
            })
            .catch((error) => {
                console.log(error.response, 'get spa');
                handleError({
                    error,
                    dispatch,
                    failedAction: spaFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const getSpaTreatmentLogic = createLogic({
    type: GET_SPA_TREATMENT,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof getSpaTreatment>>,
        dispatch,
        done,
    ) {
        const { spaId, code } = action.payload;
        httpClient
            .get(printUrl(GET_SPA_TREATMENT_API, [spaId.toString(), code.toString()]), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetSpaTreatment>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get spa treatment');
                return response.data;
            })
            .then((response) => {
                dispatch(getSpaTreatmentSuccess(response.data));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess(response.data);
                }
            })
            .catch((error) => {
                console.log(error.response, 'get spa treatment');
                handleError({
                    error,
                    dispatch,
                    failedAction: spaFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const getSpaAllTreatmentsLogic = createLogic({
    type: GET_SPA_All_TREATMENTS,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof getSpaTreatment>>,
        dispatch,
        done,
    ) {
        const { spaId } = action.payload;
        httpClient
            .get(printUrl(GET_SPA_ALL_TREATMENT_CATEGORIES, [spaId.toString()]), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: any) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get spa treatment');
                return response;
            })
            .then((response) => {
                dispatch(getSpaAllTreatmentSuccess(response.data));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess(response.data);
                }
            })
            .catch((error) => {
                console.log(error.response, 'get spa treatment');
                handleError({
                    error,
                    dispatch,
                    failedAction: spaFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const reserveSpaLogic = createLogic({
    type: RESERVE_SPA,
    validate({ action, getState }: IDependencies<ReturnType<typeof reserveSpa>>, allow, reject) {
        const { number_people, treatments, date, time } = action.payload.body;
        const rules: IRulesFormValidation[] = [
            {
                isValid: treatments.length > 0,
                message: getState().language.please_select_at_least_one_treatment,
            },
            {
                isValid: time !== '',
                message: getState().language.plese_select_your_booking_time,
            },
            {
                isValid: number_people > 0,
                message: getState().language.number_of_people_must_be_greater_than_zero,
            },
            {
                isValid: date !== '',
                message: getState().language.please_select_your_booking_date,
            },
        ];

        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(spaFailed(rule.message, action.type));
            },
        );
    },
    process({ httpClient, getState, action }: IDependencies<ReturnType<typeof reserveSpa>>, dispatch, done) {
        const { spa_id, number_people, treatments, date, time } = action.payload.body;
        httpClient
            .post(
                printUrl(BOOKING_SPA, action.payload.body.spa_id.toString()),
                {
                    spa_id,
                    people_number: number_people,
                    treatments,
                    booking_date: `${format(date, 'YYYY-MM-DD')} ${format(time, 'HH:mm')}`,
                    booking_type: 'normal_reservation',
                    current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    vip_note: action.payload.body.vip_note,
                    tip: action.payload.body.tip,
                    type: 'cash'
                },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${getState().account.checkin_token}`,
                        // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                    },
                },
            )
            .then((response: AxiosResponse) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'reserve spa');
                return response.data;
            })
            .then(() => {
                dispatch(reserveSpaSuccess());

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'reserve spa');
                handleError({
                    error,
                    dispatch,
                    failedAction: spaFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const orderRoomSpaLogic = createLogic({
    type: ORDER_ROOM_SPA,
    validate({ action, getState }: IDependencies<ReturnType<typeof orderRoomSpa>>, allow, reject) {
        const { number_people, treatments, date, time } = action.payload.body;
        const rules: IRulesFormValidation[] = [
            {
                isValid: treatments.length > 0,
                message: getState().language.please_select_at_least_one_treatment,
            },
            {
                isValid: time !== '',
                message: getState().language.plese_select_your_booking_time,
            },
            {
                isValid: number_people > 0,
                message: getState().language.number_of_people_must_be_greater_than_zero,
            },
            {
                isValid: date !== '',
                message: getState().language.please_select_your_booking_date,
            },
        ];

        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(spaFailed(rule.message, action.type));
            },
        );
    },
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof orderRoomSpa>>,
        dispatch,
        done,
    ) {
        const { spa_id, number_people, treatments, date, time, currency, card_number, card_cvv_number, card_expiry_month, cardholder_name, is_card_save, type, notes, tip } = action.payload.body;
        console.log(action.payload.body)
        console.log(BOOKING_SPA)
        httpClient
            .post(
                printUrl(BOOKING_SPA, action.payload.body.spa_id.toString()),
                {
                    spa_id,
                    treatments,
                    people_number: treatments.length,
                    booking_date: `${format(date, 'YYYY-MM-DD')} ${format(time, 'HH:mm')}`,
                    booking_type: 'room_service',
                    current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    currency: currency,
                    card_number: card_number,
                    cardholder_name: cardholder_name,
                    card_expiry_month: card_expiry_month,
                    card_cvv_number: card_cvv_number,
                    is_card_save: is_card_save,
                    type: type,
                    vip_note: notes,
                    tip: tip
                },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${getState().account.checkin_token}`,
                        // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                    },
                },
            )
            .then((response: AxiosResponse) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'spa order room service');
                return response.data;
            })
            .then(() => {
                dispatch(orderRoomSpaSuccess());

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'spa order room service');
                handleError({
                    error,
                    dispatch,
                    failedAction: spaFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const spaTrackingProgressOrderRoomServiceLogic = createLogic({
    type: SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    process(
        {
            httpClient,
            getState,
            action,
        }: IDependencies<ReturnType<typeof spaTrackingProgressOrderRoomService>>,
        dispatch,
        done,
    ) {
        httpClient
            .get(SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_API, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessSpaTrackingProgressOrderRoomService>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'spa tracking progress');
                return response.data;
            })
            .then((response) => {
                dispatch(spaTrackingProgressOrderRoomServiceSuccess(response.data));
                if (action.payload.onSuccess) {
                    action.payload.onSuccess(response.data);
                }
            })
            .catch((error) => {
                console.log(error.response, 'spa tracking progress');
                handleError({
                    error,
                    dispatch,
                    failedAction: spaFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const deleteSpaOrderLogic = createLogic({
    type: DELETE_SPA,
    process({ httpClient, getState, action }: IDependencies<ReturnType<TDeleteOrder>>, dispatch, done) {
        const { id } = action.payload;

        httpClient
            .delete(printUrl(DELETE_SPA_ORDER_API, id.toString()), {
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
                console.log(response, 'delete spa order');
                return response.data;
            })
            .then((response) => {
                dispatch(deleteOrderSuccess());

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'delete spa order');
                handleError({
                    error,
                    dispatch,
                    failedAction: restaurantFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

export default [
    getSpaLogic,
    getSpaTreatmentLogic,
    reserveSpaLogic,
    orderRoomSpaLogic,
    spaTrackingProgressOrderRoomServiceLogic,
    deleteSpaOrderLogic,
    getSpaAllTreatmentsLogic
];
