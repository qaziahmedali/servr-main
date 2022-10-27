import { connect } from 'react-redux';
import CheckInForm from './CheckInForm';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../../types/state';
import {
    checkIn,
    getProfile,
    getAddionalServices,
    findBooking,
    getCardDetails,
} from '../../../actions/action.account';
import { createSelector } from 'reselect';
import { IPhoto } from '../../../types/action.account';
import { selectLanguage } from '../../../actions/action.language';
import { connectSendBird, disconnectSendBird } from '../../../actions/action.chat';
import { getwakeupCall } from '../../../actions/action.conciergeService';
import { State } from 'react-native-gesture-handler';

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
    idHotel: state.hotel.id,
    isCheckedIn: state.account.isCheckedIn,
    profile: selectProfileSelector(state),
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    color: state.hotel.icon.check_in_color,
    selectedLanguage: state.language,
    token: state.account.access_token,
    hotel: state.account,
    hotelCode: state.hotel.code,
    currency: state.hotel.currency,
    AdditionalServices: state.account.additional_services,
    additional_service_id: state.account.profile.additional_service_id,
    PrimaryColor: state.hotel.theme.primary_color,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            checkIn,
            getProfile,
            selectLanguage,
            getAddionalServices,
            findBooking,
            connectSendBird,
            getwakeupCall,
            getCardDetails,
            disconnectSendBird,
        },
        dispatch,
    );
};

export interface ICheckInFormReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(CheckInForm);
