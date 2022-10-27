import { Platform, Dimensions } from 'react-native';

export const extraPad = {
    iphoneX: {
        top: 44,
        bottom: 34,
    },
    iphone: {
        top: 20,
        bottom: 0,
    },
    android: {
        top: 0,
        bottom: 0,
    },
};

export const phoneType = () => {
    if (Platform.OS === 'ios') {
        const { height } = Dimensions.get('window');
        // iPhone X
        if (height === 812 || height === 896) {
            return 'iphoneX';
        }
        // iPhone
        return 'iphone';
    }
    // Android phone
    return 'android';
};

export const getTop = () => {
    return extraPad[phoneType()].top;
};

export const getBottom = () => {
    return extraPad[phoneType()].bottom;
};
