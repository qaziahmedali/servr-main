import React, { createRef } from 'react';
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
    ImageBackground,
    Alert,
    StatusBar,
} from 'react-native';
import base from '../../utils/baseStyles';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP,
    heightPercentageToDP,
} from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IRestaurant, IDish, ICategoryDish } from '../../types/restaurant';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import colors from '../../constants/colors';
import CustomModal from '../_global/CustomModal';
import { H4, H2, H3 } from '../_global/Text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NoteOrderItem from './Components/NoteOrderItem';
import { IOrderRoomServicAllItemseReduxProps } from './OrderRoomServiceAllItems.Container';
import numeral from 'numeral';
import { debounce, isEqual, padStart, stubString, find, findIndex } from 'lodash';
import { IOrderItem } from '../../types/action.restaurant';
import { mycard, PaymentDetailScreen } from '../../utils/navigationControl';
import ImageZoom from 'react-native-image-pan-zoom';
import Modal from 'react-native-modal';
import AttentionModal from '../_global/AttentionModal';
import ModalTimePicker from './Components/ModalTimePicker';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ProceedPayment from '../_global/proceedPayment';
import FIcon from 'react-native-vector-icons/Entypo';
import ImageExpandModal from '../_global/imageModal';
import Cardscan from 'react-native-cardscan';
import { Menu, MenuItem, Position, MenuDivider } from 'react-native-enhanced-popup-menu';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import PaymentFormModal from '../_global/paymentFormModal';
import InputText from './../_global/InputText';
import ProcessCompleteModal from '../_global/processComplete';
import { toast } from '../../utils/handleLogic';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DropShadow from 'react-native-drop-shadow';
import { RootContainer } from '../_global/Container';
import { IFeatureHotel } from '../../types/hotel';

export interface IOrderRoomServiceAllItemsProps extends IOrderRoomServicAllItemseReduxProps {
    componentId: string;
    restaurant: any;
}
interface ISelectedItems extends IOrderItem {
    name: string;
}
interface IOrderRoomServicAllItemseState {
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
    catIndex: number;
    cardNumber: string;
    tip: string;
    tipAlert: boolean;
    tipModal: boolean;
    holderName: string;
    cardAddress: string;
    expiryDate: string;
    cvv: string;
    itemForNote: IDish | null;
    indexForNote: number;
    note: string;
    paymentType: string;
    saveCard: boolean;
    vip_note: string;
    type?: any;
    date?: any;
    time?: any;
    selectedIndex: number;
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

let Data = [
    {
        id: 1,
    },
    {
        id: 2,
    },
    {
        id: 3,
    },
];

class OrderRoomServiceAllItems extends React.Component<
    IOrderRoomServiceAllItemsProps,
    IOrderRoomServicAllItemseState
> {
    private _modalNoteOrderItem = React.createRef<CustomModal>();
    private _modalConfirm = React.createRef<CustomModal>();
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalTimePicker = React.createRef<CustomModal>();
    private _modalPaymentFormModal = React.createRef<CustomModal>();
    private _modalPaymentType = React.createRef<CustomModal>();
    private menuRef = createRef();
    private dropDownRef = createRef();
    private _modalProcessCompleteModal = React.createRef<CustomModal>();
    private flatlistRef = React.createRef();

    constructor(props: IOrderRoomServiceAllItemsProps) {
        super(props);
        this.state = {
            items: [],
            catIndex: 0,
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
            dataToShow: this.props.dishesCategories,
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
            tip: '',
            holderName: props?.card?.cardholder_name || '',
            cardNumber: props?.card?.card_number_full || '',
            cardAddress: props?.card?.card_address || '',
            expiryDate: props?.card?.card_expiry_date || '',
            cvv: props?.card?.card_cvv_number || '',
            itemForNote: null,
            indexForNote: 0,
            note: '',
            saveCard: false,
            vip_note: '',
            date: '',
            time: '',
            selectedIndex: 0,
            type: '0',
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
        this._handleModalNoteOrderItem = this._handleModalNoteOrderItem.bind(this);
        this._onChangeText = this._onChangeText.bind(this);
        this._addTotalDish = this._addTotalDish.bind(this);
        this._substractTotalDish = this._substractTotalDish.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderListHeaderComponent = this._renderListHeaderComponent.bind(this);
        this._renderItemSeparatorComponent = this._renderItemSeparatorComponent.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderSectionHeader = this._renderSectionHeader.bind(this);
        this._renderSectionFooter = this._renderSectionFooter.bind(this);
        this.proceed_to_card = this.proceed_to_card.bind(this);
        this._handleSearch = this._handleSearch.bind(this);
        this.scanCard = this.scanCard.bind(this);
        this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
        this.proceed_to_card = this.proceed_to_card.bind(this);
        this._handleModalDatePicker = this._handleModalDatePicker.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._onChangeTime = this._onChangeTime.bind(this);
        this._handleModalBack = this._handleModalBack.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
    }

    _handleModalBack() {
        this._modalPaymentFormModal.current?.hide();
    }

    setModalVisible(visible: boolean) {
        this.setState({ modalVisible: visible });
    }
    setModalVisible1(visible: boolean) {
        this.setState({ modalVisible1: visible });
    }

    _handleModalTimePicker(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalTimePicker.current) {
                if (closeModal) {
                    this._modalTimePicker.current.hide();
                    if (
                        this.state.date != undefined ||
                        this.state.date != null ||
                        this.state.date != '' ||
                        this.state.time != undefined ||
                        this.state.time != null ||
                        this.state.time != ''
                    ) {
                        console.log('here');
                        this.setState({
                            tipModal: false,
                        });
                        setTimeout(() => {
                            this.setState({ tipAlert: true });
                        }, 500);
                    } else {
                        toast(this.props.selectedLanguage.please_select_the_correct);
                    }
                } else {
                    this._modalTimePicker.current.show();
                    this.setState({ time: new Date().toString() });
                }
            }
        };
    }

    _onChangeTime(date: Date) {
        this.setState((prevState) => {
            if (prevState.time) {
                return {
                    ...prevState,
                    time: date.toString(),
                };
            }

            return {
                ...prevState,
                time: date.toString(),
            };
        });
        // Alert.alert(date.toString())
    }

    _onChangeDate(date: Date) {
        this.setState((prevState) => {
            if (prevState.date) {
                return {
                    ...prevState,
                    date: date.toString(),
                };
            }

            return {
                ...prevState,
                date: date.toString(),
            };
        });
    }

    _handleModalDatePicker(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalDatePicker.current) {
                if (closeModal) {
                    this._modalConfirm.current?.hide();
                    this._modalDatePicker.current.hide();
                    if (this.state.date != undefined && this.state.date != null && this.state.date != '') {
                        setTimeout(() => {
                            this._modalTimePicker.current?.show();
                        }, 500);
                    }
                } else {
                    this._modalConfirm.current?.hide();
                    setTimeout(() => {
                        if (this._modalDatePicker.current) this._modalDatePicker.current.show();
                    }, 500);
                    this.setState({ date: new Date().toString() });
                    // this._handleModalTimePicker(true)
                }
            }
        };
    }

    scanCard() {
        Keyboard.dismiss();
        Cardscan.isSupportedAsync().then((supported) => {
            console.log(supported);
            if (supported) {
                Cardscan.scan().then(({ action, payload, canceled_reason }) => {
                    console.log('fffffffffffffffffff vvvvvvvvvvvvvvvvvvvv', Cardscan);
                    if (action === 'scanned') {
                        console.log(payload);
                        const { number, expiryMonth, expiryYear, issuer, cardholderName } = payload;
                        console.log(number, cardholderName, issuer, expiryYear);
                        if (number) {
                            console.log(number, expiryYear, expiryMonth, cardholderName);
                            this.setState({
                                cardNumber: number,
                                holderName: cardholderName,
                                expiryDate: expiryMonth
                                    ? `${padStart(expiryMonth.toString(), 2, '0')}/${expiryYear
                                          .toString()
                                          .substr(2)}`
                                    : '',
                            });
                            this._modalPaymentFormModal.current?.show();
                        } else {
                            this._modalPaymentFormModal.current?.show();
                        }
                        console.log(
                            'number   ',
                            number + ' name      ',
                            cardholderName + 'expiry   ' + expiryMonth + '       ' + expiryYear,
                        );
                        // Display information
                    } else if (action === 'canceled') {
                        // console.log(Cardscan.getConstants())
                        if (canceled_reason === 'enter_card_manually') {
                            console.log(canceled_reason);
                            // the user elected to enter a card manually
                        } else if (canceled_reason === 'camera_error') {
                            console.log(canceled_reason);
                            // there was an error with the camera
                        } else if (canceled_reason === 'fatal_error') {
                            console.log(canceled_reason);
                            // there was an error during the scan
                        } else if (canceled_reason === 'user_canceled') {
                            console.log(canceled_reason);
                            // the user canceled the scan
                        } else {
                            console.log(action);
                            // this._modalManualData.current?.show();
                        }
                    } else if (action === 'skipped') {
                        console.log(canceled_reason);
                        // User skipped
                    } else if (action === 'unknown') {
                        console.log(canceled_reason);
                        // Unknown reason for scan canceled
                    }
                });
            } else {
                console.log('nottttttttt supporteddddddddddddddddd', supported);
            }
        });
    }

    async componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        });
        this._fetch();
        this.setState({ dataToShow: this.props.dishesCategories });
    }
    componentDidUpdate() {
        if (this.state.check) {
            this.props.dishesCategories.map((data: any) => {
                if (data.data) {
                    data.data.map((data1: any) => {
                        this.state.newArray.push(data1);
                    });
                }
            });
            if (this.props.dishesCategories.length != 0) {
                this.setState({
                    check: false,
                });
            }
        }
    }

    _fetch() {
        this.setState({ loadingGet: true });
        this.props.getRestaurantCategoryDish(
            this.props.restaurant.id,
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

    _isLockFeature(feature?: keyof IFeatureHotel) {
        console.log('is checked innnnnn          ', this.props.isCheckedIn);
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

    proceed_to_card(charges) {
        if (this._isLockFeature()) {
            return false;
        }
        if (this.state.items.length) {
            Navigation.push(
                this.props.componentId,
                PaymentDetailScreen({
                    backGround: false,
                    orderItems: this._handleOrderRoomService,
                    currency: this.props.currency,
                    charges: charges,
                    vat: this.props.vat,
                    backgroundColor: this.props.icon.restaurant_color,
                    selectedLanguage: this.props.selectedLanguage,
                    holderName: this.state.holderName,
                    cardNumber: this.state.cardNumber,
                    cardAddress: this.state.cardAddress,
                    cardExpiryDate: this.state.expiryDate,
                    cvv: this.state.cvv,
                }),
            );
        } else {
            this.setState({
                text: this.props.selectedLanguage.please_select_at_least_one_item,
                visible: true,
            });
        }
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _handleModalNoteOrderItem(item: IDish | null, closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalNoteOrderItem.current) {
                if (closeModal) {
                    this.setState(
                        (prevState) => ({
                            items: prevState.items.map((dish) => {
                                if (dish.dish_id === prevState.selectedItem.dish_id) {
                                    return {
                                        ...dish,
                                        note: prevState.selectedItem.note,
                                    };
                                }

                                return dish;
                            }),
                        }),
                        this._modalNoteOrderItem.current.hide,
                    );
                } else {
                    const selected = find(this.state.items, { dish_id: item ? item.id : 0 });
                    this.setState(
                        { selectedItem: selected ? selected : this.state.selectedItem },
                        this._modalNoteOrderItem.current.show,
                    );
                }
            }
        };
    }

    _onChangeText(text: string) {
        this.setState((prevState) => ({
            selectedItem: {
                ...prevState.selectedItem,
                note: text,
            },
        }));
    }

    _handleOrderRoomService({
        paymentType: paymentType,
        now: now,
        date: date,
        time: time,
        tip: tip,
        notes: notes,
        cvv: cvv,
        expiryDate: expiryDate,
        cardNumber: cardNumber,
        cardAddress: cardAddress,
        holderName: holderName,
        saveCards: saveCards,
    }) {
        const { items } = this.state;
        // if (isTip) {
        return new Promise((resolve, reject) => {
            this.props.orderRoomService(
                this.props.restaurant.id,
                paymentType,
                this.props.currency,
                cvv,
                expiryDate,
                cardNumber,
                holderName,
                date,
                time,
                items,
                tip,
                notes,
                saveCards,
                () => {
                    resolve(true);

                    this.setState({
                        loading: false,
                        tipModal: false,
                        tipAlert: false,
                    });
                    this._modalProcessCompleteModal.current?.show();
                },
                () => {
                    reject(false);
                    setTimeout(() => {
                        this.setState({
                            loading: false,
                            tipModal: false,
                            tipAlert: false,
                        });
                    }, 500);
                },
            );
        });
        // } else {
        //     console.log("Items are here", items)
        //     console.log("time are here", time)
        //     console.log("id are here", id)
        //     console.log("Items are here", tip)
        //     console.log("Items are here", vip_note)
        //     this.props.orderRoomService(
        //         id,
        //         paymentType,
        //         this.props.currency,
        //         cvv,
        //         expiryDate,
        //         cardNumber,
        //         holderName,
        //         date,
        //         time,
        //         this.props.restaurant.id,
        //         items,
        //         tip,
        //         vip_note,
        //         saveCard,
        //         () => {
        //             this.setState({ loading: false });
        //             setTimeout(() => {
        //                 this.setState({
        //                     tipModal: false,
        //                 });
        //             }, 500);
        //             Navigation.popTo('restaurantList');
        //             // await Navigation.push('restaurantList', trackingProgress);
        //             Alert.alert('Success', 'Success order room service');
        //         },
        //         () => {
        //             this.setState({ loading: false });
        //             setTimeout(() => {
        //                 this.setState({
        //                     tipModal: false,
        //                 });
        //             }, 500);
        //         },
        //     );
        // }
    }

    _addTotalDish(item: IDish, from: boolean) {
        const index = findIndex(this.state.items, { dish_id: from ? item.id : item.dish_id });
        let itemsTemp = this.state.items;
        console.log(item);
        if (index < 0) {
            itemsTemp.push({
                dish_id: item.id,
                qty: 1,
                note: item?.note ? item?.note : '',
                price: Math.round(item.price),
            });

            this.setState({
                items: itemsTemp,
            });
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((dish) => {
                    if (from) {
                        if (dish.dish_id === item.id) {
                            return {
                                ...dish,
                                qty: dish.qty + 1,
                            };
                        }
                    } else {
                        if (dish.dish_id === item.dish_id) {
                            return {
                                ...dish,
                                qty: dish.qty + 1,
                            };
                        }
                    }
                    return dish;
                }),
            }));
        }
    }

    _substractTotalDish(item: IDish, from: boolean) {
        const selected = find(this.state.items, { dish_id: from ? item.id : item.dish_id });
        if (selected && selected.qty <= 1) {
            if (from) {
                this.setState((prevState) => ({
                    items: prevState.items.filter(({ dish_id }) => dish_id !== item.id),
                }));
            } else {
                this.setState((prevState) => ({
                    items: prevState.items.filter(({ dish_id }) => dish_id !== item.dish_id),
                }));
            }
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((dish) => {
                    if (from) {
                        if (dish.dish_id === item.id) {
                            return {
                                ...dish,
                                qty: dish.qty - 1,
                            };
                        }
                    } else {
                        if (dish.dish_id === item.dish_id) {
                            return {
                                ...dish,
                                qty: dish.qty - 1,
                            };
                        }
                    }
                    return dish;
                }),
            }));
        }
    }

    _keyExtractor(item: ICategoryDish, index: number) {
        return `${item.name}_${index}`;
    }

    _renderListHeaderComponent() {
        return <View style={{ height: scale.w(30) }} />;
    }

    _renderItemSeparatorComponent() {
        return <View style={{ height: scale.w(0) }} />;
    }

    _renderItem({ item }: { item: IDish }) {
        const selected = find(this.state.items, { id: item.id });
        const { color, currency } = this.props;
        return null;
    }

    _renderSectionHeader({ section: { title } }: { section: any }) {
        return (
            <View
                style={{
                    paddingLeft: scale.w(20),
                    paddingBottom: scale.h(15),
                    backgroundColor: '#fff',
                }}
            >
                <H2 fontSize={scale.w(20)}>{title}</H2>
            </View>
        );
    }

    _renderSectionFooter() {
        return <View style={{ height: hp(10) }} />;
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

    _handleSearch() {
        console.log('Search Icon clicked');
    }

    render() {
        const { color, currency } = this.props;
        const { restaurant, proceed_to_card } = this.props.selectedLanguage;
        var total_price = 0;
        this.state.items.map((dish) => {
            let row_price = dish.price * dish.qty;
            total_price = total_price + row_price;
        });
        if (!this.props.dishesCategories) {
            return null;
        } else {
            return (
                <View style={{ flex: 1 }}>
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

                    <View style={{ flex: 1 }}>
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
                        {Platform.OS === 'android' && (
                            <StatusBar backgroundColor={this.props.color}></StatusBar>
                        )}
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
                                    height: hp(90),
                                    width: wp(100),
                                    backgroundColor: colors.WHITE,
                                    top: -heightPercentageToDP(4.3),
                                    borderTopLeftRadius: scale.w(5),
                                    borderTopRightRadius: scale.w(5),
                                    paddingBottom: hp(10),
                                }}
                            >
                                {this.state.search == false ? (
                                    <>
                                        <View style={{ paddingHorizontal: wp(5) }}>
                                            <FlatList
                                                data={this.props.dishesCategories}
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item, index }) => {
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
                                                                paddingTop: heightPercentageToDP(4.5),
                                                                paddingBottom: heightPercentageToDP(2),
                                                                marginRight: widthPercentageToDP(2),
                                                            }}
                                                        >
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    this.flatlistRef.scrollToIndex({
                                                                        animated: true,
                                                                        index: index,
                                                                    });
                                                                    this.setState({
                                                                        catIndex: index,
                                                                    });
                                                                }}
                                                                style={{
                                                                    backgroundColor:
                                                                        this.state.catIndex == index
                                                                            ? this.props.icon.restaurant_color
                                                                            : colors.WHITE,
                                                                    paddingHorizontal: wp(7),
                                                                    borderRadius: scale.w(5),
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    height: heightPercentageToDP(4),
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: scale.w(1.4),
                                                                        color:
                                                                            this.state.catIndex == index
                                                                                ? colors.WHITE
                                                                                : colors.DARK_GREY,
                                                                        letterSpacing: 0.85,
                                                                    }}
                                                                >
                                                                    {item.title
                                                                        ? item.title.length > 12
                                                                            ? item.title.substring(0, 12) +
                                                                              '...'
                                                                            : item.title
                                                                        : null}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </DropShadow>
                                                    );
                                                }}
                                            />
                                        </View>
                                        <FlatList
                                            ref={(ref) => {
                                                this.flatlistRef = ref;
                                            }}
                                            refreshControl={
                                                <RefreshControl onRefresh={this._fetch} refreshing={false} />
                                            }
                                            data={this.props.dishesCategories}
                                            renderSectionFooter={this._renderSectionFooter}
                                            ListEmptyComponent={() => {
                                                return (
                                                    <View>
                                                        {this.state.loadingGet ? (
                                                            <View
                                                                style={{
                                                                    width: widthPercentageToDP(90),
                                                                    height: heightPercentageToDP(80),
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
                                                                            uri: this.state.chainData.data
                                                                                .logo_gif_dark,
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Image
                                                                        resizeMode="contain"
                                                                        style={{
                                                                            width: widthPercentageToDP(30),
                                                                        }}
                                                                        source={{
                                                                            uri: this.state.chainData.data
                                                                                .logo_gif_dark,
                                                                        }}
                                                                    />
                                                                )}
                                                            </View>
                                                        ) : (
                                                            <View
                                                                style={{
                                                                    width: widthPercentageToDP(90),
                                                                    height: heightPercentageToDP(80),
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <Text style={{ alignSelf: 'center' }}>
                                                                    No restauant found
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                );
                                            }}
                                            renderItem={({ item, index }) => {
                                                let MyItem = item;
                                                if (item.data && item.data.length > 0)
                                                    return (
                                                        <View
                                                            style={{
                                                                paddingHorizontal: wp(5),
                                                                marginBottom:
                                                                    index ==
                                                                    this.props.dishesCategories.length - 1
                                                                        ? hp(10)
                                                                        : 0,
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    backgroundColor: '#fff',
                                                                    marginTop: heightPercentageToDP(3),
                                                                }}
                                                            >
                                                                <H2
                                                                    fontFamily="Harabara"
                                                                    fontSize={scale.w(2.2)}
                                                                >
                                                                    All{' '}
                                                                    {item.title
                                                                        ? item.title.length > 30
                                                                            ? item.title.substring(0, 30) +
                                                                              '...'
                                                                            : item.title
                                                                        : null}{' '}
                                                                    Listed
                                                                </H2>
                                                            </View>
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'space-between',
                                                                    flexWrap: 'wrap',
                                                                    width: wp(90),
                                                                    alignSelf: 'center',
                                                                }}
                                                            >
                                                                {item.data.map((data, i) => {
                                                                    const selected = find(this.state.items, {
                                                                        dish_id: data.id,
                                                                    });
                                                                    const { color, currency } = this.props;
                                                                    return (
                                                                        <DropShadow
                                                                            style={{
                                                                                shadowOffset: {
                                                                                    width: 0,
                                                                                    height: 10,
                                                                                },
                                                                                shadowColor:
                                                                                    colors.EXPERIENCE_SCREEN_BOX_SHADOW,
                                                                                shadowOpacity: 0.39,
                                                                                shadowRadius: 28,
                                                                                borderRadius: scale.w(5),
                                                                                paddingTop:
                                                                                    heightPercentageToDP(2),
                                                                            }}
                                                                        >
                                                                            <View
                                                                                style={{
                                                                                    borderRadius:
                                                                                        scale.w(2.5),
                                                                                    backgroundColor: '#fff',
                                                                                    width: wp(43),
                                                                                }}
                                                                            >
                                                                                <TouchableOpacity
                                                                                    // onPress={() => {
                                                                                    //     this.setState({
                                                                                    //         imageUrl: data.image,
                                                                                    //         description: data.description,
                                                                                    //         dishName: data.name,
                                                                                    //         item: data,
                                                                                    //     });
                                                                                    //     this.setModalVisible(true);
                                                                                    // }}
                                                                                    activeOpacity={1}
                                                                                    // style={{
                                                                                    //     flexDirection: 'row',
                                                                                    // }}
                                                                                >
                                                                                    {data.image ==
                                                                                    'https://cms.servrhotels.com/images/default.jpg' ? (
                                                                                        <Image
                                                                                            resizeMode={
                                                                                                'cover'
                                                                                            }
                                                                                            source={{
                                                                                                uri: 'https://cms.servrhotels.com/images/default.png',
                                                                                            }}
                                                                                            style={{
                                                                                                width: wp(43),
                                                                                                height: hp(
                                                                                                    19,
                                                                                                ),
                                                                                                alignSelf:
                                                                                                    'center',
                                                                                                // borderTopLeftRadius: scale.w(2.5),
                                                                                                // borderTopRightRadius: scale.w(2.5)
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <Image
                                                                                            resizeMode={
                                                                                                'contain'
                                                                                            }
                                                                                            source={{
                                                                                                uri: data.image,
                                                                                            }}
                                                                                            style={{
                                                                                                width: wp(43),
                                                                                                height: hp(
                                                                                                    19,
                                                                                                ),
                                                                                                alignSelf:
                                                                                                    'center',
                                                                                                // borderTopLeftRadius: scale.w(2.5),
                                                                                                // borderTopRightRadius: scale.w(2.5)
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                    <View
                                                                                        style={{
                                                                                            paddingBottom:
                                                                                                hp(1),
                                                                                            paddingHorizontal:
                                                                                                wp(3),
                                                                                            paddingTop: hp(1),
                                                                                        }}
                                                                                    >
                                                                                        <Text
                                                                                            style={{
                                                                                                fontSize:
                                                                                                    scale.w(
                                                                                                        1.78,
                                                                                                    ),
                                                                                                width: wp(43),
                                                                                                fontFamily:
                                                                                                    'Roboto-Medium',
                                                                                            }}
                                                                                        >
                                                                                            {data.name
                                                                                                ? data.name.trim()
                                                                                                      .length >
                                                                                                  17
                                                                                                    ? data.name
                                                                                                          .trim()
                                                                                                          .substring(
                                                                                                              0,
                                                                                                              16,
                                                                                                          ) +
                                                                                                      '...'
                                                                                                    : data.name
                                                                                                : null}
                                                                                        </Text>
                                                                                        <View
                                                                                            style={{
                                                                                                flexDirection:
                                                                                                    'row',
                                                                                                justifyContent:
                                                                                                    'space-between',
                                                                                                paddingTop:
                                                                                                    hp(0.32),
                                                                                                paddingBottom:
                                                                                                    hp(1.3),
                                                                                            }}
                                                                                        >
                                                                                            <View
                                                                                                style={{
                                                                                                    paddingHorizontal:
                                                                                                        widthPercentageToDP(
                                                                                                            3,
                                                                                                        ),
                                                                                                    paddingVertical:
                                                                                                        heightPercentageToDP(
                                                                                                            0.2,
                                                                                                        ),
                                                                                                    backgroundColor:
                                                                                                        colors.BUTTON_GREY,
                                                                                                    borderRadius: 15,
                                                                                                }}
                                                                                            >
                                                                                                <Text
                                                                                                    style={{
                                                                                                        fontSize:
                                                                                                            scale.w(
                                                                                                                1.2,
                                                                                                            ),
                                                                                                        color: colors.WHITE,
                                                                                                        fontFamily:
                                                                                                            'Roboto-Regular',
                                                                                                    }}
                                                                                                >
                                                                                                    {item
                                                                                                        .title
                                                                                                        ?.length >
                                                                                                    7
                                                                                                        ? item.title.substring(
                                                                                                              0,
                                                                                                              7,
                                                                                                          ) +
                                                                                                          '...'
                                                                                                        : item.title}
                                                                                                </Text>
                                                                                            </View>
                                                                                            {/* <TouchableOpacity
                                                                                            onPress={debounce(this._handleModalNoteOrderItem(data, false), 1000, {
                                                                                                leading: true,
                                                                                                trailing: false,
                                                                                            })}
                                                                                            activeOpacity={0.7}
                                                                                            style={{ alignSelf: 'center' }}
                                                                                        >
                                                                                            <Text style={{ fontSize: scale.w(1.5), opacity: .4, fontFamily : 'Roboto-Regular'  }} >Add Note</Text>
                                                                                        </TouchableOpacity> */}
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
                                                                                                flexDirection:
                                                                                                    'row',
                                                                                                justifyContent:
                                                                                                    'space-between',
                                                                                            }}
                                                                                        >
                                                                                            <Text
                                                                                                style={{
                                                                                                    fontSize:
                                                                                                        scale.w(
                                                                                                            1.9,
                                                                                                        ),
                                                                                                    textAlign:
                                                                                                        'center',
                                                                                                    fontFamily:
                                                                                                        'Roboto-Bold',
                                                                                                }}
                                                                                            >
                                                                                                {`${currency}${numeral(
                                                                                                    Math.round(
                                                                                                        data.price,
                                                                                                    ),
                                                                                                )
                                                                                                    .format(
                                                                                                        '0,0a',
                                                                                                    )
                                                                                                    .toUpperCase()}`}
                                                                                            </Text>
                                                                                            {/* <View style={{ width: 5 }} /> */}

                                                                                            {/* {selected ? ( */}
                                                                                            <View
                                                                                                style={{
                                                                                                    flexDirection:
                                                                                                        'row',
                                                                                                    borderWidth: 2,
                                                                                                    borderRadius:
                                                                                                        scale.w(
                                                                                                            0.8,
                                                                                                        ),
                                                                                                    borderColor:
                                                                                                        colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR,
                                                                                                    //    paddingHorizontal: scale.w(0.1),
                                                                                                    justifyContent:
                                                                                                        'space-between',
                                                                                                    //    backgroundColor: colors.BLACK,
                                                                                                    width: wp(
                                                                                                        19,
                                                                                                    ),
                                                                                                    alignItems:
                                                                                                        'center',
                                                                                                    alignSelf:
                                                                                                        'flex-end',
                                                                                                    height: heightPercentageToDP(
                                                                                                        3.1,
                                                                                                    ),
                                                                                                    // alignItems: 'flex-end',
                                                                                                    // flex: 1,
                                                                                                    // backgroundColor: colors.RED,
                                                                                                    // paddingVertical: hp(0.5),
                                                                                                    // alignItems: 'center',
                                                                                                }}
                                                                                            >
                                                                                                <TouchableOpacity
                                                                                                    disabled={
                                                                                                        selected &&
                                                                                                        selected.qty ==
                                                                                                            0
                                                                                                            ? true
                                                                                                            : false
                                                                                                    }
                                                                                                    onPress={() =>
                                                                                                        this._substractTotalDish(
                                                                                                            data,
                                                                                                            true,
                                                                                                        )
                                                                                                    }
                                                                                                    activeOpacity={
                                                                                                        0.7
                                                                                                    }
                                                                                                    style={{
                                                                                                        paddingLeft:
                                                                                                            wp(
                                                                                                                1.5,
                                                                                                            ),
                                                                                                        color: '#707070',
                                                                                                    }}
                                                                                                >
                                                                                                    <Ionicons
                                                                                                        name="md-remove"
                                                                                                        color={
                                                                                                            colors.GREY
                                                                                                        }
                                                                                                        size={scale.w(
                                                                                                            2,
                                                                                                        )}
                                                                                                    />
                                                                                                </TouchableOpacity>
                                                                                                <View
                                                                                                    style={{
                                                                                                        justifyContent:
                                                                                                            'center',
                                                                                                        alignItems:
                                                                                                            'center',
                                                                                                        marginHorizontal: 1,
                                                                                                    }}
                                                                                                >
                                                                                                    <H4
                                                                                                        fontFamily={
                                                                                                            'Roboto-Bold'
                                                                                                        }
                                                                                                        fontSize={scale.w(
                                                                                                            1.4,
                                                                                                        )}
                                                                                                    >
                                                                                                        {selected
                                                                                                            ? selected.qty
                                                                                                            : 0}
                                                                                                    </H4>
                                                                                                </View>
                                                                                                <TouchableOpacity
                                                                                                    onPress={() =>
                                                                                                        this._addTotalDish(
                                                                                                            data,
                                                                                                            true,
                                                                                                        )
                                                                                                    }
                                                                                                    activeOpacity={
                                                                                                        0.7
                                                                                                    }
                                                                                                    style={{
                                                                                                        paddingRight:
                                                                                                            wp(
                                                                                                                1.5,
                                                                                                            ),
                                                                                                        color: '#707070',
                                                                                                    }}
                                                                                                >
                                                                                                    <Ionicons
                                                                                                        name="md-add"
                                                                                                        color={
                                                                                                            colors.GREY
                                                                                                        }
                                                                                                        size={scale.w(
                                                                                                            2,
                                                                                                        )}
                                                                                                    />
                                                                                                </TouchableOpacity>
                                                                                            </View>
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
                                                                        </DropShadow>
                                                                    );
                                                                })}
                                                            </View>
                                                        </View>
                                                    );
                                            }}
                                        />
                                    </>
                                ) : (
                                    <FlatList
                                        refreshControl={
                                            <RefreshControl
                                                onRefresh={this._fetch}
                                                refreshing={this.state.loadingGet}
                                            />
                                        }
                                        ListEmptyComponent={() => {
                                            return (
                                                <View>
                                                    {this.state.loadingGet ? (
                                                        <ActivityIndicator size="large" color={'#fff'} />
                                                    ) : (
                                                        <View style={{ marginTop: heightPercentageToDP(20) }}>
                                                            <Text style={{ alignSelf: 'center' }}>
                                                                {this.props.selectedLanguage.no_items_found}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        }}
                                        data={this.state.dataToShow}
                                        extraData={this.state}
                                        keyExtractor={this._keyExtractor}
                                        ListHeaderComponent={this._renderListHeaderComponent}
                                        ItemSeparatorComponent={this._renderItemSeparatorComponent}
                                        renderItem={this._renderItem}
                                        renderSectionHeader={this._renderSectionHeader}
                                        renderSectionFooter={this._renderSectionFooter}
                                        initialNumToRender={10}
                                    />
                                )}
                                {/* <View style={{height : hp(10)}} /> */}
                            </View>
                        </RootContainer>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            width: wp(100),
                            height: Platform.OS == 'android' ? '100%' : null,
                            bottom: Platform.OS == 'android' ? null : 0,
                            justifyContent: 'flex-end',
                        }}
                    >
                        <ProceedPayment
                            backGroundColor={this.props.icon.restaurant_color}
                            price={this.props.currency + ' ' + total_price.toFixed(0)}
                            btnText={this.props.selectedLanguage.checkout}
                            total={this.props.selectedLanguage.total}
                            onPress={() => this.proceed_to_card(total_price.toFixed(0))}
                        />
                    </View>

                    <Modal
                        backdropOpacity={0.7}
                        isVisible={this.state.tipAlert}
                        onBackdropPress={() => {
                            this.setState({ tipAlert: false });
                            setTimeout(() => {
                                this.setState({
                                    tipModal: false,
                                });
                            }, 500);
                        }}
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
                                    width: wp(90),
                                    // height: scale.h(200),
                                    backgroundColor: '#fff',
                                    borderRadius: scale.w(2.5),
                                    alignItems: 'center',
                                    paddingVertical: wp(5),
                                }}
                            >
                                {this.state.tipModal ? (
                                    <>
                                        <Menu ref={(ref) => (this.menuRef = ref)}>
                                            <FlatList
                                                data={Data}
                                                contentInsetAdjustmentBehavior="automatic"
                                                keyboardShouldPersistTaps="handled"
                                                keyboardDismissMode="interactive"
                                                style={{ width: '100%', maxHeight: scale.h(200) }}
                                                keyExtractor={(item, index) => JSON.stringify(item)}
                                                nestedScrollEnabled
                                                renderItem={({ item, index }) => {
                                                    let tip = String(item).slice(0, 2);
                                                    return (
                                                        <MenuItem
                                                            textStyle={{
                                                                color: colors.GREY,
                                                            }}
                                                            onPress={() => {
                                                                this.setState({ tip });
                                                                this.menuRef.hide();
                                                            }}
                                                        >
                                                            {String(item)}
                                                        </MenuItem>
                                                    );
                                                }}
                                            />
                                        </Menu>
                                        <Text style={{ fontSize: scale.w(2.2), fontFamily: 'Roboto-Medium' }}>
                                            Add Tip
                                        </Text>
                                        <View style={{ width: '80%', marginTop: hp(5) }}>
                                            <View
                                                ref={(ref) => (this.dropDownRef = ref)}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    borderWidth: 1,
                                                    borderColor: colors.GREY,
                                                    borderRadius: scale.w(0.5),
                                                    marginBottom: hp(3),
                                                }}
                                            >
                                                <InputText
                                                    placeholder="Enter or select tip in %"
                                                    placeholderTextColor={colors.GREY}
                                                    keyboardType="numeric"
                                                    selectionColor={colors.BLUE}
                                                    borderWidth={0}
                                                    flex={1}
                                                    marginTop={0}
                                                    value={this.state.tip}
                                                    onChangeText={(val) => {
                                                        this.setState({ tip: val });
                                                    }}
                                                />
                                                {this.state.tip ? <H2>%</H2> : null}
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.menuRef.show(
                                                            this.dropDownRef,
                                                            Position.TOP_RIGHT,
                                                        );
                                                    }}
                                                    style={{
                                                        width: wp(10),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <IonIcon
                                                        name="ios-arrow-down"
                                                        size={wp(4.5)}
                                                        color={color || colors.DARK_BLUE}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <ButtonPrimary
                                                onPress={() => {
                                                    if (this.state.tip == '') {
                                                        toast(
                                                            this.props.selectedLanguage
                                                                .please_enter_tip_to_proceed,
                                                        );
                                                    } else {
                                                        if (this.state.paymentType == 'card') {
                                                            this.setState({
                                                                tipAlert: false,
                                                            });
                                                            this._modalPaymentFormModal.current?.show();
                                                        } else {
                                                            this._handleOrderRoomService();
                                                        }
                                                    }
                                                }}
                                                loading={this.state.loading}
                                                disabled={this.state.loading}
                                                text={'Confirm Order'}
                                                backgroundColor={colors.BLUE}
                                                fontWeight={'bold'}
                                                chainData={this.props.chainData}
                                            />
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <Text style={{ fontSize: scale.w(2.5), fontFamily: 'Robo-Medium' }}>
                                            Would you like to add a tip?
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                marginTop: hp(5),
                                                width: wp(73),
                                            }}
                                        >
                                            <View style={{ width: '42%', paddingHorizontal: wp(1) }}>
                                                <ButtonPrimary
                                                    backgroundColor={colors.BLUE}
                                                    onPress={() => {
                                                        if (this.state.paymentType == 'card') {
                                                            this.setState({ tipAlert: false });
                                                            this._modalPaymentFormModal.current?.show();
                                                        } else {
                                                            this._handleOrderRoomService();
                                                        }
                                                    }}
                                                    loading={false}
                                                    disabled={false}
                                                    fontSize={scale.w(2)}
                                                    fontWeight={'bold'}
                                                    text={'No'}
                                                    chainData={this.props.chainData}
                                                />
                                            </View>
                                            <View style={{ width: '42%', paddingHorizontal: wp(1) }}>
                                                <ButtonPrimary
                                                    backgroundColor={colors.BLUE}
                                                    onPress={() => {
                                                        this.setState({ tipModal: true });
                                                    }}
                                                    loading={false}
                                                    disabled={false}
                                                    fontWeight={'bold'}
                                                    fontSize={scale.w(2)}
                                                    text={'Yes'}
                                                    chainData={this.props.chainData}
                                                />
                                            </View>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>

                    <CustomModal
                        ref={this._modalPaymentType}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <View
                            style={{
                                width: wp(80),
                                borderRadius: scale.w(2.5),
                                backgroundColor: colors.WHITE,
                                paddingHorizontal: wp(5),
                                alignSelf: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        paymentType: 'cash',
                                    });
                                    this._modalConfirm.current?.show();
                                    this._modalPaymentType.current?.hide();
                                }}
                                style={{
                                    paddingVertical: hp(3),
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text style={{ fontSize: scale.w(2.2), fontFamily: 'Roboto-Bold' }}>
                                    Pay By Cash
                                </Text>
                            </TouchableOpacity>
                            <View style={{ height: 1, backgroundColor: colors.LIGHT_GREY }} />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        paymentType: 'card',
                                    });
                                    this._modalPaymentType.current?.hide();
                                    this._modalConfirm.current?.show();
                                }}
                                style={{
                                    paddingVertical: hp(3),
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text style={{ fontSize: scale.w(2.2), fontFamily: 'Roboto-Bold' }}>
                                    Pay By Card
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </CustomModal>

                    <CustomModal
                        style={{ margin: -1, height: hp(100) }}
                        ref={this._modalPaymentFormModal}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <PaymentFormModal
                            onBackClick={this._handleModalBack}
                            onScanIconClick={() => this.scanCard()}
                            holderName={this.state.holderName}
                            onChangeHolderName={(val) => this.setState({ holderName: val })}
                            cardNumber={this.state.cardNumber}
                            onChangeCardNumber={(val) => this.setState({ cardNumber: val })}
                            cardAddress={this.state.cardAddress}
                            isLoading={this.state.loading}
                            onChangeCardAddress={(val) => this.setState({ cardAddress: val })}
                            cardExpiryDate={this.state.expiryDate}
                            onChangeCardExpiry={(val) => this.setState({ expiryDate: val })}
                            onChangeCVV={(val) => this.setState({ cvv: val })}
                            cardSave={this.state.saveCard}
                            onCardSave={(val) => this.setState({ saveCard: val })}
                            onPrimaryClick={() => {
                                if (
                                    this.state.holderName == '' ||
                                    this.state.cardNumber == '' ||
                                    this.state.cardAddress == '' ||
                                    this.state.expiryDate == '' ||
                                    this.state.cvv == ''
                                ) {
                                    toast(this.props.selectedLanguage.please_enter_all_details_to_proceed);
                                } else {
                                    this._handleOrderRoomService();
                                }
                            }}
                            chainData={this.props.chainData}
                            //onPrimaryClick={() => console.log('Hello')}
                        />
                    </CustomModal>

                    <CustomModal
                        style={{ margin: -1 }}
                        ref={this._modalProcessCompleteModal}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                        splash
                    >
                        <ProcessCompleteModal
                            backgroundColor={this.props.icon.restaurant_color}
                            processTitle={'Success'}
                            processDescription={'Your room service request has been sent'}
                            btnText={this.props.selectedLanguage.go_to_home}
                            onButtonPress={this._handleBack}
                            processImage={require('../../images/paymentSuccess.png')}
                            chainData={this.props.chainData}
                        />
                    </CustomModal>

                    <CustomModal
                        ref={this._modalTimePicker}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <ModalTimePicker
                            // time={this.state.time !== '' ? new Date(this.state.time) : new Date()}
                            // onTimeChange={(date) => {this.setState({ time: date.toString()}) }}
                            minimumDate={new Date()}
                            onDateChange={this._onChangeTime}
                            showModal={this._handleModalTimePicker(true)}
                            title={this.props.selectedLanguage.pick_your_time_booking}
                            color={color}
                            selectedLanguage={this.props.selectedLanguage}
                            mode="time"
                        />
                    </CustomModal>

                    <CustomModal
                        ref={this._modalDatePicker}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <ModalTimePicker
                            // time={this.state.date !== '' ? new Date(this.state.date) : new Date()}
                            // onTimeChange={(date) => this.setState({ date: date.toString() })}
                            onDateChange={this._onChangeDate}
                            minimumDate={new Date()}
                            showModal={this._handleModalDatePicker(true)}
                            title={this.props.selectedLanguage.pick_your_date_booking}
                            color={color}
                            selectedLanguage={this.props.selectedLanguage}
                            mode="date"
                        />
                    </CustomModal>

                    <CustomModal ref={this._modalConfirm} animationIn="fadeInUp" animationOut="fadeOutDown">
                        <View
                            style={{
                                width: '100%',
                                backgroundColor: 'white',
                                borderRadius: scale.w(2.5),
                                paddingVertical: hp(2),
                            }}
                        >
                            <RadioForm animation={true}>
                                {/* To create radio buttons, loop through your array of options */}
                                {[
                                    { label: this.props.selectedLanguage.now, value: '0' },
                                    { label: this.props.selectedLanguage.specific_time, value: '1' },
                                ].map((obj, i) => (
                                    <View>
                                        <RadioButton labelHorizontal={true} key={i}>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    await this.setState({
                                                        selectedIndex: i,
                                                        type: obj.value,
                                                    });
                                                }}
                                                style={{
                                                    marginTop: hp(2),
                                                    flexDirection: 'row',
                                                    marginHorizontal: wp(2),
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: '100%',
                                                        paddingHorizontal: wp(3),
                                                        flexDirection: 'row',
                                                        paddingBottom: hp(2),
                                                        borderRadius: scale.w(2),
                                                    }}
                                                >
                                                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                                    <RadioButtonInput
                                                        obj={obj}
                                                        index={i}
                                                        isSelected={this.state.selectedIndex === i}
                                                        onPress={async () => {
                                                            await this.setState({
                                                                selectedIndex: i,
                                                                type: obj.value,
                                                            });
                                                        }}
                                                        borderWidth={1}
                                                        buttonInnerColor={colors.BLUE}
                                                        buttonOuterColor={colors.BLUE}
                                                        buttonSize={15}
                                                        buttonOuterSize={25}
                                                        buttonStyle={{}}
                                                        buttonWrapStyle={{
                                                            marginLeft: widthPercentageToDP(5),
                                                        }}
                                                    />
                                                    <RadioButtonLabel
                                                        obj={obj}
                                                        index={i}
                                                        labelHorizontal={true}
                                                        onPress={async () => {}}
                                                        labelStyle={{ fontSize: scale.w(2.2) }}
                                                        labelWrapStyle={{}}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </RadioButton>
                                        {i != 1 ? (
                                            <View
                                                style={{
                                                    height: hp(0.09),
                                                    backgroundColor: colors.ANONYMOUS1,
                                                    opacity: 0.51,
                                                    width: wp(80),
                                                    alignSelf: 'center',
                                                }}
                                            />
                                        ) : null}
                                    </View>
                                ))}
                            </RadioForm>
                            {/* <View style={{ height: hp(2) }}>
                            <Text>Hello</Text>
                        </View> */}
                            <View style={{ marginHorizontal: wp(5), marginTop: hp(2) }}>
                                <ButtonPrimary
                                    onPress={
                                        this.state.type == '0'
                                            ? () => {
                                                  this._modalConfirm.current?.hide();
                                                  this.setState({
                                                      date: new Date().toString(),
                                                      time: new Date().toString(),
                                                  });
                                                  setTimeout(() => {
                                                      this.setState({
                                                          tipAlert: true,
                                                      });
                                                  }, 500);
                                              }
                                            : debounce(this._handleModalDatePicker(false), 1000, {
                                                  leading: true,
                                                  trailing: false,
                                              })
                                    }
                                    loading={this.state.loading}
                                    disabled={this.state.loading}
                                    fontWeight={'bold'}
                                    text={'Confirm'}
                                    backgroundColor={colors.BLUE}
                                    chainData={this.props.chainData}
                                />
                            </View>
                            <View style={{ height: hp(2) }}></View>
                        </View>
                    </CustomModal>

                    <CustomModal
                        ref={this._modalNoteOrderItem}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <NoteOrderItem
                            value={this.state.selectedItem.note}
                            onChangeText={this._onChangeText}
                            showModal={this._handleModalNoteOrderItem(null, true)}
                            title={`${this.state.selectedItem.name} Note`}
                            color={color}
                            description={this.props.selectedLanguage.write_anything_about_this_item_order}
                            done={this.props.selectedLanguage.done}
                            chainData={this.props.chainData}
                        />
                    </CustomModal>

                    <AttentionModal
                        visible={this.state.visible}
                        toggleModal={this.toggleModal}
                        text={this.state.text}
                        attention={this.props.selectedLanguage.attention}
                        ok={this.props.selectedLanguage.ok}
                    />

                    <ImageExpandModal
                        modalVisible={this.state.expandImageModal}
                        Image={{ uri: this.props.restaurant.logo_url }}
                        onBack={() => this.setState({ expandImageModal: false })}
                        onBackDrop={() => console.log('hello')}
                    />
                </View>
            );
        }
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

export default OrderRoomServiceAllItems;
