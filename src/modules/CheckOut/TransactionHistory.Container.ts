import { connect } from 'react-redux';
import TransactionHistory from './TransactionHistory';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import {
    getTransactionHistory,
    transactionHistoryPaymentt,
    quickCheckOut,
} from '../../actions/action.account';
import { createSelector } from 'reselect';

const mapStateToProps = (state: IState) => ({
    color: state.hotel.icon.restaurant_color,
    currency: state.hotel.currency,
    selectedLanguage: state.language,
    transaction_data: state.account.transaction_data,
    primaryColor: state.hotel.theme.primary_color,
    profile: state.account.profile,
    type: state.hotel.type,
    color2: state.hotel.icon.cleaning_color,
    account: state.account,
    PrimaryColor: state.hotel.theme.primary_color,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getTransactionHistory,
            transactionHistoryPaymentt,
            quickCheckOut,
        },
        dispatch,
    );
};

export interface ITransactionReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
