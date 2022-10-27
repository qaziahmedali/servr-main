import React, { createRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    FlatList,
    TextInput,
    Text,
    Platform,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';
import ModalTimePicker from './Components/ModalTimePicker';
import CustomModal from '../_global/CustomModal';
import base from '../../utils/baseStyles';
import { scale, widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IRestaurant, IDish, ICategoryDish } from '../../types/restaurant';
import { debounce } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import colors from '../../constants/colors';
import { H4, H2, H3 } from '../_global/Text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IOrderRoomServiceReduxProps } from './OrderRoomService.Container';
import numeral from 'numeral';
import { find, findIndex } from 'lodash';
import { IOrderItem } from '../../types/action.restaurant';
import { trackingProgress } from '../../utils/navigationControl';
import Modal from 'react-native-modal';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Menu, MenuItem, Position, MenuDivider } from 'react-native-enhanced-popup-menu';
import InputText from './../_global/InputText';
import AttentionModal from '../_global/AttentionModal';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { toast } from '../../utils/handleLogic';

export interface IOrderRoomServiceProps extends IOrderRoomServiceReduxProps {
    componentId: string;
    restaurant: IRestaurant;
    items: any;
}

interface ISelectedItems extends IOrderItem {
    name: string;
}

interface IMyCardState {
    loading: boolean;
    text: string;
    visible: boolean;
    tipAlert: boolean;
    tipModal: boolean;
    tip: string;
    tipsArr: any;
    modalVisible: boolean;
    modalVisible1: boolean;
    vip_note: string;
    items: any;
    date?: any;
    time?: any;
    selectedIndex?: any;
    type?: any;
}

class MyCard extends React.Component<IOrderRoomServiceProps, IMyCardState> {
    private dropDownRef = createRef();
    private _modalTimePicker = React.createRef<CustomModal>();
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalConfirm = React.createRef<CustomModal>();
    private menuRef = createRef();
    constructor(props: IOrderRoomServiceProps) {
        super(props);
        this.state = {
            loading: false,
            text: '',
            visible: false,
            tipAlert: false,
            tipModal: false,
            tip: '',
            tipsArr: ['10%', '20%', '25%'],
            modalVisible: false,
            modalVisible1: false,
            vip_note: '',
            items: props.items,
            type: '0',
            selectedIndex: 0,
        };
        this._handleBack = this._handleBack.bind(this);
        this._handleTip = this._handleTip.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.setModalVisible1 = this.setModalVisible1.bind(this);
        this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
        this._handleModalDatePicker = this._handleModalDatePicker.bind(this);
        this._handleModalConfirm = this._handleModalConfirm.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._onChangeTime = this._onChangeTime.bind(this);
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handleTip() {
        console.log('props', this.props);
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let now_time = `${hours}:${minutes}`;

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
        } else if (
            now_time > this.props.restaurant.opening_time &&
            now_time < this.props.restaurant.closing_time
        ) {
            this.setState({ tipAlert: true });
        } else {
            this.setState({
                visible: true,
                text: this.props.selectedLanguage.the_resturant_is_closed,
            });
        }
    }

    _handleOrderRoomService(isTip: boolean) {
        this.setState({ loading: true });
        const { items, id } = this.props;
        const { tip, vip_note, date, time } = this.state;
        if (isTip) {
            this.props.orderRoomService(
                date,
                time,
                id,
                items,
                tip,
                vip_note,
                () => {
                    this.setState({ loading: false });
                    setTimeout(() => {
                        this.setState({
                            tipModal: false,
                        });
                    }, 500);
                    Navigation.popTo('restaurantList');
                    // await Navigation.push('restaurantList', trackingProgress);
                    toast(this.props.selectedLanguage.success_order_room_service);
                },
                () => {
                    this.setState({ loading: false });
                    setTimeout(() => {
                        this.setState({
                            tipModal: false,
                        });
                    }, 500);
                },
            );
        } else {
            this.props.orderRoomService(
                date,
                time,
                id,
                items,
                tip,
                vip_note,
                () => {
                    this.setState({ loading: false });
                    setTimeout(() => {
                        this.setState({
                            tipModal: false,
                        });
                    }, 500);
                    Navigation.popTo('restaurantList');
                    // await Navigation.push('restaurantList', trackingProgress);
                    toast(this.props.selectedLanguage.success_order_room_service);
                },
                () => {
                    this.setState({ loading: false });
                    setTimeout(() => {
                        this.setState({
                            tipModal: false,
                        });
                    }, 500);
                },
            );
        }
    }

    componentDidUpdate() {
        if (this.state.items.length == 0) {
            Navigation.pop(this.props.componentId);
        }
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
                        toast(this.props.selectedLanguage.please_select_the_correct);
                    }
                } else {
                    this._modalTimePicker.current.show();
                    this.setState({ time: new Date().toString() });
                }
            }
        };
    }

    _handleModalConfirm(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalConfirm.current) {
                if (closeModal) {
                    this._modalConfirm.current?.show();
                } else {
                    this._modalConfirm.current?.hide();
                }
            }
        };
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    setModalVisible1(visible) {
        this.setState({ modalVisible1: visible });
    }

    _addTotalDish(item: IDish, from: boolean) {
        const index = findIndex(this.state.items, { dish_id: from ? item.id : item.dish_id });
        if (index < 0) {
            this.setState((prevState) => ({
                items: [
                    ...prevState.items,
                    {
                        dish_id: item.id,
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

    _handleModalOrder(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();

            if (this._modalConfirm.current) {
                if (closeModal) {
                    this._modalConfirm.current?.show();
                } else {
                    this._modalConfirm.current?.hide();
                }
            }
        };
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

    _renderScreen = () => {
        const { color } = this.props;
        const {
            confirm_order,
            your_orders,
            total,
            add_a_note_extra_napkin_etc,
            add_a_note,
            would_you_like_to_add_a_tip,
            yes,
            no,
            add_tip,
            my_card,
            please_select_at_least_one_item,
        } = this.props.selectedLanguage;
        var total_price = 0;
        this.state.items.map((dish) => {
            let row_price = dish.rate * dish.qty;
            total_price = total_price + row_price;
        });
        return (
            <ScrollView
                automaticallyAdjustContentInsets="automatic"
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="handled"
            >
                <View
                    style={{
                        paddingHorizontal: scale.w(20),
                        paddingTop: scale.h(30),
                    }}
                >
                    <H3>{your_orders}</H3>
                    <View
                        style={{
                            marginTop: scale.h(30),
                            height: scale.h(250),
                        }}
                    >
                        <FlatList
                            nestedScrollEnabled={true}
                            data={this.state.items}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={{ marginTop: scale.h(80) }}>
                                        <Text style={{ alignSelf: 'center' }}>
                                            {please_select_at_least_one_item}
                                        </Text>
                                    </View>
                                );
                            }}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                let row_price = item.rate * item.qty;
                                return (
                                    <View
                                        style={{
                                            height: scale.h(50),
                                            flexDirection: 'row',
                                            marginTop: scale.h(10),
                                            alignItems: 'center',
                                            borderBottomWidth: scale.h(0.5),
                                            borderBottomColor: this.props.color,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: scale.w(280),
                                                justifyContent: 'center',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    justifyContent: 'center',
                                                    width: scale.w(200),
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: scale.w(30),
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <H3 fontSize={scale.w(16)}>{`${item.qty}x`}</H3>
                                                </View>
                                                <View
                                                    style={{
                                                        width: scale.w(170),
                                                    }}
                                                >
                                                    <H3 fontSize={scale.w(16)}>
                                                        {item.name
                                                            ? item.name.length > 15
                                                                ? item.name.substring(0, 25) + '...'
                                                                : item.name
                                                            : null}
                                                    </H3>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    width: scale.w(80),
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        borderWidth: 1,
                                                        borderRadius: scale.w(8),
                                                        borderColor: color || colors.BROWN,
                                                        paddingHorizontal: scale.w(10),
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '45%',
                                                        height: scale.h(35),
                                                        paddingVertical: hp(0.2),
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.props._substractTotalDish(item, false);
                                                            this._substractTotalDish(item, false);
                                                        }}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Ionicons
                                                            name="md-remove"
                                                            color={color || colors.BROWN}
                                                            size={scale.w(22)}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                                <View
                                                    style={{
                                                        borderWidth: 1,
                                                        borderRadius: scale.w(8),
                                                        borderColor: color || colors.BROWN,
                                                        paddingHorizontal: scale.w(10),
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '45%',
                                                        height: scale.h(35),
                                                        paddingVertical: hp(0.2),
                                                        marginLeft: scale.w(5),
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.props._addTotalDish(item, false);
                                                            this._addTotalDish(item, false);
                                                        }}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Ionicons
                                                            name="md-add"
                                                            color={color || colors.BROWN}
                                                            size={scale.w(22)}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: scale.w(60),
                                            }}
                                        >
                                            <H3 fontSize={scale.w(16)}>
                                                {`${this.props.currency}${numeral(row_price).format('0,0a')}`}
                                            </H3>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: scale.w(335),
                            borderTopWidth: scale.w(1.5),
                            borderTopColor: this.props.color,
                            marginTop: scale.h(10),
                        }}
                    >
                        <View
                            style={{
                                width: scale.w(280),
                            }}
                        >
                            <H3 marginTop={scale.h(5)} fontSize={16}>
                                {total}
                            </H3>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                width: scale.w(70),
                            }}
                        >
                            <H3 fontSize={16} marginTop={scale.h(5)}>
                                {`${this.props.currency}${numeral(total_price).format('0,0a').toUpperCase()}`}
                            </H3>
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: scale.h(30),
                            marginBottom: scale.h(10),
                        }}
                    >
                        <H3 fontSize={18} marginLeft={scale.w(5)}>
                            {add_a_note_extra_napkin_etc}
                        </H3>
                    </View>
                    <View
                        style={{
                            height: scale.h(120),
                            borderRadius: scale.w(20),
                            backgroundColor: '#fff',
                            marginTop: scale.h(5),
                            justifyContent: 'center',
                            marginBottom: scale.h(30),
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
                        <TextInput
                            multiline={true}
                            placeholder={add_a_note}
                            placeholderTextColor={'gray'}
                            style={[
                                {
                                    height: scale.h(100),
                                    paddingHorizontal: scale.w(15),
                                    textAlignVertical: 'top',
                                },
                                Platform.OS == 'android' ? { paddingTop: scale.h(-20) } : {},
                            ]}
                            value={this.state.vip_note}
                            onChangeText={(text) => {
                                this.setState({
                                    vip_note: text,
                                });
                            }}
                        />
                    </View>
                    <Animatable.View
                        useNativeDriver
                        animation="fadeIn"
                        duration={300}
                        style={styles.submit_btn_container}
                    >
                        <ButtonPrimary
                            onPress={this._handleModalOrder(true)}
                            loading={this.state.loading}
                            disabled={this.state.loading}
                            text={confirm_order}
                            backgroundColor={this.props.color || colors.BROWN}
                            chainData={this.props.chainData}
                        />
                    </Animatable.View>
                </View>
            </ScrollView>
        );
    };

    render() {
        const { color } = this.props;
        const { confirm_order, would_you_like_to_add_a_tip, yes, no, add_tip, my_card } =
            this.props.selectedLanguage;

        return (
            <View style={base.container}>
                <Navbar isBrown={color === ''} color={color} onClick={this._handleBack} title={my_card} />
                {Platform.OS == 'ios' ? (
                    <KeyboardAvoidingView behavior="padding">{this._renderScreen()}</KeyboardAvoidingView>
                ) : (
                    this._renderScreen()
                )}

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
                                width: scale.w(350),
                                // height: scale.h(200),
                                backgroundColor: '#fff',
                                borderRadius: scale.w(20),
                                alignItems: 'center',
                                paddingVertical: scale.h(30),
                            }}
                        >
                            {this.state.tipModal ? (
                                <>
                                    <Menu ref={(ref) => (this.menuRef = ref)}>
                                        <FlatList
                                            data={this.state.tipsArr}
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
                                    <H2>{add_tip}</H2>
                                    <View style={{ width: '70%', marginTop: scale.h(40) }}>
                                        <View
                                            ref={(ref) => (this.dropDownRef = ref)}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                borderWidth: 1,
                                                borderColor: colors.GREY,
                                                borderRadius: 4,
                                                marginBottom: scale.h(20),
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
                                                    this.menuRef.show(this.dropDownRef, Position.TOP_RIGHT);
                                                }}
                                                style={{
                                                    width: scale.w(35),
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
                                                this.setState({
                                                    tipAlert: false,
                                                });
                                                this._handleOrderRoomService(false);
                                            }}
                                            loading={this.state.loading}
                                            disabled={this.state.loading}
                                            text={confirm_order}
                                            backgroundColor={color || colors.BROWN}
                                            chainData={this.props.chainData}
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <H2>{would_you_like_to_add_a_tip}?</H2>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: scale.w(40),
                                        }}
                                    >
                                        <View style={{ width: '50%', paddingHorizontal: scale.w(10) }}>
                                            <ButtonPrimary
                                                backgroundColor={color || colors.BROWN}
                                                onPress={() => {
                                                    this.setState({ tipAlert: false });
                                                    this._handleOrderRoomService(false);
                                                }}
                                                loading={false}
                                                disabled={false}
                                                fontSize={scale.w(16.5)}
                                                text={no}
                                                chainData={this.props.chainData}
                                            />
                                        </View>
                                        <View style={{ width: '50%', paddingHorizontal: scale.w(10) }}>
                                            <ButtonPrimary
                                                backgroundColor={color || colors.BROWN}
                                                onPress={() => {
                                                    this.setState({ tipModal: true });
                                                }}
                                                loading={false}
                                                disabled={false}
                                                fontSize={scale.w(16.5)}
                                                text={yes}
                                                chainData={this.props.chainData}
                                            />
                                        </View>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
                <CustomModal ref={this._modalConfirm} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <View style={{ width: '100%', backgroundColor: 'white', borderRadius: wp(5) }}>
                        <RadioForm animation={true}>
                            {/* To create radio buttons, loop through your array of options */}
                            {[
                                { label: this.props.selectedLanguage.now, value: '0' },
                                { label: this.props.selectedLanguage.specific_time, value: '1' },
                            ].map((obj, i) => (
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
                                            marginHorizontal: scale.w(20),
                                            backgroundColor: colors.WHITE,
                                            ...Platform.select({
                                                ios: {
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: -1, height: 2 },
                                                    shadowOpacity: 0.2,
                                                    shadowRadius: scale.w(6),
                                                },
                                                android: {
                                                    elevation: 3,
                                                },
                                            }),
                                            borderRadius: scale.w(30),
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: '100%',
                                                paddingHorizontal: wp(3),
                                                flexDirection: 'row',
                                                paddingVertical: hp(4.5),
                                                borderRadius: 20,
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
                            ))}
                        </RadioForm>
                        <View style={{ height: hp(2) }}></View>
                        <View style={{ marginHorizontal: scale.w(20) }}>
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
                                text={confirm_order}
                                backgroundColor={color || colors.BROWN}
                                chainData={this.props.chainData}
                            />
                        </View>
                        <View style={{ height: hp(2) }}></View>
                    </View>
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

const styles = StyleSheet.create({
    submit_btn_container: {
        paddingHorizontal: scale.w(20),
        marginTop: scale.w(20),
        marginBottom: scale.h(Platform.OS == 'ios' ? 100 : 30),
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

export default MyCard;
