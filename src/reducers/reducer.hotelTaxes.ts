import { IhotelTaxesState, IhotelTaxesRoot } from '../types/hotelTaxes';
import { ActionHotelTaxesType, GET_HOTEL_TAXES_SUCCESS } from '../types/action.hotelTaxes';

const initialState: IhotelTaxesState = {
    data: {
        additional_services: [],
        laundry_services: [],
        restaurants: {
            res_id: [],
        },
        spa: {
            spa_id: [],
        },
        valet_parking: [],
    },
};

export default (state = initialState, action: ActionHotelTaxesType): IhotelTaxesState => {
    switch (action.type) {
        case GET_HOTEL_TAXES_SUCCESS: {
            console.log('taxes action=================>>>>', action);
            return {
                ...state,
                data: {
                    additional_services: action.payload.data.additional_services,
                    laundry_services: action.payload.data.laundry_services,
                    restaurants: action.payload.data.restaurants,
                    spa: action.payload.data.spa,
                    valet_parking: action.payload.data.valet_parking,
                },
            };
        }

        default:
            return state;
    }
};
