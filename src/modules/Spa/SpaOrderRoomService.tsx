import React, { createRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    RefreshControl,
    SafeAreaView,
    FlatList,
    TextInput,
    Text,
    Platform,
    ActivityIndicator,
    ImageBackground,
    Alert,
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
import Image from 'react-native-image-progress';
import { Navigation } from 'react-native-navigation';
import { IRestaurant, IDish, ICategoryDish } from '../../types/restaurant';
import { debounce } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import colors from '../../constants/colors';
import CustomModal from '../_global/CustomModal';
import { H4, H2, H3 } from '../_global/Text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import NoteOrderItem from './Components/NoteOrderItem';
import { ISpaOrderRoomServiceReduxProps } from './SpaOrderRoomService.Container';
import numeral from 'numeral';
import { find, findIndex } from 'lodash';
import { IOrderItem } from '../../types/action.restaurant';
import {
    mycard,
    OrderRoomServiceAllItems,
    requestItems,
    spaorderroomserviceallitems,
    PaymentDetailScreen,
} from '../../utils/navigationControl';
import ImageZoom from 'react-native-image-pan-zoom';
import Modal from 'react-native-modal';
import AttentionModal from '../_global/AttentionModal';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ProceedPayment from '../_global/proceedPayment';
import FIcon from 'react-native-vector-icons/Entypo';
import ImageExpandModal from '../_global/imageModal';
import PaymentFormModal from '../_global/paymentFormModal';
import ProcessCompleteModal from '../_global/processComplete';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Cardscan from 'react-native-cardscan';
import ModalTimePicker from './Components/ModalTimePicker';
import { IFeatureHotel } from '../../types/hotel';
import { Menu, MenuItem, Position, MenuDivider } from 'react-native-enhanced-popup-menu';
import InputText from './../_global/InputText';
import { toast } from '../../utils/handleLogic';
import ImageZoomModal from '../_global/ImageZoomModal';
import Badge from '../../images/badge.svg';
import ModalSeeMore from '../_global/ModalSeeMore';
export interface ISpaOrderRoomServiceProps extends ISpaOrderRoomServiceReduxProps {
    componentId: string;
    spa: any;
    hotelTaxes: {
        data: {
            additional_services: any[];
            laundry_services: any[];
            restaurants: {
                res_id: any[];
            };
            spa: {
                spa_id: any[];
            };
            valet_parking: any[];
        };
    };
}
interface ISelectedItems extends IOrderItem {
    name: string;
}
interface ISpaOrderRoomServiceState {
    items: ISelectedItems[];
    selectedItem: ISelectedItems;
    loadingGet: boolean;
    loading: boolean;
    selectedVal: any;
    type?: any;
    // dataToShow: any;
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
    holderName: string;
    cardNumber: string;
    cardAddress: string;
    expiryDate: string;
    cvv: string;
    selectedIndex: any;
    date?: any;
    time?: any;
    tipAlert: boolean;
    tipModal: boolean;
    tip: string;
    treatments: any;
    itemForNote: any;
    indexForNote: number;
    note: string;
    paymentType: string;
    cardSave: boolean;
    ImageZoomModal: boolean;
    Image_URL: any;
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

class SpaOrderRoomService extends React.Component<ISpaOrderRoomServiceProps, ISpaOrderRoomServiceState> {
    private _modalNoteOrderItem = React.createRef<CustomModal>();
    private _modalSeeMore = React.createRef<CustomModal>();
    private _modalPaymentFormModal = React.createRef<CustomModal>();
    private _modalPaymentType = React.createRef<CustomModal>();
    private _modalProcessCompleteModal = React.createRef<CustomModal>();

    private _modalConfirm = React.createRef<CustomModal>();
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalTimePicker = React.createRef<CustomModal>();
    private menuRef = createRef();
    private dropDownRef = createRef();

    private flatlistRef = React.createRef();

    constructor(props: ISpaOrderRoomServiceProps) {
        super(props);
        this.state = {
            items: [],
            selectedItem: {
                id: 0,
                qty: 0,
                note: '',
                name: '',
                rate: 0,
            },
            tipModal: false,
            loadingGet: true,
            selectedIndex: 0,
            loading: false,
            selectedVal: '',
            type: '0',
            tipAlert: false,
            ImageZoomModal: false,
            Image_URL: '',
            //      dataToShow: this.props.dishesCategories,
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
            holderName: props?.card?.cardholder_name || '',
            cardNumber: props?.card?.card_number_full || '',
            cardAddress: props?.card?.card_address || '',
            expiryDate: props?.card?.card_expiry_date || '',
            cvv: props?.card?.card_cvv_number || '',
            tip: '',
            treatments: [],
            itemForNote: null,
            indexForNote: 0,
            note: '',
            paymentType: '',
            cardSave: false,
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
                backgroundColor: props.icon.spa_color,
                style: 'light',
            },
        });

        //  this._fetch = this._fetch.bind(this);
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
        this._handleOrderRoomServiceAllItems = this._handleOrderRoomServiceAllItems.bind(this);
        this._handleModalBack = this._handleModalBack.bind(this);
        this._handleModalDatePicker = this._handleModalDatePicker.bind(this);
        this._onChangeTime = this._onChangeTime.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
        this.scanCard = this.scanCard.bind(this);
        this._handleSeeMoreItem = this._handleSeeMoreItem.bind(this);
        this._handleClose = this._handleClose.bind(this);
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

    _handleClose() {
        this.setState(this._modalSeeMore.current.hide);
    }

    _handleSeeMoreItem(item: IDish | null, closeModal?: boolean, index: number) {
        return () => {
            console.log('index is hereeeee=========>', item);
            this.setState({
                itemForNote: item,
                indexForNote: index,
                note: item?.note ? item.note : '',
            });
            Keyboard.dismiss();
            if (this._modalSeeMore.current) {
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
                        this._modalSeeMore.current.hide,
                    );
                } else {
                    const selected = find(this.state.items, { dish_id: item ? item.id : 0 });
                    this.setState(
                        { selectedItem: selected ? selected : this.state.selectedItem },
                        this._modalSeeMore.current.show,
                    );
                }
            }
        };
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
        // console.log(this.state)
        // if (isTip) {
        return new Promise((resolve, reject) => {
            this.props.orderRoomSpa(
                {
                    spa_id: this.props.spa.id,
                    treatments: items,
                    number_people: items?.length,
                    date: date,
                    time: time,
                    currency: this.props.currency,
                    booking_type: 'room_service',
                    card_number: cardNumber,
                    card_expiry_month: expiryDate,
                    card_cvv_number: cvv,
                    cardholder_name: holderName,
                    is_card_save: saveCards,
                    type: paymentType,
                    notes: notes,
                    tip: tip,
                },
                () => {
                    this.setState({ loading: false });
                    this.setState({
                        tipModal: false,
                        tipAlert: false,
                    });
                    console.log('ye yahan a gya');
                    this._modalProcessCompleteModal.current?.show();
                    resolve(true);
                },
                () => {
                    this.setState({ loading: false });
                    reject(false);
                    setTimeout(() => {
                        this.setState({
                            tipModal: false,
                            tipAlert: false,
                        });
                    }, 500);
                },
            );
        });
        // console.log("spaaaaaaaaaaaaaaaaa", this.props.spa)
        // if (this.state.paymentType == 'cash') {
        // this.setState({ loading: true });
        // console.log(this.props)
        // const { tip, note, date, time, items } = this.state;
        //     this.props.orderRoomSpa(
        //         {
        //         spa_id : this.props.spa.id,
        //         treatments : items,
        //         number_people : items.length,
        //         date : date,
        //         time : time,
        //         currency : this.props.currency,
        //         booking_type : 'normal_reservation',
        //         card_number : this.state.cardNumber,
        //         card_expiry_month : this.state.expiryDate,
        //         card_cvv_number : this.state.cvv,
        //         cardholder_name : this.state.holderName,
        //         is_card_save : this.state.cardSave,
        //         type : this.state.paymentType,
        //         },
        //         () => {
        //             this.setState({ loading: false });
        //                 this.setState({
        //                     tipModal: false,
        //                     tipAlert : false
        //                 });
        //             this._modalProcessCompleteModal.current?.show()
        //         },
        //         () => {
        //             this.setState({ loading: false });
        //             setTimeout(() => {
        //                 this.setState({
        //                     tipModal: false,
        //                     tipAlert : false
        //                 });
        //             }, 500);
        //         },
        //     );
        // }
        // else {
        //     if (
        //         this.state.cardNumber == '' ||
        //         this.state.cardAddress == '' ||
        //         this.state.cvv == '' ||
        //         this.state.holderName == '' || this.state.expiryDate == ''
        //     ) {
        //         toast('Please enter credit card details', 'Error');
        //     } else {
        //         this.setState({ loading: true });
        // console.log(this.props)
        // const { tip, note, date, time, items } = this.state;
        //     this.props.orderRoomSpa(
        //         {
        //         spa_id : this.props.spa.id,
        //         treatments : items,
        //         number_people : items.length,
        //         date : date,
        //         time : time,
        //         currency : this.props.currency,
        //         booking_type : 'normal_reservation',
        //         card_number : this.state.cardNumber,
        //         card_expiry_month : this.state.expiryDate,
        //         card_cvv_number : this.state.cvv,
        //         cardholder_name : this.state.holderName,
        //         is_card_save : this.state.cardSave,
        //         type : this.state.paymentType,
        //         },
        //         () => {
        //             this.setState({ loading: false });
        //                 this.setState({
        //                     tipModal: false,
        //                     tipAlert : false
        //                 });
        //             this._modalProcessCompleteModal.current?.show()
        //         },
        //         () => {
        //             this.setState({ loading: false });
        //             setTimeout(() => {
        //                 this.setState({
        //                     tipModal: false,
        //                     tipAlert : false
        //                 });
        //             }, 500);
        //         },
        //     );
        //     }
        // }
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
    setModalVisible(visible: boolean) {
        this.setState({ modalVisible: visible });
    }
    setModalVisible1(visible: boolean) {
        this.setState({ modalVisible1: visible });
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
                            // this._modalManualData.current?.show()
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
    _handleModalBack() {
        this._modalPaymentFormModal.current?.hide();
    }
    // componentDidMount() {
    //     this._fetch();
    //     this.setState({ dataToShow: this.props.dishesCategories });
    // }
    componentDidUpdate() {
        //     if (this.state.check) {
        //         this.props.dishesCategories.map((data: any) => {
        //             if (data.data) {
        //                 data.data.map((data1: any) => {
        //                     this.state.newArray.push(data1);
        //                 });
        //             }
        //         });
        //         if (this.props.dishesCategories.length != 0) {
        //             this.setState({
        //                 check: false,
        //             });
        //         }
        //     }
        // }
        // _fetch() {
        //     this.setState({ loadingGet: true });
        //     this.props.getRestaurantCategoryDish(
        //         this.props.restaurant.id,
        //         this.props.code,
        //         () => {
        //             this.setState({ loadingGet: false });
        //         },
        //         () => {
        //             this.setState({ loadingGet: false });
        //         },
        //     );
    }

    componentDidMount() {
        console.log('hotel taxes===========>', this.props.hotelTaxes);
        console.log('spa id===========>', this.props.spa.id);
        console.log('spa===========>', this.props.spa);

        this.setState({
            chainData: this.props.chainData,
        });
        this.props.getSpaTreatment(
            this.props.spa.id,
            this.props.code,
            () => {
                this.setState({
                    treatments: this.props.treatments,
                    loadingGet: false,
                });
            },
            () => {
                this.setState({ loadingGet: false });
            },
        );
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
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
        console.log('Pushed');
        // Navigation.push(
        //             this.props.componentId,
        //             requestItems,

        //         );
        console.log(charges, this.props.vat);
        if (this._isLockFeature()) {
            return false;
        }
        if (this.state.items?.length) {
            const array = this.props.hotelTaxes.data.spa;

            console.log('vatt', array?.[this.props.spa.id]);
            console.log('vatt', this.props.hotelTaxes.data.spa);
            let vat = 0;
            // if (Object.keys(array).indexOf(this.props.spa.id.toString()) > -1) {
            //     var index = array?.[this.props.spa.id].findIndex((item: object) => item.tax_title === 'VAT');
            //     vat = array?.[this.props.spa.id][index]?.tax_value;
            // } else {
            //     var index = array?.[0].findIndex((item: object) => item.tax_title === 'VAT');
            //     vat = array?.[0][index]?.tax_value;
            // }
            // const vat =
            //     this.props.hotelTaxes.data.spa?.[this.props.spa.id][0]?.tax_title === 'VAT'
            //         ? this.props.hotelTaxes.data.spa?.[this.props.spa.id][0]?.tax_value
            //         : 0;

            this.props.hotelTaxes.data.spa == undefined
                ? null
                : Object.keys(array).indexOf(this.props.spa.id.toString()) > -1
                ? array?.[this.props.spa.id]
                : array[0],
                // Object.keys(array)
                //                 .indexOf(this.props.spa.id.toString()) > -1
                //                 ? array?.[this.props.spa.id]
                //                 : array[0]
                Navigation.push(
                    this.props.componentId,
                    PaymentDetailScreen({
                        backGround: false,
                        orderItems: this._handleOrderRoomService,
                        currency: this.props.currency,
                        charges: charges,
                        vat: vat,
                        backgroundColor: this.props.icon.spa_color,
                        selectedLanguage: this.props.selectedLanguage,
                        holderName: this.state.holderName,
                        cardNumber: this.state.cardNumber,
                        cardAddress: this.state.cardAddress,
                        cardExpiryDate: this.state.expiryDate,
                        cvv: this.state.cvv,
                        taxes:
                            this.props.hotelTaxes.data.spa == undefined
                                ? null
                                : Object.keys(array).indexOf(this.props.spa.id.toString()) > -1
                                ? array?.[this.props.spa.id]
                                : array[0],
                    }),
                );
        } else {
            this.setState({
                text: this.props.selectedLanguage.please_select_atleast_one_item,
                visible: true,
            });
        }

        // this._modalPaymentFormModal.current?.show()

        // if (this.state.items.length) {
        //     Navigation.push(
        //         this.props.componentId,
        //         mycard({
        //             items: this.state.items,
        //             id: this.props.restaurant.id,
        //             _substractTotalDish: this._substractTotalDish,
        //             _addTotalDish: this._addTotalDish,
        //             restaurant: this.props.restaurant,
        //         }),
        //     );
        // } else {
        //     this.setState({
        //         text: this.props.selectedLanguage.please_select_at_least_one_item,
        //         visible: true,
        //     });
        // }
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _handleModalNoteOrderItem(item: IDish | null, closeModal?: boolean, index: number) {
        return () => {
            Keyboard.dismiss();
            this.setState({
                itemForNote: item,
                indexForNote: index,
                note: item?.note ? item.note : '',
            });
            if (this._modalNoteOrderItem.current) {
                if (closeModal) {
                    this.setState(
                        (prevState) => ({
                            items: prevState.items.map((dish) => {
                                if (dish.id === prevState.selectedItem.id) {
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
                    const selected = find(this.state.items, { id: item ? item.id : 0 });
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
            note: text,
        }));
    }

    _addTotalDish(item: IDish, from: boolean) {
        const index = findIndex(this.state.items, { id: item.id });
        if (index < 0) {
            this.setState((prevState) => ({
                items: [
                    ...prevState.items,
                    {
                        id: item.id,
                        qty: 1,
                        note: '',
                        name: item.name,
                        rate: Number(item.price),
                    },
                ],
            }));
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((dish) => {
                    if (from) {
                        if (dish.id === item.id) {
                            return {
                                ...dish,
                                qty: dish.qty + 1,
                            };
                        }
                    } else {
                        if (dish.id === item.id) {
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
        const selected = find(this.state.items, { id: from ? item.id : item.id });
        if (selected && selected.qty <= 1) {
            if (from) {
                this.setState((prevState) => ({
                    items: prevState.items.filter(({ id }) => id !== item.id),
                }));
            } else {
                this.setState((prevState) => ({
                    items: prevState.items.filter(({ id }) => id !== item.id),
                }));
            }
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((dish) => {
                    if (from) {
                        if (dish.id === item.id) {
                            return {
                                ...dish,
                                qty: dish.qty - 1,
                            };
                        }
                    } else {
                        if (dish.id === item.id) {
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

    _renderItem({ item, index }: { item: IDish; index: number }) {
        const selected = find(this.state.items, { id: item.id });
        const { color, currency } = this.props;
        return (
            <>
                <View
                    style={{
                        borderRadius: scale.w(20),
                        backgroundColor: '#fff',
                        paddingVertical: hp(1.5),
                        width: wp(90),
                        alignSelf: 'center',
                        // paddingHorizontal: wp(2),
                        paddingHorizontal: wp(4),
                        marginBottom: scale.h(20),
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,
                            },
                            android: {
                                elevation: 8,
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
                            source={{ uri: item.image }}
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: scale.w(10),
                            }}
                        />
                        <View style={{ justifyContent: 'space-between' }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: wp(2),
                                    width: wp(65),
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(14),
                                        width: wp(45),
                                        fontFamily: 'Roboto-Medium',
                                        color: colors.HEX,
                                        marginBottom: 5,
                                    }}
                                >
                                    {item.name}
                                </Text>
                                <Text style={{ fontSize: scale.w(14) }}>
                                    {`${currency}${numeral(item.price).format('0,    0a').toUpperCase()}`}
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
                                    paddingLeft: wp(2),
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
                                        style={{ paddingLeft: wp(1.5), color: '#707070' }}
                                    >
                                        <Ionicons name="md-remove" color={colors.GREY} size={scale.w(1.8)} />
                                    </TouchableOpacity>

                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginHorizontal: 1,
                                        }}
                                    >
                                        <H4 fontSize={scale.w(14)}>{selected ? selected.qty : 0}</H4>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this._addTotalDish(item, true)}
                                        activeOpacity={0.7}
                                        style={{ paddingRight: wp(1.5), color: '#707070' }}
                                    >
                                        <Ionicons name="md-add" color={colors.GREY} size={scale.w(1.8)} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={debounce(
                                        this._handleModalNoteOrderItem(item, false, index),
                                        1000,
                                        {
                                            leading: true,
                                            trailing: false,
                                        },
                                    )}
                                    activeOpacity={0.7}
                                    style={{
                                        alignSelf: 'center',
                                        // backgroundColor:'red',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <Text style={{ fontSize: scale.w(15), opacity: 0.4 }}>
                                        {' '}
                                        {item?.note ? item?.note : ''}
                                    </Text>
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
        return <View style={{ height: 25 }} />;
    }

    // Search(val: any) {
    //     if (val === '') {
    //         this.setState({ search: false, dataToShow: this.props.dishesCategories });
    //     } else {
    //         let arr = this.state.newArray.filter((x: any) => {
    //             return x.name.toLowerCase().includes(val.toLowerCase());
    //         });
    //         this.setState({ dataToShow: arr, search: true });
    //     }
    // }

    _handleOrderRoomServiceAllItems(restaurant: IRestaurant) {
        console.log('heloo spa', restaurant);
        Navigation.push(
            this.props.componentId,
            OrderRoomServiceAllItems({
                restaurant: restaurant,
            }),
        );
    }

    render() {
        const { color, currency } = this.props;
        const { proceed_to_card } = this.props.selectedLanguage;
        console.log(JSON.stringify(this.props));
        console.log(this.state.treatments);
        var total_price = 0;
        this.state.items.map((dish) => {
            let row_price = dish.rate * dish.qty;
            total_price = total_price + row_price;
        });
        console.log('totalPifce', total_price);
        if (!this.props.dishesCategories) {
            return null;
        } else {
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
                                        Order
                                        {/* //  {this.props.selectedLanguage.add_to_order} */}
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
                        <ImageBackground
                            resizeMode={'cover'}
                            // source={{ uri: 'https://picsum.photos/200/300' }}
                            source={{ uri: this.props.spa?.logo_url }}
                            style={{ height: hp(30), width: wp(100) }}
                        >
                            <View style={{ height: hp(1.5) }} />
                            <Navbar
                                RightIconColor={colors.WHITE}
                                RightIconName={'search'}
                                tintBackColor={colors.WHITE}
                                titleColor={colors.WHITE}
                                onClick={this._handleBack}
                                title={''}
                            />
                            <View
                                style={{
                                    width: wp(90),
                                    position: 'absolute',
                                    alignSelf: 'center',
                                    marginTop: hp(18),
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => this.setState({ expandImageModal: true })}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        paddingVertical: hp(1.5),
                                    }}
                                >
                                    <FIcon name={'resize-full-screen'} color={colors.WHITE} size={25}></FIcon>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        width: wp(90),
                                        backgroundColor: '#ffff',
                                        alignSelf: 'center',
                                        borderRadius: 10,
                                        paddingVertical: hp(2.4),
                                        paddingHorizontal: wp(6),
                                        borderColor: '#E9E9E9',
                                        borderWidth: 1.5,
                                    }}
                                >
                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <View>
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Bold',
                                                    fontSize: scale.w(2.1),
                                                    color: colors.SignInUsingColor,
                                                }}
                                            >
                                                {/* {this.props.restaurant.name}{' '} */}
                                                {this.props.spa.name}{' '}
                                                <Badge fill={this.props.icon.spa_color} />
                                            </Text>
                                            <View style={{ height: heightPercentageToDP(0.25) }}></View>
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Regular',
                                                    fontSize: scale.w(1.5),
                                                    color: '#9E9E9E',
                                                }}
                                            >
                                                {/* {this.props.spa.location} */}
                                                {`${
                                                    this.props.account?.hotel_details?.data?.country !==
                                                        null ||
                                                    this.props.account?.hotel_details?.data?.city !== null ||
                                                    this.props.account?.hotel_details?.data?.city !== ''
                                                        ? this.props.account?.hotel_details?.data?.city +
                                                          ' ' +
                                                          this.props.account?.hotel_details?.data?.country
                                                        : ''
                                                } `}
                                            </Text>
                                        </View>
                                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.38),
                                                    color: this.props.icon.spa_color,
                                                    fontFamily: 'Roboto-Regular',
                                                }}
                                            >
                                                {this.props.selectedLanguage.working_hours}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.38),
                                                    fontFamily: 'Roboto-Regular',
                                                    color: this.props.icon.spa_color,
                                                }}
                                            >
                                                {/* {this.props.restaurant.opening_time} -{' '}
                                                {this.props.restaurant.closing_time} */}
                                                9:00 - 6:00
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                        <View style={{ height: hp(7.5) }} />
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
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: wp(7),
                                paddingVertical: hp(1),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: scale.w(2.3),
                                    fontFamily: 'Harabara',
                                    letterSpacing: 0.7,
                                    fontWeight: '100',
                                }}
                            >
                                {this.props.selectedLanguage.new_services}
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    Navigation.push(
                                        this.props.componentId,
                                        spaorderroomserviceallitems({ spa: this.props.spa }),
                                    )
                                }

                                // onPress={()=> console.log("Hello")}

                                // onPress={() =>
                                //     this._handleOrderRoomServiceAllItems(
                                //         this.props.restaurant,
                                //     )
                                // }
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(1.38),
                                        fontFamily: 'Roboto-Regular',
                                        color: this.props.icon.spa_color,
                                    }}
                                >
                                    {this.props.selectedLanguage.see_all}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.treatments && this.state.treatments?.length > 0 ? (
                            <FlatList
                                ref={(ref) => {
                                    this.flatlistRef = ref;
                                }}
                                // refreshControl={
                                //     <RefreshControl onRefresh={this._fetch} refreshing={false} />
                                // }
                                data={this.state.treatments}
                                renderItem={({ item, index }: { item: IDish; index: number }) => {
                                    const selected = find(this.state.items, { id: item.id });
                                    const { color, currency } = this.props;
                                    return (
                                        <>
                                            {/*New section start*/}
                                            <View
                                                style={{
                                                    borderRadius: scale.w(2.5),
                                                    backgroundColor: '#fff',
                                                    paddingHorizontal: wp(2),
                                                    width: wp(90),
                                                    alignSelf: 'center',
                                                    paddingTop: heightPercentageToDP(0.5),
                                                }}
                                            >
                                                <View
                                                    activeOpacity={1}
                                                    style={{
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{ width: '25%' }}>
                                                        {item.image ==
                                                        'https://cms.servrhotels.com/images/default.jpg' ? (
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    this.setState({
                                                                        ImageZoomModal: true,
                                                                        Image_URL: {
                                                                            uri: 'https://cms.servrhotels.com/images/default.png',
                                                                        },
                                                                    })
                                                                }
                                                            >
                                                                <Image
                                                                    source={{
                                                                        uri: 'https://cms.servrhotels.com/images/default.png',
                                                                    }}
                                                                    style={{
                                                                        width: widthPercentageToDP(19),
                                                                        height: widthPercentageToDP(19),
                                                                        borderRadius: scale.w(1.5),
                                                                        alignSelf: 'center',
                                                                    }}
                                                                />
                                                            </TouchableOpacity>
                                                        ) : (
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    this.setState({
                                                                        ImageZoomModal: true,
                                                                        Image_URL: { uri: item.image },
                                                                    })
                                                                }
                                                            >
                                                                <Image
                                                                    source={{ uri: item.image }}
                                                                    style={{
                                                                        width: widthPercentageToDP(20),
                                                                        height: widthPercentageToDP(21.5),
                                                                        borderRadius: scale.w(1.5),
                                                                        alignSelf: 'center',
                                                                    }}
                                                                    indicator={<ActivityIndicator />}
                                                                    resizeMode={'cover'}
                                                                    indicatorProps={{
                                                                        size: 20,
                                                                        borderWidth: 0,
                                                                        color: 'rgba(150, 150, 150, 1)',
                                                                        unfilledColor:
                                                                            'rgba(200, 200, 200, 0.2)',
                                                                    }}
                                                                    imageStyle={{
                                                                        borderRadius: scale.w(1.5),
                                                                    }}
                                                                />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                    <View style={{ width: '75%' }}>
                                                        <View
                                                            style={{
                                                                width: '100%',
                                                                flexDirection: 'row',
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    width: '60%',
                                                                    paddingLeft: '2%',
                                                                }}
                                                            >
                                                                <View>
                                                                    <Text
                                                                        style={{
                                                                            fontSize: scale.w(1.4),
                                                                            width: wp(45),
                                                                            color: colors.SignInUsingColor,
                                                                            fontFamily: 'Roboto-Medium',
                                                                        }}
                                                                    >
                                                                        {item.name
                                                                            ? item.name?.length > 24
                                                                                ? item.name.substring(0, 24) +
                                                                                  '...'
                                                                                : item.name
                                                                            : null}
                                                                    </Text>
                                                                </View>
                                                                <View>
                                                                    <Text
                                                                        style={{
                                                                            fontSize: scale.w(1.4),
                                                                            width: wp('40%'),
                                                                            color: colors.SignInUsingColor,
                                                                            fontFamily: 'Roboto-Regular',
                                                                        }}
                                                                    >
                                                                        <H4 fontSize={scale.w(1.4)}>
                                                                            {item.description
                                                                                ? item.description.length > 75
                                                                                    ? item.description.substring(
                                                                                          0,
                                                                                          75,
                                                                                      ) + '...'
                                                                                    : item.description
                                                                                : null}
                                                                            {/* asdfasdfasdfasdfasdfasdfasdffasdf */}
                                                                        </H4>
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ width: '40%' }}>
                                                                {/*Add note rect start*/}
                                                                <TouchableOpacity
                                                                    onPress={debounce(
                                                                        this._handleModalNoteOrderItem(
                                                                            item,
                                                                            false,
                                                                            index,
                                                                        ),
                                                                        1000,
                                                                        {
                                                                            leading: true,
                                                                            trailing: false,
                                                                        },
                                                                    )}
                                                                    activeOpacity={0.7}
                                                                    style={{
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            fontSize: scale.w(1.4),
                                                                            opacity: 0.4,
                                                                            fontFamily: 'Roboto-Regular',
                                                                            alignSelf: 'flex-end',
                                                                        }}
                                                                    >
                                                                        {item?.note
                                                                            ? 'Note Added'
                                                                            : this.props.selectedLanguage
                                                                                  .add_note}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                                {/*Add note rect end*/}
                                                                {/*Price qty section start*/}
                                                                <View
                                                                    style={{
                                                                        width: '100%',
                                                                        marginTop: 8,
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            borderWidth: 2,
                                                                            borderRadius: scale.w(0.8),
                                                                            borderColor:
                                                                                colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR,
                                                                            justifyContent: 'space-between',
                                                                            width: wp(19),
                                                                            alignItems: 'center',
                                                                            alignSelf: 'flex-end',
                                                                            height: heightPercentageToDP(4),
                                                                        }}
                                                                    >
                                                                        <TouchableOpacity
                                                                            disabled={
                                                                                selected && selected.qty == 0
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            onPress={() =>
                                                                                this._substractTotalDish(
                                                                                    item,
                                                                                    true,
                                                                                )
                                                                            }
                                                                            activeOpacity={0.7}
                                                                            style={{
                                                                                paddingLeft: wp(1.5),
                                                                                color: '#707070',
                                                                            }}
                                                                        >
                                                                            <Ionicons
                                                                                name="md-remove"
                                                                                color={colors.GREY}
                                                                                size={scale.w(2.5)}
                                                                            />
                                                                        </TouchableOpacity>
                                                                        <View
                                                                            style={{
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                marginHorizontal: 1,
                                                                            }}
                                                                        >
                                                                            <H4
                                                                                fontFamily={'Roboto-Bold'}
                                                                                fontSize={scale.w(1.7)}
                                                                            >
                                                                                {selected ? selected.qty : 0}
                                                                            </H4>
                                                                        </View>
                                                                        <TouchableOpacity
                                                                            onPress={() =>
                                                                                this._addTotalDish(item, true)
                                                                            }
                                                                            activeOpacity={0.7}
                                                                            style={{
                                                                                paddingRight: wp(1.5),
                                                                                color: '#707070',
                                                                            }}
                                                                        >
                                                                            <Ionicons
                                                                                name="md-add"
                                                                                color={colors.GREY}
                                                                                size={scale.w(2.5)}
                                                                            />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                                {/*Price qty section start*/}
                                                            </View>
                                                        </View>
                                                        <View
                                                            style={{
                                                                width: '100%',
                                                                flexDirection: 'row',
                                                                marginBottom: 0,
                                                                bottom: 0,
                                                                position: 'absolute',
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    width: '30%',
                                                                    paddingLeft: '2%',
                                                                }}
                                                            >
                                                                {item.description || item.name ? (
                                                                    item.description?.length > 75 ||
                                                                    item.name?.length > 24 ? (
                                                                        <TouchableOpacity
                                                                            onPress={debounce(
                                                                                this._handleSeeMoreItem(
                                                                                    item,
                                                                                    false,
                                                                                    index,
                                                                                ),
                                                                                1000,
                                                                                {
                                                                                    leading: true,
                                                                                    trailing: false,
                                                                                },
                                                                            )}
                                                                        >
                                                                            <Text
                                                                                style={{
                                                                                    opacity: 0.4,
                                                                                    fontFamily:
                                                                                        'Roboto-Regular',
                                                                                    fontSize: scale.w(1.4),
                                                                                }}
                                                                            >
                                                                                see more
                                                                            </Text>
                                                                        </TouchableOpacity>
                                                                    ) : null
                                                                ) : null}
                                                            </View>
                                                            <View
                                                                style={{
                                                                    width: '70%',
                                                                    alignItems: 'flex-end',
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: scale.w(1.4),
                                                                        textAlign: 'center',
                                                                        fontFamily: 'Roboto',
                                                                    }}
                                                                >
                                                                    {`${currency} ${' '}${parseFloat(
                                                                        item.price,
                                                                    )}`}
                                                                    {/* {`${currency}${numeral(item.price)
                                                                            .format('0,0a')
                                                                            .toUpperCase()}`} */}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                {/*Space rect start*/}
                                                <View style={{ height: heightPercentageToDP(1) }}></View>
                                                <View
                                                    style={{
                                                        borderBottomWidth: 1,
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#E9E9E9',
                                                    }}
                                                ></View>
                                                <View style={{ height: heightPercentageToDP(1) }}></View>
                                                {/*Space rect end*/}
                                            </View>
                                            {/*New section end*/}
                                        </>
                                    );
                                }}

                                //     ({ item, index }) => {
                                //     console.log(item)
                                //     return (
                                //         <View style={{ paddingHorizontal: scale.w(20) }}>
                                //             {index == 0 ? (
                                //                 <View
                                //                     style={{
                                //                         flexDirection: 'row',
                                //                         justifyContent: 'space-between',
                                //                         paddingHorizontal: wp(5),
                                //                   //      paddingVertical: hp(2),
                                //                     }}
                                //                 >
                                //                     <Text
                                //                         style={{
                                //                             fontSize: scale.w(20),
                                //                             fontWeight: 'bold',
                                //                         }}
                                //                     >
                                //                         New Services
                                //                     </Text>
                                //                     <TouchableOpacity
                                //                     // onPress={() =>
                                //                     //     this._handleOrderRoomServiceAllItems(
                                //                     //         this.props.restaurant,
                                //                     //     )
                                //                     // }
                                //                     >
                                //                         <Text
                                //                             style={{
                                //                                 fontSize: scale.w(16),
                                //                                 fontWeight: 'bold',
                                //                                 color: colors.BLUE,
                                //                             }}
                                //                         >
                                //                             See All
                                //                         </Text>
                                //                     </TouchableOpacity>
                                //                 </View>
                                //             ) : (
                                //                 <View
                                //                     style={{
                                //                         paddingBottom: scale.h(15),
                                //                         backgroundColor: '#fff',
                                //                         marginTop: scale.h(15),
                                //                     }}
                                //                 >
                                //                     <H2 fontSize={scale.w(20)}>
                                //                         {item.title
                                //                             ? item.title.length > 30
                                //                                 ? item.title.substring(0, 30) + '...'
                                //                                 : item.title
                                //                             : null}
                                //                     </H2>
                                //                 </View>
                                //             )}
                                //         </View>
                                //     );
                                // }}
                            />
                        ) : this.state.loadingGet ? (
                            <View style={{ marginTop: hp(20), justifyContent: 'center' }}>
                                <Image
                                    source={{
                                        uri: this.state.chainData.data.logo_gif_dark,
                                    }}
                                    style={{ height: 40, width: 80, alignSelf: 'center' }}
                                    // source={{uri:this.state.chainData.data.logo_gif_light}}
                                    // style={{ height: 40, width: 80, alignSelf: 'center', tintColor: this.props.icon.spa_color }}
                                ></Image>
                            </View>
                        ) : (
                            <View style={{ marginTop: hp(20), justifyContent: 'center' }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 15,
                                        fontWeight: 'bold',
                                        color: colors.GREY,
                                    }}
                                >
                                    {this.props.selectedLanguage.no_data_found}
                                </Text>
                            </View>
                        )}
                    </View>
                    <ProceedPayment
                        // price={'$' + 43 + '.' + '' + total_price.toFixed(0)}

                        price={`${currency} ${total_price.toFixed(2)}`}
                        total={this.props.selectedLanguage.total}
                        btnText={this.props.selectedLanguage.checkout}
                        onPress={() => this.proceed_to_card(total_price.toFixed(0))}
                        backGroundColor={this.props.icon.spa_color}
                    />
                    <CustomModal ref={this._modalSeeMore} animationIn="fadeInUp" animationOut="fadeOutDown">
                        <ModalSeeMore
                            value={this.state.note}
                            onChangeText={this._onChangeText}
                            showModal={this._handleSeeMoreItem(
                                this.state.itemForNote,
                                true,
                                this.state.indexForNote,
                            )}
                            item={this.state.itemForNote}
                            title={`Note`}
                            color={color}
                            description={this.props.selectedLanguage.write_anything_about_this_item_order}
                            done={this.props.selectedLanguage.done}
                            chainData={this.props.chainData}
                            currency={this.props.currency}
                            onClock={this._handleClose}
                        />
                    </CustomModal>
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
                        ref={this._modalNoteOrderItem}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <NoteOrderItem
                            value={this.state.note}
                            onChangeText={this._onChangeText}
                            showModal={this._handleModalNoteOrderItem(
                                this.state.itemForNote,
                                true,
                                this.state.indexForNote,
                            )}
                            title={`${this.state.selectedItem.name} Note`}
                            color={color}
                            chainData={this.props.chainData}
                            //description={"write_anything_about_this_item_order"}
                            //done={this.props.selectedLanguage.done}
                        />
                    </CustomModal>

                    {/* <AttentionModal
                        visible={this.state.visible}
                        toggleModal={this.toggleModal}
                        text={this.state.text}
                        //  attention={this.props.selectedLanguage.attention}
                        //ok={this.props.selectedLanguage.ok}
                    />

                    // <ImageExpandModal
                    //     modalVisible={this.state.expandImageModal}
                    //     Image={{ uri: 'https://picsum.photos/200/300' }}
                    //     onBack={() => this.setState({ expandImageModal: false })}
                    //     onBackDr
                    op={() => console.log('hello')}
                    // /> */}

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
                                                        buttonWrapStyle={{ marginLeft: 10 }}
                                                    />
                                                    <RadioButtonLabel
                                                        obj={obj}
                                                        index={i}
                                                        labelHorizontal={true}
                                                        onPress={async () => {}}
                                                        labelStyle={{ fontSize: 20 }}
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
                                                      this.setState({ tipAlert: true });
                                                  }, 500);
                                              }
                                            : debounce(this._handleModalDatePicker(false), 1000, {
                                                  leading: true,
                                                  trailing: false,
                                              })
                                    }
                                    loading={this.state.loading}
                                    disabled={this.state.loading}
                                    text={'Confirm'}
                                    backgroundColor={colors.BLUE}
                                    chainData={this.props.chainData}
                                />
                            </View>
                            <View style={{ height: hp(2) }}></View>
                        </View>
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

                    <AttentionModal
                        visible={this.state.visible}
                        toggleModal={this.toggleModal}
                        text={this.state.text}
                        attention={this.props.selectedLanguage.attention}
                        ok={this.props.selectedLanguage.ok}
                    />
                    <ImageExpandModal
                        modalVisible={this.state.expandImageModal}
                        Image={{ uri: this.props.spa?.logo_url }}
                        onBack={() => this.setState({ expandImageModal: false })}
                        onBackDrop={() => this.setState({ expandImageModal: false })}
                    />

                    <CustomModal
                        style={{ margin: -1 }}
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
                            onCardSave={(val) => this.setState({ cardSave: val })}
                            cardSave={this.state.cardSave}
                            onPrimaryClick={() => this._handleOrderRoomService()}
                            chainData={this.props.chainData}
                        />
                    </CustomModal>

                    <CustomModal
                        style={{ margin: -1 }}
                        ref={this._modalProcessCompleteModal}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <ProcessCompleteModal
                            backgroundColor={this.props.icon.spa_color}
                            processTitle={this.props.selectedLanguage.request_successfull}
                            processDescription={
                                this.props.selectedLanguage
                                    .you_have_successfully_requested_for_spa_room_service
                            }
                            btnText={this.props.selectedLanguage.go_to_home}
                            onButtonPress={() => Navigation.popTo('spaService')}
                            processImage={require('../../images/paymentSuccess.png')}
                            chainData={this.props.chainData}
                            // onBackClick={this._handleModalBack}
                            // onScanIconClick={() => this.scanCard()}
                            // holderName={this.state.holderName}
                            // onChangeHolderName={(val) => this.setState({ holderName : val })}
                            // cardNumber={this.state.cardNumber}
                            // onChangeCardNumber={(val) => this.setState({cardNumber : val})}
                            // cardAddress={this.state.cardAddress}
                            // isLoading={this.state.loading}
                            // onChangeCardAddress={(val) => this.setState({ cardAddress : val})}
                            // cardExpiryDate={this.state.expiryDate}
                            // onChangeCardExpiry={(val) => this.setState({ expiryDate : val })}
                            // onChangeCVV={(val) => this.setState({cvv : val})}
                            // onPrimaryClick={() => Alert.alert("Hello World")}
                        />
                    </CustomModal>

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
                                                    onChangeText={(tip) => {
                                                        this.setState({ tip });
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
                                                                tipModal: false,
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
                                                        this.setState({ tipAlert: false });
                                                        if (this.state.paymentType == 'cash') {
                                                            this._handleOrderRoomService();
                                                        } else {
                                                            this._modalPaymentFormModal.current?.show();
                                                        }
                                                    }}
                                                    loading={false}
                                                    disabled={false}
                                                    fontSize={scale.w(2)}
                                                    text={this.props.selectedLanguage.no}
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
                                                    fontSize={scale.w(2)}
                                                    text={this.props.selectedLanguage.yes}
                                                    chainData={this.props.chainData}
                                                />
                                            </View>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>

                    <ImageZoomModal
                        modalVisible={this.state.ImageZoomModal}
                        onBack={() => this.setState({ ImageZoomModal: false })}
                        onBackDrop={() => this.setState({ ImageZoomModal: false })}
                        Image={this.state.Image_URL}
                        onBackArrow={() => this.setState({ ImageZoomModal: false })}
                        isExpandModalExists={true}
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

export default SpaOrderRoomService;
