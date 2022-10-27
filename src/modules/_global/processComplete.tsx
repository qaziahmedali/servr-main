import React from 'react';
import { View, StyleSheet, Platform, Keyboard, StatusBar, Dimensions, Alert } from 'react-native';
import { Image, View as ViewAnimatable } from 'react-native-animatable';
import colors from '../../constants/colors';
import { H1, H4, H3 } from './Text';
import { ButtonPrimary } from './Button';
import Navbar from './Navbar';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../utils/dimensions';
import { ScrollView } from 'react-native-gesture-handler';

interface IPayment_Successfull_SubmissionProps {
    componentId: string;
    processImage: any;
    processTitle: string;
    processDescription: string;
    loading: boolean;
    buttonColor: string;
    backgroundColor: string;
    chainData: {
        data: {
            name: string;
            logo: string;
            splash_screen: string;
            private_policy: string;
            terms_n_conditions: string;
            about_us: string;
            contact_us: string;
            logo_gif_dark: string;
            logo_gif_light: string;
            signup_bg: string;
            signin_bg: string;
        };
    };
}

interface IPayment_Successfull_SubmissionState {
    loading: boolean;
    code: string;
    marginLeft: number;
    modalVisible: boolean;
    email: string;
    password: string;
    type: string;
    signIn: boolean;
    processImage: any;
    processTitle: string;
    processDescription: string;
    onButtonPress: () => void;
    onButtonPress2: () => void;
    onBackClick: () => void;
    btnText: string;
    btnText2: string;
    loading2: boolean;
    twoButton: boolean;
    buttonColor: string;
}

class ProcessComplete extends React.Component<
    IPayment_Successfull_SubmissionProps,
    IPayment_Successfull_SubmissionState
> {
    constructor(props: IPayment_Successfull_SubmissionProps) {
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
        };
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.WHITE,
                    heigt: heightPercentageToDP(100),
                    width: widthPercentageToDP(100),
                    justifyContent: 'center',
                }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ height: heightPercentageToDP(12) }}>
                        {/* <Navbar 
                title={''} 
                color={'#fff'} 
                onClick={this.props.onBackClick} 
                tintBackColor={'black'} /> */}
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={this.props.processImage} />
                        {/* <Navbar /> */}
                        <View style={{ height: heightPercentageToDP(7) }}></View>

                        <H4 textAlign="center" fontFamily={'Roboto-Bold'} fontSize={scale.w(2.2)}>
                            {this.props.processTitle}
                        </H4>

                        <View style={{ height: heightPercentageToDP(2.3) }}></View>
                        <View style={{ alignSelf: 'center', width: widthPercentageToDP(70) }}>
                            <H4
                                textAlign="center"
                                fontFamily={'Roboto-Regular'}
                                color={colors.BLACK}
                                opacity={0.5}
                                fontSize={scale.w(1.8)}
                            >
                                {this.props.processDescription}
                            </H4>
                        </View>

                        <View style={{ height: heightPercentageToDP(7) }} />
                        <View style={{ width: '90%' }}>
                            {this.props.twoButton ? (
                                <ButtonPrimary
                                    onPress={this.props.onButtonPress2}
                                    backgroundColor={this.props.backgroundColor}
                                    text={this.props.btnText2}
                                    loading={this.props.loading2}
                                    disabled={this.props.loading2}
                                    fontSize={scale.w(2.2)}
                                    fontWeight={'bold'}
                                    chainData={this.props.chainData}
                                />
                            ) : null}
                            <View style={{ height: heightPercentageToDP(2) }} />
                            <ButtonPrimary
                                onPress={this.props.onButtonPress}
                                backgroundColor={this.props.backgroundColor}
                                text={this.props.btnText}
                                loading={this.props.loading}
                                disabled={this.props.loading}
                                fontSize={scale.w(2.2)}
                                fontWeight={'bold'}
                                chainData={this.props.chainData}
                            />
                        </View>
                    </View>
                    <View style={{ height: heightPercentageToDP(10) }} />
                </ScrollView>
            </View>
        );
    }
}

export default ProcessComplete;
