import { connect } from 'react-redux';
import TrackingProgress from './ConciergeTrackingProgress';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import {
    conciergeTrackingProgressOrderRoomService,
    deleteConciergeOrder,
} from '../../actions/action.conciergeService';
import {
    deleteOrder,
    deleteReservationOrder,
    deleteSpa
} from '../../actions/action.restaurant'
import { createSelector } from 'reselect';

const selectCurrentOrderSelector = createSelector(
    (state: IState) => state.conciergeService.conciergeTrakingProgress,
    (orders) =>
        orders.filter(
            ({ status }) =>
                !(['cancelled', 'done', 'rejected', 'completed'] as typeof status[]).includes(status),
        ),
);

const selectPreviousOrderSelector = createSelector(
    (state: IState) => state.conciergeService.conciergeTrakingProgress,
    (orders) =>
        orders.filter(({ status }) =>
            (['cancelled', 'done', 'rejected', 'completed'] as typeof status[]).includes(status),
        ),
);

const mapStateToProps = (state: IState) => ({
    currentOrder: selectCurrentOrderSelector(state),
    previousOrder: selectPreviousOrderSelector(state),
    orders: state.conciergeService.conciergeTrakingProgress,
    color: state.hotel.theme.primary_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    Primary_Color: state.hotel.theme.primary_color,
    chainData:state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            conciergeTrackingProgressOrderRoomService,
            deleteConciergeOrder,
            deleteOrder,
            deleteReservationOrder,
            deleteSpa
        },
        dispatch,
    );
};

export interface IConciergeTrackingProgressReduxProps
    extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> { }

export default connect(mapStateToProps, mapDispatchToProps)(TrackingProgress);
