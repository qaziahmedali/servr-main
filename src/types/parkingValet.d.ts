import { IError } from './responseApi';

export interface IParkingValetState {
    id: number;
    booking_reference: string;
    description: string;
    model_name: string;
    colour: string;
    number_plate: string;
    valet_id_no: string;
    parking_slot_no: string;
    status: string;
}
export interface IParkingState {
    request_type: string;
    manufacturer: string;
    color: string;
    license_plate: string;
    location?: string;
    image: object;
    description?: string;
}

export interface IParkingAndValetReducer {
    parkingValetData: Valet;
    error: Partial<IError>;
}

export interface Vehicle {
    id?: number;
    manufacturer?: string;
    color?: string;
    license_plate?: string;
    location?: string;
    image?: string;
    description?: string;
    valet_id?: number;
}

export interface Valet {
    id?: number;
    date?: string;
    time?: string;
    key_access?: string;
    status?: string;
    request_status?: string;
    hotel_booking_id?: number;
    valet_setting_id?: any;
    valet_time?: string;
    valet_date?: string;
    vehicle: Vehicle;
}

export interface HotelBooking {
    id: number;
    user_detail_id: number;
    hidden_credit_card_number?: any;
    name: string;
    guest_email: string;
    valet: Valet;
}

export interface IValetParking {
    id: number;
    hidden_credit_card_number?: any;
    cardholder_name_plain?: any;
    card_number_plain?: any;
    card_expiry_date_plain?: any;
    card_cvv_number_plain?: any;
    hotel_booking: HotelBooking;
}
