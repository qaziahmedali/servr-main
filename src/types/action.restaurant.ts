import { IRestaurant, ICategoryDish, ITrackingProgressOrderRoomService } from './restaurant';
import { IError, ISuccessBookATable } from './responseApi';
import { TimePickerAndroid } from 'react-native';

export const GET_RESTAURANT_LIST = 'GET_RESTAURANT_LIST';
export const GET_RESTAURANT_LIST_SUCCESS = 'GET_RESTAURANT_LIST_SUCCESS';

export const GET_RESTAURANT_CATEGORY_DISH = 'GET_RESTAURANT_CATEGORY_DISH';
export const GET_RESTAURANT_CATEGORY_DISH_SUCCESS = 'GET_RESTAURANT_CATEGORY_DISH_SUCCESS';

export const BOOK_A_TABLE = 'BOOK_A_TABLE';
export const BOOK_A_TABLE_SUCCESS = 'BOOK_A_TABLE_SUCCESS';

export const ORDER_ROOM_SERVICE = 'ORDER_ROOM_SERVICE';
export const ORDER_ROOM_SERVICE_SUCCESS = 'ORDER_ROOM_SERVICE_SUCCESS';

export const TRACKING_PROGRESS_ORDER_ROOM_SERVICE = 'TRACKING_PROGRESS_ORDER_ROOM_SERVICE';
export const TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS = 'TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS';

export const DELETE_ORDER = 'DELETE_ORDER';
export const DELETE_SPA = 'DELETE_SPA';
export const DELETE_RESERVATION_ORDER = 'DELETE_RESERVATION_ORDER';
export const DELETE_ORDER_SUCCESS = 'DELETE_ORDER_SUCCESS';

export const RESTAURANT_FAILED = 'RESTAURANT_FAILED';
export const RESTO_BOOK_A_TABLE_SUCCESS = 'RESTO_BOOK_A_TABLE_SUCCESS';

export const ORDER_ROOM_SERVICE_ALL_ITEMS = 'ORDER_ROOM_SERVICE_ALL_ITEMS';

export const RANDOM_DISHES = 'RANDOM_DISHES';

export const RANDOM_DISHES_SUCCESS = 'RANDOM_DISHES_SUCCESS';

export type TGetRestaurantList<K = string, T = () => void> = (
    code: K,
    onSuccess?: T,
    onFailed?: T,
) => {
    type: typeof GET_RESTAURANT_LIST;
    payload: {
        code: K;
        onSuccess?: T;
        onFailed?: T;
    };
};

export type TGetRestaurantListSuccess<T = IRestaurant[]> = (restaurants: T) => {
    type: typeof GET_RESTAURANT_LIST_SUCCESS;
    payload: {
        restaurants: T;
    };
};

export type TGetRestaurantCategoryDish<T = number, I = string, K = () => void> = (
    id: T,
    code: I,
    onSuccess?: K,
    onFailed?: K,
) => {
    type: typeof GET_RESTAURANT_CATEGORY_DISH;
    payload: {
        id: T;
        code: I;
        onSuccess?: K;
        onFailed?: K;
    };
};

export type TGetRestaurantCategoryDishSuccess<T = ICategoryDish[]> = (dishCategories: T) => {
    type: typeof GET_RESTAURANT_CATEGORY_DISH_SUCCESS;
    payload: {
        dishCategories: T;
    };
};

export type TBookATable<T = number, K = string, I = (data: ISuccessBookATable) => void, J = () => void> = (
    restaurantId: T,
    numberPeople: T,
    booking_date: K,
    booking_end_date: K,
    table_bo: T,
    note?: K,
    onSuccess?: I,
    onFailed?: J,
) => {
    type: typeof BOOK_A_TABLE;
    payload: {
        restaurantId: T;
        numberPeople: T;
        booking_date: K;
        booking_end_date: K;
        table_no: T;
        note?: K;
        onSuccess?: I;
        onFailed?: J;
    };
};

export type TBookATableSuccess = () => {
    type: typeof BOOK_A_TABLE_SUCCESS;
};

export interface IOrderItem {
    dish_id: number;
    qty: number;
    note: string;
    rate: number;
    name: string;
}

export type TBookARestoTableSuccess<T = any> = (restoGuest: T) => {
    type: typeof RESTO_BOOK_A_TABLE_SUCCESS;
    payload: {
        restoGuest: T;
    };
};

export type TOrderRoomService<T = number, K = IOrderItem[], J = string, I = () => void, B = boolean> = (
    restaurantId: T,
    paymentType: J,
    currency: J,
    cvv: J,
    expiryDate: J,
    cardNumber: J,
    holderName: J,
    date: J,
    time: J,
    items: K,
    tip?: J,
    vip_note?: J,
    cardSave?: B,
    onSuccess?: I,
    onFailed?: I,
) => {
    type: typeof ORDER_ROOM_SERVICE;
    payload: {
        restaurantId: T;
        paymentType: J;
        currency: J;
        cvv: J;
        expiryDate: J;
        cardNumber: J;
        holderName: J;
        date: J;
        time: J;
        items: K;
        tip?: J;
        vip_note?: J;
        cardSave: B;
        onSuccess?: I;
        onFailed?: I;
    };
};

export type TOrderRoomServiceSuccess = () => {
    type: typeof ORDER_ROOM_SERVICE_SUCCESS;
};

export type TTrackingProgressOrderRoomService = (
    code?: string,
    onSuccess?: (data: ITrackingProgressOrderRoomService[]) => void,
    onFailed?: () => void,
) => {
    type: typeof TRACKING_PROGRESS_ORDER_ROOM_SERVICE;
    payload: {
        onSuccess: typeof onSuccess;
        onFailed: typeof onFailed;
    };
};

export type TTrackingProgressOrderRoomServiceSuccess = (
    trakingProgress: ITrackingProgressOrderRoomService[],
) => {
    type: typeof TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS;
    payload: {
        trakingProgress: typeof trakingProgress;
    };
};

export type TRestaurantFailed<T = any, K = string> = (
    error: T,
    type: K,
) => {
    type: typeof RESTAURANT_FAILED;
    payload: {
        error: IError;
    };
};

export type TDeleteOrder<T = number, I = () => void, J = () => void> = (
    id: T,
    onSuccess: I,
    onFailed: J,
) => {
    type: typeof DELETE_ORDER;
    payload: {
        id: T;
        onSuccess?: I;
        onFailed?: J;
    };
};

export type TDeleteSpa<T = number, I = () => void, J = () => void> = (
    id: T,
    onSuccess: I,
    onFailed: J,
) => {
    type: typeof DELETE_SPA;
    payload: {
        id: T;
        onSuccess?: I;
        onFailed?: J;
    };
};

export type TDeleteReservationOrder<T = number, I = () => void, J = () => void> = (
    id: T,
    onSuccess: I,
    onFailed: J,
) => {
    type: typeof DELETE_RESERVATION_ORDER;
    payload: {
        id: T;
        onSuccess?: I;
        onFailed?: J;
    };
};

export type TDeleteOrderSuccess = () => {
    type: typeof DELETE_ORDER_SUCCESS;
};

export type TOrderRoomServiceAllItems = () => {
    type: typeof ORDER_ROOM_SERVICE_ALL_ITEMS;
};

export type TGetRandomDishes<T = string, K = () => void> = (
    hotel_id: T,
    onSuccess: K,
    onFailed: K,
) => {
    type: typeof RANDOM_DISHES;
    payload: {
        hotel_id: T;
        onSuccess: K;
        onFailed: K;
    };
};

export type TGetRandomDishesSuccess<T = any> = (dishes: T) => {
    type: typeof RANDOM_DISHES_SUCCESS;
    payload: {
        dishes: T;
    };
};

export type ActionRestaurantType = ReturnType<
    | TGetRestaurantList
    | TGetRestaurantListSuccess
    | TGetRestaurantCategoryDish
    | TGetRestaurantCategoryDishSuccess
    | TBookATable
    | TBookATableSuccess
    | TOrderRoomService
    | TOrderRoomServiceSuccess
    | TTrackingProgressOrderRoomService
    | TTrackingProgressOrderRoomServiceSuccess
    | TRestaurantFailed
    | TDeleteOrder
    | TDeleteOrderSuccess
    | TOrderRoomServiceAllItems
    | TGetRandomDishes
    | TGetRandomDishesSuccess
    | TDeleteReservationOrder
>;
