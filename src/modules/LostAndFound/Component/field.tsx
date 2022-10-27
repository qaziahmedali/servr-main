import React from 'react';
import { View, Platform, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
// import { DatePicker } from 'react-native-wheel-datepicker';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../../utils/dimensions';
import { H2, H3, H4 } from '../../_global/Text';
import colors from '../../../constants/colors';

interface LostAndFoundProps {
    value?: string;
    onChangeText: (value: string) => void;
    title: string;
    color?: string;
    height?: number;
    width?: number;
    placeholder?: string;
    autofocus?: boolean;
    multiline?: boolean;
    keyboardType?: string;
    inputStyle: any;
    maxLength: any;
    disabled: any;
    editable: any;
    numberOfLines: any;
    textAlignVertical: any;
    placeholderTextColor: any;
}
const NoteOrderItem = (props: LostAndFoundProps) => {
    return (
        <View>
            <View style={styles.container}>
                <TextInput
                    maxLength={props.maxLength}
                    multiline={props.multiline}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    placeholder={props.placeholder}
                    placeholderTextColor={props.multiline ? colors.LOST_FOUND_ICON_COLOR : colors.DUMMY_COLOR}
                    style={[{
                        fontFamily: 'Roboto-Regular',
                        fontSize: scale.w(1.6),
                        width: widthPercentageToDP(74),
                        color: props.multiline ? colors.LOST_FOUND_ICON_COLOR : colors.DUMMY_COLOR,
                        margin: 0,
                        padding: 0,
                    }, props.inputStyle]}
                    autoFocus={props.autofocus}
                    keyboardType={props.keyboardType}
                    disabled={props.disabled}
                    editable={props.editable}
                    numberOfLines={props.numberOfLines}
                    textAlignVertical={props.textAlignVertical}
                />

                {/* <View style={styles.buttonContainer}>
                    <ButtonPrimary
                        onPress={props.onPress}
                        backgroundColor={props.color || colors.BROWN}
                        text="Done"
                    />
                </View> */}
                {/* <View
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        opacity: 0.6,
                        height: 1,
                        width: '100%',
                        marginTop: scale.w(6),
                    }}
                /> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        //    paddingHorizontal:heightPercentageToDP(0.01)
    },
    titleContainer: {
        alignItems: 'flex-start',
        marginBottom: Platform.OS === 'ios' ? heightPercentageToDP(0.5) : heightPercentageToDP(1.3),
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
        marginTop: Platform.OS === 'ios' ? scale.w(12) : 0,
    },
});

export default NoteOrderItem;
