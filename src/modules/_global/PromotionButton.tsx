import React from 'react';
import { TouchableOpacity, Platform, Image, ImageStyle } from 'react-native';
import colors from '../../constants/colors';
import { ButtonLabel, H4, H2 } from './Text';
import { scale, widthPercentageToDP } from '../../utils/dimensions';
import { View as ViewAnimatable } from 'react-native-animatable';
import { debounce } from 'lodash';

interface IMenuButtonProps {
    onPress: () => void;
    disabled?: boolean;
    // text: string;
    text2: string;
    text3: string;
    // text4: string;
    // text5: string;
    // text6: string;
    text7: string;
    // source: any;
    styleImage?: ImageStyle;
    width?: number;
    height?: number;
    iconSize?: number;
    fontSize?: number;
}

class MenuButton extends React.PureComponent<IMenuButtonProps> {
    render() {
        const { onPress, disabled, text2, text3, text7, styleImage, width, height } = this.props;

        return (
            <TouchableOpacity
                onPress={debounce(onPress, 1000, {
                    leading: true,
                    trailing: false,
                })}
                disabled={disabled}
                activeOpacity={1}
                style={{
                    flexDirection: 'row',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 6,
                        },
                        android: {
                            elevation: 2,
                        },
                    }),
                    backgroundColor: colors.WHITE,
                    borderRadius: scale.w(30),
                    marginBottom: scale.w(10),
                    width: widthPercentageToDP(90),
                }}
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
                        // borderRightColor:colors.WHITE,
                        // marginHorizontal: scale.w(10),
                        // marginVertical: scale.w(10),
                        // paddingVertical: scale.w(8),
                        // paddingHorizontal: scale.w(12),
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
                    <ButtonLabel textAlign="center" fontSize={this.props.fontSize || scale.w(16)}>
                        {text2.length > 20 ? text2.substring(0, 20) + '...' : text2}
                    </ButtonLabel>
                    {text3 ? (
                        <H4 textAlign="center" fontSize={this.props.fontSize || scale.w(16)}>
                            {text3.length > 20 ? text3.substring(0, 20) + '...' : text3}
                        </H4>
                    ) : null}

                    {/* {text3 ? (<H4 textAlign="center" fontSize={this.props.fontSize || scale.w(16)}>
                        {text3}
                    </H4>):(null)} */}
                    {/* {text4 ? (<H4 textAlign="center" fontSize={this.props.fontSize || scale.w(16)}>
                        {text4}
                    </H4>):(null)}
                    {text5 ? (<H4 textAlign="center" fontSize={this.props.fontSize || scale.w(16)}>
                        {text5}
                    </H4>):(null)}
                    {text6 ? (<H4 textAlign="center" fontSize={this.props.fontSize || scale.w(16)}>
                        {text6}
                    </H4>):(null)} */}
                    {/* <Image
                        source={source}
                        style={{
                            width: this.props.iconSize || scale.w(64),
                            height: this.props.iconSize || scale.w(64),
                            marginBottom: scale.w(8),
                            ...(styleImage ? styleImage : {}),
                        }}
                        resizeMode="contain"
                    /> */}
                </ViewAnimatable>
                <ViewAnimatable
                    useNativeDriver
                    animation="fadeInLeft"
                    duration={400}
                    delay={Math.floor(Math.random() * 100)}
                    style={{
                        backgroundColor: colors.WHITE,
                        borderTopRightRadius: scale.w(30),
                        borderBottomRightRadius: scale.w(30),
                        borderLeftColor: colors.WHITE,
                        marginHorizontal: scale.w(5),
                        alignItems: 'center',
                        justifyContent: 'center',
                        // marginHorizontal: scale.w(10),
                        // marginVertical: scale.w(10),
                        // paddingVertical: scale.w(8),
                        // paddingHorizontal: scale.w(12),
                        height: height ? height : scale.h(140),
                        width: widthPercentageToDP(55),
                        // ...Platform.select({
                        //     ios: {
                        //         shadowColor: '#000',
                        //         shadowOffset: { width: 0, height: 1 },
                        //         shadowOpacity: 0.1,
                        //         shadowRadius: 6,

                        //     },
                        //     android: {
                        //         // elevation: 5,

                        //     },
                        // }),
                    }}
                >
                    {text7 ? (
                        <H4 textAlign="center" fontSize={this.props.fontSize || scale.w(16)}>
                            {text7.length > 100 ? text7.substring(0, 100) + '...' : text7}
                        </H4>
                    ) : null}
                </ViewAnimatable>
            </TouchableOpacity>
        );
    }
}

export default MenuButton;
