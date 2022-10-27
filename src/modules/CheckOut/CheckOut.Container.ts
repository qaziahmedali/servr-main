import { connect } from 'react-redux';
import CheckOut from './CheckOut';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { lateCheckOut, getProfile, checkOut, quickCheckOut, bills } from '../../actions/action.account';
import { createSelector } from 'reselect';
import { format } from 'date-fns';

const selectCheckoutTime = createSelector(
    (state: IState) => state.account.profile.checkout_time,
    (checkoutTime) => {
        if (checkoutTime) {
            return format(`${new Date().toDateString()} ${checkoutTime}`, 'HH:mm');
        }

        return '-';
    },
);

const selectLateCheckoutTime = createSelector(
    (state: IState) => state.account.profile.late_checkout_time,
    (checkoutTime) => {
        if (checkoutTime) {
            return format(`${new Date().toDateString()} ${checkoutTime}`, 'HH:mm');
        }

        return '-';
    },
);

const mapStateToProps = (state: IState) => ({
    checkout_time: selectCheckoutTime(state),
    late_checkout_status: state.account.profile.late_checkout_status
        ? state.account.profile.late_checkout_status
        : null,
    late_checkout_time: selectLateCheckoutTime(state),
    color: state.hotel.icon.cleaning_color,
    selectedLanguage: state.language,
    primaryColor: state.hotel.theme.primary_color,
    profile: state.account.profile,
    type: state.hotel.type,
    hotelCode : state.hotel.code,
    token : state.account.access_token,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getProfile,
            lateCheckOut,
            checkOut,
            quickCheckOut,
            bills,
        },
        dispatch,
    );
};

export interface ICheckOutReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(CheckOut);
