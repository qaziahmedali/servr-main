import { IError } from './responseApi';

export interface ILaundry {
    // id: number;
    // name: string;
    // logo_url: string[];
    laundries: {};
}

export interface ILaundryState {
    laundry: ILaundryService[];
    error: Partial<IError>;
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
