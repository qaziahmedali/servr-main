import React from 'react';
import { TouchableOpacity, Platform, Image, ImageStyle, ImageBackground, View } from 'react-native';
import colors from '../../constants/colors';
import { H4 } from './Text';
import { scale, widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP } from '../../utils/dimensions';
import { View as ViewAnimatable } from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Entypo'
import MICon from 'react-native-vector-icons/Feather'
import DropShadow from 'react-native-drop-shadow';

interface IMenuButtonProps {
    onPress: () => void;
    disabled?: boolean;
    text: string;
    text1: string;
    source: any;
    source1: any;
    source2: any;
    icon: any;
    color: string;
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
}

class CheckButton extends React.PureComponent<IMenuButtonProps> {
    render() {
        const {
            onPress,
            disabled,
            text,
            color,
            icon,
            text1,
            source,
            source1,
        } = this.props;
        return (
            <DropShadow
                style={{
                    width: wp(43),
                    height: heightPercentageToDP(6.5),
                    shadowOffset: {
                        width: 20,
                        height: 19,
                    },
                    shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                    shadowOpacity: 0.09,
                    shadowRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <TouchableOpacity onPress={this.props.onPress} style={{ justifyContent: 'center', borderColor: colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR, borderWidth: 1, borderRadius: 10, backgroundColor: '#FFFF', flexDirection: 'row', height: heightPercentageToDP(6.5), alignItems: 'center', width: wp(43) }}>
                    <View style={{ flex: .3, justifyContent: 'center', alignItems: 'center' }}>

                        <Image source={this.props.icon} style={{ width: wp(5), height: wp(5), tintColor: this.props.color }} resizeMode='contain' >
                        </Image>
                    </View>
                    <View style={{ flex: .75, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <H4
                            textAlign="center"
                            fontSize={this.props.fontSize || scale.w(1.6)}
                            bold={true}
                            letterSpacing={.33}
                        >
                            {text}
                        </H4>
                    </View>
                </TouchableOpacity>
            </DropShadow>
        );
    }
}

export default CheckButton;