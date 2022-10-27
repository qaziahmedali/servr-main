import { connect } from 'react-redux';
import PromotionApplied from './PromotionApplied';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { getHotelDetail, alreadyCheckedIn } from '../../actions/action.hotel';
import { selectLanguage } from '../../actions/action.language';

const mapStateToProps = (state: IState) => ({
    selectedLanguage: state.language,
    type: state.hotel.type,
    resto: state.restaurant.restaurants[0],
    color: state.hotel.icon.restaurant_color,
    restoGuest: state.restaurant.restoGuest,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getHotelDetail,
            selectLanguage,
            alreadyCheckedIn,
        },
        dispatch,
    );
};

export interface IPromotionAppliedReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionApplied);
