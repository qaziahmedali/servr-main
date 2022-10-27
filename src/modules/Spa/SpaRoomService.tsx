import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    RefreshControl,
    SafeAreaView,
    FlatList,
    Image,
    TextInput,
    Text,
    Platform,
    ActivityIndicator,
    ImageBackground
} from 'react-native';
import base from '../../utils/baseStyles';
import { scale, widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IRestaurant, IDish, ICategoryDish } from '../../types/restaurant';
import { debounce } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import colors from '../../constants/colors';
import CustomModal from '../_global/CustomModal';
import { H4, H2, H3 } from '../_global/Text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NoteOrderItem from './Components/NoteOrderItem';
import { ISpaRoomServiceReduxProps } from './SpaRoomService.Container';
import numeral from 'numeral';
import { find, findIndex } from 'lodash';
import { IOrderItem } from '../../types/action.restaurant';
import { mycard, OrderRoomServiceAllItems } from '../../utils/navigationControl';
import ImageZoom from 'react-native-image-pan-zoom';
import Modal from 'react-native-modal';
import AttentionModal from '../_global/AttentionModal';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import ProceedPayment from '../_global/proceedPayment'
import FIcon from 'react-native-vector-icons/Entypo'
import ImageExpandModal from '../_global/imageModal'

export interface ISpaRoomServiceProps extends ISpaRoomServiceReduxProps {
    componentId: string;
    restaurant: IRestaurant;
}
interface ISelectedItems extends IOrderItem {
    name: string;
}
interface ISpaRoomServiceState {
    items: ISelectedItems[];
    selectedItem: ISelectedItems;
    loadingGet: boolean;
    loading: boolean;
    selectedVal: any;
    dataToShow: any;
    search: boolean;
    newArray: any;
    check: boolean;
    modalVisible: boolean;
    modalVisible1: boolean;
    imageUrl: String;
    description: any;
    dishName: String;
    item: any;
    visible: boolean;
    text: string;
    total_price: string;
    expandImageModal: boolean;
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

class OrderRoomService extends React.Component<ISpaRoomServiceProps, ISpaRoomServiceState> {
    private _modalNoteOrderItem = React.createRef<CustomModal>();
    private flatlistRef = React.createRef();

    constructor(props: ISpaRoomServiceProps) {
        super(props);
        this.state = {
            items: [],
            selectedItem: {
                dish_id: 0,
                qty: 0,
                note: '',
                name: '',
                rate: 0,
            },
            loadingGet: false,
            loading: false,
            selectedVal: '',
            dataToShow: [],
            search: false,
            newArray: [],
            check: true,
            modalVisible: false,
            modalVisible1: false,
            imageUrl: '',
            description: '',
            dishName: '',
            item: [],
            visible: false,
            text: '',
            total_price: '',
            expandImageModal: false,
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
        this.proceed_to_card = this.proceed_to_card.bind(this);
        this._handleOrderRoomServiceAllItems = this._handleOrderRoomServiceAllItems.bind(this)
    }

    setModalVisible(visible: boolean) {
        this.setState({ modalVisible: visible });
    }
    setModalVisible1(visible: boolean) {
        this.setState({ modalVisible1: visible });
    }

    componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        })
        // this._fetch();
        // this.setState({ dataToShow: this.props.dishesCategories });
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    proceed_to_card() {
        if (this.state.items?.length) {
            Navigation.push(
                this.props.componentId,
                mycard({
                    items: this.state.items,
                    id: this.props.restaurant.id,
                    _substractTotalDish: this._substractTotalDish,
                    _addTotalDish: this._addTotalDish,
                    restaurant: this.props.restaurant,
                }),
            );
        } else {
            this.setState({
                text: this.props.selectedLanguage.please_select_at_least_one_item,
                visible: true,
            });
        }
    }
    _renderItem({ item }: { item: IDish }) {
        const selected = find(this.state.items, { dish_id: item.id });
        const { color, currency } = this.props;
        return (
            <>
                <View
                    style={{
                        borderRadius: scale.w(20),
                        backgroundColor: '#fff',
                        paddingVertical: hp(1.5),
                        paddingHorizontal: wp(2),
                        marginBottom: scale.h(20),
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,
                            },
                            android: {
                                elevation: 2,
                            },
                        }),
                    }}
                >
                    <TouchableOpacity
                        // onPress={() => {
                        //     this.setState({
                        //         imageUrl: item.image,
                        //         description: item.description,
                        //         dishName: item.name,
                        //         item: item,
                        //     });
                        //     this.setModalVisible(true);
                        // }}
                        activeOpacity={1}
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <Image
                            resizeMode={'cover'}
                            source={require('../../images/conceirge-sample.jpg')}
                            style={{
                                width: 75,
                                height: 80,
                                borderRadius: scale.w(10)
                            }}
                        />
                        <View style={{ justifyContent: 'space-between' }} >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: wp(2),
                                    width: wp(65),
                                    alignItems: 'flex-start'
                                }}
                            >
                                <Text style={{ fontSize: scale.w(16), width: wp(45) }} >
                                    {item.name}
                                </Text>
                                <Text style={{ fontSize: scale.w(14) }} >
                                    {/* {`${currency}${numeral(item.price)
                                        .format('0,0a')
                                        .toUpperCase()}`} */}
                                        {`${currency}${parseFloat(item.price)}`}
                                </Text>
                            </View>
                            {/* {`${item.description}` != 'null' &&
                                `${item.description}` != undefined &&
                                `${item.description}` != null && (
                                    <View>
                                        <H4 fontSize={scale.w(12)}>
                                            {item.description
                                                ? item.description.length > 40
                                                    ? item.description.substring(0, 40) + '...'
                                                    : item.description
                                                : null}
                                        </H4>
                                    </View>
                                )} */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: hp(2)
                                }}
                            >

                                {/* <View style={{ width: 5 }} /> */}

                                {/* {selected ? ( */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        borderWidth: 1,
                                        borderRadius: scale.w(8),
                                        borderColor: color || colors.BROWN,
                                        paddingHorizontal: scale.w(5),
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        // width : wp(15),
                                        // flex: 1,
                                        paddingVertical: hp(0.2),
                                    }}
                                >
                                    <TouchableOpacity
                                        disabled={selected && selected.qty == 0 ? true : false}
                                        onPress={() => this._substractTotalDish(item, true)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name="md-remove"
                                            color={colors.GREY}
                                            size={scale.w(18)}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginHorizontal: 5
                                        }}
                                    >
                                        <H4 fontSize={scale.w(14)} >{selected ? selected.qty : 0}</H4>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this._addTotalDish(item, true)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name="md-add"
                                            color={colors.GREY}
                                            size={scale.w(18)}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={debounce(this._handleModalNoteOrderItem(item, false), 1000, {
                                        leading: true,
                                        trailing: false,
                                    })}
                                    activeOpacity={0.7}
                                    style={{ alignSelf: 'center' }}
                                >
                                    <Text style={{ fontSize: scale.w(15), opacity: .4 }} >Add Note</Text>
                                </TouchableOpacity>
                                {/* ) : (
                            <TouchableOpacity
                                onPress={() => this._addTotalDish(item, true)}
                                activeOpacity={0.7}
                                style={{
                                    flex: 1,
                                    width: '80%',
                                    flexDirection: 'row',
                                    paddingVertical: hp(0.2),
                                }}
                            >
                                <View style={{ flex: 0.3 }}></View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        borderWidth: 1,
                                        borderRadius: scale.w(8),
                                        borderColor: color || colors.BROWN,
                                        flex: 0.7,
                                        paddingHorizontal: scale.w(10),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <H4>{this.props.selectedLanguage.add}</H4>
                                    </View>
                                    <Ionicons
                                        name="md-add"
                                        color={color || colors.BROWN}
                                        size={scale.w(22)}
                                    />
                                </View>
                            </TouchableOpacity>
                        )} */}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    Search(val: any) {
        if (val === '') {
            this.setState({ search: false, dataToShow: this.props.dishesCategories });
        } else {
            let arr = this.state.newArray.filter((x: any) => {
                return x.name.toLowerCase().includes(val.toLowerCase());
            });
            this.setState({ dataToShow: arr, search: true });
        }
    }

    _handleOrderRoomServiceAllItems(restaurant: IRestaurant) {
        Navigation.push(this.props.componentId, OrderRoomServiceAllItems({
            restaurant: restaurant
        }));
    }

    render() {
        // const { color, currency } = this.props;
        // const { proceed_to_card } = this.props.selectedLanguage;
        console.log(JSON.stringify(this.props))
        var total_price = 0;
        // this.state.items.map((dish) => {
        //     let row_price = dish.rate * dish.qty;
        //     total_price = total_price + row_price;
        // });
        // if (!this.props.dishesCategories) {
        //     return null;
        // } else {
        return (
            <View style={base.container}>
                <Modal
                    onBackdropPress={() => {
                        this.setModalVisible(false);
                    }}
                    animationType="slide"
                    animationInTiming={500}
                    backdropOpacity={0.7}
                    onSwipeComplete={() => this.setState({ modalVisible: false })}
                    isVisible={this.state.modalVisible}
                    onBackButtonPress={() => {
                        this.setModalVisible(false);
                    }}
                    style={
                        Platform.OS == 'ios' && scale.isIphoneX()
                            ? {
                                paddingVertical: scale.h(45),
                            }
                            : {}
                    }
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingHorizontal: wp(2),
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                backgroundColor: 'white',
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: wp(3),
                            }}
                        >
                            <View style={{ height: hp(4) }} />

                            <H3 fontSize={scale.w(20)}>{this.state.dishName}</H3>

                            {this.state.imageUrl && <View style={{ height: hp(1) }} />}
                            {this.state.imageUrl &&
                                this.state.imageUrl != 'https://cms.servrhotels.com/images/default.jpg' &&
                                this.state.imageUrl !=
                                'http://cms.servrhotels.com/images/default.jpg' && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setTimeout(() => {
                                                this.setModalVisible1(true);
                                            }, 400);
                                            this.setModalVisible(false);
                                        }}
                                        style={{
                                            height: hp(20),
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            source={{ uri: this.state.imageUrl }}
                                            style={{ height: '80%', width: '80%' }}
                                        />
                                    </TouchableOpacity>
                                )}
                            {this.state.imageUrl && <View style={{ height: hp(1) }} />}
                            {this.state.description && (
                                <H4 fontSize={scale.w(12)}>{this.state.description}</H4>
                            )}

                            {this.state.description && <View style={{ height: hp(6) }} />}
                            <TouchableOpacity
                                onPress={() => {
                                    this._addTotalDish(this.state.item);
                                    this.setModalVisible(false);
                                }}
                                style={{
                                    borderRadius: 100,
                                    height: hp(6),
                                    width: wp(40),
                                    backgroundColor: color,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.WHITE,
                                        fontFamily: 'Roboto-Bold',
                                        fontSize: scale.w(14),
                                    }}
                                >
                                    {this.props.selectedLanguage.add_to_order}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ height: hp(4) }} />
                        </View>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            height: '100%',
                            alignSelf: 'flex-start',
                            paddingHorizontal: wp(1.2),
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
                </Modal>
                <Modal
                    onBackdropPress={() => {
                        setTimeout(() => {
                            this.setModalVisible(true);
                        }, 400);
                        this.setModalVisible1(false);
                    }}
                    onBackButtonPress={() => {
                        setTimeout(() => {
                            this.setModalVisible(true);
                        }, 400);
                        this.setModalVisible1(false);
                    }}
                    isVisible={this.state.modalVisible1}
                    animationType="slide"
                    animationInTiming={500}
                    backdropOpacity={0.9}
                    // style={styles.modal}
                    style={[
                        styles.modal,
                        Platform.OS == 'ios' && scale.isIphoneX()
                            ? {
                                paddingVertical: scale.h(45),
                            }
                            : {},
                    ]}
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
                        <View
                            style={{
                                position: 'absolute',
                                height: '100%',
                                alignSelf: 'flex-start',
                                paddingHorizontal: wp(1.2),
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setTimeout(() => {
                                        this.setModalVisible(true);
                                    }, 400);
                                    this.setModalVisible1(false);
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
                </Modal>

                <View style={{ flex: 1 }}>
                    <ImageBackground resizeMode={'cover'} source={{ uri: this.props.restaurant.logo_url }} style={{ height: hp(30), width: wp(100) }} >
                        <View style={{ height: hp(1.5) }} />
                        <Navbar RightIconColor={colors.WHITE} RightIconName={'search'} tintBackColor={colors.WHITE} titleColor={colors.WHITE} onClick={this._handleBack} title={""} />
                        <View style={{
                            width: wp(90),
                            position: 'absolute',
                            alignSelf: 'center',
                            marginTop: hp(18),
                        }} >
                            <TouchableOpacity onPress={() => this.setState({ expandImageModal: true })} style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: hp(1.5) }} >
                                <FIcon name={'resize-full-screen'} color={colors.WHITE} size={25} ></FIcon>
                            </TouchableOpacity>
                            <View style={{
                                width: wp(90),
                                backgroundColor: '#ffff',
                                alignSelf: 'center',
                                elevation: 5,
                                borderRadius: 10,
                                paddingVertical: hp(1.5),
                                paddingHorizontal: wp(5),
                            }} >
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }} >
                                    <View>
                                        <Text style={{ fontSize: scale.w(2.5), fontWeight: 'bold' }} >{this.props.restaurant.name}  <Icon name={'badge'} size={20} color={colors.BLUE} ></Icon></Text>
                                        <Text style={{ fontSize: scale.w(1.5), opacity: 0.5 }} >{
                                            this.props.account?.hotel_details?.data?.city
                                                ? this.props.account?.hotel_details?.data?.city?.length > 15
                                                    ? this.props.account?.hotel_details?.data?.city.substring(0, 15) + '...'
                                                    : this.props.account?.hotel_details?.data?.city
                                                : "" + " " + this.props.account?.hotel_details?.data?.country
                                                    ? this.props.account?.hotel_details?.data?.country.length > 15
                                                        ? this.props.account?.hotel_details?.data?.country.substring(0, 15) + '...'
                                                        : this.props.account?.hotel_details?.data?.country
                                                    : ""
                                        }</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: scale.w(1.5), color: colors.BLUE }} >Working hours</Text>
                                        <Text style={{ fontSize: scale.w(1.5), color: colors.BLUE }} >{this.props.restaurant.opening_time} - {this.props.restaurant.closing_time}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={{ height: hp(5) }} />
                    {this.state.search == false ? (
                        // <>
                        {/* <View
                                    style={{
                                        borderBottomColor: this.props.color,
                                        borderBottomWidth: scale.h(1),
                                        paddingTop: scale.h(10),
                                    }}
                                >
                                    <FlatList
                                        data={this.props.dishesCategories}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.flatlistRef.scrollToIndex({
                                                            animated: true,
                                                            index: index,
                                                        });
                                                    }}
                                                    style={{
                                                        height: scale.h(50),
                                                        minWidth: scale.w(120),
                                                        justifyContent: 'center',
                                                        marginLeft: scale.w(5),
                                                        // backgroundColor:'red',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <H3
                                                        marginLeft={index == 0 ? scale.w(0) : 0}
                                                        fontSize={scale.w(15)}
                                                    >
                                                        {item.title
                                                            ? item.title.length > 12
                                                                ? item.title.substring(0, 12) + '...'
                                                                : item.title
                                                            : null}
                                                    </H3>
                                                </TouchableOpacity>
                                            );
                                        }}
                                    />
                                </View> */}
                                {/* <FlatList
                                    ref={(ref) => {
                                        this.flatlistRef = ref;
                                    }}
                                    refreshControl={
                                        <RefreshControl onRefresh={this._fetch} refreshing={false} />
                                    }
                                    data={this.props.dishesCategories}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View>
                                                {this.state.loadingGet ? (
                                                    <View
                                                        style={{
                                                            width: scale.w(200),
                                                            height: scale.h(80),
                                                            alignSelf: 'center',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginTop: scale.h(200),
                                                        }}
                                                    >
                                                        {this.props.primaryColor == '#72D7FF' ? (
                                                            <Image
                                                                resizeMode="contain"
                                                                style={{
                                                                    height: '100%',
                                                                    width: '100%',
                                                                }}
                                                                source={require('../../images/loading_blue.')}
                                                            />
                                                        ) : (
                                                            <Image
                                                                resizeMode="contain"
                                                                style={{
                                                                    height: '100%',
                                                                    width: '100%',
                                                                }}
                                                                source={require('../../images/loading_gray.gif')}
                                                            />
                                                        )}
                                                    </View>
                                                ) : (
                                                    <View style={{ marginTop: scale.h(250) }}>
                                                        <Text style={{ alignSelf: 'center' }}>
                                                            {this.props.selectedLanguage.no_items_found}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    }}
                                    renderItem={({ item, index }) => {
                                        let MyItem = item;
                                        return (
                                            <View style={{paddingHorizontal: scale.w(20)}} >
                                                {
                                                    index == 0 ?
                                                    <View style={{ flexDirection: 'row', justifyContent : 'space-between', paddingHorizontal : wp(5), paddingVertical : hp(2) }}>
                                <Text style={{fontSize:scale.w(20), fontWeight : 'bold'}} >Main</Text>
                                <TouchableOpacity onPress={() => this._handleOrderRoomServiceAllItems(this.props.restaurant)} >
                                <Text style={{fontSize:scale.w(16), fontWeight : 'bold', color : colors.BLUE}} >See All</Text>
                                </TouchableOpacity>
                            </View>
                            :
                                                <View
                                                    style={{
                                                        paddingBottom: scale.h(15),
                                                        backgroundColor: '#fff',
                                                        marginTop: scale.h(15),
                                                    }}
                                                >
                                                    <H2 fontSize={scale.w(20)}>
                                                        {item.title
                                                            ? item.title.length > 30
                                                                ? item.title.substring(0, 30) + '...'
                                                                : item.title
                                                            : null}
                                                    </H2>
                                                </View>
                                                }
                                                <FlatList
                                                    data={MyItem.data}
                                                    renderItem={this._renderItem}
                                                    extraData={this.state.items}
                                                />
                                            </View>
                                        );
                                    }}
                                /> */}
                    null
                    {/* </> */}
                    ) : (
                    null
                            // <FlatList
                            //     refreshControl={
                            //         <RefreshControl
                            //             onRefresh={this._fetch}
                            //             refreshing={this.state.loadingGet}
                            //         />
                            //     }
                            //     ListEmptyComponent={() => {
                            //         return (
                            //             <View>
                            //                 {this.state.loadingGet ? (
                            //                     <ActivityIndicator size="large" color={'#fff'} />
                            //                 ) : (
                            //                     <View style={{ marginTop: scale.h(250) }}>
                            //                         <Text style={{ alignSelf: 'center' }}>
                            //                             {this.props.selectedLanguage.no_items_found}
                            //                         </Text>
                            //                     </View>
                            //                 )}
                            //             </View>
                            //         );
                            //     }}
                            //     data={this.state.dataToShow}
                            //     extraData={this.state}
                            //     keyExtractor={this._keyExtractor}
                            //     ListHeaderComponent={this._renderListHeaderComponent}
                            //     ItemSeparatorComponent={this._renderItemSeparatorComponent}
                            //     renderItem={this._renderItem}
                            //     renderSectionHeader={this._renderSectionHeader}
                            //     renderSectionFooter={this._renderSectionFooter}
                            //     initialNumToRender={10}
                            // />
                        )}

                    <ProceedPayment
                        price={this.props.currency + " " + total_price.toFixed(2)}
                        btnText={this.props.selectedLanguage.checkout}
                        onPress={() => this.proceed_to_card()}
                    />
                </View>

                <ImageExpandModal
                    modalVisible={this.state.expandImageModal}
                    Image={{ uri: this.props.restaurant.logo_url }}
                    onBack={() => this.setState({ expandImageModal: false })}
                    onBackDrop={() => console.log("hello")}
                />
            </View>
        );
        // }
    }
}

const styles = StyleSheet.create({
    submit_btn_container: {
        paddingHorizontal: scale.w(57),
        marginTop: scale.w(18),
    },
    searchview: {
        marginHorizontal: scale.w(21),

        height: wp(12),
        // width:wp('100%'),
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 50,
        backgroundColor: '#ECECEC',
        // opacity:0.5
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
        height: hp('100%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        // position: 'relative',
    },
});

export default OrderRoomService;
