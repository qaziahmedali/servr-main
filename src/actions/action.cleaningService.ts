import { IError } from '../types/responseApi';
import { ILaundry, ILaundryService, IData, ILaundryServiceState } from '../types/laundry';

export const ROOM_CLEANING_SERVICE = 'ROOM_CLEANING_SERVICE';
export const ROOM_CLEANING_SERVICE_SUCCESS = 'ROOM_CLEANING_SERVICE_SUCCESS';

export const ROOM_CLEANING_ITEMS = 'ROOM_CLEANING_ITEMS';

export const LAUNDRY_ORDER = 'LAUNDRY_ORDER';
export const LAUNDRY_ORDER_SUCCESS = 'LAUNDRY_ORDER_SUCCESS';

export const CLEANING_SERVICE_FAILED = 'CLEANING_SERVICE_FAILED';

export const GET_LAUNDRY_SERVICES_MENU = 'GET_LAUNDRY_SERVICES_MENU';
// export const GET_LAUNDRY_SERVICES = 'GET_LAUNDRY_SERVICES';
// export const GET_LAUNDRY_SERVICES_SUCCESS = 'GET_LAUNDRY_SERVICES_SUCCESS';

export const GET_LAUNDRY_SERVICES_MENU_SUCCESS = 'GET_LAUNDRY_SERVICES_MENU_SUCCESS';
import {
    GET_LAUNDRY_SERVICE,
    GET_LAUNDRY_SERVICE_SUCCESS,
    TLaundryService,
    TLaundryServiceSuccess,
} from '../types/action.laundryservice';

export const getLaundryServicesMenu = (
    code?: string,
    onSuccess?: (laundry: ILaundry) => void,
    onFailed?: () => void,
) => ({
    type: GET_LAUNDRY_SERVICES_MENU as typeof GET_LAUNDRY_SERVICES_MENU,
    payload: {
        code,
        onSuccess,
        onFailed,
    },
});

// export const getLaundryServices = () => ({
//     type: GET_LAUNDRY_SERVICES as typeof GET_LAUNDRY_SERVICES,
// });
export const getLaundryServices: TLaundryService = (code, onSuccess, onFailed) => ({
    type: GET_LAUNDRY_SERVICE,
    payload: {
        code,
        onSuccess,
        onFailed,
    },
});

export const getLaundryServicesSuccess = (laundry: ILaundryServiceState) => ({
    type: GET_LAUNDRY_SERVICE_SUCCESS as typeof GET_LAUNDRY_SERVICE_SUCCESS,
    payload: {
        laundry,
    },
});
// export const getLaundryServices = (onSuccess?: () => void, onFailed?: () => void) => ({
//     type: GET_LAUNDRY_SERVICES as typeof GET_LAUNDRY_SERVICES,
//     payload: {
//         onSuccess,
//         onFailed,
//     },
// });

export const getLaundryServicesMenuSuccess = (laundry: ILaundry) => ({
    type: GET_LAUNDRY_SERVICES_MENU_SUCCESS as typeof GET_LAUNDRY_SERVICES_MENU_SUCCESS,
    payload: {
        laundry,
    },
});

export const roomCleaningService = (item?: any, onSuccess?: () => void, onFailed?: () => void) => ({
    type: ROOM_CLEANING_SERVICE as typeof ROOM_CLEANING_SERVICE,
    payload: {
        item,
        onSuccess,
        onFailed,
    },
});

export const roomCleaningServiceSuccess = () => ({
    type: ROOM_CLEANING_SERVICE_SUCCESS as typeof ROOM_CLEANING_SERVICE_SUCCESS,
});

export const roomCleaningItems = (code?: any, onSuccess?: (items?: any) => void, onFailed?: () => void) => ({
    type: ROOM_CLEANING_ITEMS as typeof ROOM_CLEANING_ITEMS,
    payload: {
        code,
        onSuccess,
        onFailed,
    },
});

// export type TLaundryType = 'light_dark' | 'mixed_color' | 'ironing_service';

export const laundryOrder = (items: any, onSuccess?: () => void, onFailed?: () => void) => ({
    type: LAUNDRY_ORDER as typeof LAUNDRY_ORDER,
    payload: {
        items,
        onSuccess,
        onFailed,
    },
});

export const laundryOrderSuccess = () => ({
    type: LAUNDRY_ORDER_SUCCESS as typeof LAUNDRY_ORDER_SUCCESS,
});

export const cleaningServiceFailed = (error: any, type: string) => ({
    type: CLEANING_SERVICE_FAILED as typeof CLEANING_SERVICE_FAILED,
    payload: {
        error: {
            error,
            type,
        } as IError,
    },
});

export type ActionCleaningServiceType = ReturnType<
    | typeof roomCleaningService
    | typeof roomCleaningServiceSuccess
    | typeof laundryOrder
    | typeof laundryOrderSuccess
    | typeof cleaningServiceFailed
    | typeof getLaundryServices
    | typeof getLaundryServicesSuccess
    | typeof getLaundryServicesMenu
    | typeof getLaundryServicesMenuSuccess
    | typeof roomCleaningItems
>;
