import { connect } from 'react-redux';
import ConciergeService from './ConciergeService';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { createSelector } from 'reselect';
import { roomCleaningService } from '../../actions/action.cleaningService';
import { getLaundryServicesMenu } from '../../actions/action.cleaningService';
import { wakeupCall, getwakeupCall } from '../../actions/action.conciergeService';
import { getConciergeServiceItems, createRequest } from '../../actions/action.conciergeService';

const selectProfileSelector = createSelector(
    (state: IState) => state.account.profile,
    (state: IState) => state.account.isCheckedIn,
    (profile, isCheckedIn) => {
        return {
            additional_services: profile.additional_services ? profile.additional_services : [],
        };
    },
);

const mapStateToProps = (state: IState) => {
    console.log('concergeee stateee', state);
    return {
        countUnreadMessage: state.chat.unreadMessage,
        color: state.hotel.icon.concierge_color,
        selectedLanguage: state.language,
        code: state.hotel.code,
        isCheckedIn: state.account.isCheckedIn,
        title: state.hotel.name,
        status: state.account.profile.status ? state.account.profile.status : 'pending',
        hotel_logo: state.hotel.logo.hotel_logo_md,
        feature: state.hotel.feature,
        wakeUpCall: state.conciergeService.wakeUpCall,
        icon: state.hotel.icon,
        departureDate: state.account.profile.departure_date,
        profile: selectProfileSelector(state),
        account: state.account,
        chainData: state.chainData,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getConciergeServiceItems,
            getLaundryServicesMenu,
            roomCleaningService,
            wakeupCall,
            getwakeupCall,
        },
        dispatch,
    );
};

export interface IConciergeServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(ConciergeService);
