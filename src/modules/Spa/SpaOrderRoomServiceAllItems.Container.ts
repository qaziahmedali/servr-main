import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { getSpaAllTreatments, orderRoomSpa } from '../../actions/action.spa';
import { createSelector } from 'reselect';
import { startCase, upperFirst } from 'lodash';
import SpaOrderRoomServiceAllItems from './SpaOrderRoomServiceAllItems';

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
    treatments: state.spa.treatments.treatments,
    categories: state.spa.treatments.categories,
    vat: state.account.hotel_details.data.vat,
    icon: state.hotel.icon,
    card: state.account.profile,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getSpaAllTreatments,
            orderRoomSpa,
        },
        dispatch,
    );
};

export interface IOrderRoomServicAllItemseReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(SpaOrderRoomServiceAllItems);
