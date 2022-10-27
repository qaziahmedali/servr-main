import { connect } from 'react-redux';
import WakeupCall from './WakeupCall';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { wakeupCall } from '../../actions/action.conciergeService';
import { createSelector } from 'reselect';

const mapStateToProps = (state: IState) => ({
    color: state.hotel.icon.restaurant_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    icon: state.hotel.icon,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            wakeupCall,
        },
        dispatch,
    );
};

export interface IWakeupCallReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(WakeupCall);
