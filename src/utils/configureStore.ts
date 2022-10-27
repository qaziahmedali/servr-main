import axios from 'axios';
import { createStore, applyMiddleware, Middleware } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import { createLogicMiddleware } from 'redux-logic';
import { createLogger } from 'redux-logger';
import { persistReducer, PersistConfig } from 'redux-persist';
import rootReducer from '../reducers';
import logic from '../logics';
import firebase from '@react-native-firebase/app'
// import firebase from 'react-native-firebase';
import SendBird from 'sendbird';
// import Config from 'react-native-config';
import { createBlacklistFilter } from 'redux-persist-transform-filter';
import { IChatState } from '../types/chat';
import { IState } from '../types/state';
import { SENDBIRD_APP_ID } from './../utils/env';

export const dependencies = {
    httpClient: axios,
    firebase,
    sendbird: new SendBird({ appId: SENDBIRD_APP_ID }),
    // new SendBird({ appId: Config.SENDBIRD_APP_ID }),
};
const logicMiddleware = createLogicMiddleware(logic as any, dependencies);
const middlewares: Middleware[] = [logicMiddleware];

if (__DEV__) {
    middlewares.push(createLogger());
}

const blacklistSomePropsChat = createBlacklistFilter(
    <keyof IState>'chat',
    <(keyof IChatState)[]>['isConnected', 'groupChannel', 'isInChatScreen'],
);

const persistConfig: PersistConfig = {
    key: 'root_servr',
    storage: AsyncStorage,
    blacklist: <(keyof IState)[]>['restaurant', 'conciergeService', 'spa'],
    transforms: [blacklistSomePropsChat],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    return createStore(persistedReducer, applyMiddleware(...middlewares));
};
