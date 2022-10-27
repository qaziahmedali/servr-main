import { connect } from 'react-redux';
import VerifyPin from './VerifyPin';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../../types/state';
import {
    verifyPin,
    onAuthStateChanged,
    verifyPhoneNumber,
    removeOnAuthStateChanged,
    login,
} from '../../../actions/action.account';

const mapStateToProps = (state: IState) => ({
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            verifyPhoneNumber,
            verifyPin,
            onAuthStateChanged,
            removeOnAuthStateChanged,
            login,
        },
        dispatch,
    );
};

export interface IVerifyPinReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPin);
