import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import SpaBookingTime from './SpaBookingTime';
import { reserveSpa, orderRoomSpa } from '../../actions/action.spa';

const mapStateToProps = (state: IState) => ({
    numberPeople: 1,
    color: state.hotel.icon.spa_color,
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    code: state.hotel.code,
    currency: state.hotel.currency,
    icon: state.hotel.icon,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            reserveSpa,
            orderRoomSpa,
        },
        dispatch,
    );
};

export interface ISpaBookingTimeReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(SpaBookingTime);
