import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import colors from '../../constants/colors';
import { scale } from '../../utils/dimensions';

interface ICheckSquareProps {
    isChecked: boolean;
    borderRadius?: number;
    disabled?: boolean;
    size?: number;
    tintColor:any;
}

const CheckSquare = (props: ICheckSquareProps) => {
    return (
        <View style={{ borderRadius: props.borderRadius ? props.borderRadius : 0 }}>
            {props.isChecked ? (
                <Animatable.Image
                    // animation="bounceIn"
                    // duration={500}
                    source={
                        props.disabled
                            ? require('../../images/icon-check-square-disabled.png')
                            : require('../../images/icon-check-square.png')
                    }
                    style={{
                        resizeMode: 'contain',
                        width: props.size ? props.size : scale.w(2.6),
                        height: props.size ? props.size : scale.w(2.6),
                        borderRadius: props.borderRadius ? props.borderRadius : 0,
                        tintColor:props.tintColor?props.tintColor:null,
                    }}
                />
            ) : (
                <View
                    style={{
                        width: props.size ? props.size : scale.w(2.6),
                        height: props.size ? props.size : scale.w(2.6),
                        borderRadius: props.borderRadius ? props.borderRadius : 0,
                        borderWidth: 1,
                        borderColor: '#aaa',
                    }}
                />
            )}
        </View>
    );
};

export default CheckSquare;
