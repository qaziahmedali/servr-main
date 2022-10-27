import React from 'react';
import { TouchableOpacity, Platform, Image, ImageStyle, ImageBackground,View, Text } from 'react-native';
import colors from '../../constants/colors';
import { H4 } from './Text';
import { scale, widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import { View as ViewAnimatable } from 'react-native-animatable';
import {ButtonPrimary} from '../_global/Button'
import Modal from 'react-native-modal'
import { ScrollView } from 'react-native-gesture-handler';
import NavBar from './Navbar'
import ImageZoom from 'react-native-image-pan-zoom';
interface IImageModalProps {
    modalVisible : boolean;
    Image : any;
    onBack : () => void;
    onBackDrop : () => voidServiceModalState
}

interface IImageModalState {
    loadingGet: boolean;
}

class ImageModal extends React.PureComponent<IImageModalProps, IImageModalState> {
    constructor(props : IImageModalProps) {
        super(props)
    }
    render() {
        return (
            <Modal
            visible={this.props.modalVisible}
            style={{
                flex : 1,
                backgroundColor: 'rgba(0,0,0,0.7)',
                margin : -1,
                justifyContent : 'space-between',
               
            }}
            // transparent={true}
            onBackButtonPress={this.props.onBackDrop}
            animationType="fadeIn"
        >
            <NavBar 
            onClick={this.props.onBack} navStyle={{marginTop : hp(1.5)}} />
                     <ImageZoom
                                        cropWidth={widthPercentageToDP(100)}
                                        cropHeight={heightPercentageToDP(45)}
                                        imageWidth={widthPercentageToDP(100)}
                                        imageHeight={heightPercentageToDP(45)}
                                    >
                   
                    <Image
                            source={this.props.Image}
                            style={{
                                width: wp(100),
                                height: hp(45),
                            }}
                            resizeMode={'cover'}
                        />
                   
                       
                        </ImageZoom>
                        <View/>
        </Modal>
        );
    }
}

export default ImageModal;
