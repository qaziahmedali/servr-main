import { connect } from 'react-redux';
import BookATable from './BookATable';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { bookATable } from '../../actions/action.restaurant';

const mapStateToProps = (state: IState) => ({
    numberPeople: state.account.profile.passport_photos ? state.account.profile.passport_photos.length : 1,
    color: state.hotel.icon.restaurant_color,
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account.profile.status ? state.account.profile.status : 'pending',
    code: state.hotel.code,
    icon: state.hotel.icon,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            bookATable,
        },
        dispatch,
    );
};

export interface IBookATableReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(BookATable);
