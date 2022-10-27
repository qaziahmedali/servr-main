import { connect } from 'react-redux';
import CleaningService from './CleaningService';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import { roomCleaningService } from '../../actions/action.cleaningService';

const mapStateToProps = (state: IState) => ({
    color: state.hotel.icon.cleaning_color,
    selectedLanguage: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            roomCleaningService,
        },
        dispatch,
    );
};

export interface ICleaningServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(CleaningService);
