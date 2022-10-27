import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { heightPercentageToDP, scale } from '../../../utils/dimensions';
import { H2, H3 } from '../../_global/Text';
import colors from '../../../constants/colors';
import { debounce } from 'lodash';

interface IModalSelectPhotoProps {
    openCamera: () => void;
    openLibrary: () => void;
    selectedLanguage?: any;
}

const ModalSelectPhoto = (props: IModalSelectPhotoProps) => {
    return (
        <View style={styles.container}>
            <H2>{props.selectedLanguage.Select_Passport_Photo}</H2>

            <View style={{ height: heightPercentageToDP(2.0) }} />
            <TouchableOpacity
                onPress={debounce(props.openCamera, 1000, {
                    leading: true,
                    trailing: false,
                })}
                activeOpacity={0.7}
            >
                <View style={{ paddingVertical: heightPercentageToDP(1.6) }}>
                    <H3>{props.selectedLanguage.take_photo}</H3>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={debounce(props.openLibrary, 1000, {
                    leading: true,
                    trailing: false,
                })}
                activeOpacity={0.7}
            >
                <View style={{ paddingVertical: heightPercentageToDP(1.6) }}>
                    <H3>{props.selectedLanguage.choose_from_library}</H3>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        padding: heightPercentageToDP(2.4),
        borderRadius: scale.w(2),
    },
});

export default ModalSelectPhoto;
