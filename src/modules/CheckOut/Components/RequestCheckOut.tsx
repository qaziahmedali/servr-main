import React from 'react';
import { Separator } from '../../_global/Container';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP, scale, heightPercentageToDP } from '../../../utils/dimensions';
import colors from '../../../constants/colors';
import { H1 } from '../../_global/Text';
import { View as ViewAnimatable } from 'react-native-animatable';
import { ButtonSecondary } from '../../_global/Button';

interface IRequestCheckOutProps {
    onPress: () => void;
    loading: boolean;
    time: string;
    disabled?: boolean;
    color?: string;
    selectedLanguage?: any;
    onPressCheckOut: () => void;
    loadingCheckOut: boolean;
    disabledCheckOut?: boolean;
    onPressTransction: () => void;
    onPressQuickCheckout: () => void;
}

export default class RequestCheckOut extends React.PureComponent<IRequestCheckOutProps> {
    render() {
        const {
            disabled,
            loading,
            time,
            onPress,
            onPressCheckOut,
            loadingCheckOut,
            disabledCheckOut,
            onPressTransction,
            onPressQuickCheckout,
        } = this.props;

        return (
            <>
                <ViewAnimatable
                    useNativeDriver
                    animation="fadeInUp"
                    duration={300}
                    delay={10}
                    style={styles.input_container}
                >
                    <H1 textAlign="center" fontSize={scale.w(20)} color={colors.DARK_GREY}>
                        {this.props.selectedLanguage.your_check_out_time_is}
                    </H1>
                    <Separator height={27} />
                    <H1 fontSize={scale.w(50)} textAlign="center" color={this.props.color}>
                        {time}
                    </H1>
                </ViewAnimatable>

                <ViewAnimatable
                    useNativeDriver
                    animation="fadeInUp"
                    duration={300}
                    delay={100}
                    style={styles.btn_container}
                >
                    <ButtonSecondary
                        onPress={onPress}
                        loading={loading}
                        disabled={disabled}
                        fontSize={scale.w(18)}
                        text={this.props.selectedLanguage.request_late_check_out}
                        color={colors.BLACK}
                        backgroundColor={colors.WHITE}
                        height={scale.w(82)}
                        loadingColor={this.props.color}
                        withIcon={true}
                    />
                </ViewAnimatable>

                <ViewAnimatable
                    useNativeDriver
                    animation="fadeInUp"
                    duration={300}
                    delay={100}
                    style={styles.btn_container}
                >
                    <ButtonSecondary
                        onPress={onPressTransction}
                        loading={loadingCheckOut}
                        disabled={disabledCheckOut}
                        fontSize={scale.w(18)}
                        text={this.props.selectedLanguage.view_transaction_history}
                        color={colors.BLACK}
                        backgroundColor={colors.WHITE}
                        height={scale.w(82)}
                        loadingColor={this.props.color}
                        withIcon={true}
                    />
                </ViewAnimatable>
                <ViewAnimatable
                    useNativeDriver
                    animation="fadeInUp"
                    duration={300}
                    delay={100}
                    style={styles.btn_container}
                >
                    <ButtonSecondary
                        onPress={onPressQuickCheckout}
                        loading={loadingCheckOut}
                        disabled={disabledCheckOut}
                        fontSize={scale.w(18)}
                        text={this.props.selectedLanguage.quick_checkout}
                        color={colors.BLACK}
                        backgroundColor={colors.WHITE}
                        height={scale.w(82)}
                        loadingColor={this.props.color}
                        withIcon={true}
                    />
                </ViewAnimatable>
            </>
        );
    }
}

const styles = StyleSheet.create({
    input_container: {
        width: widthPercentageToDP(92),
        alignSelf: 'center',
        marginBottom: heightPercentageToDP(2),
        alignItems: 'center',
    },
    btn_container: {
        paddingHorizontal: scale.w(20),
        paddingTop: scale.w(6),
        paddingBottom: scale.w(6),
        width: scale.w(375),
    },
});
