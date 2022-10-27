import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import colors from '../../../constants/colors';
import { scale, widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../utils/dimensions';
import { H1, H3 } from '../../_global/Text';
import { RootContainer, Separator } from '../../_global/Container';
import InputText from '../../_global/InputText';
import { ButtonPrimary } from '../../_global/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TDisplay } from '../CheckIn';
import { IVerifyPhoneNumberReduxProps } from './VerifyPhoneNumber.Container';

interface IVerifyPhoneNumberProps extends IVerifyPhoneNumberReduxProps {
    componentId: string;
    phoneNumber: string;
    handleChangeDisplay: (display: TDisplay) => void;
    onChangePhoneNumber: (phoneNumber: string) => void;
}

interface IVerifyPhoneNumberState {
    loading: boolean;
}

class VerifyPhoneNumber extends React.Component<IVerifyPhoneNumberProps, IVerifyPhoneNumberState> {
    constructor(props: IVerifyPhoneNumberProps) {
        super(props);

        this.state = {
            loading: false,
        };

        this._handleNext = this._handleNext.bind(this);
    }

    _handleNext() {
        this.setState({ loading: true });
        this.props.verifyPhoneNumber(
            this.props.phoneNumber,
            () => {
                this.setState({ loading: false });
                this.props.handleChangeDisplay('verify_pin');
            },
            () => {
                this.setState({ loading: false });
            },
        );
    }

    render() {
        return (
            <RootContainer>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={{ height: 30 }} />

                    <View style={StyleSheet.flatten([styles.input_container, { alignItems: 'center' }])}>
                        <View style={styles.circle_phone}>
                            <Ionicons name="ios-call" color={colors.BLUE} size={scale.w(56)} />
                        </View>
                        <Separator height={20} />

                        <H1 fontSize={scale.w(26)} textAlign="center">
                            {'Verify Phone Number'}
                        </H1>
                        <Separator height={5} />
                        <H3 textAlign="center" color={colors.DARK_GREY}>
                            {
                                'Please enter your registered phone number, we will send you the confirmation PIN'
                            }
                        </H3>
                    </View>
                    <Separator height={20} />
                    <View style={styles.input_container}>
                        <InputText
                            value={this.props.phoneNumber}
                            onChangeText={this.props.onChangePhoneNumber}
                            placeholder="ex. +6285..."
                            autoCapitalize="none"
                            keyboardType="phone-pad"
                            returnKeyType="next"
                            autoFocus
                        />
                    </View>
                </ScrollView>

                <View
                    style={{
                        paddingHorizontal: scale.w(18),
                        paddingTop: scale.w(8),
                        paddingBottom: scale.w(34),
                    }}
                >
                    <ButtonPrimary
                        onPress={this._handleNext}
                        loading={this.state.loading}
                        disabled={this.state.loading}
                        fontSize={scale.w(16.5)}
                        text="Next"
                        chainData={this.props.chainData}
                    />
                </View>
            </RootContainer>
        );
    }
}

const styles = StyleSheet.create({
    input_container: {
        width: wp(92),
        alignSelf: 'center',
        marginBottom: hp(2),
    },
    circle_phone: {
        width: scale.w(92),
        height: scale.w(92),
        borderRadius: scale.w(92 / 2),
        borderColor: colors.BLUE,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: scale.w(4),
    },
});

export default VerifyPhoneNumber;
