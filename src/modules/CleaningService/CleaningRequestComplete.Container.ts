import { connect } from 'react-redux';
import CleaningRequestComplete from './CleaningRequestComplete';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';

const mapStateToProps = (state: IState) => ({
    color: state.hotel.icon.cleaning_color,
    selectedLanguage: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({}, dispatch);
};

export interface ICleaningRequestCompleteReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(CleaningRequestComplete);
