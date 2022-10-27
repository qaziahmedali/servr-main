import React from 'react';
import { TouchableOpacity, Platform, Image, ImageStyle, View, Text } from 'react-native';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../utils/dimensions';
import ArrowRight from '../../images/ArrowRight.svg';
import Switch from '../../images/Setting.svg';
import BlackArrowRight from '../../images/BlackArrowRight.svg';
import PersonalData from '../../images/PersonalData.svg';
import OrderHistory from '../../images/OrderHistory.svg';
import CardDetails from '../../images/CardDetails.svg';
import Help from '../../images/Help.svg';
import OrderHistoryMainMenu from '../../images/OrderHistoryMainMenu.svg';
import { wp } from '../../utils/dimensions';

interface IProfileNavButtonProps {
    onPress: () => void;
    disabled?: boolean;
    text2: string;
    text3: string;
    bookings: number;
    orders: number;
    IconBackground: string;
    Profile: boolean;
    white: any;
}

class ProfileNavButton extends React.PureComponent<IOrderAndBookingProps> {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: scale.w(2.1),
                    // marginHorizontal: widthPercentageToDP(6),
                    width: widthPercentageToDP(90),
                    paddingHorizontal: widthPercentageToDP(4),
                    alignSelf: 'center',
                    paddingVertical: heightPercentageToDP(2),
                    // backgroundColor: this.props.backgrondColor,
                    backgroundColor: this.props.backgrondColor ? this.props.backgrondColor : '#F5F8FD',
                }}
                activeOpacity={1}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    {/* <View style={{flex : .04}}></View> */}
                    {/* <View style={{ flex: .15, alignItems: 'center' }}> */}
                    <View style={{ flexDirection: 'row' }}>
                        <View
                            style={{
                                height: heightPercentageToDP(4.5),
                                width: heightPercentageToDP(4.5),
                                borderRadius: heightPercentageToDP(4.5) / 2,
                                backgroundColor: this.props.IconBackground,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {this.props.profileNav ? (
                                <PersonalData
                                    width={widthPercentageToDP(9)}
                                    height={widthPercentageToDP(9)}
                                    fill={this.props.iconColor}
                                />
                            ) : this.props.orderHistory ? (
                                <OrderHistory
                                    width={widthPercentageToDP(9)}
                                    height={widthPercentageToDP(9)}
                                    fill={this.props.iconColor}
                                />
                            ) : this.props.cardDetails ? (
                                <CardDetails
                                    width={widthPercentageToDP(9)}
                                    height={widthPercentageToDP(9)}
                                    fill={this.props.iconColor}
                                />
                            ) : this.props.help ? (
                                <Help
                                    width={widthPercentageToDP(9)}
                                    height={widthPercentageToDP(9)}
                                    fill={this.props.iconColor}
                                />
                            ) : this.props.switch ? (
                                <Switch
                                    width={widthPercentageToDP(9)}
                                    height={widthPercentageToDP(9)}
                                    fill={this.props.iconColor}
                                />
                            ) : this.props.location ? (
                                <Ionicons
                                    name="globe-outline"
                                    size={widthPercentageToDP(6)}
                                    color={'white'}
                                />
                            ) : (
                                <OrderHistoryMainMenu
                                    width={widthPercentageToDP(9)}
                                    height={widthPercentageToDP(9)}
                                    fill={this.props.iconColor}
                                />
                            )}
                            {/* {this.props.IconName ? (
                                <Icon
                                    name={this.props.IconName}
                                    size={scale.w(2)}
                                    color={colors.WHITE}
                                ></Icon>
                            ) : (
                                <Image
                                    source={require('../../images/order.png')}
                                    resizeMode="contain"
                                    style={{
                                        height: scale.w(2),
                                        width: scale.w(2),
                                        tintColor:
                                            this.props.title == 'Order and Bookings'
                                                ? colors.BLUE
                                                : colors.WHITE,
                                    }}
                                ></Image>
                            )} */}
                        </View>
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                marginLeft: widthPercentageToDP(3),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: scale.w(1.45),
                                    fontFamily: 'Roboto-Regular',
                                    color: this.props.home ? colors.WHITE : colors.SignInUsingColor,
                                }}
                            >
                                {this.props.title}
                            </Text>
                            <View style={{ height: heightPercentageToDP(0.75) }}></View>
                            <Text
                                style={{
                                    fontSize: scale.w(1.2),
                                    fontFamily: 'Roboto-Light',
                                    opacity: this.props.home ? 0.8 : 1,
                                    color: this.props.home ? colors.WHITE : colors.SignInUsingColor,
                                }}
                            >
                                {this.props.details}
                            </Text>
                        </View>
                    </View>
                    {this.props.Profile ? (
                        <BlackArrowRight width={widthPercentageToDP(4.5)} height={heightPercentageToDP(2)} />
                    ) : (
                        <ArrowRight width={widthPercentageToDP(4.5)} height={heightPercentageToDP(2)} />
                    )}
                </View>
            </TouchableOpacity>
        );
    }
}

export default ProfileNavButton;
