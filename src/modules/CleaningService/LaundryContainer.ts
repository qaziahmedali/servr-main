import { connect } from 'react-redux';
import LaundryService from './LaundryService';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import {
    laundryOrder,
    getLaundryServicesMenu,
    getLaundryServices,
} from '../../actions/action.cleaningService';

export interface IDataLaundry {
    id: string;
    name: string;
    type: any;
    price: number;
    description: string;
}

// const data: IDataLaundry[] = [
//     {
//         id: '1',
//         name: 'Service Wash (Light/dark colours)',
//         type: 'light_dark',
//     },
//     {
//         id: '2',
//         name: 'Service Wash (Mixed colours)',
//         type: 'mixed_color',
//     },
//     {
//         id: '3',
//         name: 'Ironing Service',
//         type: 'ironing_service',
//     },
// ];

const mapStateToProps = (state: IState) => ({
    data: state.laundry.laundry.laundries,
    color: state.hotel.icon.cleaning_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    code: state.hotel.code,
    primaryColor: state.hotel.theme.primary_color,
    icon: state.hotel.icon,
    chainData: state.chainData,
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
