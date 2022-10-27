import { connect } from 'react-redux';
import PickHotel from './PickHotel';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { getHotelDetail, getHotelList, alreadyCheckedIn, getHotelDetailSuccess } from '../../actions/action.hotel';
import { signup, login, sendVerificationLink, userLogin, userGoogleLogin, forgotPasswordRequest, forgotPasswordSuccess, updatePasswordRequest, updatePasswordSuccess } from '../../actions/action.account';
import { selectLanguage } from '../../actions/action.language';
import colors from '../../constants/colors';

const mapStateToProps = (state: IState) => ({
    selectedLanguage: state.language,
    resto: state.restaurant.restaurants[0],
    color: state.hotel.icon.restaurant_color !== '' ? state.hotel.icon.restaurant_color : colors.BLUE,
    restoGuest: state.restaurant.restoGuest,
    verificationCode: state.account.verificationCode,
    hotel_Code: state.account.userData?.hotel_detail?.code,
    type: state.hotel.type,
    token: state.account.access_token,
    account: state.account,
    hotels: state.hotel?.hotel_list,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getHotelDetail,
            selectLanguage,
            alreadyCheckedIn,
            signup,
            login,
            userLogin,
            userGoogleLogin,
            getHotelList,
            forgotPasswordRequest,
            forgotPasswordSuccess,
            updatePasswordRequest,
            updatePasswordSuccess,
            getHotelDetailSuccess,
            sendVerificationLink
        },
        dispatch,
    );
};

export interface IPickHotelReduxProps
    extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> { }

export default connect(mapStateToProps, mapDispatchToProps)(PickHotel);