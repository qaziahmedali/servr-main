import React from 'react';
import {
    View,
    Platform,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Text,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
// import { DatePicker } from 'react-native-wheel-datepicker';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../../utils/dimensions';
import { H2, H3, H4 } from '../../_global/Text';
import colors from '../../../constants/colors';
import SvgUri from 'react-native-svg';
import Icon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import BookATableContainer from '../../Restaurant/BookATable.Container';
import Hide from '../../../images/hide.svg'
import Show from '../../../images/show.svg'

interface Text_InputProps {
    value?: string;
    onChangeText: (value: string) => void;
    title: string;
    color?: string;
    height?: number;
    width?: number;
    placeholder?: string;
    IsPassword?: boolean;
    autofocus?: boolean;
    multiline?: boolean;
    keyboardType?: string;
    onEyePress: () => void;
    secureText: boolean;
    letterSpacing?: boolean;
    showCheck?:boolean;
}

const Text_Input = (props: Text_InputProps) => {
    if (props.secureText && props.value?.length > 0) {
        return (
            <View>
                <View style={styles.container}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderRadius: scale.w(1.3),
                            alignItems: 'center',
                            borderWidth: 1.4,
                            borderColor: 'rgba(103,114,148,0.115)',

                            paddingVertical: heightPercentageToDP(1.6),
                            paddingHorizontal: widthPercentageToDP(5),
                        }}
                    >
                        {console.log('props.value is here', props.value)}
                        <TextInput
                            multiline={props.multiline}
                            value={props.value}
                            ref={(ref) =>
                                ref && ref.setNativeProps({ style: { fontFamily: 'Roboto-Light' } })
                            }
                            secureTextEntry={props.secureText}
                            onChangeText={props.onChangeText}
                            placeholder={props.placeholder}
                            placeholderTextColor={colors.AuthPlaceHolderColor}
                            style={{
                                fontFamily: 'Roboto-Light',
                                fontSize: scale.w(1.6),
                                color: colors.AuthPlaceHolderColor,
                                margin: 0,
                                padding: 0,
                                width: widthPercentageToDP(65),
                            }}
                            autoFocus={props.autofocus}
                            keyboardType={props.keyboardType}
                        />
                        {props.IsPassword === false ? (
                            props.showCheck ?
                            <FeatherIcon name="check" size={20} color="#677294" />
                            :
                            null
                        ) : props.secureText === true ? (
                            <TouchableOpacity onPress={props.onEyePress}>
                                <Hide height={scale.w(2)} width={scale.w(2)}></Hide>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={props.onEyePress}>
                                <Show height={scale.w(2)} width={scale.w(2)}></Show>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    } else
        return (
            <View>
                <View style={styles.container}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderRadius: scale.w(1.3),
                            alignItems: 'center',
                            borderWidth: 1.4,
                            borderColor: 'rgba(103,114,148,0.115)',

                            paddingVertical: heightPercentageToDP(1.6),
                            paddingHorizontal: widthPercentageToDP(5),
                        }}
                    >
                        {console.log('props.value is here', props.value)}
                        <TextInput
                            multiline={props.multiline}
                            value={props.value}
                            ref={(ref) =>
                                ref && ref.setNativeProps({ style: { fontFamily: 'Roboto-Light' } })
                            }
                            secureTextEntry={props.secureText}
                            onChangeText={props.onChangeText}
                            placeholder={props.placeholder}
                            placeholderTextColor={colors.AuthPlaceHolderColor}
                            style={{
                                fontFamily: 'Roboto-Light',
                                fontSize: props.letterSpacing ? scale.w(2) : scale.w(1.6),
                                color: colors.AuthPlaceHolderColor,
                                margin: 0,
                                padding: 0,
                                width: widthPercentageToDP(65),
                                letterSpacing: props.letterSpacing ? 10 : null,
                            }}
                            autoFocus={props.autofocus}
                            keyboardType={props.keyboardType}
                        />
                        {props.IsPassword === false ? (
props.showCheck ?
<FeatherIcon name="check" size={20} color="#677294" />
:
null                        ) : props.secureText === true ? (
    <TouchableOpacity onPress={props.onEyePress}>
    <Hide height={scale.w(2)} width={scale.w(2)}></Hide>
</TouchableOpacity>
) : (
<TouchableOpacity onPress={props.onEyePress}>
    <Show height={scale.w(2)} width={scale.w(2)}></Show>
</TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        borderRadius: scale.w(1),
    },
});

export default Text_Input;
