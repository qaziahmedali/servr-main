import { connect } from 'react-redux';
import WakeupCallComplete from './WakeupCallComplete';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { wakeupCall } from '../../actions/action.conciergeService';
import { createSelector } from 'reselect';

const mapStateToProps = (state: IState) => ({
    color: state.hotel.icon.restaurant_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            wakeupCall,
        },
        dispatch,
    );
};

export interface IWakeupCallCompleteReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(WakeupCallComplete);
