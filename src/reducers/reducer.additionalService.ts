import { IAdditioanlServiceState } from '../types/additionalservice';
import {
    ActionAdditioanlServiceType,
    BOOK_ADDITIONAL_SERVICE,
    BOOK_ADDITIONAL_SERVICE_FAILED,
} from '../types/action.additionalservice';

const initialState: IAdditioanlServiceState = {
    additionalServiceList: [],
    bookAdditionalServiceData: [],
};

export default (state = initialState, action: ActionAdditioanlServiceType): IAdditioanlServiceState => {
    switch (action.type) {
        case BOOK_ADDITIONAL_SERVICE:
            return {
                ...state,
                additionalServiceList: action.payload,
            };

        case BOOK_ADDITIONAL_SERVICE_FAILED:
            return {
                ...state,
                error: action.payload.error,
            };

        default:
            return state;
    }
};
