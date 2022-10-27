import React from 'react';
import {
    TouchableOpacity,
    Platform,
    Image,
    ImageStyle,
    ImageBackground,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';
import colors from '../../constants/colors';
import { H4 } from './Text';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import { View as ViewAnimatable } from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
import DropShadow from 'react-native-drop-shadow';
import ImageZoom from 'react-native-image-pan-zoom';
import SnapCarousel from '../_global/Carousel';

interface IServiceModalProps {
    modalVisible: boolean;
    styleImage?: ImageStyle;
    ImageSource?: any;
    ArrayImages?: Array;
    LogoImage?: any;
    title: string;
    titleLabel: string;
    description: string;
    onLeftButton: () => void;
    leftButtonTitle: string;
    loading: boolean;
    onRightButton: () => void;
    rightButtonTitle: string;
    onBackDrop: () => voidServiceModalState;
    buttonPrimaryColor: any;
    DataLeft: any;
    DataRight: any;
    account: any;
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
    coverImage: string;
}

interface IServiceModalState {
    loadingGet: boolean;
    visible: boolean;
    text: string;
    Rloading: boolean;
    RModalVisible: boolean;
    ArrayImages: Array;
    modalHotelLogo: any;
    modelHotelName: string;
    modelHotelOpeningAndClosing: string;
    ImageSource: any;
}

class ServiceModal extends React.PureComponent<IServiceModalProps, IServiceModalState> {
    constructor(props: IServiceModalProps) {
        super(props);
        console.log('prosps', props);
        this.state = {
            ImageSource: require('../../images/restaurant-sample.jpg'),
        };
    }

    render() {
        return (
            <Modal
                visible={this.props.modalVisible}
                style={{
                    flex: 1,
                    margin: -1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    paddingHorizontal: wp(2.5),
                }}
                // transparent={true}
                onBackButtonPress={this.props.onBackDrop}
                onBackdropPress={this.props.onBackDrop}
                animationType="slide"
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderTopLeftRadius: scale.w(2.5),
                        borderTopRightRadius: scale.w(2.5),
                        paddingBottom: hp(3.5),
                    }}
                >
                    <View>
                        <ImageZoom
                            cropWidth={widthPercentageToDP(96)}
                            cropHeight={heightPercentageToDP(25)}
                            imageWidth={widthPercentageToDP(96)}
                            imageHeight={heightPercentageToDP(25)}
                        >
                            {/* <TouchableOpacity
                        onPress={()=>alert(JSON.stringify(this.props.ArrayImages))}
                        > */}
                            <Image
                                resizeMode={'cover'}
                                source={{ uri: this.props.coverImage }}
                                style={{
                                    width: '100%',
                                    height: hp(75),
                                    // alignSelf: 'center',
                                    borderTopLeftRadius: scale.w(2.5),
                                    borderTopRightRadius: scale.w(2.5),
                                }}
                            />
                            {/* <Image
                                source={{
                                    uri: this.props.coverImage,
                                }}
                                style={{
                                    width: '99.6%',
                                    height: hp(75),
                                    // alignSelf: 'center',
                                    borderTopLeftRadius: scale.w(2.5),
                                    borderTopRightRadius: scale.w(2.5),
                                }}
                                indicator={<ActivityIndicator />}
                                resizeMode={'cover'}
                                indicatorProps={{
                                    size: 20,
                                    borderWidth: 0,
                                    color: 'rgba(150, 150, 150, 1)',
                                    unfilledColor: 'rgba(200, 200, 200, 0.2)',
                                }}
                                imageStyle={{
                                    borderTopLeftRadius: scale.w(2.5),
                                    borderTopRightRadius: scale.w(2.5),
                                }}
                            /> */}
                            {/* </TouchableOpacity> */}
                        </ImageZoom>
                        <View
                            style={{
                                alignItems: 'flex-end',
                                position: 'absolute',
                                flexDirection: 'row',
                                marginTop: hp(19.3),
                                paddingHorizontal: wp(4.5),
                            }}
                        >
                            <ScrollView horizontal={true}>
                                {this.props.ArrayImages.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => this.setState({ ImageSource: { uri: item } })}
                                            style={{
                                                borderWidth: 2.5,
                                                borderColor: '#FFF',
                                                marginLeft: index !== 0 ? 5 : 0,
                                                borderRadius: scale.w(0.5),
                                            }}
                                        >
                                            <Image
                                                source={{ uri: item }}
                                                style={{
                                                    width: heightPercentageToDP(4),
                                                    height: heightPercentageToDP(4),
                                                }}
                                                resizeMode={'cover'}
                                            />
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                        <DropShadow
                            style={{
                                width: scale.w(8),
                                height: scale.w(8),
                                shadowOffset: {
                                    width: 0,
                                    height: 8,
                                },
                                shadowColor: '#EFF5FF',
                                shadowOpacity: 1,
                                shadowRadius: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                marginTop: hp(20),
                                marginLeft: wp(73.5),
                            }}
                        >
                            <View
                                style={{
                                    borderRadius: 100,
                                }}
                            >
                                <Image
                                    source={this.props.LogoImage}
                                    style={{
                                        width: scale.w(8),
                                        height: scale.w(8),
                                        borderRadius: scale.w(8) / 2,
                                    }}
                                    resizeMode={'cover'}
                                />
                            </View>
                        </DropShadow>
                        <View
                            style={{
                                width: wp(95),
                                paddingHorizontal: wp(4.5),
                                marginTop: hp(2),
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Bold',
                                    fontSize: scale.w(1.9),
                                    color: colors.ROOM_CLEANING_LIST_HEADER,
                                }}
                            >
                                {this.props.title}
                            </Text>
                            <View style={{ height: heightPercentageToDP(0.2) }} />
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Regular',
                                    fontSize: scale.w(1.3),
                                    color: '#B3B9C7',
                                }}
                            >
                                {/* {this.props.titleLabel} */}
                                {this.props.account?.hotel_details?.data?.country !== null ||
                                this.props.account?.hotel_details?.data?.city !== null ||
                                this.props.account?.hotel_details?.data?.city !== ''
                                    ? this.props.account?.hotel_details?.data?.city +
                                      ' ' +
                                      this.props.account?.hotel_details?.data?.country
                                    : ''}
                            </Text>
                            <View style={{ height: heightPercentageToDP(2.5) }} />
                            <Text
                                multiline={true}
                                style={{
                                    color: colors.SignInUsingColor,
                                    fontFamily: 'Roboto-Regular',
                                    fontSize: scale.w(1.4),
                                    lineHeight: heightPercentageToDP(3.5),
                                    letterSpacing: 0.9,
                                }}
                            >
                                {this.props.description}
                            </Text>
                            <View style={{ height: hp(3) }}></View>

                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    // width: wp(100),
                                }}
                            >
                                <View style={{ width: wp(42) }}>
                                    {/* <Text>{this.props.Data.button_slug}</Text> */}
                                    {this.props?.DataLeft?.button_slug === 'none' ? null : (
                                        <ButtonPrimary
                                            onPress={this.props.onLeftButton}
                                            backgroundColor={this.props.buttonPrimaryColor}
                                            text={this.props.leftButtonTitle}
                                            loading={this.props.loading}
                                            disabled={this.props.loading}
                                            fontSize={scale.w(1.7)}
                                            fontWeight={'bold'}
                                            borderRadius={scale.w(1.5)}
                                            chainData={this.props.chainData}
                                        />
                                    )}
                                </View>

                                <View style={{ width: wp(42) }}>
                                    {this.props?.DataRight?.button_slug === 'none' ? null : (
                                        <ButtonPrimary
                                            onPress={this.props.onRightButton}
                                            backgroundColor={this.props.buttonPrimaryColor}
                                            text={this.props.rightButtonTitle}
                                            loading={this.props.loading}
                                            disabled={this.props.loading}
                                            fontSize={scale.w(1.7)}
                                            fontWeight={'bold'}
                                            borderRadius={scale.w(1.5)}
                                            chainData={this.props.chainData}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default ServiceModal;
