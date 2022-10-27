import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    Text,
    TextInput,
    Linking,
    Alert,
    TouchableOpacity,
    BackHandler,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import base from '../../utils/baseStyles';
import { scale, heightPercentageToDP as hp, widthPercentageToDP as wp, heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import colors from '../../constants/colors';
import { ButtonPrimary } from '../_global/Button';
import { spaBookingTime, promotionApplied } from '../../utils/navigationControl';
import MenuButton from '../_global/experienceButton';
import { IExperienceReduxProps } from './Experience.Container';
import Carousel from 'react-native-snap-carousel';
import { screenWidth } from '../../utils/dimensions';
import { IExperience } from '../../types/experience';
import { promotionService, hotelMap, promotionDetails } from '../../utils/navigationControl';
import { getPromotionDetails, emptyPromotionDetails } from '../../actions/action.promotion';
import DIcon from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import { toast } from '../../utils/handleLogic';
import DropShadow from 'react-native-drop-shadow';
import { RootContainer } from '../_global/Container';
import CustomModal from '../_global/CustomModal';

export interface IExperienceProps extends IExperienceReduxProps {
    componentId: string;
    experience: IExperience;
}

interface IExperienceState {
    deliveryOptions: Array;
    open: false;
    value: string;
    data: Array;
    selectedData: string;
    tabSelected: any;
    loading: boolean;
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

class Experience extends React.Component<IExperienceProps, IExperienceState> {
    private _detailModal = React.createRef<CustomModal>();
    constructor(props: IExperienceProps) {
        super(props);

        this.state = {
            open: false,
            value: 'Apple',
            deliveryOptions: [
                { label: 'Apple', value: 'apple' },
                { label: 'Banana', value: 'banana' },
            ],
            data: [
                {
                    id: 0,
                    image: require('../../images/conceirge-sample.jpg'),
                    name: 'Promotions',
                    promoCode: ' Zxcvfn7',
                    description:
                        'Hello this is promotion here we want to share with you according to your previous searches.',
                },
                {
                    id: 1,
                    image: require('../../images/conceirge-sample.jpg'),
                    name: 'Promotions',
                    promoCode: ' Zxcvfn7',
                    description:
                        'Hello this is promotion here we want to share with you according to your previous searches.',
                },
                {
                    id: 2,
                    image: require('../../images/conceirge-sample.jpg'),
                    name: 'Promotions',
                    promoCode: ' Zxcvfn7',
                    description:
                        'Hello this is promotion here we want to share with you according to your previous searches.',
                },
                {
                    id: 3,
                    image: require('../../images/conceirge-sample.jpg'),
                    name: 'Promotions',
                    promoCode: ' Zxcvfn7',
                    description:
                        'Hello this is promotion here we want to share with you according to your previous searches.',
                },
                {
                    id: 4,
                    image: require('../../images/conceirge-sample.jpg'),
                    name: 'Promotions',
                    promoCode: ' Zxcvfn7',
                    description:
                        'Hello this is promotion here we want to share with you according to your previous searches.',
                },
                {
                    id: 5,
                    image: require('../../images/conceirge-sample.jpg'),
                    name: 'Promotions',
                    promoCode: ' Zxcvfn7',
                    description:
                        'Hello this is promotion here we want to share with you according to your previous searches.',
                },
            ],
            selectedData: 'all',
            tabSelected: null,
            loading: false,
            chainData:{
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
                backgroundColor: props.icon.spa_color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handlePromotions = this._handlePromotions.bind(this);
        this._handleHotelMap = this._handleHotelMap.bind(this);
        this._handlePromotionDetail = this._handlePromotionDetail.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);

        // this._handleOrderRoomService = this._handleOrderRoomService.bind(this);


        BackHandler.addEventListener(
            "hardwareBackPress",
            this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        Navigation.pop(this.props.componentId)
        return true;
    }
    componentDidMount() {
        this.setState({
            loading: true
        })
        this.props.getExperience(this.props.idHotel,
            () => {
                console.log('here we are in exp', this.props.experience.experiences.experience_buttons)
                console.log(this.props.experience.experiences.experience_buttons)
                this.setState({
                    data: this.props.experience.experiences.experience_buttons,
                    selectedData: 'all',
                    loading: false
                })
            },
            () => {

            },
        );

    }

    _handlePromotionDetail(idButton: number, promotionTitle: string) {
        console.log('id button', idButton, promotionTitle);
        // console.log("Promotion details called")
        this.props.emptyPromotionDetails({ images: [] });
        Navigation.push(
            this.props.componentId,

            promotionDetails({
                idButton,
                promotionTitle,

            }),
        );

        // Navigation.push(
        //     this.props.componentId,
        //     spaBookingTime({
        //         isReserveSpaType: true,
        //         spa: this.props.spa,
        //     }),
        // );
    }

    // _fetch() {
    //     this.setState({ loadingGet: true });
    //     this.props.getExperience(
    //         this.props.idHotel,
    //         () => {
    //             this.setState({ loadingGet: false });
    //         },
    //         () => {
    //             this.setState({ loadingGet: false });
    //         },
    //     );
    // }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handlePromotions(idButton: number, btnTitle: string) {
        Navigation.push(
            this.props.componentId,
            promotionService({
                idButton,
                btnTitle,
            }),
        );

        // Navigation.push(
        //     this.props.componentId,
        //     spaBookingTime({
        //         isReserveSpaType: true,
        //         spa: this.props.spa,
        //     }),
        // );
    }
    // _handlePromotionDetail(idButton: number, promotionTitle: string) {
    //     emptyPromotionDetails({ images: [] });
    //     Navigation.push(
    //         this.props.componentId,
    //         promotionDetails({
    //             idButton,
    //             promotionTitle,
    //             // name:''
    //         }),
    //     );
    // }
    _handleHotelMap() {
        Navigation.push(this.props.componentId, hotelMap);
        // ({
        //     isReserveSpaType: false,
        //     spa: this.props.spa,
        // }),
    }

    _handleShuttleBusService() {
        // Navigation.push(
        //     this.props.componentId,
        //     spaBookingTime({
        //         isReserveSpaType: false,
        //         spa: this.props.spa,
        //     }),
        // );
    }

    _handleRedeem(redeem_link: any) {
        if (redeem_link.includes('https://www.')) {
            Linking.openURL(redeem_link.toString());
        } else if (redeem_link.indexOf('www') == 0) {
            Linking.openURL('https://' + redeem_link.toString());
        } else {
            Linking.openURL('https://www.' + redeem_link.toString());
        }
    }

    render() {
        const { experience, color } = this.props;
        const experienceArr: any = experience.experiences; //object to array
        // if (experienceArr.length == 0) {
        //     return null;
        // }
        // else{
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} >

                {Platform.OS === 'ios' &&
                    <View style={{
                        width: "100%",
                        height: heightPercentageToDP(20), // For all devices, even X, XS Max
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: this.props.icon.spa_color,
                        borderBottomRightRadius: widthPercentageToDP(7),
                    }}
                    />}
                {Platform.OS === 'android' && <StatusBar backgroundColor={this.props.icon.spa_color}></StatusBar>}
                <View style={{ flex: 1 }}>
                    <RootContainer>

                        <View style={{ height: heightPercentageToDP(14), backgroundColor: this.props.icon.spa_color }} >
                            {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                            <Navbar
                                tintBackColor={colors.WHITE}
                                titleColor={colors.WHITE}
                                RightIconName={'search'}
                                RightIconColor={colors.WHITE}
                                onClick={this._handleBack}
                                title={this.props.selectedLanguage.experience}
                            />
                            {/* </ImageBackground> */}
                        </View>

                        {this.state.loading
                            ?
                            <View style={{ height: heightPercentageToDP(91), width: widthPercentageToDP(100), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.WHITE, top: -heightPercentageToDP(4.3), borderTopLeftRadius: scale.w(3.5), borderTopRightRadius: scale.w(3.5), paddingTop: heightPercentageToDP(.75) }} >

                                {/* <ActivityIndicator color={colors.BLUE}></ActivityIndicator> */}
                                <Image
                                    resizeMode="contain"
                                    style={{
                                        width: widthPercentageToDP(30),

                                        tintColor: this.props.color
                                    }}
                                    source={{uri:this.state.chainData.data.logo_gif_dark}}
                                />
                            </View>
                            :
                            <View style={{ height: heightPercentageToDP(91), width: widthPercentageToDP(100), backgroundColor: colors.WHITE, top: -heightPercentageToDP(4.3), borderTopLeftRadius: scale.w(3.5), borderTopRightRadius: scale.w(3.5), paddingTop: heightPercentageToDP(.75) }} >

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: heightPercentageToDP(1), paddingHorizontal: wp(5) }}>

                                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                                        {
                                            experienceArr?.categories?.length > 0 ?
                                                <DropShadow
                                                    style={{
                                                        shadowOffset: {
                                                            width: 20,
                                                            height: 19,
                                                        },
                                                        shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                                                        shadowOpacity: 0.09,
                                                        shadowRadius: 30,
                                                        borderRadius: scale.w(5),
                                                        paddingTop: heightPercentageToDP(3),
                                                        paddingLeft: this.state.tabSelected == null ? 0 : widthPercentageToDP(5)
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                data: this.props.experience.experiences.experience_buttons,
                                                                selectedData: 'all',
                                                                tabSelected: null
                                                            });
                                                        }}
                                                        style={{
                                                            backgroundColor: this.state.tabSelected == null ? this.props.icon.spa_color : colors.WHITE,
                                                            paddingHorizontal: wp(7),
                                                            borderRadius: scale.w(5),
                                                            justifyContent: "center",
                                                            alignItems: 'center',
                                                            height: heightPercentageToDP(4)
                                                        }}
                                                    >
                                                        <Text style={{ fontSize: scale.w(1.4), color: this.state.tabSelected == null ? colors.WHITE : colors.DARK_GREY, letterSpacing: .85 }}>{this.props.selectedLanguage.all}</Text>
                                                    </TouchableOpacity>
                                                </DropShadow>
                                                :
                                                null
                                        }
                                        {experienceArr?.categories?.map((data: any, i: any) => {
                                            return (
                                                <DropShadow
                                                    style={{
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        shadowColor: colors.BLACK,
                                                        shadowOpacity: 0.08,
                                                        shadowRadius: 48,
                                                        paddingTop: heightPercentageToDP(3),
                                                        paddingLeft: widthPercentageToDP(5),
                                                        paddingBottom: heightPercentageToDP(1.8)
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            console.log('hello');
                                                            const tempArr = []
                                                            this.setState({
                                                                data: []
                                                            })
                                                            experienceArr.experience_buttons.map((item, i) => {
                                                                if (item.type == data) {
                                                                    tempArr.push(item)
                                                                }
                                                            })
                                                            this.setState({
                                                                selectedData: data,
                                                                data: tempArr,
                                                                tabSelected: i
                                                            });
                                                        }}
                                                        style={{
                                                            backgroundColor: this.state.tabSelected == i ? this.props.icon.spa_color : colors.WHITE,
                                                            paddingHorizontal: wp(7),
                                                            borderRadius: scale.w(5),
                                                            justifyContent: "center",
                                                            alignItems: 'center',
                                                            height: heightPercentageToDP(4)

                                                        }}
                                                    >
                                                        <Text style={{ fontSize: scale.w(1.4), color: this.state.tabSelected == i ? colors.WHITE : colors.DARK_GREY, letterSpacing: .85 }}>
                                                            {data}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </DropShadow>

                                            );
                                        })}
                                    </ScrollView>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            width: wp(100),
                                            justifyContent: "center",
                                        }}
                                    >
                                        {
                                            this.state.data?.length > 0 ?
                                                this.state.data?.map((data, i) => {
                                                    if (this.state.selectedData == data.type || this.state.selectedData == 'all')
                                                        return (
                                                            <DropShadow
                                                                style={{
                                                                    shadowOffset: {
                                                                        width: 0,
                                                                        height: 10,
                                                                    },
                                                                    shadowColor: colors.EXPERIENCE_SCREEN_BOX_SHADOW,
                                                                    shadowOpacity: 0.39,
                                                                    shadowRadius: 28,
                                                                    borderRadius: scale.w(5),
                                                                    paddingTop: heightPercentageToDP(2.5)
                                                                }}
                                                            >
                                                                <View
                                                                    key={i}
                                                                    style={{
                                                                        borderRadius: scale.w(2.0),
                                                                        backgroundColor: '#fff',
                                                                        width: wp(44),
                                                                        marginLeft: i % 2 == 0 ? 0 : widthPercentageToDP(3.5),
                                                                    }}
                                                                >
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                            // console.log('promotion clicked');
                                                                            // if (
                                                                            //     data.data != null &&
                                                                            //     data.data != undefined &&
                                                                            //     data.data['redeem_link'] != null &&
                                                                            //     data.data['redeem_link'] != '' &&
                                                                            //     data.data['redeem_link'] != undefined
                                                                            // ) {
                                                                            //     this._handleRedeem(data.data['redeem_link']);
                                                                            // } else {
                                                                            //     toast('Info, No link found');
                                                                            // }
                                                                            console.log(data);
                                                                            data?.data?.sub_title
                                                                                ? this._handlePromotionDetail(data.id, data.data?.sub_title)
                                                                                : this._handlePromotionDetail(data.id, data?.title);
                                                                        }}
                                                                    >
                                                                        <Image
                                                                            resizeMode={'contain'}
                                                                            source={{ uri: data.icon }}
                                                                            style={{
                                                                                width: wp(44),
                                                                                height: heightPercentageToDP(19.5),
                                                                                borderTopLeftRadius: scale.w(2.0),
                                                                                borderTopRightRadius: scale.w(2.0),
                                                                            }}
                                                                        />
                                                                        {data != null &&
                                                                            data.data &&
                                                                            data.data['promotion_code'] != undefined &&
                                                                            data.data['promotion_code'] != null ? (
                                                                            <View
                                                                                style={{
                                                                                    marginTop: hp(-2),
                                                                                    backgroundColor: this.props.icon.spa_color,
                                                                                    borderRadius: 15,
                                                                                    alignSelf: 'flex-end',
                                                                                    marginRight: wp(2),
                                                                                    paddingVertical: hp(0.5),
                                                                                    paddingHorizontal: widthPercentageToDP(2)
                                                                                }}
                                                                            >
                                                                                <Text
                                                                                    style={{
                                                                                        fontFamily: 'Roboto-Regular',
                                                                                        fontSize: scale.w(1.15),
                                                                                        color: colors.WHITE,
                                                                                        alignSelf: 'center',
                                                                                    }}
                                                                                >
                                                                                    {data.data['promotion_code']}
                                                                                </Text>
                                                                            </View>
                                                                        ) : <View
                                                                            style={{

                                                                                paddingVertical: hp(0.5),
                                                                            }}
                                                                        />}
                                                                        <View
                                                                            style={{
                                                                                paddingBottom: 10,
                                                                                paddingHorizontal: 10,
                                                                                paddingTop: 5,
                                                                                height: heightPercentageToDP(10.5)
                                                                            }}
                                                                        >
                                                                            <Text
                                                                                style={{ fontSize: scale.w(1.6), fontFamily: 'Roboto-Bold' }}
                                                                            >
                                                                                {data.title
                                                                                    ? data.title.trim().length > 17
                                                                                        ? data.title.trim().substring(0, 16) +
                                                                                        '...'
                                                                                        : data.title
                                                                                    : null}
                                                                            </Text>
                                                                            <View style={{ height: heightPercentageToDP(.4) }}></View>
                                                                            {data.data &&
                                                                                data.data['promotion_description'] != undefined &&
                                                                                data.data['promotion_description'] != null ? (
                                                                                <Text
                                                                                    style={{
                                                                                        fontSize: scale.w(1.2),
                                                                                        fontFamily: 'Roboto-Light',
                                                                                        color: colors.BLACK,
                                                                                    }}
                                                                                >
                                                                                    {data.data['promotion_description'].length > 50 ? data.data['promotion_description'].substring(0, 70) + '...' : data.data['promotion_description']}
                                                                                </Text>
                                                                            ) : null}
                                                                            <View style={{ height: hp(1) }} />
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </DropShadow>
                                                        );
                                                })
                                                :
                                                <View style={{ height: hp(60), width: '100%', justifyContent: 'center', alignItems: 'center' }} >
                                                    <Text style={{ fontSize: 18, color: colors.DARK_GREY }} >{this.props.selectedLanguage.no_data_found}</Text>
                                                </View>
                                        }
                                    </View>
                                    <View style={{ height: hp(10) }} />
                                </ScrollView>
                            </View>
                        }
                    </RootContainer>
                </View>
                {/* <CustomModal ref={this._detailModal} >

                </CustomModal> */}
            </KeyboardAvoidingView >
        );
        // }
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
        // paddingVertical: scale.w(10),
        marginBottom: scale.w(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '100%',
        height: scale.w(200),
        resizeMode: 'contain',
        marginTop: scale.w(20),
    },
    allButtons: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale.w(60),
    },
});

export default Experience;
