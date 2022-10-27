import React from 'react';
import { View, StyleSheet, Platform, Keyboard, StatusBar, Dimensions, Alert, Text } from 'react-native';
import { Image, View as ViewAnimatable } from 'react-native-animatable';
import { IPromotionAppliedReduxProps } from './PromotionApplied.Container';
import colors from '../../constants/colors';
import { H1, H4, H3 } from '../_global/Text';
import { ButtonPrimary } from '../_global/Button';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { mainmenu, restoMain } from '../../utils/navigationControl';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../utils/dimensions';
import { toast } from '../../utils/handleLogic';
interface IPromotionAppliedProps extends IPromotionAppliedReduxProps {
    componentId: string;
}
//Laterly we will use props when we pass them
interface IPromotionAppliedLocalProps {
    title?: string;
    operationDetails?: string;
    buttonTitle?: string;
}

interface IPromotionAppliedState {
    loading: boolean;
    code: string;
    marginLeft: number;
    modalVisible: boolean;
    email: string;
    password: string;
    type: string;
    signIn: boolean;
    //to make global component
    title: string;
    operationDetails: string;
    buttonTitle: string;
}

class PromotionApplied extends React.Component<
    IPromotionAppliedProps,
    IPromotionAppliedLocalProps,
    IPromotionAppliedState
> {
    constructor(props: IPromotionAppliedProps) {
        super(props);

        this.state = {
            loading: false,
            signIn: true,
            code: '',
            marginLeft: scale.w(100),
            modalVisible: false,
            email: '',
            password: '',
            type: '',
            title: 'Email Sent Successfully',
            operationDetails:
                'Your lost & found request has been \n received, chat with agent for further \n  details.',
            buttonTitle: '',
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: colors.LIGHT_BLUE,
                style: 'light',
            },
        });
    }

    _handleContinue = (type: any) => {
        Keyboard.dismiss();
        this.setState({ loading: true });
        this.props.getHotelDetail(
            this.state.code,
            () => {
                this.setState({ loading: false });
                if (type == 'alreadyLoggedIn') {
                    this.setModalVisible(true);
                } else {
                    if (this.props.type != 'resto') Navigation.setRoot({ root: mainmenu });
                    else
                        Navigation.setRoot({
                            root: restoMain({
                                restaurant: this.props.resto,
                                color: this.props.color,
                                selectedLanguage: this.props.selectedLanguage,
                                type: this.props.type,
                                restoGuest: this.props.restoGuest,
                            }),
                        });
                }
            },
            () => {
                this.setState({ loading: false });
            },
        );
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <View style={{ height: heightPercentageToDP(1) }}></View>
                <Navbar title={''} color={'#fff'} tintBackColor={'black'} />
                <View style={{ height: heightPercentageToDP(7) }}></View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../images/paymentPageImg.png')} />
                    {/* <Navbar /> */}
                    <View style={{ height: heightPercentageToDP(7) }}></View>
                    <Text style={{ fontFamily: 'Roboto-Bold', fontSize: scale.w(20), color: colors.HEX }}>
                        {this.state.title}
                    </Text>

                    <View style={{ height: heightPercentageToDP(4) }}></View>
                    <View style={{ alignSelf: 'center' }}>
                        <Text
                            style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: scale.w(15),
                                color: colors.HEX,
                                opacity: 0.5,
                                textAlign: 'center',
                            }}
                        >
                            {this.state.operationDetails}
                        </Text>
                    </View>

                    <View style={{ height: heightPercentageToDP(4) }}></View>
                    <View style={{ width: '85%' }}>
                        <ButtonPrimary
                            onPress={async () => {
                                if (this.state.email.length == 0) {
                                    toast(this.props.selectedLanguage.please_enter_your_email);
                                    return 0;
                                }
                                if (this.state.password.length == 0) {
                                    toast(this.props.selectedLanguage.please_enter_your_password);
                                    return 0;
                                }
                                await this.setState({
                                    loading: true,
                                });
                                this.props.alreadyCheckedIn(
                                    {
                                        email: this.state.email,
                                        password: this.state.password,
                                    },
                                    () => {
                                        this.setModalVisible(false);
                                        setTimeout(() => {
                                            Navigation.setRoot({ root: mainmenu });
                                            this.setState({
                                                loading: false,
                                            });
                                        }, 500);
                                    },
                                    () => {
                                        this.setState({
                                            loading: false,
                                        });
                                    },
                                );
                            }}
                            backgroundColor={colors.BLUE}
                            text={this.props.selectedLanguage.chat_now}
                            loading={this.state.loading}
                            disabled={this.state.loading}
                            fontSize={scale.w(20)}
                            fontWeight={'bold'}
                            chainData={this.props.chainData}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        height:
            Platform.OS == 'android'
                ? StatusBar.currentHeight > 24
                    ? Dimensions.get('window').height
                    : Dimensions.get('window').height - StatusBar.currentHeight
                : Dimensions.get('screen').height,
        justifyContent: 'center',
        // marginTop: scale.w(100),
    },

    // form style
    formContainer: {
        marginVertical: scale.w(30),
    },
});

export default PromotionApplied;
