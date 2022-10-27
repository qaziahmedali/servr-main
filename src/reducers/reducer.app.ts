import { IAppUpdate } from '../types/app';
import {
    APP_UPDATE,
    APP_UPDATE_SUCCESS
} from '../types/action.app';
import { ActionAppType } from '../types/action.app';

const initialState: IAppUpdate = {
    app_update : 0,
};

export default (state = initialState, action: ActionAppType): IAppUpdate => {
    switch (action.type) {
        case APP_UPDATE_SUCCESS:
            return {
                ...state,
                app_update: action.payload.app_update,
            };

        default:
            return state;
    }
};
