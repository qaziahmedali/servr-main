import { connect } from 'react-redux';
import ParkingValetComplete from './ParkingValetComplete';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { getProfile } from '../../actions/action.account';
import {
    getParkingDetails,
    requestParkingValet,
    addValetParking,
    updateValetParking,
} from '../../actions/action.parkingValet';
import { selectLanguage } from '../../actions/action.language';

const mapStateToProps = (state: IState) => ({
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    code: state.hotel.code,
    color: state.hotel.icon.concierge_color,
    currency: state.hotel.currency,
    parkingValetData: state.parkingValet.parkingValetData,
    primaryColor: state.hotel.theme.primary_color,
    bookingReference: state.account.profile.reference,
    token: state.account.access_token,
    parkingDetails: state.account.hotel_details.parking_detail,
    Primary_Color: state.hotel.theme.primary_color,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getParkingDetails,
            requestParkingValet,
            selectLanguage,
            addValetParking,
            getProfile,
            updateValetParking,
        },
        dispatch,
    );
};

export interface IParkingValetCompleteReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(ParkingValetComplete);
