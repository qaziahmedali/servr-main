import { connect } from 'react-redux';
import RoomCleaningService from './RoomCleaningService';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { roomCleaningService } from '../../actions/action.conciergeService';
import { roomCleaningItems } from '../../actions/action.cleaningService';

const mapStateToProps = (state: IState) => ({
    serviceItems: state.conciergeService.serviceItems,
    color: state.hotel.icon.concierge_color,
    selectedLanguage: state.language,
    currency: state.hotel.currency,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    code: state.hotel.code,
    primaryColor: state.hotel.theme.primary_color,
    icon:state.hotel.icon,
    chainData : state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            // getConciergeServiceItems,
            // createRequest,
            roomCleaningService,
            roomCleaningItems,
        },
        dispatch,
    );
};

export interface IRoomCleaningServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(RoomCleaningService);
