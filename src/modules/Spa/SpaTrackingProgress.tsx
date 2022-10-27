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
} from 'react-native';
import base from '../../utils/baseStyles';
import { scale, screenWidth } from '../../utils/dimensions';
import { H3 } from '../_global/Text';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { ISpaTrackingProgressOrderRoomService } from '../../types/spa';
import { ISpaTrackingProgressReduxProps } from './spaTrackingProgres.Container';
import colors from '../../constants/colors';
import { upperFirst, startCase } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import { chat } from '../../utils/navigationControl';
import { BoxShadow } from 'react-native-shadow';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface ISpaTrackingProgressProps extends ISpaTrackingProgressReduxProps {
    componentId: string;
}

interface ITrackingProgressState {
    display: 'current' | 'history';
    data: Array<any>;
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

class TrackingProgress extends React.Component<ISpaTrackingProgressProps, ITrackingProgressState> {
    constructor(props: ISpaTrackingProgressProps) {
        super(props);

        this.state = {
            display: 'current',
            loadingGet: true,
            data: [],
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
    }

    componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        });
        this._fetch();
    }

    _fetch() {
        this.setState({ loadingGet: true });
        this.props.spaTrackingProgressOrderRoomService(
            () => {
                console.log('success');
            },
            () => {
                console.log('failed');
            },
        );
        setTimeout(() => {
            this.setState({
                data: this.props.currentOrder,
                loadingGet: false,
            });
        }, 5000);
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _keyExtractor(item: ISpaTrackingProgressOrderRoomService) {
        return item.booking_date.toString();
    }

    handleDelete(id: number) {
        this.props.deleteSpaOrder(
            id,
            () => {
                this._fetch();
            },
            () => {},
        );
    }

    _renderItem({ item }: { item: ISpaTrackingProgressOrderRoomService }) {
        const { color, currency } = this.props;
        console.log('item', item);
        return (
            <View style={styles.item_container}>
                <View style={[styles.secondary_container, { backgroundColor: '#fff' }]}>
                    <View
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
                    </View>
                    <H3 textAlign="center" color={'#6D6D6D'} fontSize={scale.w(27)}>
                        {item.booking_type == 'room_service' ? 'Room Service' : 'Normal Reservation'}
                    </H3>
                    <View style={{ marginTop: scale.w(10) }}>
                        {item.treatments.map((spa, index) => {
                            return (
                                <View key={index} style={styles.menu_container}>
                                    <H3 fontSize={scale.w(19)} color={'#4B4B4B'}>{`${index + 1}.`}</H3>
                                    <View style={{ flex: 1, marginHorizontal: scale.w(10) }}>
                                        <H3 fontSize={scale.w(19)} color={'#4B4B4B'}>
                                            {spa.name}
                                        </H3>
                                    </View>
                                    <H3 fontSize={scale.w(19)} color={'#4B4B4B'}>
                                        {`${currency}${Number(spa.price)}`}
                                    </H3>
                                </View>
                            );
                        })}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <H3 fontSize={scale.w(22)} color={'#4B4B4B'}>
                            {`Total price: ${currency}${item.total_price}`}
                        </H3>
                    </View>
                </View>

                <View
                    style={{
                        borderBottomLeftRadius: scale.w(20),
                        borderBottomRightRadius: scale.w(20),
                        paddingVertical: scale.w(18),
                        backgroundColor: color || colors.LIGHT_BLUE,
                    }}
                >
                    <H3 fontSize={scale.w(22)} textAlign="center" color="#fff">
                        {`Status: ${upperFirst(startCase(item.status))}`}
                    </H3>
                </View>
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
                                source={{ uri: this.state.chainData.data.logo_gif_light }}
                            />
                        ) : (
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                source={{ uri: this.state.chainData.data.logo_gif_light }}
                            />
                        )}
                    </View>
                ) : (
                    <H3 marginTop={scale.h(10)} fontSize={scale.w(18)} textAlign="center">
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
                                this.setState({
                                    data: [],
                                    loadingGet: true,
                                });
                                setTimeout(() => {
                                    this.setState({
                                        display: 'current',
                                        data: this.props.currentOrder,
                                        loadingGet: false,
                                    });
                                }, 2000);
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
                                this.setState({
                                    data: [],
                                    loadingGet: true,
                                });
                                setTimeout(() => {
                                    this.setState({
                                        display: 'history',
                                        data: this.props.previousOrder,
                                        loadingGet: false,
                                    });
                                }, 2000);
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
                    </View>
                    {this.state.loadingGet ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size={30} color={'black'} />
                        </View>
                    ) : this.state.data.length == 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Animatable.Text>No data is available to show</Animatable.Text>
                        </View>
                    ) : (
                        <FlatList
                            refreshControl={<RefreshControl refreshing={false} onRefresh={this._fetch} />}
                            data={this.state.data}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            ListHeaderComponent={this._renderListHeaderComponent}
                            ListFooterComponent={this._renderListFooterComponent}
                            ItemSeparatorComponent={this._renderListFooterComponent}
                            initialNumToRender={10}
                        />
                    )}
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
        paddingTop: scale.h(10),
        paddingBottom: scale.h(30),
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
