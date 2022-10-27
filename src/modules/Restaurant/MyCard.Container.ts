import { connect } from 'react-redux';
import MyCard from './MyCard';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { orderRoomService } from '../../actions/action.restaurant';

const mapStateToProps = (state: IState) => ({
    color: state.hotel.icon.restaurant_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    code: state.hotel.code,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            orderRoomService,
        },
        dispatch,
    );
};

export interface IOrderRoomServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(MyCard);
