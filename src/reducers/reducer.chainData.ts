import { IchainDataState } from '../types/chainData';
import { ActionChainDataType, GET_CHAIN_DATA_SUCCESS } from '../types/action.chainData';

const initialState: IchainDataState = {
    data: {
        name: '',
        logo: '',
        splash_screen: '',
        private_policy: '',
        terms_n_conditions: '',
        about_us: '',
        contact_us: '',
        logo_gif_dark: '',
        logo_gif_light: '',
        signup_bg: '',
        signin_bg: '',
        google_play_store: '',
        app_store: '',
    },
};

export default (state = initialState, action: ActionChainDataType): IchainDataState => {
    switch (action.type) {
        case GET_CHAIN_DATA_SUCCESS: {
            console.log('action=================>>>>', action);
            return {
                ...state,
                data: {
                    name: action.payload?.data?.name,
                    logo: action.payload?.data?.logo,
                    splash_screen: action.payload?.data?.splash_screen,
                    private_policy: action.payload?.data?.private_policy,
                    terms_n_conditions: action.payload?.data?.terms_n_conditions,
                    about_us: action.payload?.data?.about_us,
                    contact_us: action.payload?.data?.contact_us,
                    logo_gif_dark: action.payload?.data?.logo_gif_dark,
                    logo_gif_light: action.payload?.data?.logo_gif_light,
                    signup_bg: action.payload?.data?.signup_bg,
                    signin_bg: action.payload?.data?.signin_bg,
                    google_play_store: action.payload?.data?.google_play_store,
                    app_store: action.payload?.data?.app_store,
                },
            };
        }

        default:
            return state;
    }
};
