import { createLogic } from 'redux-logic';
import {
    ROOM_CLEANING_SERVICE,
    LAUNDRY_ORDER,
    laundryOrder,
    roomCleaningService,
    roomCleaningServiceSuccess,
    cleaningServiceFailed,
    laundryOrderSuccess,
    GET_LAUNDRY_SERVICES_MENU,
    getLaundryServicesMenu,
    getLaundryServicesMenuSuccess,
    roomCleaningItems,
    ROOM_CLEANING_ITEMS,
    getLaundryServices,
    getLaundryServicesSuccess,
} from '../actions/action.cleaningService';

import {
    IDependencies,
    ISuccessRoomCleaningService,
    ISuccessLaundryOrder,
    ISuccessGetLaundriesMenu,
    ISuccessGetRoomCleaningItems,
} from '../types/responseApi';
import {
    LAUNDRY_SERVICES_MENU_API,
    ROOM_CLEANING_SERVICE_API,
    LAUNDRY_ORDER_API,
    ROOM_CLEANING_ITEMS_API,
    LAUNDRY_SERVICES_API,
} from '../constants/api';
import { AxiosResponse } from 'axios';
import { handleError, handleFormValidation, IRulesFormValidation, toast } from '../utils/handleLogic';
import { printUrl } from '../utils/formating';
import { GET_LAUNDRY_SERVICE } from '../types/action.conciergeService';

const getLaundryServicesMenuLogic = createLogic({
    type: GET_LAUNDRY_SERVICES_MENU,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof getLaundryServicesMenu>>,
        dispatch,
        done,
    ) {
        const { code } = action.payload;
        httpClient
            .get(printUrl(LAUNDRY_SERVICES_MENU_API, code.toString()), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetLaundriesMenu>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get laundry service menu');
                return response.data;
            })
            .then((response) => {
                dispatch(
                    getLaundryServicesMenuSuccess({
                        ...response.data,
                        // logo_url: [response.data.logo_url as any, response.data.logo_url as any],
                        laundries: response,
                    }),
                );
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'get laundry service menu');
                handleError({
                    error,
                    dispatch,
                    failedAction: cleaningServiceFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => {
                done();
            });
    },
});

const getLaundryServicesLogic = createLogic({
    type: GET_LAUNDRY_SERVICE,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof getLaundryServices>>,
        dispatch,
        done,
    ) {
        const { code } = action.payload;
        console.log('COSINE', code);
        httpClient
            .get(printUrl(LAUNDRY_SERVICES_API, code.toString()), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                },
            })
            .then((response: AxiosResponse<any>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get laundry services new checking');
                return response.data;
            })
            .then((response) => {
                console.log('get laundry services', action.payload);
                dispatch(getLaundryServicesSuccess(response?.data));

                // if (action.payload.onSuccess) {
                //     action.payload.onSuccess(response?.data);
                //     console.log('laundry service data==============>', response);
                // }
            })
            .catch((error) => {
                console.log(error.response, 'get laundry service menu error ');
                handleError({
                    error,
                    dispatch,
                    failedAction: cleaningServiceFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => {
                done();
            });
    },
});

const getRoomCleaningItemsLogic = createLogic({
    type: ROOM_CLEANING_ITEMS,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof roomCleaningItems>>,
        dispatch,
        done,
    ) {
        const { code } = action.payload;
        httpClient
            .get(printUrl(ROOM_CLEANING_ITEMS_API, code.toString()), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetRoomCleaningItems>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get laundry service menu');
                return response.data;
            })
            .then((response) => {
                // dispatch(
                //     getLaundryServicesMenuSuccess({
                //         ...response.data,
                //         // logo_url: [response.data.logo_url as any, response.data.logo_url as any],
                //         laundries: response,
                //     }),
                // );
                console.log(response, 'items of the room cleaning');
                if (action.payload.onSuccess) {
                    action.payload.onSuccess(response);
                }
            })
            .catch((error) => {
                handleError({
                    error,
                    dispatch,
                    failedAction: {
                        message: getState().language.room_cleaing_items_error,
                    },
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => {
                done();
            });
    },
});

const roomCleaningServiceLogic = createLogic({
    type: ROOM_CLEANING_SERVICE,
    process(
        { httpClient, action, getState }: IDependencies<ReturnType<typeof roomCleaningService>>,
        dispatch,
        done,
    ) {
        httpClient
            .post(ROOM_CLEANING_SERVICE_API, action.payload.item, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessRoomCleaningService>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'room cleaning service');
                return response.data;
            })
            .then(() => {
                dispatch(roomCleaningServiceSuccess());

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'room cleaning service');
                handleError({
                    error,
                    dispatch,
                    failedAction: cleaningServiceFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

const laundryOrderLogic = createLogic({
    type: LAUNDRY_ORDER,
    validate({ action, getState }: IDependencies<ReturnType<any>>, allow, reject) {
        const { delivery_type, cloth_type, number_of_cloth } = action.payload.items;
        console.log(action.payload);
        // validation
        const rules: IRulesFormValidation[] = [
            {
                isValid: delivery_type != '',
                message: getState().language.please_select_delivery_type,
            },
            {
                isValid: cloth_type != '',
                message: getState().language.please_select_cloth_type,
            },
            {
                isValid: number_of_cloth != '',
                message: getState().language.please_select_number_of_clothes,
            },
        ];

        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message, getState().language.attention);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(cleaningServiceFailed('Error', action.type));
            },
        );
    },
    process(
        { httpClient, action, getState }: IDependencies<ReturnType<typeof laundryOrder>>,
        dispatch,
        done,
    ) {
        httpClient
            .post(LAUNDRY_ORDER_API, action.payload.items, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessLaundryOrder>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'laundry order');
                return response.data;
            })
            .then(() => {
                dispatch(laundryOrderSuccess());

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'laundry order');
                handleError({
                    error,
                    dispatch,
                    failedAction: cleaningServiceFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

export default [
    roomCleaningServiceLogic,
    laundryOrderLogic,
    getLaundryServicesMenuLogic,
    getRoomCleaningItemsLogic,
    getLaundryServicesLogic,
];
