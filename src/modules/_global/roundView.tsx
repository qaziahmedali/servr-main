import React from 'react';
import { TouchableOpacity, Platform, Image, ImageStyle, ImageBackground, View } from 'react-native';
import colors from '../../constants/colors';
import { H3, H4 } from './Text';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP,
    heightPercentageToDP,
} from '../../utils/dimensions';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import { View as ViewAnimatable } from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Entypo';
import MICon from 'react-native-vector-icons/Feather';
import PIcon from 'react-native-vector-icons/MaterialIcons';
import Hotel_logo from '../../images/hotel_box.svg';
import DropShadow from 'react-native-drop-shadow';
import Location from '../../images/location.svg';
import Call from '../../images/call.svg';
import Chat from '../../images/chat.svg';
import ValetLocation from '../../images/ValetLocation.svg';
import CarParking from '../../images/carParking.svg';
import ImageZoomModal from '../_global/ImageZoomModal';

interface IMenuButtonState {
    modalVisible: boolean;
    Image_URL: any;
}
interface IMenuButtonProps {
    onPress: () => void;
    disabled?: boolean;
    text: string;
    text1: string;
    source: any;
    source1: any;
    source2: any;
    sourcehotelImage: string;
    styleImage?: ImageStyle;
    backgrondColor1: string;
    backgrondColor2: string;
    source1Color: string;
    source2Color: string;
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
    onIconOne: () => void;
    onIconTwo: () => void;
    concierge: boolean;
    icon: boolean;
    Primary_Color: any;
}

class RoundView extends React.PureComponent<IMenuButtonProps, IMenuButtonState> {
    constructor(props: IMenuButtonProps) {
        super(props);

        this.state = {
            modalVisible: false,
            Image_URL: '',
        };
    }

    capitalizeFirstLetter(string) {
        string = string.trim();
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        const {
            onPress,
            disabled,
            text,
            text1,
            source,
            source1,
            sourcehotelImage,
            source2,
            source1Color,
            source2Color,
            styleImage,
            backgrondColor1,
            backgrondColor2,
            width,
            height,
            marginVertical,
            paddingVertical,
            borderRadius,
            elevation,
            concierge,
            icon,
            Primary_Color,
        } = this.props;

        let modifiedText1 = text1.length > 25 ? ` ${text1.substring(0, 25)}` + '...' : ` ${text1}`;

        return (
            <DropShadow
                style={{
                    width: wp(100),
                    height: heightPercentageToDP(9.5),
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowColor: colors.ROUNDVIEW_SHADOW_COLOR,
                    shadowOpacity: 0.39,
                    shadowRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        justifyContent: 'space-between',
                        borderRadius: 50,
                        flexDirection: 'row',
                        height: '100%',
                        paddingHorizontal: source1 ? wp(0.8) : wp(4),
                        alignItems: 'center',
                        width: wp(90),
                        alignSelf: 'center',
                        backgroundColor: '#fff',
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        {/* {source1?   */}
                        {icon ? (
                            <FontAwesome5Icons
                                name="car-alt"
                                size={scale.w(2.7)}
                                color={
                                    this.props.Primary_Color === '' ? colors.BLUE : this.props.Primary_Color
                                }
                                style={{ paddingRight: wp(2), paddingLeft: wp(4), paddingTop: wp(2) }}
                            />
                        ) : (
                            <Image
                                onError={({ nativeEvent: { error } }) => console.log(error)}
                                source={{ uri: sourcehotelImage }}
                                style={this.props.styleImage}
                            />
                        )}

                        {/* 'https://objects.liquidweb.services/new_servrhotels/apa-menu-galleries/1_wrxtm40r.jpg' */}

                        {/* // :
                    // <CarParking/>
                    // } */}

                        <View style={{ marginLeft: widthPercentageToDP(3), justifyContent: 'center' }}>
                            <H4
                                // textAlign="center"
                                fontSize={this.props.fontSize || scale.w(2.2)}
                                white={this.props.white}
                                bold={this.props.bold}
                            >
                                {text.length > 12 ? text.substring(0, 12) + '...' : `  ${text}`}
                            </H4>
                            <View style={{ height: heightPercentageToDP(0.25) }}></View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {source1 ? (
                                    <Location
                                        color={'#43D4AA'}
                                        height={scale.w(1.5)}
                                        width={scale.w(1.5)}
                                        style={{ marginLeft: scale.w(0.8), marginRight: scale.w(0.5) }}
                                    />
                                ) : (
                                    <View style={{ marginLeft: scale.w(0.8), marginRight: scale.w(0.5) }} />
                                )}
                                <H3 fontSize={this.props.fontSize || scale.w(1.3)} white={this.props.white}>
                                    {this.capitalizeFirstLetter(modifiedText1)}
                                </H3>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',

                            marginRight: widthPercentageToDP(2.2),
                        }}
                    >
                        {source1 ? (
                            <TouchableOpacity
                                onPress={this.props.onIconOne}
                                style={{
                                    paddingHorizontal: widthPercentageToDP(5),
                                    height: heightPercentageToDP(4.7),
                                    width: heightPercentageToDP(4.7),
                                    //   backgroundColor: this.props.backgrondColor1,
                                    borderRadius: heightPercentageToDP(4.7) / 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: source1
                                        ? concierge
                                            ? -widthPercentageToDP(0.5)
                                            : widthPercentageToDP(3)
                                        : 0,
                                    //  transform: [{ rotate: '90deg' }],
                                }}
                                activeOpacity={1}
                            >
                                <Call height={heightPercentageToDP(4.7)} width={heightPercentageToDP(4.7)} />
                            </TouchableOpacity>
                        ) : null}
                        {this.props.concierge ? null : (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={this.props.onIconTwo}
                                style={{
                                    // paddingHorizontal:widthPercentageToDP(5),
                                    height: heightPercentageToDP(4.7),
                                    width: heightPercentageToDP(4.7),
                                    //    backgroundColor: this.props.backgrondColor2,
                                    borderRadius: heightPercentageToDP(4.7) / 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: source1 ? widthPercentageToDP(1.5) : -widthPercentageToDP(2),
                                }}
                            >
                                {source1 ? (
                                    <Chat
                                        height={heightPercentageToDP(4.7)}
                                        width={heightPercentageToDP(4.7)}
                                    />
                                ) : (
                                    <ValetLocation
                                        height={heightPercentageToDP(4.7)}
                                        width={heightPercentageToDP(4.7)}
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <ImageZoomModal
                    modalVisible={this.state.modalVisible}
                    onBack={() => this.setState({ modalVisible: false })}
                    onBackDrop={() => this.setState({ modalVisible: false })}
                    Image={{ uri: source.uri }}
                    onBackArrow={() => this.setState({ modalVisible: false })}
                />
            </DropShadow>
        );
    }
}

export default RoundView;
