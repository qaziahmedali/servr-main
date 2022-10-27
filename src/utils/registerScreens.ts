import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { Store } from 'redux';
import SplashScreen from '../modules/SplashScreen/SplashScreen.Container';
import SpaOrderRoomService from '../modules/Spa/SpaOrderRoomService.Container';
import SpaOrderRoomServiceAllItems from '../modules/Spa/SpaOrderRoomServiceAllItems.Container';
import SpaServiceDetail from '../modules/Spa/SpaServiceDetail.Container';
import PickHotel from '../modules/PickHotel/PickHotel.Container';
import MainMenu from '../modules/MainMenu/MainMenu.Container';
import CheckIn from '../modules/CheckIn/CheckIn.Container';
import CheckOut from '../modules/CheckOut/CheckOut.Container';
import LateCheckOut from '../modules/CheckOut/Components/LateCheckOut.Container';

import Chat from '../modules/Chat/Chat.Container';
import InAppNotification from '../modules/_global/InAppNotification';
import ConciergeService from '../modules/ConciergeService/ConciergeService.Container';
import RequestItems from '../modules/ConciergeService/RequestItems.Container';
import RestaurantList from '../modules/Restaurant/RestaurantList.Container';
import RestaurantService from '../modules/Restaurant/RestaurantService';
import BookATable from '../modules/Restaurant/BookATable.Container';
import OrderRoomService from '../modules/Restaurant/OrderRoomService.Container';
import TrackingProgress from '../modules/Restaurant/TrackingProgres.Container';
import SpaService from '../modules/Spa/SpaService.Container';
import SpaBookingTime from '../modules/Spa/SpaBookingTime.Container';
import SpaTreatmentList from '../modules/Spa/SpaTreatmentList.Container';
import CleaningService from '../modules/CleaningService/CleaningService.Container';
import CleaningRequestComplete from '../modules/CleaningService/CleaningRequestComplete.Container';
import LaundryService from '../modules/CleaningService/LaundryService.Container';
import PromotionService from '../modules/promotion/PromotionService.Container';
import ExperienceService from '../modules/Experience/Experience.Container';
import HotelMap from '../modules/Experience/HotelMap.Container';
import PromotionDetails from '../modules/promotion/PromotionDetails.Container';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import SpaTrackingProgress from '../modules/Spa/SpaTrackingProgres.Container';
import ConciergeTrackingProgress from '../modules/ConciergeService/ConciergeTrackingProgres.Container';
import WakeupCall from '../modules/ConciergeService/WakeupCall.Container';
import MyCard from '../modules/Restaurant/MyCard.Container';
import TransactionHistory from '../modules/CheckOut/TransactionHistory.Container';
import ParkingValet from '../modules/ParkingValet/ParkingValet.Container';
import SelfParking from '../modules/ParkingValet/SelfParking.Container';
import ValetRequest from '../modules/ParkingValet/ValetRequest.Container';
import ParkingValetComplete from '../modules/ParkingValet/ParkingValetComplete.Container';
import WakeupCallComplete from '../modules/ConciergeService/WakeupCallComplete.Container';
import PromotionOrder from '../modules/promotion/PromotionOrder.Container';
import LostAndFound from '../modules/LostAndFound/lostAndFound.Container';
import Payment from '../modules/CheckOut/payment';
import Profile from '../modules/Profile/Profile.Container';
import ProfileData from '../modules/PersonalData/profileData.container';
import CardDetails from '../modules/CardDetails/CardDetails.container';
import RoomCleaningService from '../modules/ConciergeService/RoomCleaningService.Container';
import Card from '../modules/CheckOut/Components/card';
import OrderRoomServiceAllItems from '../modules/Restaurant/OrderRoomServiceAllItems.Container';
import PromotionApplied from '../modules/PromotionApplied/PromotionApplied.Container';
import ProceedRoomCleaning from '../modules/ConciergeService/proceedRoomCleaning.Container';
import ProceedRequestItems from '../modules/ConciergeService/proceedRequestItems.Container';
import QRCodeScan from '../modules/QRCodeScan/QRCode.Container';
import PaymentDetailScreen from '../modules/_global/paymentDetailsScreen';
import AdditionalServiceContainer from '../modules/CheckIn/AdditionalService.Container';

export default (store: Store) => {
    Navigation.registerComponentWithRedux('SplashScreen', () => SplashScreen, Provider, store);
    Navigation.registerComponentWithRedux('PickHotel', () => PickHotel, Provider, store);
    Navigation.registerComponentWithRedux(
        'SpaOrderRoomServiceAllItems',
        () => SpaOrderRoomServiceAllItems,
        Provider,
        store,
    );
    Navigation.registerComponentWithRedux('SpaOrderRoomService', () => SpaOrderRoomService, Provider, store);
    Navigation.registerComponentWithRedux('SpaServiceDetail', () => SpaServiceDetail, Provider, store);
    Navigation.registerComponentWithRedux('MainMenu', () => MainMenu, Provider, store);
    Navigation.registerComponentWithRedux('CheckIn', () => CheckIn, Provider, store);
    Navigation.registerComponentWithRedux('CheckOut', () => CheckOut, Provider, store);
    Navigation.registerComponentWithRedux('Chat', () => Chat, Provider, store);
    Navigation.registerComponentWithRedux('InAppNotification', () => InAppNotification, Provider, store);
    Navigation.registerComponentWithRedux('ConciergeService', () => ConciergeService, Provider, store);
    Navigation.registerComponentWithRedux('RequestItems', () => RequestItems, Provider, store);
    Navigation.registerComponentWithRedux('RestaurantList', () => RestaurantList, Provider, store);
    Navigation.registerComponentWithRedux('RestaurantService', () => RestaurantService, Provider, store);
    Navigation.registerComponentWithRedux('BookATable', () => BookATable, Provider, store);
    Navigation.registerComponentWithRedux('OrderRoomService', () => OrderRoomService, Provider, store);
    Navigation.registerComponentWithRedux('TrackingProgress', () => TrackingProgress, Provider, store);
    Navigation.registerComponentWithRedux('SpaService', () => SpaService, Provider, store);
    Navigation.registerComponentWithRedux('SpaBookingTime', () => SpaBookingTime, Provider, store);
    Navigation.registerComponentWithRedux('SpaTreatmentList', () => SpaTreatmentList, Provider, store);
    Navigation.registerComponentWithRedux('CleaningService', () => CleaningService, Provider, store);
    Navigation.registerComponentWithRedux('LostAndFound', () => LostAndFound, Provider, store);
    Navigation.registerComponentWithRedux('PaymentDetailScreen', () => PaymentDetailScreen, Provider, store);
    Navigation.registerComponentWithRedux('Payment', () => Payment, Provider, store);
    Navigation.registerComponentWithRedux('Profile', () => Profile, Provider, store);
    Navigation.registerComponentWithRedux('ProfileData', () => ProfileData, Provider, store);
    Navigation.registerComponentWithRedux('CardDetails', () => CardDetails, Provider, store);
    Navigation.registerComponentWithRedux('RoomCleaningService', () => RoomCleaningService, Provider, store);
    Navigation.registerComponentWithRedux(
        'OrderRoomServiceAllItems',
        () => OrderRoomServiceAllItems,
        Provider,
        store,
    );
    Navigation.registerComponentWithRedux('PromotionApplied', () => PromotionApplied, Provider, store);
    Navigation.registerComponentWithRedux('ProceedRoomCleaning', () => ProceedRoomCleaning, Provider, store);
    Navigation.registerComponentWithRedux('ProceedRequestItems', () => ProceedRequestItems, Provider, store);
    Navigation.registerComponentWithRedux('QRCodeScan', () => QRCodeScan, Provider, store);
    Navigation.registerComponentWithRedux(
        'CleaningRequestComplete',
        () => CleaningRequestComplete,
        Provider,
        store,
    );
    Navigation.registerComponentWithRedux('PromotionService', () => PromotionService, Provider, store);
    Navigation.registerComponentWithRedux('ExperienceService', () => ExperienceService, Provider, store);
    Navigation.registerComponentWithRedux('LaundryService', () => LaundryService, Provider, store);
    Navigation.registerComponentWithRedux('HotelMap', () => HotelMap, Provider, store);
    Navigation.registerComponentWithRedux(
        'PromotionDetails',
        () => gestureHandlerRootHOC(PromotionDetails),
        Provider,
        store,
    );
    Navigation.registerComponentWithRedux('SpaTrackingProgress', () => SpaTrackingProgress, Provider, store);
    Navigation.registerComponentWithRedux(
        'ConciergeTrackingProgress',
        () => ConciergeTrackingProgress,
        Provider,
        store,
    );
    Navigation.registerComponentWithRedux('wakeupCall', () => WakeupCall, Provider, store);
    Navigation.registerComponentWithRedux('mycard', () => MyCard, Provider, store);
    Navigation.registerComponentWithRedux('transactionHistory', () => TransactionHistory, Provider, store);
    Navigation.registerComponentWithRedux('parkingValet', () => ParkingValet, Provider, store);
    Navigation.registerComponentWithRedux(
        'ParkingValetComplete',
        () => ParkingValetComplete,
        Provider,
        store,
    );
    Navigation.registerComponentWithRedux('SelfParking', () => SelfParking, Provider, store);
    Navigation.registerComponentWithRedux('ValetRequest', () => ValetRequest, Provider, store);
    Navigation.registerComponentWithRedux('wakeupCallComplete', () => WakeupCallComplete, Provider, store);
    Navigation.registerComponentWithRedux('promotionOrder', () => PromotionOrder, Provider, store);
    Navigation.registerComponentWithRedux('LateCheckOut', () => LateCheckOut, Provider, store);
    Navigation.registerComponentWithRedux(
        'AdditionalService',
        () => AdditionalServiceContainer,
        Provider,
        store,
    );
};
