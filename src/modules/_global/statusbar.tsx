import React, { Component } from 'react';
import { View, SafeAreaView, StatusBar, Platform, StyleSheet } from 'react-native';

interface IStatusBarProps {
    backgroundColor: string;

}

interface IStatusState {

}

class MyStatusBar extends React.PureComponent<IStatusBarProps, IStatusState> {
    constructor(props: IStatusBarProps) {
        super(props)
    }
    render() {
        return (
            <View style={[styles.statusBar, { backgroundColor: this.props.backgroundColor }]}>
                <SafeAreaView>
                    <StatusBar translucent backgroundColor={this.props.backgroundColor} />
                </SafeAreaView>
            </View>
        );
    }
}

export default MyStatusBar;


const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar: {
        height: STATUSBAR_HEIGHT,
    },
    appBar: {
        backgroundColor: '#79B45D',
        height: APPBAR_HEIGHT,
    },
    content: {
        flex: 1,
        backgroundColor: '#33373B',
    },
});