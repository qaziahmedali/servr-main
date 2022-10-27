import { connect } from 'react-redux';
import TrackingProgress from './SpaTrackingProgress';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { spaTrackingProgressOrderRoomService, deleteSpaOrder } from '../../actions/action.spa';
import { createSelector } from 'reselect';

const selectCurrentOrderSelector = createSelector(
    (state: IState) => state.spa.spaTrakingProgress,
    (orders) =>
        orders.filter(
            ({ status }) => !(['cancelled', 'done', 'rejected'] as typeof status[]).includes(status),
        ),
);

const selectPreviousOrderSelector = createSelector(
    (state: IState) => state.spa.spaTrakingProgress,
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
    primaryColor: state.hotel.theme.primary_color,
    chainData:state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            spaTrackingProgressOrderRoomService,
            deleteSpaOrder,
        },
        dispatch,
    );
};

export interface ISpaTrackingProgressReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(TrackingProgress);
