import { IError } from './responseApi';

export interface IPromotion {
    id: number;
    name: string;
    logo_url: string[];
    promotions: {};
}

export interface IPromotionDetails {
    PromotionDetails: { images: [] };
}

export interface IPromotionState {
    promotion: IPromotion;
    promotionDetails: IPromotionDetails;
    error: Partial<IError>;
}

export interface IOrderPromotion {
    table_id: number;
    start_date: string;
    end_date: string;
}
