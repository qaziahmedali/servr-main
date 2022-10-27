import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    RefreshControl,
    Alert,
    Keyboard,
    Image,
    Text,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    StatusBar,
} from 'react-native';
import { format } from 'date-fns';
import {
    scale,
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
    widthPercentageToDP,
    heightPercentageToDP,
} from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IProceedRequestItemsReduxProps } from './proceedRequestItems.Container';
import colors from '../../constants/colors';
import DIcon from 'react-native-vector-icons/MaterialIcons';
import { ButtonPrimary } from '../_global/Button';
import CustomModal from '../_global/CustomModal';
import ProcessComplete from '../_global/processComplete';
import ModalDatePicker from './Components/ModalDatePicker';
import { debounce } from 'lodash';
import moment from 'moment';
import Calendar from '../../images/calendar.svg';
import { toast } from '../../utils/handleLogic';
import DropShadow from 'react-native-drop-shadow';
import { RootContainer } from '../_global/Container';

interface IProceedRequestItemsProps extends IProceedRequestItemsReduxProps {
    componentId: string;
}

interface IProceedRequestItemsState {
    loadingGet: boolean;
    serviceItems: Array;
    concierge_services: Array;
    selected: number;
    qty: number;
    service_id: number;
    loading: boolean;
    booking_from: any;
    booking_to: string;
    startSelected: boolean;
    note: string;
}

class ProceedRequestItems extends React.Component<IProceedRequestItemsProps, IProceedRequestItemsState> {
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalDatePicker2 = React.createRef<CustomModal>();
    private _modalConfirm = React.createRef<CustomModal>();

    constructor(props: IProceedRequestItemsProps) {
        super(props);
        this.state = {
            loadingGet: false,
            serviceItems: [
                {
                    id: 0,
                    image: require('../../images/conceirge-sample.jpg'),
                    name: 'Bedsheet Cleaning',
                },
                {
                    id: 0,
                    image: require('../../images/conceirge-sample.jpg'),
                    name: 'Floor Cleaning',
                },
                {
                    id: 0,
                    image: require('../../images/conceirge-sample.jpg'),
                    name: 'Trash Cleaning',
                },
                {
                    id: 0,
                    image: require('../../images/conceirge-sample.jpg'),
                    name: 'Bedsheet Changing',
                },
            ],
            concierge_services: [],
            service_id: 0,
            qty: 0,
            selected: 0,
            loading: false,
            booking_from: '',
            booking_to: '',
            note: '',
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleModalDatePicker = this._handleModalDatePicker.bind(this);
        this._handleModalDatePicker2 = this._handleModalDatePicker2.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._onChangeDate2 = this._onChangeDate2.bind(this);
        this._handleBookTable = this._handleBookTable.bind(this);
        // console.log(props.restaurant);
    }

    async _handleBookTable() {
        let tempArray = [...this.state.concierge_services];
        await this.props.restaurant?.map((i) => {
            if (i?.order) {
                tempArray.push({
                    service_id: i?.id,
                    qty: 1,
                });
            }
        });
        this.setState({
            concierge_services: tempArray,
        });
        // if (this.state.concierge_services.length == 0) {
        //     toast(this.props.selectedLanguage.please_select_at_least_one_item);
        //     return 0;
        // }
        if (this.state.booking_from == '' || this.state.booking_to == '') {
            toast(this.props.selectedLanguage.please_select_date_and_time_first);
            return 0;
        }
        this.setState({
            loading: true,
        });
        // const tempObject = {
        //     current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        //     concierge_services: this.state.concierge_services,
        //     booking_date:
        //         format(this.state.booking_from, 'YYYY-MM-DD') +
        //         ' ' +
        //         format(this.state.booking_to, 'HH:mm:ss'),
        //     note: this.state.note,
        // };
        // console.log('temp', tempObject);

        this.props.createRequest(
            {
                current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                concierge_services: this.state.concierge_services,
                booking_date:
                    format(this.state.booking_from, 'YYYY-MM-DD') +
                    ' ' +
                    format(this.state.booking_to, 'HH:mm:ss'),
                note: this.state.note,
            },

            () => {
                this._modalConfirm.current?.show();
                this.setState({ loading: false });
            },
            () => {
                this.setState({ loading: false });
            },
        );
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handleModalDatePicker(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalDatePicker.current) {
                if (closeModal) {
                    this._modalDatePicker.current?.hide();
                } else {
                    this._modalDatePicker.current?.show();
                    this.setState({ booking_from: new Date().toString() });
                }
            }
        };
    }

    _handleModalDatePicker2(closeModal?: boolean) {
        console.log('close modalll', closeModal);
        return () => {
            if (this.state.booking_from != '') {
                Keyboard.dismiss();
                if (this._modalDatePicker2.current) {
                    if (closeModal) {
                        this._modalDatePicker2.current.hide();
                    } else {
                        this._modalDatePicker2.current.show();
                        this.setState({ booking_to: new Date().toString() });
                    }
                }
            } else {
                toast(this.props.selectedLanguage.please_select_date_and_time_first);
            }
        };
    }

    _onChangeDate(date: Date) {
        console.log('dateeee', date);
        this.setState({
            booking_from: date.toString(),
            startSelected: true,
        });
    }

    _onChangeDate2(date: Date) {
        console.log('dateeee', date);
        this.setState((prevState) => {
            if (prevState.booking_to) {
                return {
                    ...prevState,
                    booking_to: date.toString(),
                };
            }

            return {
                ...prevState,
                booking_to: date.toString(),
            };
        });
    }

    _handleProceed() {
        this.setState({
            loading: true,
        });

        setTimeout(() => {
            this.setState({
                loading: false,
            });
        }, 3000);
    }

    render() {
        const { color } = this.props;
        const {
            number_of_people,
            time_of_booking,
            confirm_booking,
            select_table,
            select_table_no,
            date,
            hours,
            minutes,
            ok,
            month,
            year,
            pick_your_booking_date,
            pick_your_time_booking,
            booking_from,
            booking_until,
        } = this.props.selectedLanguage;
        var table_array = [];
        console.log(this.props);
        // Array(Number(restaurant.res_table_numbers))
        //     .fill('')
        //     .map((item, index) => {
        //         table_array.push({ label: (index + 1).toString(), value: (index + 1).toString() });
        //     });

        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: hp(20), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: this.props.color,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && <StatusBar backgroundColor={this.props.color}></StatusBar>}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>
                        <RootContainer>
                            <View
                                style={{
                                    height: heightPercentageToDP(14),
                                    backgroundColor: this.props.color,
                                }}
                            >
                                {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}

                                <Navbar
                                    tintBackColor={colors.WHITE}
                                    titleColor={colors.WHITE}
                                    onClick={this._handleBack}
                                    title={this.props.selectedLanguage.request_items}
                                />
                                {/* </ImageBackground> */}
                            </View>
                            <View
                                style={{
                                    height: hp(90),
                                    width: widthPercentageToDP(100),
                                    backgroundColor: colors.WHITE,
                                    top: -heightPercentageToDP(4.3),
                                    borderTopLeftRadius: scale.w(3.5),
                                    borderTopRightRadius: scale.w(3.5),
                                    paddingTop: hp(0.75),
                                }}
                            >
                                <DropShadow
                                    style={{
                                        width: wp(100),
                                        shadowOffset: {
                                            width: 0,
                                            height: 5,
                                        },
                                        shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            paddingVertical: hp(4),
                                            paddingHorizontal: wp(4),
                                            borderRadius: scale.w(1.5),
                                            marginTop: hp(5),
                                            backgroundColor: colors.WHITE,
                                            width: wp(90),
                                            alignSelf: 'center',
                                            borderWidth: scale.w(0.1),
                                            borderColor: '#EBF0F9',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.6),
                                                fontFamily: 'Roboto-Medium',
                                                color: colors.DUMMY_COLOR,
                                            }}
                                        >
                                            {' '}
                                            {this.props.selectedLanguage.booking_time_date}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={debounce(this._handleModalDatePicker(false), 1000, {
                                                leading: true,
                                                trailing: false,
                                            })}
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,

                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justiifyContent: 'space-between',
                                                //  width: wp(82),
                                                marginTop: hp(2),
                                                paddingHorizontal: wp(4),
                                                borderRadius: 15,
                                                height: heightPercentageToDP(6),
                                            }}
                                        >
                                            <View style={{ width: wp(66), color: colors.DUMMY_COLOR }}>
                                                <Text
                                                    style={{
                                                        color: colors.DUMMY_COLOR,
                                                        fontFamily: 'Roboto-Regular',
                                                    }}
                                                >
                                                    {this.state.booking_from === ''
                                                        ? this.props.selectedLanguage.date
                                                        : this.props.selectedLanguage.date +
                                                          ': ' +
                                                          format(this.state.booking_from, 'DD/MM/YYYY')}
                                                </Text>
                                            </View>
                                            <Calendar style={{ paddingHorizontal: widthPercentageToDP(4) }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={debounce(this._handleModalDatePicker2(false), 100, {
                                                leading: true,
                                                trailing: false,
                                            })}
                                            style={{
                                                backgroundColor: colors.COM_BACKGROUND,

                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justiifyContent: 'space-between',
                                                //  width: wp(82),
                                                marginTop: hp(2),
                                                paddingHorizontal: wp(4),
                                                borderRadius: 15,
                                                height: heightPercentageToDP(6),
                                            }}
                                        >
                                            <View style={{ width: wp(66), color: colors.DUMMY_COLOR }}>
                                                <Text
                                                    style={{
                                                        color: colors.DUMMY_COLOR,
                                                        fontFamily: 'Roboto-Regular',
                                                    }}
                                                >
                                                    {this.state.booking_to === ''
                                                        ? this.props.selectedLanguage.time
                                                        : this.props.selectedLanguage.time +
                                                          ': ' +
                                                          format(this.state.booking_to, 'HH:mm')}
                                                </Text>
                                            </View>
                                            <Calendar style={{ paddingHorizontal: widthPercentageToDP(4) }} />
                                        </TouchableOpacity>
                                    </View>
                                </DropShadow>
                                <DropShadow
                                    style={{
                                        width: wp(100),
                                        shadowOffset: {
                                            width: 0,
                                            height: 5,
                                        },
                                        shadowColor: colors.CHECKIN_SCREEN_SHADOW_COLOR,
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            paddingVertical: hp(2),
                                            paddingHorizontal: wp(4),

                                            borderRadius: scale.w(1.5),
                                            marginTop: hp(3),
                                            backgroundColor: colors.WHITE,
                                            width: wp(90),
                                            alignSelf: 'center',
                                            borderWidth: scale.w(0.1),
                                            borderColor: '#EBF0F9',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: scale.w(1.6),
                                                fontFamily: 'Roboto-Medium',
                                                color: colors.DUMMY_COLOR,
                                            }}
                                        >
                                            {' '}
                                            {this.props.selectedLanguage.note}
                                        </Text>
                                        <View style={{ height: heightPercentageToDP(1) }}></View>

                                        <TextInput
                                            placeholder={this.props.selectedLanguage.anything_to_add}
                                            value={this.state.note}
                                            multiline={true}
                                            onChangeText={(note) => this.setState({ note: note })}
                                            autoCapitalize="none"
                                            style={{
                                                fontSize: scale.w(1.6),
                                                color: colors.LOST_FOUND_ICON_COLOR,
                                                width: wp(80),
                                                height: heightPercentageToDP(10),
                                            }}
                                        ></TextInput>
                                    </View>
                                </DropShadow>
                                <View style={{ height: hp(12) }} />

                                <View style={{ width: wp(90), alignSelf: 'center' }}>
                                    <ButtonPrimary
                                        backgroundColor={this.props.icon.concierge_color}
                                        loading={this.state.loading}
                                        onPress={this._handleBookTable}
                                        text={confirm_booking}
                                        fontWeight={'bold'}
                                        chainData={this.props.chainData}
                                    />
                                </View>

                                <View style={{ height: hp(10) }} />

                                <CustomModal
                                    ref={this._modalConfirm}
                                    style={{
                                        height: hp(100),
                                        width: wp(100),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: -1,
                                    }}
                                >
                                    <ProcessComplete
                                        backgroundColor={this.props.icon.concierge_color}
                                        processImage={require('../../images/paymentPageImg.png')}
                                        processTitle={this.props.selectedLanguage.request_successfull}
                                        processDescription={'Request concierge services success'}
                                        onButtonPress={() => {
                                            this._modalConfirm.current?.hide();
                                            Navigation.popTo('conciergeService');
                                        }}
                                        btnText={this.props.selectedLanguage.go_to_home}
                                        chainData={this.props.chainData}
                                    />
                                </CustomModal>

                                <CustomModal
                                    ref={this._modalDatePicker}
                                    animationIn="fadeInUp"
                                    animationOut="fadeOutDown"
                                >
                                    <ModalDatePicker
                                        date={new Date(this.state.booking_from)}
                                        minimumDate={new Date()}
                                        color={this.props.icon.concierge_color}
                                        onDateChange={this._onChangeDate}
                                        showModal={this._handleModalDatePicker(true)}
                                        title={pick_your_booking_date}
                                        otherText={{ date, month, year, minutes, hours, ok }}
                                        chainData={this.props.chainData}
                                    />
                                </CustomModal>

                                <CustomModal
                                    ref={this._modalDatePicker2}
                                    animationIn="fadeInUp"
                                    animationOut="fadeOutDown"
                                >
                                    <ModalDatePicker
                                        date={new Date(this.state.booking_to)}
                                        startSelected={true}
                                        minimumDate={new Date(this.state.booking_to)}
                                        color={this.props.icon.concierge_color}
                                        onDateChange={this._onChangeDate2}
                                        showModal={this._handleModalDatePicker2(true)}
                                        title={pick_your_time_booking}
                                        otherText={{ date, month, year, minutes, hours, ok }}
                                        chainData={this.props.chainData}
                                    />
                                </CustomModal>
                            </View>
                        </RootContainer>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

export default ProceedRequestItems;
