import { createLogic } from 'redux-logic';
import { IDependencies } from '../types/responseApi';
import {
    chatFailed,
    connectSendBirdSuccess,
    registerPushNotifTokenSuccess,
    registerPushNotifToken,
    updateProfileSendBirdSuccess,
    onMessageReceivedSuccess,
    sendMessageSuccess,
    joinChannelSuccess,
    getPreviousMessagesSuccess,
    updateTotalUnreadMessageSuccess,
    getTotalUnreadMessage,
    connectSendBird,
    disconnectSendBird,
    onMessageReceived,
    joinChannel,
} from '../actions/action.chat';
import {
    CONNECT_SENDBIRD,
    TConnectSendBird,
    REGISTER_PUSH_NOTIF_TOKEN,
    TRegisterPushNotifToken,
    UPDATE_PROFILE_SENDBIRD,
    TUpdateProfileSendBird,
    SEND_MESSAGE,
    JOIN_CHANNEL,
    ON_MESSAGE_RECEIVED,
    REMOVE_ON_MESSAGE_RECEIVED,
    TSendMessage,
    TJoinChannel,
    GET_TOTAL_UNREAD_MESSAGE,
    TGetTotalUnreadMessage,
    TOnMessageReceived,
    HANDLE_APP_STATE_CHANGE,
    REMOVE_APP_STATE_CHANGE,
    THandleAppStateChange,
    DISCONNECT_SENDBIRD,
    TDisconnectSendBird,
} from '../types/action.chat';
import { Platform, AppState, AppStateStatus } from 'react-native';
import { handleLocalNotification } from '../utils/handleLogic';
import { getProfile } from '../actions/action.account';
import SendBird from 'sendbird';

const connectSendBirdLogic = createLogic({
    type: CONNECT_SENDBIRD,
    process({ sendbird, action, getState }: IDependencies<ReturnType<TConnectSendBird>>, dispatch, done) {
        const { sendbird_user_id: uid, sendbird_access_token: token } = getState().account.profile;
        // just check uid and token, if undefined then just throw some empty string
        // maybe this logic not run, if user not check in yet
        console.log(uid + "      uidddddd     " + token)
        sendbird.connect(uid ? uid : '', token ? token : '', (user, error) => {
            // handle error
            if (error) {
                console.log('send bird connting fail');
                dispatch(chatFailed(error, action.type));

                if (action.payload.onFailed) {
                    action.payload.onFailed(error);
                }

                return done();
            }

            // handle success
            // store necessary user profile
            dispatch(
                connectSendBirdSuccess({
                    _id: user.userId,
                    name: user.nickname,
                    avatar: user.profileUrl,
                }),
            );
            // register push notif token
            dispatch(registerPushNotifToken());

            // update profile sendbird
            // dispatch(updateProfileSendBird());

            // send callback, wake the fuck up samurai,
            // we have a hotel to burn (Keanu Reeves)
            if (action.payload.onSuccess) {
                action.payload.onSuccess(user);
            }

            done();
        });
    },
});

const registerPushNotifTokenLogic = createLogic({
    type: REGISTER_PUSH_NOTIF_TOKEN,
    async process(
        { sendbird, firebase, action }: IDependencies<ReturnType<TRegisterPushNotifToken>>,
        dispatch,
        done,
    ) {
        try {
            // request permission
            if (!(await firebase.messaging().hasPermission())) {
                // user doesn't have permission
                await firebase.messaging().requestPermission();
            }

            // get token
            const token = await firebase.messaging().getToken();


            console.log(token)

            // register based on platform
            if (Platform.OS === 'ios') {
                return sendbird.registerAPNSPushTokenForCurrentUser(token, (response, error) => {
                    // reject error
                    if (error) {
                        dispatch(chatFailed(error, action.type));
                        return done();
                    }

                    // just log success
                    dispatch(registerPushNotifTokenSuccess(token));
                    done();
                });
            }

            // platform android
            sendbird.registerGCMPushTokenForCurrentUser(token, (response, error) => {
                // reject error
                if (error) {
                    dispatch(chatFailed(error, action.type));
                    return done();
                }

                // just log success
                dispatch(registerPushNotifTokenSuccess(token));
                done();
            });
        } catch (error) {
            dispatch(chatFailed(error, action.type));
            done();
        }
    },
});

const updateProfileSendBirdLogic = createLogic({
    type: UPDATE_PROFILE_SENDBIRD,
    process(
        { sendbird, getState, action }: IDependencies<ReturnType<TUpdateProfileSendBird>>,
        dispatch,
        done,
    ) {
        const { cardholder_name, passport_photos } = getState().account.profile;

        sendbird.updateCurrentUserInfo(
            cardholder_name ? cardholder_name : '-',
            passport_photos && passport_photos.length > 0 ? passport_photos[0] : '-',
            (user, error) => {
                // handle error
                if (error) {
                    dispatch(chatFailed(error, action.type));

                    return done();
                }

                // handle success
                dispatch(updateProfileSendBirdSuccess({ name: user.nickname, avatar: user.profileUrl }));

                done();
            },
        );
    },
});

const joinChannelLogic = createLogic({
    type: JOIN_CHANNEL,
    process({ sendbird, action, getState }: IDependencies<ReturnType<TJoinChannel>>, dispatch, done) {
        const { sendbird_channel_url: url, sendbird_user_id: uid } = getState().account.profile;

        // sendbird.GroupChannel.getChannel(url ? url : '', (channel, err) => {
        //     console.log('channelll', channel);
        //     console.log('errror', err);
        // });

        // the same in connect logic, dont ask me again about check undefined value
        sendbird.GroupChannel.getChannel(url ? url : '', (channel, error) => {
            // handler error
            if (error) {
                dispatch(chatFailed(error, action.type));

                return done();
            }

            // store channel: GroupChannel instance, for later use
            // maybe to send a fucking message
            dispatch(joinChannelSuccess(channel));
            // populate 30 previous messages if exist
            channel.createPreviousMessageListQuery().load(30, true, (messages, errorQuery) => {
                // handler error
                if (errorQuery) {
                    dispatch(chatFailed(errorQuery, action.type));

                    return done();
                }

                // if (__DEV__) {
                //     console.log(`${action.type}: `, { messages });
                // }

                // store the previous messages
                dispatch(
                    getPreviousMessagesSuccess(
                        messages
                            .filter(
                                ({ messageType }) =>
                                    messageType === 'user' ||
                                    messageType === 'admin' ||
                                    messageType === 'file',
                            )
                            .map((message) => {
                                if (message.messageType === 'user' || message.messageType == 'file') {
                                    const {
                                        sender: { userId, nickname, profileUrl },
                                    } = <SendBird.UserMessage>message;

                                    return {
                                        _id: message.messageId,
                                        text: (<SendBird.UserMessage>message).message,
                                        url: message.url ? message.url : '',
                                        createdAt: message.createdAt,
                                        user: {
                                            _id: userId,
                                            name: nickname,
                                            avatar:
                                                userId !== uid
                                                    ? require('../images/icon_concierge.png')
                                                    : profileUrl,
                                        },
                                        messageType: message.messageType,
                                        extraData: {
                                            ...message,
                                        },
                                    };
                                }

                                return {
                                    _id: message.messageId,
                                    text: (<SendBird.AdminMessage>message).message,
                                    createdAt: message.createdAt,
                                    user: {
                                        _id: '',
                                        name: 'Admin',
                                        avatar: require('../images/icon_concierge.png'),
                                    },
                                    messageType: message.messageType,
                                };
                            }),
                    ),
                );

                // marking all messages as read
                channel.markAsRead();

                // update counter unread to 0
                dispatch(updateTotalUnreadMessageSuccess(0));

                done();
            });
        });
    },
});

const sendMessageLogic = createLogic({
    type: SEND_MESSAGE,
    process({ action, sendbird, getState }: IDependencies<ReturnType<TSendMessage>>, dispatch, done) {
        // use stored groupChannel instance, from joinChannelLogic
        const { groupChannel } = getState().chat;
        const { type, text } = action.payload;
        // make sure groupChannel isn't null, prevent runtime crash
        if (type == 'image') {
            if (groupChannel) {
                groupChannel.endTyping();
                groupChannel.sendFileMessage(action.payload.text, (message, error) => {
                    // handle error
                    if (error) {
                        dispatch(chatFailed(error, action.type));

                        if (action.payload.onFailed) {
                            action.payload.onFailed(error);
                        }

                        return done();
                    }
                    const {
                        sender: { userId, nickname, profileUrl },
                    } = <SendBird.UserMessage>message;

                    dispatch(
                        sendMessageSuccess({
                            _id: message.messageId,
                            text: (<SendBird.UserMessage>message).message,
                            createdAt: message.createdAt,
                            user: { _id: userId, name: nickname, avatar: profileUrl },
                            messageType: message.messageType,
                            url: message.url,
                        }),
                    );

                    if (action.payload.onSuccess) {
                        action.payload.onSuccess(message);
                    }

                    done();
                });
            }
        } else {
            if (groupChannel) {
                groupChannel.endTyping();
                const params = new sendbird.UserMessageParams();
                params.message = action.payload.text;
                params.customType = type === 'Admin' ? 'bot' : 'user';
                groupChannel.sendUserMessage(params, (message, error) => {
                    console.log('messsages', message);
                    // handle error
                    if (error) {
                        dispatch(chatFailed(error, action.type));

                        if (action.payload.onFailed) {
                            action.payload.onFailed(error);
                        }

                        return done();
                    }

                    const {
                        sender: { userId, nickname, profileUrl },
                    } = <SendBird.UserMessage>message;

                    dispatch(
                        sendMessageSuccess({
                            _id: message.messageId,
                            text: (<SendBird.UserMessage>message).message,
                            createdAt: message.createdAt,
                            user: { _id: userId, name: type === 'Admin' ? 'Admin' : nickname, avatar: profileUrl },
                            messageType: message.messageType,
                        }),
                    );

                    if (action.payload.onSuccess) {
                        action.payload.onSuccess(message);
                    }

                    done();
                });
            }
        }
    },
});

const onMessageReceivedLogic = createLogic({
    type: ON_MESSAGE_RECEIVED,
    cancelType: REMOVE_ON_MESSAGE_RECEIVED,
    warnTimeout: 0,
    process(
        { cancelled$, sendbird, getState, action }: IDependencies<ReturnType<TOnMessageReceived>>,
        dispatch,
        done,
    ) {
        const { sendbird_channel_url: url, sendbird_user_id: uid } = getState().account.profile;

        // name handler
        const handlerName = 'onReceive';
        console.log('he is not in chat')

        // instance channel handler
        const channelHandler = new sendbird.ChannelHandler();

        // add channel handler for receive message
        sendbird.addChannelHandler(handlerName, channelHandler);

        // on receive message handler
        channelHandler.onMessageReceived = (channel, message) => {
            const { isInChatScreen } = getState().chat;
            console.log("channellllllllllllllstatessssss", getState().chat)
            console.log("CHANNEL--", channel)
            console.log("MESSAGE--", message)
            // validate is same channel
            if (channel.url === url) {
                if (message.messageType === 'user' || message.messageType == 'file') {
                    const messageChat = {
                        _id: message.messageId,
                        text: (<SendBird.UserMessage>message).message,
                        createdAt: message.createdAt,
                        user: {
                            _id: (<SendBird.UserMessage>message).sender.userId,
                            name: (<SendBird.UserMessage>message).sender.nickname,
                            avatar:
                                (<SendBird.UserMessage>message).sender.userId !== uid
                                    ? require('../images/icon_concierge.png')
                                    : (<SendBird.UserMessage>message).sender.profileUrl,
                        },
                        messageType: message.messageType,
                        url: message.url,
                    };
                    dispatch(onMessageReceivedSuccess(messageChat));
                    dispatch(getTotalUnreadMessage());
                    if (!isInChatScreen) {
                        handleLocalNotification(messageChat.text, `${messageChat._id}`, getState().hotel.name, getState().account.profile.reference);
                    }
                    if (action.payload.onCallback) {
                        action.payload.onCallback(messageChat);
                    }

                    return 0;
                }

                const messageChat = {
                    _id: message.messageId,
                    text: (<SendBird.AdminMessage>message).message,
                    createdAt: message.createdAt,
                    user: {
                        _id: '',
                        name: 'Admin',
                        avatar: require('../images/icon_concierge.png'),
                    },
                    messageType: message.messageType,
                };

                if (messageChat.text.includes('Check In request has been accepted')) {
                    dispatch(connectSendBird())
                    dispatch(joinChannel())
                }
                if ((<SendBird.AdminMessage>message).message.toLowerCase().localeCompare('admin is online now') != 0 && (<SendBird.AdminMessage>message).message.toLowerCase().localeCompare('admin is offline') != 0) {
                    dispatch(onMessageReceivedSuccess(messageChat));
                    dispatch(getTotalUnreadMessage());
                } else {
                    dispatch(getProfile(getState().account.access_token, getState().hotel.code))
                }
                if (!isInChatScreen && (<SendBird.AdminMessage>message).message.toLowerCase().localeCompare('admin is online now') != 0 && (<SendBird.AdminMessage>message).message.toLowerCase().localeCompare('admin is offline') != 0) {
                    handleLocalNotification(messageChat.text, `${messageChat._id}`, getState().hotel.name, getState().account.profile.reference);
                }



                if (action.payload.onCallback) {
                    action.payload.onCallback(messageChat);
                }

                return 0;
            }
        };

        // call remove handler,
        // if removeOnMessageReceived action creator is dispatched
        cancelled$.subscribe(() => {
            sendbird.removeChannelHandler(handlerName);
            done();
        });
    },
});

const getTotalUnreadMessageLogic = createLogic({
    type: GET_TOTAL_UNREAD_MESSAGE,
    process({ sendbird, action }: IDependencies<ReturnType<TGetTotalUnreadMessage>>, dispatch, done) {
        sendbird.GroupChannel.getTotalUnreadMessageCount((count) => {
            dispatch(updateTotalUnreadMessageSuccess(count));
            if (action.payload.onCallback) {
                action.payload.onCallback(count);
            }
            done();
        });
        // done();
    },
});

const handleAppStateChangeLogic = createLogic({
    type: HANDLE_APP_STATE_CHANGE,
    cancelType: REMOVE_APP_STATE_CHANGE,
    warnTimeout: 0,
    process(
        { cancelled$, sendbird, getState }: IDependencies<ReturnType<THandleAppStateChange>>,
        dispatch,
        done,
    ) {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (getState().account.isCheckedIn) {
                dispatch(getProfile(getState().account.access_token, getState().hotel.code));
            }

            // if (nextAppState === 'active') {
            // if (__DEV__) {
            //     console.log('APP_IS_ACTIVE: ', { nextAppState });
            // }

            dispatch(
                connectSendBird(() => {
                    let execOnce = false;
                    dispatch(
                        onMessageReceived(() => {
                            if (!execOnce) {
                                dispatch(getProfile(getState().account.access_token, getState().hotel.code));
                                execOnce = true;
                            }
                        }),
                    );
                    dispatch(getTotalUnreadMessage());
                    sendbird.setForegroundState();
                }),
            );
            // } else if (nextAppState === 'background') {
            //     // if (__DEV__) {
            //     //     console.log('APP_IS_BACKGROUND: ', { nextAppState });
            //     // }
            //     sendbird.setBackgroundState();
            //     dispatch(disconnectSendBird());
            // }
        };

        AppState.addEventListener('change', handleAppStateChange);

        // call remove handler,
        // if removeOnMessageReceived action creator is dispatched
        cancelled$.subscribe(() => {
            AppState.removeEventListener('change', handleAppStateChange);
            done();
        });
    },
});

const disconnectSendBirdLogic = createLogic({
    type: DISCONNECT_SENDBIRD,
    process({ getState, sendbird, action }: IDependencies<ReturnType<TDisconnectSendBird>>, dispatch, done) {
        // cant disconnect for user not connected yet
        if (!getState().chat.isConnected) {
            dispatch(chatFailed('User not connected yet', action.type));
            if (action.payload.onFailed) {
                action.payload.onFailed();
            }
            return done();
        }

        sendbird.disconnect(() => {
            if (action.payload.onSuccess) {
                action.payload.onSuccess();
            }

            done();
        });
    },
});

export default [
    connectSendBirdLogic,
    registerPushNotifTokenLogic,
    updateProfileSendBirdLogic,
    joinChannelLogic,
    sendMessageLogic,
    onMessageReceivedLogic,
    getTotalUnreadMessageLogic,
    handleAppStateChangeLogic,
    disconnectSendBirdLogic,
];
