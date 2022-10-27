import { connect } from 'react-redux';
import LaundryService from './LaundryService';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import {
    laundryOrder,
    getLaundryServicesMenu,
    getLaundryServices,
} from '../../actions/action.cleaningService';
import { getConciergeServiceItems, createRequest } from '../../actions/action.conciergeService';
// import { bookAdditionalService } from '../../actions/action.additionalservices';

export interface IDataLaundry {
    id: string;
    name: string;
    type: any;
    price: number;
    description: string;
}

const mapStateToProps = (state: IState) => ({
    laundryServies: state.laundry.laundry,
    LaundaryServices: state.laundry.laundry,
    color: state.hotel.icon.cleaning_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    vat: state.account.hotel_details.data.vat,
    code: state.hotel.code,
    primaryColor: state.hotel.theme.primary_color,
    icon: state.hotel.icon,
    chainData: state.chainData,
    card: state.account.profile,
    hotelTaxes: state.hotelTaxes,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getLaundryServicesMenu,
            laundryOrder,
            getLaundryServices,
        },
        dispatch,
    );
};

export interface ILaundryServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(LaundryService);
