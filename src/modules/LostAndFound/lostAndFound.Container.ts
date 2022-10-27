import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import LostAndFound, { ILostBaseProps } from './lostAndFound';
import { postLostAndFoundRequest } from '../../actions/action.lostAndFound';
import { toggleIsInChatScreen, updateTotalUnreadMessageSuccess } from '../../actions/action.chat';
import { goBackToHome } from '../../actions/action.account';
import { createSelector } from 'reselect';

const selectColorBasedMenu = createSelector(
    (state: IState) => state.hotel.icon,
    (state: IState) => state.hotel.theme.primary_color,
    (state: IState, props: ILostBaseProps) => props.from,
    (icon, color, from) => {
        if (from === 'restaurant') {
            return icon.restaurant_color;
        }

        if (from === 'concierge_service') {
            return icon.concierge_color;
        }

        return color;
    },
);

const mapStateToProps = (state: IState, props: ILostBaseProps) => ({
    lostAndFound: state,
    color: selectColorBasedMenu(state, props),
    selectedLanguage: state.language,
    isCheckedIn: state.account.isCheckedIn,
    countUnreadMessage: state.chat.unreadMessage,
    status: state.account.profile.status,
    chainData: state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            postLostAndFoundRequest,
            toggleIsInChatScreen,
            updateTotalUnreadMessageSuccess,
            goBackToHome,
        },
        dispatch,
    );
};

export interface ILostAndFoundServiceReduxProps
    extends ReturnType<typeof mapStateToProps>,
        ReturnType<typeof mapDispatchToProps> {}

export default connect(mapStateToProps, mapDispatchToProps)(LostAndFound);
