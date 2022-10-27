import { ISpaState } from '../types/spa';
import {
    ActionSpaType,
    GET_SPA_SUCCESS,
    GET_SPA_TREATMENT_SUCCESS,
    SPA_FAILED,
    SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS,
    GET_SPA_All_TREATMENTS_SUCCESS,
} from '../actions/action.spa';

const initialState: ISpaState = {
    spa: {
        id: 0,
        name: ' ',
        logo_url: [],
        // id: 0,
        // name: 'Stillwater Spa',
        // logo_url: ['https://i.pinimg.com/originals/a3/b9/f4/a3b9f46af146d36398126c7adbdbfae8.jpg'],
    },
    allTreatments: [],
    treatments: [],
    error: {},
    spaTrakingProgress: [],
};

export default (state = initialState, action: ActionSpaType): ISpaState => {
    switch (action.type) {
        case GET_SPA_SUCCESS: {
            return {
                ...state,
                spa: action.payload.spa,
            };
        }

        case GET_SPA_TREATMENT_SUCCESS: {
            console.log('STATEXX', action.payload.treatments);
            return {
                ...state,
                treatments: action.payload.treatments,
            };
        }

        case SPA_FAILED:
            return {
                ...state,
                error: action.payload.error,
            };

        case SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_SUCCESS:
            return {
                ...state,
                spaTrakingProgress: action.payload.spaTrakingProgress,
            };
        case GET_SPA_All_TREATMENTS_SUCCESS:
            return {
                ...state,
                allTreatments: action.payload.treatments,
            };
        default:
            return state;
    }
};
