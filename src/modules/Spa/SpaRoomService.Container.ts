import { connect } from 'react-redux';
import SpaRoomService from './SpaRoomService';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';

const mapStateToProps = (state: IState) => ({
    color: state.hotel.icon.restaurant_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    code: state.hotel.code,
    primaryColor: state.hotel.theme.primary_color,
    chainData: state.chainData,
    account: state.account
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            // getRestaurantCategoryDish,
            // orderRoomService,
        },
        dispatch,
    );
};

export interface ISpaRoomServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> { }

export default connect(mapStateToProps, mapDispatchToProps)(SpaRoomService);
