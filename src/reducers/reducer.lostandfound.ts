import { ILostAndFoundState } from '../types/lostAndFound';
import {
    ActionLostAndFoundType,
    LOST_AND_FOUND_SUCCESS,
    LOST_AND_FOUND_FAILED,
} from '../actions/action.lostAndFound';

const initialState: ILostAndFoundState = {
    lostAndFoundItem: {
        name: '',
        phonenumber: '',
        email: '',
        message: '',
        hotel_id: 0,
    },
    error: {},
};

export default (state = initialState, action: ActionLostAndFoundType): ILostAndFoundState => {
    switch (action.type) {
        case LOST_AND_FOUND_SUCCESS:
            return {
                ...state,
            };

        case LOST_AND_FOUND_FAILED:
            return {
                ...state,
                error: action.payload.error,
            };

        default:
            return state;
    }
};
