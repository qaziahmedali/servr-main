import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    Linking,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    SafeAreaView,
    Dimensions,
    Text,
    StatusBar,
    ImageBackground,
} from 'react-native';
import base from '../../utils/baseStyles';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    scale,
    widthPercentageToDP,
    heightPercentageToDP,
} from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import Carousel from 'react-native-snap-carousel';
import { screenWidth } from '../../utils/dimensions';
import { IPromotionDetails } from '../../types/promotion';
import { IPromotionDetailsReduxProps } from './PromotionDetails.Container';
import { H1, ButtonLabel, H4 } from '../_global/Text';
import { ButtonPrimary } from '../_global/Button';
import Lightbox from 'react-native-lightbox';
import ImageZoom from 'react-native-image-pan-zoom';
import Modal from 'react-native-modal';
import { promotionOrder } from '../../utils/navigationControl';
import colors from '../../constants/colors';
import { IFeatureHotel } from '../../types/hotel';
import AttentionModal from '../_global/AttentionModal';
import BackArrow from '../../images/backArrow.svg';
import { RootContainer } from '../_global/Container';

export interface IPromotionDetailsProps extends IPromotionDetailsReduxProps {
    componentId: string;
    promotionDetails: IPromotionDetails;
    idButton: number;
    promotionTitle: string;
}

interface IPromotionDetailsState {
    modalVisible: boolean;
    imageUrl: String;
    loader: boolean;
    visible: boolean;
    text: String;
    index: any;
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

class PromotionDetails extends React.Component<IPromotionDetailsProps, IPromotionDetailsState> {
    constructor(props: IPromotionDetailsProps) {
        super(props);

        this.state = {
            modalVisible: false,
            imageUrl: '',
            loader: true,
            visible: false,
            text: '',
            index: 0,
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
                backgroundColor: this.props.icon.spa_color,
                style: 'light',
            },
        });
        this.getData();
        this._handleBack = this._handleBack.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        // this._handleReserveSpa = this._handleReserveSpa.bind(this);
        // this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
    }

    _isLockFeature(feature?: keyof IFeatureHotel) {
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
    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };
    async getData() {
        this.props.emptyPromotionDetails({ images: [] });
        try {
            await this.props.getPromotionDetails(
                this.props.idHotel,
                this.props.idButton,
                () => {
                    this.setState({ loader: false });
                },
                () => {
                    this.setState({ loader: false });
                },
            );
            // this.setState({
            //     loader : false
            // })
        } catch (e) {
            console.warn(e);
            // this.setState({
            //     loader : false
            // })
        }
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    componentDidMount() {
        this.props.getPromotionDetails(this.props.idHotel, this.props.idButton);
        this.setState({
            chainData: this.props.chainData,
        });
    }
    _handleBack() {
        Navigation.pop(this.props.componentId);
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
        const { promotionDetails, color, promotionTitle } = this.props;
        var promotionDetailsArr: any = [];
        if (promotionDetails.PromotionDetails != null && promotionDetails.PromotionDetails != undefined)
            promotionDetailsArr = Object.values(promotionDetails.PromotionDetails);
        var images;
        var imgs;
        if (promotionDetails.PromotionDetails != null && promotionDetails.PromotionDetails != undefined) {
            images = JSON.stringify(promotionDetails.PromotionDetails.images);
            imgs = JSON.parse(images);
        }
        if (
            promotionDetailsArr.length == 0 ||
            promotionDetailsArr == undefined ||
            promotionDetails.PromotionDetails.images.length === 0
        ) {
            return (
                <View style={{ flex: 1 }}>
                    <Navbar
                        tintBackColor={'black'}
                        titleColor={colors.WHITE}
                        onClick={this._handleBack}
                        title={promotionTitle}
                    />

                    <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center' }}>
                        {!this.state.loader ? (
                            <Text style={{ fontSize: scale.w(2), textAlign: 'center' }}>
                                {this.props.selectedLanguage.no_data_available_to_show}
                            </Text>
                        ) : (
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: '15%',
                                    width: '70%',
                                    //tintColor: color
                                }}
                                source={{ uri: this.state.chainData.data.logo_gif_dark }}
                            ></Image>
                        )}
                    </View>
                </View>
            );
        } else {
            return (
                <View style={base.container}>
                    <Modal
                        onBackdropPress={() => {
                            this.setModalVisible(false);
                        }}
                        isVisible={this.state.modalVisible}
                        animationType="slide"
                        animationInTiming={500}
                        backdropOpacity={0.8}
                        // style={styles.modal}
                        style={[
                            styles.modal,
                            Platform.OS == 'ios' && scale.isIphoneX()
                                ? {
                                      paddingVertical: widthPercentageToDP(2),
                                  }
                                : {},
                        ]}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                // paddingHorizontal: wp(2),
                                alignItems: 'center',
                                marginHorizontal: 0,
                            }}
                        >
                            <View
                                style={{
                                    // position: 'absolute',
                                    // height: '100%',
                                    paddingHorizontal: widthPercentageToDP(5),
                                    paddingTop: heightPercentageToDP(4),
                                    alignSelf: 'flex-start',
                                }}
                            >
                                <TouchableOpacity onPress={() => this.setModalVisible(false)}>
                                    <BackArrow
                                        width={widthPercentageToDP(4)}
                                        height={widthPercentageToDP(4)}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalContainer}>
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
                                            // height: 450,
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
                                                source={{ uri: this.state.imageUrl }}
                                                style={styles.image}
                                            ></Image>
                                        </ImageZoom>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {Platform.OS === 'ios' && (
                        <View
                            style={{
                                width: '100%',
                                height: heightPercentageToDP(20), // For all devices, even X, XS Max
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
                    {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                    <View style={{ flex: 1 }}>
                        <RootContainer>
                            <View
                                style={{
                                    height:
                                        promotionDetailsArr[0].type == 'Map'
                                            ? heightPercentageToDP(100)
                                            : heightPercentageToDP(45),
                                }}
                            >
                                <ImageBackground
                                    resizeMode={'cover'}
                                    style={{
                                        height:
                                            promotionDetailsArr[0].type == 'Map'
                                                ? heightPercentageToDP(100)
                                                : heightPercentageToDP(45),
                                        width: widthPercentageToDP(100),
                                    }}
                                    source={{
                                        uri: promotionDetails.PromotionDetails.images[this.state.index].path,
                                    }}
                                >
                                    <Navbar
                                        tintBackColor={'black'}
                                        titleColor={colors.DARK_GREY}
                                        onClick={this._handleBack}
                                        // title={promotionTitle}
                                    />
                                    {promotionDetailsArr[0].type == 'Map' ? null : (
                                        <View
                                            style={{
                                                alignItems: 'flex-end',
                                                width: widthPercentageToDP(100),
                                                paddingHorizontal: widthPercentageToDP(5),
                                                height: heightPercentageToDP(30),
                                            }}
                                        >
                                            <ScrollView>
                                                {promotionDetails.PromotionDetails.images &&
                                                    promotionDetails.PromotionDetails.images.map(
                                                        (item, index) => {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() =>
                                                                        this.setState({ index: index })
                                                                    }
                                                                    style={{
                                                                        height: 52,
                                                                        width: 52,
                                                                        borderRadius: 5,
                                                                        borderWidth: 2,
                                                                        borderColor: colors.WHITE,
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        marginTop: index == 0 ? 0 : 5,
                                                                    }}
                                                                >
                                                                    <Image
                                                                        source={{ uri: item.path }}
                                                                        style={{
                                                                            height: 49,
                                                                            width: 49,
                                                                            borderRadius: 5,
                                                                        }}
                                                                    ></Image>
                                                                </TouchableOpacity>
                                                            );
                                                        },
                                                    )}
                                            </ScrollView>
                                        </View>
                                    )}
                                </ImageBackground>
                            </View>
                            {promotionDetailsArr[0].type == 'Map' ? null : (
                                <View
                                    style={{
                                        height: heightPercentageToDP(60),
                                        backgroundColor: colors.WHITE,
                                        top: -heightPercentageToDP(4.3),
                                        borderTopLeftRadius: scale.w(3.5),
                                        borderTopRightRadius: scale.w(3.5),
                                        paddingTop: heightPercentageToDP(0.75),
                                        paddingHorizontal: widthPercentageToDP(5),
                                    }}
                                >
                                    <ScrollView>
                                        {promotionDetailsArr[0].type == 'Promotion' ? null : (
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                {promotionDetailsArr[0].experience_booking &&
                                                    promotionDetailsArr[0].type == 'Shuttle' && (
                                                        <View
                                                            style={{
                                                                width: widthPercentageToDP(45),
                                                                marginTop: heightPercentageToDP(10),
                                                            }}
                                                        >
                                                            <ButtonPrimary
                                                                onPress={() => {
                                                                    if (this._isLockFeature()) {
                                                                        return;
                                                                    }
                                                                    Navigation.push(
                                                                        this.props.componentId,
                                                                        promotionOrder({
                                                                            promotionTitle,
                                                                        }),
                                                                    );
                                                                }}
                                                                text={this.props.selectedLanguage.book_now}
                                                                backgroundColor={color || colors.BROWN}
                                                                chainData={this.props.chainData}
                                                            />
                                                        </View>
                                                    )}
                                            </View>
                                        )}
                                        {promotionDetailsArr[0].data != '' && (
                                            <View>
                                                {promotionDetailsArr &&
                                                    promotionDetailsArr.map((data: any, i: any) => {
                                                        if (
                                                            i != promotionDetailsArr.length - 1 &&
                                                            data.data != ''
                                                        ) {
                                                            let obj = JSON.parse(data.data);
                                                            return (
                                                                <View>
                                                                    <View>
                                                                        {(obj.sub_title ||
                                                                            obj.sub_title == '') && (
                                                                            <View>
                                                                                <H1
                                                                                    fontSize={scale.w(2)}
                                                                                    color={colors.BLACK}
                                                                                    marginTop={heightPercentageToDP(
                                                                                        2,
                                                                                    )}
                                                                                >
                                                                                    {obj.sub_title}
                                                                                </H1>
                                                                            </View>
                                                                        )}
                                                                        {obj.text !== '' && (
                                                                            <View>
                                                                                {obj.text &&
                                                                                obj.text != '' ? (
                                                                                    <H1
                                                                                        fontSize={scale.w(2)}
                                                                                        color={colors.BLACK}
                                                                                        marginTop={heightPercentageToDP(
                                                                                            2,
                                                                                        )}
                                                                                    >
                                                                                        {'Description'}
                                                                                    </H1>
                                                                                ) : null}
                                                                                <H4
                                                                                    fontSize={scale.w(1.6)}
                                                                                    color={'#888'}
                                                                                    marginTop={heightPercentageToDP(
                                                                                        0.5,
                                                                                    )}
                                                                                >
                                                                                    {obj.text}
                                                                                </H4>
                                                                            </View>
                                                                        )}
                                                                        {obj.promotion_amount != undefined &&
                                                                            obj.promotion_amount != null &&
                                                                            obj.promotion_amount != '' && (
                                                                                <View>
                                                                                    <H1
                                                                                        fontSize={scale.w(2)}
                                                                                        color={colors.BLACK}
                                                                                    >
                                                                                        {promotionTitle}
                                                                                    </H1>
                                                                                    {/* <ButtonLabel
                                                                                    textAlign="center"
                                                                                    fontSize={scale.w(2.4)}
                                                                                    color={color}
                                                                                >
                                                                                    {'( '}
                                                                                    {obj.promotion_amount}
                                                                                    {' )'}
                                                                                </ButtonLabel> */}
                                                                                </View>
                                                                            )}
                                                                    </View>
                                                                    {obj.promotion_code != undefined &&
                                                                        obj.promotion_code != null &&
                                                                        obj.promotion_code != '' && (
                                                                            <View
                                                                                style={{
                                                                                    paddingVertical:
                                                                                        heightPercentageToDP(
                                                                                            0.5,
                                                                                        ),
                                                                                    paddingHorizontal: '5%',
                                                                                    backgroundColor:
                                                                                        colors.DARK_GREY,
                                                                                    opacity: 0.5,
                                                                                    marginTop:
                                                                                        heightPercentageToDP(
                                                                                            1,
                                                                                        ),
                                                                                    borderRadius: 20,
                                                                                    width: '40%',
                                                                                }}
                                                                            >
                                                                                <Text
                                                                                    style={{
                                                                                        fontSize:
                                                                                            scale.w(1.6),
                                                                                        color: colors.WHITE,
                                                                                        textAlign: 'center',
                                                                                    }}
                                                                                >
                                                                                    {obj.promotion_code}
                                                                                </Text>
                                                                            </View>
                                                                        )}
                                                                    {obj.promotion_description != undefined &&
                                                                        obj.promotion_description != null &&
                                                                        obj.promotion_description != '' && (
                                                                            <View
                                                                                style={{
                                                                                    paddingVertical:
                                                                                        widthPercentageToDP(
                                                                                            2,
                                                                                        ),
                                                                                }}
                                                                            >
                                                                                <H1
                                                                                    fontSize={scale.w(2)}
                                                                                    color={colors.BLACK}
                                                                                    marginTop={heightPercentageToDP(
                                                                                        2,
                                                                                    )}
                                                                                >
                                                                                    {'Description'}
                                                                                </H1>
                                                                                <H4
                                                                                    fontSize={scale.w(1.6)}
                                                                                    color={'#888'}
                                                                                >
                                                                                    {
                                                                                        obj.promotion_description
                                                                                    }
                                                                                </H4>
                                                                            </View>
                                                                        )}
                                                                    {obj.redeem_link != undefined &&
                                                                        obj.redeem_link != null &&
                                                                        obj.redeem_link != '' && (
                                                                            <View
                                                                                style={
                                                                                    styles.btn_primary_container
                                                                                }
                                                                            >
                                                                                <TouchableOpacity
                                                                                    style={{
                                                                                        height: hp('10%'),
                                                                                        alignItems: 'center',
                                                                                        justifyContent:
                                                                                            'center',
                                                                                    }}
                                                                                    onPress={() => {
                                                                                        this._handleRedeem(
                                                                                            obj.redeem_link,
                                                                                        );
                                                                                    }}
                                                                                    activeOpacity={1}
                                                                                >
                                                                                    <View
                                                                                        style={StyleSheet.flatten(
                                                                                            [
                                                                                                styles.btn_container,
                                                                                                {
                                                                                                    height: wp(
                                                                                                        13,
                                                                                                    ),
                                                                                                    width: wp(
                                                                                                        60,
                                                                                                    ),
                                                                                                    borderRadius: 5,
                                                                                                    backgroundColor:
                                                                                                        color,
                                                                                                },

                                                                                                Platform.select(
                                                                                                    {
                                                                                                        ios: {
                                                                                                            shadowColor:
                                                                                                                '#000',
                                                                                                            shadowOffset:
                                                                                                                {
                                                                                                                    width: 0,
                                                                                                                    height: 4,
                                                                                                                },
                                                                                                            shadowOpacity: 0.2,
                                                                                                            shadowRadius: 3,
                                                                                                        },
                                                                                                        android:
                                                                                                            {
                                                                                                                elevation: 8,
                                                                                                            },
                                                                                                    },
                                                                                                ),
                                                                                            ],
                                                                                        )}
                                                                                    >
                                                                                        <H4
                                                                                            textAlign="center"
                                                                                            fontSize={scale.w(
                                                                                                2.0,
                                                                                            )}
                                                                                            color="white"
                                                                                        >
                                                                                            {
                                                                                                this.props
                                                                                                    .selectedLanguage
                                                                                                    .click_here_to_redeem
                                                                                            }
                                                                                        </H4>
                                                                                    </View>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        )}
                                                                    {promotionDetailsArr[0]
                                                                        .experience_booking && (
                                                                        <View
                                                                            style={{
                                                                                width: widthPercentageToDP(
                                                                                    30,
                                                                                ),
                                                                                alignSelf: 'center',
                                                                                marginTop:
                                                                                    heightPercentageToDP(5),
                                                                            }}
                                                                        >
                                                                            <ButtonPrimary
                                                                                onPress={() => {
                                                                                    if (
                                                                                        this._isLockFeature()
                                                                                    ) {
                                                                                        return;
                                                                                    }
                                                                                    Navigation.push(
                                                                                        this.props
                                                                                            .componentId,
                                                                                        promotionOrder({
                                                                                            promotionTitle,
                                                                                        }),
                                                                                    );
                                                                                }}
                                                                                text={
                                                                                    this.props
                                                                                        .selectedLanguage
                                                                                        .avail_now
                                                                                }
                                                                                backgroundColor={
                                                                                    color || colors.BROWN
                                                                                }
                                                                                chainData={
                                                                                    this.props.chainData
                                                                                }
                                                                            />
                                                                        </View>
                                                                    )}
                                                                </View>
                                                            );
                                                        }
                                                    })}
                                            </View>
                                        )}
                                    </ScrollView>
                                </View>
                            )}
                        </RootContainer>
                    </View>
                    {/* </ScrollView> */}
                    <AttentionModal
                        visible={this.state.visible}
                        toggleModal={this.toggleModal}
                        text={this.state.text}
                        attention={this.props.selectedLanguage.attention}
                        ok={this.props.selectedLanguage.ok}
                    />
                </View>
            );
        }
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
        // paddingHorizontal: scale.w(10),
        marginBottom: heightPercentageToDP(3),
        alignItems: 'flex-start',
    },
    logo: {
        width: '100%',
        height: heightPercentageToDP(15),
        resizeMode: 'contain',
        marginTop: heightPercentageToDP(5),
    },
    btn_primary_container: {
        paddingHorizontal: widthPercentageToDP(15),
        paddingTop: heightPercentageToDP(2),
        paddingBottom: heightPercentageToDP(8),
        // alignSelf: 'flex-end',
        // position:'relative'
    },
    btn_container: {
        height: heightPercentageToDP(15),
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginHorizontal: 10,
    },
    modal: {
        height: '100%',
        marginLeft: -1,
        // paddingVertical: 20,
        // marginBottom: -1,
        marginRight: -2,
    },
    image: {
        alignContent: 'center',
        width: '100%',
        height: hp('100%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        // position: 'relative',
    },
});

export default PromotionDetails;
