import { connect } from 'react-redux';
import Chat from './Chat';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../types/state';
import {
    connectSendBird,
    sendMessage,
    joinChannel,
    toggleIsInChatScreen,
    updateTotalUnreadMessageSuccess,
} from '../../actions/action.chat';
import { goBackToHome } from '../../actions/action.account'
import { createSelector } from 'reselect';


const mapStateToProps = (state: IState) => ({
    isConnected: state.chat.isConnected,
    profile: state.chat.profile,
    messages: state.chat.messages,
    color: state.hotel.theme.primary_color,
    selectedLanguage: state.language,
    access_token: state.account.access_token,
    chat: state.chat,
    title: state.hotel.name,
    hotel_logo: state.hotel.logo.hotel_logo_md,
    isCheckedIn: state.account.isCheckedIn,
    countUnreadMessage: state.chat.unreadMessage,
    account_profile: state.account.profile,
    chainData:state.chainData,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            connectSendBird,
            joinChannel,
            sendMessage,
            toggleIsInChatScreen,
            updateTotalUnreadMessageSuccess,
            goBackToHome
        },
        dispatch,
    );
};

export interface IChatReduxProps
    extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> { }

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

