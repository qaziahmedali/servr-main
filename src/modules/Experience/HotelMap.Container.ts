import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import HotelMap from './HotelMap';
import { getHotelMap } from '../../actions/action.experience';

const mapStateToProps = (state: IState) => ({
    hotelMap: state.experience.hotelMap,
    color: state.hotel.icon.cleaning_color,
    selectedLanguage: state.language,
});
// URL=http://192.168.100.72:82
const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getHotelMap,
        },
        dispatch,
    );
};

export interface IHotelMapReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(HotelMap);
