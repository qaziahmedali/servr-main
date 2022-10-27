import React from 'react';
import Modal from 'react-native-modal';
import { screenHeight, screenWidth } from '../../utils/dimensions';
import { Animation, CustomAnimation } from 'react-native-animatable';
import { StyleProp, ViewStyle } from 'react-native';

interface ICustomModalProps {
    children: React.ReactNode;
    animationIn?: Animation | CustomAnimation;
    animationOut?: Animation | CustomAnimation;
    style?: StyleProp<ViewStyle>;
    backdropOpacity?: number;
    splash: boolean
}

interface ICustomModalState {
    visible: boolean;
}

class CustomModal extends React.PureComponent<ICustomModalProps, ICustomModalState> {
    constructor(props: ICustomModalProps) {
        super(props);

        this.state = {
            visible: false,
        };

        this.getValue = this.getValue.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this._onBackDropPress = this._onBackDropPress.bind(this);
    }

    getValue() {
        this.state.visible;
    }

    show() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    _onBackDropPress() {
        if (this.props.splash) {
            console.log("helllo in splash here")
        }
        else {
            if (this.state.visible) {
                this.setState({ visible: false });
            }
        }
    }

    render() {
        return (
            <Modal
                isVisible={this.state.visible}
                deviceWidth={screenWidth}
                deviceHeight={screenHeight}
                supportedOrientations={['portrait']}
                animationIn={this.props.animationIn ? this.props.animationIn : 'fadeInUp'}
                animationOut={this.props.animationOut ? this.props.animationOut : 'fadeOutDown'}
                style={this.props.style}
                backdropOpacity={this.props.backdropOpacity}
                onBackButtonPress={this._onBackDropPress}
                onBackdropPress={this._onBackDropPress}
                useNativeDriver
                hideModalContentWhileAnimating
            >
                {this.props.children}
            </Modal>
        );
    }
}

export default CustomModal;
