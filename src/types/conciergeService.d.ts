import { IError } from './responseApi';

export interface IServiceItem {
    id: number;
    name: string;
    description: null | string;
}

export interface IConciergeTrackingProgressOrderRoomService {
    id: number;
    request_type: string;
    status: string;
    created_at: string;
    services: string[];
}

export interface IConciergeServiceState {
    serviceItems: IServiceItem[];
    error: Partial<IError>;
    conciergeTrakingProgress: IConciergeTrackingProgressOrderRoomService[];
    wakeUpCall: {};
}

export interface ILaundryService {
    id: number;
    hotel_id: number;
    name: string;
    description: string;
    image: string;
    created_at: string;
    updated_at: string;
    deleted_at?: any;
    price: number;
}

export interface IData {
    laundries: ILaundryService[];
}

export interface ILaundryServiceState {
    message: string;
    data: IData;
}
