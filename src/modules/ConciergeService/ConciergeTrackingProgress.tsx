import React from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    Platform,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
    Image,
    Text,
    BackHandler,
    KeyboardAvoidingView,
    StatusBar,
    Alert,
} from 'react-native';
import base from '../../utils/baseStyles';
import { heightPercentageToDP, scale, screenWidth, widthPercentageToDP } from '../../utils/dimensions';
import { H3, H4 } from '../_global/Text';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IConciergeTrackingProgressOrderRoomService } from '../../types/conciergeService';
import { ISpaTrackingProgressReduxProps } from './ConciergeTrackingProgres.Container';
import colors from '../../constants/colors';
import { upperFirst, startCase } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import { chat } from '../../utils/navigationControl';
import { BoxShadow } from 'react-native-shadow';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ITrackingProgressOrderRoomService } from '../../types/restaurant';
import numeral from 'numeral';
import { cos } from 'react-native-reanimated';
import { hp } from '../../utils/dimensions';
import DropShadow from 'react-native-drop-shadow';
import moment from 'moment';
import { RootContainer } from '../_global/Container';

interface IConciergeTrackingProgressProps extends ISpaTrackingProgressReduxProps {
    componentId: string;
}

interface ITrackingProgressState {
    display: 'current' | 'history' | 'bookings';
    loadingGet: boolean;
    bookings: any;
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
        };
    };
}

class TrackingProgress extends React.Component<IConciergeTrackingProgressProps, ITrackingProgressState> {
    constructor(props: IConciergeTrackingProgressProps) {
        super(props);

        this.state = {
            display: 'current',
            loadingGet: false,

            bookings: [],
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
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._handleChat = this._handleChat.bind(this);
        this._renderListHeaderComponent = this._renderListHeaderComponent.bind(this);
        this._renderListFooterComponent = this._renderListFooterComponent.bind(this);
        this._renderListEmptyComponent = this._renderListEmptyComponent.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteOrder = this.handleDeleteOrder.bind(this);
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
        // this.props.spaTrackingProgressOrderRoomService();
        this.setState({
            chainData: this.props.chainData,
        });
        this._fetch();
    }

    _fetch() {
        this.setState({ loadingGet: true });
        this.props.conciergeTrackingProgressOrderRoomService(
            () => {
                let tempArray = [];
                this.props.orders.map((item, index) => {
                    if (item.table_no || item.booking_type == 'normal_reservation') {
                        tempArray.push(item);
                    }
                });
                console.log(this.props.orders);
                console.log('temp array is here', tempArray);
                this.setState({ bookings: tempArray, loadingGet: false });
            },
            () => {
                this.setState({ loadingGet: false });
            },
        );
    }

    handleDelete(id: number, type: string) {
        Alert.alert(
            'Are you sure',
            'You want to delete the order?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        if (type == 'restaurant') {
                            this.handleDeleteOrder(id);
                        } else if (type == 'concierge') {
                            this.props.deleteConciergeOrder(
                                id,
                                'room_cleaning',
                                () => {
                                    this._fetch();
                                },
                                () => {},
                            );
                        } else {
                            this.props.deleteConciergeOrder(
                                id,
                                type,
                                () => {
                                    this._fetch();
                                },
                                () => {},
                            );
                        }
                    },
                },
            ],
            {
                cancelable: false,
            },
        );
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _keyExtractor(item: IConciergeTrackingProgressOrderRoomService) {
        return item.id.toString();
    }

    handleDeleteOrder(id: number) {
        console.log('id', id);
        this.props.deleteOrder(
            id,
            () => {
                this._fetch();
            },
            () => {},
        );
    }

    _renderItem({ item, index }: { item: any; index: any }) {
        console.log(item);
        const { color, currency } = this.props;
        if (item.request_type == 'concierge') {
            if (item.services) {
                return (
                    <DropShadow
                        style={{
                            width: widthPercentageToDP(100),
                            shadowOffset: {
                                width: 20,
                                height: 19,
                            },
                            shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                            shadowOpacity: 0.09,
                            shadowRadius: 30,
                            borderColor: colors.BLACK,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View style={styles.item_container}>
                            <View style={[styles.secondary_container, { backgroundColor: '#fff' }]}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <H3
                                        fontFamily={'Roboto-Bold'}
                                        textAlign="center"
                                        color={'#6D6D6D'}
                                        fontSize={scale.w(2)}
                                    >
                                        {this.state.display == 'current'
                                            ? item.request_type == 'items'
                                                ? this.props.selectedLanguage.items
                                                : item.request_type == 'laundry'
                                                ? this.props.selectedLanguage.laundries
                                                : item.request_type == 'concierge'
                                                ? this.props.selectedLanguage.request_items
                                                : this.props.selectedLanguage.room_cleaning
                                            : moment(item.datetime).format('DD, MMM YYYY')}
                                    </H3>
                                    {item.status == 'rejected' ||
                                    item.status == 'completed' ||
                                    item.status == 'done' ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.handleDelete(item.id, item.request_type);
                                            }}
                                        >
                                            <Icon color="red" size={18} name={'times-circle'} />
                                        </TouchableOpacity>
                                    ) : (
                                        <View />
                                    )}
                                </View>

                                <View style={{ marginTop: heightPercentageToDP(1) }}>
                                    {item.services ? (
                                        item.services.map((service, index) => {
                                            console.log('services');
                                            return (
                                                <View key={index} style={styles.menu_container}>
                                                    {/* <H3 fontSize={scale.w(1.9)} color={'#4B4B4B'}>{`${
                                                index + 1
                                            }.`}</H3> */}
                                                    <View style={{ flex: 1 }}>
                                                        <H3 fontSize={scale.w(1.5)} color={'#4B4B4B'}>
                                                            {service?.name}
                                                        </H3>
                                                        {this.state.display == 'current' ? null : (
                                                            <H3 fontSize={scale.w(1.2)} color={colors.GREY}>
                                                                {moment(item.datetime).format('LLL')}
                                                            </H3>
                                                        )}
                                                    </View>
                                                </View>
                                            );
                                        })
                                    ) : item.request_type == 'room_cleaning' ? (
                                        <View></View>
                                    ) : (
                                        <View style={styles.menu_container}>
                                            <View style={{ flex: 1 }}>
                                                <H3 fontSize={scale.w(1.5)} color={'#4B4B4B'}>
                                                    {item.type}
                                                </H3>
                                            </View>
                                            <H3
                                                fontFamily={'Roboto-Medium'}
                                                fontSize={scale.w(1.5)}
                                                color={this.props.color ? this.props.color : colors.BLUE}
                                            >
                                                {`${currency} ${Number(item.total_price)}`}
                                            </H3>
                                        </View>
                                    )}
                                </View>
                                {item.request_type == 'laundry' ? (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.5),
                                                fontFamily: 'Roboto-Bold',
                                                color: colors.BLUE,
                                                paddingVertical: heightPercentageToDP(1),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {this.props.selectedLanguage.total}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.5),
                                                fontFamily: 'Roboto-Bold',
                                                color: this.props.color ? this.props.color : colors.BLUE,
                                                paddingVertical: heightPercentageToDP(1),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {/* {`${currency} ${numeral(item.total_price)
                                                .format('0,0a')
                                                .toUpperCase()}`} */}
                                            {`${currency} ${Number(item.total_price)}`}
                                        </Text>
                                    </View>
                                ) : (
                                    <View />
                                )}
                            </View>

                            {/* <View
                        style={{
                            borderBottomLeftRadius: scale.w(2.0),
                            borderBottomRightRadius: scale.w(2.0),
                            paddingVertical: scale.w(1.8),
                            backgroundColor: color || colors.LIGHT_BLUE,
                        }}
                    >
                        <H3 fontSize={scale.w(2.2)} textAlign="center" color="#fff">
                            {`Status: ${upperFirst(startCase(item.status))}`}
                        </H3>
                    </View> */}
                        </View>
                    </DropShadow>
                );
            } else {
                return (
                    <DropShadow
                        style={{
                            width: widthPercentageToDP(100),
                            shadowOffset: {
                                width: 20,
                                height: 19,
                            },
                            shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                            shadowOpacity: 0.09,
                            shadowRadius: 30,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View style={styles.item_container}>
                            <View style={[styles.secondary_container, { backgroundColor: '#fff' }]}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <H3
                                        fontFamily={'Roboto-Bold'}
                                        textAlign="center"
                                        color={'#6D6D6D'}
                                        fontSize={scale.w(2)}
                                    >
                                        {this.props.selectedLanguage.room_cleaning}
                                    </H3>
                                </View>
                            </View>
                        </View>
                    </DropShadow>
                );
            }
        } else if (item.request_type == 'spa') {
            if (this.state.display == 'bookings') {
                if (item.booking_type != 'room_service') {
                    return (
                        <DropShadow
                            style={{
                                width: widthPercentageToDP(100),
                                shadowOffset: {
                                    width: 20,
                                    height: 19,
                                },
                                shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                                shadowOpacity: 0.09,
                                shadowRadius: 30,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: widthPercentageToDP(5),
                            }}
                        >
                            <View style={styles.item_container}>
                                <View style={[styles.secondary_container, { backgroundColor: '#fff' }]}>
                                    {/* <View
                                style={{
                                    alignItems: 'flex-end',
                                }}
                            >
                                {item.status == 'rejected' ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.handleDelete(item.id);
                                        }}
                                    >
                                        <Icon color="red" size={18} name={'times-circle'} />
                                    </TouchableOpacity>
                                ) : (
                                    <View />
                                )}
                            </View> */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <H3
                                            fontFamily={'Roboto-Bold'}
                                            textAlign="center"
                                            color={'#6D6D6D'}
                                            fontSize={scale.w(2)}
                                        >
                                            {this.state.display == 'current'
                                                ? item.booking_type == 'room_service'
                                                    ? this.props.selectedLanguage.order_room_service
                                                    : this.props.selectedLanguage.normal_reservation
                                                : moment(item.datetime).format('DD, MMM YYYY')}
                                        </H3>
                                        {item.status == 'rejected' || item.status == 'done' ? (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.props.deleteSpa(
                                                        item.id,
                                                        () => {
                                                            this._fetch();
                                                        },
                                                        () => {},
                                                    );
                                                }}
                                            >
                                                <Icon color="red" size={18} name={'times-circle'} />
                                            </TouchableOpacity>
                                        ) : (
                                            !item.loader &&
                                            item.status == 'pending' && (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        const tempArr = Object.assign(
                                                            [],
                                                            this.props.currentOrder,
                                                        );
                                                        tempArr[index]['loader'] = true;
                                                        // this.props.trackingProgressOrderRoomServiceSuccess(tempArr);
                                                        Alert.alert(
                                                            'Attention!',
                                                            'You want to cancel the order?',
                                                            [
                                                                {
                                                                    text: 'Cancel',
                                                                    onPress: () =>
                                                                        console.log('Cancel Pressed'),
                                                                    style: 'cancel',
                                                                },
                                                                {
                                                                    text: 'OK',
                                                                    onPress: () => {
                                                                        this.props.deleteSpa(
                                                                            item.id,
                                                                            () => {
                                                                                this._fetch();
                                                                            },
                                                                            () => {},
                                                                        );
                                                                    },
                                                                },
                                                            ],
                                                        );
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.8),
                                                            color:
                                                                this.props.Primary_Color === ''
                                                                    ? colors.BLUE
                                                                    : this.props.Primary_Color,
                                                        }}
                                                    >
                                                        {this.props.selectedLanguage.cancel}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        )}
                                    </View>
                                    <View style={{ marginTop: heightPercentageToDP(1) }}>
                                        {item.treatments.map((spa, index) => {
                                            return (
                                                <View key={index} style={styles.menu_container}>
                                                    {/* <H3 fontSize={scale.w(1.9)} color={'#4B4B4B'}>{`${index + 1}.`}</H3> */}
                                                    <View style={{ flex: 1 }}>
                                                        <H3 fontSize={scale.w(1.5)} color={'#4B4B4B'}>
                                                            {spa?.name}
                                                        </H3>
                                                        <H3 fontSize={scale.w(1.2)} color={colors.GREY}>
                                                            {moment(item.datetime).format('LLL')}
                                                        </H3>
                                                    </View>
                                                    <H3
                                                        fontFamily={'Roboto-Medium'}
                                                        fontSize={scale.w(1.5)}
                                                        color={
                                                            this.props.color ? this.props.color : colors.BLUE
                                                        }
                                                    >
                                                        {`${currency} ${Number(spa.price)}`}
                                                    </H3>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* <View
                            style={{
                                borderBottomLeftRadius: scale.w(2.0),
                                borderBottomRightRadius: scale.w(0.2),
                                paddingVertical: scale.w(1.8),
                                backgroundColor: color || colors.LIGHT_BLUE,
                            }}
                        >
                            <H3 fontSize={scale.w(2.2)} textAlign="center" color="#fff">
                                {`Status: ${upperFirst(startCase(item.status))}`}
                            </H3>
                        </View> */}
                            </View>
                        </DropShadow>
                    );
                }
            } else {
                if (item.booking_type == 'room_service')
                    return (
                        <DropShadow
                            style={{
                                width: widthPercentageToDP(100),
                                shadowOffset: {
                                    width: 20,
                                    height: 19,
                                },
                                shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                                shadowOpacity: 0.09,
                                shadowRadius: 30,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: widthPercentageToDP(5),
                            }}
                        >
                            <View style={styles.item_container}>
                                <View style={[styles.secondary_container, { backgroundColor: '#fff' }]}>
                                    {/* <View
                            style={{
                                alignItems: 'flex-end',
                            }}
                        >
                            {item.status == 'rejected' ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.handleDelete(item.id);
                                    }}
                                >
                                    <Icon color="red" size={18} name={'times-circle'} />
                                </TouchableOpacity>
                            ) : (
                                <View />
                            )}
                        </View> */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <H3
                                            fontFamily={'Roboto-Bold'}
                                            textAlign="center"
                                            color={'#6D6D6D'}
                                            fontSize={scale.w(2)}
                                        >
                                            {this.state.display == 'current'
                                                ? item.booking_type == 'room_service'
                                                    ? this.props.selectedLanguage.order_room_service
                                                    : this.props.selectedLanguage.normal_reservation
                                                : moment(item.datetime).format('DD, MMM YYYY')}
                                        </H3>
                                        {item.status == 'rejected' || item.status == 'done' ? (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.props.deleteSpa(
                                                        item.id,
                                                        () => {
                                                            this._fetch();
                                                        },
                                                        () => {},
                                                    );
                                                }}
                                            >
                                                <Icon color="red" size={18} name={'times-circle'} />
                                            </TouchableOpacity>
                                        ) : (
                                            !item.loader &&
                                            item.status == 'pending' && (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        const tempArr = Object.assign(
                                                            [],
                                                            this.props.currentOrder,
                                                        );
                                                        tempArr[index]['loader'] = true;
                                                        // this.props.trackingProgressOrderRoomServiceSuccess(tempArr);
                                                        Alert.alert(
                                                            'Attention!',
                                                            'You want to cancel the order?',
                                                            [
                                                                {
                                                                    text: 'Cancel',
                                                                    onPress: () =>
                                                                        console.log('Cancel Pressed'),
                                                                    style: 'cancel',
                                                                },
                                                                {
                                                                    text: 'OK',
                                                                    onPress: () => {
                                                                        this.props.deleteSpa(
                                                                            item.id,
                                                                            () => {
                                                                                this._fetch();
                                                                            },
                                                                            () => {},
                                                                        );
                                                                    },
                                                                },
                                                            ],
                                                        );
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.8),
                                                            color:
                                                                this.props.Primary_Color === ''
                                                                    ? colors.BLUE
                                                                    : this.props.Primary_Color,
                                                        }}
                                                    >
                                                        {this.props.selectedLanguage.cancel}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        )}
                                    </View>
                                    <View style={{ marginTop: heightPercentageToDP(1) }}>
                                        {item.treatments.map((spa, index) => {
                                            return (
                                                <View key={index} style={styles.menu_container}>
                                                    {/* <H3 fontSize={scale.w(1.9)} color={'#4B4B4B'}>{`${index + 1}.`}</H3> */}
                                                    <View style={{ flex: 1 }}>
                                                        <H3 fontSize={scale.w(1.5)} color={'#4B4B4B'}>
                                                            {spa?.name}
                                                        </H3>
                                                        {this.state.display == 'current' ? null : (
                                                            <H3 fontSize={scale.w(1.2)} color={colors.GREY}>
                                                                {moment(item.datetime).format('LLL')}
                                                            </H3>
                                                        )}
                                                    </View>
                                                    <H3
                                                        fontFamily={'Roboto-Medium'}
                                                        fontSize={scale.w(1.5)}
                                                        color={
                                                            this.props.color ? this.props.color : colors.BLUE
                                                        }
                                                    >
                                                        {`${currency} ${Number(spa.price)}`}
                                                    </H3>
                                                </View>
                                            );
                                        })}
                                    </View>
                                    {this.state.display == 'current' ? (
                                        <>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.5),
                                                        fontFamily: 'Roboto-Bold',
                                                        color:
                                                            this.props.Primary_Color === ''
                                                                ? colors.BLUE
                                                                : this.props.Primary_Color,
                                                        paddingVertical: heightPercentageToDP(1),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {this.props.selectedLanguage.status}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.5),
                                                        fontFamily: 'Roboto-Bold',
                                                        color:
                                                            this.props.Primary_Color === ''
                                                                ? colors.BLUE
                                                                : this.props.Primary_Color,
                                                        paddingVertical: heightPercentageToDP(1),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {`${upperFirst(startCase(item.status))}`}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.5),
                                                        fontFamily: 'Roboto-Bold',
                                                        color:
                                                            this.props.Primary_Color === ''
                                                                ? colors.BLUE
                                                                : this.props.Primary_Color,
                                                        paddingVertical: heightPercentageToDP(1),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {this.props.selectedLanguage.total}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.5),
                                                        fontFamily: 'Roboto-Bold',
                                                        color: this.props.color
                                                            ? this.props.color
                                                            : colors.BLUE,
                                                        paddingVertical: heightPercentageToDP(1),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {`${currency} ${numeral(item.total_price)
                                                        .format('0,0a')
                                                        .toUpperCase()}`}
                                                </Text>
                                            </View>
                                        </>
                                    ) : null}
                                </View>

                                {/* <View
                        style={{
                            borderBottomLeftRadius: scale.w(2.0),
                            borderBottomRightRadius: scale.w(0.2),
                            paddingVertical: scale.w(1.8),
                            backgroundColor: color || colors.LIGHT_BLUE,
                        }}
                    >
                        <H3 fontSize={scale.w(2.2)} textAlign="center" color="#fff">
                            {`Status: ${upperFirst(startCase(item.status))}`}
                        </H3>
                    </View> */}
                            </View>
                        </DropShadow>
                    );
            }
        } else if (item.request_type == 'restaurant') {
            if (this.state.display != 'bookings') {
                if (item.dishes)
                    return (
                        <DropShadow
                            style={{
                                width: widthPercentageToDP(100),
                                shadowOffset: {
                                    width: 20,
                                    height: 19,
                                },
                                shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                                shadowOpacity: 0.09,
                                shadowRadius: 30,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: widthPercentageToDP(5),
                            }}
                        >
                            <View style={styles.item_container}>
                                <View style={[styles.secondary_container, { backgroundColor: '#fff' }]}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <H3
                                            fontFamily={'Roboto-Bold'}
                                            textAlign="center"
                                            color={'#6D6D6D'}
                                            fontSize={scale.w(2)}
                                        >
                                            {this.state.display == 'current'
                                                ? item.restaurant?.name
                                                : moment(item.datetime).format('DD, MMM YYYY')}
                                        </H3>
                                        {item.status == 'rejected' || item.status == 'done' ? (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.handleDeleteOrder(item.id);
                                                }}
                                            >
                                                <Icon color="red" size={18} name={'times-circle'} />
                                            </TouchableOpacity>
                                        ) : (
                                            !item.loader &&
                                            item.status == 'pending' && (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        const tempArr = Object.assign(
                                                            [],
                                                            this.props.currentOrder,
                                                        );
                                                        tempArr[index]['loader'] = true;
                                                        // this.props.trackingProgressOrderRoomServiceSuccess(tempArr);
                                                        Alert.alert(
                                                            'Attention!',
                                                            'You want to cancel the order?',
                                                            [
                                                                {
                                                                    text: 'Cancel',
                                                                    onPress: () =>
                                                                        console.log('Cancel Pressed'),
                                                                    style: 'cancel',
                                                                },
                                                                {
                                                                    text: 'OK',
                                                                    onPress: () => {
                                                                        this.props.deleteOrder(
                                                                            item.id,
                                                                            () => {
                                                                                this._fetch();
                                                                            },
                                                                            () => {},
                                                                        );
                                                                    },
                                                                },
                                                            ],
                                                        );
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: scale.w(1.8),
                                                            color:
                                                                this.props.Primary_Color === ''
                                                                    ? colors.BLUE
                                                                    : this.props.Primary_Color,
                                                        }}
                                                    >
                                                        {this.props.selectedLanguage.cancel}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        )}
                                    </View>
                                    <View style={{ marginTop: heightPercentageToDP(1) }}>
                                        {item.dishes?.map((dish, index) => {
                                            return (
                                                <View
                                                    key={`${dish?.name}_${index}`}
                                                    style={styles.menu_container}
                                                >
                                                    {/* <H3 fontSize={scale.w(1.9)} color={'#4B4B4B'}>{`${index + 1}.`}</H3> */}
                                                    <View style={{ flex: 1 }}>
                                                        <H3 fontSize={scale.w(1.5)} color={'#4B4B4B'}>
                                                            {dish?.name}
                                                        </H3>
                                                        {this.state.display == 'current' ? null : (
                                                            <H3 fontSize={scale.w(1.2)} color={colors.GREY}>
                                                                {moment(item.datetime).format('LLL')}
                                                            </H3>
                                                        )}
                                                    </View>
                                                    <H3
                                                        fontFamily={'Roboto-Medium'}
                                                        fontSize={scale.w(1.5)}
                                                        color={
                                                            this.props.color ? this.props.color : colors.BLUE
                                                        }
                                                    >
                                                        {`${currency} ${dish.price * dish.qty}`}
                                                    </H3>
                                                </View>
                                            );
                                        })}
                                    </View>

                                    {this.state.display == 'current' ? (
                                        <>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.5),
                                                        fontFamily: 'Roboto-Bold',
                                                        color:
                                                            this.props.Primary_Color === ''
                                                                ? colors.BLUE
                                                                : this.props.Primary_Color,
                                                        paddingVertical: heightPercentageToDP(1),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {this.props.selectedLanguage.status}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.5),
                                                        fontFamily: 'Roboto-Bold',
                                                        color:
                                                            this.props.Primary_Color === ''
                                                                ? colors.BLUE
                                                                : this.props.Primary_Color,
                                                        paddingVertical: heightPercentageToDP(1),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {`${upperFirst(startCase(item.status))}`}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.5),
                                                        fontFamily: 'Roboto-Bold',
                                                        color:
                                                            this.props.Primary_Color === ''
                                                                ? colors.BLUE
                                                                : this.props.Primary_Color,
                                                        paddingVertical: heightPercentageToDP(1),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {this.props.selectedLanguage.total}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.5),
                                                        fontFamily: 'Roboto-Bold',
                                                        color: this.props.color
                                                            ? this.props.color
                                                            : colors.BLUE,
                                                        paddingVertical: heightPercentageToDP(1),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {`${currency} ${item.total_price}`}
                                                    {/* {`${currency} ${numeral(item.total_price)
                                                        .format('0,0a')
                                                        .toUpperCase()}`} */}
                                                </Text>
                                            </View>
                                        </>
                                    ) : null}
                                </View>
                            </View>
                        </DropShadow>
                    );
            } else
                return (
                    <DropShadow
                        style={{
                            width: widthPercentageToDP(100),
                            shadowOffset: {
                                width: 20,
                                height: 19,
                            },
                            shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                            shadowOpacity: 0.09,
                            shadowRadius: 30,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: widthPercentageToDP(5),
                        }}
                    >
                        <View style={styles.item_container}>
                            <View style={[styles.secondary_container, { backgroundColor: '#fff' }]}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <H3
                                        fontFamily={'Roboto-Bold'}
                                        textAlign="center"
                                        color={'#6D6D6D'}
                                        fontSize={scale.w(2)}
                                    >
                                        {this.state.display == 'current'
                                            ? item.restaurant?.name
                                            : moment(item.booking_date).format('DD, MMM YYYY')}
                                    </H3>
                                    {item.status == 'rejected' || item.status == 'done' ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.handleDeleteOrder(item.id);
                                            }}
                                        >
                                            <Icon color="red" size={18} name={'times-circle'} />
                                        </TouchableOpacity>
                                    ) : (
                                        !item.loader &&
                                        item.status == 'pending' && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    const tempArr = Object.assign(
                                                        [],
                                                        this.props.currentOrder,
                                                    );
                                                    tempArr[index]['loader'] = true;
                                                    // this.props.trackingProgressOrderRoomServiceSuccess(tempArr);
                                                    Alert.alert(
                                                        'Attention!',
                                                        'You want to cancel the order?',
                                                        [
                                                            {
                                                                text: 'Cancel',
                                                                onPress: () => console.log('Cancel Pressed'),
                                                                style: 'cancel',
                                                            },
                                                            {
                                                                text: 'OK',
                                                                onPress: () => {
                                                                    this.props.deleteReservationOrder(
                                                                        item.id,
                                                                        () => {
                                                                            this._fetch();
                                                                        },
                                                                        () => {},
                                                                    );
                                                                },
                                                            },
                                                        ],
                                                    );
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: scale.w(1.8),
                                                        color:
                                                            this.props.Primary_Color === ''
                                                                ? colors.BLUE
                                                                : this.props.Primary_Color,
                                                    }}
                                                >
                                                    {this.props.selectedLanguage.cancel}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    )}
                                </View>
                                <View style={{ height: heightPercentageToDP(2) }} />

                                {item?.people_number && (
                                    <View style={styles.menu_container}>
                                        {/* <H3 fontSize={scale.w(1.9)} color={'#4B4B4B'}>{`${index + 1}.`}</H3> */}
                                        <View style={{ flex: 1 }}>
                                            <H3 fontSize={scale.w(1.5)} color={'#4B4B4B'}>
                                                Number of people
                                            </H3>
                                        </View>
                                        <H3
                                            fontFamily={'Roboto-Medium'}
                                            fontSize={scale.w(1.5)}
                                            color={this.state.display == 'current' ? '#4B4B4B' : colors.BLUE}
                                        >
                                            {item?.people_number}
                                        </H3>
                                    </View>
                                )}
                                {item?.vip_note && (
                                    <View style={styles.menu_container}>
                                        {/* <H3 fontSize={scale.w(1.9)} color={'#4B4B4B'}>{`${index + 1}.`}</H3> */}
                                        <H3 fontSize={scale.w(1.5)} color={'#4B4B4B'}>
                                            {this.props.selectedLanguage.note}
                                        </H3>
                                        <View style={{ width: widthPercentageToDP(2) }} />
                                        <View
                                            style={{
                                                marginHorizontal: widthPercentageToDP(4),
                                                alignItems: 'flex-end',
                                                width: '84%',
                                            }}
                                        >
                                            <H3
                                                fontFamily={'Roboto-Medium'}
                                                fontSize={scale.w(1.5)}
                                                color={
                                                    this.state.display == 'current' ? '#4B4B4B' : colors.BLUE
                                                }
                                            >
                                                {item?.vip_note}
                                            </H3>
                                        </View>
                                    </View>
                                )}
                                {item?.table_no && (
                                    <View style={styles.menu_container}>
                                        {/* <H3 fontSize={scale.w(1.9)} color={'#4B4B4B'}>{`${index + 1}.`}</H3> */}
                                        <View style={{ flex: 1 }}>
                                            <H3 fontSize={scale.w(1.5)} color={'#4B4B4B'}>
                                                {this.props.selectedLanguage.table_no}
                                            </H3>
                                        </View>
                                        <H3
                                            fontFamily={'Roboto-Medium'}
                                            fontSize={scale.w(1.5)}
                                            color={this.state.display == 'current' ? '#4B4B4B' : colors.BLUE}
                                        >
                                            {item?.table_no}
                                        </H3>
                                    </View>
                                )}
                                {this.state.display == 'current' ? (
                                    <>
                                        <View
                                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.5),
                                                    fontFamily: 'Roboto-Bold',
                                                    color:
                                                        this.props.Primary_Color === ''
                                                            ? colors.BLUE
                                                            : this.props.Primary_Color,
                                                    paddingVertical: heightPercentageToDP(1),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {this.props.selectedLanguage.status}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.5),
                                                    fontFamily: 'Roboto-Bold',
                                                    color:
                                                        this.props.Primary_Color === ''
                                                            ? colors.BLUE
                                                            : this.props.Primary_Color,
                                                    paddingVertical: heightPercentageToDP(1),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {`${upperFirst(startCase(item.status))}`}
                                            </Text>
                                        </View>
                                        <View
                                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.5),
                                                    fontFamily: 'Roboto-Bold',
                                                    color:
                                                        this.props.Primary_Color === ''
                                                            ? colors.BLUE
                                                            : this.props.Primary_Color,
                                                    paddingVertical: heightPercentageToDP(1),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {this.props.selectedLanguage.total}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: scale.w(1.5),
                                                    fontFamily: 'Roboto-Bold',
                                                    color: this.props.color ? this.props.color : colors.BLUE,
                                                    paddingVertical: heightPercentageToDP(1),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {`${currency} ${numeral(item.total_price)
                                                    .format('0,0a')
                                                    .toUpperCase()}`}
                                            </Text>
                                        </View>
                                    </>
                                ) : null}
                            </View>
                        </View>
                    </DropShadow>
                );
        }
    }

    _handleChat() {
        Navigation.push(this.props.componentId, chat({ from: 'restaurant' }));
    }

    _renderListHeaderComponent() {
        return <View style={{ height: heightPercentageToDP(3) }} />;
    }

    _renderListFooterComponent() {
        return <View style={{ height: 20 }} />;
    }

    _renderListEmptyComponent() {
        return (
            <View style={{ marginTop: scale.h(22.0) }}>
                {this.state.loadingGet ? (
                    <View
                        style={{
                            width: scale.w(23.0),
                            height: scale.h(10.0),
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // backgroundColor:'red'
                        }}
                    >
                        <Image
                            resizeMode="contain"
                            style={{
                                width: widthPercentageToDP(30),
                                marginTop: scale.h(-4.0),
                                tintColor: this.props.color,
                            }}
                            source={{ uri: this.state.chainData.data.logo_gif_dark }}
                        />
                    </View>
                ) : (
                    <H3 fontSize={scale.w(1.8)} textAlign="center">
                        {this.state.display == 'current'
                            ? `${this.props.selectedLanguage.no_current_orders}`
                            : `${this.props.selectedLanguage.no_previous_orders}`}
                    </H3>
                )}
            </View>
        );
    }

    render() {
        const { display, loadingGet } = this.state;
        const { current_orders, previous_orders, live_chat, orders } = this.props.selectedLanguage;
        const { color } = this.props;

        return (
            <KeyboardAvoidingView style={base.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: heightPercentageToDP(20), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: this.props.color,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && <StatusBar backgroundColor={this.props.color}></StatusBar>}
                <View style={{ flex: 1 }}>
                    <RootContainer>
                        <View style={{ height: heightPercentageToDP(14), backgroundColor: this.props.color }}>
                            {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                            <Navbar titleColor={colors.WHITE} onClick={this._handleBack} title={orders} />
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
                            <DropShadow
                                style={{
                                    width: widthPercentageToDP(100),
                                    shadowOffset: {
                                        width: 20,
                                        height: 19,
                                    },
                                    shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                                    shadowOpacity: 0.09,
                                    shadowRadius: 30,
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: widthPercentageToDP(5),
                                }}
                            >
                                <View
                                    style={{
                                        height: heightPercentageToDP(7),
                                        flexDirection: 'row',
                                        width: widthPercentageToDP(90),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        marginTop: heightPercentageToDP(3),
                                    }}
                                >
                                    <TouchableOpacity
                                        style={[
                                            {
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRightWidth: 0,
                                                borderWidth: 1,
                                                borderColor:
                                                    colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR ||
                                                    colors.LIGHT_BLUE,
                                                borderTopLeftRadius: scale.w(1.5),
                                                paddingVertical: heightPercentageToDP(0.5),
                                                paddingHorizontal: widthPercentageToDP(3),
                                                width: widthPercentageToDP(30),
                                                borderBottomLeftRadius: scale.w(1.5),
                                            },
                                            display == 'current'
                                                ? { backgroundColor: color || colors.LIGHT_BLUE }
                                                : { backgroundColor: '#fff' },
                                        ]}
                                        onPress={() => {
                                            this.setState({ display: 'current' });
                                        }}
                                    >
                                        <H3
                                            textAlign="center"
                                            fontSize={scale.w(1.9)}
                                            color={display == 'current' ? '#fff' : '#8e8e8e'}
                                        >
                                            {current_orders}
                                        </H3>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            {
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderWidth: 1,
                                                borderColor:
                                                    colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR ||
                                                    colors.LIGHT_BLUE,
                                                paddingVertical: heightPercentageToDP(0.5),
                                                paddingHorizontal: widthPercentageToDP(3),
                                                width: widthPercentageToDP(30),
                                            },
                                            display == 'history'
                                                ? { backgroundColor: color || colors.LIGHT_BLUE }
                                                : { backgroundColor: '#fff' },
                                        ]}
                                        onPress={() => {
                                            this.setState({ display: 'history' });
                                        }}
                                    >
                                        <H3
                                            textAlign="center"
                                            fontSize={scale.w(1.9)}
                                            color={display == 'history' ? '#fff' : '#8e8e8e'}
                                        >
                                            {previous_orders}
                                        </H3>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            {
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderWidth: 1,
                                                borderColor:
                                                    colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR ||
                                                    colors.LIGHT_BLUE,
                                                borderTopRightRadius: scale.w(1.5),
                                                borderBottomRightRadius: scale.w(1.5),
                                                paddingVertical: heightPercentageToDP(1.8),
                                                width: widthPercentageToDP(30),
                                                alignSelf: 'center',
                                            },
                                            display == 'bookings'
                                                ? { backgroundColor: color || colors.LIGHT_BLUE }
                                                : { backgroundColor: '#fff' },
                                        ]}
                                        onPress={() => {
                                            this.setState({ display: 'bookings' });
                                        }}
                                    >
                                        <H3
                                            textAlign="center"
                                            fontSize={scale.w(1.9)}
                                            color={display == 'bookings' ? '#fff' : '#8e8e8e'}
                                        >
                                            {this.props.selectedLanguage.bookings_text}
                                        </H3>
                                    </TouchableOpacity>
                                </View>
                            </DropShadow>
                            <FlatList
                                refreshControl={<RefreshControl refreshing={false} onRefresh={this._fetch} />}
                                data={
                                    display === 'current'
                                        ? this.props.currentOrder
                                        : display == 'bookings'
                                        ? this.state.bookings
                                        : this.props.previousOrder
                                }
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                ListEmptyComponent={this._renderListEmptyComponent}
                                renderItem={this._renderItem}
                                ListHeaderComponent={this._renderListHeaderComponent}
                                ListFooterComponent={this._renderListFooterComponent}
                                ItemSeparatorComponent={this._renderListFooterComponent}
                                initialNumToRender={10}
                            />

                            {/* <Animatable.View
                        useNativeDriver
                        animation="fadeIn"
                        duration={300}
                        style={styles.btn_chat_container}
                    >
                        <ButtonPrimary
                            onPress={this._handleChat}
                            text={live_chat}
                            backgroundColor={color || colors.LIGHT_BLUE}
                            fontSize={scale.w(1.6)}
                        />
                        <View style={{ height: heightPercentageToDP(2) }} />
                    </Animatable.View> */}
                            <SafeAreaView />
                        </View>
                    </RootContainer>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    item_container: {
        width: widthPercentageToDP(90),
        borderRadius: scale.w(2.5),
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR,
    },
    secondary_container: {
        borderRadius: 50,
        paddingVertical: heightPercentageToDP(2),
        paddingHorizontal: heightPercentageToDP(2.9),
    },
    menu_container: {
        flexDirection: 'row',
        borderBottomWidth: heightPercentageToDP(0.2),
        paddingBottom: heightPercentageToDP(1.5),
        marginTop: heightPercentageToDP(1.5),
        borderColor: colors.LIGHT_GREY,
        alignItems: 'center',
    },
    btn_chat_container: {
        paddingHorizontal: heightPercentageToDP(5.7),
        paddingVertical: heightPercentageToDP(1.2),
        // paddingHorizontal: scale.w(5.7),
        // paddingVertical: scale.w(1.2),
    },
});

const shadowOpt = {
    width: screenWidth,
    height: scale.w(5.0),
    color: '#000',
    border: 6,
    radius: 1,
    opacity: 0.2,
    x: 0,
    y: 6,
    style: { marginBottom: scale.w(0.9), marginTop: scale.w(2.5) },
};

export default TrackingProgress;
