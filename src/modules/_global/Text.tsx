import React from 'react';
import { TextStyle, Text, TextProps, Platform } from 'react-native';
import colors from '../../constants/colors';

interface IDefaultTextProps extends TextStyle, TextProps {
    children: React.ReactNode;
}

export const Default = ({ children, numberOfLines, ...props }: IDefaultTextProps) => (
    <Text
        style={{
            fontSize: props.fontSize,
            color: props.color,
            textAlign: props.textAlign,
            backgroundColor: 'transparent',
            ...props,
        }}
        numberOfLines={numberOfLines}
    >
        {children}
    </Text>
);

Default.defaultProps = {
    fontSize: 16,
    textAlign: 'left',
};

export const ButtonLabel = ({ children, ...props }: IDefaultTextProps) => (
    <Default fontFamily="Roboto-Regular" color={colors.DARK_BLUE} fontSize={18} {...props}>
        {children}
    </Default>
);

export const H1 = ({ children, ...props }: IDefaultTextProps) => (
    <Default
        fontFamily={Platform.select({
            android: 'Harabara-Mais-Demo',
            ios: 'HarabaraMaisBold-HarabaraMaisBold',
        })}
        color={colors.BLUE}
        fontSize={42}
        {...props}
    >
        {children}
    </Default>
);

export const H2 = (props: IDefaultTextProps) => (
    <Default fontFamily="Roboto-Bold" fontSize={16} color={colors.DARK_BLUE} {...props}>
        {props.children}
    </Default>
);

export const H3 = (props: IDefaultTextProps) => (
    <Default fontFamily="Roboto-Regular" fontSize={14} color={colors.DARK_BLUE} {...props}>
        {props.children}
    </Default>
);

export const H3_medium = (props: IDefaultTextProps) => (
    <Default fontFamily="Roboto-Medium" fontWeight="bold" fontSize={20} color={'#82879D'} {...props}>
        {props.children}
    </Default>
);

export const H4 = ({
    children,
    italic,
    white,
    bold,
    ...props
}: IDefaultTextProps & { italic?: boolean; white?: boolean; bold?: boolean }) => (
    <Default
        fontFamily={italic ? 'Roboto-Italic' : bold ? 'Roboto-Bold' : 'Roboto-Light'}
        fontSize={14}
        color={white ? colors.WHITE : colors.BLACK}
        {...props}
    >
        {children}
    </Default>
);
