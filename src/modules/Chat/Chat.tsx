import React from 'react';
import {
    View,
    Platform,
    Image,
    Keyboard,
    StyleSheet,
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    TouchableHighlight,
    ActivityIndicator,
    SafeAreaView,
    PermissionsAndroid,
    Alert,
    BackHandler,
    StatusBar,
} from 'react-native';
import BackArrow from '../../images/backArrow.svg';
import base from '../../utils/baseStyles';
import { H1, H4, H3, H2 } from '../_global/Text';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { GiftedChat, IMessage, BubbleProps } from 'react-native-gifted-chat';
import { IChatReduxProps } from './Chat.Container';
import { IMessageChat } from '../../types/chat';
import * as Animatable from 'react-native-animatable';
import IonIcon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Feather';
import ImagePicker, { ImagePickerOptions, ImagePickerResponse } from 'react-native-image-picker';
// import Modal from 'react-native-modal';
import { ButtonPrimary } from '../_global/Button';
import ImageZoomModal from '../_global/ImageZoomModal';
import Axios from 'axios';
import moment from 'moment';
import { UPLOAD_CHAT_IMAGE } from '../../constants/api';
import { toast } from '../../utils/handleLogic';
import ImageZoom from 'react-native-image-pan-zoom';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import { extraPad, phoneType } from '../../utils/extraPad';
import { View as ViewAnimatable } from 'react-native-animatable';
import { debounce } from 'lodash';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {
    PowerTranslator,
    ProviderTypes,
    TranslatorConfiguration,
    TranslatorFactory,
} from 'react-native-power-translator';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    PlayBackType,
    RecordBackType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import BottomBar from '../_global/BottomBar';
import { chat, LostAndFound, mainmenu, mainmenuchildren, Profile } from '../../utils/navigationControl';
import DropShadow from 'react-native-drop-shadow';
import Attach from '../../images/attach.svg';
import Mic from '../../images/mic.svg';
import Send from '../../images/send.svg';
import Search from '../../images/Search.svg';
import { ScrollView } from 'react-native-gesture-handler';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { RootContainer } from '../_global/Container';
import dialogFlowConfig from '../../constants/env';
export interface IChatBaseProps {
    from?: 'restaurant' | 'concierge_service' | 'main_menu';
}

interface IChatProps extends IChatBaseProps, IChatReduxProps {
    componentId: string;
    account_profile: any;
}

interface IChatState {
    composedChat: string;
    message: string;
    chat_image: object;
    isvisible: boolean;
    isLoading: boolean;
    zooomModal: boolean;
    image_url: string;
    showSearch: boolean;
    search: string;
    showDeleteModal: boolean;
    deleteMessageId: number;
    isLoggingIn: boolean;
    recordSecs: number;
    recordTime: string;
    currentPositionSec: number;
    currentDurationSec: number;
    playTime: string;
    duration: string;
    startRecording: boolean;
    recordingStopped: boolean;
    startPlaying: boolean;
    pausePlaying: boolean;
    recordedPath: string;
    modalVisible: boolean;
    Image_URL: any;
    loadingTranslateMessages: boolean;
    chainData: {
        data: {
            name: string;
            logo: string;
            splash_screen: string;
            private_policy: string;
            terms_n_conditions: string;
            about_us: string;
            contact_us: string;
            logo_gif_dark: string;
            logo_gif_light: string;
            signup_bg: string;
            signin_bg: string;
        };
    };
}

const openingChatFromAdmin: IMessageChat = {
    _id: 0,
    createdAt: new Date().getTime(),
    text: 'Hi! How can I help?',
    user: {
        _id: '-1',
        name: 'Admin',
        avatar: require('../../images/icon_concierge.png'),
    },
    messageType: 'other',
};

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
    title: 'Select Passport Photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    cameraType: 'front',
    allowsEditing: false,
    maxHeight: 600,
    maxWidth: 600,
    quality: 0.6,
    mediaType: 'photo',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose from Library',
};

const RootInScrollViewForIOS = (props) => {
    if (Platform.OS == 'android') {
        return <ScrollView>{props.children}</ScrollView>;
    } else return <View style={{ flex: 1 }}>{props.children}</View>;
};

class Chat extends React.Component<IChatProps, IChatState> {
    private dirs = RNFetchBlob.fs.dirs;
    private path = Platform.select({
        ios: 'hello.m4a',
        android: `${this.dirs.CacheDir}/hello.mp3`,
    });

    private audioRecorderPlayer: AudioRecorderPlayer;

    constructor(props: IChatProps) {
        super(props);

        this.state = {
            composedChat: '',
            message: '',
            chat_image: {},
            isvisible: false,
            isLoading: false,
            zooomModal: false,
            image_url: '',
            showSearch: false,
            search: '',
            showDeleteModal: false,
            deleteMessageId: 0,
            isLoggingIn: false,
            recordSecs: 0,
            recordTime: '00:00:00',
            currentPositionSec: 0,
            currentDurationSec: 0,
            playTime: '00:00:00',
            duration: '00:00:00',
            startRecording: false,
            recordingStopped: false,
            startPlaying: false,
            pausePlaying: false,
            recordedPath: '',
            modalVisible: false,
            Image_URL: '',
            loadingTranslateMessages: false,
            chainData: {
                data: {
                    name: '',
                    logo: '',
                    splash_screen: '',
                    private_policy: '',
                    terms_n_conditions: '',
                    about_us: '',
                    contact_us: '',
                    logo_gif_dark: '',
                    logo_gif_light: '',
                    signup_bg: '',
                    signin_bg: '',
                },
            },
        };

        props.connectSendBird();
        props.joinChannel();

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleSend = this._handleSend.bind(this);
        this._renderBubble = this._renderBubble.bind(this);
        this._renderLoadEarlier = this._renderLoadEarlier.bind(this);
        this._openLibrary = this._openLibrary.bind(this);
        this._handleProcessImage = this._handleProcessImage.bind(this);
        this._openCamera = this._openCamera.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this._handleChat = this._handleChat.bind(this);
        this._handleAccount = this._handleAccount.bind(this);
        this.googleResponse = this.googleResponse.bind(this);
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
        var langForTranslation = 'en';

        if (this.props.selectedLanguage.lang == 'spanish') {
            langForTranslation = 'es';
        } else if (this.props.selectedLanguage.lang == 'french') {
            langForTranslation = 'fr';
        } else if (this.props.selectedLanguage.lang == 'english') {
            langForTranslation = 'en';
        } else if (this.props.selectedLanguage.lang == 'russian') {
            langForTranslation = 'ru';
        } else if (this.props.selectedLanguage.lang == 'chinese') {
            langForTranslation = 'zh-CN';
        } else if (this.props.selectedLanguage.lang == 'italian') {
            langForTranslation = 'it';
        } else if (this.props.selectedLanguage.lang == 'hebrew') {
            langForTranslation = 'iw';
        } else if (this.props.selectedLanguage.lang == 'arabic') {
            langForTranslation = 'ar';
        } else if (this.props.selectedLanguage.lang == 'indonesian') {
            langForTranslation = 'id';
        } else if (this.props.selectedLanguage.lang == 'dutch') {
            langForTranslation = 'nl';
        } else if (this.props.selectedLanguage.lang == 'german') {
            langForTranslation = 'de';
        } else if (this.props.selectedLanguage.lang == 'japanese') {
            langForTranslation = 'ja';
        } else if (this.props.selectedLanguage.lang == 'portugese') {
            langForTranslation = 'pt';
        }

        TranslatorConfiguration.setConfig(
            ProviderTypes.Google,
            'AIzaSyCFPQ48Aq7TYwAXhkZVSI_ZrujxYP5epOY',
            langForTranslation,
        );
        this.handleBackButton = this.handleBackButton.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        // this.props.goBackToHome(
        //     false,
        //     () => console.log('failed called'),
        //     () => console.log('failed failed'),
        // );
    }

    handleBackButton() {
        this.props.toggleIsInChatScreen(false);
        this.props.updateTotalUnreadMessageSuccess(0);
        // this.props.goBackToHome(
        //     true,
        //     () => {
        //         console.log("Hello it's called");
        //     },
        //     () => {
        //         console.log('Hello its failed');
        //     },
        // );
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 0,
            },
        });
        return BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    async componentDidMount() {
        Dialogflow_V2.setConfiguration(
            dialogFlowConfig.client_email,
            dialogFlowConfig.private_key,
            Dialogflow_V2.LANG_ENGLISH_US,
            dialogFlowConfig.project_id,
        );

        this.setState({
            chainData: this.props?.chainData,
        });
    }

    componentWillUnmount() {
        // this.props.toggleIsInChatScreen(false);
        this.props.updateTotalUnreadMessageSuccess(0);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    _handleChat() {
        // if (this._isLockFeature()) {
        //     return false;
        // }

        Navigation.push(this.props.componentId, chat());
    }

    // _handleLostAndFound() {
    //     Navigation.push(this.props.componentId, LostAndFound({ backGround: false }));
    // }

    _handleAccount() {
        this.props.toggleIsInChatScreen(false);
        this.props.updateTotalUnreadMessageSuccess(0);
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 3,
            },
        });
    }

    _handleBack() {
        console.log('click');
        Keyboard.dismiss();
        Navigation.pop(this.props.componentId);
    }

    googleResponse(data: any) {
        let text = data.queryResult.fulfillmentMessages[0].text.text[0];
        const googleReponseTextObject = {
            _id: 0,
            createdAt: new Date().getTime(),
            text: text,
            user: {
                _id: '-1',
                name: 'Admin',
                avatar: require('../../images/icon_concierge.png'),
            },
            messageType: 'other',
        };
        this.props.sendMessage('Admin', text, () => {
            this.setState({ composedChat: '', message: '' });
        });
    }

    _handleSend(messages: IMessage[]) {
        if (messages[0].url) {
            let type = 'image';
            this.props.sendMessage(type, messages[0].url, () => {
                this.setState({ composedChat: '', message: '' });
            });
        } else {
            let type = 'text';
            this.props.sendMessage(type, messages[0].text, () => {
                if (this.props.account_profile?.is_chat_active == 0)
                    Dialogflow_V2.requestQuery(
                        messages[0].text,
                        (result: any) => this.googleResponse(result),
                        (error: any) => console.log(error),
                    );
                this.setState({ composedChat: '', message: '' });
            });
        }
    }

    _handleOnHomePress = () => {
        if (this.props.from === 'restaurant') {
            Navigation.updateProps(this.props.componentId, { from: null })

            Navigation.setRoot({
                root: {
                    bottomTabs: {
                        children: [
                            {
                                stack: {
                                    id: 'MAIN_MENU_TAB',
                                    children: [
                                        {
                                            component: {
                                                id: 'mainmenu',
                                                name: 'MainMenu',
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                stack: {
                                    id: 'CHAT_TAB',
                                    children: [
                                        {
                                            component: {
                                                id: 'chat',
                                                name: 'Chat',
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                stack: {
                                    id: 'LOST_AND_FOUND_TAB',
                                    children: [
                                        {
                                            component: {
                                                id: 'lostAndFound',
                                                name: 'LostAndFound',
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                stack: {
                                    id: 'PROFILE_TAB',
                                    children: [
                                        {
                                            component: {
                                                id: 'profile',
                                                name: 'Profile',
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        options: {
                            bottomTabs: {
                                visible: false,
                            },
                        },
                    },
                },
            });
        } else {
            this.props.toggleIsInChatScreen(false);
            this.props.updateTotalUnreadMessageSuccess(0);
            Navigation.mergeOptions(this.props.componentId, {
                bottomTabs: {
                    currentTabIndex: 0,
                },
            });
        }
    }

    deleteChatMessage = async () => {
        const { groupChannel } = this.props.chat;
        const application_id = '51123198-1edf-4485-b5da-73713d080bc3';
        const channel_type = 'group_channels';
        const channel_url = groupChannel.url;
        const message_id = this.state.deleteMessageId;
        const token = 'b43135c1f950e034524afafce03d272e74b0f48b';
        const url = `https://api-${application_id}.sendbird.com/v3/${channel_type}/${channel_url}/messages/${message_id}`;

        await Axios.delete(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf8',
                'Api-Token': token,
            },
        })
            .then((res) => {
                console.log('responseee', res);
                this.props.joinChannel();
            })
            .catch((error) => {
                console.log('error', error.response);
            });
    };

    uploadImage = async () => {
        this.setState({
            isLoading: true,
        });
        let formData = new FormData();
        formData.append('chat_image', this.state.chat_image);
        let url = await Axios.post(UPLOAD_CHAT_IMAGE, formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${this.props.access_token}`,
                // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
            },
        })
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                return error.response;
            });

        // if()
        if (url) {
            if (url.data) {
                this._handleSend([
                    {
                        createdAt: new Date(),
                        url: url.data,
                        user: { ...this.props.profile },
                        _id: new Date().getTime(),
                    },
                ]);
                this.setState({
                    message: '',
                    chat_image: {},
                    isvisible: false,
                    isLoading: false,
                });
            } else {
                // showToast("Something went wrong, please try again");
            }
        } else {
            this.setState({
                isLoading: false,
            });
            toast(this.props.selectedLanguage.something_went_wrong);
        }
    };

    setModalVisible(visible: boolean) {
        this.setState({ zooomModal: visible });
    }

    _renderBubble({ currentMessage }: BubbleProps<IMessage>) {
        console.log(currentMessage);
        return (
            <>
                {currentMessage.messageType == 'file' && currentMessage.url !== '' ? (
                    <View
                        style={{
                            flexDirection: currentMessage?.user.name.includes('Admin')
                                ? 'row'
                                : 'row-reverse',
                            justifyContent: 'space-between',
                            width: currentMessage?.user.name.includes('Admin') ? '85%' : '96%',
                        }}
                    >
                        <TouchableOpacity
                            // onLongPress={() => {
                            //     if (!currentMessage.user._id.includes('admin')) {
                            //         this.setState({
                            //             showDeleteModal: true,
                            //             deleteMessageId: currentMessage._id,
                            //         });
                            //     }
                            // }}
                            onPress={() => {
                                this.setState({ image_url: currentMessage.url });
                                setTimeout(() => {
                                    this.setModalVisible(true);
                                }, 500);
                            }}
                            style={{
                                height: scale.h(20.0),
                                width: scale.w(20.0),
                                borderWidth: scale.h(0.1),
                                borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                borderRadius: scale.h(1.0),
                                marginTop: scale.h(1.0),
                            }}
                        >
                            <Image
                                style={{ height: '100%', borderRadius: scale.h(1.0) }}
                                source={{
                                    uri: currentMessage.url,
                                }}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: colors.CHAT_TIMER_COLOR,
                                alignSelf: 'flex-end',
                                fontSize: scale.w(1.12),
                                fontFamily: 'Roboto-Regular',
                            }}
                        >
                            {moment(currentMessage?.createdAt).format('LT')}
                        </Text>
                    </View>
                ) : (
                    <View
                        style={{
                            flexDirection: currentMessage?.user.name.includes('Admin')
                                ? 'row'
                                : 'row-reverse',
                            justifyContent: 'space-between',
                            width: currentMessage?.user.name.includes('Admin') ? '85%' : '96%',
                        }}
                    >
                        {
                            this.props.selectedLanguage.lang == 'english' ? (
                                <View
                                    style={
                                        currentMessage?.user.name.includes('Admin')
                                            ? styles.chat_bubble_container
                                            : [
                                                styles.admin_chat_bubble_container,
                                                { backgroundColor: this.props.color },
                                            ]
                                    }
                                >
                                    <Text
                                        style={{
                                            color: currentMessage?.user.name.includes('Admin')
                                                ? colors.CHAT_TIMER_COLOR
                                                : colors.WHITE,
                                            lineHeight: 20,
                                            fontFamily: 'Roboto-Regular',
                                            letterSpacing: 0.3,
                                            fontSize: scale.w(1.45),
                                        }}
                                    >
                                        {currentMessage ? currentMessage.text : ''}
                                    </Text>
                                </View>
                            ) : //     <View
                                //     style={
                                //         currentMessage?.user.name.includes('Admin')
                                //             ? styles.chat_bubble_container
                                //             : [styles.admin_chat_bubble_container, { backgroundColor: this.props.color, height : heightPercentageToDP(8) ||  }]
                                //     }
                                // >
                                currentMessage != undefined &&
                                    currentMessage != null &&
                                    currentMessage?.text != undefined &&
                                    currentMessage?.text != null &&
                                    currentMessage?.text != '' ? (
                                    <PowerTranslator
                                        style={
                                            currentMessage?.user.name.includes('Admin')
                                                ? {
                                                    borderTopRightRadius: scale.w(2),
                                                    borderBottomRightRadius: scale.w(2),
                                                    borderBottomLeftRadius: scale.w(2),

                                                    paddingVertical: heightPercentageToDP(1.8),
                                                    paddingHorizontal: widthPercentageToDP(4),
                                                    marginVertical: heightPercentageToDP(1.25),
                                                    maxWidth: widthPercentageToDP(60),
                                                    backgroundColor: colors.ADMIN_CHAT,
                                                }
                                                : {
                                                    color: currentMessage?.user.name.includes('Admin')
                                                        ? colors.BLACK
                                                        : colors.WHITE,
                                                    borderTopLeftRadius: scale.w(2),
                                                    borderTopRightRadius: scale.w(2),
                                                    borderBottomRightRadius: scale.w(0),
                                                    borderBottomLeftRadius: scale.w(2),
                                                    paddingVertical: heightPercentageToDP(1.8),
                                                    paddingHorizontal: widthPercentageToDP(4),
                                                    marginVertical: heightPercentageToDP(1.25),
                                                    maxWidth: widthPercentageToDP(60),
                                                    alignItems: 'center',
                                                    backgroundColor: this.props.color,
                                                    opacity: currentMessage?.user.name.includes('Admin')
                                                        ? 0.6
                                                        : 1,
                                                }
                                        }
                                        text={currentMessage?.text}
                                    />
                                ) : null
                            // }
                            //     </View>
                        }
                        <Text
                            style={{
                                color: colors.CHAT_TIMER_COLOR,
                                alignSelf: 'center',
                                fontSize: scale.w(1.12),
                                fontFamily: 'Roboto-Regular',
                            }}
                        >
                            {moment(currentMessage?.createdAt).format('LT')}
                        </Text>
                    </View>
                )}
            </>
        );
    }

    _renderLoadEarlier() {
        return (
            // <Animatable.View
            //     animation="fadeIn"
            //     duration={400}
            //     style={styles.chat_picture_container}
            //     useNativeDriver
            // >
            //     <Image
            //         source={require('../../images/icon_chat_2.png')}
            //         style={[styles.chat_picture, { tintColor: this.props.color }]}
            //         resizeMode="contain"
            //     />

            //     <H4 textAlign="center" fontSize={scale.w(1.8)}>
            //         {'Here you can live chat with a\nconcierge of your hotel!'}
            //     </H4>
            // </Animatable.View>
            null
        );
    }

    _handleProcessImage(response: ImagePickerResponse) {
        if (response.didCancel || response.error || response.customButton) {
            if (__DEV__) {
                console.log('PICKER_IMAGE: ', { response });
            }
            return false;
        }
        this.setState({
            chat_image: {
                uri: response.uri,
                name: response.fileName ? response.fileName : new Date().getTime(),
                type: 'image/jpeg',
            },
        });
    }

    _openCamera() {
        ImagePicker.launchCamera(IMAGE_PICKER_OPTIONS, this._handleProcessImage);
    }

    _openLibrary() {
        ImagePicker.launchImageLibrary(IMAGE_PICKER_OPTIONS, this._handleProcessImage);
    }

    toggleModal = () => {
        this.setState({
            isvisible: !this.state.isvisible,
            chat_image: {},
        });
    };

    private onStatusPress = (e: any) => {
        const touchX = e.nativeEvent.locationX;
        console.log(`touchX: ${touchX}`);
        const playWidth =
            (this.state.currentPositionSec / this.state.currentDurationSec) * (screenWidth - 56);
        console.log(`currentPlayWidth: ${playWidth}`);

        const currentPosition = Math.round(this.state.currentPositionSec);
        console.log(`currentPosition: ${currentPosition}`);

        if (playWidth && playWidth < touchX) {
            const addSecs = Math.round(currentPosition + 1000);
            this.audioRecorderPlayer.seekToPlayer(addSecs);
            console.log(`addSecs: ${addSecs}`);
        } else {
            const subSecs = Math.round(currentPosition - 1000);
            this.audioRecorderPlayer.seekToPlayer(subSecs);
            console.log(`subSecs: ${subSecs}`);
        }
    };

    private onStartRecord = async () => {
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);

                console.log('write external stroage', grants);

                if (
                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('permissions granted');
                } else {
                    console.log('All required permissions not granted');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
        }
        this.setState({
            startRecording: true,
        });
        const audioSet: AudioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };

        console.log('audioSet', audioSet);
        //? Custom path
        // const uri = await this.audioRecorderPlayer.startRecorder(
        //   this.path,
        //   audioSet,
        // );

        //? Default path
        const uri = await this.audioRecorderPlayer.startRecorder(undefined, audioSet);

        this.audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
            console.log('record-back', e);
            this.setState({
                recordSecs: e.currentPosition,
                recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
            });
        });
        console.log(`uri: ${uri}`);
    };

    private onPauseRecord = async () => {
        try {
            await this.audioRecorderPlayer.pauseRecorder();
        } catch (err) {
            console.log('pauseRecord', err);
        }
    };

    private onResumeRecord = async () => {
        await this.audioRecorderPlayer.resumeRecorder();
    };

    private onStopRecord = async () => {
        const result = await this.audioRecorderPlayer.stopRecorder();
        this.audioRecorderPlayer.removeRecordBackListener();
        this.setState({
            recordSecs: 0,
            recordingStopped: true,
        });
        console.log('pathhhhhhhhhhhhhhhhhhhhhhhhhh is here', result);
        this.setState({
            recordedPath: result,
        });
    };

    private onStartPlay = async () => {
        console.log('onStartPlay');
        //? Custom path
        // const msg = await this.audioRecorderPlayer.startPlayer(this.path);
        this.setState({
            startPlaying: true,
        });
        //? Default path
        const msg = await this.audioRecorderPlayer.startPlayer();
        const volume = await this.audioRecorderPlayer.setVolume(1.0);
        console.log(`file: ${msg}`, `volume: ${volume}`);

        this.audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
            if (e.currentPosition === e.duration) {
                console.log('finished');
                this.audioRecorderPlayer.stopPlayer();
                this.setState({
                    recordingStopped: true,
                    startPlaying: false,
                    pausePlaying: false,
                });
            }
            this.setState({
                currentPositionSec: e.currentPosition,
                currentDurationSec: e.duration,
                playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
                duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
            });
        });
    };

    private onPausePlay = async () => {
        await this.audioRecorderPlayer.pausePlayer();
        this.setState({
            pausePlaying: true,
        });
    };

    private onResumePlay = async () => {
        await this.audioRecorderPlayer.resumePlayer();
        this.setState({
            pausePlaying: false,
        });
    };

    private onStopPlay = async () => {
        console.log('onStopPlay');
        this.audioRecorderPlayer.stopPlayer();
        this.audioRecorderPlayer.removePlayBackListener();
    };

    render() {
        const {
            chat,
            send,
            type_something,
            search_message,
            open_camrea,
            cancel,
            choose_from_library,
            are_you_sure_to_delete,
            yes,
            no,
        } = this.props.selectedLanguage;
        console.log('props in chat screen', this.props);
        console.log('this.state ============ ', this.state);
        let color = this.props.color ? this.props.color : colors.LIGHT_BLUE;
        let props_messages = [...this.props.messages, openingChatFromAdmin];
        let messageData = props_messages.filter((item) => {
            if (item.text) {
                return item.text.toLowerCase().includes(this.state.search.toLowerCase());
            }
        });
        console.log(props_messages);
        return (
            <View style={{ flex: 1 }}>
                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: heightPercentageToDP(20), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: this.props.color,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && <StatusBar backgroundColor={this.props.color}></StatusBar>}
                <RootInScrollViewForIOS>
                    <RootContainer>
                        <View style={{ height: heightPercentageToDP(100) }}>
                            <View
                                style={{
                                    height: hp(15),
                                    backgroundColor: this.props.color,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingTop: heightPercentageToDP(1),
                                }}
                            >
                                {/* <Navbar
                        tintBackColor={colors.WHITE}
                        titleColor={colors.WHITE}
                        RightIconName={'search'}
                        RightIconColor={colors.WHITE}
                        onSearchClick={() => {
                            this.setState({
                                showSearch: !this.state.showSearch,
                                search: '',
                            });
                        }}
                        onClick={this._handleBack}
                        title={chat}
                        disableBackButton
                    /> */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        height: heightPercentageToDP(7),
                                        width: widthPercentageToDP(100),
                                        paddingHorizontal: wp(5),
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    {this.state.showSearch ? (
                                        // <View
                                        // style={{
                                        //     height: heightPercentageToDP(6),
                                        //     width: widthPercentageToDP(75),
                                        //     backgroundColor: this.props.color,
                                        //     flexDirection: 'row',
                                        //     alignItems : 'center'
                                        // }}
                                        // >
                                        <TextInput
                                            placeholder={`${search_message}...`}
                                            placeholderTextColor={colors.WHITE}
                                            style={{
                                                height: heightPercentageToDP(7),
                                                width: widthPercentageToDP(70),
                                                color: colors.WHITE,
                                                borderWidth: scale.h(0.2),
                                                borderRadius: scale.h(1.0),
                                                borderColor: colors.WHITE,
                                                paddingHorizontal: scale.w(1.5),
                                            }}
                                            value={this.state.search}
                                            onChangeText={(text) => {
                                                this.setState({
                                                    search: text,
                                                });
                                            }}
                                        />
                                    ) : (
                                        // </View>
                                        <View
                                            style={{
                                                // width: scale.w(26.0),
                                                height: heightPercentageToDP(7),
                                                width: widthPercentageToDP(70),
                                                backgroundColor: this.props.color,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {this.props.from === 'restaurant' ? (
                                                <TouchableOpacity onPress={this._handleBack}>
                                                    {this.props.fromMycard ? (
                                                        <Icon color="red" size={20} name={'times'} />
                                                    ) : this.props.tintBackColor == 'black' ? (
                                                        <Image
                                                            source={require('../../images/icon_back.png')}
                                                            style={{
                                                                width: widthPercentageToDP(4),
                                                                height: widthPercentageToDP(4),
                                                                tintColor: this.props.tintBackColor,
                                                            }}
                                                            resizeMode="contain"
                                                        />
                                                    ) : (
                                                        <BackArrow
                                                            width={widthPercentageToDP(4)}
                                                            height={widthPercentageToDP(4)}
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            ) : null}

                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.setState({
                                                        modalVisible: true,
                                                        Image_URL: this.props.hotel_logo
                                                            ? { uri: this.props.hotel_logo }
                                                            : require('../../images/restaurant-sample.jpg'),
                                                    })
                                                }
                                            >
                                                <Image
                                                    resizeMode={'cover'}
                                                    source={
                                                        this.props.hotel_logo
                                                            ? { uri: this.props.hotel_logo }
                                                            : require('../../images/restaurant-sample.jpg')
                                                    }
                                                    style={{
                                                        height: heightPercentageToDP(7),
                                                        width: heightPercentageToDP(7),
                                                        borderRadius: heightPercentageToDP(7) / 2,
                                                        marginLeft: 25,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                            <View style={{ marginLeft: 15, justifyContent: 'center' }}>
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(2.0),
                                                        color: colors.WHITE,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {this.props.title
                                                        ? this.props.title
                                                        : `${this.state.chainData.data.name}`}
                                                </Text>
                                                {/* <Text
                                    style={{
                                        fontSize: scale.w(1.2),
                                        color: colors.WHITE,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {'typing...'}
                                </Text> */}
                                            </View>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        style={{ alignItems: 'center' }}
                                        onPress={() =>
                                            this.setState({
                                                showSearch: !this.state.showSearch,
                                                search: '',
                                            })
                                        }
                                    >
                                        <Search
                                            width={widthPercentageToDP(6)}
                                            height={widthPercentageToDP(6)}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View
                                style={{
                                    height: Platform.OS == 'ios' ? hp(73) : hp(77),
                                    width: wp(100),
                                    backgroundColor: colors.WHITE,
                                    top: -heightPercentageToDP(4),
                                    borderTopLeftRadius: 30,
                                    borderTopRightRadius: 30,
                                    paddingHorizontal: wp(5),
                                    // paddingTop: hp(),
                                }}
                            >
                                {!this.state.loadingTranslateMessages ? (
                                    <GiftedChat
                                        isAnimated
                                        loadEarlier
                                        messages={this.state.search ? messageData : props_messages}
                                        user={this.props.profile ? this.props.profile : undefined}
                                        // onSend={this._handleSend}
                                        // onSend={messages => this._handleSend(messages)}
                                        bottomOffset={Platform.OS == 'ios' && hp(8)}
                                        renderAvatar={() => (
                                            <View
                                                style={{
                                                    justifyContent: 'flex-start',
                                                    flex: 1,
                                                    marginTop: heightPercentageToDP(1.2),
                                                }}
                                            >
                                                <Image
                                                    source={{ uri: this.props.hotel_logo }}
                                                    style={{
                                                        height: heightPercentageToDP(4.5),
                                                        width: heightPercentageToDP(4.5),
                                                        borderRadius: 100,
                                                        // justifyContent: 'center',
                                                        // marginTop: -heightPercentageToDP(6.5),
                                                        //  position: 'absolute',
                                                    }}
                                                />
                                            </View>
                                        )}
                                        containerStyle={
                                            Platform.OS == 'android'
                                                ? {
                                                    borderTopWidth: 1,
                                                    height: 45,
                                                    marginVertical: scale.h(0),
                                                }
                                                : {
                                                    borderTopWidth: 1,
                                                }
                                        }
                                        renderBubble={this._renderBubble}
                                        renderLoadEarlier={this._renderLoadEarlier}
                                        keyboardShouldPersistTaps="handled"
                                        // renderComposer={(props) => {
                                        //     if (this.state.startRecording) {
                                        //         return (
                                        //             <View
                                        //                 style={{
                                        //                     flexDirection: 'row',
                                        //                     width:
                                        //                         this.state.recordTime != '00:00:00' &&
                                        //                         this.state.recordingStopped
                                        //                             ? '70%'
                                        //                             : '80%',
                                        //                     alignItems: 'center',
                                        //                     marginLeft: 10,
                                        //                     borderRadius: 10,
                                        //                     height: 40,
                                        //                     backgroundColor : 'red'
                                        //                 }}
                                        //             >
                                        //                 {this.state.recordingStopped ? (
                                        //                     <IonIcon
                                        //                         name="attachment"
                                        //                         style={{ marginRight: 10, opacity: 0.5 }}
                                        //                         size={18}
                                        //                         color={this.props.color}
                                        //                         onPress={() => {
                                        //                             this.toggleModal();
                                        //                         }}
                                        //                     />
                                        //                 ) : null}
                                        //                 <Text style={{ width: '70%' }}>
                                        //                     {this.state.startPlaying
                                        //                         ? this.state.playTime + '/' + this.state.recordTime
                                        //                         : this.state.recordTime}
                                        //                 </Text>
                                        //             </View>
                                        //         );
                                        //     } else {
                                        //         return (
                                        //             <View
                                        //                 style={{
                                        //                     flexDirection: 'row',
                                        //                     width: '80%',
                                        //                     alignItems: 'center',
                                        //                     marginLeft: 10,
                                        //                     borderRadius: 10,
                                        //                     height: 40,
                                        //                     backgroundColor : 'red'
                                        //                 }}
                                        //             >
                                        //                 <IonIcon
                                        //                     name="attachment"
                                        //                     style={{ marginRight: 10, opacity: 0.5 }}
                                        //                     size={18}
                                        //                     color={this.props.color}
                                        //                     onPress={() => {
                                        //                         this.toggleModal();
                                        //                     }}
                                        //                 />
                                        //                 <TextInput
                                        //                     style={{ width: '70%' }}
                                        //                     value={this.state.message}
                                        //                     placeholder={type_something}
                                        //                     onChangeText={(message) => this.setState({ message })}
                                        //                 />
                                        //             </View>
                                        //         );
                                        //                 }
                                        // }}
                                        renderInputToolbar={
                                            () => (
                                                <KeyboardAvoidingView>
                                                    <View style={{ height: hp(5) }}>
                                                        <DropShadow
                                                            style={{
                                                                shadowOffset: {
                                                                    width: 0,
                                                                    height: 6,
                                                                },
                                                                shadowColor: colors.BLACK,
                                                                shadowOpacity: 0.05,
                                                                shadowRadius: 14,
                                                                paddingTop: heightPercentageToDP(0.25),
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    backgroundColor: colors.WHITE,
                                                                    borderRadius: scale.w(10),
                                                                    alignSelf: 'center',
                                                                    justifyContent: 'center',
                                                                    paddingHorizontal: wp(5),
                                                                    paddingVertical:
                                                                        heightPercentageToDP(0.5),
                                                                }}
                                                            >
                                                                {this.state.startRecording ? (
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            width: this.state.recordingStopped
                                                                                ? widthPercentageToDP(60)
                                                                                : widthPercentageToDP(70),
                                                                            alignItems: 'center',
                                                                            borderRadius: 10,
                                                                            height: 40,
                                                                        }}
                                                                    >
                                                                        {this.state.recordingStopped ? (
                                                                            <IonIcon
                                                                                name="attachment"
                                                                                style={{
                                                                                    marginRight: 10,
                                                                                    opacity: 0.5,
                                                                                }}
                                                                                size={18}
                                                                                color={this.props.color}
                                                                                onPress={() => {
                                                                                    this.toggleModal();
                                                                                }}
                                                                            />
                                                                        ) : null}
                                                                        <Text style={{ width: '70%' }}>
                                                                            {this.state.startPlaying
                                                                                ? this.state.playTime +
                                                                                '/' +
                                                                                this.state.recordTime
                                                                                : this.state.recordTime}
                                                                        </Text>
                                                                    </View>
                                                                ) : (
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            width: this.state.startRecording
                                                                                ? widthPercentageToDP(60)
                                                                                : widthPercentageToDP(70),
                                                                            alignItems: 'center',
                                                                            borderRadius: 10,
                                                                            height: 40,
                                                                        }}
                                                                    >
                                                                        <TouchableOpacity
                                                                            onPress={this.toggleModal}
                                                                            style={{
                                                                                justifyContent: 'center',
                                                                            }}
                                                                        >
                                                                            <Attach
                                                                                height={scale.w(2)}
                                                                                width={scale.w(2)}
                                                                            ></Attach>
                                                                        </TouchableOpacity>
                                                                        <View
                                                                            style={{
                                                                                width: widthPercentageToDP(2),
                                                                            }}
                                                                        />
                                                                        <TextInput
                                                                            style={{
                                                                                width: widthPercentageToDP(
                                                                                    57,
                                                                                ),
                                                                            }}
                                                                            value={this.state.message}
                                                                            placeholder={type_something}
                                                                            onChangeText={(message) =>
                                                                                this.setState({ message })
                                                                            }
                                                                        />
                                                                    </View>
                                                                )}
                                                                {/* {this.state.recordTime != '00:00:00' && this.state.recordingStopped ? (
                                                            <IonIcon
                                                                name="cross"
                                                                style={{ marginRight: 10, opacity: 0.5, alignSelf: 'center' }}
                                                                size={18}
                                                                color={'red'}
                                                                onPress={() =>
                                                                    this.setState({
                                                                        recordSecs: 0,
                                                                        recordTime: '00:00:00',
                                                                        currentPositionSec: 0,
                                                                        currentDurationSec: 0,
                                                                        playTime: '00:00:00',
                                                                        duration: '00:00:00',
                                                                        startRecording: false,
                                                                        recordingStopped: false,
                                                                        startPlaying: false,
                                                                        pausePlaying: false,
                                                                        recordedPath: '',
                                                                    })
                                                                }
                                                            />
                                                        ) : null}
                                                        {this.state.startRecording == true ? (
                                                            this.state.recordingStopped ? (
                                                                this.state.startPlaying ? (
                                                                    this.state.pausePlaying ? (
                                                                        <IonIcon
                                                                            name="controller-play"
                                                                            style={{
                                                                                marginRight: 10,
                                                                                opacity: 0.5,
                                                                                alignSelf: 'center',
                                                                            }}
                                                                            size={20}
                                                                            color={'black'}
                                                                            onPress={this.onResumePlay}
                                                                        />
                                                                    ) : (
                                                                        <FIcon
                                                                            name="pause"
                                                                            style={{
                                                                                marginRight: 10,
                                                                                opacity: 0.5,
                                                                                alignSelf: 'center',
                                                                            }}
                                                                            size={20}
                                                                            color={'black'}
                                                                            onPress={this.onPausePlay}
                                                                        />
                                                                    )
                                                                ) : (
                                                                    <IonIcon
                                                                        name="controller-play"
                                                                        style={{
                                                                            marginRight: 10,
                                                                            opacity: 0.5,
                                                                            alignSelf: 'center',
                                                                        }}
                                                                        size={20}
                                                                        color={'black'}
                                                                        onPress={this.onStartPlay}
                                                                    />
                                                                )
                                                            ) : (
                                                                <IonIcon
                                                                    name="controller-stop"
                                                                    style={{ marginRight: 10, alignSelf: 'center' }}
                                                                    size={18}
                                                                    color={'red'}
                                                                    onPress={this.onStopRecord}
                                                                />
                                                            )
                                                        ) : (
                                                            <>
                                                                <TouchableOpacity onPress={this.onStartRecord} style={{
                                                                    justifyContent: 'center'
                                                                }}                                    >
                                                                    <Mic height={scale.w(2)} width={scale.w(2)}></Mic>
                                                                </TouchableOpacity>

                                                                <View style={{ width: widthPercentageToDP(2) }} />
                                                            </>
                                                        )} */}
                                                                <>
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                            if (
                                                                                this.state.message == '' ||
                                                                                this.state.message == null
                                                                            ) {
                                                                                toast(
                                                                                    this.props
                                                                                        .selectedLanguage
                                                                                        .please_type_something_to_send,
                                                                                );
                                                                                return 0;
                                                                            }
                                                                            if (
                                                                                this.state.message !== '' ||
                                                                                (this.state.recordTime !=
                                                                                    '00:00:00' &&
                                                                                    this.state
                                                                                        .recordingStopped)
                                                                            ) {
                                                                                this._handleSend([
                                                                                    {
                                                                                        createdAt: new Date(),
                                                                                        text: this.state
                                                                                            .message,
                                                                                        user: {
                                                                                            ...this.props
                                                                                                .profile,
                                                                                        },
                                                                                        _id: new Date().getTime(),
                                                                                    },
                                                                                ]);
                                                                                this.setState({
                                                                                    message: '',
                                                                                });
                                                                            }
                                                                        }}
                                                                        style={{
                                                                            justifyContent: 'center',
                                                                        }}
                                                                    >
                                                                        <Send
                                                                            height={scale.w(2)}
                                                                            width={scale.w(2)}
                                                                            fill={this.props.color}
                                                                        ></Send>
                                                                    </TouchableOpacity>
                                                                </>
                                                            </View>
                                                        </DropShadow>
                                                    </View>
                                                </KeyboardAvoidingView>
                                            )
                                            // </Send>
                                        }
                                    />
                                ) : (
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '100%',
                                        }}
                                    >
                                        <ActivityIndicator color={colors}></ActivityIndicator>
                                    </View>
                                )}
                                {/* <KeyboardAvoidingView
                        keyboardVerticalOffset={32}
                        behavior="padding"
                        enabled={Platform.OS === 'android'}
                    /> */}
                            </View>
                        </View>
                    </RootContainer>
                    <View
                        style={{
                            position: 'absolute',
                            width: wp(100),
                            height: Platform.OS == 'android' ? '100%' : null,
                            bottom: Platform.OS == 'android' ? null : 0,
                            justifyContent: 'flex-end',
                        }}
                    >
                        <BottomBar
                            // onChatPress={this._handleChat}
                            onHomePress={this._handleOnHomePress}
                            profile={false}
                            home={true}
                            backgroundColor={this.props.color}
                            countUnreadMessage={this.props.isCheckedIn ? this.props.countUnreadMessage : 0}
                            onAccount={this._handleAccount}
                            onPromoClick={() => {
                                this.props.toggleIsInChatScreen(false);
                                this.props.updateTotalUnreadMessageSuccess(0);
                                Navigation.mergeOptions(this.props.componentId, {
                                    bottomTabs: {
                                        currentTabIndex: 2,
                                    },
                                });
                            }}
                            checkWindow={'chat'}
                            title={this.props.selectedLanguage.chat}
                        />
                    </View>
                </RootInScrollViewForIOS>
                <Modal onRequestClose={() => { }} transparent={true} visible={this.state.isvisible}>
                    <TouchableHighlight
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#fff',
                                // paddingTop: scale.h(20),
                                paddingHorizontal: widthPercentageToDP(3.0),
                            }}
                        >
                            {!this.state.chat_image.uri ? (
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <View
                                        style={{
                                            height: heightPercentageToDP(60),
                                        }}
                                    >
                                        <View style={{}}>
                                            <ButtonPrimary
                                                backgroundColor={this.props.color}
                                                onPress={this._openLibrary}
                                                text={choose_from_library}
                                                chainData={this.props.chainData}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <ButtonPrimary
                                                backgroundColor={this.props.color}
                                                onPress={this._openCamera}
                                                text={open_camrea}
                                                chainData={this.props.chainData}
                                            />
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.toggleModal();
                                            }}
                                            style={{
                                                alignSelf: 'center',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5,
                                                borderRadius: 10,
                                                marginTop: heightPercentageToDP(3),
                                            }}
                                        >
                                            <H2 color={this.props.color}>{cancel}</H2>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <View
                                        style={{
                                            height: heightPercentageToDP(80),
                                            width: widthPercentageToDP(80),
                                            borderRadius: scale.h(2),
                                            alignSelf: 'center',
                                            marginTop: heightPercentageToDP(5),
                                        }}
                                    >
                                        <Image
                                            resizeMode="cover"
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                borderRadius: scale.h(3),
                                            }}
                                            source={{ uri: this.state.chat_image.uri }}
                                        />
                                    </View>
                                    {this.state.isLoading ? (
                                        <ActivityIndicator color={this.props.color} size={'large'} />
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.uploadImage();
                                            }}
                                            style={{
                                                alignSelf: 'center',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5,
                                                borderRadius: 10,
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2 color={this.props.color}>{send}</H2>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.toggleModal();
                                        }}
                                        style={{
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginLeft: 5,
                                            borderRadius: 10,
                                            marginTop: heightPercentageToDP(2),
                                        }}
                                    >
                                        <H2 color={this.props.color}>{cancel}</H2>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>
                    </TouchableHighlight>
                </Modal>

                <Modal transparent={true} visible={this.state.zooomModal}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgb(0, 0, 0)',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                height: '100%',
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                marginHorizontal: 10,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    height: '100%',
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                    }}
                                >
                                    <ImageZoom
                                        cropWidth={wp(100)}
                                        cropHeight={hp(100)}
                                        imageWidth={wp(100)}
                                        imageHeight={hp(100)}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            source={{ uri: this.state.image_url }}
                                            style={{
                                                alignContent: 'center',
                                                width: '100%',
                                                height: hp('100%'),
                                                resizeMode: 'contain',
                                                alignSelf: 'center',
                                            }}
                                        ></Image>
                                        <Text>hellllooooo</Text>
                                    </ImageZoom>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                height: '10%',
                                alignSelf: 'flex-start',
                                paddingLeft: wp(3.5),
                                top: heightPercentageToDP(5),
                            }}
                        >
                            <TouchableOpacity
                                style={{}}
                                onPress={() => {
                                    this.setModalVisible(false);
                                }}
                            >
                                <Image
                                    source={require('../../images/icon_back.png')}
                                    style={{ width: widthPercentageToDP(5), height: widthPercentageToDP(5) }}
                                    resizeMode={'contain'}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal transparent={true} visible={this.state.showDeleteModal}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0, 0, 0,0.8)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: scale.w(320),
                                height: scale.h(200),
                                backgroundColor: 'white',
                                borderRadius: scale.h(10),
                                paddingHorizontal: scale.w(20),
                            }}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: scale.h(80),
                                }}
                            >
                                <H3 alignSelf={'center'} fontSize={18}>
                                    {are_you_sure_to_delete}
                                </H3>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    height: scale.h(120),
                                    paddingTop: scale.h(30),
                                }}
                            >
                                <View
                                    style={{
                                        width: scale.w(130),
                                        height: scale.h(30),
                                    }}
                                >
                                    <ButtonPrimary
                                        backgroundColor={this.props.color}
                                        onPress={() => {
                                            this.setState({
                                                showDeleteModal: false,
                                            });
                                        }}
                                        text={no}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                                <View
                                    style={{
                                        width: scale.w(130),
                                        height: scale.h(30),
                                    }}
                                >
                                    <ButtonPrimary
                                        backgroundColor={this.props.color}
                                        onPress={() => {
                                            this.deleteChatMessage();
                                            this.setState({
                                                showDeleteModal: false,
                                            });
                                        }}
                                        text={yes}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* </>
                </View> */}

                <ImageZoomModal
                    modalVisible={this.state.modalVisible}
                    onBack={() => this.setState({ modalVisible: false })}
                    onBackDrop={() => this.setState({ modalVisible: false })}
                    Image={this.state.Image_URL}
                    onBackArrow={() => this.setState({ modalVisible: false })}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    chat_picture_container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale.w(2.2),
        marginBottom: scale.w(2.4),
    },
    chat_picture: {
        height: scale.w(13.2),
        width: scale.w(13.2),
        alignSelf: 'center',
    },
    chat_bubble_container: {
        borderTopRightRadius: scale.w(2),
        borderBottomRightRadius: scale.w(2),
        borderBottomLeftRadius: scale.w(2),

        paddingVertical: heightPercentageToDP(1.8),
        paddingHorizontal: widthPercentageToDP(4),
        marginVertical: heightPercentageToDP(1.25),
        maxWidth: '70%',
        backgroundColor: colors.ADMIN_CHAT,
    },
    admin_chat_bubble_container: {
        borderTopLeftRadius: scale.w(2),
        borderTopRightRadius: scale.w(2),
        borderBottomRightRadius: scale.w(0),
        borderBottomLeftRadius: scale.w(2),
        paddingVertical: heightPercentageToDP(1.8),
        paddingHorizontal: widthPercentageToDP(4),
        marginVertical: heightPercentageToDP(1.25),
        maxWidth: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    navbar: {
        minHeight: scale.h(6.8) + extraPad[phoneType()].top,
        paddingTop: extraPad[phoneType()].top + scale.w(2.5),
    },
    btn_back_container: {
        width: scale.w(5.0),
        height: scale.w(3.6),
        justifyContent: 'center',
        paddingLeft: scale.w(1.0),
        borderTopRightRadius: scale.w(1.8),
        borderBottomRightRadius: scale.w(1.8),
    },
    btn_back_absolute: {
        position: 'absolute',
        left: 0,
        top: scale.h(5),
        bottom: 0,
        justifyContent: 'flex-start',
        paddingTop: scale.h(1.2),
    },
    title_container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: scale.w(5.5),
        paddingTop: scale.w(0.5),
    },
});

export default Chat;
