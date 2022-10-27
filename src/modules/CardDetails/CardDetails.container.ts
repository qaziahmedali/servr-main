import { connect } from 'react-redux';
import CardDetails from './CardDetails';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { getCardDetails, updateCardDetails } from '../../actions/action.account';

const mapStateToProps = (state: IState) => ({
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    type: state.hotel.type,
    resto: state.restaurant.restaurants[0],
    color: state.hotel.theme.primary_color,
    restoGuest: state.restaurant.restoGuest,
    chainData: state.chainData,
    cardDetails: state.account.cardDetails,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getCardDetails,
            updateCardDetails,
        },
        dispatch,
    );
};

export interface ICardDetailsReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(CardDetails);
