// import Config from 'react-native-config';
// http://192.168.100.39/server_hotels/public/api
// account
// var oldBaseUrl = "https://api.servrhotels.com"
// var baseUrl = 'http://api.servr.5stardesigners.net/';

import axios from 'axios';
import moment from 'moment';
import { getBaseUrl } from './tempFile';

// var baseUrl = 'https://apiuat.servr.5stardesigners.net/';
// var baseUrl = 'https://api.servrhotels.com';  // Prod

// var baseUrl = 'http://d669-101-50-103-182.ngrok.io/api'; // local
// var baseUrl = 'http://c72e-101-50-67-122.ngrok.io/api'

var baseUrl;
const date1 = moment().format('YYYY/MM/DD HH:mm:ss');
const date2 = moment('2021/09/24 23:59:00').format('YYYY/MM/DD HH:mm:ss');

// if (moment(date1).isAfter(date2)) {
//     baseUrl = "https://staging.api.servrhotels.com"
//     // alert(date1)
// } else {
//     baseUrl = "https://staging.api.servrhotels.com"
//     // alert(date2)
// }

baseUrl = getBaseUrl();
// baseUrl = 'https://staging.api.servrhotels.com';
// baseUrl = 'http://a67a-182-182-206-76.ngrok.io/api'
// console.log(baseUrl)
export const APP_UPDATE_API = `${baseUrl}/app-update`;
export const API_URL = `https://app-url.servrhotels.com/app-url`;
export const SIGNUP = `${baseUrl}/auth/register?`;
// export const SIGNUP = `${baseUrl}/api/auth/login`;
export const LOGIN_CUSTOMER = `${baseUrl}/auth/login`;
// export const LOGIN_CUSTOMER = `${baseUrl}/api/auth/login`;
export const GOOGLELOGIN = `${baseUrl}/auth/google-login`;
export const FORGOTPASSWORD = `${baseUrl}/auth/forgot-password?`;
export const UPDATEPASSWORD = `${baseUrl}/auth/update-password?`;
export const FIND_BOOKING_API = `${baseUrl}/find-booking`;

export const UPDATE_PROFILE_API = `${baseUrl}/auth/update-profile`;
export const GET_CARD_DETAILS = `${baseUrl}/get-card-details`;
export const UPDATE_CARD_DETAILS_API = `${baseUrl}/update-card-details`;
export const ME = `${baseUrl}/auth/me/{hotel_code}`;

export const LATE_CHECKOUT = `${baseUrl}/late-check-out`;
export const USER_CHECKOUT = `${baseUrl}/checkout`;
export const GET_TRANSACTION_HISTORY_API = `${baseUrl}/orders/all`;

// booking
export const BOOKING = `${baseUrl}/check-in`;
export const HOTEL_DETAIL = `${baseUrl}/hotels/{code}`;

// concierge service
export const CONCIERGE_SERVICE_ITEMS = `${baseUrl}/concierge-services/request-item-services?hotel_code={code}`; // get
export const CONCIERGE_CREATE_REQUEST = `${baseUrl}/concierge-services/request-items`; // post
export const CONCIERGE_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_API = `${baseUrl}/orders/all-bookings`; // post
export const DELETE_CONCIERGE_ORDER_API = `${baseUrl}/orders/delete-concierge-service?id={order_id}&type={order_type}`;
export const WAKEUP_CALL_API = `${baseUrl}/concierge-services/add-wakeup-call`; // post
// export const VALET_PARKING = `${baseUrl}/add-parking-details`; // post
export const VALET_PARKING = `${baseUrl}valet-request`; // post
export const UPDATE_VALET_PARKING_API = `${baseUrl}/update-parking-details`;

// restaurant
export const GET_RESTAURANTS = `${baseUrl}/restaurants?hotel_code={code}`;
export const GET_RESTAURANT_DISHES = `${baseUrl}/restaurants/{restaurant_id}/dishes?hotel_code={code}`;
export const GET_RANDOM_RESTAURANT_DISHES = `${baseUrl}/restaurants/{restaurant_id}/get-random-dishes`;
export const CREATE_ROOM_SERVICE_ORDER = `${baseUrl}/restaurants/{restaurant_id}/room-order`;
export const CREATE_BOOK_A_TABLE = `${baseUrl}/restaurants/{restaurant_id}/reservation`;
export const TRACKING_PROGRESS_ORDER_ROOM_SERVICE_API = `${baseUrl}/orders/restaurant/room-orders?hotel_code={code}`;
export const DELETE_ORDER_API = `${baseUrl}/orders/restaurant/delete-room-service/{order_id}`;
export const DELETE_RESERVATIOn_ORDER_API = `${baseUrl}/orders/restaurant/delete-reservation/{order_id}`;

// spa
export const GET_SPA_API = `${baseUrl}/spas/{code}`;
export const GET_SPA_TREATMENT_API = `${baseUrl}/spas/{spa_id}/treatments?hotel_code={code}`;
export const GET_SPA_ALL_TREATMENT_CATEGORIES = `${baseUrl}/spas/{spa_id}/all-treatments`;
export const BOOKING_SPA = `${baseUrl}/spas/{spa_id}/bookings`;
export const SPA_TRACKING_PROGRESS_ORDER_ROOM_SERVICE_API = `${baseUrl}/orders/spas`;
export const DELETE_SPA_ORDER_API = `${baseUrl}/orders/spa-delete/{order_id}`;

// cleaning service
export const ROOM_CLEANING_SERVICE_API = `${baseUrl}/room-cleanings`;
export const LAUNDRY_SERVICES_MENU_API = `${baseUrl}/orders/laundry-services?hotel_code={code}`;
export const LAUNDRY_SERVICES_API = `${baseUrl}/laundries/laundry-services/{hotel_code}`;
export const ROOM_CLEANING_ITEMS_API = `${baseUrl}/concierge-services/room-cleaning-services?hotel_code={code}`;
export const LAUNDRY_ORDER_API = `${baseUrl}/laundries`;

// promotion service
// export const GET_PROMOTION_API = `http://api.servrhotelclientdemo.tk`;
// Experience service
export const GET_EXPERIENCE_API = `${baseUrl}/experience/all/{hotel_id}`;
export const GET_SPECIFIC_PROMOTION_API = `${baseUrl}/experience/`; //details
export const GET_PROMOTION_API = `${baseUrl}/experience/promotion/`;
export const ORDER_PROMOTION_API = `${baseUrl}/experience/experience-booking`;

// chat
export const UPLOAD_CHAT_IMAGE = `${baseUrl}/upload-chat-image`;

// Pariking and Valet
export const GET_PARKING_VALET_API = `${baseUrl}/my-valet-request`;
export const GET_GRAB_REQUEST = `${baseUrl}/grab-request`;
export const GET_RE_PARK_REQUEST_API = `${baseUrl}/valet-mark-as-done`;
// export const GET_PARKING_VALET_API = `${baseUrl}/parking/all`;
export const REQUEST_PARKING_VALET_API = `${baseUrl}/parking/request-valet`;

// export const GET_PROMOTION_API = `https://api.servrhotels.com/experience/promotion/{hotel_id}`;

//LOST_AND_FOUND_API
export const POST_LOST_AND_FOUND_API = `${baseUrl}/lost-and-found-request`;

//QUICK_CHECK_OUT_APIS
export const BILLS_API = `${baseUrl}/restaurants/bill`;
export const QUICK_CHECKOUT_API = `${baseUrl}/quick-check-out`;

export const ALREADY_CHECKED_IN_API = `${baseUrl}/guest-login`;

export const TRANSACTION_HISTORY_PAYMENT_API = `${baseUrl}/payment-transaction`;
export const HOTEL_LIST_API = `${baseUrl}/hotels`;

//get additional services

export const GET_ADDITIONAL_SERVICES_API = `${baseUrl}/get-additional-services?hotel_id={code}`;
export const GET_WAKEUP_CALL_API = `${baseUrl}/concierge-services/get-wakeup-call`;

//Send Verification link
export const SEND_VERIFICATION_LINK_API = `${baseUrl}/auth/send-verification-link`;
export const SWITCH_REFERNCES_API = `${baseUrl}/get-current-bookings`;
export const SET_BOOKING_ACTIVE_API = `${baseUrl}/set-booking-active`;

// Chain Data
export const CHAIN_DATA_API = `${baseUrl}/chain-data`;
//Conceirge AdditioanlServices APIS
export const GET_ADDITIONAL_SERVICES_LIST = `${baseUrl}/additional-services`;
export const BOOK_ADDITIONAL_SERVICES = `${baseUrl}/additional-services/book`;

// Stages Hotel Taxes api
export const GET_STAGES_HOTELS_TAXES_API = `${baseUrl}/hotels/taxes/{hotel_id}`;
// export const GET_STAGES_HOTELS_TAXES = `${baseUrl}/experience/all/{hotel_id}`;
// https://api.signup.staging.servrhotels.com/hotels/taxes/1
