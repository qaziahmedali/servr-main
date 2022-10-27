import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import PromotionOrder from './PromotionOrder';
import { getPromotionDetails, emptyPromotionDetails, orderPromotion } from '../../actions/action.promotion';

const mapStateToProps = (state: IState) => ({
    promotionDetails: state.promotion.promotionDetails,
    color: state.hotel.icon.cleaning_color,
    idHotel: state.hotel.id,
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    status: state.account?.profile?.status,
    primary_color: state.hotel?.theme?.primary_color,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getPromotionDetails,
            emptyPromotionDetails,
            orderPromotion,
        },
        dispatch,
    );
};

export interface IPromotionOrderReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionOrder);
