import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale } from '../../../utils/dimensions';
import { H3 } from '../../_global/Text';
import colors from '../../../constants/colors';
import { ButtonPrimary } from '../../_global/Button';

interface IModalMessageScanCCProps {
    handleMessageScanCC: () => void;
    color?: string;
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

const ModalMessageScanCC = (props: IModalMessageScanCCProps) => {
    return (
        <View style={styles.container}>
            <H3 fontSize={scale.w(16)} textAlign="center">
                {props.selectedLanguage.scan_credit_card_or_input_manually_in_the_bottom_right_corner}
            </H3>
            <View style={{ height: 20 }} />
            <ButtonPrimary
                backgroundColor={props.color}
                onPress={props.handleMessageScanCC}
                fontSize={scale.w(16.5)}
                ok={this.props.selectedLanguage.ok}
                chainData={props.chainData}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        padding: scale.w(24),
        marginHorizontal: scale.w(30),
        borderRadius: scale.w(30),
    },
});

export default ModalMessageScanCC;
