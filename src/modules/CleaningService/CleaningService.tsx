import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import base from '../../utils/baseStyles';
import { scale } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { cleaningRequestComplete, laundryService } from '../../utils/navigationControl';
import MenuButton from '../_global/MenuButton';
import { H4 } from '../_global/Text';
import { ICleaningServiceReduxProps } from './CleaningService.Container';

export interface ICleaningServiceProps extends ICleaningServiceReduxProps {
    componentId: string;
}

interface ICleaningServiceState {
    loading: boolean;
}

class CleaningService extends React.Component<ICleaningServiceProps, ICleaningServiceState> {
    constructor(props: ICleaningServiceProps) {
        super(props);

        this.state = {
            loading: false,
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._handleBack = this._handleBack.bind(this);
        this._handleRoomCleaning = this._handleRoomCleaning.bind(this);
        this._handleLaundryService = this._handleLaundryService.bind(this);
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handleRoomCleaning() {
        this.setState({ loading: true });
        this.props.roomCleaningService(
            async () => {
                await Navigation.push(
                    this.props.componentId,
                    cleaningRequestComplete({ isRoomCleaning: true }),
                );
                this.setState({ loading: false });
            },
            () => {
                this.setState({ loading: false });
            },
        );
    }

    _handleLaundryService() {
        Navigation.push(this.props.componentId, laundryService);
    }

    render() {
        return (
            <View style={base.container}>
                <Navbar color={this.props.color} onClick={this._handleBack} title="Cleaning Service" />

                <ScrollView>
                    <View style={styles.text_container}>
                        <H4 fontSize={scale.w(21)} textAlign="center">
                            {'Request a cleaning service\nfor your room'}
                        </H4>
                    </View>
                    <View style={styles.menu_btn_container}>
                        <MenuButton
                            onPress={this._handleRoomCleaning}
                            source={require('../../images/icon_vacuum.png')}
                            text="Request room cleaning"
                            width={scale.w(265)}
                            height={scale.w(150)}
                            iconSize={scale.w(70)}
                            fontSize={scale.w(20)}
                            disabled={this.state.loading}
                            styleImage={{ tintColor: this.props.color }}
                        />
                    </View>

                    <View style={styles.menu_btn_container}>
                        <MenuButton
                            onPress={this._handleLaundryService}
                            source={require('../../images/icon_laundry.png')}
                            text={this.props.selectedLanguage.request_laundry_service}
                            width={scale.w(265)}
                            height={scale.w(150)}
                            iconSize={scale.w(70)}
                            fontSize={scale.w(20)}
                            styleImage={{ tintColor: this.props.color }}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text_container: {
        paddingHorizontal: scale.w(20),
        marginTop: scale.w(14),
        marginBottom: scale.w(70),
    },
    menu_btn_container: {
        paddingHorizontal: scale.w(55),
        marginBottom: scale.w(20),
        alignItems: 'center',
    },
});

export default CleaningService;
