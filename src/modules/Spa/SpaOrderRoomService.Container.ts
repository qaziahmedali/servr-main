import { connect } from 'react-redux';
import SpaOrderRoomService from './SpaOrderRoomService';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { getSpaTreatment, orderRoomSpa } from '../../actions/action.spa';
import { createSelector } from 'reselect';
import { startCase, upperFirst } from 'lodash';

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
    treatments: state.spa.treatments,
    vat: state.account.hotel_details.data.vat,
    icon: state.hotel.icon,
    selectLanguage: state.language,
    card: state.account.profile,
    chainData: state.chainData,
    hotelTaxes: state.hotelTaxes,
    account: state.account,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getSpaTreatment,
            orderRoomSpa,
        },
        dispatch,
    );
};

export interface ISpaOrderRoomServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(SpaOrderRoomService);
