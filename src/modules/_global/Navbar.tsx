import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { H1 } from './Text';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../utils/dimensions';
import colors from '../../constants/colors';
import { extraPad, phoneType } from '../../utils/extraPad';
import { View as ViewAnimatable } from 'react-native-animatable';
import { debounce } from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BackArrow from '../../images/backArrow.svg'
import Search from '../../images/Search.svg'

interface INavbarProps {
    onClick: () => void;
    rightButton?: boolean;
    onClickRight?: () => void;
    labelRight?: string;
    title?: string;
    isBrown?: boolean;
    isViolet?: boolean;
    color?: string;
    tintBackColor: string;
    titleColor: string;
    backBackground: string;
    onSearchClick: () => void;
    RightIconName: string;
    RightIconColor: string;
    navStyle: any;
    isProfile: boolean;
    disableBackButton: any
}

class Navbar extends React.PureComponent<INavbarProps> {
    render() {
        let color = this.props.color ? this.props.color : colors.LIGHT_BLUE;

        if (this.props.isBrown) {
            color = colors.BROWN;
        }

        // if (this.props.isViolet) {
        //     color = this.props.color;
        // }

        return (
            <View style={[styles.navbar, this.props.navStyle]}>
                {
                    this.props.disableBackButton ?
                        <View style={{ width: widthPercentageToDP(6) }} />
                        :
                        <TouchableOpacity
                            onPress={debounce(this.props.onClick, 1000, {
                                leading: true,
                                trailing: false,
                            })}
                            activeOpacity={0.8}
                            style={{ width: widthPercentageToDP(6), paddingVertical: 15 }}
                        >
                            <ViewAnimatable
                                useNativeDriver
                                animation="fadeInLeft"
                                duration={300}
                            // style={StyleSheet.flatten([
                            //     styles.btn_back_container,
                            //     {
                            //         backgroundColor: this.props.backBackground,
                            //     },
                            // ])}
                            >
                                {this.props.fromMycard ? (
                                    <Icon color="red" size={20} name={'times'} />
                                ) : (
                                    this.props.tintBackColor == 'black' ?
                                        <Image
                                            source={require('../../images/icon_back.png')}
                                            style={{
                                                width: widthPercentageToDP(4),
                                                height: widthPercentageToDP(4),
                                                tintColor: this.props.tintBackColor,
                                            }}
                                            resizeMode="contain"
                                        />
                                        :
                                        <BackArrow
                                            width={widthPercentageToDP(4)}
                                            height={widthPercentageToDP(4)}
                                        />

                                )}
                            </ViewAnimatable>
                        </TouchableOpacity>
                }
                {this.props.title ? (
                    <ViewAnimatable
                        useNativeDriver
                        animation="fadeInLeft"
                        duration={300}
                        delay={50}
                    // style={styles.title_container}
                    >
                        {/* <H1 color={this.props.titleColor} textAlign="center" fontSize={scale.w(20)}>
                            {this.props.title}
                        </H1> */}
                        <Text
                            style={{
                                fontSize: scale.w(2.2),

                                color: this.props.titleColor,
                                fontFamily: 'Roboto-Bold',
                            }}
                        >
                            {this.props.title}
                        </Text>


                    </ViewAnimatable>

                ) : null}
                {this.props.search ?
                    <TouchableOpacity onPress={this.props.onSearchClick} activeOpacity={0.8}
                        style={{
                            paddingVertical: 10,
                            paddingLeft: 5,
                            justifuContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <ViewAnimatable
                            useNativeDriver
                            animation="fadeInLeft"
                            duration={300}
                        >
                            {
                                this.props.isProfile ? <Icon color={this.props.RightIconColor} size={scale.w(1.5)} name={this.props.RightIconName} />
                                    : <Search
                                        width={widthPercentageToDP(6)}
                                        height={widthPercentageToDP(6)}
                                    />
                            }
                        </ViewAnimatable>
                    </TouchableOpacity>
                    :
                    <View
                        style={{ width: widthPercentageToDP(6) }}
                    />}
                {/* <View style={{
                          
                          width:widthPercentageToDP(5),
                          height:heightPercentageToDP(5),
                       //  backgroundColor:colors.RED
                        }}
                        /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navbar: {
        height: heightPercentageToDP(10),
        //  paddingTop: heightPercentageToDP(4),
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: widthPercentageToDP(5),
    },
    btn_back_container: {
        justifyContent: 'center'
    },
    btn_back_absolute: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    title_container: {
        alignItems: 'center',
        top: -heightPercentageToDP(1)
    },
});

export default Navbar;
