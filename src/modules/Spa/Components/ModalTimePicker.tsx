import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { addDays } from 'date-fns';
// import { DatePicker } from 'react-native-wheel-datepicker';
import { DatePicker } from '@davidgovea/react-native-wheel-datepicker';
import { scale, widthPercentageToDP } from '../../../utils/dimensions';
import { H2, H3 } from '../../_global/Text';
import { ButtonPrimary } from '../../_global/Button';
import colors from '../../../constants/colors';
import { heightPercentageToDP } from '../../../utils/dimensions/windowDimension';

interface IModalTimePickerProps {
    showModal: () => void;
    onDateChange: any;

    minimumDate?: Date;
    title: string;
    isViolet?: boolean;
    color?: string;
    selectedLanguage?: any;
    mode?: any;
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

const ModalTimePicker = (props: IModalTimePickerProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <H2 fontSize={scale.w(2.2)}>{props.title}</H2>
            </View>

            {Platform.OS === 'android' && props.mode === 'time' && (
                <View style={styles.headerPickerAndroid}>
                    <H3 color="#666" fontSize={scale.w(2.2)}>
                        {'Hours'}
                    </H3>
                    <H3 color="#666" fontSize={scale.w(2.2)}>
                        {'Minutes'}
                    </H3>
                </View>
            )}

            {Platform.OS === 'android' && props.mode === 'date' && (
                <View style={styles.headerPickerAndroid}>
                    <H3 color="#666" fontSize={scale.w(2.2)}>
                        {'Day'}
                    </H3>
                    <H3 color="#666" fontSize={scale.w(2.2)}>
                        {'Month'}
                    </H3>
                    <H3 color="#666" fontSize={scale.w(2.2)}>
                        {'Year'}
                    </H3>
                </View>
            )}

            {Platform.OS === 'android' && props.mode === 'date' ? (
                <DatePicker
                    mode={props.mode}
                    style={styles.datePicker}
                    onDateChange={props.onDateChange}
                    minimumDate={props.minimumDate}
                    textSize={scale.w(2.2)}
                />
            ) : (
                <DatePicker
                    mode={props.mode}
                    style={styles.datePicker}
                    onDateChange={props.onDateChange}
                    textSize={scale.w(2.2)}
                />
            )}

            <View style={styles.buttonContainer}>
                <ButtonPrimary
                    backgroundColor={props.color || (props.isViolet ? colors.VIOLET : colors.BROWN)}
                    onPress={props.showModal}
                    text={props.selectedLanguage.okay}
                    chainData={props.chainData}
                />
            </View>
        </View>
    );
};

ModalTimePicker.defaultProps = {
    minimumDate: addDays(new Date(), 1),
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        paddingHorizontal: widthPercentageToDP(5),
        paddingVertical: heightPercentageToDP(4),
        borderRadius: scale.w(3.0),
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? heightPercentageToDP(2) : heightPercentageToDP(2),
    },
    headerPickerAndroid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        // marginTop: heightPercentageToDP(2),
        // marginBottom: heightPercentageToDP(2),
    },
    datePicker: {
        width: '100%',
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
    },
    buttonContainer: {
        marginTop: Platform.OS === 'ios' ? heightPercentageToDP(2) : 0,
    },
});

export default ModalTimePicker;
