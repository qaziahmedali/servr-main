import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';

import { IParkingValetCompleteReduxProps } from './ParkingValetComplete.Container';

import colors from '../../constants/colors';
import { H3 } from '../_global/Text';
import { ButtonPrimary } from '../_global/Button';

import { Navigation } from 'react-native-navigation';

import { scale } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FeatherIcons from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import CustomModal from '../_global/CustomModal';
import ProcessComplete from '../_global/processComplete';

interface IParkingValetCompleteProps extends IParkingValetCompleteReduxProps {
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
            valet_type: string;
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
    _handleGrabRequest: any;
    _handleReParkRequest: any;
    loading: boolean;
}

interface IParkingCompleteState {
    isLoading: boolean;
    buttonLoader: boolean;
    currentId: number;
    carModel: string;
    licenseNumber: string;
    parkedAt: string;
    description: string;
    color: string;
    licenseImage: object;
    imageSelected: boolean;
    added: boolean;
}

class ParkingValetComplete extends React.Component<IParkingValetCompleteProps, IParkingCompleteState> {
    constructor(props: IParkingValetCompleteProps) {
        super(props);
        console.log('NOmanPROPS', props);
        this.state = {
            isLoading: false,
            buttonLoader: false,
            currentId: 0,
            carModel:
                this.props.parkingValetData?.data?.vehicle?.manufacturer !== '' &&
                this.props.parkingValetData?.data?.vehicle?.manufacturer !== null
                    ? this.props.parkingValetData?.data?.vehicle?.manufacturer
                    : '',
            licenseNumber:
                this.props.parkingValetData?.data?.vehicle?.license_plate !== '' &&
                this.props.parkingValetData?.data?.vehicle?.license_plate !== null
                    ? this.props.parkingValetData?.data?.vehicle?.license_plate
                    : '',
            parkedAt:
                this.props.parkingValetData?.data?.vehicle?.location !== '' &&
                this.props.parkingValetData?.data?.vehicle?.location !== null
                    ? this.props.parkingValetData?.data?.vehicle?.location
                    : '',
            // description: this.props.parkingValetData?.data?.vehicle?.description,
            description:
                this.props.parkingValetData?.data?.vehicle?.description !== '' &&
                this.props.parkingValetData?.data?.vehicle?.description !== null
                    ? this.props.parkingValetData?.data?.vehicle?.description
                    : '',
            color:
                this.props.parkingValetData?.data?.vehicle?.color !== '' &&
                this.props.parkingValetData?.data?.vehicle?.color !== null
                    ? this.props.parkingValetData?.data?.vehicle?.color
                    : '',
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
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _UploadLicenseImage() {
        var options = {
            title: 'Select Image',
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            storageOptions: {
                skipBackup: true,
            },
        };

        ImagePicker.showImagePicker(options, (res) => {
            console.log('Response = ', res);

            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
                // } else if (res.customButton) {
                //   console.log('User tapped custom button: ', res.customButton);
                //   alert(res.customButton);
            } else {
                let source = res;
                this.setState({
                    licenseImage: source,
                    imageSelected: true,
                });
            }
        });
        console.log(this.state.licenseNumber);
    }

    _handleUpdateValetParking() {
        this.setState({
            isLoading: true,
        });
        const data = {
            model_name: this.state.carModel,
            parking_slot_no: this.state.parkedAt,
            parking_id: this.props.item.id,
            number_plate: {
                uri: this.state.licenseImage?.uri,
                name: this.state.licenseImage?.fileName,
                type: this.state.licenseImage?.type,
            },
        };

        const data2 = {
            model_name: this.state.carModel,
            parking_slot_no: this.state.parkedAt,
            parking_id: this.props.item.id,
            number_plate: null,
        };
        if (this.state.imageSelected) {
            this.props.updateValetParking(
                data,
                () => {
                    console.log('Update Profile Success');
                    this._modalConfirm.current?.show();
                    this.setState({
                        isLoading: false,
                    });
                },
                () => {
                    console.log('Update Profile Failed');
                    this.setState({
                        isLoading: false,
                    });
                },
            );
        } else {
            this.props.updateValetParking(
                data2,
                () => {
                    console.log('Update Profile Success');
                    this._modalConfirm.current?.show();
                    this.setState({
                        isLoading: false,
                    });
                },
                () => {
                    console.log('Update Profile Failed');
                    this.setState({
                        isLoading: false,
                    });
                },
            );
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
                <ScrollView>
                    {this.state.added ? (
                        <View style={{ paddingHorizontal: wp(5) }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: hp(10),
                                    marginTop: hp(10),
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontFamily: 'Harabara',
                                            color: colors.SignInUsingColor,
                                            fontSize: scale.w(2),
                                        }}
                                    >
                                        {this.props.selectedLanguage.vehicle_details}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto-Regular',
                                            color: '#8F9BB3',
                                            fontSize: scale.w(1.5),
                                        }}
                                    >
                                        {this.props.selectedLanguage.see_your_vehicle_details_below}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            added: false,
                                            licenseImage: {
                                                uri: undefined,
                                                fileName: '',
                                                type: '',
                                            },
                                            parkedAt: '',
                                            carModel: '',
                                        })
                                    }
                                >
                                    <AntDesignIcons
                                        name="pluscircle"
                                        size={scale.w(2.4)}
                                        color={
                                            this.props.Primary_Color === ''
                                                ? colors.BLUE
                                                : this.props.Primary_Color
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: colors.COM_BACKGROUND,
                                    // height: hp(9),
                                    paddingVertical: heightPercentageToDP(1.1),
                                    marginTop: hp(2),
                                    borderRadius: 10,
                                    alignItems: 'center',
                                }}
                            >
                                <FontAwesome5Icons
                                    name="car-alt"
                                    size={scale.w(2.7)}
                                    color={
                                        this.props.Primary_Color === ''
                                            ? colors.BLUE
                                            : this.props.Primary_Color
                                    }
                                    style={{ paddingRight: wp(2), paddingLeft: wp(4) }}
                                />
                                <View
                                    style={{
                                        paddingHorizontal: 10,
                                        justifyContent: 'flex-start',
                                        width: '84%',
                                        //  alignSelf: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            // paddingVertical: hp(1),
                                            fontFamily: 'Roboto-Medium',
                                            color: colors.SignInUsingColor,
                                            fontSize: scale.w(1.5),
                                        }}
                                    >
                                        {this.props.selectedLanguage.car_model}
                                    </Text>
                                    <TextInput
                                        placeholder={this.props.selectedLanguage.your_car_modal}
                                        value={this.state.carModel}
                                        onChangeText={(val) => this.setState({ carModel: val })}
                                        multiline={true}
                                        style={{
                                            padding: 0,
                                            margin: 0,
                                            //  paddingHorizontal: 10,
                                            //width: '85%',
                                            width: widthPercentageToDP(70),
                                            fontFamily: 'Roboto-Regular',
                                            color: colors.DUMMY_COLOR,
                                            // textAlign: 'center',
                                            fontSize: scale.w(1.2),
                                        }}
                                        placeholderTextColor={colors.DUMMY_COLOR}
                                        // style={{ borderBottomColor: '#E4E7F1', borderBottomWidth: 1 }}
                                    />
                                </View>
                            </View>
                            <View style={{ height: hp(2) }} />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: colors.COM_BACKGROUND,
                                    height: hp(9),
                                    width: wp(90),
                                    borderRadius: 10,
                                    alignItems: 'center',
                                }}
                            >
                                <FeatherIcons
                                    name="hash"
                                    size={scale.w(2.7)}
                                    color={
                                        this.props.Primary_Color === ''
                                            ? colors.BLUE
                                            : this.props.Primary_Color
                                    }
                                    style={{ paddingRight: wp(2), paddingLeft: wp(4) }}
                                />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: wp(73),
                                        alignItems: 'center',
                                    }}
                                >
                                    <View>
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                paddingHorizontal: 10,
                                                justifyContent: 'center',
                                                //  alignSelf: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    // paddingVertical: hp(1),
                                                    fontFamily: 'Roboto-Medium',
                                                    color: colors.SignInUsingColor,
                                                    fontSize: scale.w(1.5),
                                                }}
                                            >
                                                {this.props.selectedLanguage.license_plate_no}
                                            </Text>
                                            <TextInput
                                                placeholderTextColor={colors.DUMMY_COLOR}
                                                editable={false}
                                                placeholder={
                                                    this.state.licenseImage?.type
                                                        ? this.state.licenseImage.type
                                                        : 'YB 9802XZ'
                                                }
                                                // onChangeText={val => this.setState({ licenseNumber : val })}
                                                style={{
                                                    padding: 0,
                                                    margin: 0,
                                                    //  paddingHorizontal: 10,
                                                    //width: '85%',
                                                    fontFamily: 'Roboto-Regular',
                                                    color: colors.GREY,
                                                    // textAlign: 'center',
                                                    fontSize: scale.w(1.4),
                                                }}
                                                // style={{ borderBottomColor: '#E4E7F1', borderBottomWidth: 1 }}
                                            />
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this._UploadLicenseImage()}
                                        style={{
                                            //   backgroundColor: colors.ANONYMOUS2,
                                            backgroundColor: 'rgba(56,121,240,0.1)',
                                            width: widthPercentageToDP(8),
                                            height: widthPercentageToDP(8),
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: scale.w(0.9),
                                        }}
                                    >
                                        {this.state.imageSelected == false ? (
                                            this.state.licenseImage && this.state.licenseImage?.uri ? (
                                                <Image
                                                    style={{ height: 40, width: 40 }}
                                                    source={{ uri: this.state.licenseImage.uri }}
                                                ></Image>
                                            ) : (
                                                <FeatherIcons
                                                    name="camera"
                                                    opacity={1}
                                                    size={scale.w(2)}
                                                    color={
                                                        this.props.Primary_Color === ''
                                                            ? colors.BLUE
                                                            : this.props.Primary_Color
                                                    }
                                                />
                                            )
                                        ) : (
                                            <Image
                                                style={{ height: 40, width: 40 }}
                                                source={{ uri: this.state.licenseImage.uri }}
                                            ></Image>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ height: hp(2) }} />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: colors.COM_BACKGROUND,
                                    // height: hp(9),
                                    paddingVertical: heightPercentageToDP(1.3),
                                    borderRadius: 10,
                                    alignItems: 'center',
                                }}
                            >
                                <FeatherIcons
                                    name="settings"
                                    size={scale.w(2.7)}
                                    color={
                                        this.props.Primary_Color === ''
                                            ? colors.BLUE
                                            : this.props.Primary_Color
                                    }
                                    style={{ paddingRight: wp(2), paddingLeft: wp(4) }}
                                />
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        paddingHorizontal: 10,
                                        justifyContent: 'center',
                                        width: '84%',

                                        //  alignSelf: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            // paddingVertical: hp(1),
                                            fontFamily: 'Roboto-Medium',
                                            color: colors.SignInUsingColor,
                                            fontSize: scale.w(1.5),
                                        }}
                                    >
                                        {this.props.selectedLanguage.parked_at}
                                    </Text>
                                    <TextInput
                                        placeholderTextColor={colors.DUMMY_COLOR}
                                        placeholder={'Your Parking Slot No.'}
                                        multiline={true}
                                        value={this.state.parkedAt}
                                        onChangeText={(val) => this.setState({ parkedAt: val })}
                                        style={{
                                            padding: 0,
                                            margin: 0,
                                            //  paddingHorizontal: 10,
                                            width: '90%',
                                            fontFamily: 'Roboto-Regular',
                                            color: colors.GREY,
                                            // textAlign: 'center',
                                            fontSize: scale.w(1.4),
                                        }}
                                        // style={{ borderBottomColor: '#E4E7F1', borderBottomWidth: 1 }}
                                    />
                                </View>
                            </View>
                            <View style={{ height: hp(6) }} />
                            <ButtonPrimary
                                backgroundColor={
                                    this.props.Primary_Color === '' ? colors.BLUE : this.props.Primary_Color
                                }
                                onPress={this._handleUpdateValetParking}
                                text={this.props.selectedLanguage.update}
                                loading={this.state.isLoading}
                                fontWeight={'bold'}
                                chainData={this.props.chainData}
                            />
                        </View>
                    ) : (
                        <View style={{ paddingHorizontal: wp(5) }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: hp(10),
                                    marginTop: hp(10),
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontFamily: 'Harabara',
                                            color: colors.SignInUsingColor,
                                            fontSize: scale.w(2),
                                        }}
                                    >
                                        {this.props.selectedLanguage.vehicle_details}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto-Regular',
                                            color: '#8F9BB3',
                                            fontSize: scale.w(1.5),
                                        }}
                                    >
                                        {this.props.selectedLanguage.see_your_vehicle_details_below}
                                    </Text>
                                </View>
                                {/* <AntDesignIcons
                                    name="pluscircle"
                                    size={scale.w(2.4)}
                                    color={
                                        this.props.Primary_Color === ''
                                            ? colors.BLUE
                                            : this.props.Primary_Color
                                    }
                                /> */}
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: colors.COM_BACKGROUND,
                                    height: hp(9),
                                    marginTop: hp(2),
                                    borderRadius: 10,
                                    alignItems: 'center',
                                }}
                            >
                                <FontAwesome5Icons
                                    name="car-alt"
                                    size={scale.w(2.7)}
                                    color={
                                        this.props.Primary_Color === ''
                                            ? colors.BLUE
                                            : this.props.Primary_Color
                                    }
                                    style={{ paddingRight: wp(2), paddingLeft: wp(4) }}
                                />
                                <View
                                    style={{
                                        paddingHorizontal: 10,
                                        justifyContent: 'flex-start',
                                        //  alignSelf: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            // paddingVertical: hp(1),
                                            fontFamily: 'Roboto-Medium',
                                            color: colors.SignInUsingColor,
                                            fontSize: scale.w(1.5),
                                        }}
                                    >
                                        {this.props.selectedLanguage.car_model}
                                    </Text>
                                    <TextInput
                                        placeholder={this.props.selectedLanguage.your_car_modal}
                                        editable={false}
                                        value={`${this.state.carModel} ${
                                            this.state.color !== ''
                                                ? `(${this.state.color})`
                                                : this.props.selectedLanguage.your_car_modal
                                        } `}
                                        // onChangeText={(val) => this.setState({ carModel: val })}
                                        style={{
                                            padding: 0,
                                            margin: 0,
                                            //  paddingHorizontal: 10,
                                            width: widthPercentageToDP(70),
                                            fontFamily: 'Roboto-Regular',
                                            color: colors.DUMMY_COLOR,
                                            // textAlign: 'center',
                                            fontSize: scale.w(1.2),
                                        }}
                                        placeholderTextColor={colors.DUMMY_COLOR}

                                        // style={{ borderBottomColor: '#E4E7F1', borderBottomWidth: 1 }}
                                    />
                                </View>
                            </View>
                            <View style={{ height: hp(2) }} />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: colors.COM_BACKGROUND,
                                    height: hp(9),
                                    width: wp(90),
                                    borderRadius: 10,
                                    alignItems: 'center',
                                }}
                            >
                                <FeatherIcons
                                    name="hash"
                                    size={scale.w(2.7)}
                                    color={
                                        this.props.Primary_Color === ''
                                            ? colors.BLUE
                                            : this.props.Primary_Color
                                    }
                                    style={{ paddingRight: wp(2), paddingLeft: wp(4) }}
                                />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: wp(73),
                                        alignItems: 'center',
                                    }}
                                >
                                    <View>
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                paddingHorizontal: 10,
                                                justifyContent: 'center',
                                                //  alignSelf: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    // paddingVertical: hp(1),
                                                    fontFamily: 'Roboto-Medium',
                                                    color: colors.SignInUsingColor,
                                                    fontSize: scale.w(1.5),
                                                }}
                                            >
                                                {this.props.selectedLanguage.license_plate_no}
                                            </Text>
                                            <TextInput
                                                placeholderTextColor={colors.DUMMY_COLOR}
                                                editable={false}
                                                value={this.state.licenseNumber}
                                                placeholder={
                                                    this.state.licenseNumber
                                                        ? this.state.licenseNumber
                                                        : 'YB 9802XZ'
                                                }
                                                // onChangeText={val => this.setState({ licenseNumber : val })}
                                                style={{
                                                    padding: 0,
                                                    margin: 0,
                                                    //  paddingHorizontal: 10,
                                                    //width: '85%',
                                                    fontFamily: 'Roboto-Regular',
                                                    color: colors.GREY,
                                                    // textAlign: 'center',
                                                    fontSize: scale.w(1.4),
                                                }}
                                                // style={{ borderBottomColor: '#E4E7F1', borderBottomWidth: 1 }}
                                            />
                                        </View>
                                    </View>
                                    {/* <TouchableOpacity
                                        onPress={() => this._UploadLicenseImage()}
                                        style={{
                                            //   backgroundColor: colors.ANONYMOUS2,
                                            backgroundColor: 'rgba(56,121,240,0.1)',
                                            width: 40,
                                            height: 40,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 10,
                                        }}
                                    >
                                        {this.state.imageSelected == false ? (
                                            <FeatherIcons
                                                name="camera"
                                                opacity={1}
                                                size={scale.w(2)}
                                                color={
                                                    this.props.Primary_Color === ''
                                                        ? colors.BLUE
                                                        : this.props.Primary_Color
                                                }
                                            />
                                        ) : (
                                            <Image
                                                style={{ height: 40, width: 40 }}
                                                source={{ uri: this.state.licenseImage.uri }}
                                            ></Image>
                                        )}
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                            <View style={{ height: hp(2) }} />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: colors.COM_BACKGROUND,
                                    //  height: hp(9),
                                    paddingVertical: heightPercentageToDP(1.1),
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    width: widthPercentageToDP(90),
                                }}
                            >
                                <FeatherIcons
                                    name="settings"
                                    size={scale.w(2.7)}
                                    color={
                                        this.props.Primary_Color === ''
                                            ? colors.BLUE
                                            : this.props.Primary_Color
                                    }
                                    style={{ paddingRight: wp(2), paddingLeft: wp(4) }}
                                />
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        paddingHorizontal: 10,
                                        justifyContent: 'center',
                                        //  alignSelf: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            // paddingVertical: hp(1),
                                            fontFamily: 'Roboto-Medium',
                                            color: colors.SignInUsingColor,
                                            fontSize: scale.w(1.5),
                                        }}
                                    >
                                        {this.props.selectedLanguage.parked_at}
                                    </Text>
                                    <TextInput
                                        placeholderTextColor={colors.DUMMY_COLOR}
                                        placeholder={this.props.selectedLanguage.description}
                                        onChangeText={(val) => this.setState({ parkedAt: val })}
                                        value={this.state.description}
                                        multiline={true}
                                        editable={false}
                                        style={{
                                            padding: 0,
                                            margin: 0,
                                            width: widthPercentageToDP(70),
                                            //  paddingHorizontal: 10,
                                            //width: '85%',
                                            fontFamily: 'Roboto-Regular',
                                            color: colors.GREY,
                                            // textAlign: 'center',
                                            fontSize: scale.w(1.4),
                                        }}
                                        // style={{ borderBottomColor: '#E4E7F1', borderBottomWidth: 1 }}
                                    />
                                </View>
                            </View>
                            <View style={{ height: hp(2) }} />

                            {/* {this.props.parkingValetData.data.status === 'grab_request' ? (
                                <ButtonPrimary
                                    backgroundColor={
                                        this.props.Primary_Color === ''
                                            ? colors.BLUE
                                            : this.props.Primary_Color
                                    }
                                    // onPress={this.props._handleGrabRequest}
                                    text={this.props.selectedLanguage.grab_request}
                                    // disabled={
                                    //     this.props.parkingValetData.data.status === 'grab_request' ? true : false
                                    // }
                                    // disabled={true}
                                    // loading={this.props.loading}
                                    fontWeight={'bold'}
                                    chainData={this.props.chainData}
                                />
                            ) : ( */}

                            {this.props.parkingValetData.data?.valet_type === 'self_parked' ? (
                                <>
                                    <ButtonPrimary
                                        backgroundColor={
                                            this.props.Primary_Color === ''
                                                ? colors.BLUE
                                                : this.props.Primary_Color
                                        }
                                        onPress={this.props._handleReParkRequest}
                                        text={this.props.selectedLanguage.re_park}
                                        // disabled={
                                        //     this.props.parkingValetData.data.status === 'grab_request' ? true : false
                                        // }
                                        // disabled={true}
                                        loading={this.props.loading}
                                        fontWeight={'bold'}
                                        chainData={this.props.chainData}
                                    />
                                </>
                            ) : null}
                            <View style={{ height: hp(0.5) }} />
                            <ButtonPrimary
                                backgroundColor={
                                    this.props.Primary_Color === '' ? colors.BLUE : this.props.Primary_Color
                                }
                                onPress={this.props._handleGrabRequest}
                                text={this.props.selectedLanguage.grab_request}
                                // disabled={
                                //     this.props.parkingValetData.data.status === 'grab_request' ? true : false
                                // }
                                // disabled={true}
                                loading={this.props.loading}
                                fontWeight={'bold'}
                                chainData={this.props.chainData}
                            />

                            {/* )} */}
                        </View>
                    )}
                </ScrollView>
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

export default ParkingValetComplete;
