import { IError } from './responseApi';
// import { RNFirebase } from 'react-native-firebase';

export type TLateCheckoutStatus = null | 'pending' | 'accepted' | 'rejected';

export type TStatusCheckIn = 'accepted' | 'pending' | 'checked_out';

export interface IProfile {
    reference: null | string;
    arrival_date: null | string;
    departure_date: null | string;
    cardholder_name: null | string;
    card_number: null | string;
    card_expiry_date: null | string;
    card_address: null | string;
    phone_number: null | string;
    passport_photos: null | string[];
    sendbird_user_id: null | string;
    sendbird_access_token: null | string;
    sendbird_channel_url: null | string;
    checkout_time: null | string;
    late_checkout_time: null | string;
    late_checkout_status: null | TLateCheckoutStatus;
    status: TStatusCheckIn;
    room_number: number;
    note_request: string;
    signature_photo: string[];
    terms_and_condition: boolean;
    email: string;
    password: string;
    alreadyCheckedIn: Boolean;
    user_id?: number;
    additional_service_id: any;
}

export interface IUserData {
    token: string;
    user: {
        id: number;
        cardholder_name: string;
        card_number: null | string;
        card_expiry_date: null | string;
        card_description: null | string;
        phone_number: null | string;
        full_name: string;
        email: string;
        login_with: null | string;
        profile_image: null | string;
        sendbird_user_id: null | string;
        sendbird_access_token: null | string;
        sendbird_channel_url: null | string;
        auth_token: null | string;
        total_orders: null | string;
        total_booking: null | string;
        created_at: string;
        hotel_detail: null | object;
        updated_at: string;
        hotel_booking: null | object;
        hotelbooking: null | object;
    };
    hotel_detail: {};
    booking_token: string;
}

export interface IAccountState {
    access_token: string;
    checkin_token: string;
    isCheckedIn: boolean;
    confirmationResult: any;
    profile: Partial<IProfile>;
    error: Partial<IError>;
    transaction_data: ITransaction[];
    bills: any;
    userData: any;
    verificationCode: number;
    message: string;
    additional_services: any;
    hotel_details: any;
    isCheckedOut: any;
    bookingRefernces: any;
    getActiveBooking: IGetBookingActive;
}

export interface ITransaction {
    id: null | number;
    title: string;
    transaction_item: string;
    price: number;
    timeStamp: string;
    type: string;
}

export interface IForgotPassword {
    message: string;
    code: number;
}
export interface IGetBookingActive {
    message: string;
    code: string;
}

export interface IUpdatePassword {
    message: string;
}
export interface IAdditionalServices {
    id: number;
    bed_number: string;
    price: number;
    created_at: null | string;
    updated_at: null | string;
}

export interface CardDetail {
    cardholder_name: string;
    card_number: string;
    card_number_full: string;
    card_expiry_date: string;
    card_cvv_number: string;
    card_description: string;
    card_address: string;
}
