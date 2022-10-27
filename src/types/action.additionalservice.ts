import { IError } from './responseApi';

export const BOOK_ADDITIONAL_SERVICE = 'BOOK_ADDITIONAL_SERVICE';
export const BOOK_ADDITIONAL_SERVICE_SUCCESS = 'BOOK_ADDITIONAL_SERVICE_SUCCESS';
export const BOOK_ADDITIONAL_SERVICE_FAILED = 'BOOK_ADDITIONAL_SERVICE_FAILED';

export type TBookAdditionalService<
    T = number,
    K = IAdditionalServiceItem[],
    J = string,
    I = () => void,
    B = boolean | undefined,
> = (
    data: {
        additional_services: K;
        currency: J;
        cardNumber: J;
        expiryDate: J;
        cvv: J;
        holderName: J;
        cardSave: B;
        paymentType: J;
        date: J;
        time: J;
        tip: J;
        vip_note: J;
    },
    onSuccess?: I,
    onFailed?: I,
) => {
    type: typeof BOOK_ADDITIONAL_SERVICE;
    payload: {
        data: {
            additional_services: K;
            currency: J;
            cardNumber: J;
            expiryDate: J;
            cvv: J;
            holderName: J;
            cardSave: B;
            paymentType: J;
            date: J;
            time: J;
            tip: J;
            vip_note: J;
        };
        onSuccess?: I;
        onFailed?: I;
    };
};

export type TBookAdditionalServiceSuccess = () => {
    type: typeof BOOK_ADDITIONAL_SERVICE_SUCCESS;
};

export type TBookAdditioalServiceFailed<T = any, K = string> = (
    error: T,
    type: K,
) => {
    type: typeof BOOK_ADDITIONAL_SERVICE_FAILED;
    payload: {
        error: IError;
    };
};

export interface IAdditionalServiceItem {
    service_id: number;
    qty: number;
    // note: string;
    // rate: number;
    // name: string;
}

export type ActionAdditioanlServiceType = ReturnType<
    TBookAdditionalService | TBookAdditionalServiceSuccess | TBookAdditioalServiceFailed
>;
