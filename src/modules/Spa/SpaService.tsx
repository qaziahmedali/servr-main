import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    StatusBar,
    BackHandler,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    Text,
} from 'react-native';
import base from '../../utils/baseStyles';
// import { scale, heightPercentageToDP } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import Image from 'react-native-image-progress';
import { Navigation } from 'react-native-navigation';
import {
    spaBookingTime,
    mainmenu,
    spaTrackingProgress,
    spaorderroomservice,
    spaTreatmentList,
} from '../../utils/navigationControl';
import MenuButton from '../_global/MenuButton';
import { ISpaServiceReduxProps } from './SpaService.Container';
import Carousel from 'react-native-snap-carousel';
import { screenWidth, scale, heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import { IFeatureHotel } from '../../types/hotel';
import colors from '../../constants/colors';
import CustomModal from '../_global/CustomModal';
import { ButtonPrimary } from '../_global/Button';
import * as Animatable from 'react-native-animatable';
import AttentionModal from '../_global/AttentionModal';
import { debounce } from 'lodash';
import ServiceModal from '../_global/serviceModal';
import { toast } from '../../utils/handleLogic';
import { hp } from '../../utils/dimensions';
import DropShadow from 'react-native-drop-shadow';
import ImageZoomModal from '../_global/ImageZoomModal';
import Animated from 'react-native-reanimated';
import { RootContainer } from '../_global/Container';
import { ISpa, ISpaTreatment } from '../../types/spa';

export interface ISpaServiceProps extends ISpaServiceReduxProps {
    componentId: string;
    backGround?: boolean;
    selectedTreatments: ISpaTreatment[];
}

interface ISpaServiceState {
    visible: boolean;
    text: string;
    modalHotelLogo: any;
    RModalVisible: boolean;
    Rloading: boolean;
    ArrayImages: Array;
    modalHotemName: string;
    titleLabel: string;
    spa: any;
    spaItem: any;
    modalVisible: boolean;
    imageURL: any;
    loadingGet: boolean;
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

class SpaService extends React.Component<ISpaServiceProps, ISpaServiceState> {
    constructor(props: ISpaServiceProps) {
        super(props);

        this.state = {
            selectedTreatments: [],
            visible: false,
            text: '',
            modalHotelLogo:
                'https://media.istockphoto.com/photos/pakistan-monument-islamabad-picture-id535695503?k=6&m=535695503&s=612x612&w=0&h=uP8aDK4xlfjk3kEiyr9wwUiuh80UwAiICweFpiBDosk=',
            RModalVisible: false,
            Rloading: false,
            modalHotemName: 'Spa Name',
            titleLabel: 'This is label of title',
            ArrayImages: [
                'https://media.istockphoto.com/photos/pakistan-monument-islamabad-picture-id535695503?k=6&m=535695503&s=612x612&w=0&h=uP8aDK4xlfjk3kEiyr9wwUiuh80UwAiICweFpiBDosk=',
            ],
            spa: [],
            spaItem: null,
            modalVisible: false,
            imageURL: '',
            loadingGet: true,
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
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._fetch();
        this._handleBack = this._handleBack.bind(this);
        this._handleReserveSpa = this._handleReserveSpa.bind(this);
        this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
        this._handleMyOrders = this._handleMyOrders.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
        this._fetch = this._fetch.bind(this);
        this._handleSpaList = this._handleSpaList.bind(this);
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
        // this.props.getSpa();
        console.log('saadccccc', this.props.chainData);
        console.log('spataxes', this.props.hotelTaxes);
    }

    _fetch() {
        this.props.getSpa(
            this.props.code,
            () => {
                this.setState({
                    spa: this.props.spa,
                });
                this.setState({ loadingGet: false });
            },
            () => {
                this.setState({ loadingGet: false });
            },
        );
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

    _handleReserveSpa(spa: any) {
        console.log('spa', spa);
        Navigation.push(
            this.props.componentId,
            spaTreatmentList({
                // treatmentSelectedList: this.state.selectedTreatments,
                spa: spa,
                hotelTaxes: this.props.hotelTaxes,
                // onSubmitSelectedTreatments: (selectedTreatments) => this.setState({ selectedTreatments }),
            }),
        );
        // Navigation.push(
        //     this.props.componentId,
        //     spaBookingTime({
        //         isReserveSpaType: true,
        //         spa: item,
        //     }),
        // ).then((i) => {
        //     this.setState({
        //         RModalVisible: false,
        //     });
        // });
    }

    _handleOrderRoomService(spa: any) {
        Navigation.push(
            this.props.componentId,
            spaorderroomservice({ spa: spa, hotelTaxes: this.props.hotelTaxes }),
            // spaBookingTime({
            //     isReserveSpaType: false,
            //     spa: this.props.spa,
            // }),
        ).then((i) => {
            this.setState({
                RModalVisible: false,
            });
        });
    }

    _handleSpaList(item: any) {
        console.log('spa items=================>', item);
        let temppArray: any = [];
        item.images.map((item: any, index: number) => {
            temppArray.push(item.image_url);
        });
        this.setState({
            ArrayImages: temppArray,
            modalHotelLogo: item.logo_url,
            modalHotemName: item.name,
            titleLabel: item.location,
            spaItem: item,
            RModalVisible: true,
        });
    }
    _isLockFeature(feature?: keyof IFeatureHotel) {
        if (!this.props.isCheckedIn) {
            toast(this.props.selectedLanguage.please_check_in_first_to_use_this_service);

            return true;
        }
    }

    _handleMyOrders() {
        if (!this.props.isCheckedIn) {
            // Alert.alert('Attention', 'Please check in first, to use this service');
            this.setState({
                text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
                visible: true,
            });
        } else if (this.props.status == 'pending') {
            // Alert.alert('Attention', 'To use this feature, your check in must be accepted by hotel admin');
            this.setState({
                text: this.props.selectedLanguage
                    .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
                visible: true,
            });
        } else {
            Navigation.push(this.props.componentId, spaTrackingProgress);
        }
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { spa, color, selectedLanguage, dynamic_buttons } = this.props;
        const button_1 = dynamic_buttons.spa[0].button_slug;
        const button_2 = dynamic_buttons.spa[1].button_slug;
        const { reserve_a_spa_treatment, order_spa_room_service, my_bookings } = selectedLanguage;
        console.log('spaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa            ', this.props.spa);
        return (
            <Animated.View
                useNativeDriver
                animation="fadeInLeft"
                duration={400}
                delay={Math.floor(Math.random() * 100)}
                style={base.container}
            >
                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: heightPercentageToDP(9), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: this.props.icon.spa_color,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && (
                    <StatusBar backgroundColor={this.props.icon.spa_color}></StatusBar>
                )}
                <RootContainer>
                    <View
                        style={{
                            height: heightPercentageToDP(14),
                            backgroundColor: this.props.icon.spa_color,
                        }}
                    >
                        {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                        <Navbar
                            RightIconColor={colors.WHITE}
                            RightIconName={'search'}
                            onSearchClick={this._handleSearch}
                            tintBackColor={colors.WHITE}
                            titleColor={colors.WHITE}
                            onClick={this._handleBack}
                            title={this.props.selectedLanguage.spa_services}
                        />
                        {/* </ImageBackground> */}
                    </View>
                    <View
                        style={{
                            height: heightPercentageToDP(90),
                            width: widthPercentageToDP(100),
                            backgroundColor: colors.WHITE,
                            top: -heightPercentageToDP(4.3),
                            borderTopLeftRadius: scale.w(3.5),
                            borderTopRightRadius: scale.w(3.5),
                            paddingTop: heightPercentageToDP(0.75),
                        }}
                    >
                        {this.state.loadingGet ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    resizeMode="contain"
                                    style={
                                        {
                                            // width: widthPercentageToDP(30),
                                            //tintColor: this.props.icon.spa_color
                                        }
                                    }
                                    source={{ uri: this.props.chainData.data.logo_gif_dark }}
                                />
                            </View>
                        ) : (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View
                                    style={{
                                        marginTop: 3,
                                    }}
                                >
                                    {/* {this.props.spa.spa_room_service == true ? ( */}

                                    {this.state.spa &&
                                        this.state.spa.map((item, index) => {
                                            return (
                                                <DropShadow
                                                    style={{
                                                        marginVertical: heightPercentageToDP(0.7),
                                                        width: widthPercentageToDP(100),
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 10,
                                                        },
                                                        shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                                                        shadowOpacity: 0.09,
                                                        shadowRadius: 50,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        paddingBottom:
                                                            this.state.spa?.length - 1 == index
                                                                ? heightPercentageToDP(6)
                                                                : 0,
                                                        paddingTop: index == 0 ? heightPercentageToDP(3) : 0,
                                                    }}
                                                >
                                                    <View style={styles.menu_btn_container}>
                                                        <View
                                                            style={{
                                                                backgroundColor: 'white',
                                                                borderRadius: scale.w(2.5),
                                                                flexDirection: 'row',
                                                                paddingVertical: heightPercentageToDP(1),
                                                                paddingHorizontal: widthPercentageToDP(2),
                                                                width: widthPercentageToDP(90),
                                                                alignItems: 'center',
                                                                alignSelf: 'center',
                                                            }}
                                                        >
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    this.setState({
                                                                        imageURL: item.logo_url,
                                                                        modalVisible: true,
                                                                    })
                                                                }
                                                            >
                                                                <DropShadow
                                                                    style={{
                                                                        shadowOffset: {
                                                                            width: 0,
                                                                            height: 0,
                                                                        },
                                                                        shadowColor: colors.BLUE,
                                                                        shadowOpacity: 0.1,
                                                                        shadowRadius: 10,
                                                                    }}
                                                                >
                                                                    {/* <Image
                                                                        source={{ uri: item.logo_url }}
                                                                        style={{
                                                                            width: scale.w(8),
                                                                            height: scale.w(8),
                                                                            borderRadius: scale.w(8) / 2,
                                                                        }}
                                                                        resizeMode="cover"
                                                                    /> */}
                                                                    <Image
                                                                        source={{ uri: item.logo_url }}
                                                                        indicator={<ActivityIndicator />}
                                                                        resizeMode={'cover'}
                                                                        indicatorProps={{
                                                                            size: 20,
                                                                            borderWidth: 0,
                                                                            color: 'rgba(150, 150, 150, 1)',
                                                                            unfilledColor:
                                                                                'rgba(200, 200, 200, 0.2)',
                                                                        }}
                                                                        style={{
                                                                            width: scale.w(8),
                                                                            height: scale.w(8),
                                                                        }}
                                                                        imageStyle={{
                                                                            borderRadius: scale.w(1.5),
                                                                        }}
                                                                    />
                                                                </DropShadow>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={debounce(
                                                                    () => this._handleSpaList(item),
                                                                    1000,
                                                                    {
                                                                        leading: true,
                                                                        trailing: false,
                                                                    },
                                                                )}
                                                                activeOpacity={1}
                                                                style={{
                                                                    //alignSelf: 'center',
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        marginLeft: widthPercentageToDP(3.5),
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            fontSize: scale.w(1.9),
                                                                            color: colors.ROOM_CLEANING_LIST_HEADER,
                                                                            fontFamily: 'Roboto-Bold',
                                                                        }}
                                                                    >
                                                                        {item.name}
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            marginTop:
                                                                                heightPercentageToDP(0.28),
                                                                            fontSize: scale.w(1.3),
                                                                            color: '#B3B9C7',
                                                                            fontFamily: 'Roboto-Regular',
                                                                        }}
                                                                    >
                                                                        {/* {item.location} */}
                                                                        {`${
                                                                            this.props.account?.hotel_details
                                                                                ?.data?.country !== null ||
                                                                            this.props.account?.hotel_details
                                                                                ?.data?.city !== null ||
                                                                            this.props.account?.hotel_details
                                                                                ?.data?.city !== ''
                                                                                ? this.props.account
                                                                                      ?.hotel_details?.data
                                                                                      ?.city +
                                                                                  ' ' +
                                                                                  this.props.account
                                                                                      ?.hotel_details?.data
                                                                                      ?.country
                                                                                : ''
                                                                        } `}
                                                                    </Text>
                                                                    {/* <H4 textAlign="center" fontSize={scale.w(16), fontWeight : 'bold'}>
                                {item.name}
                            </H4> */}
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </DropShadow>
                                            );
                                        })}
                                    {/* ) : null}
                            {this.props.spa.spa_treatment == true ? (
                                <View style={styles.menu_btn_container}>
                                    <TouchableOpacity
                                        onPress={debounce(() => this._handleSpaList(), 1000, {
                                            leading: true,
                                            trailing: false,
                                        })}
                                        activeOpacity={1}
                                        style={{
                                            marginVertical: scale.w(5),
                                            alignSelf: 'center',
                                            width: widthPercentageToDP(90),
                                        }}
                                    >
                                        <Animatable.View
                                            useNativeDriver
                                            animation="fadeInLeft"
                                            duration={400}
                                            delay={Math.floor(Math.random() * 100)}
                                            style={{
                                                backgroundColor: 'white',
                                                borderRadius: scale.w(15),
                                                flexDirection: 'row',
                                                paddingVertical: heightPercentageToDP(2),
                                                paddingHorizontal: widthPercentageToDP(2),
                                                width: widthPercentageToDP(85),
                                                alignItems: 'center',
                                                alignSelf: 'center',
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
                                            }}
                                        >
                                            <Image
                                                source={require('../../images/icon_reserve_spa_treatment.png')}
                                                style={{
                                                    width: 70,
                                                    height: 70,
                                                    borderRadius: 100,
                                                }}
                                                resizeMode="contain"
                                            />
                                            <View
                                                style={{
                                                    marginLeft: 15,
                                                }}
                                            >
                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                                    {reserve_a_spa_treatment}
                                                </Text> */}
                                    {/* <Text style={{marginTop : heightPercentageToDP(.5), opacity : .6}} >{`${item.opening_time} - ${item.closing_time}`}</Text> */}
                                    {/* <H4 textAlign="center" fontSize={scale.w(16), fontWeight : 'bold'}>
                                {item.name}
                            </H4> */}
                                    {/* </View>
                                        </Animatable.View>
                                    </TouchableOpacity> */}
                                    {/* <MenuButton
                                    onPress={this._handleReserveSpa}
                                    source={require('../../images/icon_reserve_spa_treatment.png')}
                                    text={reserve_a_spa_treatment}
                                    width={scale.w(155)}
                                    height={scale.h(300)}
                                    iconSize={scale.w(70)}
                                    fontSize={scale.w(20)}
                                    styleImage={{ tintColor: color }}
                                /> */}
                                    {/* </View>
                            ) : null} */}
                                </View>
                                <View style={{ height: 20 }} />
                            </ScrollView>
                        )}
                    </View>
                </RootContainer>
                {/* <Animatable.View
                    useNativeDriver
                    animation="fadeIn"
                    duration={300}
                    style={{ paddingHorizontal: scale.w(57), paddingBottom: scale.w(20) }}
                >
                    <ButtonPrimary
                        // disabled={!this.props.isCheckedIn}
                        onPress={this._handleMyOrders}
                        text={my_bookings}
                        backgroundColor={color || colors.BROWN}
                        // loading={true}
                    />
                </Animatable.View> */}
                <ServiceModal
                    modalVisible={this.state.RModalVisible}
                    LogoImage={{ uri: this.state.modalHotelLogo }}
                    ImageSource={require('../../images/sliderImage.png')}
                    coverImage={this.props.account.hotel_details?.data?.spa_default_img}
                    loading={this.state.Rloading}
                    onBackDrop={() => this.setState({ RModalVisible: false })}
                    onLeftButton={() => this._handleOrderRoomService(this.state.spaItem)}
                    onRightButton={() => this._handleReserveSpa(this.state.spaItem)}
                    ArrayImages={this.state.ArrayImages}
                    leftButtonTitle={order_spa_room_service}
                    rightButtonTitle={reserve_a_spa_treatment}
                    title={this.state.modalHotemName}
                    titleLabel={this.state.titleLabel}
                    description={this.state.spaItem?.description}
                    buttonPrimaryColor={this.props.icon.spa_color}
                    chainData={this.props.chainData}
                    account={this.props.account}
                    DataLeft={this.props.dynamic_buttons.spa[0]}
                    DataRight={this.props.dynamic_buttons.spa[1]}
                />

                <AttentionModal
                    visible={this.state.visible}
                    toggleModal={this.toggleModal}
                    text={this.state.text}
                    attention={this.props.selectedLanguage.attention}
                    ok={this.props.selectedLanguage.ok}
                />
                <ImageZoomModal
                    modalVisible={this.state.modalVisible}
                    onBack={() => this.setState({ modalVisible: false })}
                    onBackDrop={() => this.setState({ modalVisible: false })}
                    Image={{ uri: this.state.imageURL }}
                    onBackArrow={() => this.setState({ modalVisible: false })}
                />
            </Animated.View>
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
        // marginBottom: scale.w(10),
        // alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: scale.w(200),
        resizeMode: 'contain',
        // marginTop: scale.w(20),
    },
});

export default SpaService;
