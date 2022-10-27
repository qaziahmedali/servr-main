import React from 'react';
import { View, StyleSheet, Platform, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { H3, H2 } from './Text';
import { scale } from '../../utils/dimensions';
import colors from '../../constants/colors';
import { chat } from '../../utils/navigationControl';

export interface IInAppNotificationProps {
    componentId: string;
    title: string;
    body: string;
}

class InAppNotification extends React.PureComponent<IInAppNotificationProps> {
    private notif: any = React.createRef<Animatable.View>();
    private autoCloseInterval: null | NodeJS.Timeout = null;
    private alreadyTriggered: boolean = false;

    constructor(props: IInAppNotificationProps) {
        super(props);

        this._onClick = this._onClick.bind(this);
        this._handleClose = this._handleClose.bind(this);
    }

    componentDidMount() {
        this.autoCloseInterval = setInterval(this._handleClose, 5000);
    }

    async _onClick() {
        if (this.autoCloseInterval) {
            clearInterval(this.autoCloseInterval);
        }

        await Navigation.push('mainmenu', chat());

        this._handleClose();
    }

    _handleClose() {
        if (!this.alreadyTriggered) {
            if (this.autoCloseInterval) {
                clearInterval(this.autoCloseInterval);
            }

            if (this.notif.current) {
                this.notif.current.slideOutUp(1000);
            }

            this.alreadyTriggered = true;

            setTimeout(() => Navigation.dismissOverlay(this.props.componentId), 1000);
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this._handleClose} style={styles.container}>
                <View style={styles.container}>
                    <Animatable.View ref={this.notif} animation="slideInDown">
                        <TouchableOpacity onPress={this._onClick}>
                            <View style={styles.notif_container}>
                                <View style={styles.content}>
                                    <H2 color={colors.BLACK} fontSize={scale.w(16)}>
                                        {this.props.title}
                                    </H2>
                                    <View style={{ height: 8 }} />
                                    <H3 color={colors.BLACK}>{this.props.body}</H3>
                                </View>

                                <TouchableOpacity onPress={this._handleClose}>
                                    <View style={styles.btn_close_container}>
                                        <IonIcon name="md-close" size={scale.w(24)} color={colors.BLACK} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    notif_container: {
        backgroundColor: '#fff',
        paddingHorizontal: scale.w(16),
        paddingBottom: scale.w(16),
        paddingTop: Platform.OS === 'ios' ? scale.w(56) : scale.w(16),
        flexDirection: 'row',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: -1, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: scale.w(8),
            },
            android: {
                elevation: 3,
            },
        }),
    },
    content: {
        flex: 1,
        paddingRight: scale.w(16),
    },
    btn_close_container: {
        width: scale.w(46),
        height: scale.w(46),
        borderRadius: scale.w(23),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
});

export default InAppNotification;
