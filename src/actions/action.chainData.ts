import {
    GET_CHAIN_DATA,
    GET_CHAIN_DATA_SUCCESS,
    TGetChainData,
    TGetChainDataSuccess,
    TGetChainDataFailed,
    GET_CHAIN_DATA_FAILED,
} from '../types/action.chainData';
import { IchainDataState } from '../types/chainData';
export const getChainData: TGetChainData = () => ({
    type: GET_CHAIN_DATA,
});

export const getChainDataSuccess: TGetChainDataSuccess = (chainData) => ({
    type: GET_CHAIN_DATA_SUCCESS,
    payload: chainData,
});
export const getChainDataFailed: TGetChainDataFailed = (chainData) => ({
    type: GET_CHAIN_DATA_FAILED,
    payload: chainData,
});
