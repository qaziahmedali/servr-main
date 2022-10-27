import React from 'react';
import {
    TouchableOpacity,
    Platform,
    Image,
    ImageStyle,
    ImageBackground,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';
import colors from '../../constants/colors';
import { H4 } from './Text';
import { heightPercentageToDP as hp, scale, widthPercentageToDP as wp } from '../../utils/dimensions';
import { View as ViewAnimatable } from 'react-native-animatable';
import { debounce } from 'lodash';
// import  from 'react-native-gesture-handler/lib/typescript/GestureHandlerRootView';
import Icon from 'react-native-vector-icons/Feather';
import CIcon from 'react-native-vector-icons/Ionicons';
import AIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
// import {  } from 'react-native-svg';
import DropShadow from 'react-native-drop-shadow';

interface IPaymentProceedProps {
    onPress: () => void;
    price: string;
    btnText: string;
    backGroundColor: string;
    total: string;
}

interface IPaymentProceedState {
    active: string;
}

class PaymentProceed extends React.PureComponent<IPaymentProceedProps> {
    constructor(props: IPaymentProceedState) {
        super(props);
        this.state = {
            active: 'home',
        };
    }
    render() {
        const { onPress } = this.props;
        return (
            <View
                style={{
                    height: hp(10),
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: wp(6),
                    backgroundColor: this.props.backGroundColor,
                    alignItems: 'center',
                    borderTopLeftRadius: scale.w(4),
                    borderTopRightRadius: scale.w(4),
                }}
            >
                <Text style={{ fontSize: scale.w(1.9), color: colors.WHITE, fontFamily: 'Roboto-Regular' }}>
                    {this.props.total + ':'}{' '}
                    <Text style={{ fontSize: scale.w(1.9), color: colors.WHITE, fontFamily: 'Roboto-Bold' }}>
                        {this.props.price}

                        {/* {Number(parseFloat(this.props.price)).toFixed(2)} */}
                    </Text>
                </Text>
                <DropShadow
                    style={{
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowColor: '#000',
                        shadowOpacity: 0.16,
                        shadowRadius: 6,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.props.onPress}
                        style={{
                            borderRadius: scale.w(10),
                            backgroundColor: colors.WHITE,
                            paddingHorizontal: wp(7),
                            paddingVertical: hp(1),
                        }}
                    >
                        {this.props.loader ? (
                            <ActivityIndicator
                                size={20}
                                color={this.props.loaderColor ? this.props.loaderColor : colors.BLUE}
                            />
                        ) : (
                            <Text
                                style={{
                                    color: this.props.backGroundColor,
                                    fontSize: scale.w(1.75),
                                    fontFamily: 'Roboto-Medium',
                                }}
                            >
                                {this.props.btnText}
                            </Text>
                        )}
                    </TouchableOpacity>
                </DropShadow>
            </View>
        );
    }
}

export default PaymentProceed;
