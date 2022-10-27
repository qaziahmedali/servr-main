import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import PromotionService from './PromotionService';
import { getPromotion } from '../../actions/action.promotion';
import { getPromotionDetails, emptyPromotionDetails } from '../../actions/action.promotion';

const mapStateToProps = (state: IState) => ({
    promotion: state.promotion.promotion,
    color: state.hotel.icon.cleaning_color,
    idHotel: state.hotel.id,
    selectedLanguage: state.language,
});
// URL=http://192.168.100.72:82
const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getPromotion,
            emptyPromotionDetails,
        },
        dispatch,
    );
};

export interface IPromotionServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionService);
