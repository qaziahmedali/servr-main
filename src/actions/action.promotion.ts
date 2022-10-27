import { IPromotion, IPromotionDetails, IOrderPromotion } from '../types/promotion';
import { IError } from '../types/responseApi';
import { EMPTY } from 'rxjs';

export const GET_PROMOTION = 'GET_PROMOTION';
export const GET_PROMOTION_SUCCESS = 'GET_PROMOTION_SUCCESS';

export const GET_PROMOTION_DETAILS = 'GET_PROMOTION_DETAILS';
export const GET_PROMOTION_DETAILS_SUCCESS = 'GET_PROMOTION_DETAILS_SUCCESS';
export const Empty_Promotion_Detail = 'Empty_Promotion_Detail';

export const ORDER_PROMOTION = 'ORDER_PROMOTION';
export const ORDER_PROMOTION_SUCCESS = 'ORDER_PROMOTION_SUCCESS';

// export const RESERVE_PROMOTION = 'RESERVE_PROMOTION';
// export const RESERVE_PROMOTION_SUCCESS = 'RESERVE_PROMOTION_SUCCESS';

// export const ORDER_ROOM_PROMOTION = 'ORDER_ROOM_PROMOTION';
// export const ORDER_ROOM_PROMOTION_SUCCESS = 'ORDER_ROOM_PROMOTION_SUCCESS';

export const PROMOTION_FAILED = 'PROMOTION_FAILED';

export const getPromotion = (
    idHotel: number,
    idButton: number,
    onSuccess?: (promotion: IPromotion, idButton: number) => void,
    onFailed?: () => void,
) => ({
    type: GET_PROMOTION as typeof GET_PROMOTION,
    payload: {
        idHotel,
        onSuccess,
        onFailed,
        idButton,
    },
});

export const getPromotionSuccess = (promotion: IPromotion) => ({
    type: GET_PROMOTION_SUCCESS as typeof GET_PROMOTION_SUCCESS,
    payload: {
        promotion,
    },
});

export const getPromotionDetails = (
    idHotel: number,
    idButton: number,
    onSuccess?: () => void,
    onFailed?: () => void,
) => ({
    type: GET_PROMOTION_DETAILS as typeof GET_PROMOTION_DETAILS,
    payload: {
        idHotel,
        idButton,
        onSuccess,
        onFailed,
    },
});

export const emptyPromotionDetails = (value) => ({
    type: Empty_Promotion_Detail as typeof Empty_Promotion_Detail,
    payload: {
        promotionDetails: value,
    },
});

export const getPromotionDetailsSuccess = (promotionDetails: IPromotionDetails) => ({
    type: GET_PROMOTION_DETAILS_SUCCESS as typeof GET_PROMOTION_DETAILS_SUCCESS,
    payload: {
        promotionDetails,
    },
});

export const orderPromotion = (body: IOrderPromotion, onSuccess?: () => void, onFailed?: () => void) => ({
    type: ORDER_PROMOTION as typeof ORDER_PROMOTION,
    payload: {
        body,
        onSuccess,
        onFailed,
    },
});

export const orderPromotonSuccess = () => ({
    type: ORDER_PROMOTION_SUCCESS as typeof ORDER_PROMOTION_SUCCESS,
});

// export const getPromotionTreatment = (
//     promotionId: number,
//     onSuccess?: (treatments: IPromotionTreatment[]) => void,
//     onFailed?: () => void,
// ) => ({
//     type: GET_PROMOTION_TREATMENT as typeof GET_PROMOTION_TREATMENT,
//     payload: {
//         promotionId,
//         onSuccess,
//         onFailed,
//     },
// });

// export const getPromotionTreatmentSuccess = (treatments: IPromotionTreatment[]) => ({
//     type: GET_PROMOTION_TREATMENT_SUCCESS as typeof GET_PROMOTION_TREATMENT_SUCCESS,
//     payload: {
//         treatments,
//     },
// });

// interface IPostPromotionBody {
//     promotion_id: number;
//     treatments: number[];
//     number_people: number;
//     date: string;
//     time: string;
// }

// export const reservePromotion = (body: IPostPromotionBody, onSuccess?: () => void, onFailed?: () => void) => ({
//     type: RESERVE_PROMOTION as typeof RESERVE_PROMOTION,
//     payload: {
//         body,
//         onSuccess,
//         onFailed,
//     },
// });

// export const reservePromotonSuccess = () => ({
//     type: RESERVE_PROMOTION_SUCCESS as typeof RESERVE_PROMOTION_SUCCESS,
// });

// export const orderRoomPromotion = (body: IPostPromotionBody, onSuccess?: () => void, onFailed?: () => void) => ({
//     type: ORDER_ROOM_PROMOTION as typeof ORDER_ROOM_PROMOTION,
//     payload: {
//         body,
//         onSuccess,
//         onFailed,
//     },
// });

// export const orderRoomPromotionSuccess = () => ({
//     type: ORDER_ROOM_PROMOTION_SUCCESS as typeof ORDER_ROOM_PROMOTION_SUCCESS,
// });

export const promotionFailed = (error: any, type: string) => ({
    type: PROMOTION_FAILED as typeof PROMOTION_FAILED,
    payload: {
        error: {
            error,
            type,
        } as IError,
    },
});

export type ActionPromotionType = ReturnType<
    | typeof getPromotion
    | typeof getPromotionSuccess
    | typeof getPromotionDetails
    | typeof getPromotionDetailsSuccess
    | typeof emptyPromotionDetails
    | typeof promotionFailed
    | typeof orderPromotion
    | typeof orderPromotonSuccess
    // | typeof reservePromotion
    // | typeof reservePromotionSuccess
    // | typeof orderRoomPromotion
    // | typeof orderRoomPromotionSuccess
    // | typeof promotionFailed
>;
