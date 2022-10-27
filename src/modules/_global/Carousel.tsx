import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    ActivityIndicator,
    Platform,
    TouchableOpacityProps,
    TextStyle,
    Image,
    Alert,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    scale,
    screenWidth,
    heightPercentageToDP as hp,
} from '../../utils/dimensions';
import colors from '../../constants/colors';
import { ButtonLabel, H4 } from './Text';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { debounce } from 'lodash';
import { Text } from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'pinar';
import BookATableContainer from '../Restaurant/BookATable.Container';

interface ISnapCarouselProps {
    onPress: () => void;
    disabled?: boolean;
    text: string;
    text1: string;
    source: any;
    source1: any;
    source2: any;
    icon: any;
    color: string;
    styleImage?: ImageStyle;
    backgrondColor1: string;
    backgrondColor2: string;
    source1Color: string;
    source2Color: string;
    width?: number;
    height?: number;
    iconSize?: number;
    fontSize?: number;
    showImageBackground?: boolean;
    borderRadius?: number;
    white?: boolean;
    bold?: boolean;
    marginVertical?: number;
    paddingVertical?: number;
    elevation?: boolean;
    images: Array;
}

class SnapCarousel extends React.PureComponent<ISnapCarouselProps> {

    _renderItem = (({ item, index }) => {
        return <View
            key={index}
            style={{ height: hp(30), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
        >
            <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
                <Image
                    resizeMode="contain"
                    source={{ uri: item.path }}
                    style={{
                        width: wp(90),
                        height: hp(30),
                    }}
                    borderRadius={scale.w(3)}
                />
            </TouchableOpacity>
        </View>
    })
    render() {
        return (
            <Carousel
                showsControls={false}
                showsDots={false}
                // autoplayInterval={2000}
                bounces={true}
                autoplayInterval={5000}
                autoplay
                loop
            >
                {
                    this.props.images.map((data, index) => {
                        return <View
                            key={index}
                            style={{ height: hp(30), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
                        >
                            <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
                                <Image
                                    resizeMode="contain"
                                    source={{ uri: data.path }}
                                    style={{
                                        width: wp(90),
                                        height: hp(30),
                                    }}
                                    borderRadius={scale.w(3)}
                                />
                            </TouchableOpacity>
                        </View>
                    })
                }
            </Carousel>
        );
    }
}

export default SnapCarousel;
