import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView,
    FlatList,
    Image,
    TextInput,
    Text,
    Platform,
    ActivityIndicator,
    Keyboard,
    StatusBar,
} from 'react-native';
import base from '../../utils/baseStyles';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP,
} from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import colors from '../../constants/colors';
import { H4, H3 } from '../_global/Text';
import { ISpaTreatmentListReduxProps } from './SpaTreatmentList.Container';
import CheckSquare from '../_global/CheckSquare';
import { ISpa, ISpaTreatment } from '../../types/spa';
import ImageZoom from 'react-native-image-pan-zoom';
import Modal from 'react-native-modal';
import numeral from 'numeral';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModal from '../_global/CustomModal';
import NoteOrderItem from './Components/NoteOrderItem';
import { debounce, find } from 'lodash';
import DropShadow from 'react-native-drop-shadow';
import { RootContainer } from '../_global/Container';
import { spaBookingTime } from '../../utils/navigationControl';
import { toast } from '../../utils/handleLogic';

export interface ISpaTreatmentListProps extends ISpaTreatmentListReduxProps {
    componentId: string;
    spa: ISpaTreatment[];
    // spa: ISpa;
    onSubmitSelectedTreatments: (treatments: ISpaTreatment[]) => void;
    hotelTaxes: any;
}

interface ISpaTreatmentListState {
    selectedItem: ISpaTreatment[];
    loadingGet: boolean;
    selectedVal: any;
    search: boolean;
    dataToShow: {};
    modalVisible: boolean;
    modalVisible1: boolean;
    imageUrl: String;
    description: any;
    title: String;
    item: any;
    note: string;
    selected: any;
    selectedCheck: boolean;
    chainData: {
        data: {
            name: string;
            logo: string;
            splash_screen: string;
            private_policy: string;
            terms_n_conditions: string;
            about_us: string;
            contact_us: string;
            logo_gif_dark: string;
            logo_gif_light: string;
            signup_bg: string;
            signin_bg: string;
        };
    };
}

class SpaTreatmentList extends React.Component<ISpaTreatmentListProps, ISpaTreatmentListState> {
    private _modalNoteOrderItem = React.createRef<CustomModal>();
    constructor(props: ISpaTreatmentListProps) {
        super(props);
        this.state = {
            selectedItem: [],
            loadingGet: false,
            selectedVal: '',
            selectedCheck: false,
            search: false,
            dataToShow: this.props.treatments,
            modalVisible: false,
            modalVisible1: false,
            imageUrl: '',
            description: '',
            title: '',
            item: [],
            note: '',
            selected: {},
            chainData: {
                data: {
                    name: '',
                    logo: '',
                    splash_screen: '',
                    private_policy: '',
                    terms_n_conditions: '',
                    about_us: '',
                    contact_us: '',
                    logo_gif_dark: '',
                    logo_gif_light: '',
                    signup_bg: '',
                    signin_bg: '',
                },
            },
        };

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        this._fetch = this._fetch.bind(this);
        this._handleBack = this._handleBack.bind(this);
        this._handleSpaTreatmentList = this._handleSpaTreatmentList.bind(this);
        this._handleSelectItem = this._handleSelectItem.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderListHeaderComponent = this._renderListHeaderComponent.bind(this);
        this._renderItemSeparatorComponent = this._renderItemSeparatorComponent.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._handleModalNoteOrderItem = this._handleModalNoteOrderItem.bind(this);
        this._onChangeText = this._onChangeText.bind(this);
    }

    componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        });
        // this.props.getSpaTreatment(this.props.spa.id);
        this._fetch();
    }

    _fetch() {
        this.setState({ loadingGet: true });
        this.props.getSpaTreatment(
            this.props.spa.id,
            this.props.code,
            () => {
                this.setState({ loadingGet: false });
            },
            () => {
                this.setState({ loadingGet: false });
            },
        );
        console.log(
            'treatments',
            this.props.getSpaTreatment(
                this.props.spa.id,
                this.props.code,
                () => {
                    this.setState({ loadingGet: false });
                },
                () => {
                    this.setState({ loadingGet: false });
                },
            ),
        );
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handleSpaTreatmentList() {
        const { selectedItem } = this.state;
        // this.props.onSubmitSelectedTreatments(selectedItem);
        // Navigation.pop(this.props.componentId);
        console.log('spakkk', this.props.spa);
        if (selectedItem.length == 0) {
            toast(this.props.selectedLanguage.please_select_at_least_one_treatment);
            return 0;
        }
        Navigation.push(
            this.props.componentId,
            spaBookingTime({
                // treatmentSelectedList: this.state.selectedTreatments,
                selectedItem: selectedItem,
                hotelTaxes: this.props.hotelTaxes,
                spa: this.props.spa,
                // onSubmitSelectedTreatments: (selectedTreatments) => this.setState({ selectedTreatments }),
            }),
        );
        console.log('selected', selectedItem);
    }

    _handleSelectItem(item: ISpaTreatment) {
        const { dataToShow, selectedItem } = this.state;
        console.log('selectedItem before', dataToShow);
        // this.setState({
        //     selectedItem: item,
        //     selectedCheck: true,
        // });
        console.log('item', item);
        let newItem;
        selectedItem.length > 0 ? (newItem = [...selectedItem]) : (newItem = []);
        selectedItem.map((treatment) => treatment.id).includes(item.id)
            ? newItem.pop(item)
            : newItem.push(item);

        console.log('newItem', newItem);

        this.setState({
            selectedItem:
                selectedItem.length > 0
                    ? newItem
                    : dataToShow.map((treatment) => treatment.id).includes(item.id)
                    ? dataToShow.filter((treatment) => treatment.id == item.id)
                    : [...dataToShow, { ...item, note: '' }],
        });
        console.log('selectedItem after', this.state.selectedItem);
    }

    _keyExtractor(item: ISpaTreatment) {
        return item.id.toString();
    }

    _renderListHeaderComponent() {
        return <View style={{ height: heightPercentageToDP(2) }} />;
    }

    _renderItemSeparatorComponent() {
        return <View style={{ height: scale.w(0) }} />;
    }
    setModalVisible(visible: boolean) {
        this.setState({ modalVisible: visible });
    }
    setModalVisible1(visible: boolean) {
        this.setState({ modalVisible1: visible });
    }

    _handleModalNoteOrderItem(item: ISpaTreatment | null, closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalNoteOrderItem.current) {
                if (closeModal) {
                    this.setState(
                        (prevState) => ({
                            selectedItem: prevState.selectedItem.map((dish) => {
                                if (dish.id === prevState.selected.id) {
                                    return {
                                        ...dish,
                                        note: prevState.selected.note,
                                    };
                                }
                                return dish;
                            }),
                        }),
                        this._modalNoteOrderItem.current.hide,
                    );
                } else {
                    const selected = find(this.state.selectedItem, { id: item ? item.id : 0 });
                    this.setState(
                        { selected: selected ? selected : this.state.selectedItem },
                        this._modalNoteOrderItem.current.show,
                    );
                }
            }
        };
    }

    _onChangeText(text: string) {
        this.setState((prevState) => ({
            selected: {
                ...prevState.selected,
                note: text,
            },
        }));
    }

    _renderItem({ item, index }: { item: ISpaTreatment }) {
        const { selectedItem } = this.state;
        const { currency, color } = this.props;
        const selected = find(this.state.selectedItem, { id: item.id });
        let duration = item.duration;
        let hours = +duration.split(':')[0];
        let minutes = +duration.split(':')[1];
        let final_time;
        if (hours > 0 && minutes > 0) {
            final_time = `${hours} hours ${minutes} minutes`;
        } else if (hours == 0 && minutes > 0) {
            final_time = `${minutes} minutes`;
        } else if (hours > 0 && minutes == 0) {
            final_time = `${hours} hours`;
        }
        return (
            <DropShadow
                style={{
                    width: widthPercentageToDP(100),
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowColor: colors.CHECKIN_AND_CHECKOUT_SHADOW_COLOR,
                    shadowOpacity: 0.09,
                    shadowRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View style={styles.menu_btn_container}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                imageUrl: `${item.image}`,
                                description: item.description,
                                title: item.name,
                                item: item,
                            });
                            this.setModalVisible(true);
                        }}
                        activeOpacity={1}
                        style={{
                            marginTop: heightPercentageToDP(2),
                            alignSelf: 'center',
                            width: widthPercentageToDP(90),
                        }}
                    >
                        <Animatable.View
                            useNativeDriver
                            animation="fadeInLeft"
                            duration={400}
                            delay={Math.floor(Math.random() * 100)}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: scale.w(2.5),
                                flexDirection: 'row',
                                paddingVertical: heightPercentageToDP(1),
                                paddingHorizontal: widthPercentageToDP(2),
                                width: widthPercentageToDP(90),
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            <DropShadow
                                style={{
                                    shadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                    shadowColor: colors.BLUE,
                                    shadowOpacity: 0.1,
                                    shadowRadius: 10,
                                }}
                            >
                                <Image
                                    source={{ uri: `${item.image}` }}
                                    style={{
                                        width: scale.w(8),
                                        height: scale.w(8),
                                        borderRadius: scale.w(8) / 2,
                                    }}
                                    resizeMode="cover"
                                />
                            </DropShadow>
                            <View
                                style={{
                                    marginLeft: widthPercentageToDP(3.5),
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale.w(1.9),
                                        color: colors.ROOM_CLEANING_LIST_HEADER,
                                        fontFamily: 'Roboto-Bold',
                                    }}
                                >
                                    {item.name}
                                </Text>
                                <Text
                                    style={{
                                        marginTop: heightPercentageToDP(0.28),
                                        fontSize: scale.w(1.3),
                                        color: '#B3B9C7',
                                        fontFamily: 'Roboto-Regular',
                                    }}
                                >
                                    {final_time}
                                </Text>
                                <Text
                                    style={{
                                        marginTop: heightPercentageToDP(0.28),
                                        fontSize: scale.w(1.3),
                                        color: '#B3B9C7',
                                        fontFamily: 'Roboto-Regular',
                                    }}
                                >{`${currency}${parseFloat(item.price)}`}</Text>
                                {/* <H4 textAlign="center" fontSize={scale.w(16), fontWeight : 'bold'}>
                                {item.name}
                            </H4> */}
                            </View>
                            <View
                                style={{
                                    // width: widthPercentageToDP(10),
                                    alignItems: 'flex-end',
                                    marginHorizontal: wp(2),
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => this._handleSelectItem(item)}
                                    activeOpacity={0.7}
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                >
                                    <CheckSquare
                                        isChecked={selectedItem
                                            .map((treatment) => treatment.id)
                                            .includes(item.id)}
                                        borderRadius={10}
                                        tintColor={this.props.icon.spa_color}
                                    />
                                    {/* <Text>sdfsdf</Text> */}
                                </TouchableOpacity>
                            </View>
                        </Animatable.View>
                    </TouchableOpacity>
                </View>
            </DropShadow>
        );
    }

    Search(val: any) {
        if (val === '') {
            this.setState({ search: false, dataToShow: this.props.treatments });
        } else {
            let arr = Object.values(this.props.treatments).filter((x: any) => {
                return x.name.toLowerCase().includes(val.toLowerCase());
            });
            this.setState({ dataToShow: arr });
        }
    }
    render() {
        console.log('satateee', this.state);
        const { spa, treatments, color } = this.props;
        const { loadingGet } = this.state;
        const { choose_treatment } = this.props.selectedLanguage;

        return (
            <View style={{ flex: 1 }}>
                <Modal
                    onBackdropPress={() => {
                        this.setModalVisible(false);
                    }}
                    onBackButtonPress={() => {
                        this.setModalVisible(false);
                    }}
                    animationType="slide"
                    animationInTiming={500}
                    backdropOpacity={0.7}
                    onSwipeComplete={() => this.setState({ modalVisible: false })}
                    isVisible={this.state.modalVisible}
                    style={
                        Platform.OS == 'ios' && scale.isIphoneX()
                            ? {
                                  paddingVertical: heightPercentageToDP(5),
                              }
                            : {}
                    }
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingHorizontal: wp(2),
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                backgroundColor: 'white',
                                borderRadius: scale.w(5),
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: wp(3),
                            }}
                        >
                            <View style={{ height: hp(4) }} />

                            <H3 fontSize={scale.w(2.2)}>{this.state.title}</H3>

                            {this.state.imageUrl && <View style={{ height: hp(1) }} />}
                            {this.state.imageUrl != 'null' && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setTimeout(() => {
                                            this.setModalVisible1(true);
                                        }, 400);
                                        this.setModalVisible(false);
                                    }}
                                    style={{
                                        height: hp(2.2),
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Image
                                        resizeMode="contain"
                                        source={{ uri: this.state.imageUrl }}
                                        style={{ height: '80%', width: '80%' }}
                                    />
                                </TouchableOpacity>
                            )}
                            {this.state.imageUrl && <View style={{ height: hp(1) }} />}
                            {this.state.description && (
                                <H4 fontSize={scale.w(1.5)}>{this.state.description}</H4>
                            )}

                            {this.state.description && <View style={{ height: hp(6) }} />}
                            <TouchableOpacity
                                onPress={() => {
                                    this._handleSelectItem(this.state.item);
                                    this.setModalVisible(false);
                                }}
                                style={{
                                    borderRadius: 100,
                                    height: hp(6),
                                    width: wp(40),
                                    backgroundColor: color,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.WHITE,
                                        fontFamily: 'Roboto-Bold',
                                        fontSize: scale.w(1.4),
                                    }}
                                >
                                    {this.props.selectedLanguage.add_to_order}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ height: hp(4) }} />
                        </View>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            height: '100%',
                            alignSelf: 'flex-start',
                            paddingHorizontal: wp(1.2),
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.setModalVisible(false);
                            }}
                        >
                            <Image
                                source={require('../../images/icon_back.png')}
                                style={{ width: widthPercentageToDP(2.5), height: heightPercentageToDP(30) }}
                                resizeMode={'contain'}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </Modal>
                {/* //////////////////////////// */}

                <Modal
                    onBackdropPress={() => {
                        setTimeout(() => {
                            this.setModalVisible(true);
                        }, 400);
                        this.setModalVisible1(false);
                    }}
                    onBackButtonPress={() => {
                        setTimeout(() => {
                            this.setModalVisible(true);
                        }, 400);
                        this.setModalVisible1(false);
                    }}
                    isVisible={this.state.modalVisible1}
                    animationType="slide"
                    animationInTiming={500}
                    backdropOpacity={0.9}
                    style={[
                        styles.modal,
                        Platform.OS == 'ios' && scale.isIphoneX()
                            ? {
                                  paddingVertical: scale.h(45),
                              }
                            : {},
                    ]}
                >
                    <View style={{ flex: 1 }}>
                        <View style={styles.modalContainer}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    height: '100%',
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                    }}
                                >
                                    <ImageZoom
                                        cropWidth={wp(100)}
                                        cropHeight={hp(100)}
                                        imageWidth={wp(100)}
                                        imageHeight={hp(100)}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            source={{ uri: this.state.imageUrl }}
                                            style={styles.image1}
                                        ></Image>
                                    </ImageZoom>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                height: '100%',
                                alignSelf: 'flex-start',
                                paddingHorizontal: wp(1.2),
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setTimeout(() => {
                                        this.setModalVisible(true);
                                    }, 400);
                                    this.setModalVisible1(false);
                                }}
                            >
                                <Image
                                    source={require('../../images/icon_back.png')}
                                    style={{ width: scale.w(30), height: scale.w(30) }}
                                    resizeMode={'contain'}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {Platform.OS === 'ios' && (
                    <View
                        style={{
                            width: '100%',
                            height: heightPercentageToDP(20), // For all devices, even X, XS Max
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: this.props.icon.spa_color,
                            borderBottomRightRadius: widthPercentageToDP(7),
                        }}
                    />
                )}
                {Platform.OS === 'android' && (
                    <StatusBar backgroundColor={this.props.icon.spa_color}></StatusBar>
                )}

                <RootContainer>
                    <View
                        style={{
                            height: heightPercentageToDP(14),
                            backgroundColor: this.props.icon.spa_color,
                        }}
                    >
                        {/* <ImageBackground style={{height : heightPercentageToDP(20), width : widthPercentageToDP(100)}} source={require('../../images/headerMasked.png')}  > */}
                        <Navbar
                            tintBackColor={colors.WHITE}
                            titleColor={colors.WHITE}
                            onClick={this._handleBack}
                            title={spa.name}
                        />
                        {/* </ImageBackground> */}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: colors.WHITE,
                            top: -heightPercentageToDP(4.3),
                            borderTopLeftRadius: scale.w(3.5),
                            borderTopRightRadius: scale.w(3.5),
                            paddingTop: heightPercentageToDP(0.75),
                        }}
                    >
                        <View style={styles.searchview}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: wp(5) }}>
                                <Image
                                    source={require('../../images/icon-search.png')}
                                    style={{ height: 15, width: 15, tintColor: color }}
                                />

                                <TextInput
                                    value={this.state.selectedVal}
                                    onChangeText={(val) => {
                                        this.setState({ selectedVal: val, search: true });
                                        this.Search(val);
                                    }}
                                    placeholder={this.props.selectedLanguage.search}
                                    style={{
                                        fontSize: scale.w(2),
                                        marginLeft: widthPercentageToDP(3),
                                        width: wp(75),
                                        fontFamily: 'Roboto-Regular',
                                    }}
                                ></TextInput>
                            </View>
                        </View>
                        {this.state.dataToShow.length == 0 && this.state.search == false ? (
                            <FlatList
                                refreshControl={<RefreshControl onRefresh={this._fetch} refreshing={false} />}
                                ListEmptyComponent={() => {
                                    return (
                                        <View>
                                            {this.state.loadingGet ? (
                                                <View
                                                    style={{
                                                        width: widthPercentageToDP(100),
                                                        height: heightPercentageToDP(60),
                                                        alignSelf: 'center',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {this.props.primaryColor == '#72D7FF' ? (
                                                        <Image
                                                            resizeMode="contain"
                                                            style={{
                                                                height: '100%',
                                                                width: '100%',
                                                            }}
                                                            source={{
                                                                uri: this.state.chainData.data.logo_gif_light,
                                                            }}
                                                        />
                                                    ) : (
                                                        <Image
                                                            resizeMode="contain"
                                                            style={{
                                                                height: scale.w(10),
                                                                width: scale.w(30),
                                                            }}
                                                            source={{
                                                                uri: this.state.chainData.data.logo_gif_light,
                                                            }}
                                                        />
                                                    )}
                                                </View>
                                            ) : (
                                                <View style={{ marginTop: heightPercentageToDP(5) }}>
                                                    <Text style={{ alignSelf: 'center' }}>
                                                        No spa treatment found
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    );
                                }}
                                data={treatments}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                // ListHeaderComponent={this._renderListHeaderComponent}
                                ItemSeparatorComponent={this._renderItemSeparatorComponent}
                                renderItem={this._renderItem}
                                initialNumToRender={10}
                            />
                        ) : (
                            <FlatList
                                refreshControl={<RefreshControl onRefresh={this._fetch} refreshing={false} />}
                                ListEmptyComponent={() => {
                                    return (
                                        <View>
                                            {this.state.loadingGet ? (
                                                // <ActivityIndicator size="large" color={'#fff'} />
                                                <View
                                                    style={{
                                                        width: widthPercentageToDP(90),
                                                        height: heightPercentageToDP(20),
                                                        alignSelf: 'center',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        // backgroundColor:'red'
                                                        marginTop: heightPercentageToDP(20),
                                                    }}
                                                >
                                                    <Image
                                                        resizeMode="contain"
                                                        style={{
                                                            height: '100%',
                                                            width: '100%',
                                                            marginTop: heightPercentageToDP(10),
                                                        }}
                                                        source={{
                                                            uri: this.state.chainData.data.logo_gif_light,
                                                        }}
                                                    />
                                                </View>
                                            ) : (
                                                <View style={{ marginTop: heightPercentageToDP(40) }}>
                                                    <Text style={{ alignSelf: 'center' }}>
                                                        No spa treatment found
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    );
                                }}
                                data={this.state.dataToShow}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                ListHeaderComponent={this._renderListHeaderComponent}
                                ItemSeparatorComponent={this._renderItemSeparatorComponent}
                                renderItem={this._renderItem}
                                initialNumToRender={10}
                            />
                        )}

                        <Animatable.View
                            useNativeDriver
                            animation="fadeIn"
                            duration={300}
                            style={styles.submit_btn_container}
                        >
                            <ButtonPrimary
                                onPress={this._handleSpaTreatmentList}
                                text={choose_treatment}
                                backgroundColor={color || colors.VIOLET}
                                chainData={this.props.chainData}
                            />
                        </Animatable.View>
                        <SafeAreaView style={{ marginBottom: wp(2) }} />
                    </View>
                </RootContainer>
                <CustomModal ref={this._modalNoteOrderItem} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <NoteOrderItem
                        value={this.state.selected.note}
                        onChangeText={this._onChangeText}
                        showModal={this._handleModalNoteOrderItem(null, true)}
                        title={`${this.state.selected.name} Note`}
                        color={color}
                        chainData={this.props.chainData}
                    />
                </CustomModal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    submit_btn_container: {
        paddingHorizontal: widthPercentageToDP(5),
        marginTop: heightPercentageToDP(5),
    },
    item_container: {
        flexDirection: 'row',
        paddingLeft: widthPercentageToDP(2),
        paddingRight: widthPercentageToDP(5),
    },
    searchview: {
        marginHorizontal: wp(5),

        // height: wp(12),
        justifyContent: 'center',
        // marginVertical: 10,
        borderRadius: scale.w(2.5),
        backgroundColor: '#ECECEC',
        paddingVertical: hp(1.2),
        marginTop: hp(3),
    },
    image: {
        alignContent: 'center',
        width: wp(14),
        height: hp(8),
        alignSelf: 'center',
        // position: 'relative',
    },
    modalContainer: {
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginHorizontal: 10,
    },
    modal: {
        height: '100%',
        marginLeft: -1,
        paddingVertical: 20,
        marginBottom: -1,
    },
    image1: {
        alignContent: 'center',
        width: '100%',
        height: hp('100%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        // position: 'relative',
    },
});

export default SpaTreatmentList;
