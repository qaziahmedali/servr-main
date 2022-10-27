import React from 'react';
import { View } from 'react-native';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../../utils/dimensions';
import { H4 } from '../../_global/Text';
import { TextInputMask, TextInputMaskProps } from 'react-native-masked-text';

interface IFieldFormWithMaskProps extends TextInputMaskProps {
    label: string;
    textOnly?: boolean;
}

export default class FieldFormWithMask extends React.PureComponent<IFieldFormWithMaskProps> {
    render() {
        const { label, ...propsTextInput } = this.props;

        return (
            <View style={{ paddingHorizontal: scale.w(40), marginVertical: scale.w(18) }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <H4 fontSize={scale.w(18)}>{label}</H4>
                    </View>
                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1 }}>
                        {this.props.textOnly ? (
                            <H4 fontSize={scale.w(16)} color="#000">
                                {this.props.value}
                            </H4>
                        ) : (
                            <TextInputMask
                                {...propsTextInput}
                                placeholderTextColor="#888"
                                style={{
                                    fontFamily: 'Roboto-Light',
                                    fontSize: scale.w(18),
                                    color: '#000',
                                    width : widthPercentageToDP(20),
                                    height : heightPercentageToDP(5),
                                    margin: 0,
                                    padding: 0,
                                }}
                            />
                        )}
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: '#000',
                        height: 1,
                        width: '100%',
                        marginTop: scale.w(18),
                    }}
                />
            </View>
        );
    }
}
