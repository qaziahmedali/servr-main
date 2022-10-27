import { connect } from 'react-redux';
import MainMenu, { IMainMenuProps } from './MainMenu';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import {
    connectSendBird,
    onMessageReceived,
    removeOnMessageReceived,
    getTotalUnreadMessage,
    handleAppStateChange,
    removeAppStateChange,
    disconnectSendBird,
    updateTotalUnreadMessageSuccess,
    toggleIsInChatScreen,
} from '../../actions/action.chat';
import {
    onTokenNotifRefresh,
    requestNotifPermission,
    removeOnTokenNotifRefresh,
} from '../../actions/action.notification';
import {
    lateCheckOut,
    getProfile,
    checkOutSuccess,
    quickCheckOut,
    bills,
    getAddionalServices,
    getCardDetails,
    goBackToHome,
} from '../../actions/action.account';
import { getHotelDetail } from '../../actions/action.hotel';
import { getwakeupCall } from '../../actions/action.conciergeService';
import { getTransactionHistory } from '../../actions/action.account';
import { createSelector } from 'reselect';

const selectColorBasedMenu = createSelector(
    (state: IState) => state.hotel.icon,
    (state: IState) => state.hotel.theme.primary_color,
    (state: IState, props: IMainMenuProps) => props.from,
    (icon, color, from) => {
        if (from === 'restaurant') {
            return icon.restaurant_color;
        }

        if (from === 'concierge_service') {
            return icon.concierge_color;
        }

        return color;
    },
);

const mapStateToProps = (state: IState, props: IMainMenuProps) => ({
    hotel: state.hotel,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    feature: state.hotel.feature,
    icon: state.account.hotel_details.data.layout.icons,
    color: selectColorBasedMenu(state, props),
    title: state.hotel.name,
    countUnreadMessage: state.chat.unreadMessage,
    mobile_hotel_layout_id: state.hotel.mobile_hotel_layout_id,
    mobile_hotel_layouts: state.hotel.mobile_hotel_layouts,
    hotel_logo: state.hotel.logo.hotel_logo_md,
    selectedLanguage: state.language,
    code: state.hotel.code,
    dynamic_buttons: state.hotel.dynamic_buttons,
    color2: state.account.hotel_details.data.layout.icons.cleaning_color,
    profile: state.account.profile,
    type: state.hotel.type,
    token: state.account.access_token,
    account: state.account,
    hotel_details: state.account.hotel_details,
    promotionalImages: state.account?.hotel_details?.promotion,
    parkingDetails: state.account.hotel_details?.parking_detail,
    departureDate: state.account.profile.departure_date,
    wakeUpCall: state.conciergeService.wakeUpCall,
    chainData: state.chainData,
    Primary_Color: state.account.hotel_details.data.layout.theme.primary_color,
    idHotel: state.hotel.id,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            connectSendBird,
            requestNotifPermission,
            onTokenNotifRefresh,
            removeOnTokenNotifRefresh,
            onMessageReceived,
            removeOnMessageReceived,
            getTotalUnreadMessage,
            handleAppStateChange,
            removeAppStateChange,
            getProfile,
            disconnectSendBird,
            checkOutSuccess,
            quickCheckOut,
            bills,
            lateCheckOut,
            getAddionalServices,
            getwakeupCall,
            getCardDetails,
            updateTotalUnreadMessageSuccess,
            toggleIsInChatScreen,
            goBackToHome,
            getTransactionHistory,
        },
        dispatch,
    );
};

export interface IMainMenuReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
