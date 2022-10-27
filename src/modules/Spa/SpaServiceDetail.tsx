import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableOpacity,
    Text,
    ImageBackground,
    StatusBar,
    ColorPropType,
    ActivityIndicator,
    TextInput,
    Dimensions,
    Modal,
    Alert,
} from 'react-native';
import { Image, View as ViewAnimatable } from 'react-native-animatable';
import FieldFormWithMask from '../LostAndFound/Component/FieldFormWithMask';
import { ISpaServiceDetailReduxProps } from './SpaServiceDetail.Container';
import Navbar from '../_global/Navbar';
import colors from '../../constants/colors';
import { IFeatureHotel } from '../../types/hotel';
import { Navigation } from 'react-native-navigation';
import { mainmenu, ProfileData, restoMain, chat } from '../../utils/navigationControl';
import { heightPercentageToDP as hp, scale, widthPercentageToDP as wp } from '../../utils/dimensions';
import Entypoicons from 'react-native-vector-icons/Entypo';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Proceed from '../_global/proceedPayment';
import CheckBox from '@react-native-community/checkbox';

// import { TextInput } from 'react-native-gesture-handler';
const data = [
    { id: 1, name: require('../../images/promotionimage.png') },
    { id: 2, name: require('../../images/bg-image.png') },
];
export interface ISpaServiceDetailProps extends ISpaServiceDetailReduxProps {
    componentId: string;
}
//const [isSelected, setSelection] = useState(false);
interface ISpaServiceDetailState {
    loading: boolean;
    code: string;
    marginLeft: number;
    modalVisible: boolean;
    email: string;
    password: string;
    type: string;
    visible: boolean;
    text: string;
    selected: boolean;
    expandedImage: any;
}

class SpaServiceDetail extends React.Component<ISpaServiceDetailProps, ISpaServiceDetailState> {
    constructor(props: ISpaServiceDetailProps) {
        super(props);

        this.state = {
            loading: false,
            code: '',
            marginLeft: scale.w(100),
            modalVisible: false,
            email: '',
            password: '',
            type: '',
            visible: false,
            text: '',
            selected: false,
            expandedImage: require('../../images/faceMasked.png'),
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: colors.LIGHT_BLUE,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleUpdateProfile = this._handleUpdateProfile.bind(this);
    }

    _handleBack() {
        if (Platform.OS == 'ios') {
            Navigation.pop(this.props.componentId);
        } else {
            if (this.props.backGround) {
                Navigation.push(this.props.componentId, mainmenu);
            } else {
                Navigation.pop(this.props.componentId);
            }
        }
    }

    _handleUpdateProfile() {
        this.setState({
            loading: true,
        });

        setTimeout(() => {
            this.setState({
                loading: false,
            });
        }, 5000);
    }

    render() {
        const { attention, ok } = this.props.selectedLanguage;
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
                <View style={{ height: hp(55), backgroundColor: colors.BLUE }}>
                    <ImageBackground
                        resizeMode="cover"
                        style={{ height: hp(55), width: wp(100), paddingHorizontal: wp(5) }}
                        source={this.state.expandedImage}
                    >
                        <Navbar
                            tintBackColor={colors.WHITE}
                            titleColor={colors.WHITE}
                            onClick={this._handleBack}
                            //   title={'Card Details'}
                        />
                        <View
                            style={{
                                height: hp(35),
                                width: wp(16),
                                justifyContent: 'flex-end',
                                alignSelf: 'flex-end',
                            }}
                        >
                            {data.map((user) => (
                                <TouchableOpacity
                                    style={{
                                        // borderColor: colors.WHITE,
                                        // borderWidth: 2,
                                        // borderRadius: 10,
                                        marginTop: 5,
                                        justifyContent: 'center',
                                    }}
                                    onPress={() => this.setState({ expandedImage: user.name })}
                                >
                                    <Image
                                        style={{
                                            height: hp(6.5),
                                            width: wp(13),
                                            borderColor: colors.WHITE,
                                            borderWidth: 2,
                                            borderRadius: 10,
                                            //  width: 60,
                                            alignSelf: 'center',

                                            // marginVertical: 2,

                                            // marginHorizontal: 5,
                                        }}
                                        // resizeMode="contain"
                                        source={user.name}
                                    />
                                </TouchableOpacity>
                                //  </View>
                            ))}
                        </View>
                    </ImageBackground>
                </View>

                <View
                    style={{
                        height: hp(45),
                        position: 'absolute',
                        backgroundColor: colors.WHITE,
                        marginTop: hp(45),
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    }}
                >
                    <View style={{ height: hp(1) }}></View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View
                            style={{
                                paddingVertical: hp(1.5),
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: wp(100),
                                paddingHorizontal: wp(5),
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Bold',
                                    color: colors.HEX,
                                    // textAlign: 'center',
                                    fontSize: scale.w(20),
                                }}
                            >
                                Aroma Massage
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderWidth: 2,
                                    borderRadius: scale.w(8),
                                    borderColor: '#8D91A2',
                                    paddingHorizontal: scale.w(5),
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingVertical: hp(0.2),
                                }}
                            >
                                <TouchableOpacity activeOpacity={0.7}>
                                    <Ionicons name="md-remove" color={colors.GREY} size={scale.w(18)} />
                                </TouchableOpacity>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: 5,
                                    }}
                                >
                                    <Text>1</Text>
                                </View>
                                <TouchableOpacity
                                    // onPress={() => this._addTotalService(item, true)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="md-add" color={colors.GREY} size={scale.w(18)} />
                                </TouchableOpacity>
                            </View>

                            {/* </View> */}
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: wp(5),
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: '#C1C8E4',
                                    paddingVertical: 5,
                                    paddingHorizontal: 15,
                                    borderRadius: 30,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        color: colors.WHITE,
                                        // textAlign: 'center',
                                        fontSize: scale.w(12),
                                    }}
                                >
                                    Relax
                                </Text>
                            </View>
                            <View />
                        </View>
                        <View
                            style={{
                                paddingVertical: hp(0.5),
                                paddingHorizontal: wp(5),
                                marginTop: hp(1),
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Bold',
                                    color: colors.HEX,
                                    // textAlign: 'center',
                                    fontSize: scale.w(20),
                                }}
                            >
                                Description
                            </Text>

                            <Text
                                style={{
                                    marginTop: hp(1),
                                    fontFamily: 'Roboto-Regular',
                                    color: colors.HEX,
                                    fontSize: scale.w(14),
                                    lineHeight: 24,
                                    //  letterSpacing: 57.14,
                                }}
                            >
                                Pellentesque interdum sed libero sit amet risus pulvinar. Vestibulum ut mauris
                                congue, laoreet magna quis, feugiat quam. Pellentesque et ena finibus
                                mauris.Pellentesque et ena finibus {'\n'} mauris.
                            </Text>
                        </View>
                        <View style={{ height: hp(1) }}></View>
                    </ScrollView>
                </View>
                <View
                    style={{
                        // backgroundColor: colors.BLUE,
                        // height: hp(12),
                        // width: wp(100),
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        // borderTopLeftRadius: 40,
                        // borderTopRightRadius: 40,
                        position: 'absolute',
                        width: wp(100),
                        marginTop: hp(82),
                    }}
                >
                    <Proceed btnText="Checkout" onPress={() => console.log('  Helllo')} price={'$16.50'} />
                </View>
            </KeyboardAvoidingView>
        );
    }
}
export default SpaServiceDetail;
{
    /* <View
style={{
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: scale.w(8),
    borderColor: color || colors.BROWN,
    paddingHorizontal: scale.w(5),
    alignItems: 'center',
    justifyContent: 'space-between',
    // width : wp(15),
    // flex: 1,
    paddingVertical: hp(0.2),
}}
>
<TouchableOpacity 
    disabled={selected && selected.qty == 0 ? true : false}
    onPress={() => this._substractTotalService(item, true)}
    activeOpacity={0.7}
>
    <Ionicons
        name="md-remove"
        color={colors.GREY}
        size={scale.w(18)}
    />
</TouchableOpacity>
<View
    style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal : 5
    }}
>
    <H4 fontSize={scale.w(14)} >{selected ? selected.qty : 0}</H4>
</View>
<TouchableOpacity
    onPress={() => this._addTotalService(item, true)}
    activeOpacity={0.7}
>
    <Ionicons
        name="md-add"
        color={colors.GREY}
        size={scale.w(18)}
    />
</TouchableOpacity>
</View> */
}
