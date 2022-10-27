import { createLogic } from 'redux-logic';
import {
    IDependencies,
    IFailedResponse,
    ISuccessSignUp,
} from '../types/responseApi';
import { appUpdate, appUpdateSuccess,  } from '../actions/action.app';
import {
    APP_UPDATE,
    APP_UPDATE_SUCCESS,
    TAppUpdateSuccess,
    TAppUpdate
} from '../types/action.app';
import {
    APP_UPDATE_API,
} from '../constants/api';
import { AxiosResponse, AxiosError } from 'axios';
import { toast } from '../utils/handleLogic';
import { accountFailed } from '../actions/action.account';

const appUpdateLogic = createLogic({
    type: APP_UPDATE,
    process({ httpClient, action, getState }: IDependencies<ReturnType<TAppUpdate>>, dispatch, done) {
        console.log(action);
        httpClient
            .get(APP_UPDATE_API, {
                headers: {
                    Accept: 'application/json',
                },
            })
            .then((response: AxiosResponse<any>) => {
                console.log(response.data.data[0].value);
                return response.data.data[0];
            })
            .then((response) => {
                if (action.payload.onSuccess) {
                    action.payload.onSuccess()
                }
                // if (response.value) {
                    dispatch(appUpdateSuccess(response.value))
                // }
            })
            .catch((error) => {
                console.log(error)
                if (action.payload.onFailed) {
                    action.payload.onFailed()
                }
                dispatch(accountFailed(error, APP_UPDATE));
                const { message, errors } = <IFailedResponse>error.response.data;
                toast(message, getState().language.error);
            })
            .then(() => done());
    },
});
export default [
    appUpdateLogic
];
