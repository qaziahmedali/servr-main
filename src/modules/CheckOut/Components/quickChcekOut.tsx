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
}

export default class RequestCheckOut extends React.PureComponent<IRequestCheckOutProps> {
    render() {
        const { disabled, loading, time, onPress } = this.props;

        return (
            <>
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
                        text={this.props.selectedLanguage.quick_checkout}
                        color={colors.BLACK}
                        backgroundColor={colors.WHITE}
                        height={scale.w(82)}
                        loadingColor={this.props.color}
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
        paddingHorizontal: scale.w(44),
        paddingTop: scale.w(20),
        paddingBottom: scale.w(10),
        width: scale.w(320),
    },
});
