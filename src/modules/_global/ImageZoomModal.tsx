// import React from 'react';
// import { TouchableOpacity, Platform, Image, ImageStyle, ImageBackground,View, Text,
//     StyleSheet
// } from 'react-native';
// import colors from '../../constants/colors';
// import { H4 } from './Text';
// import { scale, widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from '../../utils/dimensions';
// import { View as ViewAnimatable } from 'react-native-animatable';
// import {ButtonPrimary} from './Button'
// import Modal from 'react-native-modal'
// import { ScrollView } from 'react-native-gesture-handler';
// import NavBar from './Navbar'
// import ImageZoom from 'react-native-image-pan-zoom';
// import BackArrow from '../../images/backArrow.svg'
// interface IImageZoomModalProps {
//     modalVisible : boolean;
//     Image : any;
//     onBack : () => void;
//     onBackDrop : () => void;
//     onBackArrow : () => void;
//     isExpandModalExists:boolean;//in spa room order service & resturant room order service expand image modal has been used

// }

// interface IImageZoomModalState {
//     loadingGet: boolean;
// }

// class ImageZoomModal extends React.PureComponent<IImageZoomModalProps, IImageZoomModalState> {
//     constructor(props : IImageZoomModalProps) {
//         super(props)
//     }
//     render() {
//         return (

//                 <Modal
//             style={{
//                 flex:1,
//                 height:heightPercentageToDP(100),
//                 width:'100%',
//             }}
//             onBackButtonPress={this.props.onBackDrop}
//                 backdropOpacity={0.9}
//                 animationType="fadeIn"
//                         transparent={true}
//                         visible={this.props.modalVisible}

//                         >
//                             <View
//                             style={{flex:1,
//                                 height:heightPercentageToDP(100),
//                                 width:'100%',

//                                 marginTop:-heightPercentageToDP(8.7),
//                                 marginBottom:-heightPercentageToDP(3.0),
//                                 marginLeft:-widthPercentageToDP(5),
//                                 backgroundColor: 'rgba(0,0,0,0.7)',
//                         justifyContent:"center"

//                         }}
//                             >

//                       {/* <TouchableOpacity
//                                 onPress={this.props.onBackArrow}
//                                 style={{
//                                     marginTop:heightPercentageToDP(15.9),
//                                     marginHorizontal:widthPercentageToDP(5.8),

//                                 }}
//                             >
//                                 <BackArrow

//                             />
//                             </TouchableOpacity> */}
//                              <TouchableOpacity
//                                 onPress={this.props.onBackArrow}
//                                 style={{
//                                     marginTop:this.props.isExpandModalExists?heightPercentageToDP(18):heightPercentageToDP(15.9),
//                                     marginHorizontal:this.props.isExpandModalExists?widthPercentageToDP(5.7):widthPercentageToDP(5.8),

//                                 }}
//                             >
//                                 <BackArrow

//                             />
//                             </TouchableOpacity>
//                             <ImageZoom
//                                         cropWidth={widthPercentageToDP(100)}
//                                         cropHeight={heightPercentageToDP(100)}
//                                         imageWidth={widthPercentageToDP(100)}
//                                         imageHeight={heightPercentageToDP(100)}
//                                     >
//                                         <Image
//                                             resizeMode="contain"
//                                             source={this.props.Image}
//                                             style={styles.image}
//                                       />

//                                     </ImageZoom>
//             </View>

//         </Modal>

//         );
//     }
// }
// const styles = StyleSheet.create({
//     image: {
//         alignContent: 'center',
//         width: '100%',
//         height: heightPercentageToDP(100),
//         justifyContent:"center",
//         resizeMode: 'contain',
//         alignSelf: 'center',
//         // position: 'relative',
//     },
// });
// export default ImageZoomModal;

import React from 'react';
import {
    TouchableOpacity,
    Platform,
    Image,
    ImageStyle,
    ImageBackground,
    View,
    Text,
    StyleSheet,
} from 'react-native';
import colors from '../../constants/colors';
import { H4 } from './Text';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP,
    heightPercentageToDP,
} from '../../utils/dimensions';
import { View as ViewAnimatable } from 'react-native-animatable';
import { ButtonPrimary } from './Button';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
import NavBar from './Navbar';
import ImageZoom from 'react-native-image-pan-zoom';
import BackArrow from '../../images/backArrow.svg';
interface IImageZoomModalProps {
    modalVisible: boolean;
    Image: any;
    onBack: () => void;
    onBackDrop: () => void;
    onBackArrow: () => void;
    isExpandModalExists: boolean; //in spa room order service & resturant room order service expand image modal has been used
}

interface IImageZoomModalState {
    loadingGet: boolean;
}

class ImageZoomModal extends React.PureComponent<IImageZoomModalProps, IImageZoomModalState> {
    constructor(props: IImageZoomModalProps) {
        super(props);
        console.log('props', props);
    }

    render() {
        return (
            <Modal
                style={{
                    height: heightPercentageToDP(100),
                    width: widthPercentageToDP(100),
                    margin: -1,
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                }}
                onBackButtonPress={this.props.onBackDrop}
                onBackdropPress={this.props.onBackDrop}
                // backdropOpacity={0.9}
                animationType="fadeIn"
                transparent={true}
                visible={this.props.modalVisible}
            >
                {/* <TouchableOpacity
                                onPress={this.props.onBackArrow}
                                style={{
                                    marginTop:heightPercentageToDP(15.9),
                                    marginHorizontal:widthPercentageToDP(5.8),
                                  
                                }}
                            >
                                <BackArrow
                          
                            />
                            </TouchableOpacity> */}
                <TouchableOpacity
                    onPress={this.props.onBackArrow}
                    style={{
                        marginTop: this.props.isExpandModalExists
                            ? heightPercentageToDP(5.5)
                            : heightPercentageToDP(3.9),
                        marginHorizontal: this.props.isExpandModalExists
                            ? widthPercentageToDP(5.7)
                            : widthPercentageToDP(5.8),
                    }}
                >
                    <BackArrow />
                </TouchableOpacity>
                <ImageZoom
                    cropWidth={widthPercentageToDP(100)}
                    cropHeight={heightPercentageToDP(50)}
                    imageWidth={widthPercentageToDP(100)}
                    imageHeight={heightPercentageToDP(100)}
                    panToMove={false}
                    onDoubleClick={() => console.log('Event called')}
                >
                    <Image resizeMode="contain" source={this.props.Image} style={styles.image} />
                </ImageZoom>
                <View />
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    image: {
        alignContent: 'center',
        width: '100%',
        height: heightPercentageToDP(100),
        justifyContent: 'center',
        resizeMode: 'contain',
        alignSelf: 'center',
        // position: 'relative',
    },
});
export default ImageZoomModal;
