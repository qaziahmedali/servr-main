import { createLogic } from 'redux-logic';
import {
    GET_PROMOTION,
    getPromotion,
    getPromotionSuccess,
    GET_PROMOTION_DETAILS,
    getPromotionDetailsSuccess,
    getPromotionDetails,
    ORDER_PROMOTION,
    orderPromotonSuccess,
    orderPromotion,
    promotionFailed,
} from '../actions/action.promotion';
import {
    IDependencies,
    ISuccessGetPromotion,
    ISuccessGetPromotionDetails,
    ISuccessCreateRequest,
} from '../types/responseApi';
import {
    GET_PROMOTION_API,
    GET_SPECIFIC_PROMOTION_API,
    GET_EXPERIENCE_API,
    ORDER_PROMOTION_API,
} from '../constants/api';
import { AxiosResponse } from 'axios';
import { handleError, IRulesFormValidation, handleFormValidation, toast } from '../utils/handleLogic';
import { printUrl } from '../utils/formating';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import { isAfter } from 'date-fns';
import moment from 'moment';

const getPromotionLogic = createLogic({
    type: GET_PROMOTION,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof getPromotion>>,
        dispatch,
        done,
    ) {
        httpClient
            .get(GET_PROMOTION_API + action.payload.idButton.toString(), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.checkin_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetPromotion>) => {
                if (__DEV__) {
                    console.log(`${action.type}: `, response);
                    console.log('GET_SPECIFIC_PROMOTION_API Response', response);
                }

                //  dispatch(
                //     getPromotionSuccess({
                //         ...response.data.data,
                //         // logo_url: [response.data.logo_url as any, response.data.logo_url as any],
                //         promotions:response.data
                //     }),
                // );

                return response.data;
            })
            .then((response) => {
                console.log('Heloo from logic.promotion  = ', response);
                //TODO: transform logo url string to array string
                // const a ={
                //     id:0,
                //     name:'',
                //     logo_url:[],
                //     promotions:response
                // }
                dispatch(
                    getPromotionSuccess({
                        ...response.data,
                        // logo_url: [response.data.logo_url as any, response.data.logo_url as any],
                        promotions: response,
                    }),
                );

                // if (action.payload.onSuccess) {
                //     action.payload.onSuccess({
                //         ...response.data,
                //         logo_url: [response.data.logo_url as any, response.data.logo_url as any],
                //     });
                // }
            })
            .catch((error) => {
                console.log(error);
                // handleError({
                //     error,
                //     dispatch,
                //     failedAction: spaFailed(error, action.type),
                //     type: action.type,
                //     onFailed: action.payload.onFailed,
                // });
            })
            .then(() => {
                done();
                console.log(
                    'all promotion details url 22' + GET_PROMOTION_API + action.payload.idButton.toString(),
                );
            });
    },
});

const getPromotionDetailsLogic = createLogic({
    type: GET_PROMOTION_DETAILS,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof getPromotionDetails>>,
        dispatch,
        done,
    ) {
        httpClient
            .get(
                GET_SPECIFIC_PROMOTION_API +
                    action.payload.idHotel.toString() +
                    '/' +
                    action.payload.idButton.toString(),
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${getState().account.checkin_token}`,
                        // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                    },
                },
            )
            .then((response: AxiosResponse<ISuccessGetPromotionDetails>) => {
                if (__DEV__) {
                    console.log(`${action.type}: `, response);
                    console.log('PromotionDetails Response', response);
                }
                // if(action.payload.onSuccess){
                //     action.payload.onSuccess()
                // }
                return response.data;
            })
            .then((response) => {
                console.log('PromotionDetails Response 111', response);

                dispatch(
                    getPromotionDetailsSuccess({
                        ...response.data,
                        // logo_url: [response.data.logo_url as any, response.data.logo_url as any],
                        PromotionDetails: response,
                    }),
                );

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                // handleError({
                //     error,
                //     dispatch,
                //     failedAction: spaFailed(error, action.type),
                //     type: action.type,
                //     onFailed: action.payload.onFailed,
                // });
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                console.log('ERROR:::', error);
            })
            .then(() => {
                done();
                console.log(
                    'promotion details url 22' +
                        GET_SPECIFIC_PROMOTION_API +
                        action.payload.idHotel.toString() +
                        '/' +
                        action.payload.idButton.toString(),
                );
            });
    },
});

const orderPromotionLogic = createLogic({
    type: ORDER_PROMOTION,
    validate({ action,getState }: IDependencies<ReturnType<typeof orderPromotion>>, allow, reject) {
        const { body } = action.payload;
        const rules: IRulesFormValidation[] = [
            {
                isValid: body.start_date !== '',
                message: getState().language.please_select_your_booking_date_and_time,
            },
            {
                isValid: body.end_date !== '',
                message: getState().language.please_select_your_booking_end_date_and_time,
            },
            {
                isValid: isAfter(body.end_date, body.start_date),
                message: getState().language.booking_date_must_be_before_booking_end_date,
            },
        ];

        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast( rule.message);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(promotionFailed(rule.message, action.type));
            },
        );
    },
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof orderPromotion>>,
        dispatch,
        done,
    ) {
        const { body } = action.payload;
        console.log('bodyyyy', body);
        const { start_date, end_date, table_id } = body;

        httpClient
            .post(
                ORDER_PROMOTION_API,
                {
                    experience_button_id: table_id,
                    start_date: moment(start_date).format('YYYY-MM-DD HH:mm'),
                    end_date: moment(end_date).format('YYYY-MM-DD HH:mm'),
                },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${getState().account.checkin_token}`,
                        // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                    },
                },
            )
            .then((response: AxiosResponse<ISuccessCreateRequest>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'order promotion');
                return response.data;
            })
            .then((response) => {
                dispatch(orderPromotonSuccess());
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'order promotion');
                handleError({
                    error,
                    dispatch,
                    failedAction: promotionFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

export default [getPromotionLogic, getPromotionDetailsLogic, orderPromotionLogic];
