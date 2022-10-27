import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    BackHandler,
    Platform,
    Text,
    TextInput,
    Alert,
} from 'react-native';
import base from '../../utils/baseStyles';
import {
    scale,
    heightPercentageToDP,
    widthPercentageToDP,
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { spaBookingTime, mainmenu, chat, Profile, mainmenuchildren } from '../../utils/navigationControl';
import { ILostAndFoundServiceReduxProps } from './lostAndFound.Container';
import colors from '../../constants/colors';
import Field from './Component/field';
import { View as ViewAnimatable } from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FieldFormWithMask from './Component/FieldFormWithMask';
import { toast, validatePhoneNumber, validateEmail } from '../../utils/handleLogic';
import User from '../../images/user.svg';
import Email from '../../images/email.svg';
import Phone from '../../images/phone.svg';
import CustomModal from '../_global/CustomModal';
import ProcessComplete from '../_global/processComplete';
import BottomBar from '../_global/BottomBar';
import { IFeatureHotel } from '../../types/hotel';
import AttentionModal from '../_global/AttentionModal';
import { RootContainer } from '../_global/Container';

export interface ILostBaseProps {
    from?: 'restaurant' | 'concierge_service' | 'main_menu';
}

export interface ILostAndFoundProps extends ILostAndFoundServiceReduxProps {
    componentId: string;
    backGround?: boolean;
    data?: any;
    getTransactionHistory?: any;
    response?: any;
    profile?: any;
    typeData?: any;
    text: string;
}

interface ILostAndFoundServiceState {
    name: string;
    email: string;
    phonenumber: string;
    message: string;
    loading: boolean;
    text: string;
    visible: boolean;
}

class LostAndFound extends React.Component<ILostAndFoundProps, ILostAndFoundServiceState> {
    private _modalConfirm = React.createRef<CustomModal>();

    constructor(props: ILostAndFoundProps) {
        super(props);

        this.state = {
            name: '',
            email: '',
            phonenumber: '',
            message: '',
            loading: false,
            visible: false,
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._lostAndFound = this._lostAndFound.bind(this);
        this._handleChat = this._handleChat.bind(this);
        this._handleAccount = this._handleAccount.bind(this);
        // this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        console.log('called here in lost and found');
        this.props.goBackToHome(
            true,
            () => console.log('success go back'),
            () => console.log('failed'),
        );
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 0,
            },
        });
        return BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentDidUpdate() {
        console.log('did update called');
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentDidMount() {
        this.props.goBackToHome(
            false,
            () => console.log('false called'),
            () => console.log('false failed'),
        );
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
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

    _handleChat() {
        if (this._isLockFeature()) {
            return;
        }
        this.props.toggleIsInChatScreen(false);
        this.props.updateTotalUnreadMessageSuccess(0);
        Navigation.mergeOptions(this.props.componentId, {
            bottomTabs: {
                currentTabIndex: 1,
            },
        });
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
    // componentDidMount() {
    //     // this.props.getSpa();
    //     this.props.postLostAndFoundRequest(
    //         {
    //             name : 'haider',
    //             message : 'hi',
    //             phonenumber : '+923329666808',
    //             email : 'aksbdka@gmail.com',
    //             hotel_id : this.props.lostAndFound.hotel.id,
    //         }
    //     )
    // }

    _handleBack() {
        if (this.props.backGround) {
            Navigation.setStackRoot(this.props.componentId, mainmenu);
        } else {
            Navigation.setStackRoot(this.props.componentId, mainmenu);
        }
    }

    async _lostAndFound() {
        // if (this.state.name == '' || this.state.name.length < 2 || this.state.email == '' || this.state.phonenumber == '') {
        //     toast(this.props.selectedLanguage.please_check_your_entered_Details)
        // }
        if (this.state.name == '' || this.state.name == null || this.state.name.trim() == '') {
            toast(this.props.selectedLanguage.please_enter_your_name);
            return 0;
        }
        if (this.state.phonenumber == '' || this.state.phonenumber == null) {
            toast(this.props.selectedLanguage.please_enter_your_phone_number);
            return 0;
        }
        if (validatePhoneNumber(this.state.phonenumber) != true) {
            toast(this.props.selectedLanguage.please_enter_a_valid_phone_number);
            return 0;
        }
        if (this.state.email == '' || this.state.email == null) {
            toast(this.props.selectedLanguage.please_enter_your_mail);
            return 0;
        }
        if (validateEmail(this.state.email) != true) {
            toast(this.props.selectedLanguage.please_enter_a_valid_email);
            return 0;
        }
        if (this.state.message == '' || this.state.message == null) {
            toast(this.props.selectedLanguage.please_enter_relevant_description);
            return 0;
        } else {
            await this.setState({
                loading: true,
            });
            this.props.postLostAndFoundRequest(
                {
                    name: this.state.name,
                    message: this.state.message,
                    phonenumber: this.state.phonenumber.replace(/\s/g, ''),
                    email: this.state.email,
                    hotel_id: this.props.lostAndFound.hotel.id,
                },
                async () => {
                    // await Navigation.pop(this.props.componentId);

                    this.setState({ loading: false });
                    // Alert.alert(
                    //     'Success',
                    //     'Request sent successfully',
                    // );
                    this._modalConfirm.current?.show();
                },
                () => {
                    this.setState({ loading: false });
                },
            );
        }
    }

    render() {
        const { color } = this.props;
        const {
            name,
            enter_your_name,
            enter_your_phone_number,
            phone_number,
            enter_your_email,
            email,
            description,
            what_you_have_lost_or_found,
            send,
            attention,
            ok,
        } = this.props.selectedLanguage;
        // console.log("Printing props of spa == ",this.props.spa)
        // const { reserve_a_spa_treatment, order_spa_room_service } = this.props.selectedLanguage;
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <CustomModal
                    ref={this._modalConfirm}
                    style={{
                        height: hp(100),
                        width: wp(100),
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: -1,
                    }}
                >
                    <ProcessComplete
                        processImage={require('../../images/paymentPageImg.png')}
                        processTitle={this.props.selectedLanguage.email_sent_successfull}
                        processDescription={
                            this.props.selectedLanguage
                                .your_lost_found_request_has_been_requested_successfully
                        }
                        backgroundColor={this.props.color}
                        onButtonPress={() => {
                            this.props.goBackToHome(
                                true,
                                () => console.log('success go back'),
                                () => console.log('failed'),
                            );
                            Navigation.mergeOptions(this.props.componentId, {
                                bottomTabs: {
                                    currentTabIndex: 0,
                                },
                            });
                            this._modalConfirm.current?.hide();
                        }}
                        btnText={this.props.selectedLanguage.go_to_home}
                        chainData={this.props.chainData}
                    />
                </CustomModal>
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ height: heightPercentageToDP(100), width: widthPercentageToDP(100) }}>
                        <RootContainer>
                            <View
                                style={{
                                    height: heightPercentageToDP(14),
                                    backgroundColor: this.props.color,
                                }}
                            >
                                {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                                <Navbar
                                    disableBackButton={true}
                                    tintBackColor={colors.WHITE}
                                    titleColor={colors.WHITE}
                                    onClick={this._handleBack}
                                    title={this.props.selectedLanguage.lostAndFound}
                                />
                                {/* </ImageBackground> */}
                            </View>
                            <View
                                style={{
                                    height: heightPercentageToDP(82),
                                    width: widthPercentageToDP(100),
                                    backgroundColor: colors.WHITE,
                                    top: -heightPercentageToDP(4.3),
                                    borderTopLeftRadius: scale.w(3.5),
                                    borderTopRightRadius: scale.w(3.5),
                                    paddingTop: heightPercentageToDP(0.75),
                                }}
                            >
                                <ScrollView keyboardShouldPersistTap={true}>
                                    <ViewAnimatable
                                        useNativeDriver
                                        animation="fadeInRight"
                                        duration={400}
                                        delay={Math.floor(Math.random() * 100)}
                                        style={{ flex: 1, marginHorizontal: widthPercentageToDP(5) }}
                                    >
                                        <View
                                            style={{
                                                paddingVertical: hp(3),
                                                paddingHorizontal: wp(4),
                                                marginTop: hp(3),
                                                width: wp(90),
                                                alignSelf: 'center',

                                                borderColor: '#EBF0F9',
                                                borderWidth: 1,
                                                borderRadius: scale.w(2),
                                                backgroundColor: colors.WHITE,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.6),
                                                    fontFamily: 'Roboto-Medium',
                                                    color: colors.DUMMY_COLOR,
                                                }}
                                            >
                                                {' '}
                                                {this.props.selectedLanguage.personal_details}
                                            </Text>
                                            <View
                                                style={{
                                                    backgroundColor: colors.COM_BACKGROUND,
                                                    paddingHorizontal: wp(1),
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    width: wp(82),
                                                    marginTop: hp(2),

                                                    paddingVertical: hp(0.9),
                                                    borderRadius: scale.w(1.5),
                                                }}
                                            >
                                                <Field
                                                    // autofocus={true}
                                                    // optionalWidth={true}
                                                    maxLength={50}
                                                    title={name}
                                                    inputStyle={{
                                                        width: widthPercentageToDP(72),
                                                        paddingHorizontal: widthPercentageToDP(3),
                                                    }}
                                                    placeholder={this.props.selectedLanguage.name}
                                                    color={color}
                                                    onChangeText={(value) => {
                                                        this.setState({
                                                            name: value,
                                                        });
                                                    }}
                                                />

                                                <User
                                                    width={widthPercentageToDP(4)}
                                                    height={heightPercentageToDP(4)}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    backgroundColor: colors.COM_BACKGROUND,
                                                    paddingHorizontal: wp(1),
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    width: wp(82),
                                                    marginTop: hp(2),

                                                    paddingVertical: hp(0.9),
                                                    borderRadius: scale.w(1.5),
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: widthPercentageToDP(72),
                                                        paddingHorizontal: widthPercentageToDP(3),
                                                    }}
                                                >
                                                    <FieldFormWithMask
                                                        type="custom"
                                                        options={{ mask: '+9999 999 999 999' }}
                                                        title={phone_number}
                                                        placeholder={this.props.selectedLanguage.phone_number}
                                                        keyboardType="phone-pad"
                                                        maxLength={18}
                                                        value={this.state.phonenumber}
                                                        onChangeText={(phonenumber) =>
                                                            this.setState({ phonenumber })
                                                        }
                                                        // editable={!this.props.isCheckedIn}
                                                    />
                                                </View>
                                                <Phone
                                                    width={widthPercentageToDP(4)}
                                                    height={heightPercentageToDP(4)}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    backgroundColor: colors.COM_BACKGROUND,
                                                    paddingHorizontal: wp(1),
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    width: wp(82),
                                                    marginTop: hp(2),

                                                    paddingVertical: hp(0.9),
                                                    borderRadius: scale.w(1.5),
                                                }}
                                            >
                                                <Field
                                                    title={email}
                                                    placeholder={this.props.selectedLanguage.email}
                                                    color={color}
                                                    inputStyle={{
                                                        width: widthPercentageToDP(72),
                                                        paddingHorizontal: widthPercentageToDP(3),
                                                    }}
                                                    onChangeText={(value) => {
                                                        this.setState({
                                                            email: value.trim(),
                                                        });
                                                    }}
                                                    value={this.state.email}
                                                ></Field>

                                                <Email
                                                    width={widthPercentageToDP(4)}
                                                    height={heightPercentageToDP(4)}
                                                />
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                paddingVertical: hp(3),
                                                paddingHorizontal: wp(4),
                                                marginTop: hp(2),
                                                width: wp(90),
                                                alignSelf: 'center',
                                                borderWidth: 1,
                                                borderRadius: scale.w(2),
                                                borderColor: '#EBF0F9',
                                                backgroundColor: colors.WHITE,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.6),
                                                    fontFamily: 'Roboto-Medium',
                                                    color: colors.DUMMY_COLOR,
                                                }}
                                            >
                                                {this.props.selectedLanguage.description}
                                            </Text>
                                            <View style={{ height: heightPercentageToDP(1) }}></View>
                                            <Field
                                                multiline={true}
                                                title={description}
                                                height={heightPercentageToDP(15)}
                                                placeholder={
                                                    this.props.selectedLanguage.type_something_you_want_here
                                                }
                                                color={'red'}
                                                numberOfLines={3}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        message: value,
                                                    });
                                                }}
                                                inputStyle={{ paddingBottom: heightPercentageToDP(2) }}
                                                textAlignVertical="top"
                                                maxLength={250}
                                            ></Field>
                                        </View>
                                        <View style={{ height: heightPercentageToDP(10) }}></View>
                                        <ButtonPrimary
                                            onPress={this._lostAndFound}
                                            backgroundColor={this.props.color}
                                            fontWeight={'bold'}
                                            text={send + '  ' + this.props.selectedLanguage.request}
                                            loading={this.state.loading}
                                            chainData={this.props.chainData}
                                        />
                                        <View style={{ height: heightPercentageToDP(3) }}></View>
                                    </ViewAnimatable>
                                    {/* <View style={{height : heightPercentageToDP(10)}} /> */}
                                </ScrollView>
                            </View>

                            <AttentionModal
                                visible={this.state.visible}
                                toggleModal={() =>
                                    this.setState({
                                        visible: false,
                                    })
                                }
                                text={this.state.text}
                                attention={attention}
                                ok={ok}
                            />
                        </RootContainer>
                    </View>
                </ScrollView>
                <View
                    style={{
                        height: Platform.OS == 'android' ? '100%' : null,
                        bottom: Platform.OS == 'android' ? null : 0,
                        width: wp(100),
                        position: 'absolute',
                        marginTop: hp(91),
                        //  paddingTop : hp(5.3),
                        // marginTop : -heightPercentageToDP(0.05)
                    }}
                >
                    <BottomBar
                        onChatPress={this._handleChat}
                        profile={false}
                        onHomePress={() => {
                            this.props.toggleIsInChatScreen(false);
                            this.props.updateTotalUnreadMessageSuccess(0);
                            Navigation.mergeOptions(this.props.componentId, {
                                bottomTabs: {
                                    currentTabIndex: 0,
                                },
                            });
                        }}
                        backgroundColor={this.props.color}
                        home={true}
                        countUnreadMessage={this.props.isCheckedIn ? this.props.countUnreadMessage : 0}
                        onAccount={this._handleAccount}
                        checkWindow={'lostAndfound'}
                        title={this.props.selectedLanguage.lostAndFound}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    text_container: {
        marginTop: scale.w(10),
        marginBottom: scale.w(20),
        marginHorizontal: scale.w(28),
    },
    image_container: {
        alignItems: 'center',
        marginTop: scale.w(60),
        marginBottom: scale.w(68),
    },
    menu_btn_container: {
        paddingHorizontal: scale.w(55),
        marginBottom: scale.w(10),
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: scale.w(200),
        resizeMode: 'contain',
        // marginTop: scale.w(20),
    },
});

export default LostAndFound;
