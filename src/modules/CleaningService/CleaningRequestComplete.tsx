import React from 'react';
import { View, StyleSheet } from 'react-native';
import base from '../../utils/baseStyles';
import { scale } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { H4 } from '../_global/Text';
import { Image } from 'react-native-animatable';
import { ICleaningRequestCompleteReduxProps } from './CleaningRequestComplete.Container';

export interface ICleaningRequestCompleteProps extends ICleaningRequestCompleteReduxProps {
    componentId: string;
    isRoomCleaning?: boolean;
}

interface ICleaningRequestCompleteState {}

class CleaningRequestComplete extends React.Component<
    ICleaningRequestCompleteProps,
    ICleaningRequestCompleteState
> {
    constructor(props: ICleaningRequestCompleteProps) {
        super(props);

        this.state = {};

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
    }

    _handleBack() {
        Navigation.popToRoot(this.props.componentId);
    }

    render() {
        const {
            room_cleaning,
            laundry_service,
            your_room_service_request_has_been_accepted,
            your_laundry_service_request_has_been_sent,
        } = this.props.selectedLanguage;
        return (
            <View style={base.container}>
                <Navbar
                    color={this.props.color}
                    onClick={this._handleBack}
                    title={this.props.isRoomCleaning ? room_cleaning : laundry_service}
                />

                <View style={styles.container}>
                    <Image
                        animation="fadeInUp"
                        duration={300}
                        source={
                            this.props.isRoomCleaning
                                ? require('../../images/icon_vacuum.png')
                                : require('../../images/icon_laundry.png')
                        }
                        style={[styles.image, { tintColor: this.props.color }]}
                        resizeMode="contain"
                    />

                    <View style={styles.text_container}>
                        <H4 fontSize={scale.w(21)} textAlign="center">
                            {this.props.isRoomCleaning
                                ? your_room_service_request_has_been_accepted
                                : your_laundry_service_request_has_been_sent}
                        </H4>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_container: {
        paddingHorizontal: scale.w(20),
        marginTop: scale.w(32),
        marginBottom: scale.w(70),
    },
    image: {
        height: scale.w(200),
        width: scale.w(150),
    },
});

export default CleaningRequestComplete;
