import React from 'react';
import { TouchableOpacity, Platform, Image, ImageStyle, View, Text } from 'react-native';
import colors from '../../constants/colors';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../utils/dimensions';

interface IOrderAndBookingProps {
    onPressBookings: () => void;
    onPressOrders: () => void;
    disabled?: boolean;
    text2: string;
    text3: string;
    bookings: number;
    orders: number;
    backgroundColor: string;
    selectedLanguage: any
}

class OrderAndBooking extends React.PureComponent<IOrderAndBookingProps> {
    render() {

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }} >
                <TouchableOpacity onPress={this.props.onPressBookings} activeOpacity={1} style={{ width: widthPercentageToDP(42.5), justifyContent: 'center', alignItems: 'center', height: heightPercentageToDP(10), backgroundColor: this.props.backgroundColor, borderTopLeftRadius: scale.w(1.5), borderBottomLeftRadius: scale.w(1.5) }} >
                    <Text style={{ color: colors.WHITE, fontSize: scale.w(1.3) }} >{this.props.selectedLanguage.bookings_text}</Text>
                    <Text style={{ color: colors.WHITE, fontSize: scale.w(2.1), fontFamily: 'Roboto-Bold' }} >{this.props.bookings}</Text>
                </TouchableOpacity>
                <View style={{
                    position: 'absolute', justifyContent: 'center'
                }} >
                    <View style={{ height: heightPercentageToDP(4), width: widthPercentageToDP(8), borderRadius: widthPercentageToDP(8) / 2, backgroundColor: colors.WHITE, marginTop: -heightPercentageToDP(2.2) }} ></View>
                    <View style={{ width: 1, height: heightPercentageToDP(3.5), backgroundColor: colors.WHITE, alignSelf: 'center', marginTop: heightPercentageToDP(1.3), opacity: .85 }} ></View>
                    <View style={{ height: heightPercentageToDP(4), width: widthPercentageToDP(8), borderRadius: widthPercentageToDP(8) / 2, backgroundColor: colors.WHITE, marginTop: heightPercentageToDP(1.4) }} ></View>
                </View>
                <TouchableOpacity onPress={this.props.onPressOrders} activeOpacity={1} style={{ width: widthPercentageToDP(42.5), justifyContent: 'center', alignItems: 'center', height: heightPercentageToDP(10), backgroundColor: this.props.backgroundColor, borderTopRightRadius: scale.w(1.5), borderBottomRightRadius: scale.w(1.5), zIndex: -1 }} >
                    <Text style={{ color: colors.WHITE, fontSize: scale.w(1.3) }} >{this.props.selectedLanguage.orders}</Text>
                    <Text style={{ color: colors.WHITE, fontSize: scale.w(2.1), fontFamily: 'Roboto-Bold' }} >{this.props.orders}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default OrderAndBooking;
