import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacityProps,
    TextStyle,
    Image,
} from 'react-native';
import { widthPercentageToDP as wp, scale, widthPercentageToDP } from '../../utils/dimensions';
import colors from '../../constants/colors';
import { ButtonLabel, H4 } from './Text';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { debounce } from 'lodash';
import { Text } from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { heightPercentageToDP } from '../../utils/dimensions/windowDimension';
import { hp } from '../../utils/dimensions';
import DropShadow from 'react-native-drop-shadow';

interface IButtonProps extends TouchableOpacityProps, TextStyle {
    loading?: boolean;
    text: string;
    hideShadow?: boolean;
    onPress: () => void;
    backgroundColor?: string;
    loadingColor?: string;
    withIcon?: boolean;
    chainData: {
        data: {
            name: string;
            logo: string;
            splash_screen: string;
            private_policy: string;
            terms_n_conditions: string;
            about_us: string;
            contact_us: string;
            logo_gif_dark: string;
            logo_gif_light: string;
            signup_bg: string;
            signin_bg: string;
        };
    };
}

interface IButtonState {}

const ButtonPrimary = (props: IButtonProps, state: IButtonState) => {
    //console.log('primary buttons================>', props.chainData.data);
    const btnProps = (({ activeOpacity, disabled }) => ({
        activeOpacity,
        disabled,
    }))(props);

    const { color, fontSize, textAlign, fontWeight, chainData } = props;

    return (
        <DropShadow
            style={{
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 6,
            }}
        >
            <TouchableOpacity
                {...btnProps}
                onPress={props.onPress}
                activeOpacity={1}
                disabled={props.loading}
                style={StyleSheet.flatten([
                    styles.btn_container,
                    {
                        borderRadius: props.borderRadius || scale.w(1),
                        backgroundColor: props.backgroundColor ? props.backgroundColor : colors.LIGHT_BLUE,
                    },
                    // !props.hideShadow &&
                    //     Platform.select({
                    //         ios: {
                    //             shadowColor: '#000',
                    //             shadowOffset: { width: 0, height: 4 },
                    //             shadowOpacity: 0.2,
                    //             shadowRadius: 3,
                    //         },
                    //         android: {
                    //             elevation: 3,
                    //         },
                    //     }),
                ])}
            >
                {/* <View
                style={StyleSheet.flatten([
                    styles.btn_container,
                    {
                        borderRadius: props.borderRadius || 12,
                        backgroundColor: props.backgroundColor ? props.backgroundColor : colors.LIGHT_BLUE,
                    },
                    !props.hideShadow &&
                        Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,
                            },
                            android: {
                                elevation: 8,
                            },
                        }),
                ])}
            > */}
                {props.loading ? (
                    <View
                        style={{
                            width: widthPercentageToDP(20),
                            height: heightPercentageToDP(3.5),
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            resizeMode="cover"
                            style={{
                                height: heightPercentageToDP(4),
                                width: widthPercentageToDP(18),
                                marginTop: -heightPercentageToDP(1),
                            }}
                            // source={require('../../images/loading_white.gif')}
                            source={{
                                uri: props.chainData?.data?.logo_gif_light,
                            }}
                        />
                    </View>
                ) : (
                    <Text
                        style={{
                            fontSize: fontSize ? fontSize : scale.w(1.7),
                            color: color ? color : '#fff',
                            fontWeight: fontWeight ? fontWeight : '',
                            textAlign: textAlign ? textAlign : 'center',
                            width: '95%',
                            fontFamily: 'Roboto-Bold',
                        }}
                    >
                        {props.text}
                    </Text>
                )}
                {/* </View> */}
            </TouchableOpacity>
        </DropShadow>
    );
};

const ButtonSecondary = (props: IButtonProps) => {
    const btnProps = (({ activeOpacity, disabled }) => ({
        activeOpacity,
        disabled,
    }))(props);

    const { color, fontSize, textAlign, withIcon = false, chainData } = props;

    return (
        <TouchableOpacity
            {...btnProps}
            onPress={debounce(props.onPress, 1000, {
                leading: true,
                trailing: false,
            })}
            disabled={btnProps.disabled}
            activeOpacity={1}
        >
            <View
                style={StyleSheet.flatten([
                    withIcon
                        ? {
                              justifyContent: 'center',
                          }
                        : styles.btn_container,
                    {
                        backgroundColor: '#fff',
                        height: props.height || wp(10),
                        borderRadius: props.borderRadius || scale.w(2.5),
                    },
                    // !props.hideShadow &&
                    //     Platform.select({
                    //         ios: {
                    //             shadowColor: '#000',
                    //             shadowOffset: { width: 0, height: 4 },
                    //             shadowOpacity: 0.2,
                    //             shadowRadius: 3,
                    //         },
                    //         android: {
                    //             elevation: 8,
                    //         },
                    //     }),
                ])}
            >
                {props.loading ? (
                    <View
                        style={{
                            width: scale.w(100),
                            height: scale.h(80),
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            resizeMode="contain"
                            style={{ height: '100%', width: '100%', marginTop: scale.h(-10) }}
                            source={{ uri: props.chainData?.data?.logo_gif_light }} //'../../images/loading_blue.gif'
                        />
                    </View>
                ) : withIcon ? (
                    <>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <View style={{ width: scale.w(310), paddingLeft: scale.w(21) }}>
                                <H4
                                    fontSize={fontSize ? fontSize : scale.w(30)}
                                    color={color ? color : '#000'}
                                    // textAlign={textAlign ? textAlign : 'center'}
                                >
                                    {props.text}
                                </H4>
                            </View>
                            <View style={{ alignItems: 'flex-end', paddingTop: scale.h(7) }}>
                                <Icon name="angle-right" size={scale.h(20)} color={color ? color : '#000'} />
                            </View>
                        </View>
                    </>
                ) : (
                    <>
                        <H4
                            fontSize={fontSize ? fontSize : scale.w(30)}
                            color={color ? color : '#000'}
                            textAlign={textAlign ? textAlign : 'center'}
                        >
                            {props.text}
                        </H4>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

interface ICloseButtonProps {
    action: () => void;
    color?: string;
}

const CloseButton = (props: ICloseButtonProps) => (
    <TouchableOpacity
        onPress={debounce(props.action, 1000, {
            leading: true,
            trailing: false,
        })}
        activeOpacity={1}
    >
        <View style={styles.btn_close}>
            <IonIcon name="md-close" size={wp(8)} color={props.color || colors.DARK_BLUE} />
        </View>
    </TouchableOpacity>
);

const BackButton = (props: ICloseButtonProps) => (
    <TouchableOpacity
        onPress={debounce(props.action, 1000, {
            leading: true,
            trailing: false,
        })}
        activeOpacity={1}
    >
        <View style={styles.btn_close}>
            <IonIcon name="md-arrow-back" size={wp(6.5)} color={props.color || colors.DARK_BLUE} />
        </View>
    </TouchableOpacity>
);

const TransparentButton = (props: IButtonProps) => {
    const btnProps = (({ activeOpacity }) => ({ activeOpacity }))(props);
    const labelProps = (({ color, fontSize, textAlign }) => ({ color, fontSize, textAlign }))(props);

    return (
        <TouchableOpacity
            {...btnProps}
            onPress={debounce(props.onPress, 1000, {
                leading: true,
                trailing: false,
            })}
            activeOpacity={1}
        >
            <View style={styles.btn_transparent}>
                {props.loading ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <ButtonLabel {...labelProps}>{props.text}</ButtonLabel>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn_container: {
        height: heightPercentageToDP(7),
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_close: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_transparent: {
        height: wp(10),
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export { ButtonPrimary, ButtonSecondary, CloseButton, BackButton, TransparentButton };
