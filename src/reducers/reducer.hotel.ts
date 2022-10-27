import { IHotelState } from '../types/hotel';
import {
    ActionHotelType,
    GET_HOTEL_DETAIL_SUCCESS,
    HOTEL_FAILED,
    HOTEL_LIST_SUCCESS,
    RESTO_LOGOUT_SUCCESS,
} from '../types/action.hotel';
import { ActionAccountType, CHECK_OUT_SUCCESS, LATE_CHECK_OUT_SUCCESS } from '../types/action.account';

const initialState: IHotelState = {
    isHotelPicked: false,
    id: 0,
    code: '',
    description: '',
    name: '',
    theme: {
        primary_color: '',
        secondary_color: '',
    },
    logo: {
        hotel_logo_lg: '',
        hotel_logo_md: '',
        hotel_logo_sm: '',
    },
    icon: {
        check_in_color: '',
        check_out_color: '',
        restaurant_color: '',
        spa_color: '',
        concierge_color: '',
        cleaning_color: '',
        parking_color: '',
    },
    feature: {
        is_check_in_enabled: false,
        is_check_out_enabled: false,
        is_cleaning_enabled: false,
        is_concierge_enabled: false,
        is_restaurant_enabled: false,
        is_spa_enabled: false,
        is_experience_enabled: false,
        is_spa_treatment: false,
        is_spa_room_service: false,
        is_experience: false,
        is_parking_enabled: false,
        is_guest_enabled: false,
    },
    category: '',
    currency: '',
    error: {},
    dynamic_buttons: [],
    type: '',
    hotels_list: [],
    isCheckedOut : false,
    isCheckedIn : true,
    transaction_data: [],
    bills: {},
};

export default (state = initialState, action: ActionHotelType | ActionAccountType): IHotelState => {
    switch (action.type) {
        case GET_HOTEL_DETAIL_SUCCESS:
            return {
                ...state,
                isHotelPicked: true,
                id: action.payload.id,
                code: action.payload.code,
                description: action.payload.description,
                name: action.payload.name,
                theme: action.payload.theme,
                logo: action.payload.logo,
                icon: action.payload.icon,
                feature: action.payload.feature,
                category: action.payload.category,
                currency: action.payload.currency,
                mobile_hotel_layout_id: action.payload.mobile_hotel_layout_id,
                mobile_hotel_layouts: action.payload.mobile_hotel_layouts,
                dynamic_buttons: action.payload.dynamic_buttons,
                type: action.payload.type,
            };
        case HOTEL_LIST_SUCCESS:
            return {
                ...state,
                hotel_list: action.payload.hotels
            }
        case CHECK_OUT_SUCCESS:
            return {
                ...state,
                isCheckedIn: false,
                confirmationResult: null,
                error: {},
                transaction_data: [],
                bills: {},
                isCheckedOut : true
            };
        case LATE_CHECK_OUT_SUCCESS:
            return {
                ...state,
                ...initialState,
            };
        case RESTO_LOGOUT_SUCCESS:
            return {
                ...state,
            };
        case HOTEL_FAILED:
            return {
                ...state,
                error: action.payload.error,
            };
        default:
            return state;
    }
};
