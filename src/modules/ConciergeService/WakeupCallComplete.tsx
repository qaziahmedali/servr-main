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
    Image,
} from 'react-native';
import base from '../../utils/baseStyles';
import { scale, screenWidth, widthPercentageToDP } from '../../utils/dimensions';
import { H3, H1, H3_medium, H2, H4 } from '../_global/Text';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { IConciergeTrackingProgressOrderRoomService } from '../../types/conciergeService';
import { IWakeupCallCompleteReduxProps } from './WakeupCallComplete.Container';
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

interface IWakeupCallCompleteProps extends IWakeupCallCompleteReduxProps {
    componentId: string;
}

interface IWakeupCallCompleteState {}

class WakeupCallComplete extends React.Component<IWakeupCallCompleteProps, IWakeupCallCompleteState> {
    constructor(props: IWakeupCallCompleteProps) {
        super(props);

        this.state = {};

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
    }

    componentDidMount() {}

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    render() {
        const {} = this.props.selectedLanguage;
        const { color } = this.props;
        return (
            <View style={base.container}>
                <Navbar
                    color={this.props.color}
                    onClick={this._handleBack}
                    // title={this.props.isRoomCleaning ? room_cleaning : laundry_service}
                />

                <View style={styles.container}>
                    <Image
                        animation="fadeInUp"
                        duration={300}
                        source={require('../../images/wakeupCall.png')}
                        style={[styles.image, { tintColor: this.props.color }]}
                        resizeMode="contain"
                    />

                    <View style={styles.text_container}>
                        <H4 fontSize={scale.w(21)} textAlign="center">
                            {this.props.selectedLanguage.wakeup_call_requested}
                        </H4>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_container: {
        paddingHorizontal: scale.w(20),
        marginTop: scale.w(32),
        marginBottom: scale.w(70),
    },
    image: {
        height: scale.w(200),
        width: scale.w(150),
    },
});

export default WakeupCallComplete;
