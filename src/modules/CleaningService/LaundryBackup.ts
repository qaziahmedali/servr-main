import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Keyboard,
    SafeAreaView,
    Text,
    Platform,
    Alert,
    RefreshControl,
    KeyboardAvoidingView,
    TextInput,
    StatusBar,
} from 'react-native';
import base from '../../utils/baseStyles';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import { orderRoomService, cleaningRequestComplete } from '../../utils/navigationControl';
import MenuButton from '../_global/MenuButton';
import { ButtonPrimary } from '../_global/Button';
import { H4, H3 } from '../_global/Text';
import { ILaundryServiceReduxProps, IDataLaundry } from './LaundryService.Container';
import { find, findIndex } from 'lodash';
import colors from '../../constants/colors';
import { debounce } from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModal from '../_global/CustomModal';
import ProcessComplete from '../_global/processComplete';
import NoteOrderItem from '../Restaurant/Components/NoteOrderItem';
import Modal from 'react-native-modal';
import ProceedPayment from '../_global/proceedPayment';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DIcon from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import AttentionModal from '../_global/AttentionModal';
import { toast } from '../../utils/handleLogic';
import Cloth from '../../images/cloth.svg';
import DropShadow from 'react-native-drop-shadow';
import { RootContainer } from '../_global/Container';
import Field from '../../modules/LostAndFound/Component/field';

export interface ILaundryServiceProps extends ILaundryServiceReduxProps {
    componentId: string;
}

interface ILaundryServiceState {
    loading: boolean;
    loadingGet: boolean;
    items: any;
    selectedItem: any;
    modalVisible: boolean;
    title: string;
    description: string;
    item: any;
    numberClothes: number;
    deliveryOptions: Array;
    open: false;
    value: string;
    selectedDeliveryOption: string;
    selectedItemOption: string;
    note: string;
    text: string;
    visible: boolean;
    clothTypeState: boolean;
    deilveryOptionsState: boolean;
    laundryServiceItemsList: Array;
}

class LaundryService extends React.Component<ILaundryServiceProps, ILaundryServiceState> {
    private _modalProcessComplete = React.createRef<CustomModal>();

    constructor(props: ILaundryServiceProps) {
        super(props);

        this.state = {
            open: false,
            loading: false,
            loadingGet: false,
            items: [],
            selectedItem: {
                qty: 0,
                notes: '',
                name: '',
                laundry_service_id: '',
                modalVisible: false,
                title: '',
                description: '',
                item: [],
            },
            numberClothes: 0,
            value: 'Apple',
            deliveryOptions: [
                { label: '1-Day', value: '1' },
                { label: '2-Day', value: '2' },
            ],
            selectedDeliveryOption: '',
            selectedItemOption: '',
            note: '',
            text: '',
            visible: false,
            clothTypeState: false,
            deilveryOptionsState: false,
            laundryServiceItemsList: [],
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.icon.concierge_color,
                style: 'light',
            },
        });
        this.getData = this.getData.bind(this);
        this._handleBack = this._handleBack.bind(this);
        this._handleSelectService = this._handleSelectService.bind(this);
        this._renderListHeaderComponent = this._renderListHeaderComponent.bind(this);
        this._renderItemSeparatorComponent = this._renderItemSeparatorComponent.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._handleModalNoteOrderItem = this._handleModalNoteOrderItem.bind(this);
        this._onChangeText = this._onChangeText.bind(this);
        this._addTotalDish = this._addTotalDish.bind(this);
        this._substractTotalDish = this._substractTotalDish.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderListEmptyComponent = this._renderListEmptyComponent.bind(this);
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    getData() {
        this.setState({ loadingGet: true });
        this.props.getLaundryServicesMenu(
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
        Navigation.pop(this.props.componentId);
    }

    componentDidMount() {
        // this.props.getLaundryServicesMenu();
        // this.getData();

        this.props.getLaundryServices(
            (data) => {
                console.log(data);
                this.setState({
                    laundryServiceItemsList: data?.cloth_type,
                });
            },
            () => {},
        );
    }
    _handleSelectService(item: IDataLaundry) {
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
        } else if (isNaN(Number(this.state.numberClothes))) {
            //     this.ref_numberPeople.current.focus();
            // .current.focus()
            toast(this.props.selectedLanguage.please_enter_valid_numeric_value_only);
            return 0;
        } else if (Number(this.state.numberClothes) < 1) {
            //   this.ref_numberPeople.current.focus();
            // .current.focus()
            toast(this.props.selectedLanguage.number_of_clothes_should_be_atlease_one);
            return 0;
        } else if (this.state.numberClothes >= Number(21)) {
            //  this.ref_numberPeople.current.focus();
            // .current.focus()
            toast(this.props.selectedLanguage.number_of_clothes_cant_be_more_than_20);
            return 0;
        } else {
            this.setState({ loading: true });
            const { items } = this.state;
            const tempObject = {
                current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                note: this.state.note,
                delivery_type: this.state.selectedDeliveryOption,
                cloth_type: this.state.selectedItemOption,
                number_of_cloth: this.state.numberClothes,
            };
            this.props.laundryOrder(
                tempObject,
                async () => {
                    this._modalProcessComplete.current?.show();
                    this.setState({ loading: false });
                },
                () => {
                    this.setState({ loading: false });
                },
            );
        }
    }

    _renderListHeaderComponent() {
        return (
            <View style={styles.text_container}>
                <H4 fontSize={scale.w(21)} textAlign="center">
                    {this.props.selectedLanguage.choose_a_valet_laundary_service + ':'}
                </H4>
            </View>
        );
    }

    _renderItemSeparatorComponent() {
        return <View style={{ height: scale.w(0) }} />;
    }
    _handleModalNoteOrderItem(item: any | null, closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalNoteOrderItem.current) {
                if (closeModal) {
                    this.setState(
                        (prevState) => ({
                            items: prevState.items.map((item: any) => {
                                if (item.laundry_service_id === prevState.selectedItem.laundry_service_id) {
                                    return {
                                        ...item,
                                        notes: prevState.selectedItem.notes,
                                    };
                                }

                                return item;
                            }),
                        }),
                        this._modalNoteOrderItem.current.hide,
                    );
                } else {
                    const selected = find(this.state.items, { laundry_service_id: item ? item.id : '' });
                    this.setState(
                        { selectedItem: selected ? selected : this.state.selectedItem },
                        this._modalNoteOrderItem.current.show,
                    );
                }
            }
        };
    }

    _handleModalDatePicker2(closeModal?: boolean) {
        console.log('close modalll', closeModal);
        return () => {
            if (this.state.startSelected) {
                Keyboard.dismiss();
                if (this._modalDatePicker2.current) {
                    if (closeModal) {
                        this._modalDatePicker2.current.hide();
                    } else {
                        this._modalDatePicker2.current.show();
                        this.setState({ booking_end_date: new Date().toString() });
                    }
                }
            } else {
                toast(this.props.selectedLanguage.please_select_date_and_time_first);
            }
        };
    }

    _onChangeText(text: string) {
        this.setState((prevState) => ({
            selectedItem: {
                ...prevState.selectedItem,
                notes: text,
            },
        }));
    }
    _addTotalDish(item: any) {
        const index = findIndex(this.state.items, { laundry_service_id: item.id });

        if (index < 0) {
            this.setState((prevState) => ({
                items: [
                    ...prevState.items,
                    {
                        qty: 1,
                        notes: '',
                        name: item.name,
                        laundry_service_id: item.id,
                    },
                ],
            }));
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((i: any) => {
                    if (i.laundry_service_id === item.id) {
                        return {
                            ...i,
                            qty: i.qty + 1,
                        };
                    }

                    return i;
                }),
            }));
        }
    }

    _substractTotalDish(item: any) {
        const selected = find(this.state.items, { laundry_service_id: item.id });

        if (selected && selected.qty <= 1) {
            this.setState((prevState) => ({
                items: prevState.items.filter(({ laundry_service_id }) => laundry_service_id !== item.id),
            }));
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((i: any) => {
                    if (i.laundry_service_id === item.id) {
                        return {
                            ...i,
                            qty: i.qty - 1,
                        };
                    }

                    return i;
                }),
            }));
        }
    }

    _renderListEmptyComponent() {
        return (
            <View style={{ marginTop: scale.h(170) }}>
                {this.state.loadingGet ? (
                    <View
                        style={{
                            width: scale.w(200),
                            height: scale.h(80),
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {this.props.primaryColor == '#72D7FF' ? (
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                source={{ uri: this.props.chainData.data.logo_gif_dark }}
                            />
                        ) : (
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                source={{ uri: this.props.chainData.data.logo_gif_dark }}
                            />
                        )}
                    </View>
                ) : (
                    <H3 fontSize={scale.w(18)} textAlign="center">
                        {this.props.selectedLanguage.no_items_found}
                    </H3>
                )}
            </View>
        );
    }

    _keyExtractor(item: any, index: number) {
        return `${item.name}_${index}`;
    }
    _renderItem({ item }: { item: IDataLaundry }) {
        const selected = find(this.state.items, { laundry_service_id: item.id });
        const { color, currency } = this.props;

        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
                <View style={{ height: hp(20), backgroundColor: 'red' }}>
                    {/* <ImageBackground style={{height : hp(20), width : wp(100)}} source={require('../../images/headerMasked.png')}  > */}
                    <Navbar
                        tintBackColor={colors.WHITE}
                        titleColor={colors.WHITE}
                        RightIconName={'search'}
                        RightIconColor={colors.WHITE}
                        onClick={this._handleBack}
                        title={'request_items'}
                    />
                    {/* </ImageBackground> */}
                </View>
                <View
                    style={{
                        height: hp(85),
                        width: wp(100),
                        position: 'absolute',
                        backgroundColor: colors.WHITE,
                        marginTop: hp(15),
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                    }}
                >
                    <View style={{ height: hp(3) }}></View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, paddingHorizontal: wp(5) }}>
                            <FlatList
                                refreshControl={<RefreshControl onRefresh={this._fetch} refreshing={false} />}
                                ListEmptyComponent={() => {
                                    return (
                                        <View
                                            style={{
                                                paddingTop: scale.h(170),
                                            }}
                                        >
                                            {this.state.loadingGet ? (
                                                <View
                                                    style={{
                                                        width: widthPercentageToDP(40),
                                                        height: heightPercentageToDP(70),
                                                        alignSelf: 'center',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {this.props.primaryColor == '#72D7FF' ? (
                                                        <Image
                                                            resizeMode="contain"
                                                            style={{
                                                                height: '100%',
                                                                width: '100%',
                                                            }}
                                                            source={{
                                                                uri: this.props.chainData.data.logo_gif_dark,
                                                            }}
                                                        />
                                                    ) : (
                                                        <Image
                                                            resizeMode="contain"
                                                            style={{
                                                                height: '100%',
                                                                width: '100%',
                                                            }}
                                                            source={{
                                                                uri: this.props.chainData.data.logo_gif_dark,
                                                            }}
                                                        />
                                                    )}
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
                                data={this.props.serviceItems}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                // ListHeaderComponent={this._renderListHeaderComponent}
                                ItemSeparatorComponent={this._renderItemSeparatorComponent}
                                renderItem={this._renderItem}
                                initialNumToRender={10}
                            />
                        </View>

                        <View style={{ height: hp(15) }} />
                    </ScrollView>
                    <ProceedPayment
                        price={this.props.currency}
                        btnText={this.props.selectedLanguage.checkout}
                        loader={this.state.loading}
                        onPress={() => this._handleRequestItems()}
                    />
                    <SafeAreaView style={{ height: 20 }} />
                </View>
            </KeyboardAvoidingView>
        );
    }

    _handleModalDatePicker(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalDatePicker.current) {
                if (closeModal) {
                    this._modalDatePicker.current.hide();
                } else {
                    this._modalDatePicker.current.show();
                    this.setState({ booking_date: new Date().toString() });
                }
            }
        };
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { color } = this.props;
        const { laundry_service, confirm_order, note } = this.props.selectedLanguage;
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ height: heightPercentageToDP(100), width: widthPercentageToDP(100) }}>
                        <RootContainer>
                            <View
                                style={{
                                    height: heightPercentageToDP(14),
                                    backgroundColor: this.props.icon.concierge_color,
                                }}
                            >
                                {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                                <Navbar
                                    RightIconColor={colors.WHITE}
                                    RightIconName={'search'}
                                    tintBackColor={colors.WHITE}
                                    titleColor={colors.WHITE}
                                    onClick={this._handleBack}
                                    title={this.props.selectedLanguage.laundary_services}
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
                                <ScrollView>
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
                                                paddingVertical: hp(2.5),
                                                paddingHorizontal: wp(4),

                                                marginTop: hp(5),
                                                backgroundColor: colors.WHITE,
                                                width: wp(90),
                                                alignSelf: 'center',
                                                borderRadius: scale.w(2.5),
                                                borderWidth: 1,
                                                borderColor: colors.CHECKIN_SCREEN_BORDER_COLOR,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.6),
                                                    color: colors.DUMMY_COLOR,

                                                    fontFamily: 'Roboto-Medium',
                                                }}
                                            >
                                                {this.props.selectedLanguage.laundary_details}
                                            </Text>
                                            <View
                                                style={{
                                                    height: this.state.clothTypeState ? hp(21.5) : hp(9.5),
                                                }}
                                            >
                                                <DropDownPicker
                                                    zIndex={500}
                                                    items={this.state.laundryServiceItemsList}
                                                    placeholder={this.props.selectedLanguage.clothes_type}
                                                    placeholderStyle={{ paddingHorizontal: wp(1.7) }}
                                                    labelStyle={{
                                                        fontFamily: 'Roboto-Regular',
                                                        color: colors.DUMMY_COLOR,
                                                    }}
                                                    activeLabelStyle={{
                                                        fontFamily: 'Roboto-Bold',
                                                        color: colors.DUMMY_COLOR,
                                                    }}
                                                    style={{
                                                        backgroundColor: colors.COM_BACKGROUND,
                                                        borderTopLeftRadius: scale.w(1.8),
                                                        borderTopRightRadius: scale.w(1.8),
                                                        borderBottomLeftRadius: scale.w(1.8),
                                                        borderBottomRightRadius: scale.w(1.8),
                                                        paddingHorizontal: this.state.clothTypeState
                                                            ? wp(2)
                                                            : wp(3),
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',

                                                        width: wp(82),
                                                        marginTop: hp(2),
                                                        borderWidth: 0,
                                                        borderRadius: scale.w(20),
                                                        paddingRight: wp(3),
                                                    }}
                                                    // labelStyle={{
                                                    //     color: colors.ANONYMOUS2,
                                                    //     fontFamily: 'Roboto-Regular',
                                                    //     fontSize: scale.w(15),
                                                    // }}
                                                    // activeLabelStyle={{ fontFamily: 'Roboto-Bold', color: colors.BLACK }}
                                                    itemStyle={{
                                                        justifyContent: 'flex-start',
                                                    }}
                                                    // placeholderStyle={{
                                                    //     color: colors.ANONYMOUS2,
                                                    //     fontFamily: 'Roboto-Regular',
                                                    //     fontSize: scale.w(15),
                                                    // }}
                                                    arrowStyle={{
                                                        marginRight: scale.w(1),
                                                    }}
                                                    arrowColor={'#121924'}
                                                    dropDownStyle={{
                                                        width: '100%',
                                                        marginTop: heightPercentageToDP(2.5),
                                                        height: hp(12),
                                                    }}
                                                    containerStyle={{
                                                        height: hp(8.5),
                                                    }}
                                                    onOpen={() => {
                                                        this.setState({
                                                            clothTypeState: true,
                                                        });
                                                    }}
                                                    onClose={() => {
                                                        this.setState({
                                                            clothTypeState: false,
                                                        });
                                                    }}
                                                    onChangeItem={(item) => {
                                                        this.setState({
                                                            selectedItemOption: item.value,
                                                        });
                                                    }}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    height: this.state.deilveryOptionsState
                                                        ? hp(21.5)
                                                        : hp(8.5),
                                                }}
                                            >
                                                <DropDownPicker
                                                    zIndex={500}
                                                    items={[
                                                        { label: '1-Day', value: '1' },
                                                        { label: '2-Day', value: '2' },
                                                    ]}
                                                    placeholder={this.props.selectedLanguage.delivery_options}
                                                    placeholderStyle={{ paddingHorizontal: wp(1.7) }}
                                                    labelStyle={{
                                                        fontFamily: 'Roboto-Regular',
                                                        color: colors.DUMMY_COLOR,
                                                    }}
                                                    activeLabelStyle={{
                                                        fontFamily: 'Roboto-Bold',
                                                        color: colors.DUMMY_COLOR,
                                                    }}
                                                    style={{
                                                        backgroundColor: colors.COM_BACKGROUND,
                                                        borderTopLeftRadius: scale.w(1.8),
                                                        borderTopRightRadius: scale.w(1.8),
                                                        borderBottomLeftRadius: scale.w(1.8),
                                                        borderBottomRightRadius: scale.w(1.8),
                                                        paddingHorizontal: this.state.clothTypeState
                                                            ? wp(2)
                                                            : wp(3),
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',

                                                        width: wp(82),
                                                        marginTop: hp(0.5),
                                                        borderWidth: 0,
                                                        borderRadius: scale.w(20),
                                                        paddingRight: wp(3),
                                                    }}
                                                    // labelStyle={{
                                                    //     color: colors.ANONYMOUS2,
                                                    //     fontFamily: 'Roboto-Regular',
                                                    //     fontSize: scale.w(15),
                                                    // }}
                                                    // activeLabelStyle={{ fontFamily: 'Roboto-Bold', color: colors.BLACK }}
                                                    itemStyle={{
                                                        justifyContent: 'flex-start',
                                                    }}
                                                    // placeholderStyle={{
                                                    //     color: colors.ANONYMOUS2,
                                                    //     fontFamily: 'Roboto-Regular',
                                                    //     fontSize: scale.w(15),
                                                    // }}
                                                    arrowStyle={{
                                                        marginRight: scale.w(1),
                                                    }}
                                                    arrowColor={'#121924'}
                                                    dropDownStyle={{
                                                        width: '100%',
                                                        marginTop: heightPercentageToDP(0.5),
                                                        height: hp(12),
                                                    }}
                                                    containerStyle={{
                                                        height: hp(7),
                                                    }}
                                                    onOpen={() => {
                                                        this.setState({
                                                            deilveryOptionsState: true,
                                                        });
                                                    }}
                                                    onClose={() => {
                                                        this.setState({
                                                            deilveryOptionsState: false,
                                                        });
                                                    }}
                                                    onChangeItem={(value) => {
                                                        this.setState({
                                                            selectedDeliveryOption: value.value,
                                                        });
                                                    }}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    backgroundColor: colors.COM_BACKGROUND,
                                                    paddingHorizontal: wp(1),
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    width: wp(82),

                                                    paddingVertical: hp(1.2),
                                                    borderRadius: scale.w(1.5),
                                                }}
                                            >
                                                <Field
                                                    title={this.props.selectedLanguage.number_of_clothes}
                                                    placeholder={
                                                        this.props.selectedLanguage.number_of_clothes
                                                    }
                                                    color={color}
                                                    inputStyle={{
                                                        width: widthPercentageToDP(72),
                                                        paddingHorizontal: widthPercentageToDP(3),
                                                    }}
                                                    onChangeText={(value) => {
                                                        this.setState({
                                                            numberClothes: value.trim(),
                                                        });
                                                    }}
                                                    autoCapitalize="none"
                                                    keyboardType="number-pad"
                                                    value={this.state.numberClothes}
                                                    maxLength={2}
                                                ></Field>

                                                <Cloth
                                                    width={widthPercentageToDP(4)}
                                                    height={heightPercentageToDP(4)}
                                                />
                                            </View>
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
                                            marginTop: hp(2),
                                        }}
                                    >
                                        <View
                                            style={{
                                                paddingVertical: hp(3),
                                                paddingHorizontal: wp(4),
                                                marginTop: hp(2),
                                                width: wp(90),
                                                alignSelf: 'center',
                                                borderWidth: 1,
                                                borderRadius: scale.w(2),
                                                borderColor: '#EBF0F9',
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
                                                {this.props.selectedLanguage.description}
                                            </Text>
                                            <View style={{ height: heightPercentageToDP(1) }}></View>
                                            <Field
                                                multiline={true}
                                                title={this.state.note}
                                                height={heightPercentageToDP(20)}
                                                placeholder={
                                                    this.props.selectedLanguage.type_something_you_want_here
                                                }
                                                color={'red'}
                                                maxLength={250}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        note: value,
                                                    });
                                                }}
                                                value={this.state.note}
                                                inputStyle={{ paddingBottom: heightPercentageToDP(2) }}
                                                textAlignVertical="top"
                                            ></Field>
                                        </View>
                                    </DropShadow>
                                    <View style={{ height: hp(8) }} />
                                    <View style={{ width: wp(90), alignSelf: 'center' }}>
                                        <ButtonPrimary
                                            backgroundColor={this.props.icon.concierge_color}
                                            loading={this.state.loading}
                                            onPress={this._handleSelectService}
                                            text={this.props.selectedLanguage.confirm_order}
                                            fontWeight={'bold'}
                                            chainData={this.props.chainData}
                                        />
                                    </View>

                                    <View style={{ height: hp(10) }} />
                                </ScrollView>
                            </View>
                        </RootContainer>
                        <CustomModal
                            style={{ margin: -1 }}
                            ref={this._modalProcessComplete}
                            animationIn="fadeInUp"
                            animationOut="fadeOutDown"
                        >
                            <ProcessComplete
                                backgroundColor={this.props.icon.concierge_color}
                                onBackClick={() => console.log("don't go back")}
                                processImage={require('../../images/paymentPageImg.png')}
                                processTitle={this.props.selectedLanguage.request_successfull}
                                processDescription={
                                    this.props.selectedLanguage.your_laundary_request_has_been_sent
                                }
                                btnText={this.props.selectedLanguage.go_to_home}
                                loading={this.state.loading}
                                onButtonPress={() => {
                                    this._modalProcessComplete.current?.hide();
                                    Navigation.popTo('conciergeService');
                                }}
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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    text_container: {
        paddingHorizontal: scale.w(20),
        marginTop: scale.w(14),
        marginBottom: scale.w(70),
    },
    item_container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale.w(10),
        marginBottom: scale.h(20),
        backgroundColor: 'white',
        marginHorizontal: scale.w(15),
        height: scale.h(99),
        borderRadius: scale.w(20),
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
    },
    menu_btn_container: {
        paddingHorizontal: scale.w(55),
        marginBottom: scale.w(20),
        alignItems: 'center',
    },
    submit_btn_container: {
        paddingHorizontal: scale.w(57),
        marginTop: scale.w(18),
    },
});

export default LaundryService;
