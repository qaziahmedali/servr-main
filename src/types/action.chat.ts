import SendBird from 'sendbird';
import { IError } from './responseApi';
import { IProfileChat, IMessageChat } from './chat';
import { types } from '@babel/core';

export const CONNECT_SENDBIRD = 'CONNECT_SENDBIRD';
export const CONNECT_SENDBIRD_SUCCESS = 'CONNECT_SENDBIRD_SUCCESS';

export const DISCONNECT_SENDBIRD = 'DISCONNECT_SENDBIRD';
export const DISCONNECT_SENDBIRD_SUCCESS = 'DISCONNECT_SENDBIRD_SUCCESS';

export const REGISTER_PUSH_NOTIF_TOKEN = 'REGISTER_PUSH_NOTIF_TOKEN';
export const REGISTER_PUSH_NOTIF_TOKEN_SUCCESS = 'REGISTER_PUSH_NOTIF_TOKEN_SUCCESS';

export const UPDATE_PROFILE_SENDBIRD = 'UPDATE_PROFILE_SENDBIRD';
export const UPDATE_PROFILE_SENDBIRD_SUCCESS = 'UPDATE_PROFILE_SENDBIRD_SUCCESS';

export const JOIN_CHANNEL = 'JOIN_CHANNEL';
export const JOIN_CHANNEL_SUCCESS = 'JOIN_CHANNEL_SUCCESS';
export const GET_PREVIOUS_MESSAGES_SUCCESS = 'GET_PREVIOUS_MESSAGES_SUCCESS';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';

export const ON_MESSAGE_RECEIVED = 'ON_MESSAGE_RECEIVED';
export const ON_MESSAGE_RECEIVED_SUCCESS = 'ON_MESSAGE_RECEIVED_SUCCESS';
export const REMOVE_ON_MESSAGE_RECEIVED = 'REMOVE_ON_MESSAGE_RECEIVED';

export const GET_TOTAL_UNREAD_MESSAGE = 'GET_TOTAL_UNREAD_MESSAGE';
export const UPDATE_TOTAL_UNREAD_MESSAGE_SUCCESS = 'UPDATE_TOTAL_UNREAD_MESSAGE_SUCCESS';

export const TOGGLE_IS_IN_CHAT_SCREEN = 'TOGGLE_IS_IN_CHAT_SCREEN';

export const HANDLE_APP_STATE_CHANGE = 'HANDLE_APP_STATE_CHANGE';
export const REMOVE_APP_STATE_CHANGE = 'REMOVE_APP_STATE_CHANGE';

export const CHAT_FAILED = 'CHAT_FAILED';

export type TConnectSendBird<
    T = (user: SendBird.User) => void,
    K = (error: SendBird.SendBirdError) => void
> = (
    onSuccess?: T,
    onFailed?: K,
) => {
    type: typeof CONNECT_SENDBIRD;
    payload: {
        onSuccess?: T;
        onFailed?: K;
    };
};

export type TConnectSendBirdSuccess<T = IProfileChat> = (
    profile: T,
) => {
    type: typeof CONNECT_SENDBIRD_SUCCESS;
    payload: {
        profile: T;
    };
};

export type TDisconnectSendBird = (
    onSuccess?: () => void,
    onFailed?: () => void,
) => {
    type: typeof DISCONNECT_SENDBIRD;
    payload: {
        onSuccess: typeof onSuccess;
        onFailed: typeof onFailed;
    };
};

export type TDisconnectSendBirdSuccess = () => {
    type: typeof DISCONNECT_SENDBIRD_SUCCESS;
};

export type TRegisterPushNotifToken = () => {
    type: typeof REGISTER_PUSH_NOTIF_TOKEN;
};

export type TRegisterPushNotifTokenSuccess<T = string> = (
    token: T,
) => {
    type: typeof REGISTER_PUSH_NOTIF_TOKEN_SUCCESS;
    payload: {
        token: T;
    };
};

export type TUpdateProfileSendBird = () => {
    type: typeof UPDATE_PROFILE_SENDBIRD;
};

export type TUpdateProfileSendBirdSuccess<T = Pick<IProfileChat, 'avatar' | 'name'>> = (
    profile: T,
) => {
    type: typeof UPDATE_PROFILE_SENDBIRD_SUCCESS;
    payload: {
        profile: T;
    };
};

export type TJoinChannel = () => {
    type: typeof JOIN_CHANNEL;
};

export type TJoinChannelSuccess<T = SendBird.GroupChannel> = (
    groupChannel: T,
) => {
    type: typeof JOIN_CHANNEL_SUCCESS;
    payload: {
        groupChannel: T;
    };
};

export type TGetPreviousMessagesSuccess<T = IMessageChat[]> = (
    messages: T,
) => {
    type: typeof GET_PREVIOUS_MESSAGES_SUCCESS;
    payload: {
        messages: T;
    };
};

export type TSendMessage<
    T = string,
    J = string,
    K = (user: SendBird.UserMessage | SendBird.FileMessage) => void,
    I = (error: SendBird.SendBirdError) => void
> = (
    type: J,
    text: T,
    onSuccess?: K,
    onFailed?: I,
) => {
    type: typeof SEND_MESSAGE;
    payload: {
        text: T;
        onSuccess?: K;
        onFailed?: I;
    };
};

export type TSendMessageSuccess<T = IMessageChat> = (
    message: T,
) => {
    type: typeof SEND_MESSAGE_SUCCESS;
    payload: {
        message: T;
    };
};

export type TOnMessageReceived = (
    onCallback?: (message: IMessageChat) => void,
) => {
    type: typeof ON_MESSAGE_RECEIVED;
    payload: {
        onCallback: typeof onCallback;
    };
};

export type TOnMessageReceivedSuccess<T = IMessageChat> = (
    message: T,
) => {
    type: typeof ON_MESSAGE_RECEIVED_SUCCESS;
    payload: {
        message: T;
    };
};

export type TRemoveOnMessageReceived = () => {
    type: typeof REMOVE_ON_MESSAGE_RECEIVED;
};

export type TGetTotalUnreadMessage<T = (count: number) => void> = (
    onCallback?: T,
) => {
    type: typeof GET_TOTAL_UNREAD_MESSAGE;
    payload: {
        onCallback?: T;
    };
};

export type TUpdateTotalUnreadMessageSuccess<T = number> = (
    count: T,
) => {
    type: typeof UPDATE_TOTAL_UNREAD_MESSAGE_SUCCESS;
    payload: {
        count: T;
    };
};

export type TToggleIsInChatScreen = (
    isInChatScreen: boolean,
) => {
    type: typeof TOGGLE_IS_IN_CHAT_SCREEN;
    payload: {
        isInChatScreen: typeof isInChatScreen;
    };
};

export type THandleAppStateChange = () => {
    type: typeof HANDLE_APP_STATE_CHANGE;
};

export type TRemoveAppStateChange = () => {
    type: typeof REMOVE_APP_STATE_CHANGE;
};

export type TChatFailed<T = any, K = string> = (
    error: T,
    type: K,
) => {
    type: typeof CHAT_FAILED;
    payload: {
        error: IError;
    };
};

export type ActionChatType = ReturnType<
    | TConnectSendBird
    | TConnectSendBirdSuccess
    | TDisconnectSendBird
    | TDisconnectSendBirdSuccess
    | TRegisterPushNotifToken
    | TRegisterPushNotifTokenSuccess
    | TUpdateProfileSendBird
    | TUpdateProfileSendBirdSuccess
    | TJoinChannel
    | TJoinChannelSuccess
    | TGetPreviousMessagesSuccess
    | TSendMessage
    | TSendMessageSuccess
    | TOnMessageReceived
    | TOnMessageReceivedSuccess
    | TRemoveOnMessageReceived
    | TGetTotalUnreadMessage
    | TUpdateTotalUnreadMessageSuccess
    | TToggleIsInChatScreen
    | THandleAppStateChange
    | TRemoveAppStateChange
    | TChatFailed
>;
