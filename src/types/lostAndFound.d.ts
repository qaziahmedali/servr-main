import LostAndFound from '../modules/LostAndFound/lostAndFound';
import { IError, ISuccessLostAndFound } from './responseApi';

export interface ILostAndFound {
    hotel_id: number;
    name: string;
    phonenumber: string;
    email: string;
    message: null | string;
}

export interface ILostAndFoundState {
    lostAndFoundItem: ILostAndFound;
    error: Partial<IError>;
}
