import {
    CHAT_FAILED,
    TChatFailed,
    TConnectSendBird,
    CONNECT_SENDBIRD,
    TConnectSendBirdSuccess,
    CONNECT_SENDBIRD_SUCCESS,
    TRegisterPushNotifToken,
    REGISTER_PUSH_NOTIF_TOKEN,
    TRegisterPushNotifTokenSuccess,
    REGISTER_PUSH_NOTIF_TOKEN_SUCCESS,
    UPDATE_PROFILE_SENDBIRD,
    TUpdateProfileSendBirdSuccess,
    TUpdateProfileSendBird,
    UPDATE_PROFILE_SENDBIRD_SUCCESS,
    TJoinChannel,
    JOIN_CHANNEL,
    TJoinChannelSuccess,
    JOIN_CHANNEL_SUCCESS,
    TGetPreviousMessagesSuccess,
    GET_PREVIOUS_MESSAGES_SUCCESS,
    SEND_MESSAGE,
    TSendMessage,
    SEND_MESSAGE_SUCCESS,
    TSendMessageSuccess,
    TOnMessageReceived,
    ON_MESSAGE_RECEIVED,
    TOnMessageReceivedSuccess,
    ON_MESSAGE_RECEIVED_SUCCESS,
    TRemoveOnMessageReceived,
    REMOVE_ON_MESSAGE_RECEIVED,
    GET_TOTAL_UNREAD_MESSAGE,
    TGetTotalUnreadMessage,
    TUpdateTotalUnreadMessageSuccess,
    UPDATE_TOTAL_UNREAD_MESSAGE_SUCCESS,
    TToggleIsInChatScreen,
    TOGGLE_IS_IN_CHAT_SCREEN,
    THandleAppStateChange,
    HANDLE_APP_STATE_CHANGE,
    TRemoveAppStateChange,
    REMOVE_APP_STATE_CHANGE,
    TDisconnectSendBird,
    DISCONNECT_SENDBIRD,
    TDisconnectSendBirdSuccess,
    DISCONNECT_SENDBIRD_SUCCESS,
} from '../types/action.chat';

export const connectSendBird: TConnectSendBird = (onSuccess, onFailed) => ({
    type: CONNECT_SENDBIRD,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const connectSendBirdSuccess: TConnectSendBirdSuccess = (profile) => ({
    type: CONNECT_SENDBIRD_SUCCESS,
    payload: {
        profile,
    },
});

export const disconnectSendBird: TDisconnectSendBird = (onSuccess, onFailed) => ({
    type: DISCONNECT_SENDBIRD,
    payload: {
        onSuccess,
        onFailed,
    },
});

export const disconnectSendBirdSuccess: TDisconnectSendBirdSuccess = () => ({
    type: DISCONNECT_SENDBIRD_SUCCESS,
});

export const registerPushNotifToken: TRegisterPushNotifToken = () => ({
    type: REGISTER_PUSH_NOTIF_TOKEN,
});

export const registerPushNotifTokenSuccess: TRegisterPushNotifTokenSuccess = (token) => ({
    type: REGISTER_PUSH_NOTIF_TOKEN_SUCCESS,
    payload: {
        token,
    },
});

export const updateProfileSendBird: TUpdateProfileSendBird = () => ({
    type: UPDATE_PROFILE_SENDBIRD,
});

export const updateProfileSendBirdSuccess: TUpdateProfileSendBirdSuccess = (profile) => ({
    type: UPDATE_PROFILE_SENDBIRD_SUCCESS,
    payload: {
        profile,
    },
});

export const joinChannel: TJoinChannel = () => ({
    type: JOIN_CHANNEL,
});

export const joinChannelSuccess: TJoinChannelSuccess = (groupChannel) => ({
    type: JOIN_CHANNEL_SUCCESS,
    payload: {
        groupChannel,
    },
});

export const getPreviousMessagesSuccess: TGetPreviousMessagesSuccess = (messages) => ({
    type: GET_PREVIOUS_MESSAGES_SUCCESS,
    payload: {
        messages,
    },
});

export const sendMessage: TSendMessage = (type, text, onSuccess, onFailed) => ({
    type: SEND_MESSAGE,
    payload: {
        type,
        text,
        onSuccess,
        onFailed,
    },
});

export const sendMessageSuccess: TSendMessageSuccess = (message) => ({
    type: SEND_MESSAGE_SUCCESS,
    payload: {
        message,
    },
});

export const onMessageReceived: TOnMessageReceived = (onCallback) => ({
    type: ON_MESSAGE_RECEIVED,
    payload: {
        onCallback,
    },
});

export const onMessageReceivedSuccess: TOnMessageReceivedSuccess = (message) => ({
    type: ON_MESSAGE_RECEIVED_SUCCESS,
    payload: {
        message,
    },
});

export const removeOnMessageReceived: TRemoveOnMessageReceived = () => ({
    type: REMOVE_ON_MESSAGE_RECEIVED,
});

export const getTotalUnreadMessage: TGetTotalUnreadMessage = (onCallback) => ({
    type: GET_TOTAL_UNREAD_MESSAGE,
    payload: {
        onCallback,
    },
});

export const updateTotalUnreadMessageSuccess: TUpdateTotalUnreadMessageSuccess = (count) => ({
    type: UPDATE_TOTAL_UNREAD_MESSAGE_SUCCESS,
    payload: {
        count,
    },
});

export const toggleIsInChatScreen: TToggleIsInChatScreen = (isInChatScreen) => ({
    type: TOGGLE_IS_IN_CHAT_SCREEN,
    payload: {
        isInChatScreen,
    },
});

export const handleAppStateChange: THandleAppStateChange = () => ({
    type: HANDLE_APP_STATE_CHANGE,
});

export const removeAppStateChange: TRemoveAppStateChange = () => ({
    type: REMOVE_APP_STATE_CHANGE,
});

export const chatFailed: TChatFailed = (error, type) => ({
    type: CHAT_FAILED,
    payload: {
        error: {
            error,
            type,
        },
    },
});
