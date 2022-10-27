import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { addDays } from 'date-fns';
import { DatePicker } from '@davidgovea/react-native-wheel-datepicker';
import { scale, widthPercentageToDP } from '../../../utils/dimensions';
import { H2, H3 } from '../../_global/Text';
import { ButtonPrimary } from '../../_global/Button';
import colors from '../../../constants/colors';
import { heightPercentageToDP } from '../../../utils/dimensions/windowDimension';

interface IModalDatePickerProps {
    showModal: () => void;
    date: Date;
    onDateChange: (newDate: Date) => void;
    minimumDate?: Date;
    title: string;
    color?: string;
    otherText?: any;
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

const ModalDatePicker = (props: IModalDatePickerProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <H2 fontSize={scale.w(1.6)}>{props.title}</H2>
            </View>

            {Platform.OS === 'android' && (
                <View style={styles.headerPickerAndroid}>
                    <H3 color="#666" fontSize={scale.w(1.4)}>
                        {props.otherText?.date}
                    </H3>
                    <H3 color="#666" fontSize={scale.w(1.4)}>
                        {props.otherText?.month}
                    </H3>
                    <H3 color="#666" fontSize={scale.w(1.4)}>
                        {props.otherText?.year}
                    </H3>
                </View>
            )}

            <DatePicker
                mode="date"
                date={props.date}
                style={styles.datePicker}
                onDateChange={props.onDateChange}
                minimumDate={props.minimumDate ? props.minimumDate : new Date()}
                textSize={scale.w(2.0)}
            />

            <View style={styles.buttonContainer}>
                <ButtonPrimary
                    backgroundColor={props.color}
                    onPress={props.showModal}
                    text={props.otherText?.ok}
                    chainData={props.chainData}
                />
            </View>
        </View>
    );
};

ModalDatePicker.defaultProps = {
    minimumDate: addDays(new Date(), 1),
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        paddingHorizontal: widthPercentageToDP(3),
        paddingVertical: heightPercentageToDP(2),
        borderRadius: scale.w(3.0),
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? widthPercentageToDP(4) : widthPercentageToDP(6),
    },
    headerPickerAndroid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: heightPercentageToDP(3),
        marginBottom: -heightPercentageToDP(4),
    },
    datePicker: {
        width: '100%',
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
    },
    buttonContainer: {
        marginTop: Platform.OS === 'ios' ? widthPercentageToDP(4) : 0,
    },
});

export default ModalDatePicker;
