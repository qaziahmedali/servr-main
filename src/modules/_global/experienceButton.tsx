import React from 'react';
import { TouchableOpacity, Platform, Image, ImageStyle } from 'react-native';
import colors from '../../constants/colors';
import { H4 } from './Text';
import { scale } from '../../utils/dimensions';
import { View as ViewAnimatable } from 'react-native-animatable';
import { debounce } from 'lodash';

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
}

class MenuButton extends React.PureComponent<IMenuButtonProps> {
    render() {
        const { onPress, disabled, text, source, styleImage, width, height } = this.props;

        return (
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
                    style={{
                        backgroundColor: disabled ? colors.LIGHT_GREY : colors.WHITE,
                        borderRadius: scale.w(30),
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: scale.w(10),
                        marginVertical: scale.w(10),
                        paddingVertical: scale.w(12),
                        paddingHorizontal: scale.w(12),
                        height: height ? height : scale.h(140),
                        width: width ? width : scale.h(140),
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 6,
                            },
                            android: {
                                elevation: 8,
                            },
                        }),
                    }}
                >
                    <Image
                        source={source}
                        style={{
                            width: this.props.iconSize || scale.w(64),
                            height: this.props.iconSize || scale.w(64),
                            marginBottom: scale.w(8),
                            ...(styleImage ? styleImage : {}),
                        }}
                        resizeMode="contain"
                    />
                    <H4 textAlign="center" fontSize={this.props.fontSize || scale.w(16)}>
                        {text}
                    </H4>
                </ViewAnimatable>
            </TouchableOpacity>
        );
    }
}

export default MenuButton;
