import React from 'react';
import { View, StyleSheet, Image, ScrollView, Text } from 'react-native';
import base from '../../utils/baseStyles';
import { scale, widthPercentageToDP as wp, screenHeight, heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import { Navigation } from 'react-native-navigation';
import { promotionDetails } from '../../utils/navigationControl';
import MenuButton from '../_global/PromotionButton';
import { IPromotionServiceReduxProps } from './PromotionService.Container';
import Carousel from 'react-native-snap-carousel';
import { screenWidth } from '../../utils/dimensions';
import { IPromotion } from '../../types/promotion';
// import Config from 'react-native-config';
import Lightbox from 'react-native-lightbox';

export interface IPromotionServiceProps extends IPromotionServiceReduxProps {
    componentId: string;
    promotion: IPromotion;
    btnTitle: string;
    idButton: number;
}

interface IPromotionServiceState {}
let imgs = [
    {
        title: 'Beautiful and dramatic Antelope Canyon',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        path: 'https://i.imgur.com/UYiroysl.jpg',
    },
    {
        title: 'Earlier this morning, NYC',
        subtitle: 'Lorem ipsum dolor sit amet',
        path: 'https://i.imgur.com/UPrs1EWl.jpg',
    },
    {
        title: 'White Pocket Sunset',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        path: 'https://i.imgur.com/MABUbpDl.jpg',
    },
];

const RenderPromotion = (props: any) => (
    // console.log("HELOO FROM RENDERPROMOTION");
    <View>
        <Image
            source={{ uri: props.value }}
            style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
                marginTop: scale.w(20),
            }}
        />
    </View>
);

class PromotionService extends React.Component<IPromotionServiceProps, IPromotionServiceState> {
    constructor(props: IPromotionServiceProps) {
        super(props);

        this.state = {};

        Navigation.mergeOptions(props.componentId, {
            statusBar: {
                backgroundColor: props.color,
                style: 'light',
            },
        });
        // props.getPromotion(this.props.idHotel);
        // this.getData = this.getData.bind(this)

        this.getData();
        this._handleBack = this._handleBack.bind(this);
        this._handlePromotionDetail = this._handlePromotionDetail.bind(this);

        // this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
    }

    renderCarousel() {
        <Carousel
            data={this.props.promotion.promotions.images}
            renderItem={({ item }) => (
                // <View style={{flex  :1,height : screenHeight,width : screenWidth, justifyContent : 'center', alignItems : 'center', alignSelf : 'center'}}>
                // <Image
                //     source={{ uri: item.path }}
                //     style={{
                //         width: screenWidth,
                //         height: screenHeight,
                //         marginTop: scale.w(80),
                //     }}
                //     resizeMode='contain'
                // />
                <Text style={{ color: 'white' }}>Haider</Text>
                // </View>
            )}
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
            autoplay
            loop
        />;
    }
    // componentWillMount() {
    //     // setTimeout(()=>{
    //     // this.props.getPromotion(this.props.idHotel);
    //     //     console.log("waiting brah")
    //     // },2000)
    //     this.getData()
    // }
    componentDidMount() {
        this.props.getPromotion(this.props.idButton, this.props.idHotel);
    }
    //  componentWillUpdate(){

    //      this.getData()
    // }
    async getData() {
        try {
            await this.props.getPromotion(this.props.idButton, this.props.idHotel);
        } catch (e) {
            console.warn(e);
        }
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    _handlePromotionDetail(idButton: number, promotionTitle: string) {
        console.log('id button', idButton, promotionTitle);
        // console.log("Promotion details called")
        this.props.emptyPromotionDetails({ images: [] });
        Navigation.push(
            this.props.componentId,
            promotionDetails({
                idButton,
                promotionTitle,
            }),
        );

        // Navigation.push(
        //     this.props.componentId,
        //     spaBookingTime({
        //         isReserveSpaType: true,
        //         spa: this.props.spa,
        //     }),
        // );
    }

    render() {
        console.log('printing props of promotion = ', this.props);
        const { promotion, color, btnTitle } = this.props;
        var promotionArr: any = [];
        if (promotion.promotions != null && promotion.promotions != undefined)
            promotionArr = Object.values(promotion.promotions); //object to array
        let promotionImgSrc =
            'http://cdn.lolwot.com/wp-content/uploads/2015/07/20-pictures-of-animals-in-hats-to-brighten-up-your-day-1.jpg';

        // if (promotionArr.length == 0 || promotionArr == undefined) {
        //     return null;
        // } else {
        // console.log('promotios2', promotion.promotions.images)
        // console.log('check the data', promotionArr[0].)

        return (
            <View style={base.container}>
                <Navbar
                    isViolet={color === ''}
                    color={color}
                    onClick={this._handleBack}
                    title={btnTitle || 'Promotion'}
                />
                <ScrollView>
                    {/* <Lightbox springConfig={{ tension: 15, friction: 7 }} swipeToDismiss={false} > */}

                    {/* <Carousel
                                data={promotion.promotions.images}
                                renderItem={({ item }) => (
                                    <View style={{flex : 1, justifyContent : 'center'}}>
                                    <Image
                                        source={{ uri: item.path }}
                                        style={{
                                            width: '100%',
                                            height: scale.w(200),
                                            marginTop: scale.w(20),
                                        }}
                                        resizeMode='contain'
                                    />
                                    </View>
                                )}
                                sliderWidth={screenWidth}
                                itemWidth={screenWidth}
                                autoplay
                                loop
                            /> */}
                    {/* </Lightbox> */}

                    {/* <Carousel
                    data={promotion.logo_url}
                    renderItem={({ item }) => <Image source={{ uri: item }} style={styles.logo} />}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth}
                    autoplay
                    loop
                /> */}
                    {!promotionArr.length && (
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height : heightPercentageToDP(80)
                            }}
                        >
                            <Text>No promotion found</Text>
                        </View>
                    )}

                    {promotionArr &&
                        promotionArr.map((data: any, i: any) => {
                            if (data.data) {
                                let obj = JSON.parse(data.data);

                                // console.log("Printo = ",obj.sub_title)
                                return (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: heightPercentageToDP(10),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {/* <View style={{ height: scale.w(20) }} /> */}
                                        {/* <View style={styles.menu_btn_container}> */}
                                        <MenuButton
                                            onPress={() => {
                                                obj.sub_title
                                                    ? this._handlePromotionDetail(data.id, obj.sub_title)
                                                    : this._handlePromotionDetail(data.id, obj.title);
                                            }}
                                            // source={require('../../images/icon_reserve_spa_treatment.png')}
                                            // text={data.title}
                                            text2={obj.title ? obj.title : data.title}
                                            text3={obj.promotion_amount}
                                            // text4={obj.promotion_description}
                                            // text5={obj.promotion_code}
                                            // text6={obj.redeem_link}
                                            text7={obj.promotion_description}
                                            width={widthPercentageToDP(30)}
                                            height={heightPercentageToDP(20)}
                                            iconSize={scale.w(7.0)}
                                            fontSize={scale.w(2.0)}
                                            styleImage={{ tintColor: color }}
                                        />
                                        {/* </View> */}
                                        {/* <View style={{ marginVertical: scale.w(10), justifyContent: 'flex-start' }}> */}
                                        {/* <Lightbox springConfig={{ tension: 15, friction: 7 }} swipeToDismiss={false} renderContent={() => { <RenderPromotion value={'http://cdn.lolwot.com/wp-content/uploads/2015/07/20-pictures-of-animals-in-hats-to-brighten-up-your-day-1.jpg'} /> }}> */}
                                        {/* <Image */}
                                        {/* style={{ */}
                                        {/* height: scale.w(190), width: scale.w(230), */}
                                        {/* marginRight: 300 */}
                                        {/* }} */}
                                        {/* source={{ uri: 'http://cdn.lolwot.com/wp-content/uploads/2015/07/20-pictures-of-animals-in-hats-to-brighten-up-your-day-1.jpg' }} */}
                                        {/* /> */}
                                        {/* </Lightbox> */}

                                        {/* <Image style={{ height: scale.w(200), width: scale.w(300)}} source={{ uri: `${Config.URL}/${data.icon}.png` }} /> */}

                                        {/* </View> */}
                                    </View>
                                );
                            }
                        })}
                </ScrollView>
            </View>
        );
        // }
    }
}

const styles = StyleSheet.create({
    text_container: {
        marginTop: scale.w(10),
        marginBottom: scale.w(20),
        marginHorizontal: scale.w(28),
    },
    image_container: {
        alignItems: 'center',
        marginTop: scale.w(60),
        marginBottom: scale.w(68),
    },
    menu_btn_container: {
        // paddingHorizontal: scale.w(10),
        // marginBottom: scale.w(10),
        alignItems: 'flex-start',
        backgroundColor: 'red',
    },
    logo: {
        width: '100%',
        height: scale.w(200),
        resizeMode: 'contain',
        marginTop: scale.w(20),
    },
    contain: {
        flex: 1,
        height: 150,
        backgroundColor: 'red',
    },
});

export default PromotionService;
