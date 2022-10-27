import { IError } from './responseApi';

export interface IProfileChat {
    _id: string;
    name: string;
    avatar: string;
}

export interface IMessageChat {
    _id: number;
    text: string;
    createdAt: number;
    user: IProfileChat;
    messageType: string;
}

export interface IChatState {
    isCheckedIn : boolean,
    isConnected: boolean;
    profile: null | IProfileChat;
    confirmationResult : any,
    messages: IMessageChat[];
    groupChannel: null | SendBird.GroupChannel;
    unreadMessage: number;
    transaction_data : any,
    isInChatScreen: boolean;
    error: Partial<IError>;
    bills : any,
    isCheckedOut : boolean
}
