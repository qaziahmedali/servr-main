// import { connect } from 'react-redux';
// import CheckIn from './CheckIn';
// import { bindActionCreators, Dispatch } from 'redux';
// import { IState } from '../../types/state';

// const mapStateToProps = (state: IState) => ({
//     icon: state.hotel.icon.check_in_color,
//     selectedLanguage: state.language,
//     token: state.account.access_token,
//     AdditionalServices: state.account.additional_services,
//     PrimaryColor:state.hotel.theme.primary_color
// });

// const mapDispatchToProps = (dispatch: Dispatch) => {
//     return bindActionCreators({}, dispatch);
// };

// export interface ICheckInReduxProps
//     extends ReturnType<typeof mapStateToProps>,
//         ReturnType<typeof mapDispatchToProps> {}

// export default connect(mapStateToProps, mapDispatchToProps)(CheckIn);

import { connect } from 'react-redux';
import CheckIn from './CheckIn';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';

import {
    checkOutSuccess,
    signOutSuccess,
    getCurrentBookings,
    getProfile,
    swtichBookingReference,
    checkIn,
    getAddionalServices,
    findBooking,
    getCardDetails,
    updateCardDetails,
    updateProfile,
} from '../../actions/action.account';

import {
    toggleIsInChatScreen,
    updateTotalUnreadMessageSuccess,
    connectSendBird,
    disconnectSendBird,
} from '../../actions/action.chat';

import { getConciergeServiceItems, createRequest } from '../../actions/action.conciergeService';

import { getwakeupCall } from '../../actions/action.conciergeService';
import ProfileData from '../PersonalData/profileData';

import { createSelector } from 'reselect';
import { IPhoto } from '../../../types/action.account';

import { selectLanguage } from '../../actions/action.language';

const selectProfileSelector = createSelector(
    (state: IState) => state.account.profile,
    (state: IState) => state.account.isCheckedIn,
    (profile, isCheckedIn) => {
        return {
            passport_photos: profile.passport_photos
                ? profile.passport_photos.map(
                      (photo): IPhoto => ({ uri: photo, name: photo, type: 'image/jpeg' }),
                  )
                : ([{ uri: '', name: '', type: 'image/jpeg' }] as IPhoto[]),
            arrival_date: profile.arrival_date ? profile.arrival_date : '',
            departure_date: profile.departure_date ? profile.departure_date : '',
            card_number: profile.card_number ? profile.card_number : '',
            cardholder_name: profile.cardholder_name ? profile.cardholder_name : '',
            card_expiry_date: profile.card_expiry_date ? profile.card_expiry_date : '',
            card_address: profile.card_address ? profile.card_address : '',
            phone_number: profile.phone_number ? profile.phone_number : '+',
            reference: isCheckedIn ? (profile.reference ? profile.reference : '-') : '',
            room_number: isCheckedIn ? (profile.room_number ? profile.room_number : '-') : '',
            note_request: isCheckedIn ? (profile.note_request ? profile.note_request : '-') : '',
            password: profile.password ? profile.password : '',
            email: profile.email ? profile.email : '',
            already_checked_in: profile.alreadyCheckedIn ? profile.alreadyCheckedIn : false,
            user_id: profile.user_id ? profile.user_id : 0,
            additional_services: profile.additional_services ? profile.additional_services : [],
            signature_photo: {
                uri: profile.signature_photo ? profile.signature_photo[0] : '',
                name: profile.signature_photo ? profile.signature_photo[0] : '',
                type: 'image/png',
            },
        };
    },
);

const mapStateToProps = (state: IState) => ({
    icon: state.hotel.icon.check_in_color,
    selectedLanguage: state.language,
    token: state.account.access_token,
    AdditionalServices: state.account.additional_services,
    PrimaryColor: state.hotel.theme.primary_color,

    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    type: state.hotel.type,
    resto: state.restaurant.restaurants[0],
    color: state.hotel.theme.primary_color,
    restoGuest: state.restaurant.restoGuest,
    chainData: state.chainData,

    profileData: state.account.userData,

    countUnreadMessage: state.chat.unreadMessage,
    bookingReferences: state.account.bookingRefernces,
    access_token: state.account.access_token,
    hotel_code: state.hotel.code,

    idHotel: state.hotel.id,

    profile: selectProfileSelector(state),

    hotel: state.account,
    hotelCode: state.hotel.code,
    currency: state.hotel.currency,

    additional_service_id: state.account.profile.additional_service_id,

    serviceItems: state.conciergeService.serviceItems,
    // color: state.hotel.icon.concierge_color,

    code: state.hotel.code,
    primaryColor: state.hotel.theme.primary_color,
    vat: state.account.hotel_details.data.vat,
    icon: state.hotel.icon,
    card: state.account.profile,
    hotelTaxes: state.hotelTaxes,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getCardDetails,
            updateCardDetails,
            updateProfile,
            checkOutSuccess,
            toggleIsInChatScreen,
            updateTotalUnreadMessageSuccess,
            signOutSuccess,
            getCurrentBookings,
            swtichBookingReference,
            connectSendBird,
            getProfile,
            getwakeupCall,
            disconnectSendBird,
            checkIn,

            selectLanguage,
            getAddionalServices,
            findBooking,

            getConciergeServiceItems,
            createRequest,
        },
        dispatch,
    );
};

export interface ICheckInReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(CheckIn);
