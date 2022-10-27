import { connect } from 'react-redux';
import VerifyPhoneNumber from './VerifyPhoneNumber';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../../types/state';
import { verifyPhoneNumber } from '../../../actions/action.account';

const mapStateToProps = (state: IState) => ({
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            verifyPhoneNumber,
        },
        dispatch,
    );
};

export interface IVerifyPhoneNumberReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhoneNumber);
