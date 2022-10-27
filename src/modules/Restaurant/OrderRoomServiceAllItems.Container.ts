import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { getRestaurantCategoryDish, orderRoomService, orderRoomServiceAllItems } from '../../actions/action.restaurant';
import { createSelector } from 'reselect';
import { startCase, upperFirst } from 'lodash';
import OrderRoomServiceAllItems from './OrderRoomServiceAllItems';

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
    dishesCategories: dishCategoriesSelector(state),
    color: state.hotel.icon.restaurant_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    code: state.hotel.code,
    primaryColor: state.hotel.theme.primary_color,
    vat : state.account.hotel_details.data.vat,
    icon:state.hotel.icon,
    card : state.account.profile,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getRestaurantCategoryDish,
            orderRoomService,
            orderRoomServiceAllItems
        },
        dispatch,
    );
};

export interface IOrderRoomServicAllItemseReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(OrderRoomServiceAllItems);
