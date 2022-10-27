import { connect } from 'react-redux';
import Profile from './Profile';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import {
    checkOutSuccess,
    signOutSuccess,
    getCurrentBookings,
    getProfile,
    swtichBookingReference,
} from '../../actions/action.account';
import {
    toggleIsInChatScreen,
    updateTotalUnreadMessageSuccess,
    connectSendBird,
    disconnectSendBird,
} from '../../actions/action.chat';
import { getwakeupCall } from '../../actions/action.conciergeService';
import { selectLanguage } from '../../actions/action.language';
import { getCardDetails } from '../../actions/action.account';
import { getChainData } from '../../actions/action.chainData';
import { getHotelDetail, getHotelList } from '../../actions/action.hotel';

const mapStateToProps = (state: IState) => ({
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    type: state.hotel.type,
    resto: state.restaurant.restaurants[0],
    color: state.hotel.theme.primary_color,
    restoGuest: state.restaurant.restoGuest,
    profileData: state.account.userData,
    countUnreadMessage: state.chat.unreadMessage,
    bookingReferences: state.account.bookingRefernces,
    access_token: state.account.access_token,
    hotel_code: state.hotel.code,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getCardDetails,
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
            selectLanguage,
            getHotelDetail,
            getHotelList,
            getChainData,
        },
        dispatch,
    );
};

export interface IProfileReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
