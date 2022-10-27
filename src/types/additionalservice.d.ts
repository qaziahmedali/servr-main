export interface AdditionalServiceList {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
}

export interface AdditionalServiceData {
    id: number;
    hotel_booking_id: number;
    additional_service_id: number;
    name: string;
    image: string;
    price: string;
    quantity: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Meta {
    attempts: number;
    done: number;
    skipped: number;
}

export interface IAdditioanlServiceState {
    additionalServiceList: AdditionalServiceList[];
    bookAdditionalServiceData: AdditionalServiceData[];
}
