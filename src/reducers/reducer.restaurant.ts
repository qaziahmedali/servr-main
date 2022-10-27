import { IRestaurantState } from '../types/restaurant';
import {
    ActionRestaurantType,
    RESTAURANT_FAILED,
    GET_RESTAURANT_LIST_SUCCESS,
    GET_RESTAURANT_CATEGORY_DISH_SUCCESS,
    TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS,
    RANDOM_DISHES,
    RANDOM_DISHES_SUCCESS,
} from '../types/action.restaurant';
import { sample } from 'rxjs/operators';

const initialState: IRestaurantState = {
    restaurants: [],
    dishCategories: [],
    trackingProgressOrderRoomService: [],
    error: {},
    restoGuest: 0,
    random_dishes: [],
};

export default (state = initialState, action: ActionRestaurantType): IRestaurantState => {
    switch (action.type) {
        case GET_RESTAURANT_LIST_SUCCESS:
            return {
                ...state,
                restaurants: action.payload.restaurants,
            };

        case GET_RESTAURANT_CATEGORY_DISH_SUCCESS:
            return {
                ...state,
                dishCategories: action.payload.dishCategories,
            };

        case TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS:
            return {
                ...state,
                trackingProgressOrderRoomService: action.payload.trakingProgress,
            };

        case RESTAURANT_FAILED:
            return {
                ...state,
                error: action.payload.error,
            };
        case RANDOM_DISHES_SUCCESS:
            return {
                ...state,
                random_dishes: action.payload.dishes,
            };

        default:
            return state;
    }
};
