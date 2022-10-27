import { connect } from 'react-redux';
import RestaurantList from './RestaurantList';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { getRestaurantList } from '../../actions/action.restaurant';

const mapStateToProps = (state: IState) => ({
    restaurants: state.restaurant.restaurants,
    color: state.hotel.icon.restaurant_color,
    selectedLanguage: state.language,
    code: state.hotel.code,
    isCheckedIn: state.account.isCheckedIn,
    account: state.account,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    dynamic_buttons: state.hotel.dynamic_buttons,
    primaryColor: state.hotel.theme.primary_color,
    icon: state.hotel.icon,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getRestaurantList,
        },
        dispatch,
    );
};

export interface IRestaurantListReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantList);
