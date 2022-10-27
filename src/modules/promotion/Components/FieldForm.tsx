import React from 'react';
import { View, TextInput, TextInputProps, Platform } from 'react-native';
import colors from '../../../constants/colors';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../../utils/dimensions';
import { H4 } from '../../_global/Text';
import DropShadow from 'react-native-drop-shadow';

interface IFieldFormProps extends TextInputProps {
    label: string;
    isEmpty?: boolean;
    textOnly?: boolean;
}

export default class FieldForm extends React.PureComponent<IFieldFormProps> {
    render() {
        const { label, isEmpty, ...propsTextInput } = this.props;

        return (
            <View style={{flex : 1 , paddingHorizontal: widthPercentageToDP(5) }}>
                    <View style={{ flex: 1}}>
                        <H4 fontSize={scale.w(1.8)} fontFamily={'Roboto-Medium'} >{label}</H4>
                    </View>
                    <DropShadow
      style={{
        width: widthPercentageToDP(100),        
        shadowOffset: {
          width: 5,
          height: 10,
        },
        shadowColor : colors.CHECKIN_SCREEN_SHADOW_COLOR,
        shadowOpacity: 0.25,
        shadowRadius: 10,
      }}
    >
                    <View
                        style={{
                            height: heightPercentageToDP(8),
                            width: widthPercentageToDP(90),
                            marginTop: heightPercentageToDP(2.5),
                            justifyContent: 'center',
                            borderRadius: scale.w(1.5),
                            paddingLeft: widthPercentageToDP(5),
                            backgroundColor: '#fff'
                        }}
                    >
                        {this.props.textOnly ? (
                            <H4 fontSize={scale.w(1.6)} fontFamily={'Roboto-Light'}color={isEmpty ? '#888' : '#000'}>
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
                                    padding: 0,
                                }}
                            />
                        )}
                    </View>
                    </DropShadow>
            </View>
        );
    }
}
