import { IError } from './responseApi';

export type TStatusProgress = 'pending' | 'confirmed' | 'on_the_way' | 'cancelled' | 'done' | 'rejected';

export interface IRestaurant {
    id: number;
    name: string;
    logo_url: string;
    galleries: string[];
    res_table_numbers: any;
    res_table_layout: any;
}

export interface IDish {
    id: number;
    restaurant_id: number;
    name: string;
    description: null | string;
    price: number;
    category: string;
    image: string;
    dish_id: number;
}

export interface ICategoryDish {
    name: string;
    dishes: IDish[];
}

export interface IDishProgress extends Pick<IDish, 'name' | 'description'> {
    price: number;
    qty: number;
    note: string | null;
}

export interface ITrackingProgressOrderRoomService {
    id: number;
    restaurant: Omit<IRestaurant, 'galleries'>;
    total_price: number;
    dishes: IDishProgress[];
    datetime: string;
    status: TStatusProgress;
    loader: boolean;
}

export interface IRestaurantState {
    restaurants: IRestaurant[];
    dishCategories: ICategoryDish[];
    trackingProgressOrderRoomService: ITrackingProgressOrderRoomService[];
    error: Partial<IError>;
    restoGuest: any;
    random_dishes : any
}
