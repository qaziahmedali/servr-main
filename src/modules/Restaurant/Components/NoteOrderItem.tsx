import React from 'react';
import { View, Platform, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import { addDays } from 'date-fns';
// import { DatePicker } from 'react-native-wheel-datepicker';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../../utils/dimensions';
import { H2, H3 } from '../../_global/Text';
import { ButtonPrimary } from '../../_global/Button';
import colors from '../../../constants/colors';
import { wp } from '../../../utils/dimensions';
import { hp } from '../../../utils/dimensions';

interface INoteOrderItemProps {
    showModal: () => void;
    value: string;
    onChangeText: (value: string) => void;
    title: string;
    color?: string;
    description?: string;
    done?: string;
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

const NoteOrderItem = (props: INoteOrderItemProps) => {
    console.log('===========propssss', props);
    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120} enabled={Platform.OS === 'ios'}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <H2 fontSize={scale.w(1.8)}>{props.title}</H2>
                </View>

                <TextInput
                    multiline
                    value={props.value}
                    onChangeText={props.onChangeText}
                    placeholder={props.description}
                    style={{
                        backgroundColor: colors.WHITE,
                        fontFamily: 'Roboto-Regular',
                        fontSize: scale.w(2),
                        color: colors.DARK,
                        height: heightPercentageToDP(20),
                        textAlignVertical: 'top',
                        margin: 0,
                        padding: 0,
                    }}
                    autoFocus
                />

                <View style={styles.buttonContainer}>
                    <ButtonPrimary
                        onPress={props.showModal}
                        backgroundColor={props.color || colors.BROWN}
                        text={props.done}
                        chainData={props.chainData}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        paddingHorizontal: widthPercentageToDP(5),
        paddingVertical: widthPercentageToDP(4),
        borderRadius: scale.w(3.0),
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

export default NoteOrderItem;
