import { combineReducers } from 'redux';
import account from './reducer.account';
import hotel from './reducer.hotel';
import chat from './reducer.chat';
import restaurant from './reducer.restaurant';
import conciergeService from './reducer.conciergeService';
import spa from './reducer.spa';
import promotion from './reducer.promotion';
import experience from './reducer.experience';
import laundry from './reducer.laundry';
import language from './reducer.language';
import parkingValet from './reducer.parkingValet';
import lostandfound from './reducer.lostandfound';
import app from './reducer.app';
import chainData from './reducer.chainData';
import additionalService from './reducer.additionalService';
import hotelTaxes from './reducer.hotelTaxes';

export default combineReducers({
    account,
    chainData,
    hotelTaxes,
    hotel,
    chat,
    restaurant,
    conciergeService,
    spa,
    promotion,
    experience,
    laundry,
    language,
    parkingValet,
    lostandfound,
    app,
    additionalService,
});
