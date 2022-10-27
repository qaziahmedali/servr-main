import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Text,
    ActivityIndicator,
    Alert,
    ImageBackground,
    Modal,
    BackHandler,
    StatusBar,
} from 'react-native';
import Image from 'react-native-image-progress';
import base from '../../utils/baseStyles';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../utils/dimensions';
import { H3, H4 } from '../_global/Text';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import {
    restaurantService,
    trackingProgress,
    mainmenu,
    orderRoomService,
    bookATable,
} from '../../utils/navigationControl';
import { IRestaurantListReduxProps } from './RestaurantList.Container';
import { IRestaurant } from '../../types/restaurant';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import colors from '../../constants/colors';
import { debounce } from 'lodash';
import AttentionModal from '../_global/AttentionModal';
import ServiceModal from '../_global/serviceModal';
import { isThisSecond } from 'date-fns';
import { timestamp } from 'rxjs/operators';
import { MenuItem } from 'react-native-enhanced-popup-menu';
import DropShadow from 'react-native-drop-shadow';
import CustomModal from '../_global/CustomModal';
import ImageZoom from 'react-native-image-pan-zoom';
import BackArrow from '../../images/backArrow.svg';
import ImageExpandModal from '../_global/imageModal';
import ImageZoomModal from '../_global/ImageZoomModal';
import Animated from 'react-native-reanimated';
import { RootContainer } from '../_global/Container';

export interface IRestaurantListProps extends IRestaurantListReduxProps {
    componentId: string;
    backGround?: boolean;
}

interface IRestaurantListState {
    loadingGet: boolean;
    visible: boolean;
    text: string;
    Rloading: boolean;
    RModalVisible: boolean;
    ArrayImages: Array;
    modalHotelLogo: any;
    modalHotemName: string;
    modelHotelOpeningAndClosing: string;
    ImageSource: string;
    item: any;
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

class RestaurantList extends React.Component<IRestaurantListProps, IRestaurantListState> {
    private _modalImageExpand = React.createRef<CustomModal>();
    constructor(props: IRestaurantListProps) {
        super(props);

        this.state = {
            loadingGet: false,
            visible: false,
            text: '',
            Rloading: false,
            RModalVisible: false,
            modalHotelLogo: '',
            modelHotelName: '',
            modelHotelOpeningAndClosing: '',
            ArrayImages: [],
            item: {},
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
        this._fetch = this._fetch.bind(this);
        this._handleBack = this._handleBack.bind(this);
        this._handleRestaurantList = this._handleRestaurantList.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderListHeaderComponent = this._renderListHeaderComponent.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._handleMyOrders = this._handleMyOrders.bind(this);
        this._listEmptyComponent = this._listEmptyComponent.bind(this);
        this._handleSearch = this._handleSearch.bind(this);
        this._handleBookATable = this._handleBookATable.bind(this);
        this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);

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
            chainData: this.state.chainData,
        });
        this._fetch();
    }
    setModalVisible(visible: boolean) {
        this.setState({ modalVisible1: visible });
    }
    _fetch() {
        this.setState({ loadingGet: true });
        this.props.getRestaurantList(
            this.props.code,
            () => {
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

    _handleRestaurantList(item) {
        console.log(item);
        this.setState({
            item: item,
            modalHotelLogo: item.logo_url,
            modalHotemName: item.name,
            ArrayImages: item.galleries,
            modelHotelOpeningAndClosing: item.opening_time + ' - ' + item.closing_time,
            RModalVisible: true,
            // RModalVisible : true
        });
        // this.setState({
        //     RModalVisible : true
        // })
        // Navigation.push(
        //     this.props.componentId,
        //     restaurantService({
        //         restaurant,
        //         color: this.props.color,
        //         selectedLanguage: this.props.selectedLanguage,
        //         dynamic_buttons: this.props.dynamic_buttons,
        //     }),
        // );
    }

    _handleBookATable(restaurant: IRestaurant) {
        Navigation.push(this.props.componentId, bookATable({ restaurant: restaurant })).then((i) => {
            this.setState({
                RModalVisible: false,
            });
        });
    }

    _handleOrderRoomService(restaurant: IRestaurant) {
        Navigation.push(this.props.componentId, orderRoomService({ restaurant: restaurant })).then((i) => {
            this.setState({
                RModalVisible: false,
            });
        });
    }

    _keyExtractor(item: IRestaurant) {
        return item.id.toString();
    }

    _renderListHeaderComponent() {
        return (
            <View style={styles.text_container}>
                <H4 fontSize={scale.w(18)} textAlign="center">
                    {this.props.selectedLanguage.please_select_a_restaurant_to_continue}
                </H4>
            </View>
        );
    }

    _renderItem({ item, index }: { item: any; index: number }) {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let now_time = `${hours}:${minutes}`;
        console.log(item);
        return (
            <DropShadow
                style={{
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
                    paddingBottom: this.props.restaurants?.length - 1 == index ? heightPercentageToDP(6) : 0,
                    paddingTop: index == 0 ? heightPercentageToDP(4) : 0,
                }}
            >
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
                        marginVertical: heightPercentageToDP(0.7),
                    }}
                >
                    {/* {now_time > item.item.opening_time && now_time < item.item.closing_time ? (
                            <View></View>
                        ) : (
                            <View
                                style={{
                                    // backgroundColor: 'rgba(0,0,0,0.7)',
                                    paddingVertical : heightPercentageToDP(1),
                                    paddingHorizontal : widthPercentageToDP(2),
                                    width: widthPercentageToDP(90),
                                    position: 'absolute',
                                    // top: scale.h(13),
                                    zIndex: 1,
                                    borderRadius: scale.w(2.5),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <H3 fontSize={18} color={colors.WHITE}>
                                    {this.props.selectedLanguage.restaurant_closed}
                                </H3>
                                <H3 marginTop={5} fontSize={15} color={colors.WHITE}>
                                    {this.props.selectedLanguage.opening_timings}
                                </H3>
                                <H3
                                    fontSize={15}
                                    color={colors.WHITE}
                                >{`${item.item.opening_time} - ${item.item.closing_time}`}</H3>
                            </View>
                        )} */}

                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                modalVisible1: true,
                                imageURL: item.logo_url,
                            });
                        }}
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
                                    unfilledColor: 'rgba(200, 200, 200, 0.2)',
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
                        onPress={debounce(() => this._handleRestaurantList(item), 1000, {
                            leading: true,
                            trailing: false,
                        })}
                        activeOpacity={1}
                        style={{ width: '100%' }}
                        // style={{
                        //     marginVertical: heightPercentageToDP(.7),
                        //     alignSelf : 'center',
                        //     width: widthPercentageToDP(90),
                        // }}
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
                                    marginTop: heightPercentageToDP(0.28),
                                    fontSize: scale.w(1.3),
                                    color: '#B3B9C7',
                                    fontFamily: 'Roboto-Regular',
                                }}
                            >{`${this.props.selectedLanguage.restaurant_hours + ' :'} ${
                                item.opening_time
                            } - ${item.closing_time}`}</Text>
                            {/* <H4 textAlign="center" fontSize={scale.w(16), fontWeight : 'bold'}>
                                {item.name}
                            </H4> */}
                        </View>
                    </TouchableOpacity>
                </View>
            </DropShadow>
        );
    }

    _handleMyOrders() {
        if (!this.props.isCheckedIn) {
            this.setState({
                text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
                visible: true,
            });
        } else if (this.props.status == 'pending') {
            this.setState({
                text: this.props.selectedLanguage
                    .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
                visible: true,
            });
        } else {
            Navigation.push(this.props.componentId, trackingProgress);
        }
    }

    _listEmptyComponent() {
        return (
            <View>
                <Text>No restaurants</Text>
            </View>
        );
    }

    _handleSearch() {
        console.log('Search Icon clicked');
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { color } = this.props;
        const { restaurant, my_orders, restaurant_closed } = this.props.selectedLanguage;
        console.log('Printing props,of restauant service == ', this.props);
        console.log('loader ', this.state.loadingGet);
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
                            backgroundColor: this.props.color,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && <StatusBar backgroundColor={this.props.color}></StatusBar>}
                <RootContainer>
                    <View
                        style={{
                            height: heightPercentageToDP(14),
                            backgroundColor: this.props.icon.restaurant_color,
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
                            title={restaurant}
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
                        <FlatList
                            refreshControl={<RefreshControl refreshing={false} onRefresh={this._fetch} />}
                            data={this.props.restaurants}
                            ListEmptyComponent={() => {
                                console.log('hererererer');
                                return (
                                    <View
                                        style={{
                                            height: heightPercentageToDP(90),
                                            width: widthPercentageToDP(100),
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {this.state.loadingGet ? (
                                            <View
                                                style={{
                                                    height: heightPercentageToDP(90),
                                                    width: widthPercentageToDP(100),
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {this.props.primaryColor == '#72D7FF' ? (
                                                    <Image
                                                        resizeMode="contain"
                                                        style={{
                                                            width: widthPercentageToDP(30),
                                                        }}
                                                        source={{
                                                            uri: this.state.chainData.data.logo_gif_light,
                                                        }}
                                                    />
                                                ) : (
                                                    <Image
                                                        resizeMode="contain"
                                                        style={{
                                                            width: widthPercentageToDP(30),
                                                            tintColor: this.props.icon.restaurant_color,
                                                        }}
                                                        source={{
                                                            uri: this.state.chainData.data.logo_gif_light,
                                                        }}
                                                    />
                                                )}
                                            </View>
                                        ) : (
                                            <View
                                                style={{
                                                    height: heightPercentageToDP(90),
                                                    width: widthPercentageToDP(100),
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text style={{ alignSelf: 'center' }}>
                                                    {this.props.selectedLanguage.no_restaurant_found}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            }}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            initialNumToRender={10}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    {/* <Animatable.View
                    useNativeDriver
                    animation="fadeIn"
                    duration={300}
                    style={{ paddingHorizontal: scale.w(57), paddingBottom: scale.w(20) }}
                >
                    <ButtonPrimary
                        // disabled={!this.props.isCheckedIn}
                        onPress={this._handleMyOrders}
                        text={my_orders}
                        backgroundColor={color || colors.BROWN}
                    />
                </Animatable.View> */}
                </RootContainer>
                <AttentionModal
                    visible={this.state.visible}
                    toggleModal={this.toggleModal}
                    text={this.state.text}
                    attention={this.props.selectedLanguage.attention}
                    ok={this.props.selectedLanguage.ok}
                />
                <ServiceModal
                    modalVisible={this.state.RModalVisible}
                    LogoImage={{ uri: this.state.modalHotelLogo }}
                    ImageSource={require('../../images/sliderImage.png')}
                    coverImage={this.props.account.hotel_details?.data?.restaurant_default_img}
                    loading={this.state.Rloading}
                    onBackDrop={() => this.setState({ RModalVisible: false })}
                    onLeftButton={() => this._handleOrderRoomService(this.state.item)}
                    onRightButton={() => this._handleBookATable(this.state.item)}
                    ArrayImages={this.state.ArrayImages}
                    leftButtonTitle={
                        this.props.selectedLanguage[this.props.dynamic_buttons.restaurant[0].button_slug]
                    }
                    rightButtonTitle={
                        this.props.selectedLanguage[this.props.dynamic_buttons.restaurant[1].button_slug]
                    }
                    title={this.state.modalHotemName}
                    titleLabel={`${this.props.selectedLanguage.restaurant_hours + ' :'} ${
                        this.state.modelHotelOpeningAndClosing
                    }`}
                    description={this.state.item?.description}
                    buttonPrimaryColor={this.props.icon.restaurant_color}
                    chainData={this.props.chainData}
                    account={this.props.account}
                    DataLeft={this.props.dynamic_buttons.restaurant[0]}
                    DataRight={this.props.dynamic_buttons.restaurant[1]}
                />

                {/* <Modal
            style={{ 
            backgroundColor: 'rgba(0,0,0,0.7)',
             marginBottom: 150
         //   alignSelf:"center",
            
            
            
            
            }}
            onBackButtonPress={
                () => this.setState({ modalVisible1: false })
            }
            onBackDrop={() => this.setState({ modalVisible1: false })}

                backdropOpacity={0.9}
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible1}
                        //   onRequestClose={() => {
                        //     Alert.alert("Modal has been closed.");
                        //     this.setModalVisible(!modalVisible);
                        //   }}
                        >
                            <View
                            style={{flex:1,    backgroundColor: 'rgba(0,0,0,0.7)',
                        justifyContent:"center"
                        // alignSelf:"center"
                        }}
                            >
               
                      <TouchableOpacity
                                onPress={() => {
                                   this.setState({modalVisible1:false})
                                }}
                                style={{
                                    marginTop:heightPercentageToDP(10),
                                    marginHorizontal:widthPercentageToDP(4.7)
                                }}
                            >
                                <BackArrow
                            width={widthPercentageToDP(4)}
                            height={ widthPercentageToDP(4)}
                            />
                            </TouchableOpacity>
                            <ImageZoom
                                        cropWidth={widthPercentageToDP(100)}
                                        cropHeight={heightPercentageToDP(100)}
                                        imageWidth={widthPercentageToDP(100)}
                                        imageHeight={heightPercentageToDP(100)}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            source={{ uri: this.state.imageURL }}
                                            style={styles.image}
                                        ></Image>
                                        
                                    </ImageZoom>
              
               

                
            </View>
        
        </Modal> */}

                <ImageZoomModal
                    modalVisible={this.state.modalVisible1}
                    onBack={() => this.setState({ modalVisible1: false })}
                    onBackDrop={() => this.setState({ modalVisible1: false })}
                    Image={{ uri: this.state.imageURL }}
                    onBackArrow={() => this.setState({ modalVisible1: false })}
                />
                {/* <ImageExpandModal
                        modalVisible={this.state.modalVisible1}
                        Image={{ uri: this.state.imageURL }}
                        onBack={() => this.setState({ modalVisible1: false })}
                        onBackDrop={() => this.setState({ modalVisible1: false })}
                    /> */}

                {/* <Modal
                    onBackdropPress={() => {
                        this.setModalVisible(false);
                    }}
                    onBackButtonPress={() => {
                        this.setModalVisible(false);
                    }}
                    isVisible={this.state.modalVisible1}
                    animationType="slide"
                    animationInTiming={500}
                    backdropOpacity={0.9}
                    style={styles.modal}
                >
                    <View style={{ flex: 1 }}>
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
                                        alignSelf: 'center',
                                    }}
                                >
                                    <ImageZoom
                                        cropWidth={widthPercentageToDP(100)}
                                        cropHeight={heightPercentageToDP(100)}
                                        imageWidth={widthPercentageToDP(100)}
                                        imageHeight={heightPercentageToDP(100)}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            source={{ uri: this.state.imageURL }}
                                            style={styles.image}
                                        ></Image>
                                    </ImageZoom>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                height: '100%',
                                alignSelf: 'flex-start',
                                paddingHorizontal: widthPercentageToDP(1.2),
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.setModalVisible(false);
                                }}
                            >
                                <Image
                                    source={require('../../images/icon_back.png')}
                                    style={{ width: scale.w(30), height: scale.w(30) }}
                                    resizeMode={'contain'}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal> */}
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
        paddingVertical: 20,
        marginBottom: -1,
    },
    image: {
        alignContent: 'center',
        width: '100%',
        height: heightPercentageToDP('100%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        // position: 'relative',
    },
});

export default RestaurantList;
