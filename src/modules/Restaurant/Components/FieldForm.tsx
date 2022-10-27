import React from 'react';
import { View, TextInput, TextInputProps, Platform } from 'react-native';
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
            <View style={{ paddingHorizontal: scale.w(20) }}>
                <View style={{}}>
                    <View style={{ flex: 1, paddingRight: scale.w(8) }}>
                        <H4 fontSize={scale.w(18)}>{label}</H4>
                    </View>
                    <View
                        style={{
                            height: scale.h(55),
                            width: scale.w(321),
                            marginTop: scale.h(5),
                            justifyContent: 'center',
                            borderRadius: scale.w(25),
                            paddingLeft: scale.w(30),
                            backgroundColor: '#fff',
                            ...Platform.select({
                                ios: {
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 6,
                                },
                                android: {
                                    elevation: 6,
                                },
                            }),
                        }}
                    >
                        {this.props.textOnly ? (
                            <H4 fontSize={scale.w(16)} color={isEmpty ? '#888' : '#000'}>
                                {this.props.value}
                            </H4>
                        ) : (
                            <TextInput
                                {...propsTextInput}
                                placeholderTextColor="#888"
                                style={{
                                    fontFamily: 'Roboto-Light',
                                    fontSize: scale.w(18),
                                    color: '#000',
                                    padding: 0,
                                }}
                            />
                        )}
                    </View>
                </View>
                {/* <View
                    style={{
                        backgroundColor: '#000',
                        height: 1,
                        width: '100%',
                        marginTop: scale.w(18),
                    }}
                /> */}
            </View>
        );
    }
}
