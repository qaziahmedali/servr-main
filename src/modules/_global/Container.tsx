import React from 'react';
import { SafeAreaView, View, ViewStyle } from 'react-native';
import { heightPercentageToDP as hp } from '../../utils/dimensions';
import colors from '../../constants/colors';

const RootContainer = (props: { children: React.ReactNode }) => (
    <SafeAreaView style={{ flex: 1 }}>{props.children}</SafeAreaView>
);

const AbsoluteFullContainer = (props: { children: React.ReactNode }) => (
    <View
        style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
        }}
    >
        {props.children}
    </View>
);

const Separator = (props: { height?: number }) => <View style={{ height: props.height || hp(1.5) }} />;

const Line = (props: ViewStyle) => (
    <View
        style={{
            height: props.height || 1,
            backgroundColor: props.backgroundColor || colors.LIGHT_BLUE,
        }}
    />
);

export { RootContainer, AbsoluteFullContainer, Separator, Line };
