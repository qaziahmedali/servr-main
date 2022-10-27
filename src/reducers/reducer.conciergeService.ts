import { IConciergeServiceState } from '../types/conciergeService';
import {
    ActionConciergeServiceType,
    GET_CONCIERGE_SERVICE_ITEMS_SUCCESS,
    CONCIERGE_SERVICE_FAILED,
    CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS,
    GET_WAKEUP_CALL_SUCCESS,
    CLEAR_WAKE_UP_SERVICE
} from '../types/action.conciergeService';

const initialState: IConciergeServiceState = {
    serviceItems: [],
    error: {},
    conciergeTrakingProgress: [],
    wakeUpCall: {},
};

export default (state = initialState, action: ActionConciergeServiceType): IConciergeServiceState => {
    switch (action.type) {
        case GET_CONCIERGE_SERVICE_ITEMS_SUCCESS:
            return {
                ...state,
                serviceItems: action.payload.serviceItems,
            };

        case CONCIERGE_SERVICE_FAILED:
            return {
                ...state,
                error: action.payload.error,
            };

        case CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS:
            return {
                ...state,
                conciergeTrakingProgress: action.payload.conciergeTrakingProgress.data,
            };
        case GET_WAKEUP_CALL_SUCCESS:
            return {
                ...state,
                wakeUpCall: action.payload.get_wakeup_call,
            };
        case CLEAR_WAKE_UP_SERVICE:
            return {
                ...state,
                wakeUpCall: {}
            };
        default:
            return state;
    }
};
