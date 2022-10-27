import React from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    Platform,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import base from '../../utils/baseStyles';
import { heightPercentageToDP, scale, screenWidth, widthPercentageToDP } from '../../utils/dimensions';
import { H3, H1, H3_medium, H2 } from '../_global/Text';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IConciergeTrackingProgressOrderRoomService } from '../../types/conciergeService';
import { IWakeupCallReduxProps } from './wakeupCall.Container';
import colors from '../../constants/colors';
import { upperFirst, startCase } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import { chat } from '../../utils/navigationControl';
import { BoxShadow } from 'react-native-shadow';
import Icon from 'react-native-vector-icons/Feather';
import { View as ViewAnimatable } from 'react-native-animatable';
import { DatePicker } from '@davidgovea/react-native-wheel-datepicker';
import moment, { months } from 'moment';
import { wakeupCallComplete } from '../../utils/navigationControl';
import { ScrollView } from 'react-native-gesture-handler';

interface IWakeupCallProps extends IWakeupCallReduxProps {
    componentId: string;
}

interface IWakeupCallState {
    loading: boolean;
    wakeup_call_time: Date;
    wakeup_call_note: String;
}

class WakeupCall extends React.Component<IWakeupCallProps, IWakeupCallState> {
    constructor(props: IWakeupCallProps) {
        super(props);

        this.state = {
            loading: false,
            wakeup_call_time: new Date(),
            wakeup_call_note: '',
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.icon.concierge_color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleSelectTime = this._handleSelectTime.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._onChangeNote = this._onChangeNote.bind(this);
    }

    componentDidMount() {}

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handleSelectTime() {
        let new_time = moment(this.state.wakeup_call_time).format('HH:mm');
        // this.props.wakeupCall(new_time);
        this.props._WakeUpTime(new_time, this.state.wakeup_call_note);
        Navigation.pop(this.props.componentId);
        // this.props.wakeupCall(
        //     new_time,
        //     () => {
        //         this.setState({
        //             loading: false,
        //         });
        //         Navigation.push(this.props.componentId, wakeupCallComplete);
        //     },
        //     () => {
        //         this.setState({
        //             loading: false,
        //         });
        //     },
        // );
    }

    _onChangeDate(date: Date) {
        this.setState({
            wakeup_call_time: date,
        });
    }
    _onChangeNote(note: String) {
        console.log('data change', note);
        this.setState({
            wakeup_call_note: note,
        });
    }

    render() {
        const {
            current_orders,
            previous_orders,
            live_chat,
            Select_the_time_you_would_like_to_be_woken_up_by,
            date,
            month,
            year,
            hours,
            minutes,
            ok,
            wakeup_call,
        } = this.props.selectedLanguage;
        const { color } = this.props;
        const { wakeup_call_time, wakeup_call_note } = this.state;
        return (
            <ScrollView>
                <View style={base.container}>
                    <View
                        style={{
                            height: heightPercentageToDP(15),
                            backgroundColor: this.props.icon.concierge_color,
                        }}
                    >
                        <Navbar
                            tintBackColor={colors.WHITE}
                            titleColor={colors.WHITE}
                            RightIconName={'search'}
                            RightIconColor={colors.WHITE}
                            onClick={this._handleBack}
                            title={wakeup_call}
                        />
                        {/* </ImageBackground> */}
                    </View>
                    <View
                        style={{
                            backgroundColor: colors.WHITE,
                            marginTop: -heightPercentageToDP(4),
                            borderTopLeftRadius: scale.w(5),
                            borderTopRightRadius: scale.w(5),
                        }}
                    >
                        <ViewAnimatable
                            useNativeDriver
                            animation="fadeInLeft"
                            duration={300}
                            delay={50}
                            style={{
                                alignSelf: 'center',
                                marginTop: heightPercentageToDP(5),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <H3 textAlign={'center'} alignSelf={'center'} fontFamily={'Roboto-Regular'}>
                                {Select_the_time_you_would_like_to_be_woken_up_by}
                            </H3>
                        </ViewAnimatable>

                        <ViewAnimatable
                            useNativeDriver
                            animation="fadeInLeft"
                            duration={300}
                            delay={50}
                            style={{
                                marginTop: heightPercentageToDP(4),
                                alignItems: 'center',
                                marginBottom: heightPercentageToDP(3),
                                paddingHorizontal: widthPercentageToDP(3),
                            }}
                        >
                            <View style={styles.container}>
                                {Platform.OS === 'android' && (
                                    <View style={styles.headerPickerAndroid}>
                                        {/* <View
                                    style={{
                                        width: scale.w(50),
                                        alignItems: 'center',
                                    }}
                                >
                                    <H3 color="#666" fontSize={scale.w(14)}>
                                        {date}
                                    </H3>
                                </View>
                                <View
                                    style={{
                                        width: scale.w(50),
                                        alignItems: 'center',
                                    }}
                                >
                                    <H3 color="#666" fontSize={scale.w(14)}>
                                        {month}
                                    </H3>
                                </View>
                                <View
                                    style={{
                                        width: scale.w(50),
                                        alignItems: 'center',
                                    }}
                                >
                                    <H3 color="#666" fontSize={scale.w(14)}>
                                        {year}
                                    </H3>
                                </View> */}
                                        <View
                                            style={{
                                                width: widthPercentageToDP(10),
                                                alignItems: 'center',
                                            }}
                                        >
                                            <H3
                                                color="#666"
                                                fontFamily={'Roboto-Medium'}
                                                fontSize={scale.w(1.6)}
                                            >
                                                {hours}
                                            </H3>
                                        </View>

                                        <View
                                            style={{
                                                width: widthPercentageToDP(30),
                                                alignItems: 'center',
                                            }}
                                        >
                                            <H3
                                                color="#666"
                                                fontFamily={'Roboto-Medium'}
                                                fontSize={scale.w(1.6)}
                                            >
                                                {minutes}
                                            </H3>
                                        </View>
                                    </View>
                                )}
                                <DatePicker
                                    itemSpace={60}
                                    mode="time"
                                    // use12Hours={true}
                                    date={wakeup_call_time}
                                    style={[
                                        styles.datePicker,
                                        {
                                            width:
                                                Platform.OS === 'ios'
                                                    ? widthPercentageToDP(60)
                                                    : widthPercentageToDP(10),
                                        },
                                    ]}
                                    onDateChange={this._onChangeDate}
                                    // minimumDate={new Date()}
                                    textSize={scale.w(2.0)}
                                />
                            </View>
                        </ViewAnimatable>
                        <View
                            style={{
                                paddingHorizontal: scale.w(5),
                                paddingVertical: scale.h(4),
                            }}
                        >
                            <TextInput
                                multiline
                                value={wakeup_call_note}
                                onChangeText={this._onChangeNote}
                                placeholder="Write note for wakeup call..."
                                maxLength={250}
                                style={{
                                    backgroundColor: colors.LIGHT_GREY,
                                    borderRadius: scale.w(1.2),
                                    fontFamily: 'Roboto-Regular',
                                    fontSize: 15,
                                    // color: colors.DARK,
                                    height: scale.w(10),
                                    textAlignVertical: 'top',
                                    margin: 0,
                                    padding: 8,
                                }}
                                autoFocus
                            />
                        </View>
                        <Animatable.View
                            useNativeDriver
                            animation="fadeIn"
                            duration={300}
                            delay={50}
                            style={styles.btn_chat_container}
                        >
                            <ButtonPrimary
                                onPress={this._handleSelectTime}
                                text={ok}
                                backgroundColor={this.props.icon.concierge_color}
                                loading={this.state.loading}
                                disabled={this.state.loading}
                                fontSize={scale.w(1.65)}
                                chainData={this.props.chainData}
                                //  fontWeight={true}
                            />
                        </Animatable.View>
                    </View>
                    <SafeAreaView />
                    {/* </View> */}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    item_container: {
        marginHorizontal: widthPercentageToDP(7),
        width: widthPercentageToDP(30),
        borderRadius: scale.w(20),
        backgroundColor: '#fff',
        alignSelf: 'center',
    },
    secondary_container: {
        borderRadius: 50,
        paddingTop: scale.h(1.0),
        paddingBottom: scale.h(3.0),
        paddingHorizontal: scale.w(2.4),
    },
    menu_container: {
        flexDirection: 'row',
        marginBottom: scale.w(1.8),
    },
    btn_chat_container: {
        paddingHorizontal: widthPercentageToDP(12),
        paddingVertical: heightPercentageToDP(3),
    },

    container: {
        backgroundColor: 'white',
        paddingHorizontal: scale.w(3.0),
        paddingVertical: scale.h(2.4),
        borderRadius: scale.w(1.0),
        // borderWidth:scale.h(1),
        // borderColor:colors.LIGHT_BLUE
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? scale.w(1.2) : scale.w(2.0),
    },
    headerPickerAndroid: {
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-around',

        marginTop: heightPercentageToDP(2),
        marginBottom: heightPercentageToDP(3),
    },
    datePicker: {
        backgroundColor: 'transparent',
    },
    buttonContainer: {
        marginTop: Platform.OS === 'ios' ? scale.w(1.2) : 0,
    },
});

const shadowOpt = {
    width: screenWidth,
    height: scale.w(5.0),
    color: '#000',
    border: 6,
    radius: 1,
    opacity: 0.2,
    x: 0,
    y: 6,
    style: { marginBottom: scale.w(0.9), marginTop: scale.w(2.5) },
};

export default WakeupCall;
