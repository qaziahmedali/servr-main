import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { addDays } from 'date-fns';
import { DatePicker } from '@davidgovea/react-native-wheel-datepicker';

import { scale } from '../../../utils/dimensions';
import { H2, H3 } from '../../_global/Text';
import { ButtonPrimary } from '../../_global/Button';
import colors from '../../../constants/colors';

interface IModalDatePickerProps {
    showModal: () => void;
    date: Date;
    onDateChange: (newDate: Date) => void;
    minimumDate?: Date;
    title: string;
    color?: string;
    otherText: any;
    startSelected: boolean;
    dateSelected: boolean;
    minimumDate: any;
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
            {Platform.OS === 'android' &&
                <>
                    {props.startSelected ?
                        <View style={styles.headerPickerAndroid}>
                            <H3 color="#666" fontSize={scale.w(1.4)}>
                                {props.otherText.hours}
                            </H3>
                            <H3 color="#666" fontSize={scale.w(1.4)}>
                                {props.otherText.minutes}
                            </H3>
                        </View>
                        :
                        <>
                            {props.dateSelected ?
                                <View style={styles.headerPickerAndroid}>
                                    <H3 color="#666" fontSize={scale.w(1.4)}>
                                        {props.otherText.date}
                                    </H3>
                                    <H3 color="#666" fontSize={scale.w(1.4)}>
                                        {props.otherText.month}
                                    </H3>
                                    <H3 color="#666" fontSize={scale.w(1.4)}>
                                        {props.otherText.year}
                                    </H3>
                                </View>
                                :
                                <View style={styles.headerPickerAndroid}>
                                    <H3 color="#666" fontSize={scale.w(1.4)}>
                                        {props.otherText.date}
                                    </H3>
                                    <H3 color="#666" fontSize={scale.w(1.4)}>
                                        {props.otherText.month}
                                    </H3>
                                    <H3 color="#666" fontSize={scale.w(1.4)}>
                                        {props.otherText.year}
                                    </H3>
                                    <H3 color="#666" fontSize={scale.w(1.4)}>
                                        {props.otherText.hours}
                                    </H3>
                                    <H3 color="#666" fontSize={scale.w(1.4)}>
                                        {props.otherText.minutes}
                                    </H3>
                                </View>
                            }
                        </>
                    }
                </>
            }
            <DatePicker
                mode={props.startSelected ? 'time' : props.dateSelected ? 'date' : 'datetime'}
                date={props.date}
                style={styles.datePicker}
                onDateChange={props.onDateChange}
                minimumDate={props.minimumDate}
                textSize={scale.w(2.0)}
                minuteInterval={10}
            />

            <View style={styles.buttonContainer}>
                <ButtonPrimary
                    backgroundColor={props.color}
                    onPress={props.showModal}
                    text={props.otherText.ok}
                    fontWeight={'bold'}
                    fontSize={scale.w(1.6)}
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
        paddingHorizontal: scale.w(1.6),
        paddingVertical: scale.h(2.4),
        borderRadius: scale.w(3.0),
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? scale.w(1.2) : scale.w(2.0),
    },
    headerPickerAndroid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: scale.w(1.2),
        marginBottom: scale.w(-1.2),
        paddingLeft: scale.w(1.5),
    },
    datePicker: {
        width: '100%',
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
    },
    buttonContainer: {
        marginTop: Platform.OS === 'ios' ? scale.w(1.2) : 0,
    },
});

export default ModalDatePicker;
