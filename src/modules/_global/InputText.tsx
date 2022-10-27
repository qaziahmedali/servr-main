import React from 'react';
import { TextInputProps, ViewStyle, TextInput } from 'react-native';
import { widthPercentageToDP as wp } from '../../utils/dimensions';
import colors from '../../constants/colors';

interface IInputTextProps extends ViewStyle, TextInputProps {}

interface IInputTextState {
    borderColor: string;
}

export default class InputText extends React.PureComponent<IInputTextProps, IInputTextState> {
    constructor(props: IInputTextProps) {
        super(props);

        this.state = {
            borderColor: colors.GREY,
        };
    }

    render() {
        return (
            <TextInput
                style={{
                    height: this.props.height || wp(14),
                    backgroundColor: this.props.backgroundColor || colors.WHITE,
                    borderRadius: 4,
                    paddingHorizontal: 16,
                    paddingVertical: this.props.multiline ? 8 : -5,
                    fontFamily: 'Roboto-Regular',
                    fontSize: 15,
                    color: colors.DARK,
                    marginTop: wp(1),
                    borderWidth: 1,
                    borderColor: this.state.borderColor,
                }}
                onFocus={() => {
                    this.setState({ borderColor: colors.BLUE });
                }}
                onBlur={() => {
                    this.setState({ borderColor: colors.GREY });
                }}
                placeholderTextColor={colors.GREY}
                {...this.props}
            />
        );
    }
}
