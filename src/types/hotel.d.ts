import { IError } from './responseApi';

export interface ILogoHotel {
    hotel_logo_lg: string;
    hotel_logo_md: string;
    hotel_logo_sm: string;
}

export interface IThemeHotel {
    primary_color: string;
    secondary_color: string;
}

export interface IIconHotel {
    check_in_color: string;
    check_out_color: string;
    restaurant_color: string;
    spa_color: string;
    concierge_color: string;
    cleaning_color: string;
    parking_color: string;
}

export interface IFeatureHotel {
    is_check_in_enabled: boolean;
    is_check_out_enabled: boolean;
    is_spa_enabled: boolean;
    is_experience_enabled: boolean;
    is_restaurant_enabled: boolean;
    is_concierge_enabled: boolean;
    is_cleaning_enabled: boolean;
    is_spa_treatment: boolean;
    is_spa_room_service: boolean;
    is_experience: boolean;
    is_wakeup_call_enabled: boolean;
    is_parking_enabled: boolean;
    is_guest_enabled: boolean;
    array_buttons: any;
}

export interface IHotelState {
    isHotelPicked: boolean;
    id: number;
    code: string;
    description: string;
    name: string;
    logo: ILogoHotel;
    theme: IThemeHotel;
    icon: IIconHotel;
    feature: IFeatureHotel;
    category: string;
    currency: string;
    mobile_hotel_layout_id: number;
    mobile_hotel_layouts: any;
    error: Partial<IError>;
    dynamic_buttons: any;
    type: string;
    hotel_list: any;
    isCheckedIn : boolean,
    confirmationResult : any,
    transaction_data : any,
    bills : any,
    isCheckedOut : boolean

}
