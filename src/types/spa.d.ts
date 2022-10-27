import { IError } from './responseApi';
export type TStatusProgress = 'pending' | 'confirmed' | 'on_the_way' | 'cancelled' | 'done' | 'rejected';
export interface ISpa {
    images: any;
    id: number;
    name: string;
    logo_url: string[];
    spa_room_service: boolean;
    spa_treatment: boolean;
}

export interface ISpaTreatment {
    id: number;
    name: string;
    description: string | null;
    duration: string;
    price: number;
    image: string;
    note: string;
}

export interface ISpaTrackingProgressOrderRoomService {
    spa_id: number;
    people_number: string;
    total_price: string;
    treatments: ISpaTreatment[];
    datetime: string;
    status: TStatusProgress;
    booking_type: string;
    booking_date: string;
}

export interface ISpaState {
    spa: ISpa;
    // spaTrackingProgressOrderRoomService: ISpaTrackingProgressOrderRoomService[];
    treatments: ISpaTreatment[];
    error: Partial<IError>;
    spaTrakingProgress: ISpaTrackingProgressOrderRoomService[];
}
