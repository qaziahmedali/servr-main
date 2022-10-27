import { IchainDataState } from './chainData';

export const GET_CHAIN_DATA = 'GET_CHAIN_DATA';
export const GET_CHAIN_DATA_SUCCESS = 'GET_CHAIN_DATA_SUCCESS';
export const GET_CHAIN_DATA_FAILED = 'GET_CHAIN_DATA_FAILED';

export type TGetChainData<T = IchainDataState> = () => {
    type: typeof GET_CHAIN_DATA;
};

export type TGetChainDataSuccess = (chainData: IchainDataState) => {
    type: typeof GET_CHAIN_DATA_SUCCESS;
    payload: IchainDataState;
};
export type TGetChainDataFailed = (chainData: IchainDataState) => {
    type: typeof GET_CHAIN_DATA_FAILED;
    payload: IchainDataState;
};

export type ActionChainDataType =
    | ReturnType<TGetChainData>
    | ReturnType<TGetChainDataSuccess>
    | ReturnType<TGetChainDataFailed>;
