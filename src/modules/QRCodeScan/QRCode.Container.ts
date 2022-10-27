import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import QRCodeScan from './QRcodeScan';

const mapStateToProps = (state: IState) => ({
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    type: state.hotel.type,
    resto: state.restaurant.restaurants[0],
    color: state.hotel.icon.restaurant_color,
    restoGuest: state.restaurant.restoGuest,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
        },
        dispatch,
    );
};

export interface IQRCodeScanReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeScan);
