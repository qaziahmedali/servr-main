import React from 'react';
import Modal from 'react-native-modal';
import { StyleProp, ViewStyle, View, Text, TouchableOpacity, Platform } from 'react-native';
import { heightPercentageToDP, scale, widthPercentageToDP } from '../../utils/dimensions';
import { H2, H3, H4 } from '../_global/Text';
import colors from '../../constants/colors';

interface ICustomModalProps {
    visible: boolean;
    toggleModal: () => void;
    text: string;
    attention: string;
    ok: string;
}

class AttentionModal extends React.PureComponent<ICustomModalProps> {
    constructor(props: ICustomModalProps) {
        super(props);
    }

    render() {
        console.log('props', this.props);
        return (
            <Modal
                backdropOpacity={0.7}
                isVisible={this.props.visible}
                onBackdropPress={() => {
                    this.props.toggleModal();
                }}
            >
                <View
                    style={{
                        width: widthPercentageToDP(90),
                        backgroundColor: '#fff',
                        alignSelf: 'center',
                        borderRadius: scale.w(3.0),
                        paddingHorizontal: widthPercentageToDP(7),
                        paddingVertical : heightPercentageToDP(3)
                    }}
                >
                    <View
                        style={{
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: Platform.select({
                                    android: 'Roboto-Bold',
                                    ios: 'Roboto-Bold',
                                }),
                                fontWeight: '100',
                                fontSize: 18,
                                // color: colors.DARK_GREY,
                                color: '#454545',
                            }}
                        >
                            {this.props.attention}
                        </Text>
                        <Text
                            style={{
                                fontFamily: Platform.select({
                                    android: 'Roboto-Regular',
                                    ios: 'Roboto-Regular',
                                }),
                                fontSize: 16,
                                // color: colors.DARK_GREY,
                                color: '#575757',

                                marginTop: heightPercentageToDP(1),
                            }}
                        >
                            {this.props.text}
                        </Text>
                    </View>
                    <View
                        style={{
                            alignItems: 'flex-end',
                            marginTop : heightPercentageToDP(4)
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => {
                                this.props.toggleModal();
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: Platform.select({
                                        android: 'Roboto-Bold',
                                        ios: 'Roboto-Bold',
                                    }),
                                    fontSize: 16,
                                    // color: colors.DARK_BLUE,
                                    color: '#575757',
                                }}
                            >
                                {this.props.ok}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default AttentionModal;
