import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { scale } from '../../../utils/dimensions';
import { H4 } from '../../_global/Text';

interface IFieldFormProps extends TextInputProps {
    label: string;
    isEmpty?: boolean;
    textOnly?: boolean;
}

export default class FieldForm extends React.PureComponent<IFieldFormProps> {
    render() {
        const { label, isEmpty, ...propsTextInput } = this.props;

        return (
            <View style={{ paddingHorizontal: scale.w(4.0), marginVertical: scale.w(1.8) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, paddingRight: scale.w(0.8) }}>
                        <H4 fontSize={scale.w(1.8)}>{label}</H4>
                    </View>
                    <View style={{ flex: 1 }}>
                        {this.props.textOnly ? (
                            <H4 fontSize={scale.w(1.6)} color={isEmpty ? '#888' : '#000'}>
                                {this.props.value}
                            </H4>
                        ) : (
                            <TextInput
                                {...propsTextInput}
                                placeholderTextColor="#888"
                                style={{
                                    fontFamily: 'Roboto-Light',
                                    fontSize: scale.w(1.8),
                                    color: '#000',
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
                        marginTop: scale.w(1.8),
                    }}
                />
            </View>
        );
    }
}
