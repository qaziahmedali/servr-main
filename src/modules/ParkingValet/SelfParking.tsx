// screen no 5

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
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Image,
    TextInput,
    BackHandler,
} from 'react-native';
import { View as ViewAnimatable } from 'react-native-animatable';
import { ISelfParkingReduxProps } from './SelfParking.Container';
import base from '../../utils/baseStyles';
import colors from '../../constants/colors';
import { H1, H3, H2 } from '../_global/Text';
import { ButtonPrimary } from '../_global/Button';
import FieldForm from '../CheckIn/Components/FieldForm';
import { Navigation } from 'react-native-navigation';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import { mainmenu, selflparking, valetparkingcomplete } from '../../utils/navigationControl';
import Navbar from '../_global/Navbar';
import { IParkingValetState } from '../../types/parkingValet';
import { parkingValetComplete, chat } from '../../utils/navigationControl';
import * as Animatable from 'react-native-animatable';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FeatherIcons from 'react-native-vector-icons/Feather';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CustomModal from '../_global/CustomModal';
import ProcessComplete from '../_global/processComplete';
import { RootContainer } from '../_global/Container';
import DropShadow from 'react-native-drop-shadow';
import Field from '../LostAndFound/Component/field';
import FieldFormWithMask from '../LostAndFound/Component/FieldFormWithMask';
import Make from '../../images/Make.svg';
import Color from '../../images/Color.svg';
import License from '../../images/License.svg';
import Location from '../../images/noun-location.svg';
import { toast } from '../../utils/handleLogic';

interface ISelfParkingProps extends ISelfParkingReduxProps {
    componentId: string;
    added: boolean;
    item: object;
}

interface ISelfParkingState {
    isLoading: boolean;
    buttonLoader: boolean;
    currentId: number;
    carModel: string;
    licenseNumber: string;
    parkedAt: string;
    request_type: string;
    licenseImage: object;
    imageSelected: boolean;
    manufacturer: string;
    color: string;
    license_plate: string;
    location: string;
    description: string;
    added: boolean;
    showloading: boolean;
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

class SelfParking extends React.Component<ISelfParkingProps, ISelfParkingState> {
    private _modalConfirm = React.createRef<CustomModal>();
    constructor(props: ISelfParkingProps) {
        super(props);

        this.state = {
            isLoading: false,
            buttonLoader: false,
            currentId: 0,
            // carModel: this.props.item && this.props.item.model_name ? this.props.item.model_name : '',
            // licenseNumber: 'image/jpeg',
            // parkedAt:
            //     this.props.item && this.props.item.parking_slot_no ? this.props.item.parking_slot_no : '',
            // licenseImage: {
            //     uri: this.props.item.number_plate,
            // },
            licenseImage: {
                uri: '',
            },
            imageSelected: false,
            added: this.props.added,
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

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.Primary_Color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._getParkingDetail = this._getParkingDetail.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this.listEmpty = this.listEmpty.bind(this);
        this._requestValet = this._requestValet.bind(this);
        this._handleChat = this._handleChat.bind(this);
        this._UploadLicenseImage = this._UploadLicenseImage.bind(this);
        this._handleValetParking = this._handleValetParking.bind(this);
        this._handleSelfParking = this._handleSelfParking.bind(this);
        this._handleUpdateValetParking = this._handleUpdateValetParking.bind(this);
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

    componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        });
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _getParkingDetail() {
        this.setState({
            isLoading: true,
        });
        this.props.getParkingDetails(
            () => {
                this.setState({
                    isLoading: false,
                });
            },
            () => {
                this.setState({
                    isLoading: false,
                });
            },
        );
    }

    _requestValet(id: number) {
        this.setState({
            currentId: id,
            buttonLoader: true,
        });
        this.props.requestParkingValet(
            id,
            () => {
                this.setState({
                    buttonLoader: false,
                });
                Navigation.push(this.props.componentId, parkingValetComplete);
                this._getParkingDetail();
            },
            () => {
                this.setState({
                    buttonLoader: false,
                });
            },
        );
    }
    // _UploadLicenseImage() {
    //     var options = {
    //         title: 'Select Image',
    //         mediaType: 'photo',
    //         maxWidth: 300,
    //         maxHeight: 300,
    //         storageOptions: {
    //             skipBackup: true,
    //         },
    //     };

    //     ImagePicker.showImagePicker(options, (res) => {
    //         console.log('Response = ', res);

    //         if (res.didCancel) {
    //             console.log('User cancelled image picker');
    //         } else if (res.error) {
    //             console.log('ImagePicker Error: ', res.error);
    //             // } else if (res.customButton) {
    //             //   console.log('User tapped custom button: ', res.customButton);
    //             //   alert(res.customButton);
    //         } else {
    //             let source = res;
    //             this.setState({
    //                 licenseImage: source,
    //                 imageSelected: true,
    //             });
    //         }
    //     });
    //     console.log(this.state.licenseNumber);
    // }
    _renderItem({ item }: { item: IParkingValetState }) {
        console.log('=====================', item);
        const {
            booking_reference_number,
            car_description,
            color,
            valet_indentifier_number,
            number_plate,
            parking_slot_number,
            request_valet,
            requested,
            accepted,
            rejected,
        } = this.props.selectedLanguage;
        return (
            <View style={styles.ItemContainer}>
                <View>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: scale.w(3),
                            fontWeight: 'bold',
                            color: 'black',
                        }}
                    >
                        {booking_reference_number}:
                        <Text
                            style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: scale.w(2.5),
                                fontWeight: '200',
                                color: '#6D6D6D',
                            }}
                        >
                            {item.booking_reference}
                        </Text>
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: scale.w(2),
                            fontWeight: 'bold',
                            color: 'black',
                        }}
                    >
                        {car_description}:
                        <Text
                            style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: scale.w(2),
                                fontWeight: '200',
                                color: '#6D6D6D',
                            }}
                        >
                            {item.description}
                        </Text>
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: scale.w(3),
                            fontWeight: 'bold',
                            color: 'black',
                        }}
                    >
                        {'model name'}:
                        <Text
                            style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: scale.w(2.5),
                                fontWeight: '200',
                                color: '#6D6D6D',
                            }}
                        >
                            {item.model_name}
                        </Text>
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: 'black',
                        }}
                    >
                        {color}:
                        <Text
                            style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: 14,
                                fontWeight: '200',
                                color: '#6D6D6D',
                            }}
                        >
                            {item.colour}
                        </Text>
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: 'black',
                        }}
                    >
                        {number_plate}:
                        <Text
                            style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: 14,
                                fontWeight: '200',
                                color: '#6D6D6D',
                            }}
                        >
                            {item.number_plate}
                        </Text>
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: 'black',
                        }}
                    >
                        {valet_indentifier_number}:
                        <Text
                            style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: 14,
                                fontWeight: '200',
                                color: '#6D6D6D',
                            }}
                        >
                            {item.valet_id_no}
                        </Text>
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: 'black',
                        }}
                    >
                        {parking_slot_number}:
                        <Text
                            style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: 14,
                                fontWeight: '200',
                                color: '#6D6D6D',
                            }}
                        >
                            {item.parking_slot_no}
                        </Text>
                    </Text>
                </View>
                <TouchableOpacity
                    disabled={item.status !== 'pending'}
                    onPress={() => this._requestValet(item.id)}
                    style={{
                        width: scale.w(300),
                        height: scale.h(40),
                        backgroundColor: this.props.color,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: scale.h(10),
                        marginTop: scale.h(15),
                        marginBottom: scale.h(10),
                        alignSelf: 'center',
                    }}
                >
                    {this.state.buttonLoader && this.state.currentId == item.id ? (
                        <View
                            style={{
                                width: widthPercentageToDP(20),
                                height: heightPercentageToDP(3.5),
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                resizeMode="cover"
                                style={{
                                    height: heightPercentageToDP(4),
                                    width: widthPercentageToDP(18),
                                    marginTop: -heightPercentageToDP(1),
                                }}
                                source={{ uri: this.state.chainData.data.logo_gif_light }}
                            />
                        </View>
                    ) : (
                        <Text
                            style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: 14,
                                fontWeight: '200',
                                color: '#fff',
                            }}
                        >
                            {item.status == 'pending'
                                ? `${request_valet}`
                                : item.status == 'requested'
                                ? `${requested}`
                                : item.status == 'accepted'
                                ? `${accepted}`
                                : `${rejected}`}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    listEmpty() {
        const { live_chat } = this.props.selectedLanguage;
        const { color } = this.props;
        return (
            <View
                style={{
                    paddingTop: heightPercentageToDP(10),
                }}
            >
                {this.state.isLoading ? (
                    <View
                        style={{
                            width: widthPercentageToDP(70),
                            height: scale.h(80),
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {this.props.primaryColor == '#72D7FF' ? (
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                source={{ uri: this.state.chainData.data.logo_gif_dark }}
                            />
                        ) : (
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                source={{ uri: this.state.chainData.data.logo_gif_dark }}
                            />
                        )}
                    </View>
                ) : (
                    <>
                        <View
                            style={{
                                paddingHorizontal: widthPercentageToDP(5),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <H3 textAlign={'center'}>
                                {
                                    this.props.selectedLanguage
                                        .you_have_no_cars_parked_in_the_valet_please_ask_your_valet_or_concierge_to_register_your_car_within_the_application
                                }
                            </H3>
                        </View>
                        <View
                            style={{
                                marginTop: heightPercentageToDP(3),
                            }}
                        >
                            <Animatable.View
                                useNativeDriver
                                animation="fadeIn"
                                duration={300}
                                style={styles.btn_chat_container}
                            >
                                <ButtonPrimary
                                    onPress={this._handleChat}
                                    text={live_chat}
                                    backgroundColor={color || colors.LIGHT_BLUE}
                                    chainData={this.props.chainData}
                                />
                            </Animatable.View>
                        </View>
                    </>
                )}
            </View>
        );
    }
    _handleChat() {
        Navigation.push(this.props.componentId, chat({ from: 'restaurant' }));
    }

    _handleValetParking() {
        this.setState({
            isLoading: true,
        });
        this.props.addValetParking(
            {
                model_name: this.state.carModel,
                number_plate: {
                    uri: this.state.licenseImage?.uri,
                    name: this.state.licenseImage?.fileName,
                    type: this.state.licenseImage?.type,
                },
                parking_slot_no: this.state.parkedAt,
                booking_reference: this.props.bookingReference,
            },
            () => {
                console.log('Valet Parking Added Successfully');
                this.props.getProfile(this.props.token, this.props.code);
                this._modalConfirm.current?.show();
                setTimeout(() => {
                    console.log(this.props.parkingDetails);
                }, 3000);
                this.setState({
                    isLoading: false,
                });
            },
            () => {
                console.log('Valet parking adding failed');
                // Navigation.pop(this.props.componentId);
                this.setState({
                    isLoading: false,
                });
            },
        );
    }

    _handleSelfParking() {
        if (
            this.state.manufacturer == '' ||
            this.state.manufacturer == undefined ||
            this.state.manufacturer == null
        ) {
            toast('Manufacturer can not be empty');
            return 0;
        }
        if (this.state.color == '' || this.state.color == undefined || this.state.color == null) {
            toast('Color can not be empty');
            return 0;
        }
        if (
            this.state.license_plate == '' ||
            this.state.license_plate == undefined ||
            this.state.license_plate == null
        ) {
            toast('License Plate can not be empty');
            return 0;
        }
        // if (
        //     !this.state.imageSelected &&
        //     (this.state.licenseImage?.uri == undefined ||
        //         this.state.licenseImage?.uri == null ||
        //         this.state.licenseImage?.uri == '')
        // ) {
        //     toast('Image should be selected');
        //     return 0;
        // }
        const item = {
            request_type: 'self',
            manufacturer: this.state.manufacturer === undefined ? '' : this.state.manufacturer,
            color: this.state.color === undefined ? '' : this.state.color,
            license_plate: this.state.license_plate === undefined ? '' : this.state.license_plate,
            location: this.state.location === undefined ? '' : this.state.location,
            image:
                this.state.imageSelected == true
                    ? {
                          uri: this.state.licenseImage?.uri,
                          name:
                              Platform.OS == 'ios'
                                  ? this.state.licenseImage?.uri.split('/')[
                                        this.state.licenseImage?.uri.split('/').length - 1
                                    ]
                                  : this.state.licenseImage?.fileName,
                          type: this.state.licenseImage?.type,
                      }
                    : '',
            description: this.state.description === undefined ? '' : this.state.description,
        };
        this.setState({
            showloading: true,
        });
        return new Promise((resolve, reject) => {
            this.props.requestParkingValet(
                item,
                () => {
                    this.setState({ showloading: false });
                    this.props.getParkingDetails();
                    this._modalConfirm.current?.show();
                    resolve(true);
                },
                () => {
                    this.setState({ showloading: false });
                    reject(false);
                },
            );
        });

        // Navigation.push(this.props.componentId, valetparkingcomplete);
    }

    _UploadLicenseImage() {
        var options = {
            title: 'Select Image',
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
                    licenseImage: source,
                    imageSelected: true,
                });
            }
        });
    }

    _handleUpdateValetParking() {
        this.setState({
            isLoading: true,
        });
        const data = {
            model_name: this.state.carModel,
            parking_slot_no: this.state.parkedAt,
            parking_id: this.props.item.id,
            number_plate: {
                uri: this.state.licenseImage?.uri,
                name: this.state.licenseImage?.fileName,
                type: this.state.licenseImage?.type,
            },
        };

        const data2 = {
            model_name: this.state.carModel,
            parking_slot_no: this.state.parkedAt,
            parking_id: this.props.item.id,
            number_plate: null,
        };
        if (this.state.imageSelected) {
            this.props.updateValetParking(
                data,
                () => {
                    console.log('Update Profile Success');
                    this._modalConfirm.current?.show();
                    this.setState({
                        isLoading: false,
                    });
                },
                () => {
                    console.log('Update Profile Failed');
                    this.setState({
                        isLoading: false,
                    });
                },
            );
        } else {
            this.props.updateValetParking(
                data2,
                () => {
                    console.log('Update Profile Success');
                    this._modalConfirm.current?.show();
                    this.setState({
                        isLoading: false,
                    });
                },
                () => {
                    console.log('Update Profile Failed');
                    this.setState({
                        isLoading: false,
                    });
                },
            );
        }
    }

    render() {
        const { color, parkingValetData } = this.props;
        const { parking_details } = this.props.selectedLanguage;
        console.log('datatataatata', this.props);
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
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
                        backgroundColor={this.props.Primary_Color}
                        processImage={require('../../images/paymentPageImg.png')}
                        processTitle={
                            this.state.added
                                ? this.props.selectedLanguage.valet_parking_updated_successfully
                                : this.props.selectedLanguage.valet_parking_added_successfully
                        }
                        processDescription={
                            this.props.selectedLanguage.your_request_for +
                            ' ' +
                            this.props.selectedLanguage.valet_parking_has_been_submitted_successfully
                        }
                        onButtonPress={() => {
                            this._modalConfirm.current.hide();
                            Navigation.pop(this.props.componentId);
                        }}
                        btnText={this.props.selectedLanguage.go_to_home}
                        chainData={this.props.chainData}
                    />
                </CustomModal>

                <ScrollView>
                    <View style={{ flex: 1 }}>
                        <RootContainer>
                            <View
                                style={{
                                    height: heightPercentageToDP(14),
                                    backgroundColor: this.props.color,
                                }}
                            >
                                <Navbar
                                    tintBackColor={'white'}
                                    titleColor={colors.WHITE}
                                    onClick={this._handleBack}
                                    title={this.props.selectedLanguage.self_parking}
                                />
                            </View>
                            <ScrollView
                                style={{
                                    width: widthPercentageToDP(100),
                                    backgroundColor: colors.WHITE,
                                    top: -heightPercentageToDP(4.3),
                                    borderTopLeftRadius: scale.w(3.5),
                                    borderTopRightRadius: scale.w(3.5),
                                    paddingTop: heightPercentageToDP(3),
                                }}
                            >
                                {/*body start
                                    screen 4
                                    
                                    */}
                                <View style={{ flex: 1, marginTop: 15 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ flex: 1 }}>
                                            <RootContainer>
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
                                                                borderColor:
                                                                    colors.CHECKIN_SCREEN_BORDER_COLOR,
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
                                                                {this.props.selectedLanguage.vehicle_details}
                                                            </Text>
                                                            {/* Manufacturer */}
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
                                                                    title={this.state.manufacturer}
                                                                    placeholder={
                                                                        this.props.selectedLanguage
                                                                            .manufacturer
                                                                    }
                                                                    color={this.props.color}
                                                                    inputStyle={{
                                                                        width: widthPercentageToDP(72),
                                                                        paddingHorizontal:
                                                                            widthPercentageToDP(3),
                                                                    }}
                                                                    onChangeText={(value) => {
                                                                        //todo: handleFullnameChanged
                                                                        this.setState({
                                                                            manufacturer: value,
                                                                        });
                                                                    }}
                                                                    value={this.state.manufacturer}
                                                                ></Field>
                                                                <Make
                                                                    width={widthPercentageToDP(4)}
                                                                    height={heightPercentageToDP(4)}
                                                                />
                                                            </View>
                                                            {/* Color */}
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
                                                                    placeholder={
                                                                        this.props.selectedLanguage.color
                                                                    }
                                                                    color={this.props.color}
                                                                    inputStyle={{
                                                                        width: widthPercentageToDP(72),
                                                                        paddingHorizontal:
                                                                            widthPercentageToDP(3),
                                                                    }}
                                                                    onChangeText={(value) => {
                                                                        //todo: handleFullnameChanged
                                                                        this.setState({
                                                                            color: value,
                                                                        });
                                                                    }}
                                                                    value={this.state.color}
                                                                ></Field>
                                                                <Color
                                                                    width={widthPercentageToDP(4)}
                                                                    height={heightPercentageToDP(4)}
                                                                />
                                                            </View>
                                                            {/* Liscence Plate  */}
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
                                                                    placeholder={
                                                                        this.props.selectedLanguage
                                                                            .license_plate
                                                                    }
                                                                    color={this.props.color}
                                                                    inputStyle={{
                                                                        width: widthPercentageToDP(72),
                                                                        paddingHorizontal:
                                                                            widthPercentageToDP(3),
                                                                    }}
                                                                    onChangeText={(value) => {
                                                                        //todo: handleFullnameChanged
                                                                        this.setState({
                                                                            license_plate: value,
                                                                        });
                                                                    }}
                                                                    value={this.state.license_plate}
                                                                ></Field>
                                                                <License
                                                                    width={widthPercentageToDP(4)}
                                                                    height={heightPercentageToDP(4)}
                                                                />
                                                            </View>
                                                            {/* Enter Location */}
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
                                                                    borderColor: 'red',
                                                                    borderWidth: 0,
                                                                }}
                                                            >
                                                                <Field
                                                                    placeholder={
                                                                        this.props.selectedLanguage
                                                                            .get_my_location
                                                                    }
                                                                    color={this.props.color}
                                                                    inputStyle={{
                                                                        paddingHorizontal:
                                                                            widthPercentageToDP(3),
                                                                    }}
                                                                    onChangeText={(value) => {
                                                                        //todo: handleFullnameChanged
                                                                        this.setState({
                                                                            location: value,
                                                                        });
                                                                    }}
                                                                    value={this.state.location}
                                                                ></Field>
                                                                <Location
                                                                    width={widthPercentageToDP(3)}
                                                                    height={heightPercentageToDP(3)}
                                                                />
                                                            </View>
                                                            {/* Upload Image */}
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
                                                                    placeholder={
                                                                        this.props.selectedLanguage
                                                                            .upload_image
                                                                    }
                                                                    color={this.props.color}
                                                                    inputStyle={{
                                                                        width: widthPercentageToDP(72),
                                                                        paddingHorizontal:
                                                                            widthPercentageToDP(3),
                                                                    }}
                                                                    disabled={true}
                                                                    editable={false}
                                                                    value={this.state.licenseImage}
                                                                ></Field>
                                                                <TouchableOpacity
                                                                    onPress={() => this._UploadLicenseImage()}
                                                                    style={{
                                                                        //   backgroundColor: colors.ANONYMOUS2,
                                                                        backgroundColor:
                                                                            'rgba(56,121,240,0.1)',
                                                                        width: widthPercentageToDP(8),
                                                                        height: widthPercentageToDP(8),
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        borderRadius: scale.w(0.9),
                                                                    }}
                                                                >
                                                                    {this.state.imageSelected == false ? (
                                                                        this.state.licenseImage &&
                                                                        this.state.licenseImage?.uri ? (
                                                                            <Image
                                                                                style={{
                                                                                    height: 40,
                                                                                    width: 40,
                                                                                }}
                                                                                source={{
                                                                                    uri: this.state
                                                                                        .licenseImage.uri,
                                                                                }}
                                                                            ></Image>
                                                                        ) : (
                                                                            <FeatherIcons
                                                                                name="camera"
                                                                                opacity={1}
                                                                                size={scale.w(1.5)}
                                                                                color={
                                                                                    this.props
                                                                                        .Primary_Color === ''
                                                                                        ? colors.BLUE
                                                                                        : this.props
                                                                                              .Primary_Color
                                                                                }
                                                                            />
                                                                        )
                                                                    ) : (
                                                                        <Image
                                                                            style={{ height: 40, width: 40 }}
                                                                            source={{
                                                                                uri: this.state.licenseImage
                                                                                    .uri,
                                                                            }}
                                                                        ></Image>
                                                                    )}
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </DropShadow>
                                                    <View style={{ height: hp(2.5) }} />
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
                                                        <View
                                                            style={{
                                                                paddingVertical: hp(3),
                                                                paddingHorizontal: wp(4),
                                                                width: wp(90),
                                                                alignSelf: 'center',
                                                                borderColor:
                                                                    colors.CHECKIN_SCREEN_BORDER_COLOR,
                                                                borderWidth: 1,
                                                                borderRadius: 15,
                                                                backgroundColor: '#ffff',
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
                                                                {this.props.selectedLanguage.description}
                                                            </Text>
                                                            <View
                                                                style={{
                                                                    height: heightPercentageToDP(0.7),
                                                                }}
                                                            ></View>
                                                            <TextInput
                                                                editable={
                                                                    (this.props.isCheckedIn == true
                                                                        ? false
                                                                        : true) || this.state.bookingFound
                                                                }
                                                                placeholder={
                                                                    this.props.selectedLanguage
                                                                        .type_something_you_want_here
                                                                }
                                                                value={this.state.description}
                                                                multiline={true}
                                                                textAlignVertical="top"
                                                                numberOfLines={2}
                                                                onChangeText={(note) =>
                                                                    this.setState({
                                                                        description: note,
                                                                    })
                                                                }
                                                                autoCapitalize="none"
                                                                style={{
                                                                    fontSize: scale.w(1.6),
                                                                    color: '#C5CEE0',
                                                                    width: wp(80),
                                                                }}
                                                                placeholderTextColor={'#C5CEE0'}
                                                            ></TextInput>
                                                        </View>
                                                    </DropShadow>
                                                </View>
                                            </RootContainer>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: wp(1) }}>
                                    {/* <ButtonPrimary
                                        backgroundColor={
                                            this.props.Primary_Color === ''
                                                ? colors.BLUE
                                                : this.props.Primary_Color
                                        }
                                        onPress={this._handleSelfParking}
                                        // onPress={this._handleSelfParking}
                                        // text={this.props.selectedLanguage.entry_request}
                                        text="Entry Request"
                                        loading={this.state.isLoading}
                                        fontWeight={'bold'}
                                        chainData={this.props.chainData}
                                    /> */}
                                    <View
                                        style={{
                                            width: '100%',
                                            alignItems: 'center',
                                            marginTop: 10,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={this._handleSelfParking}
                                            style={{
                                                backgroundColor: this.props.color,
                                                width: '90%',
                                                height: 55,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 12,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            {this.state.showloading ? (
                                                <ActivityIndicator size="large" color="white" />
                                            ) : (
                                                <Text
                                                    style={{
                                                        fontSize: 18,
                                                        fontFamily: 'Roboto-Medium',
                                                        color: '#fff',
                                                    }}
                                                >
                                                    Entry Request
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </RootContainer>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        paddingBottom: scale.h(20),
    },
    navbar: {
        height: scale.h(56),
        alignItems: 'center',
        justifyContent: 'center',
    },
    MainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale.h(10),
    },
    ItemContainer: {
        backgroundColor: 'white',
        borderRadius: scale.h(10),
        marginHorizontal: scale.w(10),
        marginVertical: scale.w(10),
        paddingVertical: scale.w(12),
        paddingHorizontal: scale.w(15),
        width: scale.w(320),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    btn_chat_container: {
        paddingHorizontal: scale.w(100),
        paddingVertical: scale.w(12),
    },
});

export default SelfParking;
