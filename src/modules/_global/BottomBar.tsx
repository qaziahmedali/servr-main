import React from 'react';
import {
    TouchableOpacity,
    Platform,
    Image,
    ImageStyle,
    ImageBackground,
    View,
    Text,
    StyleSheet,
} from 'react-native';
import colors from '../../constants/colors';
import { H4, H2 } from './Text';
import { heightPercentageToDP as hp, scale, widthPercentageToDP, widthPercentageToDP as wp } from '../../utils/dimensions';
import { View as ViewAnimatable } from 'react-native-animatable';
import { debounce } from 'lodash';
// import  from 'react-native-gesture-handler/lib/typescript/GestureHandlerRootView';
import Icon from 'react-native-vector-icons/Feather';
import CIcon from 'react-native-vector-icons/Ionicons';
import AIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import { heightPercentageToDP } from '../../utils/dimensions/windowDimension';
import HomeSvg from '../../images/home.svg';
import LostAndFoundSvg from '../../images/lost_found.svg';
import ChatSvg from '../../images/chat_bottom_bar.svg';
import ProfileSvg from '../../images/profile.svg';
// import {  } from 'react-native-svg';

interface IBottomBarProps {
    onPress: () => void;
    onHomePress: () => void;
    onChatPress: () => void;
    onPromoClick: () => void;
    onAccount: () => void;
    disabled?: boolean;
    profile: boolean;
    text: string;
    source: any;
    styleImage?: ImageStyle;
    width?: number;
    height?: number;
    iconSize?: number;
    fontSize?: number;
    showImageBackground?: boolean;
    borderRadius?: number;
    white?: boolean;
    bold?: boolean;
    marginVertical?: number;
    paddingVertical?: number;
    elevation?: boolean;
    source2?: any;
    buttonStyle: any;
    home: boolean;
    countUnreadMessage: number;
    checkWindow: string;
    backgroundColor: string;
    title: string;
}

interface IBottomBarState {
    active: string;
}

class BottomBar extends React.PureComponent<IBottomBarProps> {
    constructor(props: IBottomBarState) {
        super(props);
        this.state = {
            active: 'home',
        };
    }
    render() {
        const {
            onPress,
            onHomePress,
            onChatPress,
            onAccount,
            onPromoClick,
            disabled,
            text,
            source,
            styleImage,
            width,
            height,
            marginVertical,
            paddingVertical,
            borderRadius,
            elevation,
            source2,
            buttonStyle,
            home,
            backgroundColor
        } = this.props;
        return (
            <View
                style={{
                    height: hp(9),
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: wp(7),
                    backgroundColor: this.props.backgroundColor,
                    alignItems: 'center',
                    borderTopLeftRadius: scale.w(3),
                    borderTopRightRadius: scale.w(3),
                    alignSelf: 'flex-end',
                    width: wp(100),
                }}
            >
                <TouchableOpacity
                    onPress={
                        this.props.onHomePress
                    }
                    style={
                        this.props.checkWindow == 'home'
                            ? {
                                flexDirection: 'row',
                                paddingVertical: hp(1),
                                paddingHorizontal: wp(3),
                                backgroundColor: colors.BOTTOMBAR_SELECTED_TAB_BACKGROUND,
                                alignItems: 'center',
                                borderRadius: 30,
                            }
                            : { flexDirection: 'row' }
                    }
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <HomeSvg height={heightPercentageToDP(2.9)} width={heightPercentageToDP(2.9)}></HomeSvg>
                        <View style={{ width: widthPercentageToDP(1.5) }}></View>
                        {this.props.checkWindow == 'home' ? (
                            <Text style={{ fontSize: scale.w(1.5), marginLeft: 5, color: colors.WHITE, fontFamily: 'Roboto-Medium' }}>{this.props.title}</Text>
                        ) : null}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onChatPress}
                    style={
                        this.props.checkWindow == 'chat'
                            ? {
                                flexDirection: 'row',
                                paddingVertical: hp(1),
                                paddingHorizontal: wp(3),
                                backgroundColor: colors.BOTTOMBAR_SELECTED_TAB_BACKGROUND,
                                alignItems: 'center',
                                borderRadius: 30,
                            }
                            : { flexDirection: 'row' }
                    }
                >
                    <ChatSvg height={heightPercentageToDP(2.9)} width={heightPercentageToDP(2.9)}></ChatSvg>
                    <View>

                        {this.props.countUnreadMessage > 0 && this.props.checkWindow !== 'chat' ? (
                            <View
                                style={
                                    this.props.countUnreadMessage > 9
                                        ? styles.notif_badge_container
                                        : styles.notif_badge_Containder2
                                }
                            >
                                <H2 fontSize={scale.w(0.8)} color={colors.WHITE}>
                                    {this.props.countUnreadMessage > 99 ? '99+' : this.props.countUnreadMessage}
                                </H2>
                            </View>
                        )
                            :
                            null
                        }
                    </View>
                    <View style={{ width: widthPercentageToDP(1.5) }}></View>
                    {this.props.checkWindow == 'chat' ? (
                        <Text style={{ fontSize: scale.w(1.5), marginLeft: 5, color: colors.WHITE, fontFamily: 'Roboto-Medium' }}>{this.props.title}</Text>
                    ) : null}

                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onPromoClick}
                    style={
                        this.props.checkWindow == 'lostAndfound'
                            ? {
                                flexDirection: 'row',
                                paddingVertical: hp(1),
                                paddingHorizontal: wp(3),
                                backgroundColor: colors.BOTTOMBAR_SELECTED_TAB_BACKGROUND,
                                alignItems: 'center',
                                borderRadius: 30,
                            }
                            : { flexDirection: 'row' }
                    }
                >
                    <LostAndFoundSvg height={heightPercentageToDP(2.9)} width={heightPercentageToDP(2.9)}>
                    </LostAndFoundSvg>
                    <View style={{ width: widthPercentageToDP(1.5) }}></View>
                    {this.props.checkWindow == 'lostAndfound' ? (
                        <Text style={{ fontSize: scale.w(1.5), marginLeft: 5, color: colors.WHITE, fontFamily: 'Roboto-Medium' }}>{this.props.title}</Text>
                    ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.props.onAccount}
                    style={
                        this.props.checkWindow == 'profile'
                            ? {
                                flexDirection: 'row',
                                paddingVertical: hp(1),
                                paddingHorizontal: wp(3),
                                backgroundColor: colors.BOTTOMBAR_SELECTED_TAB_BACKGROUND,
                                alignItems: 'center',
                                borderRadius: 30,
                            }
                            : { flexDirection: 'row' }
                    }
                >
                    <ProfileSvg height={heightPercentageToDP(2.9)} width={heightPercentageToDP(2.9)}></ProfileSvg>
                    <View style={{ width: widthPercentageToDP(1.5) }}></View>
                    {this.props.checkWindow == 'profile' ? (
                        <Text style={{ fontSize: scale.w(1.5), marginLeft: 5, color: colors.WHITE, fontFamily: 'Roboto-Medium' }}>{this.props.title}</Text>
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    notif_badge_container: {
        position: 'absolute',
        right: -12,
        top: -10,
        backgroundColor: colors.RED,
        paddingVertical: heightPercentageToDP(0.6),
        paddingHorizontal: heightPercentageToDP(0.8),
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notif_badge_Containder2: {
        position: 'absolute',
        right: -8,
        top: -10,
        backgroundColor: colors.RED,
        paddingVertical: heightPercentageToDP(0.5),
        paddingHorizontal: heightPercentageToDP(0.8),
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BottomBar;
