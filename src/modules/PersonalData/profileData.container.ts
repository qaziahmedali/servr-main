import { connect } from 'react-redux';
import ProfileData from './profileData';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { updateProfile } from '../../actions/action.account';

const mapStateToProps = (state: IState) => ({
    selectedLanguage: state.language,
    type: state.hotel.type,
    resto: state.restaurant.restaurants[0],
    color: state.hotel.theme.primary_color,
    restoGuest: state.restaurant.restoGuest,
    profileData: state.account.userData,
    token: state.account.access_token,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            updateProfile,
        },
        dispatch,
    );
};

export interface IProfileDataReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileData);
