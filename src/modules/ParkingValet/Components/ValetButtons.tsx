import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Text,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../utils/dimensions';
import ProceedPayment from '../../_global/proceedPayment';
import colors from '../../../constants/colors';
import { Navigation } from 'react-native-navigation';
import { scale } from '../../../utils/dimensions';
import { chat, selflparking, valetrequest } from '../../../utils/navigationControl';
import { ButtonPrimary } from '../../_global/Button';

interface IValetButtonsProps {
    componentId: string;
    selectedLanguage: object;
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
    parkingValetData: {
        data: {
            id: number;
            date: string;
            time: string;
            key_access: string;
            status: string;
            request_status: string;
            hotel_booking_id: number;
            valet_setting_id?: any;
            valet_time: string;
            valet_date: string;
            vehicle: {
                id: number;
                manufacturer: string;
                color: string;
                license_plate: string;
                location: string;
                image: string;
                description: string;
                valet_id: number;
            };
        };
    };
    Primary_Color: any;
    color: any;
    isLoading: boolean;
    toggleIsInChatScreen: any;
    updateTotalUnreadMessageSuccess: any;
}

interface IValetButtonsState {
    isLoading: boolean;
    buttonLoader: boolean;
    currentId: number;
    carModel: string;
    licenseNumber: string;
    parkedAt: string;
    licenseImage: object;
    imageSelected: boolean;
    added: boolean;
}

class ValetButtons extends React.Component<IValetButtonsProps, IValetButtonsState> {
    constructor(props: IValetButtonsProps) {
        super(props);
        console.log('NOmanPROPS', props);
        this.state = {
            isLoading: false,
            buttonLoader: false,
            currentId: 0,
            carModel: this.props.parkingValetData?.data?.vehicle?.manufacturer,
            licenseNumber: this.props.parkingValetData?.data?.vehicle?.license_plate,
            parkedAt: this.props.parkingValetData?.data?.vehicle?.location,
            imageSelected: false,
            added: this.props.added,
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: colors.LIGHT_BLUE,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleSelfParking = this._handleSelfParking.bind(this);
        this._handleValetRequest = this._handleValetRequest.bind(this);
        this._handleChat = this._handleChat.bind(this);
    }

    _handleValetRequest() {
        Navigation.push(this.props.componentId, valetrequest);
    }
    _handleSelfParking() {
        Navigation.push(this.props.componentId, selflparking);
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }
    _handleChat() {
        this.props.toggleIsInChatScreen(true);
        this.props.updateTotalUnreadMessageSuccess(0);
        Navigation.push(this.props.componentId, chat({ from: 'restaurant' }));
        // Navigation.mergeOptions(this.props.componentId, {
        //     bottomTabs: {
        //         currentTabId: 1
        //     },
        // });
    }
    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
                <ScrollView>
                    <View style={{ paddingHorizontal: wp(5) }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: hp(10),
                                marginTop: hp(20),
                            }}
                        ></View>
                        <View style={{ height: hp(2) }} />

                        <View style={{ height: hp(6) }} />
                        <ButtonPrimary
                            backgroundColor={
                                this.props.Primary_Color === '' ? colors.BLUE : this.props.Primary_Color
                            }
                            onPress={this._handleSelfParking}
                            // onPress={this._handleSelfParking}
                            text={this.props.selectedLanguage.self_parking}
                            //loading={this.state.isLoading}
                            fontWeight={'bold'}
                            chainData={this.props.chainData}
                        />
                    </View>
                    <View style={{ paddingHorizontal: wp(5), marginTop: hp(2) }}>
                        {this.props.parkingValetData.data?.status === 'park_request' &&
                            this.props.parkingValetData.data?.request_status === 'pending' ? (
                            <View
                                style={{
                                    width: '100%',
                                    borderWidth: 1.5,
                                    borderColor: this.props.color,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: hp(1.8),
                                    borderRadius: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontFamily: 'Roboto-Medium',
                                        color: this.props.color,
                                    }}
                                >
                                    {this.props.selectedLanguage.valet_request}
                                </Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={{
                                    width: '100%',
                                    borderWidth: 1.5,
                                    borderColor: this.props.color,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: hp(1.8),
                                    borderRadius: 8,
                                }}
                                onPress={this._handleValetRequest}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontFamily: 'Roboto-Medium',
                                        color: this.props.color,
                                    }}
                                >
                                    {this.props.selectedLanguage.valet_request}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>

                <View
                    style={{
                        height: Platform.OS == 'android' ? '100%' : null,
                        bottom: Platform.OS == 'android' ? null : 0,
                        width: '100%',
                        justifyContent: 'flex-end',
                        position: 'absolute',
                    }}
                >
                    <ProceedPayment
                        onPress={this._handleChat}
                        backGroundColor={this.props.color}
                        btnText={this.props.selectedLanguage.chat_now}
                        // loader={this.state.loading}
                        total={this.props.selectedLanguage.how_can_we_help}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        paddingBottom: scale.h(20),
    },
    navbar: {
        height: scale.h(56),
        alignItems: 'center',
        justifyContent: 'center',
    },
    MainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale.h(10),
    },
    ItemContainer: {
        backgroundColor: 'white',
        borderRadius: scale.h(10),
        marginHorizontal: scale.w(10),
        marginVertical: scale.w(10),
        paddingVertical: scale.w(12),
        paddingHorizontal: scale.w(15),
        width: scale.w(320),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    btn_chat_container: {
        paddingHorizontal: scale.w(100),
        paddingVertical: scale.w(12),
    },
});

export default ValetButtons;
