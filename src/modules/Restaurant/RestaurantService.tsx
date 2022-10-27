import React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import base from '../../utils/baseStyles';
import { scale, heightPercentageToDP } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { orderRoomService, bookATable } from '../../utils/navigationControl';
import { IRestaurant } from '../../types/restaurant';
import MenuButton from '../_global/MenuButton';
import Carousel from 'react-native-snap-carousel';
import { screenWidth } from '../../utils/dimensions';
import { Text } from 'react-native-animatable';
import { selectLanguage } from '../../actions/action.language';

export interface IRestaurantServiceProps {
    componentId: string;
    restaurant: IRestaurant;
    color?: string;
    selectedLanguage?: any;
    dynamic_buttons: any;
    type: any;
    backData?: any;
    restoGuest: any;
}

interface IRestaurantServiceState { }

class RestaurantService extends React.Component<IRestaurantServiceProps, IRestaurantServiceState> {
    constructor(props: IRestaurantServiceProps) {
        super(props);

        this.state = {};

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleBookATable = this._handleBookATable.bind(this);
        this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handleBookATable() {
        Navigation.push(this.props.componentId, bookATable({ restaurant: this.props.restaurant }));
    }

    _handleOrderRoomService() {
        Navigation.push(this.props.componentId, orderRoomService({ restaurant: this.props.restaurant }));
    }

    render() {
        const { restaurant, color, dynamic_buttons, selectedLanguage } = this.props;
        const button_1 = dynamic_buttons.restaurant[0].button_slug;
        const button_2 = dynamic_buttons.restaurant[1].button_slug;
        console.log('button_2', button_2);
        console.log('selecte language', selectedLanguage);
        return (
            <View style={base.container}>
                <Navbar
                    isBrown={color === ''}
                    color={color}
                    onClick={this._handleBack}
                    title={restaurant.name}
                />
                <View style={{ justifyContent: 'center', marginTop: scale.w(20) }}>
                    <Carousel
                        ref={'carousel'}
                        autoplayInterval={5000}
                        data={[restaurant.logo_url, ...restaurant.galleries]}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    width: scale.w(330),
                                    height: scale.h(220),
                                    alignSelf: 'center',
                                }}
                            >
                                <Image
                                    source={{ uri: item }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: scale.w(10),
                                    }}
                                />
                            </View>
                        )}
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth}
                        autoplay
                        loop
                    />
                    <TouchableOpacity
                        onPress={() => {
                            this.refs.carousel.snapToPrev();
                        }}
                        style={{
                            justifyContent: 'center',
                            position: 'absolute',
                            marginTop: heightPercentageToDP(17),
                            opacity: 0.4,
                        }}
                    >
                        <Image
                            source={require('../../images/icon_previous.png')}
                            style={{ width: scale.w(20), height: scale.w(20) }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.refs.carousel.snapToNext();
                        }}
                        style={{
                            justifyContent: 'center',
                            position: 'absolute',
                            marginTop: heightPercentageToDP(17),
                            alignSelf: 'flex-end',
                            opacity: 0.4,
                        }}
                    >
                        <Image
                            source={require('../../images/icon_next.png')}
                            style={{ width: scale.w(20), height: scale.w(20) }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: scale.w(20),
                        marginTop: scale.w(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View style={styles.menu_btn_container}>
                        <MenuButton
                            onPress={this._handleOrderRoomService}
                            source={require('../../images/icon_order_room_service.png')}
                            text={selectedLanguage[button_1]}
                            width={scale.w(155)}
                            height={scale.h(300)}
                            iconSize={scale.w(85)}
                            fontSize={scale.w(20)}
                            styleImage={{ marginBottom: -5, tintColor: color }}
                        />
                    </View>
                    <View style={styles.menu_btn_container}>
                        <MenuButton
                            onPress={this._handleBookATable}
                            source={require('../../images/icon_book_a_table.png')}
                            text={selectedLanguage[button_2]}
                            width={scale.w(155)}
                            height={scale.h(300)}
                            iconSize={scale.w(70)}
                            fontSize={scale.w(20)}
                            styleImage={{ tintColor: color }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text_container: {
        marginTop: scale.w(10),
        marginBottom: scale.w(20),
        marginHorizontal: scale.w(28),
    },
    image_container: {
        alignItems: 'center',
        marginTop: scale.w(60),
        marginBottom: scale.w(68),
    },
    menu_btn_container: {
        marginBottom: scale.w(10),
        alignItems: 'center',
    },
});

export default RestaurantService;
