import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    RefreshControl,
    Alert,
    Keyboard,
    Text,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
} from 'react-native';
import Image from 'react-native-image-progress';
import {
    scale,
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
    widthPercentageToDP,
    heightPercentageToDP,
} from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IRoomCleaningServiceReduxProps } from './RoomCleaningService.Container';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProceedPayment from '../_global/proceedPayment';
import { proceedRoomCleaning } from '../../utils/navigationControl';
import { IFeatureHotel } from '../../types/hotel';
import AttentionModal from '../_global/AttentionModal';
import { toast } from '../../utils/handleLogic';
import DropShadow from 'react-native-drop-shadow';
import ImageZoomModal from '../_global/ImageZoomModal';
import { RootContainer } from '../_global/Container';
interface IRoomCleaningServiceProps extends IRoomCleaningServiceReduxProps {
    componentId: string;
}

interface IRoomCleaningServiceState {
    loadingGet: boolean;
    serviceItems: Array;
    selected: number;
    loading: boolean;
    counterServices: number;
    visible: boolean;
    text: string;
    ZoomImageModal: boolean;
    Image_URL: any;
    modalVisible1: boolean;
    imageURL: any;
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

class RoomCleaningService extends React.Component<IRoomCleaningServiceProps, IRoomCleaningServiceState> {
    constructor(props: IRoomCleaningServiceProps) {
        super(props);

        this.state = {
            loadingGet: true,
            serviceItems: [],
            selected: 0,
            loading: false,
            counterServices: 0,
            visible: false,
            text: '',
            ZoomImageModal: false,
            Image_URL: '',
            modalVisible1: false,
            imageURL: '',
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
        this._handleBack = this._handleBack.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this.changeOrderItem = this.changeOrderItem.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        });
        this.props.roomCleaningItems(
            this.props.code,
            (data?: any) => {
                this.setState({
                    loadingGet: false,
                    serviceItems: data,
                });
            },
            () => {
                this.setState({
                    loadingGet: false,
                });
            },
        );
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _renderItem(item: object) {
        console.log('hjhj', item);
        return (
            <DropShadow
                style={{
                    width: widthPercentageToDP(100),

                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowColor: '#DEE8F1',
                    shadowOpacity: 0.75,
                    shadowRadius: 100,
                    paddingTop: item.index == 0 ? heightPercentageToDP(5) : 0,
                    paddingBottom:
                        this.state.serviceItems.length - 1 == item.index
                            ? heightPercentageToDP(10)
                            : heightPercentageToDP(1.5),
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        borderRadius: scale.w(1.5),
                        alignItems: 'center',
                        backgroundColor: 'white',
                        alignSelf: 'center',
                        // borderRadius: scale.w(10),
                        width: wp(90),
                        //    borderWidth:1,
                        // ...Platform.select({
                        //     ios: {
                        //         shadowColor: '#000',
                        //         shadowOffset: { width: 0, height: 4 },
                        //         shadowOpacity: 0.2,
                        //         shadowRadius: 2,
                        //     },
                        //     android: {
                        //         elevation: 8,
                        //     },
                        // }),
                    }}
                >
                    <DropShadow
                        style={{
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowColor: '#DEE8F1',
                            shadowOpacity: 0.75,
                            shadowRadius: 9,
                            borderRadius: scale.w(0.5),
                        }}
                    >
                        {/* {item.image == 'https://cms.servrhotels.com/images/default.jpg' ||
                        item.image == undefined ||
                        item.image == null ? (
                            <Image
                                resizeMode={'cover'}
                                source={{ uri: 'https://cms.servrhotels.com/images/default.png' }}
                                style={{
                                    borderRadius: scale.w(1.5),
                                    alignSelf: 'center',
                                    height: heightPercentageToDP(10.5),
                                    width: heightPercentageToDP(10.5),
                                }}
                            />
                        ) : ( */}
                        <TouchableOpacity
                            // onPress={() => {
                            //     this.setState({
                            //         modalVisible1: true,
                            //         imageURL: item.image,
                            //     });
                            // }}
                            onPress={() =>
                                this.setState({
                                    ZoomImageModal: true,
                                    Image_URL: item?.item?.image,
                                })
                            }
                        >
                            {/* <Image
                                resizeMode={'cover'}
                                source={{ uri: item.image }}
                                style={{
                                    borderRadius: scale.w(1.5),
                                    alignSelf: 'center',
                                    height: heightPercentageToDP(10.5),
                                    width: heightPercentageToDP(10.5),
                                }}
                            /> */}
                            <Image
                                source={{ uri: item.item?.image }}
                                indicator={<ActivityIndicator />}
                                resizeMode={'cover'}
                                indicatorProps={{
                                    size: 30,
                                    borderWidth: 0,
                                    color: 'rgba(150, 150, 150, 1)',
                                    unfilledColor: 'rgba(200, 200, 200, 0.2)',
                                }}
                                style={{
                                    borderRadius: scale.w(1.5),
                                    alignSelf: 'center',
                                    height: heightPercentageToDP(10.5),
                                    width: heightPercentageToDP(10.5),
                                }}
                                imageStyle={{ borderRadius: scale.w(1.5) }}
                            />
                            {/* <Text>khjhjh</Text> */}
                        </TouchableOpacity>
                        {/* )} */}
                    </DropShadow>
                    <View style={{ marginLeft: widthPercentageToDP(4) }}>
                        <Text
                            style={{
                                fontSize: scale.w(1.75),
                                color: colors.ROOM_CLEANING_LIST_HEADER,
                                fontFamily: 'Roboto-Bold',
                                width: wp(60),
                            }}
                        >
                            {item.item.name}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: scale.w(1.2),
                                    color: colors.ROOM_CLEANING_LIST_SUB_SECTION,
                                    fontFamily: 'Roboto-Regular',
                                }}
                            >
                                {this.props.selectedLanguage.order_room_service}
                            </Text>
                            <TouchableOpacity
                                onPress={() => this.changeOrderItem(item.item, item.index)}
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: item.item.order
                                        ? this.props.icon.concierge_color
                                        : colors.WHITE,
                                    paddingHorizontal: widthPercentageToDP(3),
                                    paddingVertical: heightPercentageToDP(0.3),
                                    borderRadius: scale.w(0.7),
                                    justifyContent: 'center',
                                    borderWidth: 0.5,
                                    borderColor: item.item.order ? 'transparent' : 'rgba(141,145,162,0.27)',
                                }}
                            >
                                <Text
                                    style={{
                                        alignSelf: 'center',
                                        fontFamily: 'Roboto-Bold',
                                        fontSize: scale.w(1.7),
                                        color: item.item.order ? colors.WHITE : '#B3B9C7',
                                    }}
                                >
                                    {this.props.selectedLanguage.add}
                                </Text>
                                <Icon
                                    name={'plus'}
                                    size={20}
                                    color={item.item.order ? colors.WHITE : '#B3B9C7'}
                                ></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </DropShadow>
        );
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

    _handleProceed() {
        if (this._isLockFeature()) {
            return false;
        }
        if (this.state.counterServices > 0) {
            this.setState({
                loading: true,
            });

            setTimeout(() => {
                Navigation.push(
                    this.props.componentId,
                    proceedRoomCleaning({
                        restaurant: this.state.serviceItems,
                    }),
                );
                this.setState({
                    loading: false,
                });
            }, 3000);
        } else {
            toast(this.props.selectedLanguage.please_select_service_to_proceed);
        }
    }

    changeOrderItem(item, index) {
        console.log('item', item);
        console.log('index', index);
        let a = Object.assign([], this.state.serviceItems);
        a[index] = {
            id: item.id,
            image: item.image,
            name: item.name,
            order: item.order == true ? false : true,
        };
        console.log('aa after', a);
        if (!item.order) {
            console.log('if');
            this.setState({
                counterServices: this.state.counterServices + 1,
            });
        } else {
            console.log('else');
            this.setState({
                counterServices: this.state.counterServices - 1,
            });
        }

        this.setState({
            serviceItems: a,
        });
        console.log(a);
    }

    render() {
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
                            backgroundColor: this.props.icon.cleaning_color,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && (
                    <StatusBar backgroundColor={this.props.icon.concierge_color}></StatusBar>
                )}

                <RootContainer>
                    <View
                        style={{
                            height: heightPercentageToDP(14),
                            backgroundColor: this.props.icon.concierge_color,
                        }}
                    >
                        {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                        <Navbar
                            tintBackColor={colors.WHITE}
                            titleColor={colors.WHITE}
                            RightIconName={'search'}
                            RightIconColor={colors.WHITE}
                            onClick={this._handleBack}
                            title={this.props.selectedLanguage.room_cleaning}
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
                        {/* <View style={{ height: hp(3) }}></View> */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <FlatList
                                refreshControl={<RefreshControl refreshing={false} />}
                                ListEmptyComponent={() => {
                                    return (
                                        <View
                                            style={{
                                                paddingTop: heightPercentageToDP(8),
                                            }}
                                        >
                                            {this.state.loadingGet ? (
                                                <View
                                                    style={{
                                                        width: widthPercentageToDP(25),
                                                        height: heightPercentageToDP(60),
                                                        alignSelf: 'center',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Image
                                                        resizeMode="contain"
                                                        style={{
                                                            height: '100%',
                                                            width: '100%',
                                                            tintColor: this.props.icon.concierge_color,
                                                        }}
                                                        Source={{
                                                            uri: this.state.chainData.data.logo_gif_dark,
                                                        }}
                                                    />
                                                </View>
                                            ) : (
                                                <View style={{ marginTop: heightPercentageToDP(15) }}>
                                                    <Text style={{ alignSelf: 'center' }}>
                                                        {this.props.selectedLanguage.no_items_found}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    );
                                }}
                                data={this.state.serviceItems}
                                // extraData={this.state}
                                // keyExtractor={this._keyExtractor}
                                // ListHeaderComponent={this._renderListHeaderComponent}
                                // ItemSeparatorComponent={this._renderItemSeparatorComponent}
                                renderItem={this._renderItem}
                                initialNumToRender={10}
                            />
                        </ScrollView>
                    </View>
                </RootContainer>
                <View
                    style={{
                        height: Platform.OS == 'android' ? '100%' : null,
                        bottom: Platform.OS == 'android' ? null : 0,
                        width: '100%',
                        justifyContent: 'flex-end',
                        position: 'absolute',
                    }}
                >
                    <ProceedPayment
                        backGroundColor={this.props.icon.concierge_color}
                        price={`${this.state.counterServices} ` + this.props.selectedLanguage.added}
                        btnText={this.props.selectedLanguage.checkout}
                        loader={this.state.loading}
                        loaderColor={this.props.icon.concierge_color}
                        onPress={() => this._handleProceed()}
                        total={this.props.selectedLanguage.total}
                    />
                </View>
                <AttentionModal
                    visible={this.state.visible}
                    toggleModal={this.toggleModal}
                    text={this.state.text}
                    attention={this.props.selectedLanguage.attention}
                    ok={this.props.selectedLanguage.ok}
                />
                <ImageZoomModal
                    modalVisible={this.state.ZoomImageModal}
                    onBack={() => this.setState({ ZoomImageModal: false })}
                    onBackDrop={() => this.setState({ ZoomImageModal: false })}
                    Image={{ uri: this.state.Image_URL }}
                    onBackArrow={() => this.setState({ ZoomImageModal: false })}
                />
                {/* <ImageZoomModal
                    modalVisible={this.state.modalVisible1}
                    onBack={() => this.setState({ modalVisible1: false })}
                    onBackDrop={() => this.setState({ modalVisible1: false })}
                    Image={{ uri: this.state.imageURL }}
                    onBackArrow={() => this.setState({ modalVisible1: false })}
                /> */}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    text_container: {
        marginTop: scale.w(10),
        marginBottom: scale.w(40),
        marginHorizontal: scale.w(28),
    },
});

export default RoomCleaningService;
