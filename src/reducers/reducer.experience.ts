import { IExperienceState } from '../types/experience';
import { ActionExperienceType, GET_EXPERIENCE_SUCCESS, GET_HOTEL_MAP } from '../actions/action.experience';

const initialState: IExperienceState = {
    experience: {
        id: 0,
        name: 'Experience',
        logo_url: ['https://i.pinimg.com/originals/a3/b9/f4/a3b9f46af146d36398126c7adbdbfae8.jpg'],
        experiences: {},
    },
    hotelMap: {
        id: 0,
        name: 'HotelMap',
        logo_url: ['https://i.pinimg.com/originals/a3/b9/f4/a3b9f46af146d36398126c7adbdbfae8.jpg'],
    },
    // treatments: [],
    error: {},
};

export default (state = initialState, action: ActionExperienceType): IExperienceState => {
    switch (action.type) {
        case GET_EXPERIENCE_SUCCESS:
            return {
                ...state,
                experience: action.payload.experience,
            };

        case GET_HOTEL_MAP:
            return {
                ...state,
                hotelMap: action.payload.hotelMap,
            };

        // case PROMOTION_FAILED:
        //     return {
        //         ...state,
        //         error: action.payload.error,
        //     };

        default:
            return state;
    }
};
