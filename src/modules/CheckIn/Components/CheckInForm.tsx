import React, { createRef } from 'react';
import {
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    FlatList,
    Alert,
    Keyboard,
    StyleSheet,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Platform,
    Linking,
    TouchableHighlight,
    PermissionsAndroid,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import colors from '../../../constants/colors';
import IonIcon from 'react-native-vector-icons/Entypo';

import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP,
    heightPercentageToDP,
} from '../../../utils/dimensions';
import { ButtonPrimary, ButtonSecondary } from '../../_global/Button';
import MenuButton from '../../_global/MenuButton';
import FieldForm from './FieldForm';
import ImagePicker, { ImagePickerOptions, ImagePickerResponse } from 'react-native-image-picker';
import { Text, View as ViewAnimatable } from 'react-native-animatable';
import { CardIOModule } from 'react-native-awesome-card-io';
import { H2, H3, H4 } from '../../_global/Text';
import { Separator } from '../../_global/Container';
import { format } from 'date-fns';
import { TDisplay } from '../CheckIn';
import { ICheckInFormReduxProps } from './CheckInForm.Container';
import { repeat } from '../../../utils/formating';
import { IPhoto } from '../../../types/action.account';
import { Navigation } from 'react-native-navigation';
// import uuid from 'uuid/dist/v4';
import CustomModal from '../../_global/CustomModal';
import ModalDatePicker from './ModalDatePicker';
import FieldFormWithMask from './FieldFormWithMask';
import { debounce, isEqual, padStart, stubString } from 'lodash';
import Carousel from 'react-native-snap-carousel';
import base from '../../../utils/baseStyles';
import ModalSelectPhoto from './ModalSelectPhoto';
import ModalMessageScanCC from './ModalMessageScanCC';
import DropDownPicker from 'react-native-dropdown-picker';
import { languages } from '../../_global/languages';
import SignatureCapture from 'react-native-signature-capture';
import Modal from 'react-native-modal';
import ViewShot from 'react-native-view-shot';
// import { Icon } from 'react-native-vector-icons/Icon';
import SwitchToggle from 'react-native-switch-toggle';
import Icons from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Cardscan from 'react-native-cardscan';
import { TextInputMask, TextMaskMethods } from 'react-native-masked-text';
import Navbar from '../../_global/Navbar';
import DIcon from 'react-native-vector-icons/MaterialIcons';
import Slider from 'react-native-slider';
import CheckBox from '@react-native-community/checkbox';
import ProcessComplete from '../../_global/processComplete';
import { createChannel, toast } from '../../../utils/handleLogic';
import DropShadow from 'react-native-drop-shadow';
import Calendar from '../../../images/calendar.svg';
import UnChecked_Box from '../../../images/UnChecked_Box.svg';
import Checked_Box from '../../../images/Checked_Box.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { findIndex, find } from 'lodash';
import { additionalservices } from '../../../utils/navigationControl';

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
    title: 'Select Passport Photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    cameraType: 'front',
    allowsEditing: false,
    maxHeight: 800,
    maxWidth: 600,
    quality: 0.6,
    mediaType: 'photo',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose from Library',
};

interface ICheckInFormProps extends ICheckInFormReduxProps {
    componentId: string;
    handleChangeDisplay: (display: TDisplay) => void;
}

interface ISelectedItems {
    qty: string;
    id: Number;
    name: string;
}

interface ICheckInFormState {
    items: ISelectedItems[];
    isArrivalDate: boolean;
    indexOfPassportToBeAdded: number | null;
    loading: boolean;
    listNumberGuest: number[];
    numberGuest: number;
    listavatar: IPhoto[];
    arrivalDate: string;
    departureDate: string;
    tempDate: Date;
    selectArrivalDate: boolean;
    cardNumber: string;
    cardName: string;
    cardExpiryDate: string;
    cardAddress: string;
    phoneNumber: string;
    reference: any;
    room_Number: string | number;
    country: string;
    note_request: string;
    signature_photo: Object;
    modalVisible: boolean;
    terms_and_condition: boolean;
    extra_bed_request: boolean;
    terms_and_condition_modal: boolean;
    email: string;
    password: string;
    confirmPassword?: string;
    user_id: number;
    cardNumberTemp: string;
    expiryDateTemp: string;
    cardholderNameTemp: string;
    cvv: number;
    cvvTemp: number;
    cardAddressTemp: string;
    newScreen: boolean;
    sliderValue: any;
    temprature: number;
    dropDownValue: string | number;
    dropDownOpened: boolean;
    languageDropDownOpened: boolean;
    price: number;
    AdditionalServicesList: any;
    bedLabel: any;
    additional_services: any;
    signatureCaptured: boolean;
    checkBoxState: boolean;
    find: boolean;
    finBookingLoader: boolean;
    bookingFound: boolean;
    bookingFindMessage: any;
    numberOfPeople: any;
    noOfReferences: any;
    selectedReference: any;
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

interface ICard {
    cardNumber: string;
    cardType: string;
    cardholderName: null | string;
    cvv: string;
    expiryMonth: number;
    expiryYear: number;
    postalCode: null | string;
    redactedCardNumber: string;
}

// var sign = createRef();
// var viewRef = createRef();

class CheckInForm extends React.Component<ICheckInFormProps, ICheckInFormState> {
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalImagePicker = React.createRef<CustomModal>();
    private _modalMessageScanCC = React.createRef<CustomModal>();
    private sign = React.createRef();
    private viewRef = React.createRef();
    private _modalManualData = React.createRef<CustomModal>();
    private _modalConfirm = React.createRef<CustomModal>();
    private _modalBookingNotAvailable = React.createRef<CustomModal>();
    private _additionalService = React.createRef<CustomModal>();

    constructor(props: ICheckInFormProps) {
        super(props);
        this.state = {
            items: props.profile.additional_services,
            bedLabel: '',
            sliderValue: 0.5,
            newScreen: true,
            indexOfPassportToBeAdded: null,
            isArrivalDate: false,
            loading: false,
            listNumberGuest: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            checkBoxState: this.props.isCheckedIn,
            numberGuest: props.profile.passport_photos.length,
            listavatar: props.profile.passport_photos,
            arrivalDate: props.isCheckedIn == false ? '' : props.profile.arrival_date,
            departureDate: props.isCheckedIn == false ? '' : props.profile.departure_date,
            tempDate: new Date(),
            selectArrivalDate: false,
            cardNumber: props.profile.card_number,
            cardName: props.profile.cardholder_name,
            cardExpiryDate: props.profile.card_expiry_date,
            cardAddress: props.profile.card_address,
            phoneNumber: props.profile.phone_number,
            reference: props.isCheckedIn ? props.hotel.profile.reference : '',
            // additional_service_id : props.profile.
            room_Number: props.profile.room_number,
            country: props.selectedLanguage.lang,

            note_request:
                props.hotel.profile.note_request !== 'null' && props.hotel.profile.note_request
                    ? props.hotel.profile.note_request
                    : '',
            signature_photo:
                props.hotel.profile?.signature_photo && props.hotel.profile.status !== 'checked_out'
                    ? props.hotel.profile?.signature_photo
                    : '',

            modalVisible: false,
            terms_and_condition: props.hotel.profile?.terms_and_conditions
                ? props.hotel.profile?.terms_and_conditions
                : true,
            extra_bed_request: false,
            terms_and_condition_modal: false,
            email: props.profile.email,
            password: props.profile.password,
            user_id: props.profile.user_id,
            cardNumberTemp: '4242 4242 4242 4242',
            cardholderNameTemp: 'Anas Khan',
            expiryDateTemp: '12/22',
            cvv: 0,
            cvvTemp: 123,
            cardAddressTemp: 'address',
            temprature: props.hotel.profile?.room_temperature ? props.hotel.profile?.room_temperature : 18,
            dropDownValue: '',
            dropDownOpened: false,
            languageDropDownOpened: false,
            price: 0,
            // AdditionalServicesList: [
            //     { label: '1 - Bed', value: 1 },
            //     { label: '2 - Bed', value: 2 },
            //     { label: '3 - Bed', value: 3 },
            // ],
            AdditionalServicesList: this.props.AdditionalServices,
            signatureCaptured: false,
            find: true,
            finBookingLoader: false,
            bookingFound: false,
            bookingFindMessage: 'Booking Not Available',
            numberOfPeople: 1,
            noOfReferences: [],
            selectedReference: '',
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
        console.log('in checkin constructorrrr');
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleSelectNumberOfGuest = this._handleSelectNumberOfGuest.bind(this);
        this._handleProcessImage = this._handleProcessImage.bind(this);
        this._showModalImagePicker = this._showModalImagePicker.bind(this);
        this._openCamera = this._openCamera.bind(this);
        this._openLibrary = this._openLibrary.bind(this);
        this._handleMessageScanCC = this._handleMessageScanCC.bind(this);
        this._handleScanCC = this._handleScanCC.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._handleModalDatePicker = this._handleModalDatePicker.bind(this);
        this._renderPhotoPicker = this._renderPhotoPicker.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._renderScrollNumber = this._renderScrollNumber.bind(this);
        this._onDragEvent = this._onDragEvent.bind(this);
        this.resetSign = this.resetSign.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.toggleTerms = this.toggleTerms.bind(this);
        this.onCapture = this.onCapture.bind(this);
        this._handleProcced = this._handleProcced.bind(this);
        this._findBooking = this._findBooking.bind(this);
        this._addTotalService = this._addTotalService.bind(this);
        this._substractTotalService = this._substractTotalService.bind(this);
        this.onAdditionalServiceBack = this.onAdditionalServiceBack.bind(this);
    }

    async componentDidMount() {
        console.log('propssssssss   ', this.props);
        this.props.getAddionalServices(
            this.props.token,
            () => console.log('Success'),
            () => console.log('Failed'),
        );

        this.setState({
            chainData: this.props.chainData,
        });

        // console.log('in checkin did mount',this.props.token + "            \n\n\n\n\ " , this.props.hotel.userData.hotel_booking.auth_token  );
        if (this.props.isCheckedIn) {
            console.log(this.props.token);
            this.props.getProfile(
                this.props.token,
                this.props.hotelCode,
                () => {
                    console.log('Succes profile data');
                },
                () => {
                    console.log('Error profile data');
                },
            );
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: ICheckInFormProps) {
        if (!isEqual(this.props.profile, nextProps.profile)) {
            this.setState({
                numberGuest: nextProps.profile.passport_photos.length,
                listavatar: nextProps.profile.passport_photos,
                arrivalDate: nextProps.profile.arrival_date,
                departureDate: nextProps.profile.departure_date,
                cardName: nextProps.profile.cardholder_name,
                cardExpiryDate: nextProps.profile.card_expiry_date,
                cardAddress: nextProps.profile.card_address,
                phoneNumber: nextProps.profile.phone_number,
                cardNumber: nextProps.profile.card_number,
                reference: nextProps.profile.reference,
                numberOfPeople: nextProps.profile.passport_photos?.length,
                item: nextProps.profile.additional_services,
                // signature_photo: nextProps.profile.signature_photo
            });
        }
    }

    _handleSubmit() {
        Keyboard.dismiss();

        const {
            arrivalDate,
            departureDate,
            reference,
            note_request,
            terms_and_condition,
            user_id,
            temprature,
            signature_photo,
            dropDownValue,
            checkBoxState,
            listavatar,
            items,
        } = this.state;
        if (reference == '' || reference == null) {
            toast(this.props.selectedLanguage.please_enter_reference_number);
            return 0;
        }
        if (note_request && note_request != '' && note_request.length > 499) {
            toast(this.props.selectedLanguage.note_should_not_be_greater_then_500_char);
            return 0;
        }
        if (!checkBoxState) {
            toast(this.props.selectedLanguage.please_accept_terms_and_conditions);
            return 0;
        }
        var checkUri: boolean = false;
        this.state.listavatar.forEach(async (data) => {
            if (data.uri === '' || data.uri.length == 0 || data.uri === undefined || data.uri === null) {
                checkUri = true;
            }
        });
        if (checkUri) {
            toast('One of the passport photo is empty');
            return 0;
        }
        this.setState({
            loading: true,
        });

        this.props.checkIn(
            {
                room_temperature: temprature,
                hotel_id: this.props.idHotel,
                arrival_date: arrivalDate,
                departure_date: departureDate,
                reference,
                note_request,
                terms_and_condition,
                user_id,
                signature_photo,
                additional_services: items,
                passport_photos: listavatar,
            },
            () => {
                createChannel(reference);
                if (Platform.OS == 'android') {
                    this.props.getCardDetails();
                }
                this.props.getProfile(
                    this.props.token,
                    this.props.hotelCode,
                    async () => {
                        await this.props.disconnectSendBird(
                            () => {},
                            () => {},
                        );
                        if (this.props.status === 'pending') this.props.connectSendBird();
                        this.setState({ loading: false });
                        this._modalConfirm.current?.show();
                    },
                    () => {
                        console.log('hello in failed');
                    },
                );
            },
            () => {
                this.setState({ loading: false });
            },
        );
    }

    _handleSelectNumberOfGuest(num: number) {
        this.setState((prevState) => ({
            ...prevState,
            listavatar:
                num > prevState.listavatar.length - 1
                    ? [
                          ...prevState.listavatar,
                          ...repeat<IPhoto>(num - prevState.listavatar.length, {
                              uri: '',
                              name: '',
                              type: 'image/jpeg',
                          }),
                      ]
                    : prevState.listavatar.slice(0, num),
        }));
    }

    _handleProcessImage(response: ImagePickerResponse) {
        console.log('image data', response);
        this.setState((prevState) => ({
            ...prevState,
            listavatar: prevState.listavatar.map((avatar, idx) => {
                if (this.state.indexOfPassportToBeAdded === idx) {
                    return {
                        uri: response.uri,
                        name: response.fileName ? response.fileName : `No_Name_${response.uri}`,
                        type: 'image/jpeg',
                    };
                }
                return avatar;
            }),
        }));
        console.log(this.state.listavatar);

        if (this._modalImagePicker.current) {
            this._modalImagePicker.current.hide();
        }
    }

    _showModalImagePicker(index: any, isShow?: boolean) {
        return () => {
            this.setState({ indexOfPassportToBeAdded: index });
            if (isShow) {
                this._modalImagePicker.current!.show();
            } else {
                this._modalImagePicker.current!.hide();
            }
        };
    }

    _openCamera() {
        ImagePicker.launchCamera(IMAGE_PICKER_OPTIONS, this._handleProcessImage);
    }

    _openLibrary() {
        // Open Image Library:
        ImagePicker.launchImageLibrary(IMAGE_PICKER_OPTIONS, this._handleProcessImage);
    }

    _handleMessageScanCC(isShow?: boolean) {
        if (this._modalMessageScanCC.current) {
            // open modal
            if (isShow) {
                console.log('==============', isShow);
                return this._modalMessageScanCC.current.show();
            }

            // close modal and open scan cc
            this._modalMessageScanCC.current.hide();

            return setTimeout(this._handleScanCC, 800);
        }

        // open scan cc, in case modal is not rendered
        return this._handleScanCC();
    }

    async _handleScanCC() {
        console.log('herer in card scannerrrrrr');
        try {
            Keyboard.dismiss();
            const { cardholderName, cardNumber, expiryMonth, expiryYear }: ICard =
                await CardIOModule.scanCard({
                    hideCardIOLogo: true,
                    requireCVV: false,
                    requireCardholderName: true,
                });

            this.setState({
                cardName: cardholderName ? cardholderName : this.state.cardName,
                cardNumber: cardNumber ? cardNumber : '',
                cardExpiryDate: `${padStart(expiryMonth.toString(), 2, '0')}/${expiryYear
                    .toString()
                    .substr(2)}`,
            });
            // Keyboard.dismiss();
            // Cardscan.isSupportedAsync()
            //     .then(supported => {
            //         console.log(supported)
            //         if (supported) {
            //             Cardscan.scan()
            //                 .then(({ action, payload, canceled_reason }) => {
            //                     console.log("fffffffffffffffffff vvvvvvvvvvvvvvvvvvvv",Cardscan)
            //                     if (action === 'scanned') {
            //                         console.log(payload)
            //                         const { number, expiryMonth, expiryYear, issuer, cardholderName } = payload;
            //                         console.log(number, cardholderName, issuer, expiryYear)
            //                         if (number && expiryYear && expiryMonth) {
            //                         this.setState({
            //                             cardName: cardholderName ? cardholderName : this.state.cardName,
            //                             cardNumber: number ? number : '',
            //                             cardExpiryDate: `${padStart(expiryMonth.toString(), 2, '0')}/${expiryYear
            //                                 .toString()
            //                                 .substr(2)}`
            //                         });
            //                     }
            //                     else {
            //                         this._modalManualData.current?.show()
            //                     }
            //                         // Display information
            //                     } else if (action === 'canceled') {
            //                         // console.log(Cardscan.getConstants())
            //                         if (canceled_reason === 'enter_card_manually') {
            //                             console.log(canceled_reason)
            //                             // the user elected to enter a card manually
            //                         } else if (canceled_reason === 'camera_error') {
            //                             console.log(canceled_reason)
            //                             // there was an error with the camera
            //                         } else if (canceled_reason === 'fatal_error') {
            //                             console.log(canceled_reason)
            //                             // there was an error during the scan
            //                         } else if (canceled_reason === 'user_canceled') {
            //                             console.log(canceled_reason)
            //                             // the user canceled the scan
            //                         } else {
            //                             console.log(action)
            //                             this._modalManualData.current?.show()
            //                         }
            //                     } else if (action === 'skipped') {
            //                         console.log(canceled_reason)
            //                         // User skipped
            //                     } else if (action === 'unknown') {
            //                         console.log(canceled_reason)
            //                         // Unknown reason for scan canceled
            //                     }
            //                 })
            //         } else {
            //             console.log("nottttttttt supporteddddddddddddddddd", supported)
            //         }
            //     })
            // const {
            //     cardholderName,
            //     cardNumber,
            //     expiryMonth,
            //     expiryYear,
            // }: ICard = await CardIOModule.scanCard({
            //     hideCardIOLogo: true,
            //     requireCVV: false,
            //     requireCardholderName: true,
            // });
        } catch (error) {
            // if (__DEV__) {
            console.log('SCAN_CC: ', { error });
            // }
        }
    }

    async _onChangeDate(date: Date) {
        await this.setState({
            tempDate: date,
        });
    }

    _handleShowModal(isArrivalDate: boolean, closeModal?: boolean) {
        return () => {
            // if (this.state.selectArrivalDate) {
            //     this.setState({
            //         arrivalDate: this.state.tempDate.toString(),
            //     });
            // } else {
            //     if (
            //         moment(this.state.tempDate).format('DD/MM/YYYY') >
            //         moment(this.state.arrivalDate).format('DD/MM/YYYY')
            //     ) {
            //         this.setState({
            //             departureDate: this.state.tempDate.toString(),
            //         });
            //     } else {
            //         this.setState({
            //             departureDate: this.state.isArrivalDate.toString(),
            //         });
            //         Alert.alert('Warning', 'Departure date must be greater than or equal to arrival date');
            //     }
            // }
            // if (this._modalDatePicker.current) {
            //     if (closeModal) {
            //         this._modalDatePicker.current.hide();
            //     } else {
            //         this._modalDatePicker.current.show();
            //     }
            // }

            const tempFormat = moment(format(this.state.tempDate, 'MM/DD/YYYY'), 'MM/DD/YYYY');
            const arrivalDate =
                this.state.arrivalDate != ''
                    ? moment(format(this.state.arrivalDate, 'MM/DD/YYYY'), 'MM/DD/YYYY')
                    : moment(format(new Date(), 'MM/DD/YYYY'), 'MM/DD/YYYY');
            const currentDateFormat = moment(format(new Date(), 'MM/DD/YYYY'), 'MM/DD/YYYY');
            var d = tempFormat.diff(currentDateFormat, 'days'); // =1
            var arrAndDepartureDiff = 0;
            // console.log(tempFormat, d, currentDateFormat);

            if (!this.state.selectArrivalDate) {
                arrAndDepartureDiff = tempFormat.diff(arrivalDate, 'days');
                if (Object.is(NaN, arrAndDepartureDiff)) {
                    arrAndDepartureDiff = 1;
                }
                if (tempFormat.isSame(arrivalDate)) {
                    arrAndDepartureDiff = arrAndDepartureDiff + 1;
                }
            }

            if (this.state.selectArrivalDate && Object.is(NaN, d)) {
                d = 1;
            }

            if (this.state.selectArrivalDate && tempFormat.isSame(currentDateFormat)) {
                d = d + 1;
            }
            if (this.state.selectArrivalDate && d <= 0) {
                toast(this.props.selectedLanguage.arrival_date_cannot_be_smaller_then_current_time);
                return;
            }

            if (!this.state.selectArrivalDate && arrAndDepartureDiff <= 0) {
                toast(
                    this.props.selectedLanguage
                        .departure_date_cannot_be_smaller_then_arrival_date_or_departure_date,
                );
                return;
            }

            if (d > 0 || arrAndDepartureDiff > 0) {
                if (this.state.selectArrivalDate) {
                    this.setState({
                        arrivalDate: this.state.tempDate.toString(),
                        departureDate: '',
                    });
                } else {
                    this.setState({
                        departureDate: this.state.tempDate.toString(),
                    });
                }

                if (this._modalDatePicker.current) {
                    if (closeModal) {
                        this._modalDatePicker.current.hide();
                    } else {
                        this._modalDatePicker.current.show();
                    }
                }
            }
        };
    }

    _handleModalDatePicker(closeModal?: boolean, selectArrivalDateP?: boolean) {
        return async () => {
            Keyboard.dismiss();
            // if (!closeModal) {
            //     console.log("isArrivable")
            //     this.setState({isArrivalDate})
            // }
            await this.setState({
                selectArrivalDate: selectArrivalDateP ? selectArrivalDateP : false,
            });

            if (this._modalDatePicker.current) {
                if (closeModal) {
                    this._modalDatePicker.current.hide();
                } else {
                    this._modalDatePicker.current.show();
                }
            }
        };
    }

    _renderPhotoPicker({ item, index }) {
        if (
            this.state.listavatar[index] &&
            this.state.listavatar[index]?.uri !== '' &&
            this.state.listavatar[index].uri != undefined &&
            this.state.listavatar[index].uri != null
        ) {
            return (
                <DropShadow
                    style={{
                        height: heightPercentageToDP(14),
                        shadowOffset: {
                            width: 20,
                            height: 19,
                        },
                        shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                        shadowOpacity: 0.09,
                        shadowRadius: 30,
                        marginBottom: hp(2),
                        width:
                            Array.from(Array(this.state.numberOfPeople).keys()).length % 2 !== 0 &&
                            Array.from(Array(this.state.numberOfPeople).keys()).length - 1 == index
                                ? '100%'
                                : '50%',
                    }}
                >
                    <TouchableOpacity
                        onPress={debounce(this._showModalImagePicker(index, true), 1000, {
                            leading: true,
                            trailing: false,
                        })}
                        activeOpacity={0.6}
                        disabled={this.props.isCheckedIn}
                        style={{
                            backgroundColor: colors.WHITE,
                            borderRadius: scale.w(2.5),
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            width: widthPercentageToDP(30),
                            height: heightPercentageToDP(14),
                            borderColor: colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR,
                        }}
                    >
                        <Image
                            source={{ uri: this.state.listavatar[index]?.uri }}
                            style={styles.passport_photo}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </DropShadow>
            );
        }

        return (
            <View
                style={{
                    alignItems: 'center',
                    marginBottom: heightPercentageToDP(2),
                    width:
                        Array.from(Array(this.state.numberOfPeople).keys()).length % 2 !== 0 &&
                        Array.from(Array(this.state.numberOfPeople).keys()).length - 1 == index
                            ? '100%'
                            : '50%',
                }}
            >
                <MenuButton
                    source={require('../../../images/icon_passport_photo.png')}
                    onPress={debounce(this._showModalImagePicker(index, true), 1000, {
                        leading: true,
                        trailing: false,
                    })}
                    text={`${this.props.selectedLanguage.passport_photo}`}
                    width={widthPercentageToDP(30)}
                    height={heightPercentageToDP(14)}
                    iconSize={scale.w(4)}
                    fontSize={scale.w(1.4)}
                    disabled={this.props.isCheckedIn}
                    styleImage={{ tintColor: this.props.color !== '' ? this.props.color : colors.BLUE }}
                />
            </View>
        );
    }

    _onScroll(offsetX: number) {
        const rawIndex = offsetX / scale.w(70);

        const index = Math.round(rawIndex);
        const currNumOfGuest = this.state.numberGuest - 1;
        if (currNumOfGuest !== index) {
            this._handleSelectNumberOfGuest(index + 1);
        }
    }

    onAdditionalServiceBack(additionalItems: any) {
        this.setState({
            items: additionalItems,
        });
        let totalPrice = 0;
        for (let i = 0; i < additionalItems.length; i++) {
            totalPrice = totalPrice + additionalItems[i].price * additionalItems[i].qty;
        }
        this.setState({
            price: totalPrice,
        });
        // Alert.alert(date.toString())
    }

    resetSign() {
        this.sign.current.resetImage();
    }

    _renderScrollNumber({ item }: { item: number }) {
        return (
            <View style={styles.scroll_number_item}>
                <H2>{item}</H2>
            </View>
        );
    }

    _onDragEvent() {
        this.setState({
            signatureCaptured: true,
        });
        console.log('dragged');
    }

    setModalVisible(params: boolean) {
        this.setState({
            modalVisible: params,
        });
    }

    toggleTerms() {
        this.setState({
            terms_and_condition: !this.state.terms_and_condition,
        });
    }

    onCapture() {
        if (this.state.signatureCaptured) {
            this.viewRef.capture().then((uri) => {
                this.setState({
                    signature_photo: {
                        name: uri.split('/')[uri.split('/').length - 1],
                        type: 'image/png',
                        uri: uri,
                    },
                });
                this.setState({
                    signatureCaptured: false,
                });
                this.setModalVisible(false);
            });
        } else {
            toast(this.props.selectedLanguage.please_put_your_signature_to_proceed);
        }
    }

    _handleProcced() {
        this.setState({
            cardName: this.state.cardholderNameTemp,
            cardNumber: this.state.cardNumberTemp,
            cardExpiryDate: this.state.expiryDateTemp,
            cvv: this.state.cvvTemp,
            cardAddress: this.state.cardAddressTemp,
        });
        this._modalManualData.current?.hide();
    }

    _addTotalService(item: ISelectedItems) {
        const index = findIndex(this.state.items, { id: item.id });

        if (index < 0) {
            this.setState((prevState) => ({
                items: [
                    ...prevState.items,
                    {
                        id: item.id,
                        qty: 1,
                        name: item.name,
                        price: item.price,
                    },
                ],
                price: prevState.price + item.price,
            }));
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((service) => {
                    if (service.id === item.id) {
                        return {
                            ...service,
                            qty: service.qty + 1,
                        };
                    }

                    return service;
                }),
                price: prevState.price + item.price,
            }));
        }
    }

    _substractTotalService(item: ISelectedItems) {
        const selected = find(this.state.items, { id: item.id });

        if (selected && selected.qty <= 1) {
            this.setState((prevState) => ({
                items: prevState.items.filter(({ id }) => id !== item.id),
                price: prevState.price - item.price,
            }));
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((service) => {
                    if (service.id === item.id) {
                        return {
                            ...service,
                            qty: service.qty - 1,
                        };
                    }

                    return service;
                }),
                price: prevState.price - item.price,
            }));
        }
    }

    _findBooking() {
        this.props.findBooking(
            {
                hotel_id: this.props.idHotel,
                reference: this.state.reference,
            },
            (res) => {
                console.log('here is the cuccess', res);
                toast(res.data.message);
                if (res?.data?.booking?.length > 1) {
                    this.setState({
                        noOfReferences: res?.data?.booking,
                        selectedReference: res.data.booking[0]?.reference,
                        bookingFound: true,
                        finBookingLoader: false,
                        arrivalDate: res.data.booking[0]?.arrival_date,
                        departureDate: res.data.booking[0]?.departure_date,
                        note_request: res.data.booking[0]?.note_request,
                        reference: res.data.booking[0]?.reference,
                    });
                } else {
                    this.setState({
                        arrivalDate: res.data.booking[0]?.arrival_date,
                        departureDate: res.data.booking[0]?.departure_date,
                        bookingFound: true,
                        finBookingLoader: false,
                        note_request: res.data.booking[0]?.note_request,
                        reference: res.data.booking[0]?.reference,
                    });
                }
            },
            (error) => {
                this._modalBookingNotAvailable.current?.show();
                this.setState({
                    bookingFindMessage: error?.data?.message?.faultstring
                        ? error?.data?.message?.faultstring
                        : error?.data?.message,
                    bookingFound: false,
                    reference: '',
                    finBookingLoader: false,
                });
            },
        );
    }

    render() {
        const {
            isArrivalDate,
            loading,
            listNumberGuest,
            listavatar,
            arrivalDate,
            departureDate,
            tempDate,
            cardName,
            cardExpiryDate,
            cardAddress,
            phoneNumber,
            reference,
            room_Number,
            note_request,
            signature_photo,
            extra_bed_request,
            email,
            password,
            confirmPassword,
        } = this.state;
        const {
            check_in,
            guest_checking_in,
            arrival_date,
            departured_date,
            scan_credit_card,
            cardholder_name,
            card_expiry_date,
            card_address,
            booking_referance,
            phone_number,
            confirm_check_in,
            room_number,
            okay,
            scan_credit_card_or_input_manually_in_the_bottom_right_corner,
            note,
            signature,
            tab_to_add_signature,
            clear,
            i_agree_with_all,
            terms_and_condition,
            clear_signature,
            save_signature,
            check_in_comments,
            extra_bed,
            pick_your,
            date,
            month,
            year,
            ok,
            confirm_password,
            enter_your_email,
            choose_a_password,
        } = this.props.selectedLanguage;
        console.log('propss in form checkin', this.props);
        if (this.state.newScreen) {
            return (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
                    <CustomModal
                        ref={this._modalConfirm}
                        style={{
                            height: hp(100),
                            width: wp(100),
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: -1,
                        }}
                    >
                        <ProcessComplete
                            backgroundColor={this.props.PrimaryColor}
                            processImage={require('../../../images/paymentPageImg.png')}
                            processTitle={this.props.selectedLanguage.checked_in_successful}
                            processDescription={this.props.selectedLanguage.you_have_checked_in}
                            onButtonPress={() => {
                                this._modalConfirm.current?.hide();
                                Navigation.pop(this.props.componentId);
                            }}
                            btnText={this.props.selectedLanguage.go_to_home}
                            chainData={this.props.chainData}
                        />
                    </CustomModal>
                    <CustomModal
                        ref={this._modalBookingNotAvailable}
                        style={{
                            height: hp(100),
                            width: wp(100),
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: -1,
                        }}
                    >
                        <View
                            style={{
                                width: widthPercentageToDP(80),
                                backgroundColor: '#fff',
                                alignSelf: 'center',
                                borderRadius: scale.w(3.0),
                                paddingHorizontal: widthPercentageToDP(7),
                                paddingVertical: heightPercentageToDP(3),
                            }}
                        >
                            <View style={{}}>
                                <Text
                                    style={{
                                        fontFamily: Platform.select({
                                            android: 'Roboto-Bold',
                                            ios: 'Roboto-Bold',
                                        }),
                                        textAlign: 'center',
                                    }}
                                >
                                    {this.state.bookingFindMessage}
                                </Text>
                                <View style={{ height: heightPercentageToDP(5) }} />
                                <View style={{ width: widthPercentageToDP(30), alignSelf: 'center' }}>
                                    <ButtonPrimary
                                        backgroundColor={
                                            this.props.PrimaryColor == ''
                                                ? colors.BLUE
                                                : this.props.PrimaryColor
                                        }
                                        onPress={() => {
                                            this.setState({
                                                find: true,
                                                finBookingLoader: false,
                                            });
                                            this._modalBookingNotAvailable.current?.hide();
                                        }}
                                        loading={false}
                                        fontSize={scale.w(1.6)}
                                        text={okay}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                            </View>
                        </View>
                    </CustomModal>
                    <CustomModal
                        ref={this._additionalService}
                        style={{
                            height: hp(100),
                            width: wp(100),
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: -1,
                        }}
                    >
                        <View
                            style={{
                                width: widthPercentageToDP(80),
                                backgroundColor: '#fff',
                                alignSelf: 'center',
                                borderRadius: scale.w(1.5),
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: this.props.color,
                                    width: '100%',
                                    flexDirection: 'row',
                                    paddingHorizontal: widthPercentageToDP(7),
                                    paddingVertical: heightPercentageToDP(2.4),
                                    borderTopLeftRadius: scale.w(1.5),
                                    borderTopRightRadius: scale.w(1.5),
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Roboto-Bold',
                                        fontSize: scale.w(2.1),
                                        color: colors.WHITE,
                                    }}
                                >
                                    {this.props.selectedLanguage.additional_services}
                                </Text>
                                <View style={{ flex: 1 }} />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            item: this.props.profile.additional_services,
                                        });
                                        this._additionalService.current?.hide();
                                    }}
                                    style={{
                                        padding: widthPercentageToDP(0.5),
                                        borderRadius: widthPercentageToDP(3),
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <IonIcon
                                        name="cross"
                                        style={{ alignSelf: 'center' }}
                                        size={scale.w(1.5)}
                                        color={this.props.color}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    height: heightPercentageToDP(50),
                                }}
                            >
                                <ScrollView>
                                    {this.state.AdditionalServicesList.map((i) => {
                                        const selected = find(this.state.items, { id: i.id });
                                        return (
                                            <View
                                                style={{
                                                    marginVertical: heightPercentageToDP(1.5),
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                    marginHorizontal: widthPercentageToDP(3),
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (selected) {
                                                            this.setState((prevState) => ({
                                                                price:
                                                                    prevState.price -
                                                                    selected.price * selected.qty,
                                                                items: prevState.items.filter(
                                                                    ({ id }) => id !== i.id,
                                                                ),
                                                            }));
                                                        } else this._addTotalService(i);
                                                    }}
                                                    style={{
                                                        width: '36%',
                                                        justifyContent: 'flex-start',
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{ justifyContent: 'center' }}>
                                                        {selected ? (
                                                            <Checked_Box
                                                                fill={
                                                                    this.props.PrimaryColor == ''
                                                                        ? colors.BLUE
                                                                        : this.props.PrimaryColor
                                                                }
                                                                style={{ alignSelf: 'flex-start' }}
                                                            />
                                                        ) : (
                                                            <UnChecked_Box
                                                                style={{ alignSelf: 'flex-start' }}
                                                            />
                                                        )}
                                                    </View>
                                                    <View style={{ marginLeft: widthPercentageToDP(2) }} />
                                                    <View style={{ width: '70%' }}>
                                                        <Text
                                                            style={{
                                                                fontFamily: Platform.select({
                                                                    android: 'Roboto-Bold',
                                                                    ios: 'Roboto-Bold',
                                                                }),
                                                                flexShrink: 1,
                                                            }}
                                                        >
                                                            {i.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <Image
                                                    style={{
                                                        height: '20%',
                                                        width: '15%',
                                                        alignSelf: 'center',
                                                        paddingVertical: heightPercentageToDP(2.2),
                                                        backgroundColor: 'white',
                                                    }}
                                                    source={{ uri: i.image ? i.image : '' }}
                                                ></Image>
                                                <View style={{ paddingLeft: '2%' }} />
                                                <View
                                                    style={{
                                                        width: '20%',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontFamily: Platform.select({
                                                                android: 'Roboto-Bold',
                                                                ios: 'Roboto-Bold',
                                                            }),
                                                        }}
                                                    >
                                                        {parseInt(i.price).toFixed(1)} {this.props.currency}
                                                    </Text>
                                                </View>
                                                <View style={{ paddingLeft: '3%' }} />
                                                <View
                                                    style={{
                                                        alignItems: 'flex-end',
                                                        justifyContent: 'center',
                                                        width: '15%',
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            borderWidth: 2,
                                                            borderRadius: scale.w(1),
                                                            borderColor:
                                                                colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR,
                                                            //    paddingHorizontal: scale.w(0.1),
                                                            justifyContent: 'space-between',
                                                            //    backgroundColor: colors.BLACK,
                                                            width: wp(15),
                                                            alignItems: 'center',
                                                            alignSelf: 'flex-end',
                                                            height: heightPercentageToDP(2.8),
                                                            // alignItems: 'flex-end',
                                                            // flex: 1,
                                                            // backgroundColor: colors.RED,
                                                            // paddingVertical: hp(0.5),
                                                            // alignItems: 'center',
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            // disabled={selected && selected.qty == 0 ? true : false}
                                                            onPress={() => this._substractTotalService(i)}
                                                            activeOpacity={0.7}
                                                            style={{ paddingLeft: wp(1.5), color: '#707070' }}
                                                        >
                                                            <Ionicons
                                                                name="md-remove"
                                                                color={colors.REQUEST_ITEM_ICON_COLOR}
                                                                size={scale.w(1.8)}
                                                            />
                                                        </TouchableOpacity>
                                                        <View
                                                            style={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                marginHorizontal: 1,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontFamily: 'Roboto-Bold',
                                                                    fontSize: scale.w(1.3),
                                                                    color: '#42436A',
                                                                }}
                                                            >
                                                                {selected ? selected.qty : 0}
                                                            </Text>
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() => this._addTotalService(i)}
                                                            activeOpacity={0.7}
                                                            style={{
                                                                paddingRight: wp(1.5),
                                                                color: '#707070',
                                                            }}
                                                        >
                                                            <Ionicons
                                                                name="md-add"
                                                                color={colors.REQUEST_ITEM_ICON_COLOR}
                                                                size={scale.w(1.8)}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                                <View style={{ height: heightPercentageToDP(2) }} />
                                <View style={{ width: widthPercentageToDP(30), alignSelf: 'center' }}>
                                    <ButtonPrimary
                                        backgroundColor={
                                            this.props.PrimaryColor == ''
                                                ? colors.BLUE
                                                : this.props.PrimaryColor
                                        }
                                        onPress={() => {
                                            this._additionalService.current?.hide();
                                        }}
                                        loading={false}
                                        fontSize={scale.w(1.6)}
                                        text={'Save Changes'}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                                <View style={{ height: heightPercentageToDP(2) }} />
                            </View>
                        </View>
                    </CustomModal>
                    <CustomModal ref={this._modalImagePicker}>
                        <ModalSelectPhoto
                            openCamera={this._openCamera}
                            openLibrary={this._openLibrary}
                            selectedLanguage={this.props.selectedLanguage}
                        />
                    </CustomModal>
                    <View style={{ height: hp(3) }} />
                    <DropShadow
                        style={{
                            width: wp(100),
                            height: this.state.languageDropDownOpened ? hp(27) : hp(8),
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                            shadowOpacity: 0.25,
                            shadowRadius: 10,
                        }}
                    >
                        <View
                            style={{
                                height: this.state.languageDropDownOpened ? hp(15) : hp(8),
                            }}
                        >
                            <DropDownPicker
                                items={[
                                    { label: 'English', value: 'english' },
                                    { label: 'Spanish', value: 'spanish' },
                                    { label: 'French', value: 'french' },
                                    { label: 'Russian', value: 'russian' },
                                    { label: 'Portugese', value: 'portugese' },
                                    { label: 'Chinese', value: 'chinese' },
                                    { label: 'Italian', value: 'italian' },
                                    { label: 'Hebrew', value: 'hebrew' },
                                    { label: 'Arabic', value: 'arabic' },
                                    { label: 'Indonesian', value: 'indonesian' },
                                    { label: 'Dutch', value: 'dutch' },
                                    { label: 'German', value: 'german' },
                                    { label: 'Japanese', value: 'japanese' },
                                ]}
                                // containerStyle={{width: wp(150), height: hp(70)}}
                                // // dropDownStyle={{backgroundColor: '#fafafa', height: hp(30), width: wp(50)}}
                                defaultValue={this.state.country}
                                labelStyle={{ color: colors.DUMMY_COLOR }}
                                activeLabelStyle={{ color: colors.DUMMY_COLOR }}
                                containerStyle={{ height: hp(8), width: wp(100) }}
                                onOpen={() => {
                                    this.setState({
                                        languageDropDownOpened: !this.state.languageDropDownOpened,
                                    });
                                }}
                                onClose={() => {
                                    this.setState({
                                        languageDropDownOpened: !this.state.languageDropDownOpened,
                                    });
                                }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: wp(90),
                                    height: hp(60),
                                    backgroundColor: colors.WHITE,
                                    alignSelf: 'center',
                                    marginHorizontal: scale.w(10),
                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                }}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                    width: wp(90),
                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                }}
                                dropDownStyle={{
                                    backgroundColor: colors.WHITE,
                                    width: wp(90),
                                    alignSelf: 'center',
                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                }}
                                onChangeItem={async (item) => {
                                    await this.setState({
                                        country: item.value,
                                    });
                                    if (this.state.country == 'english') {
                                        await this.props.selectLanguage(languages.english);
                                    } else if (this.state.country == 'spanish') {
                                        await this.props.selectLanguage(languages.spanish);
                                    } else if (this.state.country == 'french') {
                                        await this.props.selectLanguage(languages.french);
                                    } else if (this.state.country == 'russian') {
                                        await this.props.selectLanguage(languages.russian);
                                    } else if (this.state.country == 'chinese') {
                                        await this.props.selectLanguage(languages.chinese);
                                    } else if (this.state.country == 'italian') {
                                        await this.props.selectLanguage(languages.italian);
                                    } else if (this.state.country == 'hebrew') {
                                        await this.props.selectLanguage(languages.hebrew);
                                    } else if (this.state.country == 'arabic') {
                                        await this.props.selectLanguage(languages.arabic);
                                    } else if (this.state.country == 'indonesian') {
                                        await this.props.selectLanguage(languages.indonesian);
                                    } else if (this.state.country == 'dutch') {
                                        await this.props.selectLanguage(languages.dutch);
                                    } else if (this.state.country == 'german') {
                                        await this.props.selectLanguage(languages.german);
                                    } else if (this.state.country == 'japanese') {
                                        await this.props.selectLanguage(languages.japanese);
                                    } else if (this.state.country == 'portugese') {
                                        await this.props.selectLanguage(languages.portugese);
                                    }

                                    this.props._languageChanges({
                                        lang: true,
                                    });
                                }}
                            />
                        </View>
                    </DropShadow>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ height: hp(2.5) }} />
                        {/* <Separator height={15} /> */}

                        {/* <View style={{ height: heightPercentageToDP(12) }}>
                            <Carousel
                                data={listNumberGuest}
                                renderItem={this._renderScrollNumber}
                                sliderWidth={widthPercentageToDP(100)}
                                itemWidth={widthPercentageToDP(100)}
                                onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                                    this._onScroll(e.nativeEvent.contentOffset.x);
                                }}
                            />
                        </View>

                        <Separator height={5} />

                        <FlatList
                            data={listavatar}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                            showsHorizontalScrollIndicator={false}
                            ListHeaderComponent={() => <View style={{ width: widthPercentageToDP(8) }} />}
                            ListFooterComponent={() => <View style={{ width: widthPercentageToDP(8) }} />}
                            renderItem={this._renderPhotoPicker}
                        /> */}

                        <DropShadow
                            style={{
                                width: wp(100),
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                shadowOpacity: 0.25,
                                shadowRadius: 10,
                            }}
                        >
                            <View
                                style={{
                                    paddingVertical: hp(3),
                                    paddingHorizontal: wp(4),
                                    width: wp(90),
                                    alignSelf: 'center',
                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    backgroundColor: colors.WHITE,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(1.6),
                                        fontFamily: 'Roboto-Medium',
                                        color: colors.DUMMY_COLOR,
                                    }}
                                >
                                    {' '}
                                    {this.props.selectedLanguage.number_of_people}
                                </Text>
                                <View style={{ height: hp(2) }} />
                                <View
                                    style={{
                                        backgroundColor: colors.COM_BACKGROUND,
                                        //  paddingHorizontal: wp(1),
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        //  width: wp(82),
                                        height: hp(6),
                                        paddingHorizontal: wp(4),
                                        borderRadius: 15,
                                    }}
                                >
                                    <Slider
                                        thumbStyle={{
                                            //  borderRadius: 20,
                                            width: 25,
                                            height: 25,
                                            borderRadius: 100,
                                            borderColor: '#fff',
                                            borderWidth: 3,
                                            elevation: 8,
                                        }}
                                        style={{ width: '85%', height: 80 }}
                                        minimumValue={1}
                                        maximumValue={10}
                                        step={1}
                                        minimumTrackTintColor={
                                            this.props.PrimaryColor == ''
                                                ? colors.BLUE
                                                : this.props.PrimaryColor
                                        }
                                        maximumTrackTintColor={colors.WHITE}
                                        // thumbTouchSize={{ width: 35, height: 35, borderRadius : 100 }}
                                        thumbTintColor={
                                            this.props.PrimaryColor == ''
                                                ? colors.BLUE
                                                : this.props.PrimaryColor
                                        }
                                        thumbTextStyle={{ color: 'red' }}
                                        value={parseInt(this.state.numberOfPeople)}
                                        thumbText={`${this.state.sliderValue}km`}
                                        disabled={this.props.isCheckedIn}
                                        onValueChange={(sliderValue) => {
                                            this._handleSelectNumberOfGuest(sliderValue);
                                            this.setState({ numberOfPeople: sliderValue });
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontSize: scale.w(1.6),
                                            color: '#4B4B4B',
                                            fontFamily: 'Roboto-Bold',
                                        }}
                                    >
                                        {' '}
                                        {this.state.numberOfPeople}
                                    </Text>
                                </View>
                            </View>
                        </DropShadow>
                        <View style={{ height: hp(2.5) }} />
                        <FlatList
                            data={Array.from(Array(this.state.numberOfPeople).keys())}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                            showsHorizontalScrollIndicator={false}
                            ListHeaderComponent={() => <View style={{ width: widthPercentageToDP(2) }} />}
                            ListFooterComponent={() => <View style={{ width: widthPercentageToDP(2) }} />}
                            renderItem={this._renderPhotoPicker}
                            style={{ paddingHorizontal: wp(10) }}
                        />
                        <DropShadow
                            style={{
                                width: wp(100),
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                shadowOpacity: 0.25,
                                shadowRadius: 10,
                            }}
                        >
                            <View
                                style={{
                                    paddingVertical: hp(3),
                                    paddingHorizontal: wp(4),
                                    width: wp(90),
                                    alignSelf: 'center',
                                    borderRadius: 15,
                                    backgroundColor: colors.WHITE,
                                    borderWidth: 1,
                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(1.6),
                                        fontFamily: 'Roboto-Medium',
                                        opacity: 1,
                                        color: colors.DUMMY_COLOR,
                                    }}
                                >
                                    {' '}
                                    {this.props.selectedLanguage.check_in_setting}
                                </Text>
                                <View style={{ height: hp(2) }} />
                                <View
                                    style={{
                                        //  width: wp(82),
                                        paddingHorizontal: wp(4),
                                        backgroundColor: colors.COM_BACKGROUND,
                                        justifyContent: 'space-between',
                                        borderRadius: 15,
                                        color: colors.DUMMY_COLOR,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        height: hp(6),
                                    }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            // label={booking_from}
                                            maxLength={50}
                                            editable={!this.state.bookingFound}
                                            placeholderTextColor={colors.DUMMY_COLOR}
                                            value={reference}
                                            onChangeText={(reference) => this.setState({ reference })}
                                            placeholder={this.props.selectedLanguage.booking_reference_no}
                                        ></TextInput>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (!this.state.bookingFound) {
                                                if (
                                                    (reference && reference.trim() == '') ||
                                                    reference == ''
                                                ) {
                                                    toast(
                                                        this.props.selectedLanguage
                                                            .please_enter_reference_number,
                                                    );
                                                } else {
                                                    this.setState({
                                                        finBookingLoader: true,
                                                    });
                                                    // setTimeout(() => {
                                                    this._findBooking();
                                                }
                                            } else {
                                                this.setState({
                                                    bookingFound: false,
                                                    arrivalDate:
                                                        this.props.isCheckedIn == false
                                                            ? ''
                                                            : this.props.profile.arrival_date,
                                                    departureDate:
                                                        this.props.isCheckedIn == false
                                                            ? ''
                                                            : this.props.profile.departure_date,
                                                    note_request:
                                                        this.props.hotel.profile.note_request !== 'null' &&
                                                        this.props.hotel.profile.note_request
                                                            ? this.props.hotel.profile.note_request
                                                            : '',
                                                    items: this.props.profile.additional_services,
                                                    reference: this.props.isCheckedIn
                                                        ? this.props.hotel.profile.reference
                                                        : '',
                                                    signature_photo:
                                                        this.props.hotel.profile?.signature_photo &&
                                                        this.props.hotel.profile.status !== 'checked_out'
                                                            ? this.props.hotel.profile?.signature_photo
                                                            : '',
                                                    temprature: this.props.hotel.profile?.room_temperature
                                                        ? this.props.hotel.profile?.room_temperature
                                                        : 18,
                                                    numberOfPeople:
                                                        this.props.profile.passport_photos?.length,
                                                    numberGuest: this.props.profile.passport_photos.length,
                                                });
                                            }
                                            // this.setState({
                                            //     find : !this.state.find,
                                            //     finBookingLoader : false
                                            // })
                                            // this._modalBookingNotAvailable.current?.show()
                                            // }, 5000);
                                        }}
                                    >
                                        {this.state.finBookingLoader ? (
                                            <Image
                                                resizeMode="cover"
                                                style={{
                                                    height: heightPercentageToDP(4),
                                                    width: widthPercentageToDP(15),
                                                    //tintColor: this.props.PrimaryColor,
                                                }}
                                                source={{ uri: this.state.chainData.data.logo_gif_light }}
                                            />
                                        ) : (
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.8),
                                                    fontFamily: 'Roboto-Bold',
                                                    color: this.props.PrimaryColor,
                                                }}
                                            >
                                                {!this.state.bookingFound
                                                    ? this.state.find
                                                        ? this.props.selectedLanguage.find
                                                        : this.props.selectedLanguage.use_booking
                                                    : 'Reset'}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                {this.state.noOfReferences.length > 1 &&
                                    this.state.noOfReferences.map((i, index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        selectedReference: i.reference,
                                                        arrivalDate: i?.arrival_date,
                                                        departureDate: i?.departure_date,
                                                        note_request: i?.note_request,
                                                        reference: i?.reference,
                                                    });
                                                }}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItem: 'center',
                                                    borderBottomWidth: 0.85,
                                                    marginVertical: heightPercentageToDP(1.5),
                                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                                }}
                                            >
                                                <View style={{ width: '90%' }}>
                                                    <Text
                                                        style={{
                                                            color: colors.DUMMY_COLOR,
                                                            marginBottom: heightPercentageToDP(1),
                                                        }}
                                                    >
                                                        {i.reference}
                                                    </Text>
                                                </View>
                                                <View style={{ width: '20%' }}>
                                                    {this.state.selectedReference == i.reference ? (
                                                        <Checked_Box
                                                            fill={
                                                                this.props.PrimaryColor == ''
                                                                    ? colors.BLUE
                                                                    : this.props.PrimaryColor
                                                            }
                                                            style={{
                                                                alignSelf: 'flex-start',
                                                                paddingHorizontal: widthPercentageToDP(2),
                                                            }}
                                                        />
                                                    ) : (
                                                        <UnChecked_Box
                                                            style={{
                                                                alignSelf: 'flex-start',
                                                                paddingHorizontal: widthPercentageToDP(2),
                                                            }}
                                                        />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                <TouchableOpacity
                                    onPress={this._handleModalDatePicker(false, true)}
                                    disabled={this.props.isCheckedIn || this.state.bookingFound}
                                    style={{
                                        backgroundColor: colors.COM_BACKGROUND,

                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justiifyContent: 'space-between',
                                        //  width: wp(82),
                                        marginTop: hp(2),
                                        paddingHorizontal: wp(4),
                                        borderRadius: 15,
                                        height: hp(6),
                                    }}
                                >
                                    {/* <TextInput
                                        editable={false}
                                        style={{ width: wp(66), color: colors.DUMMY_COLOR }}

                                        placeholderTextColor={colors.DUMMY_COLOR}
                                        value={
                                            arrivalDate === ''
                                                ? this.props.selectedLanguage.check_in
                                                : this.props.selectedLanguage.from + ': ' + format(arrivalDate, 'DD/MM/YYYY')
                                        }
                                    ></TextInput> */}
                                    <View style={{ width: wp(66), color: colors.DUMMY_COLOR }}>
                                        <Text
                                            style={{
                                                color: colors.DUMMY_COLOR,
                                                fontFamily: 'Roboto-Regular',
                                            }}
                                        >
                                            {arrivalDate === ''
                                                ? this.props.selectedLanguage.check_in
                                                : this.props.selectedLanguage.from +
                                                  ': ' +
                                                  format(arrivalDate, 'DD/MM/YYYY')}
                                        </Text>
                                    </View>
                                    <Calendar style={{ paddingHorizontal: widthPercentageToDP(4) }} />
                                    {/* <DIcon
                                    name={'calendar-today'}
                                    style={{ opacity: 0.5 }}
                                    size={20}
                                    color={colors.DARK_GREY}
                                ></DIcon> */}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this._handleModalDatePicker(false, false)}
                                    disabled={this.props.isCheckedIn || this.state.bookingFound}
                                    style={{
                                        backgroundColor: colors.COM_BACKGROUND,

                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justiifyContent: 'space-between',
                                        //  width: wp(82),
                                        marginTop: hp(2),
                                        paddingHorizontal: wp(4),
                                        borderRadius: 15,
                                        height: hp(6),
                                    }}
                                >
                                    <View style={{ width: wp(66), color: colors.DUMMY_COLOR }}>
                                        <Text
                                            style={{
                                                color: colors.DUMMY_COLOR,
                                                fontFamily: 'Roboto-Regular',
                                            }}
                                        >
                                            {departureDate === ''
                                                ? this.props.selectedLanguage.check_out
                                                : this.props.selectedLanguage.to +
                                                  ': ' +
                                                  format(departureDate, 'DD/MM/YYYY')}
                                        </Text>
                                    </View>
                                    <Calendar style={{ paddingHorizontal: widthPercentageToDP(4) }} />
                                </TouchableOpacity>
                            </View>
                        </DropShadow>
                        <View style={{ height: hp(2.5) }} />
                        <DropShadow
                            style={{
                                width: wp(100),
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                shadowOpacity: 0.25,
                                shadowRadius: 10,
                            }}
                        >
                            <View
                                style={{
                                    paddingVertical: hp(3),
                                    paddingHorizontal: wp(4),
                                    width: wp(90),
                                    alignSelf: 'center',
                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    backgroundColor: colors.WHITE,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(1.6),
                                        fontFamily: 'Roboto-Medium',
                                        color: colors.DUMMY_COLOR,
                                    }}
                                >
                                    {' '}
                                    {this.props.selectedLanguage.set_room_temperature}
                                </Text>
                                <View style={{ height: hp(2) }} />
                                <View
                                    style={{
                                        backgroundColor: colors.COM_BACKGROUND,
                                        //  paddingHorizontal: wp(1),
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        //  width: wp(82),
                                        height: hp(6),
                                        paddingHorizontal: wp(4),
                                        borderRadius: 15,
                                    }}
                                >
                                    <Slider
                                        thumbStyle={{
                                            //  borderRadius: 20,
                                            width: 25,
                                            height: 25,
                                            borderRadius: 100,
                                            borderColor: '#fff',
                                            borderWidth: 3,
                                            elevation: 8,
                                        }}
                                        style={{ width: '85%', height: 80 }}
                                        minimumValue={16}
                                        maximumValue={30}
                                        step={1}
                                        minimumTrackTintColor={
                                            this.props.PrimaryColor == ''
                                                ? colors.BLUE
                                                : this.props.PrimaryColor
                                        }
                                        maximumTrackTintColor={colors.WHITE}
                                        // thumbTouchSize={{ width: 35, height: 35, borderRadius : 100 }}
                                        thumbTintColor={
                                            this.props.PrimaryColor == ''
                                                ? colors.BLUE
                                                : this.props.PrimaryColor
                                        }
                                        thumbTextStyle={{ color: 'red' }}
                                        value={parseInt(this.state.temprature)}
                                        thumbText={`${this.state.sliderValue}km`}
                                        disabled={this.props.isCheckedIn && !this.state.bookingFound}
                                        onValueChange={(sliderValue) =>
                                            this.setState({ temprature: sliderValue })
                                        }
                                    />
                                    <Text
                                        style={{
                                            fontSize: scale.w(1.6),
                                            color: '#4B4B4B',
                                            fontFamily: 'Roboto-Bold',
                                        }}
                                    >
                                        {' '}
                                        {this.state.temprature}º C{' '}
                                    </Text>
                                </View>
                            </View>
                        </DropShadow>
                        <View style={{ height: hp(2.5) }} />
                        <DropShadow
                            style={{
                                width: wp(100),
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                shadowOpacity: 0.25,
                                shadowRadius: 10,
                            }}
                        >
                            <View
                                style={{
                                    paddingVertical: hp(3),
                                    paddingHorizontal: wp(4),
                                    width: wp(90),
                                    alignSelf: 'center',
                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    backgroundColor: colors.WHITE,
                                }}
                            >
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.6),
                                                fontFamily: 'Roboto-Medium',
                                                color: colors.DUMMY_COLOR,
                                            }}
                                        >
                                            {' '}
                                            {this.props.selectedLanguage.additional_services}
                                        </Text>
                                    </View>
                                    {this.state.items.length > 0 && !this.props.isCheckedIn && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                Navigation.push(
                                                    this.props.componentId,
                                                    additionalservices({
                                                        backGround: false,
                                                        onAdditionalServiceBack: this.onAdditionalServiceBack,
                                                        items: this.state.items,
                                                    }),
                                                );
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.6),
                                                    fontFamily: 'Roboto-Medium',
                                                    color: colors.DUMMY_COLOR,
                                                }}
                                            >
                                                {' '}
                                                {'Edit'}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <View style={{ height: hp(2) }} />
                                {/* <View
                                        style={{
                                            backgroundColor: colors.COM_BACKGROUND,
                                            paddingHorizontal: wp(1),
                                            //    flexDirection: 'row',
                                            //  alignItems: 'center',
                                            //justifyContent: 'space-between',
                                            width: wp(82),
                                            height: hp(8),
                                            marginTop: hp(2),
                                        }}
                                    > */}
                                <TouchableOpacity
                                    style={{
                                        //alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingHorizontal: wp(3),
                                        //  width: wp(100),
                                        borderWidth: 1,
                                        borderColor: colors.WHITE,
                                        borderRadius: 15,
                                        backgroundColor: colors.COM_BACKGROUND,
                                    }}
                                    disabled={
                                        (this.props.isCheckedIn && !this.state.bookingFound) ||
                                        this.state.items.length > 0
                                    }
                                    onPress={() => {
                                        // this._additionalService.current?.show()
                                        Navigation.push(
                                            this.props.componentId,
                                            additionalservices({
                                                backGround: false,
                                                onAdditionalServiceBack: this.onAdditionalServiceBack,
                                                items: this.state.items,
                                            }),
                                        );
                                    }}
                                >
                                    <View style={{ paddingVertical: heightPercentageToDP(1.5) }}>
                                        {this.state.items.length > 0 ? (
                                            this.state.items.map((i, index) => {
                                                return (
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItem: 'center',
                                                            borderBottomWidth: 0.85,
                                                            marginVertical: heightPercentageToDP(1.5),
                                                            borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                                        }}
                                                    >
                                                        <View style={{ width: '80%' }}>
                                                            <Text
                                                                style={{
                                                                    color: colors.DUMMY_COLOR,
                                                                    marginBottom: heightPercentageToDP(1),
                                                                }}
                                                            >
                                                                {index + 1}. {i.name} (
                                                                {i.qty ? i.qty : i.quantity})
                                                            </Text>
                                                        </View>
                                                        <View style={{ width: '20%' }}>
                                                            <Text>
                                                                {parseInt(i.qty ? i.qty : i.quantity) *
                                                                    parseInt(i.price)}{' '}
                                                                {this.props.currency}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                );
                                            })
                                        ) : (
                                            <Text
                                                style={{
                                                    color: colors.DUMMY_COLOR,
                                                    marginBottom: heightPercentageToDP(1),
                                                }}
                                            >
                                                {this.props.selectedLanguage.no_item_selected}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>

                                {/* 
                                    Previous picker
                                    <DropDownPicker
                                        //   disabled={this.props.isCheckedIn}
                                        items={this.state.AdditionalServicesList}
                                        placeholder={this.props.selectedLanguage.extras}
                                        labelStyle={{ color: colors.DUMMY_COLOR }}
                                        activeLabelStyle={{ color: colors.DUMMY_COLOR }}
                                        onOpen={() => {
                                            this.setState({
                                                dropDownOpened: !this.state.dropDownOpened,
                                            });
                                        }}
                                        onClose={() => {
                                            this.setState({
                                                dropDownOpened: !this.state.dropDownOpened,
                                            });
                                        }}
                                        containerStyle={{
                                            height: hp(7),
                                            width: '100%',
                                        }}
                                        style={{
                                            //   alignItems: 'center',
                                            // justifyContent: 'center',
                                            //  width: wp(100),
                                            borderTopLeftRadius: scale.w(1.8), borderTopRightRadius: scale.w(1.8),
                                            borderBottomLeftRadius: scale.w(1.8), borderBottomRightRadius: scale.w(1.8),
                                            borderWidth: 1,
                                            borderColor: colors.WHITE,
                                            borderRadius: scale.w(10),
                                            backgroundColor: colors.COM_BACKGROUND,


                                        }}
                                        arrowColor={"#121924"}
                                        itemStyle={{
                                            justifyContent: 'flex-start',
                                            width: wp(90),
                                            borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR
                                        }}
                                        dropDownStyle={{ backgroundColor: colors.WHITE, width: wp(81), alignSelf: 'center', borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR }}
                                        onChangeItem={async (item) => {
                                            await this.setState({
                                                dropDownValue: item.value,
                                                bedLabel: item.label,
                                                price: item.price,
                                            });
                                        }}
                                    /> */}

                                {/* </View> */}
                            </View>
                        </DropShadow>
                        <View style={{ height: hp(2.5) }} />
                        <DropShadow
                            style={{
                                width: wp(100),
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                shadowOpacity: 0.25,
                                shadowRadius: 10,
                            }}
                        >
                            <View
                                style={{
                                    paddingVertical: hp(3),
                                    paddingHorizontal: wp(4),
                                    width: wp(90),
                                    alignSelf: 'center',
                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    backgroundColor: '#ffff',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(1.6),
                                        fontFamily: 'Roboto-Medium',
                                        color: colors.DUMMY_COLOR,
                                    }}
                                >
                                    {' '}
                                    {this.props.selectedLanguage.check_in_notes}
                                </Text>
                                <View style={{ height: heightPercentageToDP(0.7) }}></View>
                                <TextInput
                                    editable={
                                        (this.props.isCheckedIn == true ? false : true) ||
                                        this.state.bookingFound
                                    }
                                    placeholder={this.props.selectedLanguage.type_something_you_want_here}
                                    value={this.state.note_request}
                                    multiline={true}
                                    textAlignVertical="top"
                                    numberOfLines={2}
                                    onChangeText={(note) => this.setState({ note_request: note })}
                                    autoCapitalize="none"
                                    style={{ fontSize: scale.w(1.6), color: '#C5CEE0', width: wp(80) }}
                                    placeholderTextColor={'#C5CEE0'}
                                ></TextInput>
                            </View>
                        </DropShadow>
                        <DropShadow
                            style={{
                                width: wp(100),
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                shadowOpacity: 0.25,
                                shadowRadius: 10,
                            }}
                        >
                            <View
                                style={{
                                    paddingVertical: hp(3),
                                    paddingHorizontal: wp(4),
                                    width: wp(90),
                                    alignSelf: 'center',
                                    borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    marginTop: hp(3),
                                    backgroundColor: colors.WHITE,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(1.6),
                                        fontFamily: 'Roboto-Medium',
                                        color: colors.DUMMY_COLOR,
                                    }}
                                >
                                    {' '}
                                    {this.props.selectedLanguage.signature}
                                </Text>
                                <View style={{ height: heightPercentageToDP(2) }}></View>
                                <TouchableOpacity
                                    disabled={this.props.isCheckedIn && !this.state.bookingFound}
                                    onPress={() => {
                                        this.setModalVisible(true);
                                    }}
                                    activeOpacity={1}
                                    style={{
                                        width: widthPercentageToDP(80),
                                        height: heightPercentageToDP(12),
                                        //   borderRadius: scale.w(20),
                                        backgroundColor: '#fff',
                                        alignSelf: 'center',
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        // ...Platform.select({
                                        //     ios: {
                                        //         shadowColor: '#000',
                                        //         shadowOffset: { width: 0, height: 4 },
                                        //         shadowOpacity: 0.2,
                                        //         shadowRadius: 3,
                                        //     },
                                        //     android: {
                                        //         // elevation: 8,
                                        //     },
                                        // }),
                                    }}
                                >
                                    {this.state.signature_photo.name ? (
                                        <Image
                                            resizeMode="contain"
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                            }}
                                            source={{ uri: this.state.signature_photo.uri }}
                                        />
                                    ) : this.state.signature_photo != '' &&
                                      this.props.isCheckedIn &&
                                      !this.state.bookingFound ? (
                                        <Image
                                            resizeMode="contain"
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                            }}
                                            source={{ uri: this.state.signature_photo[0] }}
                                        />
                                    ) : (
                                        <Text style={{ color: '#C5CEE0', fontFamily: 'Roboto-Regular' }}>
                                            {tab_to_add_signature}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                {!this.props.isCheckedIn ||
                                    (this.state.bookingFound &&
                                        (this.state.signature_photo ? (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        signature_photo: '',
                                                    });
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'Roboto-Light',
                                                        fontSize: scale.w(1.6),
                                                        color:
                                                            this.props.PrimaryColor == ''
                                                                ? '#2E91EE'
                                                                : this.props.PrimaryColor,
                                                        textDecorationLine: 'underline',
                                                        alignSelf: 'flex-end',
                                                        marginTop: scale.w(10),
                                                    }}
                                                >
                                                    {clear}
                                                </Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View />
                                        )))}
                            </View>
                        </DropShadow>
                        <View
                            style={{
                                paddingVertical: hp(3),
                                paddingHorizontal: wp(4),
                                //  elevation: 1,
                                //  borderRadius: 15,
                                marginTop: hp(1),
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            {this.state.checkBoxState || this.props.isCheckedIn ? (
                                <TouchableOpacity
                                    disabled={this.props.isCheckedIn}
                                    onPress={() =>
                                        this.setState({ checkBoxState: !this.state.checkBoxState })
                                    }
                                >
                                    <Checked_Box
                                        fill={
                                            this.props.PrimaryColor == ''
                                                ? colors.BLUE
                                                : this.props.PrimaryColor
                                        }
                                        style={{
                                            alignSelf: 'flex-start',
                                            paddingHorizontal: widthPercentageToDP(5),
                                        }}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    disabled={this.props.isCheckedIn}
                                    onPress={() =>
                                        this.setState({ checkBoxState: !this.state.checkBoxState })
                                    }
                                >
                                    <UnChecked_Box
                                        style={{
                                            alignSelf: 'flex-start',
                                            paddingHorizontal: widthPercentageToDP(5),
                                        }}
                                    />
                                </TouchableOpacity>
                            )}
                            {/* <CheckBox
                                style={{ alignSelf: 'flex-start' }}
                                // boxStyle={ {color: #ffffff} }
                                disabled={this.props.isCheckedIn}
                                tintColors={{ true: colors.BLUE }}
                                value={this.state.terms_and_condition}
                                onValueChange={(newValue: any) =>
                                    this.setState({ terms_and_condition: newValue })
                                }
                            /> */}
                            <View style={{ flexDirection: 'row' }}></View>
                            <Text
                                style={{
                                    fontSize: scale.w(1.6),
                                    color: colors.BLACK,
                                    fontFamily: 'Roboto-Light',
                                }}
                            >
                                {i_agree_with_all + ' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        terms_and_condition_modal: true,
                                    });
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            this.props.PrimaryColor == ''
                                                ? '#2E91EE'
                                                : this.props.PrimaryColor,
                                        fontSize: scale.w(1.6),

                                        fontFamily: 'Roboto-bold',
                                    }}
                                >
                                    {terms_and_condition}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {!this.props.isCheckedIn || this.state.bookingFound ? (
                            <DropShadow
                                style={{
                                    width: wp(100),
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    shadowColor: '#000',
                                    shadowOpacity: 0.15,
                                    shadowRadius: 6,
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        height: wp(15),
                                        paddingHorizontal: wp(5),
                                        width: wp(90),
                                        alignSelf: 'center',
                                        borderRadius: 15,
                                        marginTop: hp(3),
                                        backgroundColor:
                                            this.props.PrimaryColor == ''
                                                ? colors.BLUE
                                                : this.props.PrimaryColor,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                    disabled={this.state.loading}
                                    onPress={this._handleSubmit}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.4),
                                                color: colors.WHITE,
                                                alignSelf: 'center',
                                                fontFamily: 'Roboto-Light',
                                            }}
                                        >
                                            {this.state.bedLabel == ''
                                                ? this.props.selectedLanguage.extras
                                                : this.state.bedLabel}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.6),
                                                color: colors.WHITE,
                                                alignSelf: 'center',
                                                fontFamily: 'Roboto-Bold',
                                                paddingHorizontal: wp(3.5),
                                            }}
                                        >
                                            {this.state.price !== 0 ? '$' + this.state.price : null}
                                        </Text>
                                    </View>
                                    {this.state.loading ? (
                                        <View
                                            style={{
                                                width: widthPercentageToDP(20),
                                                height: heightPercentageToDP(3.5),
                                                alignSelf: 'center',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Image
                                                resizeMode="cover"
                                                style={{
                                                    height: heightPercentageToDP(4),
                                                    width: widthPercentageToDP(18),
                                                    marginTop: -heightPercentageToDP(1),
                                                }}
                                                source={{ uri: this.state.chainData.data.logo_gif_light }}
                                            />
                                        </View>
                                    ) : (
                                        <Text
                                            style={{
                                                fontSize: scale.w(2.0),
                                                color: colors.WHITE,
                                                fontFamily: 'Roboto-Bold',
                                                alignSelf: 'center',
                                            }}
                                        >
                                            {this.props.selectedLanguage.check_in}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </DropShadow>
                        ) : null}
                        <View style={{ height: hp(10) }} />
                    </ScrollView>
                    <Modal
                        backdropOpacity={0.7}
                        isVisible={this.state.modalVisible}
                        onBackdropPress={() => {
                            this.setModalVisible(false);
                        }}
                    >
                        <View
                            style={{
                                height: heightPercentageToDP(60),
                                width: widthPercentageToDP(90),
                                borderRadius: scale.w(2),
                                justifyContent: 'center',
                                paddingHorizontal: wp(2),
                                alignItems: 'center',
                                backgroundColor: '#fff',
                            }}
                        >
                            <TouchableHighlight>
                                <ViewShot
                                    ref={(ref) => {
                                        this.viewRef = ref;
                                    }}
                                    options={{ format: 'png', quality: 0.9 }}
                                    captureMode="none"
                                >
                                    <SignatureCapture
                                        style={{
                                            height: heightPercentageToDP(40),
                                            width: widthPercentageToDP(90),
                                        }}
                                        ref={this.sign}
                                        onDragEvent={this._onDragEvent}
                                        showNativeButtons={false}
                                        showTitleLabel={false}
                                        viewMode={'portrait'}
                                    />
                                </ViewShot>
                            </TouchableHighlight>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginBottom: heightPercentageToDP(2),
                                }}
                            >
                                <View
                                    style={{
                                        width: '40%',
                                    }}
                                >
                                    <ButtonPrimary
                                        backgroundColor={
                                            this.props.PrimaryColor == ''
                                                ? colors.BLUE
                                                : this.props.PrimaryColor
                                        }
                                        onPress={this.resetSign}
                                        loading={false}
                                        disabled={this.state.signatureCaptured == false ? true : false}
                                        fontSize={scale.w(1.6)}
                                        text={clear_signature}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                                <View style={{ width: '10%' }}></View>
                                <View
                                    style={{
                                        width: '40%',
                                    }}
                                >
                                    <ButtonPrimary
                                        backgroundColor={
                                            this.props.PrimaryColor == ''
                                                ? colors.BLUE
                                                : this.props.PrimaryColor
                                        }
                                        onPress={this.onCapture}
                                        loading={false}
                                        disabled={false}
                                        fontSize={scale.w(1.6)}
                                        text={save_signature}
                                        chainData={this.props.chainData}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <CustomModal ref={this._modalDatePicker}>
                        <ModalDatePicker
                            date={new Date(tempDate)}
                            minimumDate={new Date()}
                            onDateChange={this._onChangeDate}
                            showModal={this._handleShowModal(isArrivalDate, true)}
                            title={`${pick_your} ${
                                this.state.selectArrivalDate ? `${arrival_date}` : `${departured_date}`
                            }`}
                            color={this.props.PrimaryColor == '' ? colors.BLUE : this.props.PrimaryColor}
                            otherText={{ date: date, month: month, year: year, ok: ok }}
                            chainData={this.props.chainData}
                        />
                    </CustomModal>
                    <Modal
                        backdropOpacity={0.7}
                        isVisible={this.state.terms_and_condition_modal}
                        onBackdropPress={() => {
                            this.setState({
                                terms_and_condition_modal: false,
                            });
                        }}
                        style={{
                            flex: 1,
                            margin: -1,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            {/* <View style={{height : heightPercentageToDP(10), width : widthPercentageToDP(100), paddingHorizontal : widthPercentageToDP(5)}} > */}
                            <Navbar
                                tintBackColor={colors.WHITE}
                                onClick={() =>
                                    this.setState({
                                        terms_and_condition_modal: false,
                                    })
                                }
                                title={''}
                            />
                            {/* </View> */}
                            <View
                                style={{
                                    width: widthPercentageToDP(100),
                                    height: heightPercentageToDP(90),
                                    backgroundColor: '#fff',
                                    borderTopLeftRadius: scale.h(5),
                                    borderTopRightRadius: scale.h(5),
                                    paddingTop: heightPercentageToDP(3),
                                }}
                            >
                                {/* <View
                                    style={{
                                        alignItems: 'flex-end',
                                        justifyContent:'center',
                                        height: heightPercentageToDP(5),
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            height: heightPercentageToDP(5),
                                            width: widthPercentageToDP(10),
                                            borderTopLeftRadius: scale.h(5),
                                            borderTopRightRadius: scale.h(5),
                                            marginTop : heightPercentageToDP(2)
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                terms_and_condition_modal: false,
                                            });
                                        }}
                                    >
                                        <Icons color="red" size={18} name={'times-circle'} />
                                    </TouchableOpacity>
                                </View> */}
                                <View style={{ alignSelf: 'center', width: widthPercentageToDP(90) }}>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <H2 marginTop={heightPercentageToDP(2)}>1. Terms</H2>
                                        <H3 width={widthPercentageToDP(86)}>
                                            By accessing the website and application at http://servrhotels.com
                                            or using our application “Servr,” you are agreeing to be bound by
                                            these terms of service, all applicable laws, and regulations, and
                                            agree that you are responsible for compliance with any applicable
                                            local laws. If you do not agree with any of these terms, you are
                                            prohibited from using or accessing this site. The materials
                                            contained in this website and application are protected by
                                            applicable copyright and trademark law.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>2. Use License</H2>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <H3>1.</H3>
                                            <H3 width={widthPercentageToDP(85)}>
                                                Permission is granted to temporarily download one copy of the
                                                materials (information or software) on{' '}
                                                {this.state.chainData.data.name} LTD.'s website and
                                                application for personal, non-commercial transitory viewing
                                                only. This is the grant of a license, not a transfer of title,
                                                and under this license, you may not:
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3 marginLeft={25}>1.</H3>
                                            <H3>modify or copy the materials;</H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3 marginLeft={25}>2.</H3>
                                            <H3 width={widthPercentageToDP(82)}>
                                                use the materials for any commercial purpose, or for any
                                                public display (commercial or non-commercial);
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3 marginLeft={25}>3.</H3>
                                            <H3 width={widthPercentageToDP(82)}>
                                                attempt to decompile or reverse engineer any software
                                                contained on {this.state.chainData.data.name} LTD.'s website
                                                and application or application;
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3 marginLeft={25}>4.</H3>
                                            <H3 width={widthPercentageToDP(82)}>
                                                remove any copyright or other proprietary notations from the
                                                materials; or
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3 marginLeft={25}>5.</H3>
                                            <H3 width={widthPercentageToDP(82)}>
                                                transfer the materials to another person or "mirror" the
                                                materials on any other server.
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3>2.</H3>
                                            <H3 width={widthPercentageToDP(86)}>
                                                This license shall automatically terminate if you violate any
                                                of these restrictions and may be terminated by{' '}
                                                {this.state.chainData.data.name} LTD. at any time. Upon
                                                terminating your viewing of these materials or upon the
                                                termination of this license, you must destroy any downloaded
                                                materials in your possession whether in electronic or printed
                                                format.
                                            </H3>
                                        </View>

                                        <H2 marginTop={heightPercentageToDP(2)}>3. Disclaimer</H2>
                                        <View
                                        // style={{
                                        //     paddingHorizontal : widthPercentageToDP(3),
                                        // }}
                                        >
                                            <View style={{ flexDirection: 'row' }}>
                                                <H3>1.</H3>
                                                <H3 width={widthPercentageToDP(86)}>
                                                    The materials on {this.state.chainData.data.name} LTD.'s
                                                    website and application and application are provided on an
                                                    'as is' basis. {this.state.chainData.data.name} LTD. makes
                                                    no warranties, expressed or implied, and hereby disclaims
                                                    and negates all other warranties including, without
                                                    limitation, implied warranties or conditions of
                                                    merchantability, fitness for a particular purpose, or
                                                    non-infringement of intellectual property or other
                                                    violation of rights.
                                                </H3>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <H3>2.</H3>
                                                <H3 width={widthPercentageToDP(86)}>
                                                    Further, {this.state.chainData.data.name} LTD. does not
                                                    warrant or make any representations concerning the
                                                    accuracy, likely results, or reliability of the use of the
                                                    materials on its website and application or otherwise
                                                    relating to such materials or on any sites linked to this
                                                    site.
                                                </H3>
                                            </View>
                                        </View>

                                        <H2 marginTop={heightPercentageToDP(2)}>4. Limitations</H2>
                                        <H3>
                                            In no event shall {this.state.chainData.data.name} LTD. or its
                                            suppliers be liable for any damages (including, without
                                            limitation, damages for loss of data or profit, or due to business
                                            interruption) arising out of the use or inability to use the
                                            materials on {this.state.chainData.data.name} LTD.'s website and
                                            application and application, even if{' '}
                                            {this.state.chainData.data.name} LTD. or a{' '}
                                            {this.state.chainData.data.name} LTD. authorized representative
                                            has been notified orally or in writing of the possibility of such
                                            damage. Because some jurisdictions do not allow limitations on
                                            implied warranties, or limitations of liability for consequential
                                            or incidental damages, these limitations may not apply to you.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>5. Accuracy of materials</H2>
                                        <H3>
                                            The materials appearing on {this.state.chainData.data.name} LTD.'s
                                            website and application could include technical, typographical, or
                                            photographic errors. {this.state.chainData.data.name} LTD. does
                                            not warrant that any of the materials on its website and
                                            application are accurate, complete, or current.{' '}
                                            {this.state.chainData.data.name} LTD. may make changes to the
                                            materials contained on its website and application at any time
                                            without notice. However {this.state.chainData.data.name} LTD. does
                                            not make any commitment to update the materials.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>6. Links</H2>
                                        <H3>
                                            {this.state.chainData.data.name} LTD. has not reviewed all of the
                                            sites linked to its website and application and is not responsible
                                            for the contents of any such linked site. The inclusion of any
                                            link does not imply endorsement by{' '}
                                            {this.state.chainData.data.name}
                                            LTD. of the site. The use of any such linked website and
                                            application is at the user's own risk.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>7. Modifications</H2>
                                        <H3>
                                            {this.state.chainData.data.name} LTD. may revise these terms of
                                            service for its website and application at any time without
                                            notice. By using this website and application you are agreeing to
                                            be bound by the then current version of these terms of service.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>8. Governing Law</H2>
                                        <H3>
                                            These terms and conditions are governed by and construed in
                                            accordance with the laws of Hong Kong and you irrevocably submit
                                            to the exclusive jurisdiction of the courts in that State or
                                            location.
                                        </H3>

                                        {/* ==============================privacy============================= */}

                                        <H2 marginTop={heightPercentageToDP(2)}>Privacy Policy</H2>
                                        <H3>
                                            Your privacy is important to us. It is{' '}
                                            {this.state.chainData.data.name} LTD.'s policy to respect your
                                            privacy regarding any information we may collect from you across
                                            our website and application, http://servrhotels.com, and other
                                            sites we own and operate.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>1. Information we collect</H2>
                                        {/* <H4 bold={true} fontSize={1.2} marginTop={5} marginBottom={5}>
                                        Log data
                                    </H4> */}
                                        <H3>
                                            When you visit our website and application, our servers may
                                            automatically log the standard data provided by your web browser.
                                            It may include your computer’s Internet Protocol (IP) address,
                                            your browser type and version, the pages you visit, the time and
                                            date of your visit, the time spent on each page, and other
                                            details.
                                        </H3>

                                        <H4 bold={true} fontSize={1.2} marginTop={5} marginBottom={5}>
                                            Device data
                                        </H4>
                                        <H3>
                                            We may also collect data about the device you’re using to access
                                            our website and application. This data may include the device
                                            type, operating system, unique device identifiers, device
                                            settings, and geo-location data. What we collect can depend on the
                                            individual settings of your device and software. We recommend
                                            checking the policies of your device manufacturer or software
                                            provider to learn what information they make available to us.
                                        </H3>

                                        <H4 bold={true} fontSize={1.2} marginTop={5} marginBottom={5}>
                                            Personal information
                                        </H4>
                                        <H3>We may ask for personal information, such as your:</H3>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(5),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>Name</H3>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(5),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>Email</H3>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(5),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>Social media profiles</H3>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(5),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>Date of birth</H3>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(5),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>Phone/mobile number</H3>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(5),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>Home/Mailing address</H3>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(5),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>
                                                website and application address
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(5),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>Payment information</H3>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(5),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>
                                                Driver's licence details
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(5),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>Passport number</H3>
                                        </View>

                                        <H4 bold={true} fontSize={1.2} marginTop={5} marginBottom={5}>
                                            Business data
                                        </H4>
                                        <H3>
                                            Business data refers to data that accumulates over the normal
                                            course of operation on our platform. This may include transaction
                                            records, stored files, user profiles, analytics data and other
                                            metrics, as well as other types of information, created or
                                            generated, as users interact with our services.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>
                                            2. Legal bases for processing
                                        </H2>

                                        <H3>
                                            We will process your personal information lawfully, fairly and in
                                            a transparent manner. We collect and process information about you
                                            only where we have legal bases for doing so. These legal bases
                                            depend on the services you use and how you use them, meaning we
                                            collect and use your information only where:
                                        </H3>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                it’s necessary for the performance of a contract to which you
                                                are a party or to take steps at your request before entering
                                                into such a contract (for example, when we provide a service
                                                you request from us);
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                it satisfies a legitimate interest (which is not overridden by
                                                your data protection interests), such as for research and
                                                development, to market and promote our services, and to
                                                protect our legal rights and interests;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: scale.h(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                you give us consent to do so for a specific purpose (for
                                                example, you might consent to us sending you our newsletter);
                                                or
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: scale.h(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                we need to process your data to comply with a legal
                                                obligation.
                                            </H3>
                                        </View>
                                        <H3>
                                            Where you consent to our use of information about you for a
                                            specific purpose, you have the right to change your mind at any
                                            time (but this will not affect any processing that has already
                                            taken place). We don’t keep personal information for longer than
                                            is necessary. While we retain this information, we will protect it
                                            within commercially acceptable means to prevent loss and theft, as
                                            well as unauthorized access, disclosure, copying, use or
                                            modification. That said, we advise that no method of electronic
                                            transmission or storage is 100% secure and cannot guarantee
                                            absolute data security. If necessary, we may retain your personal
                                            information for our compliance with a legal obligation or in order
                                            to protect your vital interests or the vital interests of another
                                            natural person.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>
                                            3. Collection and use of information
                                        </H2>
                                        <H3>
                                            We may collect, hold, use and disclose information for the
                                            following purposes and personal information will not be further
                                            processed in a manner that is incompatible with these purposes:
                                        </H3>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                to provide you with our platform's core features;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                to process any transactional or ongoing payments;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                to enable you to access and use our website and application,
                                                associated applications and associated social media platforms;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>
                                                to contact and communicate with you;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                for internal record keeping and administrative purposes;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                for analytics, market research and business development,
                                                including to operate and improve our website and application,
                                                associated applications and associated social media platforms;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                for advertising and marketing, including to send you
                                                promotional information about our products and services and
                                                information about third parties that we consider may be of
                                                interest to you; and
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                to comply with our legal obligations and resolve any disputes
                                                that we may have.
                                            </H3>
                                        </View>

                                        <H2
                                            marginTop={heightPercentageToDP(2)}
                                            width={widthPercentageToDP(82)}
                                        >
                                            4. Disclosure of personal information to third parties
                                        </H2>
                                        <H3>We may disclose personal information to:</H3>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                third party service providers for the purpose of enabling them
                                                to provide their services, including (without limitation) IT
                                                service providers, data storage, hosting and server providers,
                                                ad networks, analytics, error loggers, debt collectors,
                                                maintenance or problem-solving providers, marketing or
                                                advertising providers, professional advisors and payment
                                                systems operators;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>
                                                our employees, contractors and/or related entities;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>
                                                sponsors or promoters of any competition we run;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                credit reporting agencies, courts, tribunals and regulatory
                                                authorities, in the event you fail to pay for goods or
                                                services we have provided to you;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                courts, tribunals, regulatory authorities and law enforcement
                                                officers, as required by law, in connection with any actual or
                                                prospective legal proceedings, or in order to establish,
                                                exercise or defend our legal rights;
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                third parties, including agents or sub-contractors, who assist
                                                us in providing information, products, services or direct
                                                marketing to you; and
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: scale.w(1.5),
                                                    width: scale.w(1.5),
                                                    borderRadius: scale.w(1.5) / 2,
                                                    backgroundColor: 'black',
                                                    marginLeft: widthPercentageToDP(2),
                                                    marginTop: heightPercentageToDP(1),
                                                }}
                                            />
                                            <H3 marginLeft={widthPercentageToDP(2)}>
                                                third parties to collect and process data.
                                            </H3>
                                        </View>

                                        <H2 marginTop={heightPercentageToDP(2)}>
                                            5. International transfers of personal information
                                        </H2>
                                        <H3>
                                            The personal information we collect is stored and processed where
                                            we or our partners, affiliates and third-party providers maintain
                                            facilities. By providing us with your personal information, you
                                            consent to the disclosure to these overseas third parties. We will
                                            ensure that any transfer of personal information from countries in
                                            the European Economic Area (EEA) to countries outside the EEA will
                                            be protected by appropriate safeguards, for example by using
                                            standard data protection clauses approved by the European
                                            Commission, or the use of binding corporate rules or other legally
                                            accepted means. Where we transfer personal information from a
                                            non-EEA country to another country, you acknowledge that third
                                            parties in other jurisdictions may not be subject to similar data
                                            protection laws to the ones in our jurisdiction. There are risks
                                            if any such third party engages in any act or practice that would
                                            contravene the data privacy laws in our jurisdiction and this
                                            might mean that you will not be able to seek redress under our
                                            jurisdiction’s privacy laws.
                                        </H3>

                                        <H2
                                            marginTop={heightPercentageToDP(2)}
                                            width={widthPercentageToDP(82)}
                                        >
                                            6. Your rights and controlling your personal information
                                        </H2>
                                        <H3>
                                            Choice and consent: By providing personal information to us, you
                                            consent to us collecting, holding, using and disclosing your
                                            personal information in accordance with this privacy policy. If
                                            you are under 16 years of age, you must have, and warrant to the
                                            extent permitted by law to us, that you have your parent or legal
                                            guardian’s permission to access and use the website and
                                            application and they (your parents or guardian) have consented to
                                            you providing us with your personal information. You do not have
                                            to provide personal information to us, however, if you do not, it
                                            may affect your use of this website and application or the
                                            products and/or services offered on or through it. Information
                                            from third parties: If we receive personal information about you
                                            from a third party, we will protect it as set out in this privacy
                                            policy. If you are a third party providing personal information
                                            about somebody else, you represent and warrant that you have such
                                            person’s consent to provide the personal information to us.
                                            Restrict: You may choose to restrict the collection or use of your
                                            personal information. If you have previously agreed to us using
                                            your personal information for direct marketing purposes, you may
                                            change your mind at any time by contacting us using the details
                                            below. If you ask us to restrict or limit how we process your
                                            personal information, we will let you know how the restriction
                                            affects your use of our website and application or products and
                                            services. Access and data portability: You may request details of
                                            the personal information that we hold about you. You may request a
                                            copy of the personal information we hold about you. Where
                                            possible, we will provide this information in CSV format or other
                                            easily readable machine format. You may request that we erase the
                                            personal information we hold about you at any time. You may also
                                            request that we transfer this personal information to another
                                            third party. Correction: If you believe that any information we
                                            hold about you is inaccurate, out of date, incomplete, irrelevant
                                            or misleading, please contact us using the details below. We will
                                            take reasonable steps to correct any information found to be
                                            inaccurate, incomplete, misleading or out of date. Notification of
                                            data breaches: We will comply laws applicable to us in respect of
                                            any data breach. Complaints: If you believe that we have breached
                                            a relevant data protection law and wish to make a complaint,
                                            please contact us using the details below and provide us with full
                                            details of the alleged breach. We will promptly investigate your
                                            complaint and respond to you, in writing, setting out the outcome
                                            of our investigation and the steps we will take to deal with your
                                            complaint. You also have the right to contact a regulatory body or
                                            data protection authority in relation to your complaint.
                                            Unsubscribe: To unsubscribe from our e-mail database or opt-out of
                                            communications (including marketing communications), please
                                            contact us using the details below or opt-out using the opt-out
                                            facilities provided in the communication.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>7. Cookies</H2>
                                        <H3>
                                            We use “cookies” to collect information about you and your
                                            activity across our site. A cookie is a small piece of data that
                                            our website and application stores on your computer, and accesses
                                            each time you visit, so we can understand how you use our site.
                                            This helps us serve you content based on preferences you have
                                            specified. Please refer to our Cookie Policy for more information.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>8. Business transfers</H2>
                                        <H3>
                                            If we or our assets are acquired, or in the unlikely event that we
                                            go out of business or enter bankruptcy, we would include data
                                            among the assets transferred to any parties who acquire us. You
                                            acknowledge that such transfers may occur, and that any parties
                                            who acquire us may continue to use your personal information
                                            according to this policy.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>9. Limits of our policy</H2>
                                        <H3>
                                            Our website and application may link to external sites that are
                                            not operated by us. Please be aware that we have no control over
                                            the content and policies of those sites, and cannot accept
                                            responsibility or liability for their respective privacy
                                            practices.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>
                                            10. Changes to this policy
                                        </H2>
                                        <H3>
                                            At our discretion, we may change our privacy policy to reflect
                                            current acceptable practices. We will take reasonable steps to let
                                            users know about changes via our website and application. Your
                                            continued use of this site after any changes to this policy will
                                            be regarded as acceptance of our practices around privacy and
                                            personal information. If we make a significant change to this
                                            privacy policy, for example changing a lawful basis on which we
                                            process your personal information, we will ask you to re-consent
                                            to the amended privacy policy.
                                        </H3>

                                        <H2 marginTop={heightPercentageToDP(2)}>11. GDPR Policy</H2>
                                        <H3>
                                            At our discretion, we may change our privacy policy to reflect
                                            current acceptable practices. We will take reasonable steps to let
                                            users know about changes via our website and application. Your
                                            continued use of this site after any changes to this policy will
                                            be regarded as acceptance of our practices around privacy and
                                            personal information. If we make a significant change to this
                                            privacy policy, for example changing a lawful basis on which we
                                            process your personal information, we will ask you to re-consent
                                            to the amended privacy policy.
                                        </H3>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>1.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                This agreement determines the rights and obligations of the
                                                controllers (hereinafter also referred to as "parties") for
                                                the joint processing of personal data. It applies to all
                                                activities of the parties, or processors appointed by a party,
                                                when processing personal data. The parties have jointly
                                                determined the purposes and means of processing personal data
                                                in accordance with Art. 26 GDPR. (2) The “
                                                {this.state.chainData.data.name}” application processes
                                                personal data. Depending on the section of processing, this
                                                data is processed in the Hotel’s and{' '}
                                                {this.state.chainData.data.name} LTD`s system area. The
                                                parties determine the sections in which personal data are
                                                processed under joint controllership (Article 26 GDPR). For
                                                the other sections of processing, where the parties do not
                                                jointly determine the purposes and means of data processing,
                                                each contracting party is a controller pursuant to Article 4
                                                No. 7 GDPR. As far as the contracting parties are joint
                                                controllers pursuant to Article 26 GDPR, it is agreed as
                                                follows:
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>2.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                (1) In context of joint controllership,{' '}
                                                {this.state.chainData.data.name} LTD is competent for the
                                                processing of personal data in the operating range of
                                                providing the “{this.state.chainData.data.name}” application
                                                and storing the Personal Data entered by the Hotels’ Guests on
                                                network services provided by “AWS”. The processing may concern
                                                the following categories of data: Personal and non-personal
                                                information. Personal information includes: name, email
                                                address, and physical address, including city and state.,
                                                Passport, Government Issued Id or Driving License, Masked
                                                Credit Card Details. Non-personal information includes
                                                Check-in and Check-out Dates and booking service or related
                                                information such as about your stay or hospitality, travelling
                                                or other preferences including special needs or medical
                                                conditions, location data and your general product and service
                                                preferences. The legal basis for the processing of personal
                                                data is performance of a contract. (2) In the context of joint
                                                controllership, the Hotel is competent for the processing of
                                                personal data in operating range of providing general Hotel
                                                services and booking features using the “
                                                {this.state.chainData.data.name}” application to its Guests.
                                                Personal and non-personal information. Personal information
                                                includes: name, email address, and physical address, including
                                                city and state., Passport, Government Issued Id or Driving
                                                License, Masked Credit Card Details. Non-personal information
                                                includes Check-in and Check-out Dates and booking service or
                                                related information such as about your stay or hospitality,
                                                travelling or other preferences including special needs or
                                                medical conditions, location data and your general product and
                                                service preferences. The legal basis for the processing of
                                                personal data is performance of a contract.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>3.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                Each party shall ensure compliance with the legal provisions
                                                of the GDPR, particularly in regards to the lawfulness of data
                                                processing under joint controllership. The parties shall take
                                                all necessary technical and organisational measures to ensure
                                                that the rights of data subjects, in particular those pursuant
                                                to Articles 12 to 22 GDPR, are guaranteed at all times within
                                                the statutory time limits.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>4.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                (1) The Parties shall store personal data in a structured,
                                                commonly used, and machine-readable format. (2) The Hotel
                                                shall ensure that only personal data which are strictly
                                                necessary for the legitimate conduct of the process are
                                                collected and for which the purposes and means of processing
                                                are specified by Union or national law". Moreover, both
                                                contracting parties agree to observe the principle of data
                                                minimisation within the meaning of Article 5 (1) lit. c) GDPR.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>5.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                The Parties commit themselves to provide the data subject with
                                                any information referred to in Articles 13 and 14 of the GDPR
                                                in a concise, transparent, intelligible, and easily accessible
                                                form, using clear and plain language. The information shall be
                                                provided free of charge. The Parties agree that{' '}
                                                {this.state.chainData.data.name} LTD provides the information
                                                on the processing of personal data in the operating range of
                                                its “{this.state.chainData.data.name}” application and the
                                                Hotel provides the information on the processing of personal
                                                data in the operating range of its Hotel services.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>6.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                The data subject may exercise his or her rights under Articles
                                                15 to 22 GDPR against each of the joint controllers. In
                                                principle, the data subject may receive the requested
                                                information from the contracting party to whom the request was
                                                made
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>7.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                (1) {this.state.chainData.data.name} LTD and the Hotel shall
                                                provide the data subject access according to Article 15 of the
                                                GDPR. (2) Where the data subject requests access according to
                                                Article 15 GDPR, the parties shall provide this information.
                                                If necessary, the parties shall provide each other with the
                                                necessary information from their respective operating range.
                                                Competent contact persons for the parties are
                                                contact@servrhotels.com. Each party must immediately inform
                                                the other of any change of the contact person.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>8.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                (1) If a data subject exercises his or her rights against one
                                                of the parties, in particular of the rights of access,
                                                correction, or deletion of his or her personal data, the
                                                parties are obliged to forward this request to the other party
                                                without undue delay. This applies irrespective of the general
                                                obligation to guarantee the right of data subjects. The party
                                                receiving the request must immediately provide the information
                                                within its operating range to the requesting party. (2) If
                                                personal data are to be deleted, the parties shall inform each
                                                other in advance. A party may object to the deletion for a
                                                legitimate interest, for example, if there is a legal
                                                obligation to retain the data set for deletion.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>9.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                The parties shall inform each other immediately if they notice
                                                errors or infringements regarding data protection provisions
                                                during the examination of the processing activities.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>10.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                The parties undertake to communicate the essential content of
                                                the joint controllership agreement to the data subjects
                                                (Article 26 (2) GDPR).
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>11.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                Both parties are obliged to inform the supervisory authority
                                                and the data subjects affected by a violation of the
                                                protection of personal data in accordance with Articles 33 and
                                                34 GDPR concerning all operating ranges. The parties shall
                                                inform each other about any such notification to the
                                                supervisory authority without undue delay. The parties also
                                                agree to forward the information required for the notification
                                                to one another without undue delay.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>12.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                If a data protection impact assessment pursuant to Article 35
                                                GDPR is required, the parties shall support each other.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>13.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                Documentations within the meaning of Article 5 (2) GDPR, which
                                                serve as proof of proper data processing, shall be archived by
                                                each party beyond the end of the contract in accordance with
                                                legal provisions and obligations
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>14.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                (1) Within their operating range, the parties shall ensure
                                                that all employees authorised to process the personal data
                                                have committed themselves to confidentiality or are under an
                                                appropriate statutory obligation of confidentiality in
                                                accordance with Articles 28 (3), 29, and 32 GDPR for the
                                                duration of their employment, as well as after termination of
                                                their employment. The parties shall also ensure that they
                                                observe the data secrecy provisions prior to taking up their
                                                duties and are familiarised with the data protection
                                                legislation and rules relevant to them. (2) The parties shall
                                                independently ensure that they are able to comply with all
                                                existing storage obligations with regard to the data. For this
                                                purpose, they must implement appropriate technical and
                                                organisational measures (Article 32 et seq. GDPR). This
                                                applies particularly in the case of termination of the
                                                cooperation/agreement. (3) The implementation,
                                                default-setting, and operation of the systems shall be carried
                                                out in compliance with the requirements of the GDPR and other
                                                regulations. In particular, compliance with the principles of
                                                data protection by design and data protection by default will
                                                be achieved through the implementation of appropriate
                                                technological and organisational measures corresponding to the
                                                state of the art. (4) The parties agree to store personal data
                                                which are processed on the “{this.state.chainData.data.name}”
                                                application in the course of the services on specially
                                                protected servers.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>15.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                Each party undertakes to conclude a contract pursuant to
                                                Article 28 GDPR with regard to the processing of the personal
                                                data for which the party is responsible.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>16.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                (1) The parties commit themselves to conclude a contract in
                                                accordance with Article 28 GDPR when engaging processors
                                                within the scope of this agreement (see § 1) and to obtain the
                                                written consent of the other party before concluding the
                                                contract. (2) The parties shall inform each other in a timely
                                                manner of any intended change with regard to the involvement
                                                or replacement of subcontracted processors. The parties shall
                                                only commission subcontractors who meet the requirements of
                                                data protection legislation and the provisions of this
                                                agreement. Services which the contracting parties use from
                                                third parties to support the execution of the contract, such
                                                as telecommunications services and maintenance, shall not be
                                                seen as services provided by subcontractors within the meaning
                                                of this contract. However, the parties are obligated to make
                                                appropriate contractual agreements in accordance with the law
                                                and to take controlling measures to guarantee the protection
                                                and security of personal data, even in the case of additional
                                                third party services. (3) Only processors who are subject to
                                                the legal obligation to appoint a data protection officer
                                                shall be commissioned to perform services in connection with
                                                this contract.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>17.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                The parties shall include the processing operations in the
                                                records of processing activities pursuant to Article 30 (1)
                                                GDPR, in particular, with a comment on the nature of the
                                                processing operation as one of joint or sole responsibility.
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: heightPercentageToDP(2),
                                            }}
                                        >
                                            <H2>18.</H2>
                                            <H3
                                                marginLeft={widthPercentageToDP(2)}
                                                width={widthPercentageToDP(82)}
                                            >
                                                Notwithstanding the provisions of this contract, the parties
                                                shall be liable for damages resulting from processing that
                                                fails to comply with the GDPR. In external relations they are
                                                jointly liable to the persons concerned. In the internal
                                                relationship the parties are liable, notwithstanding the
                                                provisions of this contract, only for damages which have
                                                arisen within their operating range.
                                            </H3>
                                        </View>
                                        <View style={{ height: heightPercentageToDP(10) }} />
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </KeyboardAvoidingView>
            );
        } else
            return (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <ViewAnimatable
                            animation="fadeInLeft"
                            useNativeDriver
                            duration={300}
                            delay={150}
                            style={styles.number_guest_check_in_container}
                        >
                            <DropDownPicker
                                items={[
                                    { label: 'English', value: 'english' },
                                    { label: 'Spanish', value: 'spanish' },
                                    { label: 'French', value: 'french' },
                                    { label: 'Russian', value: 'russian' },
                                    { label: 'Portugese', value: 'portugese' },
                                    { label: 'Chinese', value: 'chinese' },
                                    { label: 'Italian', value: 'italian' },
                                    { label: 'Hebrew', value: 'hebrew' },
                                    { label: 'Arabic', value: 'arabic' },
                                    { label: 'Indonesian', value: 'indonesian' },
                                    { label: 'Dutch', value: 'dutch' },
                                    { label: 'German', value: 'german' },
                                    { label: 'Japanese', value: 'japanese' },
                                ]}
                                // containerStyle={{width: wp(150), height: hp(70)}}
                                // // dropDownStyle={{backgroundColor: '#fafafa', height: hp(30), width: wp(50)}}
                                defaultValue={this.state.country}
                                labelStyle={{ color: colors.DUMMY_COLOR }}
                                activeLabelStyle={{ color: colors.DUMMY_COLOR }}
                                containerStyle={{ height: scale.h(40), width: scale.w(120) }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: scale.w(120),
                                    height: scale.w(50),
                                    borderWidth: 1,
                                    borderColor: colors.GREY,
                                    borderRadius: scale.w(8),
                                    backgroundColor: colors.WHITE,
                                    alignSelf: 'center',
                                    marginHorizontal: scale.w(10),
                                }}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                    color: colors.DUMMY_COLOR,
                                }}
                                dropDownStyle={{ backgroundColor: colors.WHITE }}
                                onChangeItem={async (item) => {
                                    await this.setState({
                                        country: item.value,
                                    });
                                    if (this.state.country == 'english') {
                                        await this.props.selectLanguage(languages.english);
                                    } else if (this.state.country == 'spanish') {
                                        await this.props.selectLanguage(languages.spanish);
                                    } else if (this.state.country == 'french') {
                                        await this.props.selectLanguage(languages.french);
                                    } else if (this.state.country == 'russian') {
                                        await this.props.selectLanguage(languages.russian);
                                    } else if (this.state.country == 'chinese') {
                                        await this.props.selectLanguage(languages.chinese);
                                    } else if (this.state.country == 'italian') {
                                        await this.props.selectLanguage(languages.italian);
                                    } else if (this.state.country == 'hebrew') {
                                        await this.props.selectLanguage(languages.hebrew);
                                    } else if (this.state.country == 'arabic') {
                                        await this.props.selectLanguage(languages.arabic);
                                    } else if (this.state.country == 'indonesian') {
                                        await this.props.selectLanguage(languages.indonesian);
                                    } else if (this.state.country == 'dutch') {
                                        await this.props.selectLanguage(languages.dutch);
                                    } else if (this.state.country == 'german') {
                                        await this.props.selectLanguage(languages.german);
                                    } else if (this.state.country == 'japanese') {
                                        await this.props.selectLanguage(languages.japanese);
                                    } else if (this.state.country == 'portugese') {
                                        await this.props.selectLanguage(languages.portugese);
                                    }
                                }}
                            />
                            <Separator height={15} />

                            {this.props.isCheckedIn == true ? (
                                <>
                                    <View style={{ height: scale.h(50) }}>
                                        <H3 fontSize={scale.w(1.8)} textAlign="center">
                                            {room_number}
                                            {':'}
                                        </H3>
                                        <Separator height={15} />
                                        <View style={styles.room_number_view}>
                                            <H2>{room_Number}</H2>
                                        </View>
                                    </View>
                                    <Separator height={60} />
                                </>
                            ) : null}

                            <H3 fontSize={scale.w(1.8)} textAlign="center">
                                {guest_checking_in}
                                {':'}
                            </H3>

                            <Separator height={15} />

                            {!this.props.isCheckedIn && (
                                <View style={{ height: scale.h(80) }}>
                                    <Carousel
                                        data={listNumberGuest}
                                        renderItem={this._renderScrollNumber}
                                        sliderWidth={scale.w(250)}
                                        itemWidth={scale.w(70)}
                                        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                                            this._onScroll(e.nativeEvent.contentOffset.x);
                                        }}
                                    />
                                </View>
                            )}

                            <Separator height={5} />

                            <FlatList
                                data={listavatar}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                                showsHorizontalScrollIndicator={false}
                                ListHeaderComponent={() => <View style={{ width: scale.w(8) }} />}
                                ListFooterComponent={() => <View style={{ width: scale.w(20) }} />}
                                renderItem={this._renderPhotoPicker}
                            />
                        </ViewAnimatable>

                        <View style={{ height: scale.w(20) }} />

                        <ViewAnimatable animation="fadeInUp" useNativeDriver duration={300} delay={150}>
                            <TouchableOpacity
                                onPress={debounce(this._handleModalDatePicker(false, true), 1000, {
                                    leading: true,
                                    trailing: false,
                                })}
                                disabled={this.props.isCheckedIn}
                                activeOpacity={0.7}
                            >
                                <FieldForm
                                    label={arrival_date + ':'}
                                    value={
                                        arrivalDate === '' ? 'DD/MM/YY' : format(arrivalDate, 'DD/MM/YYYY')
                                    }
                                    isEmpty={arrivalDate === ''}
                                    textOnly
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={debounce(this._handleModalDatePicker(false, false), 1000, {
                                    leading: true,
                                    trailing: false,
                                })}
                                disabled={this.props.isCheckedIn}
                                activeOpacity={0.7}
                            >
                                <FieldForm
                                    label={departured_date + ':'}
                                    value={
                                        departureDate === ''
                                            ? 'DD/MM/YY'
                                            : format(departureDate, 'DD/MM/YYYY')
                                    }
                                    isEmpty={departureDate === ''}
                                    textOnly
                                />
                            </TouchableOpacity>

                            {!this.props.isCheckedIn && (
                                <View style={{ paddingHorizontal: scale.w(40), marginVertical: scale.w(20) }}>
                                    <ButtonSecondary
                                        fontSize={scale.w(1.6)}
                                        height={scale.w(42)}
                                        text={scan_credit_card}
                                        onPress={() => this._handleMessageScanCC(true)}
                                    />
                                </View>
                            )}

                            <FieldForm
                                label={cardholder_name + ':'}
                                placeholder="Name"
                                value={cardName}
                                onChangeText={(cardName) => this.setState({ cardName })}
                                editable={!this.props.isCheckedIn}
                            />

                            <FieldFormWithMask
                                type="datetime"
                                options={{ format: 'MM/YY' }}
                                label={card_expiry_date + ':'}
                                placeholder="MM/YY"
                                value={cardExpiryDate}
                                maxLength={5}
                                onChangeText={(cardExpiryDate) => this.setState({ cardExpiryDate })}
                                editable={!this.props.isCheckedIn}
                            />

                            <FieldForm
                                label={card_address + ':'}
                                placeholder="Address"
                                value={cardAddress}
                                multiline={true}
                                onChangeText={(cardAddress) => this.setState({ cardAddress })}
                                editable={!this.props.isCheckedIn}
                            />

                            <FieldForm
                                label={booking_referance + ':'}
                                placeholder="No."
                                value={reference}
                                onChangeText={(reference) => this.setState({ reference })}
                                editable={!this.props.isCheckedIn}
                                autoCapitalize="none"
                            />

                            <FieldForm
                                label={check_in_comments + ':'}
                                placeholder="Comments"
                                value={note_request}
                                multiline={true}
                                onChangeText={(note_request) => this.setState({ note_request })}
                                editable={!this.props.isCheckedIn}
                                autoCapitalize="none"
                            />

                            <FieldFormWithMask
                                type="custom"
                                options={{ mask: '+9999 999 999 999' }}
                                label={phone_number + ':'}
                                placeholder="No."
                                keyboardType="phone-pad"
                                maxLength={18}
                                value={phoneNumber}
                                onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                                editable={!this.props.isCheckedIn}
                            />
                            <FieldForm
                                label={`${this.props.selectedLanguage.email} ` + ':'}
                                placeholder={enter_your_email}
                                value={email}
                                multiline={true}
                                onChangeText={(email) => this.setState({ email: email.trim() })}
                                editable={!this.props.profile.already_checked_in && !this.props.isCheckedIn}
                            />
                            {!this.props.profile.already_checked_in && !this.props.isCheckedIn && (
                                <FieldForm
                                    label={`${choose_a_password} ` + ':'}
                                    placeholder={this.props.selectedLanguage?.minimum_six_characters}
                                    secureTextEntry={true}
                                    value={password}
                                    onChangeText={(password) => this.setState({ password })}
                                    editable={!this.props.isCheckedIn}
                                />
                            )}
                            {!this.props.profile.already_checked_in && !this.props.isCheckedIn && (
                                <FieldForm
                                    label={`${confirm_password} ` + ':'}
                                    placeholder={this.props.selectedLanguage?.re_enter_your_password}
                                    secureTextEntry={true}
                                    value={confirmPassword}
                                    onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                                    editable={!this.props.isCheckedIn}
                                />
                            )}

                            {!this.props.isCheckedIn && (
                                <View
                                    style={{
                                        paddingHorizontal: scale.w(40),
                                        flexDirection: 'row',
                                        marginTop: scale.w(40),
                                        marginBottom: scale.w(30),
                                        justifyContent: 'space-between',
                                        height: scale.h(50),
                                    }}
                                >
                                    <View>
                                        <H4 fontSize={scale.w(1.8)}>{extra_bed}</H4>
                                    </View>
                                    <View>
                                        <SwitchToggle
                                            containerStyle={{
                                                marginTop: scale.h(5),
                                                width: scale.w(50),
                                                height: scale.h(30),
                                                borderRadius: scale.h(25),
                                                padding: 5,
                                            }}
                                            backgroundColorOn={colors.GREY}
                                            backgroundColorOff="#e5e1e0"
                                            circleStyle={{
                                                width: scale.h(25),
                                                height: scale.h(25),
                                                borderRadius: scale.h(15),
                                                backgroundColor: 'blue', // rgb(102,134,205)
                                            }}
                                            switchOn={extra_bed_request}
                                            onPress={() => {
                                                this.setState({
                                                    extra_bed_request: !extra_bed_request,
                                                });
                                            }}
                                            circleColorOff="#4B4B4B"
                                            circleColorOn="#fff"
                                            // duration={500}
                                        />
                                    </View>
                                </View>
                            )}

                            <View
                                style={[
                                    { paddingHorizontal: scale.w(40) },
                                    this.props.isCheckedIn ? { marginBottom: scale.h(30) } : {},
                                ]}
                            >
                                <H4 fontSize={scale.w(1.8)}>{signature}</H4>
                                <TouchableOpacity
                                    disabled={this.props.isCheckedIn}
                                    onPress={() => {
                                        this.setModalVisible(true);
                                    }}
                                    activeOpacity={1}
                                    style={{
                                        width: scale.w(285),
                                        height: scale.w(150),
                                        marginHorizontal: scale.w(25),
                                        borderRadius: scale.w(20),
                                        backgroundColor: '#fff',
                                        alignSelf: 'center',
                                        marginTop: scale.w(10),
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
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
                                    {this.state.signature_photo.name ? (
                                        <Image
                                            resizeMode="contain"
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                            }}
                                            source={{ uri: this.state.signature_photo.uri }}
                                        />
                                    ) : (
                                        <Text>{tab_to_add_signature}</Text>
                                    )}
                                </TouchableOpacity>
                                {!this.props.isCheckedIn &&
                                    (this.state.signature_photo ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    signature_photo: '',
                                                });
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Light',
                                                    fontSize: scale.w(1.4),
                                                    color: '#2E91EE',
                                                    textDecorationLine: 'underline',
                                                    alignSelf: 'flex-end',
                                                    marginTop: scale.w(10),
                                                }}
                                            >
                                                {clear}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View />
                                    ))}
                            </View>
                            {!this.props.isCheckedIn && (
                                <View
                                    style={{
                                        paddingHorizontal: scale.w(40),
                                        flexDirection: 'row',
                                        marginTop: scale.w(40),
                                        marginBottom: scale.w(30),
                                    }}
                                >
                                    <View
                                        style={{
                                            width: scale.w(280),
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: scale.w(145),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto-Light',
                                                    fontSize: scale.w(1.4),
                                                    marginTop: scale.w(10),
                                                }}
                                            >
                                                {`${i_agree_with_all} `}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                width: scale.w(135),
                                                alignItems: 'center',
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    // Linking.openURL(
                                                    //     'https://docs.google.com/document/d/1EUCILR4Hhf_eDX0usUNcdEdf3XQHStCHErVxMoF8dn8/edit?usp=sharing',
                                                    // );
                                                    this.setState({
                                                        terms_and_condition_modal: true,
                                                    });
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'Roboto-Light',
                                                        fontSize: 14,
                                                        color: '#2E91EE',
                                                        textDecorationLine: 'underline',
                                                        // alignSelf: 'flex-end',
                                                        marginTop: scale.w(10),
                                                    }}
                                                >
                                                    {terms_and_condition}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            width: scale.w(20),
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingTop: scale.h(20),
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={this.toggleTerms}
                                            style={[
                                                {
                                                    width: scale.w(20),
                                                    height: scale.w(20),
                                                    borderColor: '#C1C8E4',
                                                    borderWidth: 1,
                                                    alignSelf: 'flex-end',
                                                    marginLeft: scale.w(50),
                                                    padding: scale.w(2),
                                                    borderRadius: scale.w(5),
                                                    backgroundColor: 'pink',
                                                },
                                                this.state.terms_and_condition
                                                    ? {
                                                          backgroundColor:
                                                              this.props.color !== ''
                                                                  ? this.props.color
                                                                  : colors.BLUE,
                                                      }
                                                    : { backgroundColor: 'white' },
                                            ]}
                                        ></TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </ViewAnimatable>
                        {console.log(
                            'colorrr==========================================================',
                            this.props.color,
                        )}
                        {!this.props.isCheckedIn ||
                            this.state.bookingFound(
                                <View style={styles.btn_primary_container}>
                                    <ButtonPrimary
                                        backgroundColor={
                                            this.props.color !== '' ? this.props.color : colors.BLUE
                                        }
                                        onPress={this._handleSubmit}
                                        loading={loading}
                                        disabled={loading}
                                        fontSize={scale.w(1.65)}
                                        text={confirm_check_in}
                                        chainData={this.props.chainData}
                                    />
                                </View>,
                            )}

                        <CustomModal ref={this._modalDatePicker}>
                            <ModalDatePicker
                                date={isArrivalDate ? new Date(arrivalDate) : new Date(departureDate)}
                                minimumDate={new Date()}
                                onDateChange={this._onChangeDate}
                                showModal={this._handleModalDatePicker(isArrivalDate, true)}
                                title={`Pick your ${isArrivalDate ? 'arrival' : 'departure'} date`}
                                color={this.props.color !== '' ? this.props.color : undefined}
                                chainData={this.props.chainData}
                            />
                        </CustomModal>

                        <CustomModal
                            ref={this._modalManualData}
                            style={{
                                height: hp(100),
                                width: wp(100),
                                backgroundColor: colors.BLUE,
                                margin: -1,
                            }}
                            chainData={this.props.chainData}
                        >
                            {/* <ImageBackground style={{height : hp(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                            {/* <View style={{height : hp(6)}} /> */}
                            <View style={{ height: hp(15), width: wp(100) }}>
                                <Navbar
                                    tintBackColor={colors.WHITE}
                                    titleColor={colors.WHITE}
                                    onSearchClick={() => console.log('clicked')}
                                    onClickRight={() => console.log('clicked')}
                                    onClick={() => this._modalManualData.current?.hide()}
                                    title={'Enter Card Details'}
                                />
                            </View>
                            {/* </ImageBackground> */}
                            <View
                                style={{
                                    height: hp(87),
                                    width: wp(100),
                                    backgroundColor: colors.WHITE,
                                    borderTopLeftRadius: 30,
                                    borderTopRightRadius: 30,
                                }}
                            >
                                <View style={{ height: hp(3) }} />
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View
                                        style={{
                                            paddingVertical: hp(2),
                                            paddingHorizontal: wp(5),
                                            backgroundColor: '#FFFFFF',
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View>
                                                <Text style={{ fontSize: scale.w(1.8), fontWeight: 'bold' }}>
                                                    Card Details
                                                </Text>
                                                <Text style={{ fontSize: scale.w(1.4), color: colors.GREY }}>
                                                    Scan your credit card
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this._modalManualData.current?.hide();
                                                    this._handleScanCC();
                                                }}
                                                style={{
                                                    height: 50,
                                                    width: 50,
                                                    borderRadius: 100,
                                                    backgroundColor: colors.BLUE,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Icon
                                                    name={'scan-helper'}
                                                    size={22}
                                                    color={colors.WHITE}
                                                ></Icon>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: hp(5) }}>
                                            <Text style={{ fontWeight: 'bold', marginLeft: 5, opacity: 0.6 }}>
                                                Cardholder name
                                            </Text>
                                            <TextInput
                                                placeholder={'Card Holder Name'}
                                                onChangeText={(val) =>
                                                    this.setState({ cardholderNameTemp: val })
                                                }
                                                style={{
                                                    fontSize: scale.w(1.4),
                                                }}
                                            ></TextInput>
                                        </View>
                                        <View style={{ height: 1, backgroundColor: colors.LIGHT_GREY }} />

                                        <View style={{ marginTop: hp(2) }}>
                                            <Text style={{ fontWeight: 'bold', marginLeft: 5, opacity: 0.6 }}>
                                                Card Number
                                            </Text>
                                            <TextInputMask
                                                type={'credit-card'}
                                                options={{
                                                    obfuscated: false,
                                                    issuer: 'visa-or-mastercard',
                                                }}
                                                value={this.state.cardNumber}
                                                style={{ width: '100%', fontSize: scale.w(1.6) }}
                                                placeholder={'Card Number'}
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        cardNumberTemp: text,
                                                    });
                                                }}
                                            />
                                        </View>
                                        <View style={{ height: 1, backgroundColor: colors.LIGHT_GREY }} />
                                        <View style={{ marginTop: hp(2) }}>
                                            <Text style={{ fontWeight: 'bold', marginLeft: 5, opacity: 0.6 }}>
                                                Card Address
                                            </Text>
                                            <TextInput
                                                style={{ width: '100%', fontSize: scale.w(1.6) }}
                                                placeholder={'Card Address'}
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        cardAddressTemp: text,
                                                    });
                                                }}
                                            />
                                        </View>
                                        <View style={{ height: 1, backgroundColor: colors.LIGHT_GREY }} />

                                        <View
                                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                                        >
                                            <View style={{ marginTop: hp(2) }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        marginLeft: 5,
                                                        opacity: 0.6,
                                                    }}
                                                >
                                                    Expiry date
                                                </Text>
                                                <TextInputMask
                                                    type={'datetime'}
                                                    options={{
                                                        format: 'MM/YY',
                                                    }}
                                                    value={this.state.cardExpiryDate}
                                                    style={{ width: wp(40) }}
                                                    placeholder={'MM/YY'}
                                                    onChangeText={(text) => {
                                                        this.setState({
                                                            expiryDateTemp: text,
                                                        });
                                                    }}
                                                />
                                                <View
                                                    style={{ height: 1, backgroundColor: colors.LIGHT_GREY }}
                                                />
                                            </View>
                                            <View style={{ marginTop: hp(2) }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        marginLeft: 5,
                                                        opacity: 0.6,
                                                    }}
                                                >
                                                    CVV
                                                </Text>
                                                <TextInput
                                                    style={{ width: wp(40) }}
                                                    placeholder={'***'}
                                                    secureTextEntry={true}
                                                    keyboardType={'numeric'}
                                                    onChangeText={(text) => {
                                                        this.setState({
                                                            cvvTemp: text,
                                                        });
                                                    }}
                                                />
                                                <View
                                                    style={{ height: 1, backgroundColor: colors.LIGHT_GREY }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ height: hp(10) }} />
                                        <ButtonPrimary
                                            onPress={this._handleProcced}
                                            backgroundColor={colors.BLUE}
                                            fontSize={scale.w(1.65)}
                                            text={this.props.selectedLanguage.proceed}
                                            chainData={this.props.chainData}
                                        />
                                    </View>
                                    <View style={{ height: hp(10) }} />
                                </ScrollView>
                            </View>
                        </CustomModal>

                        <CustomModal ref={this._modalImagePicker}>
                            <ModalSelectPhoto
                                openCamera={this._openCamera}
                                openLibrary={this._openLibrary}
                                selectedLanguage={this.props.selectedLanguage}
                            />
                        </CustomModal>

                        <CustomModal ref={this._modalMessageScanCC}>
                            <ModalMessageScanCC
                                color={this.props.color !== '' ? this.props.color : colors.BLUE}
                                handleMessageScanCC={() => this._handleMessageScanCC(false)}
                                selectedLanguage={this.props.selectedLanguage}
                                chainData={this.props.chainData}
                            />
                        </CustomModal>
                    </ScrollView>
                    <CustomModal ref={this._modalDatePicker}>
                        <ModalDatePicker
                            date={
                                arrivalDate == '' && departureDate == ''
                                    ? new Date(tempDate)
                                    : arrivalDate != '' && departureDate == ''
                                    ? new Date(arrivalDate)
                                    : arrivalDate == '' && departureDate != ''
                                    ? new Date(departureDate)
                                    : arrivalDate != '' && departureDate != ''
                                    ? new Date(tempDate)
                                    : new Date(arrivalDate)
                            }
                            minimumDate={
                                this.state.selectArrivalDate
                                    ? new Date()
                                    : this.state.arrivalDate != ''
                                    ? new Date(this.state.arrivalDate)
                                    : new Date()
                            }
                            onDateChange={this._onChangeDate}
                            showModal={this._handleShowModal(isArrivalDate, true)}
                            title={`${pick_your} ${
                                this.state.selectArrivalDate ? `${arrival_date}` : `${departured_date}`
                            }`}
                            color={this.props.PrimaryColor == '' ? colors.BLUE : this.props.PrimaryColor}
                            otherText={{ date: date, month: month, year: year, ok: ok }}
                            chainData={this.props.chainData}
                        />
                    </CustomModal>
                    <Modal
                        backdropOpacity={0.7}
                        isVisible={this.state.modalVisible}
                        onBackdropPress={() => {
                            this.setModalVisible(false);
                        }}
                    >
                        <TouchableHighlight
                            onPress={() => {
                                this.setModalVisible(false);
                            }}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                paddingHorizontal: wp(2),
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    height: heightPercentageToDP(20),
                                    width: widthPercentageToDP(90),
                                    backgroundColor: '#fff',
                                    borderRadius: scale.w(20),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <TouchableHighlight>
                                    <ViewShot
                                        ref={(ref) => {
                                            this.viewRef = ref;
                                        }}
                                        options={{ format: 'png', quality: 0.9 }}
                                        captureMode="none"
                                    >
                                        <SignatureCapture
                                            style={{
                                                height: scale.w(240),
                                                width: scale.w(340),
                                            }}
                                            ref={this.sign}
                                            onDragEvent={this._onDragEvent}
                                            showNativeButtons={false}
                                            showTitleLabel={false}
                                            viewMode={'portrait'}
                                        />
                                    </ViewShot>
                                </TouchableHighlight>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: scale.w(10),
                                    }}
                                >
                                    <View
                                        style={{
                                            width: '50%',
                                            paddingHorizontal: scale.w(10),
                                        }}
                                    >
                                        <ButtonPrimary
                                            backgroundColor={
                                                this.props.color !== '' ? this.props.color : colors.BLUE
                                            }
                                            onPress={this.resetSign}
                                            loading={false}
                                            disabled={false}
                                            fontSize={scale.w(1.65)}
                                            text={clear_signature}
                                            chainData={this.props.chainData}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            width: '50%',
                                            paddingHorizontal: scale.w(10),
                                        }}
                                    >
                                        <ButtonPrimary
                                            backgroundColor={
                                                this.props.color !== '' ? this.props.color : colors.BLUE
                                            }
                                            onPress={this.onCapture}
                                            loading={false}
                                            disabled={false}
                                            fontSize={scale.w(1.65)}
                                            text={save_signature}
                                            chainData={this.props.chainData}
                                        />
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </Modal>

                    <Modal
                        backdropOpacity={0.7}
                        isVisible={this.state.terms_and_condition_modal}
                        onBackdropPress={() => {
                            this.setState({
                                terms_and_condition_modal: false,
                            });
                        }}
                        onBackButtonPress={() => {
                            this.setState({
                                terms_and_condition_modal: false,
                            });
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
                                    width: scale.w(350),
                                    height: scale.w(500),
                                    backgroundColor: '#fff',
                                    borderRadius: scale.w(20),
                                    // alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: scale.w(20),
                                    paddingTop: scale.h(20),
                                    paddingBottom: scale.h(20),
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: 'flex-end',
                                        // justifyContent:'center',
                                        height: scale.h(30),
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            height: scale.h(30),
                                            width: scale.h(30),
                                            borderRadius: scale.h(15),
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                terms_and_condition_modal: false,
                                            });
                                        }}
                                    >
                                        <Icons color="red" size={18} name={'times-circle'} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView>
                                    <H2 marginTop={scale.h(10)}>1. Terms</H2>
                                    <H3>
                                        By accessing the website and application at http://servrhotels.com or
                                        using our application “Servr,” you are agreeing to be bound by these
                                        terms of service, all applicable laws, and regulations, and agree that
                                        you are responsible for compliance with any applicable local laws. If
                                        you do not agree with any of these terms, you are prohibited from
                                        using or accessing this site. The materials contained in this website
                                        and application are protected by applicable copyright and trademark
                                        law.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>2. Use License</H2>
                                    <View
                                        style={{
                                            paddingLeft: scale.w(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <H3>1.</H3>
                                            <H3>
                                                Permission is granted to temporarily download one copy of the
                                                materials (information or software) on{' '}
                                                {this.state.chainData.data.name} LTD.'s website and
                                                application for personal, non-commercial transitory viewing
                                                only. This is the grant of a license, not a transfer of title,
                                                and under this license, you may not:
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3 marginLeft={25}>1.</H3>
                                            <H3>modify or copy the materials;</H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3 marginLeft={25}>2.</H3>
                                            <H3>
                                                use the materials for any commercial purpose, or for any
                                                public display (commercial or non-commercial);
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3 marginLeft={25}>3.</H3>
                                            <H3>
                                                attempt to decompile or reverse engineer any software
                                                contained on {this.state.chainData.data.name} LTD.'s website
                                                and application or application;
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3 marginLeft={25}>4.</H3>
                                            <H3>
                                                remove any copyright or other proprietary notations from the
                                                materials; or
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3 marginLeft={25}>5.</H3>
                                            <H3>
                                                transfer the materials to another person or "mirror" the
                                                materials on any other server.
                                            </H3>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <H3>2.</H3>
                                            <H3>
                                                This license shall automatically terminate if you violate any
                                                of these restrictions and may be terminated by{' '}
                                                {this.state.chainData.data.name} LTD. at any time. Upon
                                                terminating your viewing of these materials or upon the
                                                termination of this license, you must destroy any downloaded
                                                materials in your possession whether in electronic or printed
                                                format.
                                            </H3>
                                        </View>
                                    </View>

                                    <H2 marginTop={scale.h(10)}>3. Disclaimer</H2>
                                    <View
                                        style={{
                                            paddingLeft: scale.w(10),
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            <H3>1.</H3>
                                            <H3>
                                                The materials on {this.state.chainData.data.name} LTD.'s
                                                website and application and application are provided on an 'as
                                                is' basis. {this.state.chainData.data.name} LTD. makes no
                                                warranties, expressed or implied, and hereby disclaims and
                                                negates all other warranties including, without limitation,
                                                implied warranties or conditions of merchantability, fitness
                                                for a particular purpose, or non-infringement of intellectual
                                                property or other violation of rights.
                                            </H3>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <H3>2.</H3>
                                            <H3>
                                                Further, {this.state.chainData.data.name} LTD. does not
                                                warrant or make any representations concerning the accuracy,
                                                likely results, or reliability of the use of the materials on
                                                its website and application or otherwise relating to such
                                                materials or on any sites linked to this site.
                                            </H3>
                                        </View>
                                    </View>

                                    <H2 marginTop={scale.h(10)}>4. Limitations</H2>
                                    <H3>
                                        In no event shall {this.state.chainData.data.name} LTD. or its
                                        suppliers be liable for any damages (including, without limitation,
                                        damages for loss of data or profit, or due to business interruption)
                                        arising out of the use or inability to use the materials on{' '}
                                        {this.state.chainData.data.name} LTD.'s website and application and
                                        application, even if {this.state.chainData.data.name} LTD. or a{' '}
                                        {this.state.chainData.data.name} LTD. authorized representative has
                                        been notified orally or in writing of the possibility of such damage.
                                        Because some jurisdictions do not allow limitations on implied
                                        warranties, or limitations of liability for consequential or
                                        incidental damages, these limitations may not apply to you.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>5. Accuracy of materials</H2>
                                    <H3>
                                        The materials appearing on {this.state.chainData.data.name} LTD.'s
                                        website and application could include technical, typographical, or
                                        photographic errors. {this.state.chainData.data.name} LTD. does not
                                        warrant that any of the materials on its website and application are
                                        accurate, complete, or current. {this.state.chainData.data.name} LTD.
                                        may make changes to the materials contained on its website and
                                        application at any time without notice. However{' '}
                                        {this.state.chainData.data.name} LTD. does not make any commitment to
                                        update the materials.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>6. Links</H2>
                                    <H3>
                                        {this.state.chainData.data.name} LTD. has not reviewed all of the
                                        sites linked to its website and application and is not responsible for
                                        the contents of any such linked site. The inclusion of any link does
                                        not imply endorsement by {this.state.chainData.data.name}
                                        LTD. of the site. The use of any such linked website and application
                                        is at the user's own risk.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>7. Modifications</H2>
                                    <H3>
                                        {this.state.chainData.data.name} LTD. may revise these terms of
                                        service for its website and application at any time without notice. By
                                        using this website and application you are agreeing to be bound by the
                                        then current version of these terms of service.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>8. Governing Law</H2>
                                    <H3>
                                        These terms and conditions are governed by and construed in accordance
                                        with the laws of Hong Kong and you irrevocably submit to the exclusive
                                        jurisdiction of the courts in that State or location.
                                    </H3>

                                    {/* ==============================privacy============================= */}

                                    <H2 marginTop={scale.h(10)}>Privacy Policy</H2>
                                    <H3>
                                        Your privacy is important to us. It is{' '}
                                        {this.state.chainData.data.name} LTD.'s policy to respect your privacy
                                        regarding any information we may collect from you across our website
                                        and application, http://servrhotels.com, and other sites we own and
                                        operate.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>1. Information we collect</H2>
                                    <H4 bold={true} fontSize={scale.w(1.2)} marginTop={5} marginBottom={5}>
                                        Log data
                                    </H4>
                                    <H3>
                                        When you visit our website and application, our servers may
                                        automatically log the standard data provided by your web browser. It
                                        may include your computer’s Internet Protocol (IP) address, your
                                        browser type and version, the pages you visit, the time and date of
                                        your visit, the time spent on each page, and other details.
                                    </H3>

                                    <H4 bold={true} fontSize={scale.w(1.2)} marginTop={5} marginBottom={5}>
                                        Device data
                                    </H4>
                                    <H3>
                                        We may also collect data about the device you’re using to access our
                                        website and application. This data may include the device type,
                                        operating system, unique device identifiers, device settings, and
                                        geo-location data. What we collect can depend on the individual
                                        settings of your device and software. We recommend checking the
                                        policies of your device manufacturer or software provider to learn
                                        what information they make available to us.
                                    </H3>

                                    <H4 bold={true} fontSize={scale.w(1.2)} marginTop={5} marginBottom={5}>
                                        Personal information
                                    </H4>
                                    <H3>We may ask for personal information, such as your:</H3>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>Name</H3>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>Email</H3>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>Social media profiles</H3>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>Date of birth</H3>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>Phone/mobile number</H3>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>Home/Mailing address</H3>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(5),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>website and application address</H3>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(5),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>Payment information</H3>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(5),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>Driver's licence details</H3>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(5),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>Passport number</H3>
                                    </View>

                                    <H4 bold={true} fontSize={scale.w(1.2)} marginTop={5} marginBottom={5}>
                                        Business data
                                    </H4>
                                    <H3>
                                        Business data refers to data that accumulates over the normal course
                                        of operation on our platform. This may include transaction records,
                                        stored files, user profiles, analytics data and other metrics, as well
                                        as other types of information, created or generated, as users interact
                                        with our services.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>2. Legal bases for processing</H2>

                                    <H3>
                                        We will process your personal information lawfully, fairly and in a
                                        transparent manner. We collect and process information about you only
                                        where we have legal bases for doing so. These legal bases depend on
                                        the services you use and how you use them, meaning we collect and use
                                        your information only where:
                                    </H3>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            it’s necessary for the performance of a contract to which you are
                                            a party or to take steps at your request before entering into such
                                            a contract (for example, when we provide a service you request
                                            from us);
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            it satisfies a legitimate interest (which is not overridden by
                                            your data protection interests), such as for research and
                                            development, to market and promote our services, and to protect
                                            our legal rights and interests;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            you give us consent to do so for a specific purpose (for example,
                                            you might consent to us sending you our newsletter); or
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            we need to process your data to comply with a legal obligation.
                                        </H3>
                                    </View>
                                    <H3>
                                        Where you consent to our use of information about you for a specific
                                        purpose, you have the right to change your mind at any time (but this
                                        will not affect any processing that has already taken place). We don’t
                                        keep personal information for longer than is necessary. While we
                                        retain this information, we will protect it within commercially
                                        acceptable means to prevent loss and theft, as well as unauthorized
                                        access, disclosure, copying, use or modification. That said, we advise
                                        that no method of electronic transmission or storage is 100% secure
                                        and cannot guarantee absolute data security. If necessary, we may
                                        retain your personal information for our compliance with a legal
                                        obligation or in order to protect your vital interests or the vital
                                        interests of another natural person.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>3. Collection and use of information</H2>
                                    <H3>
                                        We may collect, hold, use and disclose information for the following
                                        purposes and personal information will not be further processed in a
                                        manner that is incompatible with these purposes:
                                    </H3>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            to provide you with our platform's core features;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            to process any transactional or ongoing payments;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            to enable you to access and use our website and application,
                                            associated applications and associated social media platforms;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>to contact and communicate with you;</H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            for internal record keeping and administrative purposes;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            for analytics, market research and business development, including
                                            to operate and improve our website and application, associated
                                            applications and associated social media platforms;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            for advertising and marketing, including to send you promotional
                                            information about our products and services and information about
                                            third parties that we consider may be of interest to you; and
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            to comply with our legal obligations and resolve any disputes that
                                            we may have.
                                        </H3>
                                    </View>

                                    <H2 marginTop={scale.h(10)}>
                                        4. Disclosure of personal information to third parties
                                    </H2>
                                    <H3>We may disclose personal information to:</H3>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            third party service providers for the purpose of enabling them to
                                            provide their services, including (without limitation) IT service
                                            providers, data storage, hosting and server providers, ad
                                            networks, analytics, error loggers, debt collectors, maintenance
                                            or problem-solving providers, marketing or advertising providers,
                                            professional advisors and payment systems operators;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            our employees, contractors and/or related entities;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            sponsors or promoters of any competition we run;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            credit reporting agencies, courts, tribunals and regulatory
                                            authorities, in the event you fail to pay for goods or services we
                                            have provided to you;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            courts, tribunals, regulatory authorities and law enforcement
                                            officers, as required by law, in connection with any actual or
                                            prospective legal proceedings, or in order to establish, exercise
                                            or defend our legal rights;
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            third parties, including agents or sub-contractors, who assist us
                                            in providing information, products, services or direct marketing
                                            to you; and
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: scale.h(10),
                                                width: scale.h(10),
                                                borderRadius: scale.h(5),
                                                backgroundColor: 'black',
                                                marginLeft: scale.w(10),
                                                marginTop: scale.h(10),
                                            }}
                                        />
                                        <H3 marginLeft={scale.w(10)}>
                                            third parties to collect and process data.
                                        </H3>
                                    </View>

                                    <H2 marginTop={scale.h(10)}>
                                        5. International transfers of personal information
                                    </H2>
                                    <H3>
                                        The personal information we collect is stored and processed where we
                                        or our partners, affiliates and third-party providers maintain
                                        facilities. By providing us with your personal information, you
                                        consent to the disclosure to these overseas third parties. We will
                                        ensure that any transfer of personal information from countries in the
                                        European Economic Area (EEA) to countries outside the EEA will be
                                        protected by appropriate safeguards, for example by using standard
                                        data protection clauses approved by the European Commission, or the
                                        use of binding corporate rules or other legally accepted means. Where
                                        we transfer personal information from a non-EEA country to another
                                        country, you acknowledge that third parties in other jurisdictions may
                                        not be subject to similar data protection laws to the ones in our
                                        jurisdiction. There are risks if any such third party engages in any
                                        act or practice that would contravene the data privacy laws in our
                                        jurisdiction and this might mean that you will not be able to seek
                                        redress under our jurisdiction’s privacy laws.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>
                                        6. Your rights and controlling your personal information
                                    </H2>
                                    <H3>
                                        Choice and consent: By providing personal information to us, you
                                        consent to us collecting, holding, using and disclosing your personal
                                        information in accordance with this privacy policy. If you are under
                                        16 years of age, you must have, and warrant to the extent permitted by
                                        law to us, that you have your parent or legal guardian’s permission to
                                        access and use the website and application and they (your parents or
                                        guardian) have consented to you providing us with your personal
                                        information. You do not have to provide personal information to us,
                                        however, if you do not, it may affect your use of this website and
                                        application or the products and/or services offered on or through it.
                                        Information from third parties: If we receive personal information
                                        about you from a third party, we will protect it as set out in this
                                        privacy policy. If you are a third party providing personal
                                        information about somebody else, you represent and warrant that you
                                        have such person’s consent to provide the personal information to us.
                                        Restrict: You may choose to restrict the collection or use of your
                                        personal information. If you have previously agreed to us using your
                                        personal information for direct marketing purposes, you may change
                                        your mind at any time by contacting us using the details below. If you
                                        ask us to restrict or limit how we process your personal information,
                                        we will let you know how the restriction affects your use of our
                                        website and application or products and services. Access and data
                                        portability: You may request details of the personal information that
                                        we hold about you. You may request a copy of the personal information
                                        we hold about you. Where possible, we will provide this information in
                                        CSV format or other easily readable machine format. You may request
                                        that we erase the personal information we hold about you at any time.
                                        You may also request that we transfer this personal information to
                                        another third party. Correction: If you believe that any information
                                        we hold about you is inaccurate, out of date, incomplete, irrelevant
                                        or misleading, please contact us using the details below. We will take
                                        reasonable steps to correct any information found to be inaccurate,
                                        incomplete, misleading or out of date. Notification of data breaches:
                                        We will comply laws applicable to us in respect of any data breach.
                                        Complaints: If you believe that we have breached a relevant data
                                        protection law and wish to make a complaint, please contact us using
                                        the details below and provide us with full details of the alleged
                                        breach. We will promptly investigate your complaint and respond to
                                        you, in writing, setting out the outcome of our investigation and the
                                        steps we will take to deal with your complaint. You also have the
                                        right to contact a regulatory body or data protection authority in
                                        relation to your complaint. Unsubscribe: To unsubscribe from our
                                        e-mail database or opt-out of communications (including marketing
                                        communications), please contact us using the details below or opt-out
                                        using the opt-out facilities provided in the communication.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>7. Cookies</H2>
                                    <H3>
                                        We use “cookies” to collect information about you and your activity
                                        across our site. A cookie is a small piece of data that our website
                                        and application stores on your computer, and accesses each time you
                                        visit, so we can understand how you use our site. This helps us serve
                                        you content based on preferences you have specified. Please refer to
                                        our Cookie Policy for more information.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>8. Business transfers</H2>
                                    <H3>
                                        If we or our assets are acquired, or in the unlikely event that we go
                                        out of business or enter bankruptcy, we would include data among the
                                        assets transferred to any parties who acquire us. You acknowledge that
                                        such transfers may occur, and that any parties who acquire us may
                                        continue to use your personal information according to this policy.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>9. Limits of our policy</H2>
                                    <H3>
                                        Our website and application may link to external sites that are not
                                        operated by us. Please be aware that we have no control over the
                                        content and policies of those sites, and cannot accept responsibility
                                        or liability for their respective privacy practices.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>10. Changes to this policy</H2>
                                    <H3>
                                        At our discretion, we may change our privacy policy to reflect current
                                        acceptable practices. We will take reasonable steps to let users know
                                        about changes via our website and application. Your continued use of
                                        this site after any changes to this policy will be regarded as
                                        acceptance of our practices around privacy and personal information.
                                        If we make a significant change to this privacy policy, for example
                                        changing a lawful basis on which we process your personal information,
                                        we will ask you to re-consent to the amended privacy policy.
                                    </H3>

                                    <H2 marginTop={scale.h(10)}>11. GDPR Policy</H2>
                                    <H3>
                                        At our discretion, we may change our privacy policy to reflect current
                                        acceptable practices. We will take reasonable steps to let users know
                                        about changes via our website and application. Your continued use of
                                        this site after any changes to this policy will be regarded as
                                        acceptance of our practices around privacy and personal information.
                                        If we make a significant change to this privacy policy, for example
                                        changing a lawful basis on which we process your personal information,
                                        we will ask you to re-consent to the amended privacy policy.
                                    </H3>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>1.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            This agreement determines the rights and obligations of the
                                            controllers (hereinafter also referred to as "parties") for the
                                            joint processing of personal data. It applies to all activities of
                                            the parties, or processors appointed by a party, when processing
                                            personal data. The parties have jointly determined the purposes
                                            and means of processing personal data in accordance with Art. 26
                                            GDPR. (2) The “{this.state.chainData.data.name}” application
                                            processes personal data. Depending on the section of processing,
                                            this data is processed in the Hotel’s and{' '}
                                            {this.state.chainData.data.name} LTD`s system area. The parties
                                            determine the sections in which personal data are processed under
                                            joint controllership (Article 26 GDPR). For the other sections of
                                            processing, where the parties do not jointly determine the
                                            purposes and means of data processing, each contracting party is a
                                            controller pursuant to Article 4 No. 7 GDPR. As far as the
                                            contracting parties are joint controllers pursuant to Article 26
                                            GDPR, it is agreed as follows:
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>2.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            (1) In context of joint controllership,{' '}
                                            {this.state.chainData.data.name} LTD is competent for the
                                            processing of personal data in the operating range of providing
                                            the “{this.state.chainData.data.name}” application and storing the
                                            Personal Data entered by the Hotels’ Guests on network services
                                            provided by “AWS”. The processing may concern the following
                                            categories of data: Personal and non-personal information.
                                            Personal information includes: name, email address, and physical
                                            address, including city and state., Passport, Government Issued Id
                                            or Driving License, Masked Credit Card Details. Non-personal
                                            information includes Check-in and Check-out Dates and booking
                                            service or related information such as about your stay or
                                            hospitality, travelling or other preferences including special
                                            needs or medical conditions, location data and your general
                                            product and service preferences. The legal basis for the
                                            processing of personal data is performance of a contract. (2) In
                                            the context of joint controllership, the Hotel is competent for
                                            the processing of personal data in operating range of providing
                                            general Hotel services and booking features using the “
                                            {this.state.chainData.data.name}” application to its Guests.
                                            Personal and non-personal information. Personal information
                                            includes: name, email address, and physical address, including
                                            city and state., Passport, Government Issued Id or Driving
                                            License, Masked Credit Card Details. Non-personal information
                                            includes Check-in and Check-out Dates and booking service or
                                            related information such as about your stay or hospitality,
                                            travelling or other preferences including special needs or medical
                                            conditions, location data and your general product and service
                                            preferences. The legal basis for the processing of personal data
                                            is performance of a contract.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>3.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            Each party shall ensure compliance with the legal provisions of
                                            the GDPR, particularly in regards to the lawfulness of data
                                            processing under joint controllership. The parties shall take all
                                            necessary technical and organisational measures to ensure that the
                                            rights of data subjects, in particular those pursuant to Articles
                                            12 to 22 GDPR, are guaranteed at all times within the statutory
                                            time limits.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>4.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            (1) The Parties shall store personal data in a structured,
                                            commonly used, and machine-readable format. (2) The Hotel shall
                                            ensure that only personal data which are strictly necessary for
                                            the legitimate conduct of the process are collected and for which
                                            the purposes and means of processing are specified by Union or
                                            national law". Moreover, both contracting parties agree to observe
                                            the principle of data minimisation within the meaning of Article 5
                                            (1) lit. c) GDPR.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>5.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            The Parties commit themselves to provide the data subject with any
                                            information referred to in Articles 13 and 14 of the GDPR in a
                                            concise, transparent, intelligible, and easily accessible form,
                                            using clear and plain language. The information shall be provided
                                            free of charge. The Parties agree that{' '}
                                            {this.state.chainData.data.name} LTD provides the information on
                                            the processing of personal data in the operating range of its “
                                            {this.state.chainData.data.name}” application and the Hotel
                                            provides the information on the processing of personal data in the
                                            operating range of its Hotel services.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>6.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            The data subject may exercise his or her rights under Articles 15
                                            to 22 GDPR against each of the joint controllers. In principle,
                                            the data subject may receive the requested information from the
                                            contracting party to whom the request was made
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>7.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            (1) {this.state.chainData.data.name} LTD and the Hotel shall
                                            provide the data subject access according to Article 15 of the
                                            GDPR. (2) Where the data subject requests access according to
                                            Article 15 GDPR, the parties shall provide this information. If
                                            necessary, the parties shall provide each other with the necessary
                                            information from their respective operating range. Competent
                                            contact persons for the parties are contact@servrhotels.com. Each
                                            party must immediately inform the other of any change of the
                                            contact person.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>8.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            (1) If a data subject exercises his or her rights against one of
                                            the parties, in particular of the rights of access, correction, or
                                            deletion of his or her personal data, the parties are obliged to
                                            forward this request to the other party without undue delay. This
                                            applies irrespective of the general obligation to guarantee the
                                            right of data subjects. The party receiving the request must
                                            immediately provide the information within its operating range to
                                            the requesting party. (2) If personal data are to be deleted, the
                                            parties shall inform each other in advance. A party may object to
                                            the deletion for a legitimate interest, for example, if there is a
                                            legal obligation to retain the data set for deletion.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>9.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            The parties shall inform each other immediately if they notice
                                            errors or infringements regarding data protection provisions
                                            during the examination of the processing activities.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>10.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            The parties undertake to communicate the essential content of the
                                            joint controllership agreement to the data subjects (Article 26
                                            (2) GDPR).
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>11.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            Both parties are obliged to inform the supervisory authority and
                                            the data subjects affected by a violation of the protection of
                                            personal data in accordance with Articles 33 and 34 GDPR
                                            concerning all operating ranges. The parties shall inform each
                                            other about any such notification to the supervisory authority
                                            without undue delay. The parties also agree to forward the
                                            information required for the notification to one another without
                                            undue delay.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>12.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            If a data protection impact assessment pursuant to Article 35 GDPR
                                            is required, the parties shall support each other.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>13.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            Documentations within the meaning of Article 5 (2) GDPR, which
                                            serve as proof of proper data processing, shall be archived by
                                            each party beyond the end of the contract in accordance with legal
                                            provisions and obligations
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>14.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            (1) Within their operating range, the parties shall ensure that
                                            all employees authorised to process the personal data have
                                            committed themselves to confidentiality or are under an
                                            appropriate statutory obligation of confidentiality in accordance
                                            with Articles 28 (3), 29, and 32 GDPR for the duration of their
                                            employment, as well as after termination of their employment. The
                                            parties shall also ensure that they observe the data secrecy
                                            provisions prior to taking up their duties and are familiarised
                                            with the data protection legislation and rules relevant to them.
                                            (2) The parties shall independently ensure that they are able to
                                            comply with all existing storage obligations with regard to the
                                            data. For this purpose, they must implement appropriate technical
                                            and organisational measures (Article 32 et seq. GDPR). This
                                            applies particularly in the case of termination of the
                                            cooperation/agreement. (3) The implementation, default-setting,
                                            and operation of the systems shall be carried out in compliance
                                            with the requirements of the GDPR and other regulations. In
                                            particular, compliance with the principles of data protection by
                                            design and data protection by default will be achieved through the
                                            implementation of appropriate technological and organisational
                                            measures corresponding to the state of the art. (4) The parties
                                            agree to store personal data which are processed on the “
                                            {this.state.chainData.data.name}” application in the course of the
                                            services on specially protected servers.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>15.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            Each party undertakes to conclude a contract pursuant to Article
                                            28 GDPR with regard to the processing of the personal data for
                                            which the party is responsible.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>16.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            (1) The parties commit themselves to conclude a contract in
                                            accordance with Article 28 GDPR when engaging processors within
                                            the scope of this agreement (see § 1) and to obtain the written
                                            consent of the other party before concluding the contract. (2) The
                                            parties shall inform each other in a timely manner of any intended
                                            change with regard to the involvement or replacement of
                                            subcontracted processors. The parties shall only commission
                                            subcontractors who meet the requirements of data protection
                                            legislation and the provisions of this agreement. Services which
                                            the contracting parties use from third parties to support the
                                            execution of the contract, such as telecommunications services and
                                            maintenance, shall not be seen as services provided by
                                            subcontractors within the meaning of this contract. However, the
                                            parties are obligated to make appropriate contractual agreements
                                            in accordance with the law and to take controlling measures to
                                            guarantee the protection and security of personal data, even in
                                            the case of additional third party services. (3) Only processors
                                            who are subject to the legal obligation to appoint a data
                                            protection officer shall be commissioned to perform services in
                                            connection with this contract.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>17.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            The parties shall include the processing operations in the records
                                            of processing activities pursuant to Article 30 (1) GDPR, in
                                            particular, with a comment on the nature of the processing
                                            operation as one of joint or sole responsibility.
                                        </H3>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                        }}
                                    >
                                        <H2>18.</H2>
                                        <H3 marginLeft={scale.w(10)}>
                                            Notwithstanding the provisions of this contract, the parties shall
                                            be liable for damages resulting from processing that fails to
                                            comply with the GDPR. In external relations they are jointly
                                            liable to the persons concerned. In the internal relationship the
                                            parties are liable, notwithstanding the provisions of this
                                            contract, only for damages which have arisen within their
                                            operating range.
                                        </H3>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </KeyboardAvoidingView>
            );
    }
}

const styles = StyleSheet.create({
    photo_picker_container: {
        width: widthPercentageToDP(25),
        height: heightPercentageToDP(14),
        borderRadius: 18,
        backgroundColor: colors.GREY,
    },
    passport_photo: {
        width: widthPercentageToDP(30),
        height: heightPercentageToDP(14),
        borderRadius: 18,
    },
    number_guest_check_in_container: {
        marginVertical: scale.w(10),
        alignItems: 'center',
        marginTop: scale.w(20),
        elevation: 9,
    },
    scroll_number_item: {
        alignItems: 'center',
        justifyContent: 'center',
        width: widthPercentageToDP(20),
        height: widthPercentageToDP(20),
        borderWidth: 1,
        borderColor: colors.GREY,
        borderRadius: widthPercentageToDP(20),
        backgroundColor: colors.WHITE,
        alignSelf: 'center',
        marginHorizontal: widthPercentageToDP(10),
    },
    room_number_view: {
        alignItems: 'center',
        justifyContent: 'center',
        width: scale.w(120),
        height: scale.w(50),
        borderWidth: 1,
        borderColor: colors.GREY,
        borderRadius: scale.w(8),
        backgroundColor: colors.WHITE,
        alignSelf: 'center',
        marginHorizontal: scale.w(10),
    },
    btn_primary_container: {
        paddingHorizontal: scale.w(57),
        paddingTop: scale.w(8),
        paddingBottom: scale.w(38),
    },
});

export default CheckInForm;
