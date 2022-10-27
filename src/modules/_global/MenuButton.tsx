import React from 'react';
import { TouchableOpacity, View, Platform, Image, ImageStyle, ImageBackground } from 'react-native';
import colors from '../../constants/colors';
import { H4 } from './Text';
import { heightPercentageToDP, scale } from '../../utils/dimensions';
import { View as ViewAnimatable } from 'react-native-animatable';
import { debounce } from 'lodash';
import DropShadow from 'react-native-drop-shadow';

interface IMenuButtonProps {
    onPress: () => void;
    disabled?: boolean;
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
    haveBorderWidth: boolean;
}

class MenuButton extends React.PureComponent<IMenuButtonProps> {
    render() {
        const {
            onPress,
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
            haveBorderWidth
        } = this.props;
        return (
            <DropShadow
                style={{
                    width: width,
                    height: height,
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
                <TouchableOpacity
                    onPress={debounce(onPress, 1000, {
                        leading: true,
                        trailing: false,
                    })}
                    disabled={disabled}
                    activeOpacity={1}
                >
                    <ViewAnimatable
                        useNativeDriver
                        animation="fadeInLeft"
                        duration={400}
                        delay={Math.floor(Math.random() * 100)}
                        style={[
                            {
                                backgroundColor: colors.WHITE,
                                borderRadius: borderRadius == 0 ? borderRadius : scale.w(2.5),
                                alignItems: 'center',
                                justifyContent: 'center',
                                // marginHorizontal: scale.w(10),
                                marginVertical: marginVertical,
                                paddingVertical: paddingVertical,
                                height: height,
                                width: width,
                                borderColor: colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR,
                                borderWidth: haveBorderWidth === false ? 0 : 1,
                            },
                            this.props.buttonStyle,
                        ]}
                    >

                        <Image
                            source={source}
                            style={{
                                width: this.props.iconSize,
                                height: this.props.iconSize,
                                ...(styleImage ? styleImage : {}),
                            }}
                            resizeMode="contain"
                        />
                        <View style={{ height: heightPercentageToDP(1) }}></View>
                        <H4
                            textAlign="center"
                            fontSize={this.props.fontSize || scale.w(2)}
                            // white={this.props.white}
                            bold={this.props.bold}
                            fontWeight={'bold'}
                            letterSpacing={.35}
                            marginTop={this.props.home ? heightPercentageToDP(1) : heightPercentageToDP(0)}
                        >
                            {text}
                        </H4>
                    </ViewAnimatable>
                </TouchableOpacity>
            </DropShadow>
        );
    }
}

export default MenuButton;
