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
    Image,
    Text,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
} from 'react-native';
import base from '../../utils/baseStyles';
import {
    scale,
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import { H2, H4, H3 } from '../_global/Text';
import { Menu, MenuItem, Position, MenuDivider } from 'react-native-enhanced-popup-menu';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import { IRequestItemsReduxProps } from './RequestItems.Container';
import colors from '../../constants/colors';
import { IServiceItem } from '../../types/conciergeService';
import { debounce, find, findIndex, padStart } from 'lodash';
import { ICreateRequestItem } from '../../types/action.conciergeService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NoteServiceRequestItem from './Components/NoteServiceRequestItem';
import CustomModal from '../_global/CustomModal';
import PaymentFormModal from '../_global/paymentFormModal';
import Modal from 'react-native-modal';
import {
    conciergeTrackingProgress,
    PaymentDetailScreen,
    proceedRequestItems,
    proceedRoomCleaning,
} from '../../utils/navigationControl';
import AttentionModal from '../_global/AttentionModal';
import ProceedPayment from '../_global/proceedPayment';
import ProcessComplete from '../_global/processComplete';
import Cardscan from 'react-native-cardscan';
import { toast } from '../../utils/handleLogic';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import moment from 'moment';
import ModalTimePicker from '../Restaurant/Components/ModalTimePicker';
import { IFeatureHotel } from '../../types/hotel';
import InputText from './../_global/InputText';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ImageZoomModal from '../_global/ImageZoomModal';
import { RootContainer } from '../_global/Container';
import DropShadow from 'react-native-drop-shadow';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface IRequestItemsProps extends IRequestItemsReduxProps {
    componentId: string;
}

interface ISelectedItems extends ICreateRequestItem {
    name: string;
}

interface IRequestItemsState {
    items: ISelectedItems[];
    selectedItem: ISelectedItems;
    serviceItems: Array;
    loadingGet: boolean;
    loading: boolean;
    modalVisible: boolean;
    title: string;
    description: string;
    item: any;
    visible: boolean;
    text: string;
    total_price: string;
    holderName: string;
    cardNumber: string;
    cardAddress: string;
    expiryDate: string;
    cvv: string;
    saveCard: boolean;
    paymentType: string;
    note: string;
    vip_note: string;
    date: string;
    time: string;
    type: string;
    selectedIndex: number;
    tipAlert: boolean;
    tipModal: boolean;
    tip: string;
    ZoomImageModal: boolean;
    Image_URL: string;
    counterServices: number;
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

class RequestItems extends React.Component<IRequestItemsProps, IRequestItemsState> {
    private _modalNoteServiceRequestItem = React.createRef<CustomModal>();
    private _modalPaymentFormModal = React.createRef<CustomModal>();
    private _modalPaymentSuccessfullModal = React.createRef<CustomModal>();
    private _modalConfirm = React.createRef<CustomModal>();
    private _modalPaymentType = React.createRef<CustomModal>();
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalTimePicker = React.createRef<CustomModal>();

    constructor(props: IRequestItemsProps) {
        super(props);

        this.state = {
            items: [],
            counterServices: 0,
            selectedItem: {
                service_id: 0,
                qty: 0,
                note: '',
                name: '',
            },
            serviceItems: [],
            loadingGet: false,
            loading: false,
            modalVisible: false,
            title: '',
            description: '',
            item: [],
            visible: false,
            text: '',
            total_price: '',
            holderName: props?.card?.cardholder_name || '',
            cardNumber: props?.card?.card_number_full || '',
            cardAddress: props?.card?.card_address || '',
            expiryDate: props?.card?.card_expiry_date || '',
            cvv: props?.card?.card_cvv_number || '',
            saveCard: false,
            paymentType: '',
            note: '',
            vip_note: '',
            date: '',
            time: '',
            type: '0',
            selectedIndex: 0,
            tipAlert: false,
            tipModal: false,
            tip: '',
            ZoomImageModal: false,
            Image_URL: '',
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
        this._handleRequestItems = this._handleRequestItems.bind(this);
        this._handleModalNoteServiceRequestItem = this._handleModalNoteServiceRequestItem.bind(this);
        this._onChangeText = this._onChangeText.bind(this);
        this._addTotalService = this._addTotalService.bind(this);
        this._substractTotalService = this._substractTotalService.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderListHeaderComponent = this._renderListHeaderComponent.bind(this);
        this._renderItemSeparatorComponent = this._renderItemSeparatorComponent.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._handleRequest = this._handleRequest.bind(this);
        this.scanCard = this.scanCard.bind(this);
        this._handleModalBack = this._handleModalBack.bind(this);
        this.GoHomeClick = this.GoHomeClick.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
        this._handleModalTimePicker = this._handleModalTimePicker.bind(this);
        this._handleModalDatePicker = this._handleModalDatePicker.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._onChangeTime = this._onChangeTime.bind(this);
    }

    componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        });
        // this.props.getConciergeServiceItems();
        this._fetch();
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    _fetch() {
        this.setState({ loadingGet: true });
        // this.props.getConciergeServiceItems(
        //     this.props.code,
        //     () => {
        //         this.setState({ loadingGet: false });
        //     },
        //     () => {
        //         this.setState({ loadingGet: false });
        //     },
        // );
        this.setState({
            loadingGet: false,
            serviceItems: this.props.serviceItems,
        });
        this.setState({
            loadingGet: false,
        });
        // this.props.getConciergeServiceItems(
        //     this.props.code,
        //     (data?: any) => {
        //         console.log('datas', data);
        //         this.setState({
        //             loadingGet: false,
        //             serviceItems: data,
        //         });
        //     },
        //     () => {
        //
        //     },
        // );
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
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

    _handleRequestItems({
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
            this.props.createRequest(
                {
                    concierge_services: this.state.items,
                    current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    currency: this.props.currency,
                    card_number: cardNumber,
                    card_expiry_month: expiryDate,
                    card_cvv_number: cvv,
                    cardholder_name: holderName,
                    // notes : notes,
                    cardAddress: cardAddress,
                    tip: tip,
                    date: date,
                    time: time,
                    type: paymentType,
                    is_card_save: saveCards,
                    reservation_date_time: `${moment(date).format('YYYY-MM-DD')} ${moment(time).format(
                        'HH:MM:SS',
                    )}`,
                    vip_note: notes,
                },
                () => {
                    this.setState({ loading: false });
                    this.setState({
                        tipModal: false,
                        tipAlert: false,
                    });
                    this._modalPaymentSuccessfullModal.current?.show();
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
        // if (this.state.paymentType == 'card') {
        //     if (
        //         this.state.cardNumber == '' ||
        //         this.state.cardAddress == '' ||
        //         this.state.cvv == '' ||
        //         this.state.holderName == ''
        //     ) {
        //         toast('Please enter credit card details', 'Error');
        //     } else {
        //         if (!this.props.isCheckedIn) {
        //             // Alert.alert('Attention', 'Please check in first, to use this service');
        //             this.setState({
        //                 text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
        //                 visible: true,
        //             });
        //         } else if (this.props.status == 'pending') {
        //             // Alert.alert('Attention', 'To use this feature, your check in must be accepted by hotel admin');
        //             this.setState({
        //                 text: this.props.selectedLanguage
        //                     .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
        //                 visible: true,
        //             });
        //             // } else if (this.state.cardNumber == '' || this.state.cardAddress == '' || this.state.holderName == '' || this.state.expiryDate == '' || this.state.cvv == '' ) {
        //             //     Alert.alert("Enter Card Details to proceed", this.state.cardNumber+"   "+ this.state.cardAddress+"   "+  this.state.expiryDate +"   "+ this.state.cvv)
        //         } else {
        //             // this.setState({ loading: true });
        //             this.setState({
        //                 loading: true,
        //             });

        //             const tempObject = {
        //                 concierge_services: this.state.items,
        //                 current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        //                 currency: this.props.currency,
        //                 card_number: this.state.cardNumber,
        //                 card_expiry_month: this.state.expiryDate,
        //                 card_cvv_number: this.state.cvv,
        //                 cardholder_name: this.state.holderName,
        //                 is_card_save: this.state.saveCard,
        //                 type: 'card',
        //             };
        //             this.props.createRequest(
        //                 tempObject,
        //                 (message) => {
        //                     this.setState({ loading: false });
        //                     this._modalPaymentSuccessfullModal.current?.show();
        //                     // await Navigation.push('conciergeService', conciergeTrackingProgress);
        //                     // Alert.alert('Success', message);
        //                 },
        //                 () => {
        //                     this.setState({ loading: false });
        //                 },
        //             );
        //         }
        //     }
        // } else {
        //     if (!this.props.isCheckedIn) {
        //         // Alert.alert('Attention', 'Please check in first, to use this service');
        //         this.setState({
        //             text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
        //             visible: true,
        //         });
        //     } else if (this.props.status == 'pending') {
        //         // Alert.alert('Attention', 'To use this feature, your check in must be accepted by hotel admin');
        //         this.setState({
        //             text: this.props.selectedLanguage
        //                 .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
        //             visible: true,
        //         });
        //         // } else if (this.state.cardNumber == '' || this.state.cardAddress == '' || this.state.holderName == '' || this.state.expiryDate == '' || this.state.cvv == '' ) {
        //         //     Alert.alert("Enter Card Details to proceed", this.state.cardNumber+"   "+ this.state.cardAddress+"   "+  this.state.expiryDate +"   "+ this.state.cvv)
        //     } else {
        //         // this.setState({ loading: true });
        //         this.setState({
        //             loading: true,
        //         });

        //         const tempObject = {
        //             concierge_services: this.state.items,
        //             current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        //             currency: this.props.currency,
        //             card_number: '',
        //             card_expiry_month: '',
        //             card_cvv_number: '',
        //             cardholder_name: '',
        //             is_card_save: false,
        //             type: 'cash',
        //         };
        //         this.props.createRequest(
        //             tempObject,
        //             (message) => {
        //                 this.setState({ loading: false });
        //                 this._modalPaymentSuccessfullModal.current?.show();
        //                 // await Navigation.push('conciergeService', conciergeTrackingProgress);
        //                 // Alert.alert('Success', message);
        //             },
        //             () => {
        //                 this.setState({ loading: false });
        //             },
        //         );
        //     }
        // }
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _handleModalNoteServiceRequestItem(item: IServiceItem | null, closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalNoteServiceRequestItem.current) {
                if (closeModal) {
                    this.setState(
                        (prevState) => ({
                            items: prevState.items.map((dish) => {
                                if (dish.service_id === prevState.selectedItem.service_id) {
                                    return {
                                        ...dish,
                                        note: prevState.selectedItem.note,
                                    };
                                }

                                return dish;
                            }),
                        }),
                        this._modalNoteServiceRequestItem.current.hide,
                    );
                } else {
                    const selected = find(this.state.items, { service_id: item ? item.id : 0 });
                    this.setState(
                        { selectedItem: selected ? selected : this.state.selectedItem },
                        this._modalNoteServiceRequestItem.current.show,
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

    _addTotalService(item: IServiceItem) {
        console.log(this.state.items);
        const index = findIndex(this.state.items, { service_id: item.id });

        if (index < 0) {
            this.setState((prevState) => ({
                items: [
                    ...prevState.items,
                    {
                        service_id: item.id,
                        qty: 1,
                        note: '',
                        name: item.name,
                        price: item.price,
                    },
                ],
            }));
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((service) => {
                    if (service.service_id === item.id) {
                        return {
                            ...service,
                            qty: service.qty + 1,
                        };
                    }

                    return service;
                }),
            }));
        }
    }

    _substractTotalService(item: IServiceItem) {
        const selected = find(this.state.items, { service_id: item.id });

        if (selected && selected.qty <= 1) {
            this.setState((prevState) => ({
                items: prevState.items.filter(({ service_id }) => service_id !== item.id),
            }));
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((service) => {
                    if (service.service_id === item.id) {
                        return {
                            ...service,
                            qty: service.qty - 1,
                        };
                    }

                    return service;
                }),
            }));
        }
    }

    _keyExtractor(item: IServiceItem) {
        return item.id.toString();
    }

    _renderListHeaderComponent() {
        return (
            <View style={styles.text_container}>
                <H4 fontSize={scale.w(1.8)} textAlign="center">
                    {this.props.selectedLanguage.request_items_to_be_sent_to_your_room}
                </H4>
            </View>
        );
    }

    _renderItemSeparatorComponent() {
        return <View style={{ height: scale.w(0) }} />;
    }

    _renderItem({ item, index }: { item: IServiceItem }) {
        const selected = find(this.state.items, { service_id: item.id });

        console.log('data', item);
        const { color } = this.props;
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
                    paddingTop: index == 0 ? heightPercentageToDP(5) : 0,
                    paddingBottom:
                        this.props.serviceItems.length - 1 == index
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
                        {/* {mage == 'https://cms.servrhotels.com/images/default.jpg' ||
                        mage == undefined ||
                        mage == null ? (
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
                            //         imageURL: mage,
                            //     });
                            // }}
                            onPress={() =>
                                this.setState({
                                    ZoomImageModal: true,
                                    Image_URL: item?.image,
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
                                source={{ uri: item?.image }}
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
                            {item?.name}
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
                                {item?.category_name}
                            </Text>
                            <TouchableOpacity
                                onPress={() => this.changeOrderItem(item, index)}
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: item?.order
                                        ? this.props.icon.concierge_color
                                        : colors.WHITE,
                                    paddingHorizontal: widthPercentageToDP(3),
                                    paddingVertical: heightPercentageToDP(0.3),
                                    borderRadius: scale.w(0.7),
                                    justifyContent: 'center',
                                    borderWidth: 0.5,
                                    borderColor: item?.order ? 'transparent' : 'rgba(141,145,162,0.27)',
                                }}
                            >
                                <Text
                                    style={{
                                        alignSelf: 'center',
                                        fontFamily: 'Roboto-Bold',
                                        fontSize: scale.w(1.7),
                                        color: item?.order ? colors.WHITE : '#B3B9C7',
                                    }}
                                >
                                    {this.props.selectedLanguage.add}
                                </Text>
                                <Icon
                                    name={'plus'}
                                    size={20}
                                    color={item?.order ? colors.WHITE : '#B3B9C7'}
                                ></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </DropShadow>
        );
    }

    _handleRequest(charges) {
        if (this._isLockFeature()) {
            return false;
        }
        if (this.state.items?.length > 0) {
            Navigation.push(
                this.props.componentId,
                PaymentDetailScreen({
                    backGround: false,
                    orderItems: this._handleRequestItems,
                    currency: this.props.currency,
                    charges: charges,
                    vat: this.props.vat,
                    backgroundColor: this.props.icon.concierge_color,
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
                text: this.props.selectedLanguage.please_select_atleast_one_item,
                visible: true,
            });
        }
    }

    GoHomeClick() {
        Navigation.popTo('conciergeService');
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
                            this._modalManualData.current?.show();
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
                        toast(this.props.selectedLanguage.please_select_date_and_time_first);
                    }
                } else {
                    this._modalTimePicker.current.show();
                    this.setState({ time: new Date().toString() });
                }
            }
        };
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
                    proceedRequestItems({
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
        console.log('aa before', a);
        a[index] = {
            id: item.id,
            image: item.image,
            name: item.name,
            order: !item.order,
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
        const { color } = this.props;
        const { conceirge_service, request_items } = this.props.selectedLanguage;
        var total_price = 0;
        this.state.items.map((dish) => {
            console.log(dish);
            let row_price = dish.price ? dish.price * dish.qty : 0;
            total_price = total_price + row_price;
        });
        console.log('serviceItems', this.state.serviceItems);
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
                            backgroundColor: this.props.icon.concierge_color,
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
                            title={request_items}
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
                            {/* <View style={{ flex: 1, paddingHorizontal : wp(5) }}> */}
                            <FlatList
                                refreshControl={<RefreshControl onRefresh={this._fetch} refreshing={false} />}
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
                                                    jhlkjk
                                                </View>
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
                                data={this.state.serviceItems}
                                // extraData={this.state}
                                // keyExtractor={this._keyExtractor}
                                // ItemSeparatorComponent={this._renderItemSeparatorComponent}
                                renderItem={this._renderItem}
                                initialNumToRender={10}
                            />

                            {/* </View> */}

                            {/* <View style={{ height: hp(15) }} /> */}
                        </ScrollView>
                    </View>
                </RootContainer>
                {/* <View
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
                        price={this.props.currency + ' ' + total_price.toFixed(0)}
                        btnText={this.props.selectedLanguage.checkout}
                        loader={this.state.loading}
                        onPress={() => this._handleRequest(total_price.toFixed(0))}
                        total={this.props.selectedLanguage.total}
                    />
                </View> */}
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
                                                    this.menuRef.show(this.dropDownRef, Position.TOP_RIGHT);
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
                                                        this._handleRequestItems();
                                                    }
                                                }
                                            }}
                                            loading={this.state.loadingGet}
                                            disabled={this.state.loadingGet}
                                            text={'Confrim Order'}
                                            backgroundColor={colors.BLUE}
                                            fontSize={scale.w(1.2)}
                                            fontWeight={'bold'}
                                            chainData={this.props.chainData}
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text style={{ fontSize: scale.w(1.7), fontFamily: 'Robo-Medium' }}>
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
                                                        this._handleRequestItems();
                                                    }
                                                }}
                                                loading={false}
                                                disabled={false}
                                                fontSize={scale.w(1.4)}
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
                                                fontSize={scale.w(1.65)}
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

                <CustomModal ref={this._modalPaymentType} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <View
                        style={{
                            width: wp(80),
                            borderRadius: 10,
                            backgroundColor: colors.WHITE,
                            paddingHorizontal: 20,
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
                                paddingVertical: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={{ fontSize: scale.w(1.6), fontWeight: 'bold' }}>Pay By Cash</Text>
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
                                paddingVertical: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={{ fontSize: scale.w(1.6), fontWeight: 'bold' }}>Pay By Card</Text>
                        </TouchableOpacity>
                    </View>
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
                                loading={this.state.loadingGet}
                                disabled={this.state.loadingGet}
                                fontWeight={'bold'}
                                text={this.props.selectedLanguage.confirm}
                                backgroundColor={colors.BLUE}
                                chainData={this.props.chainData}
                            />
                        </View>
                        <View style={{ height: hp(2) }}></View>
                    </View>
                </CustomModal>

                <Modal
                    onBackdropPress={() => {
                        this.setModalVisible(false);
                    }}
                    onBackButtonPress={() => {
                        this.setModalVisible(false);
                    }}
                    animationType="slide"
                    animationInTiming={500}
                    backdropOpacity={0.7}
                    onSwipeComplete={() => this.setState({ modalVisible: false })}
                    isVisible={this.state.modalVisible}
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
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ height: hp(4) }} />

                                <H3 fontSize={scale.w(2.0)}>{this.state.title}</H3>
                                <View style={{ height: hp(4) }} />
                                {this.state.description && (
                                    <H4 fontSize={scale.w(1.2)}>{this.state.description}</H4>
                                )}

                                {this.state.description && <View style={{ height: hp(4) }} />}
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this._addTotalService(this.state.item);
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
                                        fontSize: scale.w(1.4),
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
                <CustomModal
                    ref={this._modalNoteServiceRequestItem}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDown"
                >
                    <NoteServiceRequestItem
                        value={this.state.selectedItem.note}
                        onChangeText={this._onChangeText}
                        showModal={this._handleModalNoteServiceRequestItem(null, true)}
                        title={`${this.state.selectedItem.name} Note`}
                        color={color}
                        chainData={this.props.chainData}
                    />
                </CustomModal>
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
                        onPrimaryClick={() => this._handleRequestItems()}
                        onCardSave={(val) => {
                            this.setState({
                                saveCard: val,
                            });
                        }}
                        cardSave={this.state.saveCard}
                        selectedLanguage={this.props.selectedLanguage}
                        chainData={this.props.chainData}
                    />
                </CustomModal>

                <CustomModal
                    style={{ margin: -1 }}
                    ref={this._modalPaymentSuccessfullModal}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDown"
                >
                    <ProcessComplete
                        backgroundColor={this.props.icon.concierge_color}
                        onBackClick={() => console.log("don't go back")}
                        processImage={require('../../images/paymentPageImg.png')}
                        processTitle={this.props.selectedLanguage.request_successfull}
                        processDescription={
                            this.props.selectedLanguage.you_have_requested_successfully_for_Items
                        }
                        btnText={this.props.selectedLanguage.go_to_home}
                        loading={this.state.loading}
                        onButtonPress={this.GoHomeClick}
                        chainData={this.props.chainData}
                    />
                </CustomModal>

                <CustomModal ref={this._modalDatePicker} animationIn="fadeInUp" animationOut="fadeOutDown">
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
                <CustomModal ref={this._modalTimePicker} animationIn="fadeInUp" animationOut="fadeOutDown">
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
                    Image={this.state.Image_URL}
                    onBackArrow={() => this.setState({ ZoomImageModal: false })}
                />
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

export default RequestItems;
