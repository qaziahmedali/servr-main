import { createLogic } from 'redux-logic';
import {
    GET_EXPERIENCE,
    getExperience,
    getHotelMap,
    // GET_SPA_TREATMENT,
    // RESERVE_SPA,
    // ORDER_ROOM_SPA,
    // spaFailed,
    getExperienceSuccess,
    // getSpaTreatment,
    // getSpaTreatmentSuccess,
    // reserveSpa,
    // orderRoomSpa,
    // reserveSpaSuccess,
    // orderRoomSpaSuccess,
} from '../actions/action.experience';
import { IDependencies, ISuccessGetExperience } from '../types/responseApi';
import {
    GET_EXPERIENCE_API,
    //  GET_PROMOTION_TREATMENT_API,
    //   BOOKING_PROMOTION
} from '../constants/api';
import { AxiosResponse } from 'axios';
import { handleError, IRulesFormValidation, handleFormValidation } from '../utils/handleLogic';
import { printUrl } from '../utils/formating';
import { format } from 'date-fns';
import { Alert } from 'react-native';

const getExperienceLogic = createLogic({
    type: GET_EXPERIENCE,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof getExperience>>,
        dispatch,
        done,
    ) {
        // const { hotel_id} = action.payload;
        httpClient
            .get(printUrl(GET_EXPERIENCE_API, action.payload.idHotel.toString()), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetExperience>) => {
                if (__DEV__) {
                    console.log(`${action.type}: `, response);
                    console.log('EXPERIENCE Response', response);
                }
                dispatch(
                    getExperienceSuccess({
                        ...response.data.data,
                        // logo_url: [response.data.logo_url as any, response.data.logo_url as any],
                        experiences: response.data,
                    }),
                );

                return response.data;
            })
            .then((response) => {
                // console.log('Heloo from logic.EXPERIENCE  = ', response.data);
                //TODO: transform logo url string to array string
                // dispatch(
                //     getExperienceSuccess({
                //         ...response.data,
                //         logo_url: [response.data.logo_url as any, response.data.logo_url as any],
                //         experiences:response
                //     }),
                // );

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response);
                // handleError({
                //     error,
                //     dispatch,
                //     failedAction: spaFailed(error, action.type),
                //     type: action.type,
                //     onFailed: action.payload.onFailed,
                // });
            })
            .then(() => done());
    },
});

// const getSpaTreatmentLogic = createLogic({
//     type: GET_PROMOTION_TREATMENT,
//     process(
//         { httpClient, getState, action }: IDependencies<ReturnType<typeof getSpaTreatment>>,
//         dispatch,
//         done,
//     ) {
//         httpClient
//             .get(printUrl(GET_PROMOTION_TREATMENT_API, action.payload.spaId.toString()), {
//                 headers: {
//                     Accept: 'application/json',
//                     Authorization: `Bearer ${getState().account.access_token}`,
//                 },
//             })
//             .then((response: AxiosResponse<ISuccessGetSpaTreatment>) => {
//                 if (__DEV__) {
//                     console.log(`${action.type}: `, response);
//                 }

//                 return response.data;
//             })
//             .then((response) => {
//                 dispatch(getSpaTreatmentSuccess(response.data));

//                 if (action.payload.onSuccess) {
//                     action.payload.onSuccess(response.data);
//                 }
//             })
//             .catch((error) => {
//                 handleError({
//                     error,
//                     dispatch,
//                     failedAction: spaFailed(error, action.type),
//                     type: action.type,
//                     onFailed: action.payload.onFailed,
//                 });
//             })
//             .then(() => done());
//     },
// });

// const reserveSpaLogic = createLogic({
//     type: RESERVE_PROMOTION,
//     validate({ action }: IDependencies<ReturnType<typeof reserveSpa>>, allow, reject) {
//         const { number_people, treatments, date, time } = action.payload.body;
//         const rules: IRulesFormValidation[] = [
//             {
//                 isValid: treatments.length > 0,
//                 message: 'Please select at least one treatment',
//             },
//             {
//                 isValid: time !== '',
//                 message: 'Please select your booking time',
//             },
//             {
//                 isValid: number_people > 0,
//                 message: 'Number of people must be greater than 0',
//             },
//             {
//                 isValid: date !== '',
//                 message: 'Please select your booking date',
//             },
//         ];

//         handleFormValidation(
//             rules,
//             () => allow(action),
//             (rule) => {
//                 Alert.alert('Attention', rule.message);
//                 if (action.payload.onFailed) {
//                     action.payload.onFailed();
//                 }
//                 reject(spaFailed(rule.message, action.type));
//             },
//         );
//     },
//     process({ httpClient, getState, action }: IDependencies<ReturnType<typeof reserveSpa>>, dispatch, done) {
//         const { spa_id, number_people, treatments, date, time } = action.payload.body;

//         httpClient
//             .post(
//                 printUrl(BOOKING_PROMOTION, action.payload.body.spa_id.toString()),
//                 {
//                     spa_id,
//                     people_number: number_people,
//                     treatments,
//                     booking_date: `${format(date, 'YYYY-MM-DD')} ${format(time, 'HH:mm')}`,
//                     booking_type: 'normal_reservation',
//                 },
//                 {
//                     headers: {
//                         Accept: 'application/json',
//                         Authorization: `Bearer ${getState().account.access_token}`,
//                     },
//                 },
//             )
//             .then((response: AxiosResponse) => {
//                 if (__DEV__) {
//                     console.log(`${action.type}: `, response);
//                 }

//                 return response.data;
//             })
//             .then(() => {
//                 dispatch(reserveSpaSuccess());

//                 if (action.payload.onSuccess) {
//                     action.payload.onSuccess();
//                 }
//             })
//             .catch((error) => {
//                 handleError({
//                     error,
//                     dispatch,
//                     failedAction: spaFailed(error, action.type),
//                     type: action.type,
//                     onFailed: action.payload.onFailed,
//                 });
//             })
//             .then(() => done());
//     },
// });

// const orderRoomSpaLogic = createLogic({
//     type: ORDER_ROOM_PROMOTION,
//     validate({ action }: IDependencies<ReturnType<typeof orderRoomSpa>>, allow, reject) {
//         const { number_people, treatments, date, time } = action.payload.body;
//         const rules: IRulesFormValidation[] = [
//             {
//                 isValid: treatments.length > 0,
//                 message: 'Please select at least one treatment',
//             },
//             {
//                 isValid: time !== '',
//                 message: 'Please select your booking time',
//             },
//             {
//                 isValid: number_people > 0,
//                 message: 'Number of people must be greater than 0',
//             },
//             {
//                 isValid: date !== '',
//                 message: 'Please select your booking date',
//             },
//         ];

//         handleFormValidation(
//             rules,
//             () => allow(action),
//             (rule) => {
//                 Alert.alert('Attention', rule.message);
//                 if (action.payload.onFailed) {
//                     action.payload.onFailed();
//                 }
//                 reject(spaFailed(rule.message, action.type));
//             },
//         );
//     },
//     process(
//         { httpClient, getState, action }: IDependencies<ReturnType<typeof orderRoomSpa>>,
//         dispatch,
//         done,
//     ) {
//         const { spa_id, number_people, treatments, date, time } = action.payload.body;

//         httpClient
//             .post(
//                 printUrl(BOOKING_PROMOTION, action.payload.body.spa_id.toString()),
//                 {
//                     spa_id,
//                     people_number: number_people,
//                     treatments,
//                     booking_date: `${format(date, 'YYYY-MM-DD')} ${format(time, 'HH:mm')}`,
//                     booking_type: 'room_service',
//                 },
//                 {
//                     headers: {
//                         Accept: 'application/json',
//                         Authorization: `Bearer ${getState().account.access_token}`,
//                     },
//                 },
//             )
//             .then((response: AxiosResponse) => {
//                 if (__DEV__) {
//                     console.log(`${action.type}: `, response);
//                 }

//                 return response.data;
//             })
//             .then(() => {
//                 dispatch(orderRoomSpaSuccess());

//                 if (action.payload.onSuccess) {
//                     action.payload.onSuccess();
//                 }
//             })
//             .catch((error) => {
//                 handleError({
//                     error,
//                     dispatch,
//                     failedAction: spaFailed(error, action.type),
//                     type: action.type,
//                     onFailed: action.payload.onFailed,
//                 });
//             })
//             .then(() => done());
//     },
// });

export default [
    getExperienceLogic,
    //  getSpaTreatmentLogic,
    //   reserveSpaLogic,
    //    orderRoomSpaLogic
];
