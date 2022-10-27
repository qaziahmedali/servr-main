import { connect } from 'react-redux';
import OrderRoomService from './OrderRoomService';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import {
    getRestaurantCategoryDish,
    orderRoomService,
    getRandomDishes,
} from '../../actions/action.restaurant';
import { createSelector } from 'reselect';
import { startCase, upperFirst } from 'lodash';
import { getCardDetails } from '../../actions/action.account';

const dishCategoriesSelector = createSelector(
    (state: IState) => state.restaurant.dishCategories,
    (dishes) => {
        return dishes.map(({ name, dishes }) => ({
            title: upperFirst(startCase(name)),
            data: Object.values(dishes),
        }));
    },
);

const mapStateToProps = (state: IState) => ({
    dishesCategories: state.restaurant.random_dishes,
    color: state.hotel.icon.restaurant_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    code: state.hotel.code,
    primaryColor: state.hotel.theme.primary_color,
    hotel_id: state.hotel.id,
    vat: state.account.hotel_details.data.vat,
    icon: state.hotel.icon,
    card: state.account.profile,
    account: state.account,
    chainData: state.chainData,
    hotelTaxes: state.hotelTaxes,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getRestaurantCategoryDish,
            orderRoomService,
            getRandomDishes,
            getCardDetails,
        },
        dispatch,
    );
};

export interface IOrderRoomServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(OrderRoomService);
