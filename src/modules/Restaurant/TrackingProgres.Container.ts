import { connect } from 'react-redux';
import TrackingProgress from './TrackingProgress';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import {
    trackingProgressOrderRoomService,
    deleteOrder,
    trackingProgressOrderRoomServiceSuccess,
} from '../../actions/action.restaurant';
import { createSelector } from 'reselect';

const selectCurrentOrderSelector = createSelector(
    (state: IState) => state.restaurant.trackingProgressOrderRoomService,
    (orders) =>
        orders.filter(
            ({ status }) => !(['cancelled', 'done', 'rejected'] as typeof status[]).includes(status),
        ),
);

const selectPreviousOrderSelector = createSelector(
    (state: IState) => state.restaurant.trackingProgressOrderRoomService,
    (orders) =>
        orders.filter(({ status }) =>
            (['cancelled', 'done', 'rejected'] as typeof status[]).includes(status),
        ),
);

const mapStateToProps = (state: IState) => ({
    currentOrder: selectCurrentOrderSelector(state),
    previousOrder: selectPreviousOrderSelector(state),
    color: state.hotel.icon.restaurant_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    code: state.hotel.code,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    primaryColor: state.hotel.theme.primary_color,
    chainData: state.chainData 
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            trackingProgressOrderRoomService,
            deleteOrder,
            trackingProgressOrderRoomServiceSuccess,
        },
        dispatch,
    );
};

export interface ITrackingProgressReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(TrackingProgress);
