import { IProfile, ITransaction, IUserData, IAdditionalServices } from './account';
import { IState } from './state';
import { IIconHotel, IThemeHotel, IFeatureHotel } from './hotel';
import { dependencies } from '../utils/configureStore';
import { Subject } from 'rxjs';
import { IRestaurant, ICategoryDish, ITrackingProgressOrderRoomService } from './restaurant';
import { IServiceItem, IConciergeTrackingProgressOrderRoomService } from './conciergeService';
import { ISpa, ISpaTreatment, ISpaTrackingProgressOrderRoomService } from './spa';
import { IPromotion, IPromotionDetails } from './promotion';
import { ILaundryState } from './laundry';
import { IParkingValetState } from './parkingValet';

// import { TLaundryType } from '../actions/action.cleaningService';
import { IExperience, IExperienceHotelMap } from './experience';
import { AdditionalServiceData, AdditionalServiceList, Meta } from './additionalservice';

export type TDependency = typeof dependencies;

export interface IDependencies<T = any> extends TDependency {
    getState: () => IState;
    action: T;
    cancelled$: Subject<void>;
}

export interface IError {
    error: any;
    type: string;
}

export interface IFailedResponse {
    message: string;
    errors?: {
        [x: string]: string[];
    };
}

export interface ISuccessGetHotelDetail {
    message: string;
    data: {
        id: number;
        code: string;
        description: string;
        name: string;
        hotel_logo_lg: string;
        hotel_logo_md: string;
        hotel_logo_sm: string;
        category: string;
        currency: string;
        layout: {
            theme: IThemeHotel;
            icons: IIconHotel;
        };
        hotel_features: IFeatureHotel;
    };
    type: any;
    resto: any;
}

export interface ISuccessHotelList {
    message: string;
    hotels: [];
}

export interface ISuccessCheckIn {
    message: string;
    data: {
        booking_token: string;
        booking: IProfile;
    };
}

export interface ISuccessLogin extends ISuccessCheckIn {}

export interface ISuccessUserLogIn {
    message: string;
    data: IUserData;
}

export interface ISuccessGetMe {
    message: string;
    data: IProfile;
}

export interface ISuccessGetRestaurants {
    data: IRestaurant[];
    message: string;
}

export interface IdeleteOrder {
    message: string;
}

export interface IwakeupCall {
    message: string;
}

export type ISuccessGetRestaurantDishes = ICategoryDish[];

export type ISuccessConciergeServiceItems = IServiceItem[];

export type TSuccessConciergeTrackingProgressSuccess = IConciergeTrackingProgressOrderRoomService[];

export type ISuccessDeleteOrder = IdeleteOrder;
export type ISuccessWakeupCall = IwakeupCall;

export interface ISuccessCreateRequest {
    message: string;
}

export interface ISuccessBookATable {
    data: {
        booking_date: string;
        id: number;
        people_number: number;
        restaurant_id: number;
    };
    message: string;
}

export interface ISuccessTrackingProgressOrderRoomService {
    data: ITrackingProgressOrderRoomService[];
    message: string;
}

export interface ISuccessGetSpa {
    data: ISpa;
    message: string;
}

export interface ISuccessGetPromotion {
    data: IPromotion;
    message: string;
}
export interface ISuccessGetPromotionDetails {
    data: IPromotionDetails[];
    images: [];
    message: string;
}
export interface ISuccessGetLaundriesMenu {
    data: ILaundryState[];
    // images:[]
    // message: string;
}
export interface ISuccessGetRoomCleaningItems {
    data: any;
    // images:[]
    // message: string;
}

export interface ISuccessGetSpaTreatment {
    data: ISpaTreatment[];
    message: string;
}
export interface ISuccessGetExperience {
    data: IExperience;
    message: string;
}

export interface ISuccessLaundryOrder {
    data: {
        id: number;
        type: any;
        status: 'pending' | 'complete';
        created_at: string;
    };
    message: string;
}

export interface ISuccessRoomCleaningService {
    data: {
        id: number;
        status: 'pending' | 'complete';
        created_at: string;
    };
    message: string;
}
export interface IGetHotelMap {
    data: IExperienceHotelMap;
    message: string;
}

export interface ISuccessSpaTrackingProgressOrderRoomService {
    data: ISpaTrackingProgressOrderRoomService[];
    message: string;
}

export interface ISuccessGetTransactionHistroy {
    data: ITransaction;
}

export interface ISuccessGetParkingValet {
    data: IParkingValetState[];
    message: string;
}
export interface ISuccessGetGrabRequest {
    message: string;
}
export interface ISuccessGetReParkRequest {
    message: string;
}

export interface ISuccessRequestParkingValet {
    id: string;
}

//Lost and found success
export interface ISuccessLostAndFound {
    message: string;
    success: boolean;
}

export interface ISuccessSignUp {
    message: string;
    data: {
        full_name: string;
        email: string;
        updated_at: string;
        created_at: string;
        id: number;
    };
}
export interface ISuccessAdditionalServices {
    message: string;
    data: IAdditionalServices;
}
export interface IAdditionalServiceResponse {
    data: AdditionalServiceData[];
    meta: Meta;
}

export interface IAdditionalServiceList {
    message: string;
    additional_services: AdditionalServiceList[];
}
