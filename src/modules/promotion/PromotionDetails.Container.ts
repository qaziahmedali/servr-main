import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import PromotionDetails from './PromotionDetails';
import { getPromotionDetails, emptyPromotionDetails } from '../../actions/action.promotion';

const mapStateToProps = (state: IState) => ({
    promotionDetails: state.promotion.promotionDetails,
    color: state.hotel.icon.cleaning_color,
    idHotel: state.hotel.id,
    selectedLanguage: state.language,
    icon:state.hotel.icon,
    isCheckedIn : state.account.isCheckedIn,
    chainData: state.chainData,

});
// URL=http://192.168.100.72:82
const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getPromotionDetails,
            emptyPromotionDetails,
        },
        dispatch,
    );
};

export interface IPromotionDetailsReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetails);
