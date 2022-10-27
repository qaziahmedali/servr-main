import React from 'react';
import { Dimensions, PixelRatio, Platform } from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import { isIphoneX } from './isIPhoneX';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
const fullHeight = ExtraDimensions.get('REAL_WINDOW_HEIGHT') - ExtraDimensions.get('STATUS_BAR_HEIGHT');

const pixelDensity = PixelRatio.get();
const adjustedWidth = screenWidth * pixelDensity;
const adjustedHeight = screenHeight * pixelDensity;

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string} widthPercent The percentage of screen's width that UI element should cover
 *                  along with the percentage symbol (%).
 * @return {number} The calculated dp depending on current device's screen width.
 */

const widthPercentageToDP = (widthPercent: string | number): number => {
    const dim = Dimensions.get('window');

    if (dim.height >= dim.width) this.screenWidth = Dimensions.get('window').width;
    else this.screenWidth = Dimensions.get('window').height;
    // Convert string input to decimal number
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((this.screenWidth * elemWidth) / 100);
};

const heightPercentageToDP = (heightPercent: string | number): number => {
    const dim = Dimensions.get('window');
    if (dim.height >= dim.width) {
        if (Platform.OS == 'android')
            // if(ExtraDimensions.getStatusBarHeight() > 26)
            // this.screenHeight = Dimensions.get('window').height
            // else
            this.screenHeight =
                Dimensions.get('screen').height -
                ExtraDimensions.getStatusBarHeight() -
                ExtraDimensions.getSoftMenuBarHeight();
        else this.screenHeight = Dimensions.get('screen').height;
    } else this.screenHeight = Dimensions.get('window').width;
    // Convert string input to decimal number
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((this.screenHeight * elemHeight) / 100);
};

/**
 * Event listener function that detects orientation change (every time it occurs) and triggers
 * screen rerendering. It does that, by changing the state of the screen where the function is
 * called. State changing occurs for a new state variable with the name 'orientation' that will
 * always hold the current value of the orientation after the 1st orientation change.
 * Invoke it inside the screen's constructor or in componentDidMount lifecycle method.
 * @param {object} that Screen's class component this variable. The function needs it to
 *                      invoke setState method and trigger screen rerender (this.setState()).
 */
const listenOrientationChange = (comp: React.Component<any, any>): void => {
    Dimensions.addEventListener('change', (newDimensions) => {
        if (isTablet()) {
            // Retrieve and save new dimensions
            screenWidth = newDimensions.window.width;
            screenHeight = newDimensions.window.height;

            // Trigger screen's rerender with a state update of the orientation variable
            comp.setState({
                orientation: screenWidth < screenHeight ? 'portrait' : 'landscape',
            });
        }
    });
};

/**
 * Wrapper function that removes orientation change listener and should be invoked in
 * componentWillUnmount lifecycle method of every class component (UI screen) that
 * listenOrientationChange function has been invoked. This should be done in order to
 * avoid adding new listeners every time the same component is re-mounted.
 */
const removeOrientationListener = (): void => {
    Dimensions.removeEventListener('change', () => {});
};

const isTablet = (): boolean => {
    if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
        return true;
    } else if (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
        return true;
    }

    return false;
};

const scale = {
    // w: (num: number) => widthPercentageToDP((num / screenWidth) * 100),
    // h: (num: number) => heightPercentageToDP((num / screenHeight) * 100),
    h: (size: number) =>
        Math.sqrt(
            heightPercentageToDP('100%') * heightPercentageToDP('100%') +
                widthPercentageToDP('100%') * widthPercentageToDP('100%'),
        ) *
        (size / 100),
    w: (size: number = 375) =>
        Math.sqrt(
            heightPercentageToDP('100%') * heightPercentageToDP('100%') +
                widthPercentageToDP('100%') * widthPercentageToDP('100%'),
        ) *
        (size / 100),
    isIphoneX,
};

export {
    widthPercentageToDP,
    heightPercentageToDP,
    listenOrientationChange,
    removeOrientationListener,
    isTablet,
    scale,
    screenWidth,
    screenHeight,
    fullHeight,
};
