import { Dimensions, PixelRatio, Platform, NativeModules, StatusBar } from "react-native";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import { getStatusBarHeight } from "react-native-status-bar-height";
// import { getStatusBarHeight } from 'react-native-status-bar-height';
// import DetectNavbar from 'react-native-detect-navbar-android';

const { StatusBarManager } = NativeModules;
// import DetectNavbar from 'react-native-detect-navbar-android';

const widthPercentageToDP = widthPercent => {
  const dim = Dimensions.get("window");

  if (dim.height >= dim.width)
    this.screenWidth = Dimensions.get("window").width;
  else this.screenWidth = Dimensions.get("window").height;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((this.screenWidth * elemWidth) / 100);
};

const heightPercentageToDP = heightPercent => {
  const dim = Dimensions.get("window");
  if (dim.height >= dim.width) {
    if (Platform.OS == 'android')
      // if(ExtraDimensions.getStatusBarHeight() > 26)
      // this.screenHeight = Dimensions.get('window').height 
      // else      
      this.screenHeight = Dimensions.get('screen').height - ExtraDimensions.getStatusBarHeight() - ExtraDimensions.getSoftMenuBarHeight()
    else
      this.screenHeight = Dimensions.get("screen").height;

  } else this.screenHeight = Dimensions.get("window").width;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((this.screenHeight * elemHeight) / 100);
};
const IOSStatusBar = () => { return 0 }
export { widthPercentageToDP, heightPercentageToDP, IOSStatusBar };
