import { StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { scale } from './dimensions';

const base = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    center_mid: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navbar: {
        height: scale.h(56),
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default base;
