import React from 'react';
import {
    View,
    Platform,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Text,
    TouchableOpacity,
} from 'react-native';
import { addDays } from 'date-fns';
// import { DatePicker } from 'react-native-wheel-datepicker';
import { heightPercentageToDP, scale } from '../../../utils/dimensions';
import { H2, H3 } from '../../_global/Text';
import { ButtonPrimary } from '../../_global/Button';
import colors from '../../../constants/colors';

interface INoteOrderItemProps {
    showModal: () => void;
    closeModal: () => void;
    value: string;
    onChangeText: (value: string) => void;
    title: string;
    color?: string;
    cardHolderName?: string;
    cardNumber?: string;
    loading?: any;
    selectedLanguage?: any;
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

const Card = (props: INoteOrderItemProps) => {
    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120} enabled={Platform.OS === 'ios'}>
            <View style={styles.container}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <H2 fontSize={scale.w(25)}>{props.selectedLanguage?.card_details}</H2>
                </View>
                <View style={{ marginTop: heightPercentageToDP(3) }}></View>

                <View style={styles.titleContainer}>
                    <H2 fontSize={scale.w(14)}>{props.selectedLanguage?.card_holder_name}</H2>
                </View>

                <TextInput
                    onChangeText={props.onChangeText}
                    placeholder={props.cardHolderName}
                    style={{
                        backgroundColor: colors.WHITE,
                        fontFamily: 'Roboto-Regular',
                        fontSize: scale.w(21),
                        color: colors.DARK,
                        textAlignVertical: 'top',
                        margin: 0,
                        padding: 0,
                    }}
                    editable={false}
                />
                <View style={{ marginTop: heightPercentageToDP(2) }}></View>
                <View style={styles.titleContainer}>
                    <H2 fontSize={scale.w(14)}>{props.selectedLanguage?.card_number}</H2>
                </View>

                <TextInput
                    value={props.value}
                    onChangeText={props.onChangeText}
                    placeholder={'********' + props.cardNumber?.substr(props.cardNumber?.length - 4)}
                    style={{
                        backgroundColor: colors.WHITE,
                        fontFamily: 'Roboto-Regular',
                        fontSize: scale.w(21),
                        color: colors.DARK,
                        textAlignVertical: 'top',
                        margin: 0,
                        padding: 0,
                    }}
                    editable={false}
                />
                <View style={styles.buttonContainer}>
                    <ButtonPrimary
                        onPress={props.showModal}
                        backgroundColor={props.color || colors.BROWN}
                        text="Confirm"
                        loading={props.loading}
                        chainData={props.chainData}
                    />
                </View>
                <View style={{ marginTop: heightPercentageToDP(3) }}></View>
                <TouchableOpacity
                    onPress={props.closeModal}
                    style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}
                >
                    <Text style={{ color: props.color, fontSize: scale.w(20) }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        paddingHorizontal: scale.w(16),
        paddingVertical: scale.h(24),
        borderRadius: scale.w(30),
    },
    titleContainer: {
        marginBottom: Platform.OS === 'ios' ? scale.w(12) : scale.w(10),
    },
    headerPickerAndroid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: scale.w(12),
        marginBottom: scale.w(-12),
    },
    datePicker: {
        width: '100%',
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
    },
    buttonContainer: {
        marginTop: Platform.OS === 'ios' ? heightPercentageToDP(4) : heightPercentageToDP(3),
    },
});

export default Card;
