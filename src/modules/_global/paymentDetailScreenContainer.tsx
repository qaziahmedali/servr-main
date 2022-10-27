import { connect } from 'react-redux';
import PaymentDetailScreen from './paymentDetailsScreen';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import {
    getChainDataSuccess
} from '../../actions/action.chainData';



const mapStateToProps = (state: IState) => ({
  
    chainData:state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getChainDataSuccess,
          
        },
        dispatch,
    );
};

export interface IPaymentDetailReduxProps
    extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> { }

export default connect(mapStateToProps, mapDispatchToProps)(PaymentDetailScreen);

