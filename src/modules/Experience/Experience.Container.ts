import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import Experience from './Experience';
import { getExperience } from '../../actions/action.experience';
import { getPromotionDetails, emptyPromotionDetails } from '../../actions/action.promotion';

const mapStateToProps = (state: IState) => ({
    experience: state.experience.experience,
    color: state.hotel.icon.cleaning_color,
    idHotel: state.hotel.id,
    selectedLanguage: state.language,
    icon:state.hotel.icon,
    chainData:state.chainData,
});
// URL=http://192.168.100.72:82
const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getExperience,
            emptyPromotionDetails,

        },
        dispatch,
    );
};

export interface IExperienceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(Experience);
