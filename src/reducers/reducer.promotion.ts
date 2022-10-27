import { IPromotionState } from '../types/promotion';
import {
    ActionPromotionType,
    GET_PROMOTION_SUCCESS,
    GET_PROMOTION_DETAILS_SUCCESS,
    PROMOTION_FAILED,
    Empty_Promotion_Detail,
} from '../actions/action.promotion';
import PromotionDetails from '../modules/promotion/PromotionDetails';

const initialState: IPromotionState = {
    promotion: {
        id: 0,
        name: 'Promotions',
        logo_url: ['https://i.pinimg.com/originals/a3/b9/f4/a3b9f46af146d36398126c7adbdbfae8.jpg'],
        promotions: {},
    },
    promotionDetails: { PromotionDetails: { images: [] } },
    // treatments: [],
    error: {},
};

export default (state = initialState, action: ActionPromotionType): IPromotionState => {
    switch (action.type) {
        case GET_PROMOTION_SUCCESS:
            return {
                ...state,
                promotion: action.payload.promotion,
            };

        case GET_PROMOTION_DETAILS_SUCCESS:
            return {
                ...state,
                promotionDetails: action.payload.promotionDetails,
            };

        case Empty_Promotion_Detail:
            return {
                ...state,
                promotionDetails: action.payload.promotionDetails,
            };

        // case GET_ALL_DETAILS:
        //     return {

        //         ...state
        //     };

        // case PROMOTION_FAILED:
        //     return {
        //         ...state,
        //         error: action.payload.error,
        //     };

        default:
            return state;
    }
};
