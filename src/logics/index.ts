import accountLogic from './logic.account';
import hotelLogic from './logic.hotel';
import chatLogic from './logic.chat';
import notificationLogic from './logic.notification';
import restaurantLogic from './logic.restaurant';
import conciergeServiceLogic from './logic.conciergeService';
import spaLogic from './logic.spa';
import cleaningServiceLogic from './logic.cleaningService';
import promotionLogic from './logic.promotion';
import experienceLogic from './logic.experience';
import parkingValetLogin from './logic.parkingValet';
import lostandfoundLogic from './logic.lostAndFound';
import appUpdateLogic from './logic.app';
import chaindataLogic from './logic.chainData';
import hotelTaxesLogin from './logic.hotelTaxes';
import additionalServiceLogic from './logic.additionalservice';

export default [
    ...accountLogic,
    ...hotelLogic,
    ...chatLogic,
    ...notificationLogic,
    ...restaurantLogic,
    ...conciergeServiceLogic,
    ...spaLogic,
    ...cleaningServiceLogic,
    ...promotionLogic,
    ...experienceLogic,
    ...parkingValetLogin,
    ...lostandfoundLogic,
    ...appUpdateLogic,
    ...chaindataLogic,
    ...hotelTaxesLogin,
    ...additionalServiceLogic,
];
