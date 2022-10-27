import { IChatState, IMessageChat, IProfileChat } from '../types/chat';
import {
    ActionChatType,
    CHAT_FAILED,
    CONNECT_SENDBIRD_SUCCESS,
    UPDATE_PROFILE_SENDBIRD_SUCCESS,
    JOIN_CHANNEL_SUCCESS,
    SEND_MESSAGE_SUCCESS,
    GET_PREVIOUS_MESSAGES_SUCCESS,
    ON_MESSAGE_RECEIVED_SUCCESS,
    UPDATE_TOTAL_UNREAD_MESSAGE_SUCCESS,
    TOGGLE_IS_IN_CHAT_SCREEN,
    DISCONNECT_SENDBIRD_SUCCESS,
} from '../types/action.chat';
import { GiftedChat } from 'react-native-gifted-chat';
import { uniqBy } from 'lodash';
import { ActionAccountType, CHECK_OUT_SUCCESS } from '../types/action.account';

const initialState: IChatState = {
    isConnected: false,
    groupChannel: null,
    profile: null,
    messages: [],
    unreadMessage: 0,
    isInChatScreen: false,
    error: {},
    bills : {},
    isCheckedOut : false
};

export default (state = initialState, action: ActionChatType | ActionAccountType): IChatState => {
    switch (action.type) {
        case CONNECT_SENDBIRD_SUCCESS:
            return {
                ...state,
                isConnected: true,
                profile: action.payload.profile,
            };

        case DISCONNECT_SENDBIRD_SUCCESS:
            return {
                ...state,
                isConnected: false,
            };

        case UPDATE_PROFILE_SENDBIRD_SUCCESS:
            return {
                ...state,
                profile: {
                    ...(state.profile as IProfileChat),
                    ...action.payload.profile,
                },
            };

        case JOIN_CHANNEL_SUCCESS:
            return {
                ...state,
                groupChannel: action.payload.groupChannel,
            };

        case GET_PREVIOUS_MESSAGES_SUCCESS:
            return {
                ...state,
                messages: action.payload.messages,
            };

        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                messages: GiftedChat.append(state.messages, [action.payload.message]),
            };

        case ON_MESSAGE_RECEIVED_SUCCESS:
            return {
                ...state,
                messages: uniqBy(
                    GiftedChat.append(state.messages, [action.payload.message]),
                    '_id' as keyof IMessageChat,
                ),
            };

        case UPDATE_TOTAL_UNREAD_MESSAGE_SUCCESS:
            return {
                ...state,
                unreadMessage: action.payload.count,
            };

        case CHECK_OUT_SUCCESS:
            return {
                ...state,
                isCheckedIn: false,
                confirmationResult: null,
                error: {},
                transaction_data: [],
                bills: {},
                isCheckedOut : true
            };

        case TOGGLE_IS_IN_CHAT_SCREEN:
            return {
                ...state,
                isInChatScreen: action.payload.isInChatScreen,
            };

        case CHAT_FAILED:
            return {
                ...state,
                error: action.payload.error,
            };

        default:
            return state;
    }
};
