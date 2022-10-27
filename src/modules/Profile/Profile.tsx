import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableOpacity,
    Text,
    ImageBackground,
    StatusBar,
    ColorPropType,
    ActivityIndicator,
    TextInput,
    Dimensions,
    Alert,
    BackHandler,
} from 'react-native';
import Modal from 'react-native-modal';
import { Image, View as ViewAnimatable } from 'react-native-animatable';
import { IProfileReduxProps } from './Profile.Container';
import Navbar from '../_global/Navbar';
import colors from '../../constants/colors';
import { IFeatureHotel } from '../../types/hotel';
import { Navigation } from 'react-native-navigation';
import {
    mainmenu,
    ProfileData,
    restoMain,
    chat,
    CardDetails,
    pickHotel,
    conciergeTrackingProgress,
    LostAndFound,
    mainmenuchildren,
} from '../../utils/navigationControl';
import {
    heightPercentageToDP,
    heightPercentageToDP as hp,
    scale,
    widthPercentageToDP,
    widthPercentageToDP as wp,
} from '../../utils/dimensions';
import OrdersAndBookings from '../_global/profileBookingsAndOrdersCard';
import ProfileNavButton from '../_global/profileNavButton';
import AttentionModal from '../_global/AttentionModal';
import AsyncStorage from '@react-native-community/async-storage';
import { cancelSchduleNotification, toast, WAKE_UP_ID } from '../../utils/handleLogic';
import BottomBar from '../_global/BottomBar';
import DropShadow from 'react-native-drop-shadow';
import ImageZoomModal from '../_global/ImageZoomModal';
import CustomModal from '../_global/CustomModal';
import { RootContainer } from '../_global/Container';
import PushNotification from 'react-native-push-notification';
// import { TextInput } from 'react-native-gesture-handler';
import UnChecked_Box from '../../images/UnChecked_Box.svg';
import Checked_Box from '../../images/Checked_Box.svg';
import DropDownPicker from 'react-native-dropdown-picker';
import { languages } from '../../modules/_global/languages';
import { ButtonPrimary } from '../_global/Button';

export interface IProfileProps extends IProfileReduxProps {
    componentId: string;
}

interface IProfileState {
    loading: boolean;
    code: string;
    marginLeft: number;
    modalVisible: boolean;
    email: string;
    password: string;
    type: string;
    visible: boolean;
    text: string;
}

class Profile extends React.Component<IProfileProps, IProfileState> {
    private _switchModal = React.createRef<CustomModal>();
    constructor(props: IProfileProps) {
        super(props);

        this.state = {
            loading: false,
            code: '',
            marginLeft: scale.w(100),
            modalVisible: false,
            email: '',
            password: '',
            type: '',
            visible: false,
            text: '',
            showLanguageModal: false,
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: this.props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handlePersonalDataClick = this._handlePersonalDataClick.bind(this);
        this._handleHelp = this._handleHelp.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this._handleCardDetails = this._handleCardDetails.bind(this);
        this._handleSignout = this._handleSignout.bind(this);
        this._handleSignoutConfirmation = this._handleSignoutConfirmation.bind(this);
        this._handleSetBookingActive = this._handleSetBookingActive.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentDidMount() {
        this.props.getCardDetails();
        console.log('Hello', this.props.profileData);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 0,
            },
        });
        return true;
    }

    _isLockFeature(feature?: keyof IFeatureHotel) {
        console.log('=======feature', feature);
        if (feature !== 'is_check_in_enabled' && !this.props.isCheckedIn) {
            this.setState({
                text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
                visible: true,
            });
            return true;
        }
        if (feature !== 'is_check_in_enabled' && this.props.status === 'pending') {
            this.setState({
                text: this.props.selectedLanguage
                    .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
                visible: true,
            });
            return true;
        }
        return false;
    }

    _handleHelp() {
        if (this._isLockFeature()) {
            return;
        }
        this.props.toggleIsInChatScreen(true);
        this.props.updateTotalUnreadMessageSuccess(0);
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 1,
            },
        });
    }

    _handleOrdersAndHistory() {
        if (this._isLockFeature()) {
            return;
        }
        Navigation.push(this.props.componentId, conciergeTrackingProgress);
    }

    _handleBack() {
        if (Platform.OS == 'ios') {
            Navigation.pop(this.props.componentId);
        } else {
            if (this.props.backGround) {
                Navigation.setStackRoot(this.props.componentId, mainmenu);
            } else {
                Navigation.setStackRoot(this.props.componentId, mainmenu);
            }
        }
    }

    _handlePersonalDataClick = () => {
        Navigation.push(this.props.componentId, ProfileData({ backGround: false }));
    };

    _handleCardDetails = () => {
        Navigation.push(this.props.componentId, CardDetails({ backGround: false }));
    };

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _handleSignout() {
        AsyncStorage.clear();
        this.props.checkOutSuccess();
        PushNotification.cancelAllLocalNotifications();
        cancelSchduleNotification(WAKE_UP_ID);
        this.props.signOutSuccess();
        Navigation.setRoot({ root: pickHotel });
    }

    _handleSignoutConfirmation() {
        Alert.alert(
            this.props.selectedLanguage.warning,
            this.props.selectedLanguage.are_you_sure_you_want_to_logout,
            [
                {
                    text: this.props.selectedLanguage.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: this.props.selectedLanguage.ok, onPress: this._handleSignout },
            ],
        );
    }
    _handleSetBookingActive(i: any) {
        this.props.swtichBookingReference(
            i.id,
            () => {
                // this.props.getProfile(
                //     this.props.access_token,
                //     this.props.hotel_code,
                //     async () => {
                //         await this.props.disconnectSendBird(
                //             () => {},
                //             () => {},
                //         );

                //         this.props.connectSendBird();
                //         this.props.getwakeupCall(
                //             () => {
                //                 console.log(
                //                     'Success api is called of the wake up',
                //                 );
                //             },
                //             () => {
                //                 console.log(
                //                     'failed api is called of the wake up',
                //                 );
                //             },
                //         );
                //     },
                //     () => {},
                // );

                this._switchModal.current?.hide();
            },
            () => {},
        );
        Navigation.popTo('mainmenu');
    }

    render() {
        const { attention, ok } = this.props.selectedLanguage;
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
                <CustomModal
                    ref={this._switchModal}
                    style={{
                        height: hp(70),
                        width: wp(100),
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: -1,
                    }}
                >
                    <View
                        style={{
                            width: wp(80),
                            borderRadius: scale.w(3.0),
                            backgroundColor: colors.WHITE,
                            paddingHorizontal: 20,
                        }}
                    >
                        <View style={{ alignItems: 'center', marginVertical: heightPercentageToDP(1.5) }}>
                            <Text
                                stryle={{
                                    fontWeight: 'bold',
                                    fontFamily: 'Roboto-Medium',
                                    fontSize: scale.w(2.8),
                                }}
                            >
                                My Reservations
                            </Text>
                        </View>
                        {this.props.bookingReferences.map((i) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        this._handleSetBookingActive(i);
                                    }}
                                    style={{
                                        paddingVertical: 20,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.LIGHT_GREY,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: i?.active_booking ? scale.w(1.6) : scale.w(1.25),
                                            fontWeight: i?.active_booking ? 'bold' : '300',
                                        }}
                                    >
                                        {i?.reference} {i?.last_name} {i?.room_number} {i?.hotel?.code}
                                    </Text>
                                    <View style={{ flex: 1 }}></View>
                                    <View style={{ justifyContent: 'center' }}>
                                        {i?.active_booking ? (
                                            <Checked_Box
                                                fill={colors.BLUE}
                                                style={{ alignSelf: 'flex-start' }}
                                            />
                                        ) : (
                                            <UnChecked_Box style={{ alignSelf: 'flex-start' }} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </CustomModal>
                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: heightPercentageToDP(20), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    />
                )}
                {Platform.OS === 'android' && <StatusBar></StatusBar>}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>
                        <RootContainer>
                            <View
                                style={{
                                    height: heightPercentageToDP(14),
                                }}
                            >
                                {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                                <Navbar
                                    onClick={this._handleBack}
                                    title={this.props.selectedLanguage.profile}
                                    tintBackColor={'black'}
                                    titleColor={'black'}
                                    RightIconName={'sign-out-alt'}
                                    isProfile={true}
                                    search={true}
                                    disableBackButton={true}
                                    onSearchClick={this._handleSignoutConfirmation}
                                    navStyle={{
                                        minHeight: heightPercentageToDP(5),
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: widthPercentageToDP(5),
                                    }}
                                />
                                {/* </ImageBackground> */}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <DropShadow
                                    style={{
                                        shadowOffset: {
                                            width: 0,
                                            height: 6,
                                        },
                                        shadowColor: colors.BLACK,
                                        shadowOpacity: 0.16,
                                        shadowRadius: 15,
                                        borderRadius: scale.w(5),
                                    }}
                                >
                                    <View
                                        style={{
                                            height: scale.w(12),
                                            width: scale.w(12),
                                            borderRadius: scale.w(12) / 2,
                                            backgroundColor: colors.WHITE,
                                            padding: scale.w(1.5),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {this.props.profileData?.profile_image &&
                                        this.props.profileData?.profile_image != '' ? (
                                            <TouchableOpacity
                                                onPress={() => this.setState({ modalVisible: true })}
                                            >
                                                <Image
                                                    style={{
                                                        height: scale.w(10.8),
                                                        width: scale.w(10.8),
                                                        borderRadius: scale.w(10.8) / 2,
                                                    }}
                                                    source={{ uri: this.props.profileData?.profile_image }}
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                            <Image
                                                style={{
                                                    height: scale.w(10.8),
                                                    width: scale.w(10.8),
                                                    borderRadius: scale.w(10.8) / 2,
                                                }}
                                                source={require('../../images/dummyUser.png')}
                                            ></Image>
                                        )}
                                    </View>
                                </DropShadow>
                            </View>
                            <Text
                                style={{
                                    fontSize: scale.w(2.5),
                                    color: colors.SignInUsingColor,
                                    fontFamily: 'Harabara',
                                    textAlign: 'center',
                                    marginTop: hp(2),
                                    marginBottom: hp(1),
                                    letterSpacing: 1,
                                }}
                            >
                                {this.props.profileData?.full_name
                                    ? this.props.profileData?.full_name
                                    : this.props.selectedLanguage.name}
                            </Text>
                            <OrdersAndBookings
                                backgroundColor={this.props.color}
                                orders={
                                    this.props.profileData?.total_orders &&
                                    this.props.profileData?.total_orders > 0
                                        ? this.props.profileData?.total_orders
                                        : 0
                                }
                                bookings={
                                    this.props.profileData?.total_booking &&
                                    this.props.profileData?.total_booking > 0
                                        ? this.props.profileData?.total_booking
                                        : 0
                                }
                                selectedLanguage={this.props.selectedLanguage}
                            />
                            <View style={{ height: heightPercentageToDP(3) }}></View>
                            <View style={{ height: heightPercentageToDP(2) }}></View>
                            <View
                                style={{
                                    paddingHorizontal: wp(5),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(2.2),
                                        color: colors.SignInUsingColor,
                                        fontFamily: 'Harabara',
                                        paddingHorizontal: widthPercentageToDP(3),
                                        letterSpacing: 0.7,
                                    }}
                                >
                                    {this.props.selectedLanguage.general}
                                </Text>
                            </View>
                            <View style={{ height: hp(2) }} />
                            <ProfileNavButton
                                //  backgrondColor={this.props.color}
                                onPress={this._handlePersonalDataClick}
                                IconBackground={colors.MEDIUM_BLUE}
                                IconName={'shield-check'}
                                profileNav
                                title={this.props.selectedLanguage.personal_data}
                                details={this.props.selectedLanguage.your_account_settings}
                                Profile={true}
                            />
                            <View style={{ height: hp(2) }} />
                            {this.props.isCheckedIn && (
                                <>
                                    <ProfileNavButton
                                        onPress={() => this._handleOrdersAndHistory()}
                                        IconBackground={colors.SKY_BLUE}
                                        orderHistory
                                        title={this.props.selectedLanguage.order_history}
                                        details={this.props.selectedLanguage.check_your_recent_orders}
                                        Profile={true}
                                    />
                                    <View style={{ height: hp(2) }} />
                                </>
                            )}
                            <ProfileNavButton
                                onPress={this._handleCardDetails}
                                IconBackground={colors.DARK_BLUE_BUTTON}
                                IconName={'lock'}
                                cardDetails
                                title={this.props.selectedLanguage.card_details}
                                details={this.props.selectedLanguage.your_card_details}
                                Profile={true}
                            />
                            <View style={{ height: hp(2) }} />
                            <ProfileNavButton
                                onPress={this._handleHelp}
                                IconBackground={colors.SKY_BLUE}
                                IconName={'headset'}
                                help
                                title={this.props.selectedLanguage.help}
                                details={this.props.selectedLanguage.need_more_help}
                                Profile={true}
                            />
                            <View style={{ height: hp(2) }} />
                            <ProfileNavButton
                                onPress={() => this.setState({ showLanguageModal: true })}
                                IconBackground={colors.NEWS_BLUE}
                                IconName={'headset'}
                                location
                                title={this.props.selectedLanguage.languages}
                                details={this.props.selectedLanguage.lang}
                                Profile={true}
                            />
                            <View style={{ height: hp(2) }} />
                            {/* && this.props.isCheckedIn */}
                            {this.props.bookingReferences?.length > 1 && (
                                <ProfileNavButton
                                    onPress={() => {
                                        this.props.getCurrentBookings();
                                        this._switchModal.current?.show();
                                    }}
                                    IconBackground={colors.SKY_BLUE}
                                    IconName={'setting'}
                                    switch
                                    title={'Switch'}
                                    details={'Switch the instance'}
                                />
                            )}
                            <View style={{ height: hp(15) }} />
                            <AttentionModal
                                visible={this.state.visible}
                                toggleModal={this.toggleModal}
                                text={this.state.text}
                                attention={attention}
                                ok={ok}
                            />
                        </RootContainer>
                    </View>
                </ScrollView>
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
                        onChatPress={this._handleHelp}
                        profile={false}
                        home={true}
                        backgroundColor={this.props.color}
                        onHomePress={() => {
                            this.props.toggleIsInChatScreen(false);
                            this.props.updateTotalUnreadMessageSuccess(0);
                            Navigation.mergeOptions(this.props.componentId, {
                                bottomTabs: {
                                    currentTabIndex: 0,
                                },
                            });
                        }}
                        onPromoClick={() => {
                            this.props.toggleIsInChatScreen(false);
                            this.props.updateTotalUnreadMessageSuccess(0);
                            Navigation.mergeOptions(this.props.componentId, {
                                bottomTabs: {
                                    currentTabIndex: 2,
                                },
                            });
                        }}
                        countUnreadMessage={this.props.isCheckedIn ? this.props.countUnreadMessage : 0}
                        checkWindow={'profile'}
                        title={this.props.selectedLanguage.profile}
                    />
                </View>
                <Modal
                    backdropOpacity={0.7}
                    isVisible={this.state.showLanguageModal}
                    onBackdropPress={() => {}}
                >
                    <View
                        style={{
                            minHeight: hp(30),
                            width: '100%',
                            backgroundColor: '#fff',
                            borderRadius: 25,
                            alignItems: 'center',
                            padding: scale.w(2),
                        }}
                    >
                        <View style={{ width: '100%', paddingLeft: wp(2) }}>
                            <Text style={{ color: '#454346', fontSize: 18, fontWeight: 'bold' }}>
                                {this.props.selectedLanguage.select_language}
                            </Text>
                        </View>
                        <DropDownPicker
                            zIndex={500}
                            items={[
                                { label: 'English', value: 'english' },
                                { label: 'Spanish', value: 'spanish' },
                                { label: 'French', value: 'french' },
                                { label: 'Russian', value: 'russian' },
                                { label: 'Portugese', value: 'portugese' },
                                { label: 'Chinese', value: 'chinese' },
                                { label: 'Italian', value: 'italian' },
                                { label: 'Hebrew', value: 'hebrew' },
                                { label: 'Arabic', value: 'arabic' },
                                { label: 'Indonesian', value: 'indonesian' },
                                { label: 'Dutch', value: 'dutch' },
                                { label: 'German', value: 'german' },
                                { label: 'Japanese', value: 'japanese' },
                            ]}
                            placeholder={this.props.selectedLanguage.languages}
                            placeholderStyle={{ paddingHorizontal: wp(1.7) }}
                            labelStyle={{
                                fontFamily: 'Roboto-Regular',
                                color: colors.DUMMY_COLOR,
                            }}
                            activeLabelStyle={{
                                fontFamily: 'Roboto-Bold',
                                color: colors.DUMMY_COLOR,
                            }}
                            style={{
                                backgroundColor: colors.COM_BACKGROUND,
                                borderTopLeftRadius: scale.w(1.8),
                                borderTopRightRadius: scale.w(1.8),
                                borderBottomLeftRadius: scale.w(1.8),
                                borderBottomRightRadius: scale.w(1.8),
                                paddingHorizontal: this.state.clothTypeState ? wp(2) : wp(3),
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',

                                width: wp(82),
                                marginTop: hp(2),
                                borderWidth: 0,
                                borderRadius: scale.w(20),
                                paddingRight: wp(3),
                            }}
                            itemStyle={{
                                justifyContent: 'flex-start',
                            }}
                            arrowStyle={{
                                marginRight: scale.w(1),
                            }}
                            arrowColor={'#121924'}
                            dropDownStyle={{
                                width: '100%',
                                marginTop: heightPercentageToDP(2.5),
                                height: hp(12),
                            }}
                            containerStyle={{
                                height: hp(8.5),
                            }}
                            onOpen={() => {}}
                            onClose={() => {}}
                            onChangeItem={(item) => {
                                this.props.selectLanguage(languages[item.value]);
                                this.setState({ showLanguageModal: false });
                            }}
                        />
                        <View style={{ height: hp(5) }} />
                        <View
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        >
                            <ButtonPrimary
                                backgroundColor={this.props.color}
                                loading={false}
                                onPress={() => this.setState({ showLanguageModal: false })}
                                text={this.props.selectedLanguage.cancel}
                                fontSize={scale.w(1.6)}
                                fontWeight={'bold'}
                                chainData={null}
                            />
                        </View>
                    </View>
                </Modal>
                <ImageZoomModal
                    modalVisible={this.state.modalVisible}
                    onBack={() => this.setState({ modalVisible: false })}
                    onBackDrop={() => this.setState({ modalVisible: false })}
                    Image={{ uri: this.props.profileData?.profile_image }}
                    onBackArrow={() => this.setState({ modalVisible: false })}
                    //   isExpandModalExists={true}
                />
            </KeyboardAvoidingView>
            // </ImageBackground>
        );
    }
}
export default Profile;
