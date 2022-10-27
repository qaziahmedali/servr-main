import { IParkingAndValetReducer } from '../types/parkingValet';
import {
    ActionParkingValetType,
    PARKING_VALET_FAILED,
    GET_PARKING_DETAILS,
    GET_PARKING_DETAILS_SUCCESS,
} from '../types/action.parkingValet';

const initialState: IParkingAndValetReducer = {
    parkingValetData: {
        id: 0,
        user_detail_id: 0,
        hidden_credit_card_number: '',
        name: '',
        guest_email: '',
        valet: {
            id: 0,
            date: '',
            time: '',
            key_access: '',
            status: '',
            request_status: '',
            hotel_booking_id: '',
            valet_setting_id: '',
            valet_time: '',
            valet_date: '',
            vehicle: {
                id: 0,
                manufacturer: '',
                color: '',
                license_plate: '',
                location: '',
                image: '',
                description: '',
                valet_id: 0,
            },
        },
    },
    error: {},
};

export default (state = initialState, action: ActionParkingValetType): IParkingAndValetReducer => {
    switch (action.type) {
        case GET_PARKING_DETAILS:
            return {
                ...state,
                parkingValetData: [],
            };

        case GET_PARKING_DETAILS_SUCCESS:
            return {
                ...state,
                parkingValetData: action.payload.parkingValetDetails,
            };

        case PARKING_VALET_FAILED:
            return {
                ...state,
                error: action.payload.error,
            };

        default:
            return state;
    }
};
