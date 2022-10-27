import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import base from '../../utils/baseStyles';
import { scale } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { spaBookingTime, hotelMap } from '../../utils/navigationControl';
import MenuButton from '../_global/MenuButton';
import { IHotelMapReduxProps } from './HotelMap.Container';
import Carousel from 'react-native-snap-carousel';
import { screenWidth } from '../../utils/dimensions';
import { IExperience, IExperienceHotelMap } from '../../types/experience';
import { promotionService } from '../../utils/navigationControl';

export interface IHotelMapProps extends IHotelMapReduxProps {
    componentId: string;
    hotelMap: IExperienceHotelMap;
}

interface IHotelMapState {}

class HotelMap extends React.Component<IHotelMapProps, IHotelMapState> {
    constructor(props: IHotelMapProps) {
        super(props);

        this.state = {};

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        // this._handlePromotions = this._handlePromotions.bind(this);
        // this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
    }

    componentDidMount() {
        // this.props.getExperience();
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    // _handlePromotions() {
    //     Navigation.push(this.props.componentId, promotionService);
    //     // Navigation.push(
    //     //     this.props.componentId,
    //     //     spaBookingTime({
    //     //         isReserveSpaType: true,
    //     //         spa: this.props.spa,
    //     //     }),
    //     // );
    // }

    // _handleHotelMap() {
    //     // Navigation.push(
    //     //     this.props.componentId,
    //     //     spaBookingTime({
    //     //         isReserveSpaType: false,
    //     //         spa: this.props.spa,
    //     //     }),
    //     // );
    // }

    // _handleShuttleBusService() {
    //     // Navigation.push(
    //     //     this.props.componentId,
    //     //     spaBookingTime({
    //     //         isReserveSpaType: false,
    //     //         spa: this.props.spa,
    //     //     }),
    //     // );
    // }

    render() {
        const { color } = this.props;

        return (
            <View style={base.container}>
                <Navbar
                    isViolet={color === ''}
                    color={color}
                    onClick={this._handleBack}
                    title={'Hotel Map'}
                />
                {/* <View style = {styles.allButtons}>
                <View style={styles.menu_btn_container}>
                        <MenuButton
                            onPress={this._handlePromotions}
                            source={require('../../images/icon_request_items.png')}
                            text={'Promotions'}
                            width={scale.w(265)}
                            height={scale.w(150)}
                            iconSize={scale.w(118)}
                            fontSize={scale.w(20)}
                            styleImage={{
                                marginTop: scale.w(-15),
                                marginBottom: scale.w(-15),
                                tintColor: color,
                            }}
                        />
                    </View>
                    <View style={styles.menu_btn_container}>
                        <MenuButton
                            onPress={this._handleHotelMap}
                            source={require('../../images/icon_vacuum.png')}
                            text="Hotel Map"
                            width={scale.w(265)}
                            height={scale.w(150)}
                            iconSize={scale.w(70)}
                            fontSize={scale.w(20)}
                            // disabled={this.state.loading}
                            styleImage={{ tintColor: this.props.color }}
                        />
                    </View>

                    <View style={styles.menu_btn_container}>
                        <MenuButton
                            onPress={this._handleShuttleBusService}
                            source={require('../../images/icon_laundry.png')}
                            text="Shuttle Bus Service"
                            width={scale.w(265)}
                            height={scale.w(150)}
                            iconSize={scale.w(70)}
                            fontSize={scale.w(20)}
                            styleImage={{ tintColor: this.props.color }}
                        />
                    </View>
                </View> */}
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
        // paddingVertical: scale.w(10),
        marginBottom: scale.w(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '100%',
        height: scale.w(200),
        resizeMode: 'contain',
        marginTop: scale.w(20),
    },
    allButtons: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale.w(60),
    },
});

export default HotelMap;
