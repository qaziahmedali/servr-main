import { Layout } from 'react-native-navigation';
import { IInAppNotificationProps } from '../modules/_global/InAppNotification';
import { IRestaurantServiceProps } from '../modules/Restaurant/RestaurantService';
import { IRestaurantListProps } from '../modules/Restaurant/RestaurantList';
import { IBookATableProps } from '../modules/Restaurant/BookATable';
import { IOrderRoomServiceProps } from '../modules/Restaurant/OrderRoomService';
import { ISpaBookingTimeProps } from '../modules/Spa/SpaBookingTime';
import { ISpaTreatmentListProps } from '../modules/Spa/SpaTreatmentList';
import { ISpaServiceProps } from '../modules/Spa/SpaService';
import { ICleaningRequestCompleteProps } from '../modules/CleaningService/CleaningRequestComplete';
import { IChatBaseProps } from '../modules/Chat/Chat';
import { IPromotionDetailsProps } from '../modules/promotion/PromotionDetails';
import { IPromotionServiceProps } from '../modules/promotion/PromotionService';
import { IConciergeServiceProps } from '../modules/ConciergeService/ConciergeService';
import { ICheckInProps } from '../modules/CheckIn/CheckIn';
import { ILostAndFoundProps } from '../modules/LostAndFound/lostAndFound';
import { IProfileProps } from '../modules/Profile/Profile';
import { IProfileDataProps } from '../modules/PersonalData/profileData';
import { ICardDetailsProps } from '../modules/CardDetails/CardDetails';
import { IQRCodeScanProps } from '../modules/QRCodeScan/QRcodeScan';
import { ISpaOrderRoomServiceProps } from '../modules/Spa/SpaOrderRoomService';
import { ISpaOrderRoomServiceAllItemsProps } from '../modules/Spa/SpaOrderRoomServiceAllItems';
import { IPaymentDetailScreenProps } from '../modules/_global/paymentDetailsScreen';

export const splashscreen: Layout = {
    component: {
        id: 'splashscreen',
        name: 'SplashScreen',
    },
};
export const latecheckout: Layout = {
    component: {
        id: 'latecheckout',
        name: 'LateCheckOut',
    },
};

export const pickHotel: Layout = {
    stack: {
        children: [
            {
                component: {
                    id: 'pickHotel',
                    name: 'PickHotel',
                },
            },
        ],
    },
};

export const mainmenu: Layout = {
    stack: {
        children: [
            {
                component: {
                    id: 'mainmenu',
                    name: 'MainMenu',
                },
            },
        ],
    },
};

export const mainmenuchildren: Layout = {
    component: {
        id: 'mainmenu',
        name: 'MainMenu',
    },
};

export const checkin = (passProps?: Partial<ICheckInProps>): Layout => ({
    component: {
        id: 'checkin',
        name: 'CheckIn',
        passProps,
    },
});

export const additionalservices = (passProps?: Partial<ICheckInProps>): Layout => ({
    component: {
        id: 'additionalservice',
        name: 'AdditionalService',
        passProps,
    },
});

export const PaymentDetailScreen = (passProps?: Partial<IPaymentDetailScreenProps>): Layout => ({
    component: {
        id: 'paymentDetailScreen',
        name: 'PaymentDetailScreen',
        passProps,
    },
});

export const checkout: Layout = {
    component: {
        id: 'checkout',
        name: 'CheckOut',
    },
};

export const chat = (passProps?: IChatBaseProps): Layout => ({
    component: {
        id: 'chat',
        name: 'Chat',
        passProps,
    },
});

export const LostAndFound = (passProps: Partial<ILostAndFoundProps>): Layout => ({
    component: {
        id: 'lostAndFound',
        name: 'LostAndFound',
        passProps,
    },
});

export const inAppNotification = (passProps?: Partial<IInAppNotificationProps>): Layout => ({
    component: {
        name: 'InAppNotification',
        options: {
            overlay: {
                interceptTouchOutside: true,
            },
        },
        passProps,
    },
});

export const conciergeService = (passProps?: Partial<IConciergeServiceProps>): Layout => ({
    component: {
        id: 'conciergeService',
        name: 'ConciergeService',
        passProps,
    },
});

export const requestItems: Layout = {
    component: {
        id: 'requestItems',
        name: 'RequestItems',
    },
};

export const restaurantList = (passProps?: Partial<IRestaurantListProps>): Layout => ({
    component: {
        id: 'restaurantList',
        name: 'RestaurantList',
        passProps,
    },
});

export const restaurantService = (passProps?: Partial<IRestaurantServiceProps>): Layout => ({
    component: {
        id: 'restaurantService',
        name: 'RestaurantService',
        passProps,
    },
});

export const bookATable = (passProps?: Partial<IBookATableProps>): Layout => ({
    component: {
        id: 'bookATable',
        name: 'BookATable',
        passProps,
    },
});

export const orderRoomService = (passProps?: Partial<IOrderRoomServiceProps>): Layout => ({
    component: {
        id: 'orderRoomService',
        name: 'OrderRoomService',
        passProps,
    },
});

export const trackingProgress: Layout = {
    component: {
        id: 'trackingProgress',
        name: 'TrackingProgress',
    },
};

export const spaService = (passProps: Partial<ISpaServiceProps>): Layout => ({
    component: {
        id: 'spaService',
        name: 'SpaService',
        passProps,
    },
});
export const experienceService: Layout = {
    component: {
        id: 'experienceService',
        name: 'ExperienceService',
    },
};
export const promotionService = (passProps: Partial<IPromotionServiceProps>): Layout => ({
    component: {
        id: 'promotionService',
        name: 'PromotionService',
        passProps,
    },
});
export const promotionDetails = (passProps: Partial<IPromotionDetailsProps>): Layout => ({
    component: {
        id: 'promotionDetails',
        name: 'PromotionDetails',
        passProps,
    },
});

export const spaBookingTime = (passProps: Partial<ISpaBookingTimeProps>): Layout => ({
    component: {
        id: 'spaBookingTime',
        name: 'SpaBookingTime',
        passProps,
    },
});

export const spaTreatmentList = (passProps: Partial<ISpaTreatmentListProps>): Layout => ({
    component: {
        id: 'spaTreatmentList',
        name: 'SpaTreatmentList',
        passProps,
    },
});

export const cleaningService: Layout = {
    component: {
        id: 'cleaningService',
        name: 'CleaningService',
    },
};

export const cleaningRequestComplete = (passProps?: Partial<ICleaningRequestCompleteProps>): Layout => ({
    component: {
        id: 'cleaningRequestComplete',
        name: 'CleaningRequestComplete',
        passProps,
    },
});

export const laundryService: Layout = {
    component: {
        id: 'laundryService',
        name: 'LaundryService',
    },
};
export const hotelMap: Layout = {
    component: {
        id: 'hotelmap',
        name: 'HotelMap',
    },
};

export const spaTrackingProgress: Layout = {
    component: {
        id: 'spaTrackingProgress',
        name: 'SpaTrackingProgress',
    },
};

export const conciergeTrackingProgress: Layout = {
    component: {
        id: 'conciergeTrackingProgress',
        name: 'ConciergeTrackingProgress',
    },
};

export const wakeupCall = (passProps: Partial<any>): Layout => ({
    component: {
        id: 'wakeupCall',
        name: 'wakeupCall',
        passProps,
    },
});

export const mycard = (passProps: Partial<any>): Layout => ({
    component: {
        id: 'mycard',
        name: 'mycard',
        passProps,
    },
});

export const transactionHistory = (passProps: Partial<any>): Layout => ({
    component: {
        id: 'transactionHistory',
        name: 'transactionHistory',
        passProps,
    },
});

export const parkingValet = (passProps: Partial<any>): Layout => ({
    component: {
        id: 'parkingValet',
        name: 'parkingValet',
        passProps,
    },
});

export const parkingValetComplete: Layout = {
    component: {
        id: 'parkingValetComplete',
        name: 'parkingValetComplete',
    },
};

export const wakeupCallComplete: Layout = {
    component: {
        id: 'wakeupCallComplete',
        name: 'wakeupCallComplete',
    },
};

export const promotionOrder = (passProps: Partial<any>): Layout => ({
    component: {
        id: 'promotionOrder',
        name: 'promotionOrder',
        passProps,
    },
});

export const restoMain = (passProps?: Partial<IRestaurantServiceProps>): Layout => ({
    stack: {
        children: [
            {
                component: {
                    id: 'restoMain',
                    name: 'RestaurantService',
                    passProps,
                },
            },
        ],
    },
});

export const Payment = (passProps: Partial<ILostAndFoundProps>): Layout => ({
    component: {
        id: 'payment',
        name: 'Payment',
        passProps,
    },
});

export const Profile = (passProps: Partial<IProfileProps>): Layout => ({
    component: {
        id: 'profile',
        name: 'Profile',
        passProps,
    },
});

export const ProfileData = (passProps: Partial<IProfileDataProps>): Layout => ({
    component: {
        id: 'profileData',
        name: 'ProfileData',
        passProps,
    },
});

export const CardDetails = (passProps: Partial<ICardDetailsProps>): Layout => ({
    component: {
        id: 'cardDetails',
        name: 'CardDetails',
        passProps,
    },
});

export const RoomCleaningService: Layout = {
    component: {
        id: 'roomCleaningService',
        name: 'RoomCleaningService',
    },
};

export const OrderRoomServiceAllItems = (passProps?: Partial<IOrderRoomServiceProps>): Layout => ({
    component: {
        id: 'orderRoomServiceAllItems',
        name: 'OrderRoomServiceAllItems',
        passProps,
    },
});

export const promotionApplied: Layout = {
    component: {
        id: 'promotionApplied',
        name: 'PromotionApplied',
    },
};

// export const QRCodeScan : Layout = {
//     component: {
//         id: 'qrCodeScan',
//         name: 'QRCodeScan'
//     },
// };
export const QRCodeScan = (passProps: Partial<IQRCodeScanProps>): Layout => ({
    component: {
        id: 'QRCodeScan',
        name: 'QRCodeScan',
        passProps,
    },
});

export const proceedRoomCleaning = (passProps?: Partial<IBookATableProps>): Layout => ({
    component: {
        id: 'proceedRoomCleaning',
        name: 'ProceedRoomCleaning',
        passProps,
    },
});

export const proceedRequestItems = (passProps?: Partial<IBookATableProps>): Layout => ({
    component: {
        id: 'proceedRequestItems',
        name: 'ProceedRequestItems',
        passProps,
    },
});

export const spaorderroomservice = (passProps?: Partial<ISpaOrderRoomServiceProps>): Layout => ({
    component: {
        id: 'spaorderroomservice',
        name: 'SpaOrderRoomService',
        passProps,
    },
});

export const spaservicedetail: Layout = {
    component: {
        id: 'spaservicedetail',
        name: 'SpaServiceDetail',
    },
};
export const selflparking: Layout = {
    component: {
        id: 'selfparking',
        name: 'SelfParking',
    },
};
export const valetrequest: Layout = {
    component: {
        id: 'valetrequest',
        name: 'ValetRequest',
    },
};
export const valetparkingcomplete: Layout = {
    component: {
        id: 'valetparkingcomplete',
        name: 'ParkingValetComplete',
    },
};

export const spaorderroomserviceallitems = (
    passProps?: Partial<ISpaOrderRoomServiceAllItemsProps>,
): Layout => ({
    component: {
        id: 'spaorderroomserviceallitems',
        name: 'SpaOrderRoomServiceAllItems',
        passProps,
    },
});
