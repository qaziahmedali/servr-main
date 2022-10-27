import { IData } from './laundry';

export const GET_LAUNDRY_SERVICE = 'GET_LAUNDRY_SERVICE';
export const GET_LAUNDRY_SERVICE_SUCCESS = 'GET_LAUNDRY_SERVICE_SUCCESS';

export type TLaundryService<S = string, I = () => void, J = () => void> = (
    code: S,
    onSuccess: I,
    onFailed: J,
) => {
    type: typeof GET_LAUNDRY_SERVICE;
    payload: {
        code: S;
        onSuccess?: I;
        onFailed?: J;
    };
};

export type TLaundryServiceSuccess = (laundryService: IData) => {
    type: typeof GET_LAUNDRY_SERVICE_SUCCESS;
    payload: IData;
};
// export type TLaundryServiceFailed = (chainData: IData) => {
//     type: typeof GET_CHAIN_DATA_FAILED;
//     payload: IData;
// };

export type ActionLaundryService = ReturnType<TLaundryService> | ReturnType<TLaundryServiceSuccess>;
// | ReturnType<TLaundryServiceFailed>;
