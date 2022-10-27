import { connect } from 'react-redux';
import LateCheckOut from './LateCheckOut';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../../types/state';
import { getHotelDetail, alreadyCheckedIn } from '../../../actions/action.hotel';
import { lateCheckOut } from '../../../actions/action.account';

import { selectLanguage } from '../../../actions/action.language';

const mapStateToProps = (state: IState) => ({
    selectedLanguage: state.language,
    type: state.hotel.type,
    resto: state.restaurant.restaurants[0],
    color: state.hotel.icon.restaurant_color,
    restoGuest: state.restaurant.restoGuest,
    account: state.account,
    Primary_Color: state.hotel.theme.primary_color,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getHotelDetail,
            selectLanguage,
            alreadyCheckedIn,
            lateCheckOut,
        },
        dispatch,
    );
};

export interface ILateCheckOutReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(LateCheckOut);
