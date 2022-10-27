import React from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    Platform,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Image,
    ActivityIndicator,
} from 'react-native';
import base from '../../utils/baseStyles';
import { heightPercentageToDP, scale, screenWidth } from '../../utils/dimensions';
import { H3 } from '../_global/Text';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { ITrackingProgressOrderRoomService } from '../../types/restaurant';
import { ITrackingProgressReduxProps } from './TrackingProgres.Container';
import colors from '../../constants/colors';
import { upperFirst, startCase } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import { chat } from '../../utils/navigationControl';
import { BoxShadow } from 'react-native-shadow';
import Icon from 'react-native-vector-icons/FontAwesome5';
import numeral from 'numeral';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { trackingProgressOrderRoomServiceSuccess } from '../../actions/action.restaurant';

interface ITrackingProgressProps extends ITrackingProgressReduxProps {
    componentId: string;
}

interface ITrackingProgressState {
    display: 'current' | 'history';
    loadingGet: boolean;
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

class TrackingProgress extends React.Component<ITrackingProgressProps, ITrackingProgressState> {
    constructor(props: ITrackingProgressProps) {
        super(props);

        this.state = {
            display: 'current',
            loadingGet: false,
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
        this.handleDeleteOrder = this.handleDeleteOrder.bind(this);
    }

    componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        });
        // this.props.trackingProgressOrderRoomService();
        this._fetch();
    }

    _fetch() {
        // console.log('')
        this.setState({ loadingGet: true });
        this.props.trackingProgressOrderRoomService(
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

    _keyExtractor(item: ITrackingProgressOrderRoomService) {
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

    _renderItem({ item, index }: { item: ITrackingProgressOrderRoomService; index: any }) {
        const { color, currency } = this.props;
        console.log(item);
        return (
            <View style={styles.item_container}>
                <View style={[styles.secondary_container, { backgroundColor: '#fff' }]}>
                    <View
                        style={{
                            alignItems: 'flex-end',
                        }}
                    >
                        {item.status == 'rejected' || item.status == 'done' ? (
                            <TouchableOpacity
                                onPress={() => {
                                    this.handleDeleteOrder(item.id);
                                }}
                            >
                                <Icon color="red" size={18} name={'times-circle'} />
                            </TouchableOpacity>
                        ) : (
                            <View />
                        )}
                    </View>
                    <H3 textAlign="center" color={'#6D6D6D'} fontSize={scale.w(27)}>
                        {item.restaurant?.name}
                    </H3>

                    <View style={{ marginTop: scale.w(20) }}>
                        {item.dishes?.map((dish, index) => {
                            return (
                                <View key={`${dish?.name}_${index}`} style={styles.menu_container}>
                                    <H3 fontSize={scale.w(19)} color={'#4B4B4B'}>{`${index + 1}.`}</H3>
                                    <View style={{ flex: 1, marginHorizontal: scale.w(10) }}>
                                        <H3 fontSize={scale.w(19)} color={'#4B4B4B'}>
                                            {dish?.name}
                                        </H3>
                                    </View>
                                    <H3 fontSize={scale.w(19)} color={'#4B4B4B'}>
                                        {`${currency}${numeral(dish?.price * dish?.qty)
                                            .format('0,0a')
                                            .toUpperCase()}`}
                                    </H3>
                                </View>
                            );
                        })}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <H3 fontSize={scale.w(22)} color={'#4B4B4B'}>
                            {`Total price: ${currency}${numeral(item?.total_price)
                                .format('0,0a')
                                .toUpperCase()}`}
                        </H3>
                    </View>
                </View>

                <View
                    style={{
                        paddingVertical: scale.w(18),
                        borderBottomLeftRadius: item.status == 'pending' ? 0 : scale.w(20),
                        borderBottomRightRadius: item.status == 'pending' ? 0 : scale.w(20),
                        backgroundColor: color || colors.LIGHT_BLUE,
                    }}
                >
                    <H3 fontSize={scale.w(22)} textAlign="center" color="#fff">
                        {`Status: ${upperFirst(startCase(item?.status))}`}
                    </H3>
                </View>
                {item.loader && (
                    <View
                        style={{
                            borderBottomLeftRadius: scale.w(20),
                            borderBottomRightRadius: scale.w(20),
                            paddingVertical: scale.w(18),
                            backgroundColor: colors.RED,
                        }}
                    >
                        <ActivityIndicator color="white" size="large"></ActivityIndicator>
                    </View>
                )}
                {!item.loader && item.status == 'pending' && (
                    <TouchableOpacity
                        style={{
                            borderBottomLeftRadius: scale.w(20),
                            borderBottomRightRadius: scale.w(20),
                            paddingVertical: scale.w(18),
                            backgroundColor: colors.RED,
                        }}
                        onPress={() => {
                            const tempArr = Object.assign([], this.props.currentOrder);
                            tempArr[index]['loader'] = true;
                            this.props.trackingProgressOrderRoomServiceSuccess(tempArr);
                            this.props.deleteOrder(
                                item.id,
                                () => {
                                    this._fetch();
                                },
                                () => {},
                            );
                        }}
                    >
                        <H3 fontSize={scale.w(22)} textAlign="center" color="#fff">
                            {this.props.selectedLanguage.cancel}
                        </H3>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    _handleChat() {
        Navigation.push(this.props.componentId, chat({ from: 'restaurant' }));
    }

    _renderListHeaderComponent() {
        return <View style={{ height: 40 }} />;
    }

    _renderListFooterComponent() {
        return <View style={{ height: 20 }} />;
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
                                source={{ uri: this.state.chainData.data.logo_gif_dark }}
                            />
                        ) : (
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                source={{ uri: this.state.chainData.data.logo_gif_dark }}
                            />
                        )}
                    </View>
                ) : (
                    <H3 fontSize={scale.w(18)} textAlign="center">
                        {this.state.display == 'current'
                            ? this.props.selectedLanguage.no_current_orders
                            : this.props.selectedLanguage.no_previous_orders}
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
            <View style={base.container}>
                <Navbar color={color} onClick={this._handleBack} title={orders} />

                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            height: scale.w(54),
                            flexDirection: 'row',
                            width: scale.w(375),
                            paddingLeft: scale.w(25),
                            marginTop: scale.h(20),
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                {
                                    width: scale.w(154),
                                    height: scale.w(50),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: color || colors.LIGHT_BLUE,
                                    borderRightWidth: 0,
                                    borderTopLeftRadius: scale.w(15),
                                    borderBottomLeftRadius: scale.w(15),
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
                                fontSize={scale.w(18)}
                                color={display == 'current' ? '#fff' : '#8e8e8e'}
                            >
                                {current_orders}
                            </H3>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                {
                                    width: scale.w(154),
                                    height: scale.w(50),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: color || colors.LIGHT_BLUE,
                                    borderTopRightRadius: scale.w(15),
                                    borderBottomRightRadius: scale.w(15),
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
                                fontSize={scale.w(18)}
                                color={display == 'history' ? '#fff' : '#8e8e8e'}
                            >
                                {previous_orders}
                            </H3>
                        </TouchableOpacity>

                        {/* <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ display: 'current' })}
                                    disabled={display === 'current'}
                                    activeOpacity={1}
                                >
                                    <View
                                        style={{
                                            paddingVertical: scale.w(14),
                                            backgroundColor: display === 'current' ? '#eaeaea' : '#fff',
                                        }}
                                    >
                                        <H3 textAlign="center" fontSize={scale.w(18)} color="#8e8e8e">
                                            {current_orders}
                                        </H3>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ display: 'history' })}
                                    disabled={display === 'history'}
                                    activeOpacity={1}
                                >
                                    <View
                                        style={{
                                            paddingVertical: scale.w(14),
                                            backgroundColor: display === 'history' ? '#eaeaea' : '#fff',
                                        }}
                                    >
                                        <H3 textAlign="center" fontSize={scale.w(18)} color="#8e8e8e">
                                            {previous_orders}
                                        </H3>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View> */}
                    </View>

                    <FlatList
                        refreshControl={<RefreshControl refreshing={false} onRefresh={this._fetch} />}
                        data={display === 'current' ? this.props.currentOrder : this.props.previousOrder}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        ListEmptyComponent={this._renderListEmptyComponent}
                        renderItem={this._renderItem}
                        ListHeaderComponent={this._renderListHeaderComponent}
                        ListFooterComponent={this._renderListFooterComponent}
                        ItemSeparatorComponent={this._renderListFooterComponent}
                        initialNumToRender={10}
                    />

                    <Animatable.View
                        useNativeDriver
                        animation="fadeIn"
                        duration={300}
                        style={styles.btn_chat_container}
                    >
                        <ButtonPrimary
                            onPress={this._handleChat}
                            text={live_chat}
                            backgroundColor={color || colors.LIGHT_BLUE}
                            chainData={this.props.chainData}
                        />
                    </Animatable.View>
                    <SafeAreaView />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item_container: {
        marginHorizontal: scale.w(25),
        width: scale.w(265),
        borderRadius: scale.w(20),
        backgroundColor: '#fff',
        alignSelf: 'center',
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
    secondary_container: {
        borderRadius: 50,
        paddingVertical: scale.w(18),
        paddingHorizontal: scale.w(24),
    },
    menu_container: {
        flexDirection: 'row',
        marginBottom: scale.w(18),
    },
    btn_chat_container: {
        paddingHorizontal: scale.w(57),
        paddingVertical: scale.w(12),
    },
});

const shadowOpt = {
    width: screenWidth,
    height: scale.w(50),
    color: '#000',
    border: 6,
    radius: 1,
    opacity: 0.2,
    x: 0,
    y: 6,
    style: { marginBottom: scale.w(9), marginTop: scale.w(25) },
};

export default TrackingProgress;
