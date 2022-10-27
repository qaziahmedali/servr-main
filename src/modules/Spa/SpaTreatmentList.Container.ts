import { connect } from 'react-redux';
import SpaTreatmentList from './SpaTreatmentList';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { getSpaTreatment } from '../../actions/action.spa';

const mapStateToProps = (state: IState) => ({
    treatments: state.spa.treatments,
    color: state.hotel.icon.spa_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    code: state.hotel.code,
    primaryColor: state.hotel.theme.primary_color,
    icon:state.hotel.icon,
    chainData:state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getSpaTreatment,
        },
        dispatch,
    );
};

export interface ISpaTreatmentListReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(SpaTreatmentList);
