import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import SpaService from './SpaService';
import { getSpa } from '../../actions/action.spa';

const mapStateToProps = (state: IState) => ({
    spa: state.spa.spa,
    color: state.hotel.icon.spa_color,
    selectedLanguage: state.language,
    code: state.hotel.code,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    dynamic_buttons: state.hotel.dynamic_buttons,
    icon: state.hotel.icon,
    chainData: state.chainData,
    hotelTaxes: state.hotelTaxes,
    account: state.account,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getSpa,
        },
        dispatch,
    );
};

export interface ISpaServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(SpaService);
