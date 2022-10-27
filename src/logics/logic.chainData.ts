import { createLogic } from 'redux-logic';
import { IDependencies, IFailedResponse } from '../types/responseApi';
import { getChainData, getChainDataSuccess, getChainDataFailed } from '../actions/action.chainData';
import {
    TGetChainData,
    TGetChainDataFailed,
    TGetChainDataSuccess,
    GET_CHAIN_DATA,
    GET_CHAIN_DATA_FAILED,
    GET_CHAIN_DATA_SUCCESS,
} from '../types/action.chainData';
import { CHAIN_DATA_API } from '../constants/api';
import { AxiosResponse, AxiosError } from 'axios';
import { toast } from '../utils/handleLogic';
import { accountFailed } from '../actions/action.account';

const chaindataLogic = createLogic({
    type: GET_CHAIN_DATA,
    process({ httpClient, action, getState }: IDependencies<ReturnType<TGetChainData>>, dispatch, done) {
        console.log('action chanin==========>', action);
        httpClient
            .get(CHAIN_DATA_API, {
                headers: {
                    Accept: 'application/json',
                },
            })
            .then((response: AxiosResponse<any>) => {
                // console.log('chain data response================>', response.data.data[0].value);
                console.log('chain data response================>', response?.data);
                return response.data;
            })
            .then((response) => {
                console.log('chain data======================>>>', response);
                // if (response.value) {
                dispatch(getChainDataSuccess(response));
                // }
            })
            .catch((error) => {
                console.log(error);
                console.log('chain data error======================>>>', error);
                dispatch(getChainDataFailed(error));
                const { message, errors } = <IFailedResponse>error.response.data;
                toast(message, getState().language.error);
            })
            .then(() => done());
    },
});
export default [chaindataLogic];
