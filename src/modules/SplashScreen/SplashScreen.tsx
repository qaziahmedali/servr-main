import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Alert,
    Linking,
    AppState,
    Text,
    TouchableOpacity,
    ImageBackground,
    Animated,
    StatusBar,
} from 'react-native';
import { ISplashScreenReduxProps } from './SplashScreen.Container';
import { View as ViewAnimatable } from 'react-native-animatable';
import colors from '../../constants/colors';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../utils/dimensions';
import { H1, H3 } from '../_global/Text';
import { Navigation } from 'react-native-navigation';
import { languages } from '../_global/languages';
import {
    checkin,
    cleaningRequestComplete,
    latecheckout,
    mainmenu,
    orderroomservice,
    pickHotel,
    promotionapplied,
    restoMain,
    spaservicedetail,
    splashgetstart,
} from '../../utils/navigationControl';
import { GET_RESTAURANT_CATEGORY_DISH } from '../../types/action.restaurant';
import checkVersion from 'react-native-store-version';
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';
import { orderRoomService } from '../../actions/action.restaurant';
import CustomModal from '../_global/CustomModal';
import NetInfo, { fetch } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import { Easing } from 'react-native-reanimated';
import AttentionModal from '../_global/AttentionModal';
import { createChannel } from '../../utils/handleLogic';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import { delay } from 'rxjs';

import { getBaseUrl } from '../../constants/tempFile';

interface ISplashScreenProps extends ISplashScreenReduxProps {
    componentId: string;
    primaryColor: string;
}

interface ISplashScreenState {
    appState: any;
    bottomButtonShow: any;
    //imageSource: any;
    noInternet: boolean;
    checker: boolean;
    nameValue: number;
    // eValue: number;
    // rValue: number;
    // vValue: number;
    // erValue: number;
    bottomBarMargin: number;
    visible: boolean;
    disableGetStarted: boolean;
}

class SplashScreen extends PureComponent<ISplashScreenProps, ISplashScreenState> {
    private _modal = React.createRef<CustomModal>();
    constructor(props: ISplashScreenProps) {
        super(props);
        // Navigation.setDefaultOptions({
        //     animations: {
        //         setStackRoot: {
        //             waitForRender: true,
        //         },
        //     },
        // });

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: colors.BLUE,
                style: 'light',
            },
        });
        this.toggleModal = this.toggleModal.bind(this);
    }

    state = {
        bottomButtonShow: true,
        checker: false,
        nameValue: 0,
        // eValue: 0,
        // rValue: 0,
        // vValue: 0,
        // erValue: 0,
        appState: AppState.currentState,
        //imageSource: require('../../images/splash.gif'),
        token: this.props.token && this.props.token != '' ? this.props.token : false,
        noInternet: false,
        wordsMarginTop: new Animated.Value(-heightPercentageToDP(5)),
        nameWordStyle: new Animated.Value(0), // Initial value for opacity: 0
        // eWordStyle: new Animated.Value(0),
        // rWordStyle: new Animated.Value(0),
        // vWordStyle: new Animated.Value(0),
        // erWordStyle: new Animated.Value(0),
        bottomBarMargin: new Animated.Value(heightPercentageToDP(11)),
        visible: false,
        disableGetStarted: true,
    };

    toggleModal = () => {
        Linking.openURL('https://play.google.com/store/apps/details?id=com.servr');
    };

    async componentDidMount() {
        // AppState.addEventListener('change', this._handleAppStateChange);
        this.props.getChainData();
        // this.props.getHotelTaxes(this.props.idHotel);

        // this.state.sWordStyle.addListener(({ value }) => this.setState({ value: value }));
        // Animated.timing(this.state.sWordStyle, {
        //     toValue: scale.w(9.2),
        //     duration: 500,
        //     easing: Easing.back(),
        //     useNativeDriver: false,
        // }).start();

        // setTimeout(() => {
        //     this.state.eWordStyle.addListener(({ value }) => this.setState({ eValue: value }));
        //     Animated.timing(this.state.eWordStyle, {
        //         toValue: scale.w(9.2),
        //         duration: 500,
        //         easing: Easing.back(),
        //         useNativeDriver: false,
        //     }).start();
        // }, 500);

        // setTimeout(() => {
        //     this.state.rWordStyle.addListener(({ value }) => this.setState({ rValue: value }));
        //     Animated.timing(this.state.rWordStyle, {
        //         toValue: scale.w(9.2),
        //         duration: 500,
        //         easing: Easing.back(),
        //         useNativeDriver: false,
        //     }).start();
        // }, 1000);

        // setTimeout(() => {
        //     this.state.vWordStyle.addListener(({ value }) => this.setState({ vValue: value }));
        //     Animated.timing(this.state.vWordStyle, {
        //         toValue: scale.w(9.2),
        //         duration: 500,
        //         easing: Easing.back(),
        //         useNativeDriver: false,
        //     }).start();
        // }, 1500);

        // setTimeout(() => {
        //     this.state.erWordStyle.addListener(({ value }) => this.setState({ erValue: value }));
        //     Animated.timing(this.state.erWordStyle, {
        //         toValue: scale.w(9.2),
        //         duration: 500,
        //         easing: Easing.back(),
        //         useNativeDriver: false,
        //     }).start();
        // }, 2000);
        if (this.state.token == false) {
            setTimeout(() => {
                Animated.timing(this.state.wordsMarginTop, {
                    toValue: -heightPercentageToDP(15),
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }).start();
            }, 3000);
        }
        setTimeout(() => {
            Animated.timing(this.state.bottomBarMargin, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        }, 3000);
        this.updateLanguage();
        const currentAppVersion = DeviceInfo.getVersion();
        try {
            const check = await checkVersion({
                version: currentAppVersion, // app local version
                iosStoreURL: 'https://apps.apple.com/us/app/servr/id1473118642?ls=1',
                androidStoreURL: 'https://play.google.com/store/apps/details?id=com.servr',
                country: 'pk', // default value is 'jp'
            });

            this.props.appUpdate(
                () => {
                    this.setState({
                        disableGetStarted: false,
                    });
                    if (check.result === 'new' && this.props.app_update == 1) {
                        this.props.getHotelList();
                        if (this.props.isCheckedIn) {
                            this.props.getProfile(this.props.token, this.props.codeHotel, () => {
                                if (this.props.profile.reference) {
                                    PushNotification.cancelAllLocalNotifications();
                                    createChannel(this.props.profile.reference);
                                }
                            });
                        }
                        console.log('outer in checked in');

                        this.setState({
                            visible: true,
                        });
                    } else {
                        if (this.props.isCheckedIn) {
                            this.props.getProfile(
                                this.props.token,
                                this.props.codeHotel,
                                () => {
                                    if (this.props.profile.reference) {
                                        PushNotification.cancelAllLocalNotifications();
                                        createChannel(this.props.profile.reference);
                                    }
                                },
                                () => {
                                    console.log('failed for get profile');
                                },
                            );
                        }

                        // setTimeout(async () => {
                        // if (this.props.isHotelPicked && this.props.isCheckedIn) {
                        //     return Navigation.setRoot({ root: mainmenu });
                        // }
                        // if (
                        //     this.props.type == 'resto' &&
                        //     this.props.restoGuest?.id != undefined &&
                        //     this.props.restoGuest?.id != null &&
                        //     this.props.restoGuest?.id != ''
                        // ) {
                        //     // console.log(this.props.type,this.props.restoGuest.id)

                        //     // console.log('herer')
                        //     // console.log(this.props)
                        //     // this.props.restoBookATableSuccessAccessToken(this.props.access_token)
                        //     return Navigation.setRoot({
                        //         root: restoMain({
                        //             restaurant: this.props.resto,
                        //             color: this.props.color,
                        //             selectedLanguage: this.props.selectedLanguage,
                        //             type: this.props.type,
                        //             restoGuest: this.props.restoGuest,
                        //         }),
                        //     });
                        // }
                        // if (this.props.profile.email != undefined && this.props.profile.email != null) {
                        //     return Navigation.setRoot({ root: mainmenu });
                        // }

                        this.setState({ bottomButtonShow: true });
                        NetInfo.fetch()
                            .then((state) => {
                                if (state.isConnected == true) {
                                    this.props.appUpdate(
                                        () => {
                                            if (this.props.app_update == 1 && check.result == 'new') {
                                                this.setState({
                                                    visible: true,
                                                });
                                            } else {
                                                if (this.state.token) {
                                                    this.props.getProfile(
                                                        this.props.token,
                                                        this.props.codeHotel,
                                                        () => {
                                                            if (this.props.profile.reference) {
                                                                PushNotification.cancelAllLocalNotifications();
                                                                createChannel(this.props.profile.reference);
                                                            }
                                                            Navigation.setRoot({
                                                                root: {
                                                                    bottomTabs: {
                                                                        id: 'BOTTOM_TABS_LAYOUT',
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
                                                        },
                                                        () => {
                                                            Navigation.setRoot({ root: pickHotel });
                                                        },
                                                    );
                                                } else {
                                                    this.props.getHotelList();
                                                    setTimeout(() => {
                                                        this._modal.current?.show();
                                                    }, 1500);
                                                }
                                            }
                                        },
                                        () => {
                                            // Navigation.setRoot({ root: pickHotel });
                                            console.log('This is failed on app update');
                                        },
                                    );
                                } else {
                                    this.setState({
                                        noInternet: true,
                                    });
                                }
                            })
                            .catch((error) => console.log('Net Info error    ', error));
                    }
                },
                () => {
                    console.log('App update function failed');
                },
            );
        } catch (e: any) {
            console.log(e.message);
            if (e.message == 'Network request failed') {
                this.setState({
                    noInternet: true,
                });
            }
        }
    }

    async updateLanguage() {
        if (this.props.selectedLanguage.lang == 'english') {
            await this.props.selectLanguage(languages.english);
        } else if (this.props.selectedLanguage.lang == 'spanish') {
            await this.props.selectLanguage(languages.spanish);
        } else if (this.props.selectedLanguage.lang == 'french') {
            await this.props.selectLanguage(languages.french);
        } else if (this.props.selectedLanguage.lang == 'russian') {
            await this.props.selectLanguage(languages.russian);
        } else if (this.props.selectedLanguage.lang == 'chinese') {
            await this.props.selectLanguage(languages.chinese);
        } else if (this.props.selectedLanguage.lang == 'italian') {
            await this.props.selectLanguage(languages.italian);
        } else if (this.props.selectedLanguage.lang == 'hebrew') {
            await this.props.selectLanguage(languages.hebrew);
        } else if (this.props.selectedLanguage.lang == 'arabic') {
            await this.props.selectLanguage(languages.arabic);
        } else if (this.props.selectedLanguage.lang == 'indonesian') {
            await this.props.selectLanguage(languages.indonesian);
        } else if (this.props.selectedLanguage.lang == 'dutch') {
            await this.props.selectLanguage(languages.dutch);
        } else if (this.props.selectedLanguage.lang == 'german') {
            await this.props.selectLanguage(languages.german);
        } else if (this.props.selectedLanguage.lang == 'japanese') {
            await this.props.selectLanguage(languages.japanese);
        } else if (this.props.selectedLanguage.lang == 'portugese') {
            await this.props.selectLanguage(languages.portugese);
        }
    }

    Reload() {
        this.setState({
            noInternet: false,
        });
        setTimeout(() => {
            NetInfo.fetch()
                .then(async (state) => {
                    console.log('Connection type', state.type);
                    console.log('Is connected?', state.isConnected);
                    if (state.isConnected == true) {
                        this.props.appUpdate(
                            () => {
                                if (this.props.app_update == 1 && check.result == 'new') {
                                    Alert.alert(
                                        'Important Update',
                                        'There is an important update in ap, so ou must need to update the app for using it flawlessly',
                                        [
                                            {
                                                text: 'Update',
                                                onPress: () => {
                                                    Linking.openURL(
                                                        'https://play.google.com/store/apps/details?id=com.servr',
                                                    );
                                                },
                                            },
                                        ],
                                    );
                                } else {
                                    if (this.state.token) {
                                        this.props.getProfile(
                                            this.props.token,
                                            this.props.codeHotel,
                                            () => {
                                                Navigation.setRoot({ root: mainmenu });
                                            },
                                            () => {
                                                Navigation.setRoot({ root: pickHotel });
                                            },
                                        );
                                    } else {
                                        this.props.getHotelList();
                                        setTimeout(() => {
                                            this._modal.current?.show();
                                        }, 1500);
                                    }
                                }
                            },
                            () => {
                                Navigation.setRoot({ root: pickHotel });
                                console.log('hello this is failed on app update');
                            },
                        );
                    } else {
                        this.setState({
                            noInternet: true,
                        });
                    }
                })
                .catch((error) => console.log('Net Info error    ', error));
        }, 2000);
    }
    // myfun() {
    //     setTimeout(() => {
    //         Alert.alert('I am appearing...', 'After 2 seconds!');
    //     }, 2000);
    // }
    // componentWillUnmount() {
    //     AppState.removeEventListener('change', this._handleAppStateChange);
    // }
    // _handleAppStateChange = async (nextAppState) => {
    //     if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    //         const currentAppVersion = DeviceInfo.getVersion();
    //         try {
    //             const check = await checkVersion({
    //                 version: currentAppVersion, // app local version
    //                 iosStoreURL: 'ios app store url',
    //                 androidStoreURL: 'https://play.google.com/store/apps/details?id=com.servr',
    //                 country: 'pk', // default value is 'jp'
    //             });

    //             if (check.result === 'new') {
    //                 if (this.props.isHotelPicked) {
    //                     this.props.getHotelDetail(this.props.codeHotel);
    //                 }

    //                 if (this.props.isCheckedIn) {
    //                     this.props.getProfile();
    //                 }
    //                 Alert.alert(
    //                     'App Update',
    //                     'An update for this app is available, would you like to update?',
    //                     [
    //                         {
    //                             text: 'Update',
    //                             onPress: () => {
    //                                 Linking.openURL(
    //                                     'https://play.google.com/store/apps/details?id=com.servr',
    //                                 );
    //                             },
    //                         },
    //                     ],
    //                 );
    //             } else {
    //                 console.log('splash screen props', this.props);
    //                 if (this.props.isHotelPicked) {
    //                     this.props.getHotelDetail(this.props.codeHotel);
    //                 }

    //                 if (this.props.isCheckedIn) {
    //                     this.props.getProfile();
    //                 }

    //                 setTimeout(() => {
    //                     if (this.props.isHotelPicked && this.props.isCheckedIn) {
    //                         return Navigation.setRoot({ root: mainmenu });
    //                     }
    //                     if (
    //                         this.props.type == 'resto' &&
    //                         this.props.restoGuest?.id != undefined &&
    //                         this.props.restoGuest?.id != null &&
    //                         this.props.restoGuest?.id != ''
    //                     ) {
    //                         // console.log(this.props.type,this.props.restoGuest.id)

    //                         // console.log('herer')
    //                         // console.log(this.props)
    //                         // this.props.restoBookATableSuccessAccessToken(this.props.access_token)
    //                         return Navigation.setRoot({
    //                             root: restoMain({
    //                                 restaurant: this.props.resto,
    //                                 color: this.props.color,
    //                                 selectedLanguage: this.props.selectedLanguage,
    //                                 type: this.props.type,
    //                                 restoGuest: this.props.restoGuest,
    //                             }),
    //                         });
    //                     }
    //                     if (this.props.profile.email != undefined && this.props.profile.email != null) {
    //                         return Navigation.setRoot({ root: mainmenu });
    //                     }

    //                     Navigation.setRoot({ root: pickHotel });
    //                 }, 4000);
    //             }
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }

    //     this.setState({ appState: nextAppState });
    // };

    // continueLogin() {
    //     console.log('splash screen props', this.props);

    //     if (this.props.isHotelPicked) {
    //         this.props.getHotelDetail(this.props.codeHotel);
    //     }

    //     if (this.props.isCheckedIn) {
    //         this.props.getProfile();
    //     }
    //     if (this.props.isHotelPicked && this.props.isCheckedIn) {
    //         return Navigation.setRoot({ root: mainmenu });
    //     }
    //     if (
    //         this.props.type == 'resto' &&
    //         this.props.restoGuest?.id != undefined &&
    //         this.props.restoGuest?.id != null &&
    //         this.props.restoGuest?.id != ''
    //     ) {
    //         // console.log(this.props.type,this.props.restoGuest.id)

    //         // console.log('herer')
    //         // console.log(this.props)
    //         // this.props.restoBookATableSuccessAccessToken(this.props.access_token)
    //         return Navigation.setRoot({
    //             root: restoMain({
    //                 restaurant: this.props.resto,
    //                 color: this.props.color,
    //                 selectedLanguage: this.props.selectedLanguage,
    //                 type: this.props.type,
    //                 restoGuest: this.props.restoGuest,
    //             }),
    //         });
    //     }
    //     if (this.props.profile.email != undefined && this.props.profile.email != null) {
    //         return Navigation.setRoot({ root: mainmenu });
    //     }

    //     Navigation.setRoot({ root: pickHotel });
    // }

    render() {
        if (this.props)
            if (this.state.noInternet == true) {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <StatusBar backgroundColor={colors.BLUE}></StatusBar>
                        <Text style={{ fontSize: scale.w(1.6), fontWeight: 'bold' }}>
                            {'Connection Problem'}
                        </Text>
                        <Text
                            style={{
                                fontSize: scale.w(1.6),
                                paddingHorizontal: widthPercentageToDP(10),
                                textAlign: 'center',
                                marginTop: 10,
                            }}
                        >
                            {'There is no internet connection. Click to try again'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.Reload()}
                            style={{ paddingVertical: 10, width: widthPercentageToDP(60) }}
                        >
                            <Text
                                style={{
                                    color: colors.BLUE,
                                    fontWeight: 'bold',
                                    marginTop: 20,
                                    fontSize: 18,
                                    textAlign: 'center',
                                }}
                            >
                                Retry
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            } else if (this.state.token == false) {
                return (
                    <ImageBackground
                        style={{
                            flex: 1,
                        }}
                        resizeMode="cover"
                        source={{
                            uri: this.props.chainData.data.splash_screen,
                        }}
                        //source={require('../../images/splashBG.png')}
                    >
                        <StatusBar backgroundColor={colors.BLUE}></StatusBar>
                        <Animated.View
                            //   iterationDelay={6000}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                                marginTop: this.state.wordsMarginTop,
                            }}
                        >
                            {/* {this.state.nameValue > 0 &&
                                this.state?.chainData?.data?.name
                                    ?.split('')
                                    ?.map((item: string, index: number) => {
                                        <Animated.View style={{ height: this.state.nameWordStyle }}>
                                            <Animated.Text
                                                style={{
                                                    // fontSize: this.state.sWordStyle,
                                                    color: colors.WHITE,
                                                    fontFamily: 'Harabara',
                                                    fontSize: scale.w(8.5),
                                                    paddingHorizontal: widthPercentageToDP(0.3),
                                                }}
                                            >
                                                {item}
                                            </Animated.Text>
                                        </Animated.View>;
                                    })} */}
                            {
                                // <Animated.View style={{ height: this.state.nameWordStyle, borderWidth: 1 }}>
                                <Text
                                    style={{
                                        // fontSize: this.state.sWordStyle,
                                        color: colors.WHITE,
                                        fontFamily: 'Harabara',
                                        fontSize: scale.w(8.5),
                                        textTransform: 'capitalize',
                                        paddingHorizontal: widthPercentageToDP(0.3),
                                    }}
                                >
                                    {this.props?.chainData?.data?.name}
                                </Text>
                                //</Animated.View>
                            }

                            {/* {this.state.nameValue > 0 ? (
                                <Animated.View style={{ height: this.state.nameWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: colors.WHITE,
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                            marginHorizontal: -3,
                                            letterSpacing: 3,
                                        }}
                                    >
                                        e
                                    </Animated.Text>
                                </Animated.View>
                            ) : (
                                <Animated.View style={{ height: this.state.nameWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: 'transparent',
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                            marginHorizontal: -3,
                                            letterSpacing: 3,
                                        }}
                                    >
                                        e
                                    </Animated.Text>
                                </Animated.View>
                            )} */}
                            {/* {this.state.rValue > 0 ? (
                                <Animated.View style={{ height: this.state.rWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: colors.WHITE,
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        r
                                    </Animated.Text>
                                </Animated.View>
                            ) : (
                                <Animated.View style={{ height: this.state.rWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: 'transparent',
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        r
                                    </Animated.Text>
                                </Animated.View>
                            )}
                            {this.state.vValue > 0 ? (
                                <Animated.View style={{ height: this.state.vWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: colors.WHITE,
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        v
                                    </Animated.Text>
                                </Animated.View>
                            ) : (
                                <Animated.View style={{ height: this.state.vWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: 'transparent',
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        v
                                    </Animated.Text>
                                </Animated.View>
                            )}
                            {this.state.erValue > 0 ? (
                                <Animated.View style={{ height: this.state.erWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: colors.WHITE,
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        r
                                    </Animated.Text>
                                </Animated.View>
                            ) : (
                                <Animated.View style={{ height: this.state.erWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                            color: 'transparent',
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                        }}
                                    >
                                        r
                                    </Animated.Text> 
                                </Animated.View>
                            )}*/}
                            {/* <Animated.View style={{ height: this.state.eWordStyle }}>
                                <Animated.Text
                                    style={{
                                        // fontSize: this.state.sWordStyle,
                                        color: colors.WHITE,
                                        fontFamily: 'Harabara-Regular',
                                        fontSize: scale.w(70),
                                    }}
                                >
                                    e
                                </Animated.Text>
                            </Animated.View> */}
                            {/* <Animated.View style={{ height: this.state.rWordStyle }}>
                                <Animated.Text
                                    style={{
                                        // fontSize: this.state.sWordStyle,
                                        color: colors.WHITE,
                                        fontFamily: 'Harabara-Regular',
                                        fontSize: scale.w(70),
                                    }}
                                >
                                    r
                                </Animated.Text>
                            </Animated.View> */}
                            {/* <Animated.View style={{ height: this.state.vWordStyle }}>
                                <Animated.Text
                                    style={{
                                        // fontSize: this.state.sWordStyle,
                                        color: colors.WHITE,
                                        fontFamily: 'Harabara-Regular',
                                        fontSize: scale.w(70),
                                    }}
                                >
                                    v
                                </Animated.Text>
                            </Animated.View>
                            <Animated.View style={{ height: this.state.erWordStyle }}>
                                <Animated.Text
                                    style={{
                                        // fontSize: this.state.sWordStyle,
                                        color: colors.WHITE,
                                        fontFamily: 'Harabara-Regular',
                                        fontSize: scale.w(70),
                                    }}
                                >
                                    r
                                </Animated.Text>
                            </Animated.View> */}
                            {/* <Animatable.View
                                iterationDelay={1000}
                                animation="fadeInUp"
                                style={{ alignSelf: 'center' }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(70),
                                        color: colors.WHITE,
                                        fontFamily: 'Harabara-Regular',
                                    }}
                                >
                                    e
                                </Text>
                            </Animatable.View> */}
                            {/* <Animatable.View
                                iterationDelay={2000}
                                animation="fadeInUp"
                                style={{ alignSelf: 'center' }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(70),
                                        color: colors.WHITE,
                                        fontFamily: 'Harabara-Regular',
                                    }}
                                >
                                    r
                                </Text>
                            </Animatable.View>
                            <Animatable.View
                                iterationDelay={3000}
                                animation="fadeInUp"
                                style={{ alignSelf: 'center' }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(70),
                                        color: colors.WHITE,
                                        fontFamily: 'Harabara-Regular',
                                    }}
                                >
                                    v
                                </Text>
                            </Animatable.View>
                            <Animatable.View
                                iterationDelay={4000}
                                onAnimationEnd={() => {
                                    Animated.timing(this.state.wordsMarginTop, {
                                        toValue: -heightPercentageToDP(15),
                                        duration: 1000,
                                        easing: Easing.back(),
                                    }).start();
                                }}
                                animation="fadeInUp"
                                style={{ alignSelf: 'center' }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(70),
                                        color: colors.WHITE,
                                        fontFamily: 'Harabara-Regular',
                                    }}
                                >
                                    r
                                </Text>
                            </Animatable.View> */}
                        </Animated.View>
                        <Animated.View
                            style={{
                                top: this.state.bottomBarMargin,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    Navigation.setRoot({ root: pickHotel });
                                }}
                                style={{
                                    // marginTop: heightPercentageToDP(90),
                                    width: widthPercentageToDP(90),
                                    borderTopLeftRadius: widthPercentageToDP(10),
                                    borderTopRightRadius: widthPercentageToDP(10),
                                    backgroundColor: '#fff',
                                    paddingHorizontal: widthPercentageToDP(8),
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    height: heightPercentageToDP(11),
                                    paddingTop: heightPercentageToDP(1.5),
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.SplashColor,
                                        fontSize: scale.w(2.4),
                                        fontFamily: 'Roboto-Bold',
                                        alignSelf: 'center',
                                    }}
                                >
                                    Get Started
                                </Text>
                                <Image
                                    resizeMode="contain"
                                    style={{
                                        alignSelf: 'center',
                                        height: scale.w(3.5),
                                        width: scale.w(4.5),
                                        tintColor: colors.SplashColor,
                                    }}
                                    source={require('../../images/right-arrow.png')}
                                />
                            </TouchableOpacity>
                        </Animated.View>
                        {/* <AttentionModal
                            visible={this.state.visible}
                            toggleModal={this.toggleModal}
                            text={`Thank you for using ${this.state.chainData.data.name}, there is a new update available within your app store, please click here to download it to continue to use ${this.state.chainData.data.name} GuestX.`}
                            attention={'Update available on your app store'}
                            ok={this.props.selectedLanguage.ok}
                        /> */}
                    </ImageBackground>
                );
            } else {
                return (
                    <ImageBackground
                        style={{
                            flex: 1,
                        }}
                        resizeMode="cover"
                        source={{
                            uri: this.props.chainData.data.splash_screen,
                        }}
                        //source={require('../../images/splashBG.png')}
                    >
                        <StatusBar backgroundColor={colors.BLUE}></StatusBar>
                        <Animated.View
                            //   iterationDelay={6000}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                                marginTop: this.state.wordsMarginTop,
                            }}
                        >
                            {this.state.value > 0 && (
                                <Animated.View style={{ height: this.state.sWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: colors.WHITE,
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        S
                                    </Animated.Text>
                                </Animated.View>
                            )}

                            {this.state.eValue > 0 ? (
                                <Animated.View style={{ height: this.state.eWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: colors.WHITE,
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                            marginHorizontal: -3,
                                            letterSpacing: 3,
                                        }}
                                    >
                                        {`e`}
                                    </Animated.Text>
                                </Animated.View>
                            ) : (
                                <Animated.View style={{ height: this.state.eWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: 'transparent',
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                            marginHorizontal: -3,
                                            letterSpacing: 3,
                                        }}
                                    >
                                        e
                                    </Animated.Text>
                                </Animated.View>
                            )}
                            {this.state.rValue > 0 ? (
                                <Animated.View style={{ height: this.state.rWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: colors.WHITE,
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        r
                                    </Animated.Text>
                                </Animated.View>
                            ) : (
                                <Animated.View style={{ height: this.state.rWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: 'transparent',
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        r
                                    </Animated.Text>
                                </Animated.View>
                            )}
                            {this.state.vValue > 0 ? (
                                <Animated.View style={{ height: this.state.vWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: colors.WHITE,
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        v
                                    </Animated.Text>
                                </Animated.View>
                            ) : (
                                <Animated.View style={{ height: this.state.vWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: 'transparent',
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        v
                                    </Animated.Text>
                                </Animated.View>
                            )}
                            {this.state.erValue > 0 ? (
                                <Animated.View style={{ height: this.state.erWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            color: colors.WHITE,
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                        }}
                                    >
                                        r
                                    </Animated.Text>
                                </Animated.View>
                            ) : (
                                <Animated.View style={{ height: this.state.erWordStyle }}>
                                    <Animated.Text
                                        style={{
                                            // fontSize: this.state.sWordStyle,
                                            paddingHorizontal: widthPercentageToDP(0.3),
                                            color: 'transparent',
                                            fontFamily: 'Harabara',
                                            fontSize: scale.w(8.5),
                                        }}
                                    >
                                        r
                                    </Animated.Text>
                                </Animated.View>
                            )}
                        </Animated.View>
                        {/* <AttentionModal
                            visible={this.state.visible}
                            toggleModal={this.toggleModal}
                            text={`Thank you for using ${this.state.chainData.data.name}, there is a new update available within your app store, please click here to download it to continue to use ${this.state.chainData.data.name} GuestX.`}
                            attention={'Update available on your app store'}
                            ok={this.props.selectedLanguage.ok}
                        /> */}
                    </ImageBackground>
                );
            }
    }
}

export default SplashScreen;
