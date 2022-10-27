import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import colors from '../../../constants/colors';
import { scale, widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../utils/dimensions';
import { H1, H3 } from '../../_global/Text';
import { RootContainer, Separator } from '../../_global/Container';
import { ButtonPrimary } from '../../_global/Button';
import CodeInput from 'react-native-confirmation-code-field';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IVerifyPinReduxProps } from './VerifyPin.Container';
import { Navigation } from 'react-native-navigation';
import { toast } from '../../../utils/handleLogic';

interface IVerifyPinProps extends IVerifyPinReduxProps {
    componentId: string;
    phoneNumber: string;
}

interface IVerifyPinState {
    loading: boolean;
    counterResend: number;
}

class VerifyPin extends React.Component<IVerifyPinProps, IVerifyPinState> {
    private codeinput = React.createRef<CodeInput>();
    private timerResend: NodeJS.Timeout | null = null;

    constructor(props: IVerifyPinProps) {
        super(props);

        this.state = {
            loading: false,
            counterResend: 0,
        };

        this._login = this._login.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._resendPin = this._resendPin.bind(this);
        this._counterResendPin = this._counterResendPin.bind(this);
    }

    componentDidMount() {
        this.props.onAuthStateChanged(this._login);
    }

    componentWillUnmount() {
        this.props.removeOnAuthStateChanged();

        if (this.timerResend) {
            clearInterval(this.timerResend);
        }
    }

    _login(token: string) {
        this.setState({ loading: true });
        this.props.login(
            token,
            () => {
                this.setState({ loading: false });
                Navigation.pop(this.props.componentId);
            },
            () => {
                this.setState({ loading: false });
            },
        );
    }

    _onSubmit() {
        const pin = this.codeinput.current ? this.codeinput.current.state.codeValue : '';
        this.setState({ loading: true });
        this.props.verifyPin(pin, this._login, () => {
            this.setState({ loading: false });
        });
    }

    _resendPin() {
        this.setState({ loading: true });
        this.props.verifyPhoneNumber(
            this.props.phoneNumber,
            () => {
                this.setState({ loading: false });
                toast(`'Success ' ${'New PIN has been send.'}`);
            },
            () => {
                this.setState({ loading: false });
            },
        );

        this._counterResendPin();
    }

    _counterResendPin() {
        this.setState({ counterResend: 30 });
        this.timerResend = setInterval(() => {
            this.setState(
                (prevState) => ({ counterResend: prevState.counterResend - 1 }),
                () => {
                    if (this.state.counterResend <= 0 && this.timerResend) {
                        clearInterval(this.timerResend);
                    }
                },
            );
        }, 1000);
    }

    render() {
        return (
            <RootContainer>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={{ height: 30 }} />

                    <View style={StyleSheet.flatten([styles.input_container, { alignItems: 'center' }])}>
                        <View style={styles.circle_phone}>
                            <Ionicons name="ios-flower" color={colors.BLUE} size={scale.w(56)} />
                        </View>
                        <Separator height={20} />

                        <H1 fontSize={scale.w(26)} textAlign="center">
                            {'Verify PIN'}
                        </H1>
                        <Separator height={5} />
                        <H3 textAlign="center" color={colors.DARK_GREY}>
                            {`Input the confirmation PIN, that we are sending to ${this.props.phoneNumber}`}
                        </H3>
                    </View>
                    <Separator height={20} />

                    <View style={styles.input_container}>
                        <CodeInput
                            ref={this.codeinput}
                            cellProps={({ isFocused }) => ({
                                style: {
                                    backgroundColor: colors.WHITE,
                                    borderColor: isFocused ? colors.BLUE : colors.DARK_GREY,
                                    borderWidth: 1,
                                    borderRadius: 3,
                                    color: colors.BLACK,
                                    fontFamily: 'Roboto-Regular',
                                },
                            })}
                            codeLength={6}
                            onFulfill={this._onSubmit}
                        />
                    </View>
                    <Separator height={20} />
                    <TouchableOpacity
                        onPress={this._resendPin}
                        activeOpacity={0.6}
                        disabled={this.state.counterResend > 0}
                    >
                        <View style={{ paddingVertical: scale.w(12) }}>
                            <H3
                                textAlign="center"
                                color={this.state.counterResend > 0 ? colors.DARK_GREY : colors.BLUE}
                            >
                                {`Didn't receieve the PIN? ${
                                    this.state.counterResend > 0
                                        ? `(wait ${this.state.counterResend} seconds)`
                                        : ''
                                }`}
                            </H3>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                <View
                    style={{
                        paddingHorizontal: scale.w(18),
                        paddingTop: scale.w(8),
                        paddingBottom: scale.w(34),
                    }}
                >
                    <ButtonPrimary
                        onPress={this._onSubmit}
                        loading={this.state.loading}
                        disabled={this.state.loading}
                        fontSize={scale.w(16.5)}
                        text="Verify"
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

export default VerifyPin;
