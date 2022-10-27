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
    Modal,
    Alert,
    BackHandler,
} from 'react-native';
import Field from '../LostAndFound/Component/field';
import { Image, View as ViewAnimatable } from 'react-native-animatable';
import { IProfileDataReduxProps } from './profileData.container';
import Navbar from '../_global/Navbar';
import colors from '../../constants/colors';
import { Navigation } from 'react-native-navigation';
import { mainmenu, restoMain } from '../../utils/navigationControl';
import {
    heightPercentageToDP,
    heightPercentageToDP as hp,
    scale,
    widthPercentageToDP,
    widthPercentageToDP as wp,
} from '../../utils/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ButtonPrimary } from '../_global/Button';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { toast, validatePhoneNumber } from '../../utils/handleLogic';
import User from '../../images/user.svg';
import Phone from '../../images/phone.svg';
import Email from '../../images/email.svg';
import Password from '../../images/Password.svg';
import FieldFormWithMask from '../LostAndFound/Component/FieldFormWithMask';
import Dot_checked from '../../images/radio_btn_checked.svg';
import Dot_unchecked from '../../images/radio_btn_unchecked.svg';

// import { TextInput } from 'react-native-gesture-handler';
import DropShadow from 'react-native-drop-shadow';
import { RootContainer } from '../_global/Container';

export interface IProfileDataProps extends IProfileDataReduxProps {
    componentId: string;
}

interface IProfileDataState {
    loading: boolean;
    code: string;
    marginLeft: number;
    modalVisible: boolean;
    email: string;
    password: string;
    type: string;
    profileData: any;
    full_name: string;
    phone_number: string;
    resourcePath: object;
    imageSelected: boolean;
    new_password: string;
    confirm_New_Password: string;
    login_with: any;
    address_1: any;
    address_2: any;
    city: any;
    state: any;
    postal_code: any;
    country_code: any;
    address_type: any;
}

class ProfileData extends React.Component<IProfileDataProps, IProfileDataState> {
    constructor(props: IProfileDataProps) {
        super(props);
        this.state = {
            loading: false,
            code: '',
            marginLeft: scale.w(100),
            modalVisible: false,
            email: '',
            password: '',
            new_password: '',
            type: '',
            profileData: this.props.profileData ? this.props.profileData : {},
            full_name: this.props.profileData?.full_name,
            phone_number: this.props.profileData.phone_number ? this.props.profileData.phone_number : '',
            resourcePath:
                this.props.profileData?.profile_image && this.props.profileData?.profile_image != ''
                    ? { uri: this.props.profileData?.profile_image }
                    : {},
            login_with: this.props.profileData?.login_with,
            imageSelected: false,
            confirm_New_Password: '',
            address_1: this.props.profileData.address_line_1 ? this.props.profileData.address_line_1 : '',
            address_2: this.props.profileData.address_line_2 ? this.props.profileData.address_line_2 : '',
            city: this.props.profileData.city ? this.props.profileData.city : '',
            state: this.props.profileData.state ? this.props.profileData.state : '',
            postal_code: this.props.profileData.postal_code ? this.props.profileData.postal_code : '',
            country_code: this.props.profileData.country_code ? this.props.profileData.country_code : '',
            address_type: this.props.profileData.address_type ? this.props.profileData.address_type : 'home',
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleUpdateProfile = this._handleUpdateProfile.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        Navigation.pop(this.props.componentId);
        return true;
    }

    _handleBack() {
        if (Platform.OS == 'ios') {
            Navigation.pop(this.props.componentId);
        } else {
            if (this.props.backGround) {
                Navigation.push(this.props.componentId, mainmenu);
            } else {
                Navigation.pop(this.props.componentId);
            }
        }
    }

    _handleUpdateProfile() {
        if (this.state.password != '' && this.state.password != null) {
            if (
                this.state.new_password == null ||
                this.state.new_password == '' ||
                this.state.new_password.length < 6
            ) {
                toast(this.props.selectedLanguage.enter_new_password_min_6_char);
                return 0;
            } else if (
                this.state.confirm_New_Password == null ||
                this.state.confirm_New_Password == '' ||
                this.state.new_password.length < 6
            ) {
                toast(this.props.selectedLanguage.confirm_new_password_min_6_char);
                return 0;
            }
        }
        if (this.state.confirm_New_Password != this.state.new_password) {
            toast(this.props.selectedLanguage.new_password_and_confirm_password_does_not_match);
            return 0;
        }
        if (
            this.state.phone_number == '' ||
            this.state.phone_number == undefined ||
            this.state.phone_number == null
        ) {
            toast(this.props.selectedLanguage.phone_number_cannot_be_empty);
            return 0;
        }
        if (validatePhoneNumber(this.state.phone_number) != true) {
            toast(this.props.selectedLanguage.please_enter_a_valid_phone_number);
            return 0;
        }
        if (this.state.address_1 == '' || this.state.address_1 == undefined || this.state.address_1 == null) {
            toast('Address can not be empty');
            return 0;
        }
        if (this.state.city == '' || this.state.city == undefined || this.state.city == null) {
            toast('City can not be empty');
            return 0;
        }
        if (this.state.state == '' || this.state.state == undefined || this.state.state == null) {
            toast('State can not be empty');
            return 0;
        }
        if (
            this.state.postal_code == '' ||
            this.state.postal_code == undefined ||
            this.state.postal_code == null
        ) {
            toast('Postal code can not be empty');
            return 0;
        }
        if (
            this.state.country_code == '' ||
            this.state.country_code == undefined ||
            this.state.country_code == null
        ) {
            toast('Country code can not be empty');
            return 0;
        }
        this.setState({
            loading: true,
        });

        this.props.updateProfile(
            {
                full_name: this.state.full_name,
                phone_number: this.state.phone_number,
                profile_image:
                    this.state.imageSelected == true
                        ? {
                              uri: this.state.resourcePath?.uri,
                              name:
                                  Platform.OS == 'ios'
                                      ? this.state.resourcePath?.uri.split('/')[
                                            this.state.resourcePath?.uri.split('/').length - 1
                                        ]
                                      : this.state.resourcePath?.fileName,
                              type: this.state.resourcePath?.type,
                          }
                        : null,
                old_password: this.state.password,
                new_password: this.state.new_password,
                address_line_1: this.state.address_1,
                address_line_2: this.state.address_1,
                address_type: this.state.address_type,
                city: this.state.city,
                state: this.state.state,
                postal_code: this.state.postal_code,
                country_code: this.state.country_code,
            },
            () => {
                this.setState({
                    loading: false,
                });
                Navigation.pop(this.props.componentId);
            },
            () => {
                this.setState({
                    loading: false,
                });
                console.log('Update is failed');
            },
        );
    }

    _UploadProfileImage() {
        var options = {
            title: this.props.selectedLanguage.select_image,
            takePhotoButtonTitle: this.props.selectedLanguage.take_photo,
            chooseFromLibraryButtonTitle: this.props.selectedLanguage.choose_from_library,
            cancelButtonTitle: this.props.selectedLanguage.cancel,
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            storageOptions: {
                skipBackup: true,
            },
        };

        ImagePicker.showImagePicker(options, (res) => {
            console.log('Response = ', res);

            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
                // } else if (res.customButton) {
                //   console.log('User tapped custom button: ', res.customButton);
                //   alert(res.customButton);
            } else {
                let source = res;
                this.setState({
                    resourcePath: source,
                });
                this.setState({ imageSelected: true });
            }
        });
        console.log(this.state.resourcePath);
    }

    render() {
        console.log(this.props.profileData);
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
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
                    <View style={{ flex: 1 }}>
                        <RootContainer>
                            <View
                                style={{
                                    height: heightPercentageToDP(14),
                                    backgroundColor: this.props.color,
                                }}
                            >
                                {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                                <Navbar
                                    RightIconColor={colors.WHITE}
                                    RightIconName={'search'}
                                    tintBackColor={colors.WHITE}
                                    titleColor={colors.WHITE}
                                    onClick={this._handleBack}
                                    title={this.props.selectedLanguage.profile}
                                />
                                {/* </ImageBackground> */}
                            </View>
                            <View
                                style={{
                                    width: widthPercentageToDP(100),
                                    backgroundColor: colors.WHITE,
                                    top: -heightPercentageToDP(4.3),
                                    borderTopLeftRadius: scale.w(3.5),
                                    borderTopRightRadius: scale.w(3.5),
                                    paddingTop: heightPercentageToDP(0.75),
                                }}
                            >
                                {/* <View style={{height : heightPercentageToDP(1)}} /> */}
                                {/* <ScrollView> */}
                                <DropShadow
                                    style={{
                                        width: wp(100),
                                        shadowOffset: {
                                            width: 0,
                                            height: 5,
                                        },
                                        shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                    }}
                                >
                                    <View style={{ height: hp(2) }}></View>
                                    <View
                                        style={{
                                            paddingVertical: hp(3),
                                            width: wp(90),
                                            alignSelf: 'center',
                                            paddingHorizontal: wp(4),
                                            // marginTop: hp(4),
                                            backgroundColor: colors.WHITE,
                                            borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                            borderWidth: 1,
                                            marginTop: heightPercentageToDP(1),
                                            borderRadius: scale.w(2),
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto-Bold',
                                                fontSize: scale.w(1.7),
                                                color: colors.DUMMY_COLOR,
                                            }}
                                        >
                                            {' '}
                                            {this.props.selectedLanguage.personal_details}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => this._UploadProfileImage()}
                                            style={{ alignSelf: 'center', paddingVertical: hp(3) }}
                                        >
                                            <Image
                                                onPress={() => this._UploadProfileImage()}
                                                style={{ width: 85, height: 85, borderRadius: 160 / 2 }}
                                                source={
                                                    !this.state.imageSelected
                                                        ? this.state.resourcePath.uri
                                                            ? { uri: this.state.resourcePath.uri }
                                                            : require('../../images/dummyUser.png')
                                                        : { uri: this.state.resourcePath.uri }
                                                }
                                            />
                                        </TouchableOpacity>

                                        <View
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,
                                                paddingHorizontal: wp(1),
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: wp(82),
                                                marginTop: hp(2),
                                                height: hp(6),
                                                borderRadius: scale.w(1.5),
                                            }}
                                        >
                                            <Field
                                                title={this.state.full_name}
                                                placeholder={this.props.selectedLanguage.enter_name}
                                                color={this.props.color}
                                                inputStyle={{
                                                    width: widthPercentageToDP(72),
                                                    paddingHorizontal: widthPercentageToDP(3),
                                                }}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        full_name: value,
                                                    });
                                                }}
                                                value={this.state.full_name}
                                            ></Field>

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
                                                justiifyContent: 'space-between',
                                                width: wp(82),
                                                marginTop: hp(2),

                                                borderRadius: scale.w(1.5),
                                                height: hp(6),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    color: colors.DUMMY_COLOR,
                                                    width: wp(72),
                                                    paddingHorizontal: widthPercentageToDP(3),
                                                }}
                                            >
                                                <FieldFormWithMask
                                                    type="custom"
                                                    options={{ mask: '+9999 999 999 999' }}
                                                    placeholder={
                                                        this.props.selectedLanguage.enter_phone_number
                                                    }
                                                    keyboardType="phone-pad"
                                                    maxLength={18}
                                                    value={this.state.phone_number}
                                                    onChangeText={(val: string) =>
                                                        this.setState({ phone_number: val })
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
                                                height: hp(6),
                                                borderRadius: scale.w(1.5),
                                            }}
                                        >
                                            <Field
                                                placeholder={this.props.selectedLanguage.enter_name}
                                                color={this.props.color}
                                                inputStyle={{
                                                    width: widthPercentageToDP(72),
                                                    paddingHorizontal: widthPercentageToDP(3),
                                                }}
                                                disabled={true}
                                                editable={false}
                                                value={this.props.profileData.email}
                                            ></Field>

                                            <Email
                                                width={widthPercentageToDP(4)}
                                                height={heightPercentageToDP(4)}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,
                                                paddingHorizontal: wp(1),
                                                width: wp(82),
                                                marginTop: hp(2),
                                                borderRadius: scale.w(1.5),
                                            }}
                                        >
                                            <View style={{ height: hp(2) }} />
                                            <View style={{ marginHorizontal: wp(2) }}>
                                                <Text
                                                    style={{
                                                        fontFamily: 'Roboto-Medium',
                                                        color: colors.DUMMY_COLOR,
                                                        paddingHorizontal: widthPercentageToDP(1),
                                                    }}
                                                >
                                                    Address Type
                                                </Text>
                                            </View>
                                            <View style={{ height: hp(1) }} />
                                            <View style={{ flexDirection: 'row', marginHorizontal: wp(2) }}>
                                                <TouchableOpacity
                                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                                    onPress={() => {
                                                        this.setState({
                                                            address_type: 'home',
                                                        });
                                                    }}
                                                >
                                                    <DropShadow
                                                        style={{
                                                            shadowOffset: {
                                                                width: 0,
                                                                height: 3,
                                                            },
                                                            shadowColor: '#000',
                                                            shadowOpacity: 0.16,
                                                            shadowRadius: 6,
                                                        }}
                                                    >
                                                        {this.state.address_type == 'home' ? (
                                                            <Dot_checked
                                                                height={heightPercentageToDP(3)}
                                                                width={heightPercentageToDP(3)}
                                                                fill="red"
                                                            />
                                                        ) : (
                                                            <Dot_unchecked
                                                                height={heightPercentageToDP(3)}
                                                                width={heightPercentageToDP(3)}
                                                            ></Dot_unchecked>
                                                        )}
                                                    </DropShadow>

                                                    <View style={{ width: widthPercentageToDP(2) }} />
                                                    <Text
                                                        style={{
                                                            fontFamily: 'Roboto-Medium',
                                                            color: colors.DUMMY_COLOR,
                                                            paddingHorizontal: widthPercentageToDP(1),
                                                        }}
                                                    >
                                                        Home
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                                    onPress={() => {
                                                        this.setState({
                                                            address_type: 'business',
                                                        });
                                                    }}
                                                >
                                                    <DropShadow
                                                        style={{
                                                            shadowOffset: {
                                                                width: 0,
                                                                height: 3,
                                                            },
                                                            shadowColor: '#000',
                                                            shadowOpacity: 0.16,
                                                            shadowRadius: 6,
                                                        }}
                                                    >
                                                        {this.state.address_type == 'business' ? (
                                                            <Dot_checked
                                                                height={heightPercentageToDP(3)}
                                                                width={heightPercentageToDP(3)}
                                                                fill="red"
                                                            />
                                                        ) : (
                                                            <Dot_unchecked
                                                                height={heightPercentageToDP(3)}
                                                                width={heightPercentageToDP(3)}
                                                            ></Dot_unchecked>
                                                        )}
                                                    </DropShadow>

                                                    <View style={{ width: widthPercentageToDP(2) }} />
                                                    <Text
                                                        style={{
                                                            fontFamily: 'Roboto-Medium',
                                                            color: colors.DUMMY_COLOR,
                                                            paddingHorizontal: widthPercentageToDP(1),
                                                        }}
                                                    >
                                                        Business
                                                    </Text>
                                                </TouchableOpacity>
                                                <View style={{ height: hp(2) }} />
                                            </View>
                                            <View style={{ height: hp(1) }} />

                                            <View
                                                style={{
                                                    height: hp(6),
                                                }}
                                            >
                                                <Field
                                                    title={this.state.address_1}
                                                    onChangeText={(value) => {
                                                        this.setState({
                                                            address_1: value,
                                                        });
                                                    }}
                                                    value={this.state.address_1}
                                                    placeholder={'Address'}
                                                    color={this.props.color}
                                                    inputStyle={{
                                                        width: widthPercentageToDP(72),
                                                        paddingHorizontal: widthPercentageToDP(3),
                                                    }}
                                                ></Field>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,
                                                paddingHorizontal: wp(1),
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: wp(82),
                                                marginTop: hp(2),
                                                height: hp(6),
                                                borderRadius: scale.w(1.5),
                                            }}
                                        >
                                            <Field
                                                title={this.state.city}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        city: value,
                                                    });
                                                }}
                                                value={this.state.city}
                                                placeholder={'City'}
                                                color={this.props.color}
                                                inputStyle={{
                                                    width: widthPercentageToDP(72),
                                                    paddingHorizontal: widthPercentageToDP(3),
                                                }}
                                            ></Field>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,
                                                paddingHorizontal: wp(1),
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: wp(82),
                                                marginTop: hp(2),
                                                height: hp(6),
                                                borderRadius: scale.w(1.5),
                                            }}
                                        >
                                            <Field
                                                title={this.state.state}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        state: value,
                                                    });
                                                }}
                                                value={this.state.state}
                                                placeholder={'State'}
                                                color={this.props.color}
                                                inputStyle={{
                                                    width: widthPercentageToDP(72),
                                                    paddingHorizontal: widthPercentageToDP(3),
                                                }}
                                            ></Field>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,
                                                paddingHorizontal: wp(1),
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: wp(82),
                                                marginTop: hp(2),
                                                height: hp(6),
                                                borderRadius: scale.w(1.5),
                                            }}
                                        >
                                            <Field
                                                title={this.state.postal_code}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        postal_code: value,
                                                    });
                                                }}
                                                value={this.state.postal_code}
                                                placeholder={'Postal Code'}
                                                color={this.props.color}
                                                inputStyle={{
                                                    width: widthPercentageToDP(72),
                                                    paddingHorizontal: widthPercentageToDP(3),
                                                }}
                                            ></Field>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,
                                                paddingHorizontal: wp(1),
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: wp(82),
                                                marginTop: hp(2),
                                                height: hp(6),
                                                borderRadius: scale.w(1.5),
                                            }}
                                        >
                                            <Field
                                                title={this.state.country_code}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        country_code: value,
                                                    });
                                                }}
                                                value={this.state.country_code}
                                                placeholder={'Country Code'}
                                                color={this.props.color}
                                                inputStyle={{
                                                    width: widthPercentageToDP(72),
                                                    paddingHorizontal: widthPercentageToDP(3),
                                                }}
                                            ></Field>
                                        </View>

                                        {this.state.login_with != 'google' ? (
                                            <>
                                                <View
                                                    style={{
                                                        backgroundColor: colors.COM_BACKGROUND,
                                                        paddingHorizontal: wp(1),
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        width: wp(82),
                                                        marginTop: hp(2),

                                                        height: hp(6),
                                                        borderRadius: scale.w(1.5),
                                                    }}
                                                >
                                                    <Field
                                                        title={this.state.password}
                                                        placeholder={
                                                            this.props.selectedLanguage
                                                                .enter_old_password_min_6_char
                                                        }
                                                        color={this.props.color}
                                                        inputStyle={{
                                                            width: widthPercentageToDP(72),
                                                            paddingHorizontal: widthPercentageToDP(3),
                                                        }}
                                                        onChangeText={(val: string) =>
                                                            this.setState({ password: val })
                                                        }
                                                        value={this.state.password}
                                                    ></Field>

                                                    <Password
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

                                                        height: hp(6),
                                                        borderRadius: scale.w(1.5),
                                                    }}
                                                >
                                                    <Field
                                                        title={this.state.new_password}
                                                        placeholder={
                                                            this.props.selectedLanguage
                                                                .enter_new_password_min_6_char
                                                        }
                                                        color={this.props.color}
                                                        inputStyle={{
                                                            width: widthPercentageToDP(72),
                                                            paddingHorizontal: widthPercentageToDP(3),
                                                        }}
                                                        onChangeText={(val: string) =>
                                                            this.setState({ new_password: val })
                                                        }
                                                        value={this.state.new_password}
                                                    ></Field>

                                                    <Password
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

                                                        height: hp(6),
                                                        borderRadius: scale.w(1.5),
                                                    }}
                                                >
                                                    <Field
                                                        title={this.state.confirm_New_Password}
                                                        placeholder={
                                                            this.props.selectedLanguage
                                                                .confirm_new_password_min_6_char
                                                        }
                                                        color={this.props.color}
                                                        inputStyle={{
                                                            width: widthPercentageToDP(72),
                                                            paddingHorizontal: widthPercentageToDP(3),
                                                        }}
                                                        onChangeText={(val: string) =>
                                                            this.setState({ confirm_New_Password: val })
                                                        }
                                                        value={this.state.confirm_New_Password}
                                                    ></Field>

                                                    <Password
                                                        width={widthPercentageToDP(4)}
                                                        height={heightPercentageToDP(4)}
                                                    />
                                                </View>
                                            </>
                                        ) : null}
                                    </View>
                                </DropShadow>
                                <View style={{ height: hp(5) }} />
                                <View
                                    style={{
                                        width: wp(90),
                                        alignSelf: 'center',
                                    }}
                                >
                                    <ButtonPrimary
                                        backgroundColor={this.props.color}
                                        loading={this.state.loading}
                                        onPress={this._handleUpdateProfile}
                                        text={this.props.selectedLanguage.update_profile}
                                        fontSize={scale.w(1.6)}
                                        fontWeight={'bold'}
                                        chainData={this.props.chainData}
                                    />
                                    <View style={{ height: hp(8) }} />
                                </View>

                                <View style={{ height: hp(8) }} />
                                {/* </View> */}
                                {/* </ScrollView> */}
                            </View>
                        </RootContainer>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            // {/* // </ImageBackground> */}
        );
    }
}
export default ProfileData;
