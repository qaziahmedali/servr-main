import { IError } from '../types/responseApi';
import { IExperience, IExperienceHotelMap } from '../types/experience';

export const GET_EXPERIENCE = 'GET_EXPERIENCE';
export const GET_EXPERIENCE_SUCCESS = 'GET_EXPERIENCE_SUCCESS';
export const GET_HOTEL_MAP = 'GET_HOTEL_MAP';

export const EXPERIENCE_FAILED = 'EXPERIENCE_FAILED';

export const getExperience = (
    idHotel: number,
    onSuccess?: () => void,
    onFailed?: () => void,
) => ({
    type: GET_EXPERIENCE as typeof GET_EXPERIENCE,
    payload: {
        idHotel,
        onSuccess,
        onFailed,
    },
});

export const getExperienceSuccess = (experience: IExperience) => ({
    type: GET_EXPERIENCE_SUCCESS as typeof GET_EXPERIENCE_SUCCESS,
    payload: {
        experience,
    },
});

export const getHotelMap = (hotelMap: IExperienceHotelMap) => ({
    type: GET_HOTEL_MAP as typeof GET_HOTEL_MAP,
    payload: {
        hotelMap,
    },
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

// export const promotionFailed = (error: any, type: string) => ({
//     type: PROMOTION_FAILED as typeof PROMOTION_FAILED,
//     payload: {
//         error: {
//             error,
//             type,
//         } as IError,
//     },
// });

export type ActionExperienceType = ReturnType<
    typeof getExperience | typeof getExperienceSuccess | typeof getHotelMap
    // | typeof getPromotionTreatment
    // | typeof getPromotionTreatmentSuccess
    // | typeof reservePromotion
    // | typeof reservePromotionSuccess
    // | typeof orderRoomPromotion
    // | typeof orderRoomPromotionSuccess
    // | typeof promotionFailed
>;
