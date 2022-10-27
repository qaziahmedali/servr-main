import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Alert,
    ScrollView,
    Platform,
    Image,
} from 'react-native';
import base from '../../utils/baseStyles';
// import { scale } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IRestaurant } from '../../types/restaurant';
import FieldForm from './Components/FieldForm';
import { debounce } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import colors from '../../constants/colors';
import { Calendar as CalendarWidget, DateObject } from 'react-native-calendars';
import { format } from 'date-fns';
import CustomModal from '../_global/CustomModal';
import { IPromotionOrderReduxProps } from './PromotionOrder.Container';
import { Text, View as ViewAnimatable } from 'react-native-animatable';
import ModalDatePicker from './Components/ModalDatePicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { H4 } from '../_global/Text';
import ImageZoom from 'react-native-image-pan-zoom';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import Modal from 'react-native-modal';
import AttentionModal from '../_global/AttentionModal';
import { toast } from '../../utils/handleLogic';
import ProcessCompleteModal from '../_global/processComplete';
import { IFeatureHotel } from '../../types/hotel';

export interface IPromotionOrderProps extends IPromotionOrderReduxProps {
    componentId: string;
    restaurant: IRestaurant;
}

interface IPromotionOrderState {
    booking_date: string;
    booking_end_date: string;
    visible: boolean;
    modalVisible1: boolean;
    loading: boolean;
}

class PromotionOrder extends React.Component<IPromotionOrderProps, IPromotionOrderState> {
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalDatePicker2 = React.createRef<CustomModal>();
    private _modalProcessComplete = React.createRef<CustomModal>();

    constructor(props: IPromotionOrderProps) {
        super(props);

        this.state = {
            booking_date: '',
            booking_end_date: '',
            visible: false,
            modalVisible1: false,
            loading: false,
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
        this.setModalVisible = this.setModalVisible.bind(this);
        this._handleOrderPromotion = this._handleOrderPromotion.bind(this);
        this._isLockFeature = this._isLockFeature.bind(this);
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    setModalVisible(visible: boolean) {
        this.setState({ modalVisible1: visible });
    }

    _handleModalDatePicker(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalDatePicker.current) {
                if (closeModal) {
                    this._modalDatePicker.current.hide();
                } else {
                    this._modalDatePicker.current.show();
                    this.setState({ booking_date: new Date().toString() });
                }
            }
        };
    }

    _handleModalDatePicker2(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalDatePicker2.current) {
                if (closeModal) {
                    this._modalDatePicker2.current.hide();
                } else {
                    this._modalDatePicker2.current.show();
                    this.setState({ booking_end_date: new Date().toString() });
                }
            }
        };
    }

    _onChangeDate(date: Date) {
        console.log('dateeee', date);
        this.setState((prevState) => {
            if (prevState.booking_date) {
                return {
                    ...prevState,
                    booking_date: date.toString(),
                };
            }

            return {
                ...prevState,
                booking_date: date.toString(),
            };
        });
    }

    _onChangeDate2(date: Date) {
        console.log('dateeee', date);
        this.setState((prevState) => {
            if (prevState.booking_end_date) {
                return {
                    ...prevState,
                    booking_end_date: date.toString(),
                };
            }

            return {
                ...prevState,
                booking_end_date: date.toString(),
            };
        });
    }

    _handleOrderPromotion() {
        if (this._isLockFeature()) {
            return;
        }
        this.setState({
            loading: true,
        });
        let payload = {
            table_id: this.props.promotionDetails.PromotionDetails[0].id,
            start_date: this.state.booking_date,
            end_date: this.state.booking_end_date,
        };
        this.props.orderPromotion(
            payload,
            () => {
                this.setState({
                    loading: false,
                });
                this._modalProcessComplete.current?.show();
                // toast('Success, Your booking has placed');

                // Navigation.pop(this.props.componentId);
            },
            () => {
                this.setState({
                    loading: false,
                });
            },
        );
    }

    _isLockFeature(feature?: keyof IFeatureHotel) {
        if (!this.props.isCheckedIn) {
            this.setState({
                text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
                visible: true,
            });
            return true;
        }
        if (this.props.status === 'pending') {
            this.setState({
                text: this.props.selectedLanguage
                    .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
                visible: true,
            });
            return true;
        }
        return false;
    }

    render() {
        console.log('propssssss', this.props);
        const { restaurant, color, promotionDetails, promotionTitle } = this.props;
        const {
            confirm_booking,
            date,
            hours,
            minutes,
            ok,
            month,
            year,
            pick_your_booking_date,
            book_now,
            booking_from,
            booking_until,
        } = this.props.selectedLanguage;
        return (
            <View style={base.container}>
                <View style={{ height: hp(15), backgroundColor: this.props.primary_color }}>
                    <Navbar
                        titleColor={colors.WHITE}
                        onClick={this._handleBack}
                        title={promotionTitle}
                        isProfile
                    />
                </View>
                <View
                    style={{
                        height: hp(90),
                        width: wp(100),
                        position: 'absolute',
                        backgroundColor: colors.WHITE,
                        marginTop: hp(10),
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    }}
                >
                    <ScrollView>
                        <View style={{ height: heightPercentageToDP(5) }} />
                        <TouchableOpacity
                            onPress={debounce(this._handleModalDatePicker(false), 1000, {
                                leading: true,
                                trailing: false,
                            })}
                            // disabled={this.props.isCheckedIn}
                            activeOpacity={0.8}
                        >
                            <FieldForm
                                label={booking_from}
                                value={
                                    this.state.booking_date === ''
                                        ? this.props.selectedLanguage.dd_mm_yy_hh_mm
                                        : format(this.state.booking_date, 'DD/MM/YYYY HH:mm')
                                }
                                isEmpty={this.state.booking_date === ''}
                                textOnly
                            />
                        </TouchableOpacity>
                        <View style={{ height: heightPercentageToDP(2.5) }} />
                        <TouchableOpacity
                            onPress={debounce(this._handleModalDatePicker2(false), 1000, {
                                leading: true,
                                trailing: false,
                            })}
                            // disabled={this.props.isCheckedIn}
                            activeOpacity={0.8}
                        >
                            <FieldForm
                                label={booking_until}
                                value={
                                    this.state.booking_end_date === ''
                                        ? this.props.selectedLanguage.dd_mm_yy_hh_mm
                                        : format(this.state.booking_end_date, 'DD/MM/YYYY HH:mm')
                                }
                                isEmpty={this.state.booking_end_date === ''}
                                textOnly
                            />
                        </TouchableOpacity>
                        <View style={{ height: heightPercentageToDP(10) }} />
                        <Animatable.View
                            useNativeDriver
                            animation="fadeIn"
                            duration={300}
                            style={styles.submit_btn_container}
                        >
                            <ButtonPrimary
                                onPress={() => {
                                    this._handleOrderPromotion();
                                }}
                                text={confirm_booking.replace(':', '')}
                                backgroundColor={color || colors.BROWN}
                                loading={this.state.loading}
                                disabled={this.state.loading}
                                chainData={this.props.chainData}
                            />
                        </Animatable.View>
                    </ScrollView>
                </View>
                <CustomModal ref={this._modalDatePicker} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <ModalDatePicker
                        date={new Date(this.state.booking_date)}
                        minimumDate={new Date()}
                        color={color}
                        onDateChange={this._onChangeDate}
                        showModal={this._handleModalDatePicker(true)}
                        title={pick_your_booking_date}
                        otherText={{ date, month, year, minutes, hours, ok }}
                        chainData={this.props.chainData}
                    />
                </CustomModal>

                <CustomModal
                    style={{ flex: 1, margin: -1 }}
                    ref={this._modalProcessComplete}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDown"
                >
                    <ProcessCompleteModal
                        processTitle={this.props.selectedLanguage.success}
                        processDescription={this.props.selectedLanguage.your_booking_has_placed}
                        btnText={this.props.selectedLanguage.go_back}
                        onButtonPress={this._handleBack}
                        processImage={require('../../images/paymentSuccess.png')}
                        backgroundColor={this.props.primary_color}
                        chainData={this.props.chainData}
                    />
                </CustomModal>

                <CustomModal ref={this._modalDatePicker2} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <ModalDatePicker
                        date={new Date(this.state.booking_end_date)}
                        minimumDate={new Date()}
                        color={color}
                        onDateChange={this._onChangeDate2}
                        showModal={this._handleModalDatePicker2(true)}
                        title={pick_your_booking_date}
                        otherText={{ date, month, year, minutes, hours, ok }}
                        chainData={this.props.chainData}
                    />
                </CustomModal>

                <AttentionModal
                    visible={this.state.visible}
                    toggleModal={this.toggleModal}
                    text={this.state.text}
                    attention={this.props.selectedLanguage.attention}
                    ok={this.props.selectedLanguage.ok}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    calendar_container: {
        paddingHorizontal: widthPercentageToDP(5),
        marginTop: heightPercentageToDP(5),
    },
    submit_btn_container: {
        paddingHorizontal: widthPercentageToDP(5),
        marginTop: heightPercentageToDP(5),
        flex: 1,
        marginBottom: heightPercentageToDP(10),
        zIndex: 1000,
    },

    modalContainer: {
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginHorizontal: 10,
    },
    modal: {
        height: '100%',
        marginLeft: -1,
        paddingVertical: 20,
        marginBottom: -1,
    },
    image: {
        alignContent: 'center',
        width: '100%',
        height: hp('100%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        // position: 'relative',
    },
});

export default PromotionOrder;
