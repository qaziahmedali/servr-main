import { connect } from 'react-redux';
import SplashScreen from './SplashScreen';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { getHotelDetail, getHotelList } from '../../actions/action.hotel';
import { getChainData } from '../../actions/action.chainData';
import { getProfile, userLogin } from '../../actions/action.account';
import { appUpdate } from '../../actions/action.app';
import { getwakeupCall } from '../../actions/action.conciergeService';
import { selectLanguage } from '../../actions/action.language';

const mapStateToProps = (state: IState) => ({
    isHotelPicked: state.hotel.isHotelPicked,
    codeHotel: state.hotel.code,
    primaryColor: state.hotel.theme.primary_color,
    isCheckedIn: state.account.isCheckedIn,
    hotelName: state.hotel.name,
    category: state.hotel.category,
    logo: state.hotel.logo,
    selectedLanguage: state.language,
    type: state.hotel.type,
    resto: state.restaurant.restaurants[0],
    color: state.hotel.icon.restaurant_color,
    restoGuest: state.restaurant.restoGuest,
    profile: state.account.profile,
    token: state.account.access_token,
    app_update: state.app.app_update,
    chainData: state.chainData,
    idHotel: state.hotel.id,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getChainData,
            getHotelDetail,
            getProfile,
            selectLanguage,
            userLogin,
            getHotelList,
            getwakeupCall,
            appUpdate,
        },
        dispatch,
    );
};
export interface ISplashScreenReduxProps
    extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> { }

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
