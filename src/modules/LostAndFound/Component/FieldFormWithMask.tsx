import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../../utils/dimensions';
import { H2, H3, H4 } from '../../_global/Text';
import { TextInputMask, TextInputMaskProps } from 'react-native-masked-text';
import colors from '../../../constants/colors';

interface IFieldFormWithMaskProps extends TextInputMaskProps {
    textOnly?: boolean;
    title?: string;
    height?: number;
}

export default class FieldFormWithMask extends React.PureComponent<IFieldFormWithMaskProps> {
    render() {
        const { height, title, ...propsTextInput } = this.props;

        return (
            <View>
                <View style={styles.container}>
                    <TextInputMask
                        {...propsTextInput}
                        placeholderTextColor={colors.DUMMY_COLOR}
                        style={{
                            fontFamily: 'Roboto-Regular',
                            fontSize: scale.w(1.6),
                            width : widthPercentageToDP(74),
                            color: colors.DUMMY_COLOR,
                            margin: 0,
                            padding: 0,
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // borderRadius: scale.w(30),
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
