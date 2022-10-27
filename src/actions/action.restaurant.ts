import {
    TGetRestaurantList,
    GET_RESTAURANT_LIST,
    TGetRestaurantListSuccess,
    GET_RESTAURANT_LIST_SUCCESS,
    TGetRestaurantCategoryDish,
    GET_RESTAURANT_CATEGORY_DISH,
    TGetRestaurantCategoryDishSuccess,
    GET_RESTAURANT_CATEGORY_DISH_SUCCESS,
    TBookATable,
    BOOK_A_TABLE,
    TBookATableSuccess,
    BOOK_A_TABLE_SUCCESS,
    TOrderRoomService,
    ORDER_ROOM_SERVICE,
    TOrderRoomServiceSuccess,
    ORDER_ROOM_SERVICE_SUCCESS,
    TRestaurantFailed,
    RESTAURANT_FAILED,
    TTrackingProgressOrderRoomService,
    TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    TTrackingProgressOrderRoomServiceSuccess,
    TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS,
    DELETE_ORDER,
    DELETE_ORDER_SUCCESS,
    TDeleteOrder,
    TDeleteOrderSuccess,
    RESTO_BOOK_A_TABLE_SUCCESS,
    TBookARestoTableSuccess,
    TOrderRoomServiceAllItems,
    ORDER_ROOM_SERVICE_ALL_ITEMS,
    TGetRandomDishes,
    RANDOM_DISHES,
    TGetRandomDishesSuccess,
    RANDOM_DISHES_SUCCESS,
    DELETE_RESERVATION_ORDER,
    TDeleteReservationOrder,
    DELETE_SPA,
    TDeleteSpa
} from '../types/action.restaurant';

export const getRestaurantList: TGetRestaurantList = (code, onSuccess, onFailed) => ({
    type: GET_RESTAURANT_LIST,
    payload: {
        code,
        onSuccess,
        onFailed,
    },
});

export const getRandomDishes: TGetRandomDishes = (hotel_id, onSuccess, onFailed) => ({
    type: RANDOM_DISHES,
    payload: {
        hotel_id,
        onSuccess,
        onFailed,
    },
});

export const getRandomDishesSuccess: TGetRandomDishesSuccess = (dishes) => ({
    type: RANDOM_DISHES_SUCCESS,
    payload: {
        dishes
    },
});

export const getRestaurantListSuccess: TGetRestaurantListSuccess = (restaurants) => ({
    type: GET_RESTAURANT_LIST_SUCCESS,
    payload: {
        restaurants,
    },
});

export const getRestaurantCategoryDish: TGetRestaurantCategoryDish = (id, code, onSuccess, onFailed) => ({
    type: GET_RESTAURANT_CATEGORY_DISH,
    payload: {
        id,
        code,
        onSuccess,
        onFailed,
    },
});

export const restoBookATableSuccess: TBookARestoTableSuccess = (restoGuest: any) => ({
    type: RESTO_BOOK_A_TABLE_SUCCESS,
    payload: {
        restoGuest,
    },
});

export const getRestaurantCategoryDishSuccess: TGetRestaurantCategoryDishSuccess = (dishCategories) => ({
    type: GET_RESTAURANT_CATEGORY_DISH_SUCCESS,
    payload: {
        dishCategories,
    },
});

export const bookATable: TBookATable = (
    restaurantId,
    numberPeople,
    booking_date,
    booking_end_date,
    table_no,
    note,
    onSuccess,
    onFailed,
) => ({
    type: BOOK_A_TABLE,
    payload: {
        restaurantId,
        numberPeople,
        booking_date,
        booking_end_date,
        table_no,
        note,
        onSuccess,
        onFailed,
    },
});

export const bookATableSuccess: TBookATableSuccess = () => ({
    type: BOOK_A_TABLE_SUCCESS,
});

export const orderRoomService: TOrderRoomService = (
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
    onSuccess,
    onFailed,
) => ({
    type: ORDER_ROOM_SERVICE,
    payload: {
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
        onSuccess,
        onFailed,
    },
});

export const orderRoomServiceSuccess: TOrderRoomServiceSuccess = () => ({
    type: ORDER_ROOM_SERVICE_SUCCESS,
});

export const trackingProgressOrderRoomService: TTrackingProgressOrderRoomService = (
    code,
    onSuccess,
    onFailed,
) => ({
    type: TRACKING_PROGRESS_ORDER_ROOM_SERVICE,
    payload: {
        code,
        onSuccess,
        onFailed,
    },
});

export const trackingProgressOrderRoomServiceSuccess: TTrackingProgressOrderRoomServiceSuccess = (
    trakingProgress,
) => ({
    type: TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS,
    payload: {
        trakingProgress,
    },
});

export const restaurantFailed: TRestaurantFailed = (error, type) => ({
    type: RESTAURANT_FAILED,
    payload: {
        error: {
            error,
            type,
        },
    },
});

export const deleteOrder: TDeleteOrder = (id, onSuccess, onFailed) => ({
    type: DELETE_ORDER,
    payload: {
        id,
        onSuccess,
        onFailed,
    },
});

export const deleteSpa: TDeleteSpa = (id, onSuccess, onFailed) => ({
    type: DELETE_SPA,
    payload: {
        id,
        onSuccess,
        onFailed,
    },
});

export const deleteReservationOrder: TDeleteReservationOrder = (id, onSuccess, onFailed) => ({
    type: DELETE_RESERVATION_ORDER,
    payload: {
        id,
        onSuccess,
        onFailed,
    },
});

export const deleteOrderSuccess: TDeleteOrderSuccess = () => ({
    type: DELETE_ORDER_SUCCESS,
});


export const orderRoomServiceAllItems: TOrderRoomServiceAllItems = () => ({
    type: ORDER_ROOM_SERVICE_ALL_ITEMS,
});

// export const deleteOrder: TDeleteOrder = (onSuccess, onFailed) => ({
//     type: DELETE_ORDER,
//     payload: {
//         onSuccess,
//         onFailed,
//     },
// });

// export const deleteOrderSuccess: TDeleteOrderSuccess = (
//     trakingProgress,
// ) => ({
//     type: DELETE_ORDER_SUCCESS,
//     payload: {
//         trakingProgress,
//     },
// });
