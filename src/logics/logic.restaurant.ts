import { createLogic } from 'redux-logic';
import {
    GET_RESTAURANT_LIST,
    GET_RESTAURANT_CATEGORY_DISH,
    BOOK_A_TABLE,
    ORDER_ROOM_SERVICE,
    TGetRestaurantList,
    TGetRestaurantCategoryDish,
    TBookATable,
    TOrderRoomService,
    TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    TTrackingProgressOrderRoomService,
    DELETE_ORDER,
    TDeleteOrder,
    TGetRandomDishes,
    RANDOM_DISHES,
    DELETE_RESERVATION_ORDER,
    TDeleteReservationOrder,
} from '../types/action.restaurant';
import {
    IDependencies,
    ISuccessGetRestaurants,
    ISuccessGetRestaurantDishes,
    ISuccessBookATable,
    ISuccessTrackingProgressOrderRoomService,
    ISuccessDeleteOrder,
} from '../types/responseApi';
import {
    GET_RESTAURANTS,
    GET_RESTAURANT_DISHES,
    CREATE_BOOK_A_TABLE,
    CREATE_ROOM_SERVICE_ORDER,
    TRACKING_PROGRESS_ORDER_ROOM_SERVICE_API,
    DELETE_ORDER_API,
    GET_RANDOM_RESTAURANT_DISHES,
    DELETE_CONCIERGE_ORDER_API,
    DELETE_RESERVATIOn_ORDER_API,
} from '../constants/api';
import { AxiosResponse } from 'axios';
import {
    getRestaurantListSuccess,
    restaurantFailed,
    getRestaurantCategoryDishSuccess,
    bookATableSuccess,
    orderRoomServiceSuccess,
    trackingProgressOrderRoomServiceSuccess,
    deleteOrderSuccess,
    getRandomDishes,
    getRandomDishesSuccess,
} from '../actions/action.restaurant';
import { handleError, IRulesFormValidation, handleFormValidation, toast } from '../utils/handleLogic';
import { printUrl } from '../utils/formating';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import moment from 'moment';
import { isAfter } from 'date-fns';

const getRestaurantListLogic = createLogic({
    type: GET_RESTAURANT_LIST,
    process({ httpClient, getState, action }: IDependencies<ReturnType<TGetRestaurantList>>, dispatch, done) {
        const { code } = action.payload;
        console.log('actionnn', action);
        console.log('codeeeee', code);

        httpClient
            // .get(GET_RESTAURANTS, {
            //     headers: {
            //         Accept: 'application/json',
            //         Authorization: `Bearer ${getState().account.access_token}`,
            //         // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
            //     },
            // })
            .get(printUrl(GET_RESTAURANTS, code.toString()), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetRestaurants>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'get resturants');
                return response.data;
            })
            .then((response) => {
                dispatch(getRestaurantListSuccess(response.data));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'get resturants');
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

const getRestaurantCategoryDishLogic = createLogic({
    type: GET_RESTAURANT_CATEGORY_DISH,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<TGetRestaurantCategoryDish>>,
        dispatch,
        done,
    ) {
        const { id, code } = action.payload;
        httpClient
            .get(printUrl(GET_RESTAURANT_DISHES, [id.toString(), code.toString()]), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessGetRestaurantDishes>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                //     console.log('1234 response', Object.values(response.data));
                // }
                console.log(response, 'get resturants foods');
                return response.data;
            })
            .then((response) => {
                dispatch(getRestaurantCategoryDishSuccess(response));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'get resturants foods');
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

const getRandomDishesLogic = createLogic({
    type: RANDOM_DISHES,
    process({ httpClient, getState, action }: IDependencies<ReturnType<TGetRandomDishes>>, dispatch, done) {
        httpClient
            .get(printUrl(GET_RANDOM_RESTAURANT_DISHES, action.payload.hotel_id), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: any) => {
                console.log(response, 'get resturants foods');
                return response.data;
            })
            .then((response) => {
                console.log(response);
                dispatch(getRandomDishesSuccess(response.dishes));
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'get resturants foods');
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

const bookATableLogic = createLogic({
    type: BOOK_A_TABLE,
    validate({ action, getState }: IDependencies<ReturnType<TBookATable>>, allow, reject) {
        const { booking_date, booking_end_date, numberPeople, table_no, note } = action.payload;
        console.log('in logicccc', booking_date, booking_end_date);
        const rules: IRulesFormValidation[] = [
            {
                isValid: booking_date !== '',
                message: getState().language.please_select_your_booking_date_and_time,
            },
            {
                isValid: booking_end_date !== '',
                message: getState().language.please_select_your_booking_date_and_time,
            },
            {
                isValid: numberPeople > 0,
                message: getState().language.number_of_people_must_be_greater_than_zero,
            },
            {
                isValid: table_no !== 0,
                message: getState().language.please_select_your_table_number,
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
                reject(restaurantFailed(rule.message, action.type));
            },
        );
    },
    process({ httpClient, getState, action }: IDependencies<ReturnType<TBookATable>>, dispatch, done) {
        const { booking_date, numberPeople, booking_end_date, restaurantId, table_no, note } = action.payload;

        httpClient
            .post(
                printUrl(CREATE_BOOK_A_TABLE, restaurantId.toString()),
                {
                    booking_date:
                        moment(booking_date).format('YYYY-MM-DD') +
                        ' ' +
                        moment(booking_end_date).format('HH:mm:ss'),
                    people_number: numberPeople,
                    current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    table_no: table_no,
                    vip_note: note,
                    note: note,
                },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${getState().account.checkin_token}`,
                        // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                    },
                },
            )
            .then((response: AxiosResponse<ISuccessBookATable>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'book a table');
                return response.data;
            })
            .then((response) => {
                dispatch(bookATableSuccess());

                if (action.payload.onSuccess) {
                    action.payload.onSuccess(response);
                }
            })
            .catch((error) => {
                console.log(error.response, 'book a table');
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

const orderRoomServiceLogic = createLogic({
    type: ORDER_ROOM_SERVICE,
    validate({ action, getState }: IDependencies<ReturnType<TOrderRoomService>>, allow, reject) {
        if (action.payload.items.length <= 0) {
            toast(getState().language.at_least_select_one_dish);
            if (action.payload.onFailed) {
                action.payload.onFailed();
            }
            return reject(restaurantFailed('At least select one dish', action.type));
        }

        return allow(action);
    },
    process({ httpClient, getState, action }: IDependencies<ReturnType<TOrderRoomService>>, dispatch, done) {
        const {
            restaurantId,
            paymentType,
            currency,
            cvv,
            expiryDate,
            cardNumber,
            holderName,
            date,
            time,
            items,
            tip,
            vip_note,
            cardSave,
        } = action.payload;
        console.log('showing the order item payload received', action.payload);
        console.log(format(date, 'YYYY-MM-DD') + '      ' + format(time, 'HH:mm:ss'));
        console.log(format(date, 'YYYY-MM-DD') + '      ' + restaurantId.toString());
        httpClient
            .post(
                printUrl(CREATE_ROOM_SERVICE_ORDER, restaurantId.toString()),
                {
                    orders: items,
                    current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    reservation_date: `${format(date, 'YYYY-MM-DD')} ${format(time, 'HH:mm:ss')}`,
                    tip,
                    vip_note,
                    currency,
                    card_number: cardNumber,
                    card_expiry_month: expiryDate,
                    card_cvv_number: cvv,
                    cardholder_name: holderName,
                    is_card_save: cardSave,
                    type: paymentType,
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
                console.log(response, 'order room service food');
                return response.data;
            })
            .then((res) => {
                if (res.message == 'Your card number is incorrect.') {
                    toast(res.message);
                    if (action.payload.onFailed) {
                        action.payload.onFailed();
                    }
                } else {
                    dispatch(orderRoomServiceSuccess());

                    if (action.payload.onSuccess) {
                        action.payload.onSuccess();
                    }
                }
            })
            .catch((error) => {
                console.log(error);
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

const trackingProgressOrderRoomServiceLogic = createLogic({
    type: TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<TTrackingProgressOrderRoomService>>,
        dispatch,
        done,
    ) {
        const { code } = action.payload;
        httpClient
            .get(printUrl(TRACKING_PROGRESS_ORDER_ROOM_SERVICE_API, code.toString()), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessTrackingProgressOrderRoomService>) => {
                // if (__DEV__) {
                //     console.log(`${action.type}: `, response);
                // }
                console.log(response, 'resturant tracking progress');
                return response.data;
            })
            .then((response) => {
                dispatch(trackingProgressOrderRoomServiceSuccess(response.data));

                if (action.payload.onSuccess) {
                    action.payload.onSuccess(response.data);
                }
            })
            .catch((error) => {
                console.log(error.response, 'resturant tracking progress');
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

const deleteOrderLogic = createLogic({
    type: DELETE_ORDER,
    process({ httpClient, getState, action }: IDependencies<ReturnType<TDeleteOrder>>, dispatch, done) {
        const { id } = action.payload;

        httpClient
            .delete(printUrl(DELETE_ORDER_API, id.toString()), {
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
                console.log(response, 'delete food order');

                return response.data;
            })
            .then((response) => {
                dispatch(deleteOrderSuccess());

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'delete food order');
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

const deleteReservationOrderLogic = createLogic({
    type: DELETE_RESERVATION_ORDER,
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<TDeleteReservationOrder>>,
        dispatch,
        done,
    ) {
        const { id } = action.payload;

        httpClient
            .delete(printUrl(DELETE_RESERVATIOn_ORDER_API, id.toString()), {
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
                console.log(response, 'delete food order');

                return response.data;
            })
            .then((response) => {
                dispatch(deleteOrderSuccess());

                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
            })
            .catch((error) => {
                console.log(error.response, 'delete food order');
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
    getRestaurantListLogic,
    getRestaurantCategoryDishLogic,
    bookATableLogic,
    orderRoomServiceLogic,
    trackingProgressOrderRoomServiceLogic,
    deleteOrderLogic,
    getRandomDishesLogic,
    deleteReservationOrderLogic,
];
