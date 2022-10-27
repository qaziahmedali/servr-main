import React from 'react';
import {
    View,
    Platform,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator,
    ImageBackground,
    Text,
    TouchableOpacity,
} from 'react-native';
import { heightPercentageToDP, scale } from '../../utils/dimensions';
import { H2 } from './Text';
import colors from '../../constants/colors';
import Image from 'react-native-image-progress';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface IModalSeeMoreProps {
    showModal: () => void;
    value: string;
    onChangeText: (value: string) => void;
    title: string;
    color?: string;
    description?: string;
    done?: string;
    item: any;
    currency: string;
    onClock: any;
    chainData: {
        data: {
            name: string;
            logo: string;
            splash_screen: string;
            logo_gif_dark: string;
            logo_gif_light: string;
            signup_bg: string;
            signin_bg: string;
            login_color: string;
            private_policy: string;
            terms_n_conditions: string;
            about_us: string;
            contact_us: string;
            google_play_store: string;
            app_store: string;
        };
    };
}

const ModalSeeMore = (props: IModalSeeMoreProps) => {
    console.log('===========propssss', props);
    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120} enabled={Platform.OS === 'ios'}>
            <View style={styles.container}>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <ImageBackground
                        source={{ uri: props.item.image }}
                        indicator={<ActivityIndicator />}
                        resizeMode={'cover'}
                        indicatorProps={{
                            size: 40,
                            borderWidth: 0,
                            color: 'rgba(150, 150, 150, 1)',
                            unfilledColor: 'rgba(200, 200, 200, 0.2)',
                        }}
                        style={{
                            width: '100%',
                            height: scale.w(30),
                        }}
                        imageStyle={{
                            borderTopLeftRadius: scale.w(4),
                            borderTopRightRadius: scale.w(4),
                        }}
                    >
                        <TouchableOpacity onPress={props.onClock}>
                            <View
                                style={{
                                    width: '100%',
                                    alignItems: 'flex-end',
                                    marginTop: 15,
                                    paddingHorizontal: 15,
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: props.color,
                                        width: 35,
                                        height: 35,
                                        borderRadius: scale.w(40),
                                        textAlign: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Icon color="white" size={15} name={'times'} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
                <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 12 }}>
                    <H2
                        fontSize={scale.w(1.5)}
                        color={'#000'}
                        style={{ textTransform: 'capitalize', fontFamily: 'Roboto-Regular' }}
                    >
                        {props.item.name}
                    </H2>
                </View>
                <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 3, marginBottom: 50 }}>
                    <Text
                        style={{
                            fontSize: scale.w(1.3),
                            textTransform: 'capitalize',
                            fontFamily: 'Roboto',
                            color: colors.BLACK,
                        }}
                    >
                        {props.item.description}
                    </Text>
                    <View style={{ width: '100%', paddingHorizontal: 20, marginBottom: 6 }} />
                    <Text
                        style={{
                            fontSize: scale.w(1.5),
                            color: colors.BLACK,
                            fontFamily: 'Roboto',
                        }}
                    >
                        {`${props.currency} ${' '}${parseFloat(props.item.price).toFixed(2)}`}
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        // paddingHorizontal: widthPercentageToDP(5),
        // paddingVertical: widthPercentageToDP(4),
        width: '100%',
        borderRadius: scale.w(4),
    },
    titleContainer: {
        //  alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? heightPercentageToDP(4) : heightPercentageToDP(2),
    },
    headerPickerAndroid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: heightPercentageToDP(2),
        marginBottom: heightPercentageToDP(2),
    },
    datePicker: {
        width: '100%',
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
    },
    buttonContainer: {
        marginTop: Platform.OS === 'ios' ? scale.w(12) : 0,
    },
});

export default ModalSeeMore;
