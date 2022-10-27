import { ILaundryState } from '../types/laundry';
import {
    ActionCleaningServiceType,
    GET_LAUNDRY_SERVICES_MENU,
    GET_LAUNDRY_SERVICES_MENU_SUCCESS,
} from '../actions/action.cleaningService';
import { ActionLaundryService, GET_LAUNDRY_SERVICE_SUCCESS } from '../types/action.laundryservice';

const initialState: ILaundryState = {
    laundry: [],
    error: {},
};

export default (state = initialState, action: ActionCleaningServiceType): ILaundryState => {
    switch (action.type) {
        case GET_LAUNDRY_SERVICES_MENU:
            return {
                ...state,
                // laundries: action.payload.,
            };
        case GET_LAUNDRY_SERVICES_MENU_SUCCESS:
            return {
                ...state,
                laundry: action.payload.laundry,
            };
        case GET_LAUNDRY_SERVICE_SUCCESS: {
            console.log('STATETT', action.payload);
            return {
                ...state,
                laundry: action.payload?.laundry.laundries,
            };
        }

        default:
            return state;
    }
};
