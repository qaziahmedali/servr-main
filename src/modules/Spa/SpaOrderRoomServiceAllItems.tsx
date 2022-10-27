import React, { createRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    RefreshControl,
    SafeAreaView,
    FlatList,
    TextInput,
    Text,
    Platform,
    ActivityIndicator,
    Alert,
    ImageBackground,
    StatusBar,
} from 'react-native';
import base from '../../utils/baseStyles';
import {
    scale,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP,
    heightPercentageToDP,
} from '../../utils/dimensions';
import Navbar from '../_global/Navbar';
import Image from 'react-native-image-progress';
import { Navigation } from 'react-native-navigation';
import { IRestaurant, IDish, ICategoryDish } from '../../types/restaurant';
import { debounce, isEqual, padStart, stubString } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { ButtonPrimary } from '../_global/Button';
import colors from '../../constants/colors';
import CustomModal from '../_global/CustomModal';
import { H4, H2, H3 } from '../_global/Text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import NoteOrderItem from './Components/NoteOrderItem';
import { IOrderRoomServicAllItemseReduxProps } from './SpaOrderRoomServiceAllItems.Container';
import numeral from 'numeral';
import { find, findIndex } from 'lodash';
import { IOrderItem } from '../../types/action.restaurant';
import { mycard, spaservicedetail, PaymentDetailScreen } from '../../utils/navigationControl';
import ImageZoom from 'react-native-image-pan-zoom';
import Modal from 'react-native-modal';
import AttentionModal from '../_global/AttentionModal';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ProceedPayment from '../_global/proceedPayment';
import ProcessCompleteModal from '../_global/processComplete';
import FIcon from 'react-native-vector-icons/Entypo';
import ModalTimePicker from './Components/ModalTimePicker';
import PaymentFormModal from '../_global/paymentFormModal';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import ImageExpandModal from '../_global/imageModal';
import { Menu, MenuItem, Position, MenuDivider } from 'react-native-enhanced-popup-menu';
import InputText from './../_global/InputText';
import Cardscan from 'react-native-cardscan';
import { IFeatureHotel } from '../../types/hotel';
import { toast } from '../../utils/handleLogic';
import DropShadow from 'react-native-drop-shadow';
import { RootContainer } from '../_global/Container';
let DATA = {
    componentId: 'orderRoomService',
    rootTag: 51,
    restaurant: {
        id: 1,
        name: 'Teppenyaki',
        logo_url:
            'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurants/1.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105701Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=81d58e5761cbc843dc93ffab7222b6bd1dc536d87cb633323f97991e68aaed5d',
        res_table_numbers: 1,
        res_table_layout: null,
        opening_time: '00:09',
        closing_time: '23:59',
        galleries: [
            'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-galleries/1_zqawam79.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105701Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=240e83387e20239dabb6faa614252d86ad09bca5638a4b1f12c6ac07dc3ceb04',
            'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-galleries/1_zfu9nwyv.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105701Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=ea8b42b85aa8e2990504cfb7493f28500faecfb8116fae860ca18ca696856a10',
            'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-galleries/1_l4d28iqe.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105701Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=df2caf6fb20b311e716a5aede52058c5dd8d81e04fb5da9782a3f72aee748fe8',
            'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-galleries/1_56haoo1y.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105701Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=87570b7fbb8f294f3e8d1ebd66a451bf46307332562bfc734b8bd06a9539e944',
            'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-galleries/1_nettgcf5.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105701Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=43951471bf1fc80fecbee079ef9e19033ae973aec83e53c857cddaa1d97262af',
            'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-galleries/1_yafepuz3.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105701Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=01b3f9b29cd4e905e44084156ca87d50ec78728f54c9eaef67de93abb7ce275a',
            'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-galleries/1_qt38kwx6.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105701Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=3f41e8f21c9d210bfc35a98865cc3d2cdfdb641edd68528f503995cc638999cc',
            'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-galleries/1_jo5a4rq2.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105701Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=9c34b5e8e102eeadcbbe1f92b7e79dabf7c3a6b166c72cae6d84ade8f03757f8',
        ],
    },
    dishesCategories: [
        {
            title: 'Main',
            data: [
                {
                    id: 1773,
                    restaurant_id: 1,
                    name: 'Delicious Hamburger',
                    description: 'qq',
                    price: 4.79,
                    category: '499',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1774,
                    restaurant_id: 1,
                    name: 'Delicious Cheese Veggie Sandwich',
                    description: 't',
                    price: 35.33,
                    category: '499',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1777,
                    restaurant_id: 1,
                    name: 'Hot Little Cheeseburger',
                    description: '111',
                    price: 28.02,
                    category: '499',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1778,
                    restaurant_id: 1,
                    name: 'Delicious Hamburger',
                    description: 'ee',
                    price: 13.18,
                    category: '499',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 3216,
                    restaurant_id: 1,
                    name: 'New Item',
                    description: 'New Item',
                    price: 234,
                    category: '499',
                    created_at: '2021-04-06 06:36:28',
                    updated_at: '2021-04-06 06:36:28',
                    deleted_at: null,
                    image: 'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-dish-galleries/1_64xq0ye4_1617690986.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105725Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=d08ffc399c4ec00aecf375450fbf6e165f95d04ff084de758b21dba2c17bdb89',
                    slug: '',
                },
            ],
        },
        {
            title: 'Meat And Fish',
            data: [
                {
                    id: 1771,
                    restaurant_id: 1,
                    name: 'Delicious Grilled Cheese',
                    description: 'r',
                    price: 43.55,
                    category: '519',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1782,
                    restaurant_id: 1,
                    name: 'Hot Bacon Dog',
                    description: '1',
                    price: 23.24,
                    category: '519',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1783,
                    restaurant_id: 1,
                    name: 'Nice Bacon Burger',
                    description: null,
                    price: 44.26,
                    category: '519',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
            ],
        },
        {
            title: 'Salad',
            data: [
                {
                    id: 1767,
                    restaurant_id: 1,
                    name: 'Delicious Hamburger',
                    description: 'Hhh',
                    price: 29.62,
                    category: '535',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1769,
                    restaurant_id: 1,
                    name: 'Great Little Hamburger 123',
                    description: null,
                    price: 9.94,
                    category: '535',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1770,
                    restaurant_id: 1,
                    name: 'Hot Cheese Dog',
                    description: 'Test',
                    price: 36.63,
                    category: '535',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1772,
                    restaurant_id: 1,
                    name: 'Hot Grilled Cheese aaa',
                    description: null,
                    price: 4.25,
                    category: '535',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1775,
                    restaurant_id: 1,
                    name: 'Delicious Pasta1',
                    description: null,
                    price: 49.79,
                    category: '535',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1784,
                    restaurant_id: 1,
                    name: 'Caesar salad',
                    description: 'Salad avec pulet et jambon test',
                    price: 12,
                    category: '535',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
            ],
        },
        {
            title: 'Starter New',
            data: [
                {
                    id: 1768,
                    restaurant_id: 1,
                    name: 'Nice Potato',
                    description: 'test121',
                    price: 35,
                    category: '551',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1776,
                    restaurant_id: 1,
                    name: 'Hot Bacon Dog 1',
                    description: null,
                    price: 46.98,
                    category: '551',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1779,
                    restaurant_id: 1,
                    name: 'Great Little Bacon Cheeseburger 1',
                    description: null,
                    price: 46.75,
                    category: '551',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1780,
                    restaurant_id: 1,
                    name: 'Nice Bacon Cheeseburger',
                    description: null,
                    price: 33.35,
                    category: '551',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1781,
                    restaurant_id: 1,
                    name: 'Nice Pasta',
                    description: null,
                    price: 30.84,
                    category: '551',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-01-30 08:38:44',
                    deleted_at: null,
                    image: 'https://cms.servrhotels.com/images/default.jpg',
                    slug: '',
                },
                {
                    id: 1785,
                    restaurant_id: 1,
                    name: 'test1',
                    description: 'ttt111',
                    price: 111,
                    category: '551',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-04-06 06:42:57',
                    deleted_at: null,
                    image: 'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-dish-galleries/1_w586qdoh_1617691375.jpeg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105725Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=cac6a9cbe034cc69050d28e37010eda8c9310a4922fb4799d68b76a927502a3a',
                    slug: '',
                },
                {
                    id: 1786,
                    restaurant_id: 1,
                    name: 'test',
                    description: 'test',
                    price: 5,
                    category: '551',
                    created_at: '2021-01-30 08:38:44',
                    updated_at: '2021-04-08 11:29:28',
                    deleted_at: null,
                    image: 'https://servrhotels.s3.ap-southeast-1.amazonaws.com/restaurant-dish-galleries/1_6kma894f_1617881366.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUEWTMAAIFARSWAQE%2F20210624%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210624T105725Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=fb15a9e360f65850ea5796c187502955bd694effa644fa9ff8cce62477ab3ee8',
                    slug: '',
                },
            ],
        },
        { title: 'Record Type', data: [] },
        { title: 'Record Value', data: [] },
        { title: '810 Fc 91 B 56 A 647 B 0 D 6814 De 9 A 47 C 0299 Servrhotels Com', data: [] },
        { title: 'CNAME', data: [] },
        { title: 'D 7 Ef 4 F 5 B 62 B 62 B 0502 B 014084920646 E Duyqrilejt Acm Validations Aws', data: [] },
        { title: '810 Fc 91 B 56 A 647 B 0 D 6814 De 9 A 47 C 0299 Servrhotels Com', data: [] },
        { title: 'CNAME', data: [] },
        { title: 'Testcat 21', data: [] },
        { title: 'Testcat 22', data: [] },
        { title: 'Testcat 23', data: [] },
        { title: 'Testcat 24', data: [] },
    ],
    color: '#648CA5',
    currency: 'PKR',
    selectedLanguage: {
        Servr: 'Servr',
        welcome: 'Welcome',
        hotel_code: 'Hotel Code',
        hotel_code_description:
            'Hotel code should be shown within your booking email confirmation, or you can ask your hotel',
        continue: 'Continue',
        check_in: 'Check In',
        check_out: 'Check Out',
        restaurant: 'Restaurant',
        spa: 'Spa',
        conceirge_service: 'Concierge Service',
        experience: 'Experience',
        guest_checking_in: 'Guest Checking In',
        passport_photo: 'Passport Photo',
        take_photo: 'Take Photo',
        choose_from_library: 'Choose From Library',
        scan_credit_card: 'Scan Credit Card',
        scan_credit_card_or_input_manually_in_the_bottom_right_corner:
            'Scan credit card or input manually in the bottom right corner',
        okay: 'Okay',
        arrival_date: 'Arrival Date',
        departured_date: 'Departure Date',
        cardholder_name: 'Cardholder Name',
        card_expiry_date: 'Card Expiry Date',
        card_address: 'Card Address',
        booking_referance: 'Booking Referance',
        phone_number: 'Phone Number',
        room_number: 'Room Number',
        attention: 'Attention',
        please_check_in_first_to_use_this_service: 'Please check in first, to use this service',
        confirm_check_in: 'Confirm Check In',
        your_check_out_time_is: 'your check out time is:',
        your_new_check_out_time_is: 'Your new check out time is',
        request_late_check_out: 'Request late check out',
        your_late_check_out_request_has_been_sent: 'your late check out request has been sent!',
        please_check_back_to_see_if_your_request_was_accepted:
            'please check back to see if your request was accepted',
        your_late_checkout_request_has_been_accepted: 'Your late checkout request has been accepted!',
        please_select_a_restaurant_to_continue: 'please select a restaurant to continue',
        my_orders: 'My Orders',
        book_a_table: 'Book a Table',
        order_room_service: 'Order Room Service',
        confirm_booking: 'Confirm Booking',
        success: 'Success',
        success_your_reservation_request_has_been_sent: 'Your spa reservation request has been sent.',
        search: 'Search',
        add: 'Add',
        confirm_order: 'Confirm Order',
        current_orders: 'Current Orders',
        previous_orders: 'Previous Orders',
        total_price: 'Total Price',
        status: 'Status:',
        pending: 'Pending',
        accepted: 'Accepted',
        preparing: 'Preparing',
        on_the_way: 'On the way',
        delivered: 'Delivered',
        done: 'Done',
        live_chat: 'Live Chat',
        reserve_a_spa_treatment: 'Reserve a spa treatment',
        order_spa_room_service: 'Order spa room service',
        choose_treatment: 'Choose Treatment',
        number_of_people: 'Number of people',
        time_of_booking: 'Time of booking',
        Promotions: 'Promotions',
        shuttle_bus_service: 'Shuttle bus service',
        hotel_map: 'Hotel Map',
        time: 'Time',
        here_you_can_request_various_items_to_be_delivered_straight_to_you_room:
            'Here you can request various items to be delivered straight to your room',
        request_items: 'Request Items',
        note: 'Note',
        write_anything_about_this_item_order: 'Write anything about this item order',
        request_items_to_be_sent_to_your_room: 'request items to be sent to your room',
        request_room_cleaning: 'Room Cleaning',
        your_room_service_request_has_been_accepted: 'your room service request has been sent',
        choose_a_valet_laundary_service: 'choose a valet laundary service',
        you_requested_concierge_items: 'You requested concierge items!',
        room_cleaning: 'Room Cleaning',
        laundry_service: 'Laundry Service',
        your_laundry_service_request_has_been_sent: 'Your laundry service request has been sent!',
        your_restaurant: 'Your Restaurant',
        add_to_order: 'Add to Order',
        treatments_selected: 'Treatments Selected',
        pick_your_time_booking: 'Pick your time booking',
        promotion_amount: 'Promotion Amount',
        use_code: 'Use Code',
        request_laundry_service: 'Laundry Service',
        click_here_to_redeem: 'Click here to redeem',
        Select_Passport_Photo: 'Select Passport Photo',
        lang: 'english',
        parking_and_valet: 'Parking and Valet',
        signature: 'Signature',
        clear: 'Clear',
        tab_to_add_signature: 'Tab to add signature',
        i_agree_with_all: 'I agree with all',
        terms_and_condition: 'Terms & Conditions',
        clear_signature: 'Clear Signature',
        save_signature: 'Save Signature',
        no_current_orders: 'No Current Orders',
        select_table: 'Select Table',
        select_table_no: 'Select Table No',
        date: 'Date',
        no_previous_orders: 'No previous orders',
        select_time: 'Select Time',
        check_in_comments: 'Check-in Comments',
        extra_bed: 'Extra Bed',
        orders: 'Orders',
        to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin:
            'To use this feature, your check in must be accepted by hotel admin',
        ok: 'OK',
        chat: 'Chat',
        proceed_to_card: 'Proceed to Card',
        please_select_at_least_one_item: 'Please select at least one item',
        my_card: 'My Card',
        your_orders: 'Your Orders',
        total: 'Total',
        add_a_note_extra_napkin_etc: 'Add a note (Extra napkin etc)',
        add_a_note: 'Add a note',
        would_you_like_to_add_a_tip: 'Would you like to add a tip',
        yes: 'Yes',
        no: 'No',
        add_tip: 'Add Tip',
        enter_or_select_tip: 'Enter or select tip',
        please_select_at_least_one_treatment: 'Please select at least one treatment',
        wakeup_call: 'Wakeup Call',
        Select_the_time_you_would_like_to_be_woken_up_by: 'Select the time you would like to be woken up by:',
        year: 'Year',
        month: 'Month',
        hours: 'Hours',
        minutes: 'Minutes',
        restaurant_closed: 'Restaurant Closed',
        pick_your_booking_date: 'Pick your booking date',
        send: 'Send',
        type_something: 'Type Something',
        search_message: 'Search Message',
        open_camrea: 'Open Camera',
        cancel: 'Cancel',
        pick_your: 'Pick your',
        the_resturant_is_closed: 'The resturant is closed',
        are_you_sure_to_delete: 'Are you sure to delete',
        view_transaction_history: 'View Transaction History',
        transaction_history: 'Transaction History',
        no_data_found: 'No Data Found',
        parking_details: 'Parking Details',
        booking_reference_number: 'Booking Reference Number',
        car_description: 'Car Description',
        color: 'Color',
        valet_indentifier_number: 'Valet Indentifier Number',
        number_plate: 'Number Plate',
        parking_slot_number: 'Parking Slot Number',
        request_valet: 'Request Valet',
        requested: 'Requested',
        book: 'Book',
        book_a_treatment: 'Book a Treatment',
        book_for_your_room: 'Book for your room',
        spa_menu: 'Spa Menu',
        order_to_your_table: 'Order to your table',
        menu: 'Menu',
        order_food_and_drinks: 'Order food and drinks',
        order_to_your_pool_bed: 'Order to your pool bed',
        make_a_reservation: 'Make A Reservation',
        bookings: 'Bookings',
        table_selection: 'Table Selection',
        booking_from: 'Booking From',
        booking_until: 'Booking Until',
        book_now: 'Book Now',
        wakeup_call_requested: 'Wake up call requested!',
        rejected: 'Rejected',
        valet_parking_requested: 'Valet parking requested!',
        reservations: 'Reservations',
        no_items_found: 'No Items Found',
        no_orders_yet: 'No Orders Yet',
        my_bookings: 'My Bookings',
        opening_timings: 'Opening Timings',
        you_have_no_cars_parked_in_the_valet_please_ask_your_valet_or_concierge_to_register_your_car_within_the_application:
            'You have no cars parked in the valet, please ask your valet or concierge to register your car within the application.',
        lostAndFound: 'Lost And Found',
        quick_checkout: 'Quick Check Out',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirm Passord',
        name: 'Name',
        enter_your_name: 'Enter your name',
        enter_your_phone_number: 'Enter your phone number',
        enter_your_email: 'Enter your email',
        description: 'Description',
        what_you_have_lost_or_found: 'What you have lost or found',
        vat: 'VAT',
        service_charges: 'Service Charges',
        pay_by_cash: 'Pay by cash',
        pay_by_credit_card: 'Pay by credit card',
        pay_now: 'Pay Now',
        are_you_sure_you_want_to_pay_by_cash: 'Are you sure you want to pay by cash?',
        card_details: 'Card Details',
        card_holder_name: 'Card Holder Name',
        card_number: 'Card Number',
        payment: 'Payment',
        choose_a_password: 'Choose a password',
        confirmation: 'Confirmation',
        enter_card_holder_name: 'Enter Card Holder Name',
        enter_card_number: 'Enter Card Number',
        enter_card_expiry_date: 'Enter Card Expiry Date',
        minimum_six_characters: 'Minimum 6 characters',
        re_enter_your_password: 'Re-enter your password',
        name_must_be_atleast_two_characters: 'Name must be at least 2 characters',
        phone_number_must_be_atleast_seven_digits: 'Phone number must be atleast 7 digits',
        phone_number_should_consist_of_numbers_only: 'Phone Number should consist of numbers only',
        please_enter_a_valid_email: 'Please enter a valid email',
        message_cannot_be_empty: 'Message can not be empty',
        write_anything_about_this_order: 'Write anything about this order...',
        write_anything_about_this_order_item: 'Write anything about this order item...',
        order_note: 'Order Note',
        now: 'Now',
        specific_time: 'Specific Time',
        table_no: 'Table No',
        select_date: 'Select Date',
        select_a_table_number: 'Select a table number',
        anything_to_add: 'Anything to add',
        plese_select_your_booking_time: 'Please select your booking time',
        plese_select_your_booking_date: 'Please select your booking Date',
        number_of_people_must_be_greater_than_zero: 'Number of people must be greater than 0',
        please_select_the_table_number: 'Please select the table number',
        passord_and_confirm_password_do_not_match: 'Password and confirm password do not match',
        log_out: 'log out',
    },
    isCheckedIn: false,
    status: 'pending',
    code: 'BGK',
    primaryColor: '#083553',
};

let Data = [
    {
        id: 1,
    },
    {
        id: 2,
    },
    {
        id: 3,
    },
];

export interface ISpaOrderRoomServiceAllItemsProps extends IOrderRoomServicAllItemseReduxProps {
    componentId: string;
    spa: any;
}
interface ISelectedItems extends IOrderItem {
    name: string;
}
interface ISpaOrderRoomServicAllItemseState {
    items: ISelectedItems[];
    selectedItem: ISelectedItems;
    loadingGet: boolean;
    loading: boolean;
    selectedVal: any;
    dataToShow: any;
    search: boolean;
    newArray: any;
    check: boolean;
    modalVisible: boolean;
    modalVisible1: boolean;
    imageUrl: String;
    description: any;
    dishName: String;
    item: any;
    visible: boolean;
    text: string;
    total_price: string;
    expandImageModal: boolean;
    catIndex: number;
    categories: any;
    treatments: any;
    paymentType: string;
    selectedIndex: number;
    type: string;
    tipAlert: boolean;
    tipModal: boolean;
    holderName: string;
    cardNumber: string;
    cardAddress: string;
    expiryDate: string;
    cvv: string;
    date: string;
    time: string;
    cardSave: boolean;
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

class SpaOrderRoomServiceAllItems extends React.Component<
    ISpaOrderRoomServiceAllItemsProps,
    ISpaOrderRoomServicAllItemseState
> {
    private _modalNoteOrderItem = React.createRef<CustomModal>();
    private _modalPaymentFormModal = React.createRef<CustomModal>();
    private _modalPaymentType = React.createRef<CustomModal>();
    private _modalProcessCompleteModal = React.createRef<CustomModal>();

    private _modalConfirm = React.createRef<CustomModal>();
    private _modalDatePicker = React.createRef<CustomModal>();
    private _modalTimePicker = React.createRef<CustomModal>();
    private menuRef = createRef();
    private dropDownRef = createRef();
    private flatlistRef = React.createRef();

    constructor(props: ISpaOrderRoomServiceAllItemsProps) {
        super(props);
        this.state = {
            items: [],
            catIndex: 0,
            selectedItem: {
                id: 0,
                qty: 0,
                note: '',
                name: '',
                rate: 0,
            },
            loadingGet: false,
            loading: false,
            selectedVal: '',
            dataToShow: this.props.dishesCategories,
            search: false,
            newArray: [],
            check: true,
            modalVisible: false,
            modalVisible1: false,
            imageUrl: '',
            description: '',
            dishName: '',
            item: [],
            visible: false,
            text: '',
            total_price: '',
            expandImageModal: false,
            categories: [],
            treatments: [],
            paymentType: '',
            selectedIndex: 0,
            type: '0',
            tipAlert: false,
            tipModal: false,
            holderName: props?.card?.cardholder_name || '',
            cardNumber: props?.card?.card_number_full || '',
            cardAddress: props?.card?.card_address || '',
            expiryDate: props?.card?.card_expiry_date || '',
            cvv: props?.card?.card_cvv_number || '',
            date: '',
            time: '',
            cardSave: false,
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
                backgroundColor: this.props.icon.spa_color,
                style: 'light',
            },
        });
        this._fetch = this._fetch.bind(this);
        this._handleBack = this._handleBack.bind(this);
        this._handleModalNoteOrderItem = this._handleModalNoteOrderItem.bind(this);
        this._onChangeText = this._onChangeText.bind(this);
        this._addTotalDish = this._addTotalDish.bind(this);
        this._substractTotalDish = this._substractTotalDish.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderListHeaderComponent = this._renderListHeaderComponent.bind(this);
        this._renderItemSeparatorComponent = this._renderItemSeparatorComponent.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderSectionHeader = this._renderSectionHeader.bind(this);
        this._renderSectionFooter = this._renderSectionFooter.bind(this);
        this.proceed_to_card = this.proceed_to_card.bind(this);
        this._handleModalDatePicker = this._handleModalDatePicker.bind(this);
        this._handleSearch = this._handleSearch.bind(this);
        this.scanCard = this.scanCard.bind(this);
        this._handleOrderRoomService = this._handleOrderRoomService.bind(this);
    }

    setModalVisible(visible: boolean) {
        this.setState({ modalVisible: visible });
    }
    setModalVisible1(visible: boolean) {
        this.setState({ modalVisible1: visible });
    }

    _handleModalBack() {
        this._modalPaymentFormModal.current?.hide();
    }

    _handleOrderRoomService({
        paymentType: paymentType,
        now: now,
        date: date,
        time: time,
        tip: tip,
        notes: notes,
        cvv: cvv,
        expiryDate: expiryDate,
        cardNumber: cardNumber,
        cardAddress: cardAddress,
        holderName: holderName,
        saveCards: saveCards,
    }) {
        const { items } = this.state;
        // console.log(this.state)
        // if (isTip) {
        return new Promise((resolve, reject) => {
            this.props.orderRoomSpa(
                {
                    spa_id: this.props.spa.id,
                    treatments: items,
                    number_people: items.length,
                    date: date,
                    time: time,
                    currency: this.props.currency,
                    booking_type: 'normal_reservation',
                    card_number: cardNumber,
                    card_expiry_month: expiryDate,
                    card_cvv_number: cvv,
                    cardholder_name: holderName,
                    is_card_save: saveCards,
                    type: paymentType,
                    notes: notes,
                    tip: tip,
                },
                () => {
                    this.setState({ loading: false });
                    this.setState({
                        tipModal: false,
                        tipAlert: false,
                    });
                    this._modalProcessCompleteModal.current?.show();
                    resolve(true);
                },
                () => {
                    this.setState({ loading: false });
                    reject(false);
                    setTimeout(() => {
                        this.setState({
                            tipModal: false,
                            tipAlert: false,
                        });
                    }, 500);
                },
            );
        });
        // console.log("spaaaaaaaaaaaaaaaaa", this.props.spa)
        // if (this.state.paymentType == 'cash') {
        // this.setState({ loading: true });
        // console.log(this.props)
        // const { tip, note, date, time, items } = this.state;
        //     this.props.orderRoomSpa(
        //         {
        //         spa_id : this.props.spa.id,
        //         treatments : items,
        //         number_people : items.length,
        //         date : date,
        //         time : time,
        //         currency : this.props.currency,
        //         booking_type : 'normal_reservation',
        //         card_number : this.state.cardNumber,
        //         card_expiry_month : this.state.expiryDate,
        //         card_cvv_number : this.state.cvv,
        //         cardholder_name : this.state.holderName,
        //         is_card_save : this.state.cardSave,
        //         type : this.state.paymentType,
        //         },
        //         () => {
        //             this.setState({ loading: false });
        //             setTimeout(() => {
        //                 this.setState({
        //                     tipModal: false,
        //                 });
        //             }, 500);
        //             this._modalProcessCompleteModal.current?.show()
        //         },
        //         () => {
        //             this.setState({ loading: false });
        //             setTimeout(() => {
        //                 this.setState({
        //                     tipModal: false,
        //                 });
        //             }, 500);
        //         },
        //     );
        // }
        // else {
        //     if (
        //         this.state.cardNumber == '' ||
        //         this.state.cardAddress == '' ||
        //         this.state.cvv == '' ||
        //         this.state.holderName == '' || this.state.expiryDate == ''
        //     ) {
        //         toast('Please enter credit card details', 'Error');
        //     } else {
        //     this.setState({ loading: true });
        // console.log(this.props)
        // const { tip, note, date, time, items } = this.state;
        //     this.props.orderRoomSpa(
        //         {
        //         spa_id : this.props.spa.id,
        //         treatments : items,
        //         number_people : items.length,
        //         date : date,
        //         time : time,
        //         currency : this.props.currency,
        //         booking_type : 'normal_reservation',
        //         card_number : this.state.cardNumber,
        //         card_expiry_month : this.state.expiryDate,
        //         card_cvv_number : this.state.cvv,
        //         cardholder_name : this.state.holderName,
        //         is_card_save : this.state.cardSave,
        //         type : this.state.paymentType,
        //         },
        //         () => {
        //             this.setState({ loading: false });
        //             setTimeout(() => {
        //                 this.setState({
        //                     tipModal: false,
        //                 });
        //             }, 500);
        //             this._modalProcessCompleteModal.current?.show()
        //         },
        //         () => {
        //             this.setState({ loading: false });
        //             setTimeout(() => {
        //                 this.setState({
        //                     tipModal: false,
        //                 });
        //             }, 500);
        //         },
        //     );
        //     }
        // }
    }

    scanCard() {
        Keyboard.dismiss();
        Cardscan.isSupportedAsync().then((supported) => {
            console.log(supported);
            if (supported) {
                Cardscan.scan().then(({ action, payload, canceled_reason }) => {
                    console.log('fffffffffffffffffff vvvvvvvvvvvvvvvvvvvv', Cardscan);
                    if (action === 'scanned') {
                        console.log(payload);
                        const { number, expiryMonth, expiryYear, issuer, cardholderName } = payload;
                        console.log(number, cardholderName, issuer, expiryYear);
                        if (number) {
                            console.log(number, expiryYear, expiryMonth, cardholderName);
                            this.setState({
                                cardNumber: number,
                                holderName: cardholderName,
                                expiryDate: expiryMonth
                                    ? `${padStart(expiryMonth.toString(), 2, '0')}/${expiryYear
                                          .toString()
                                          .substr(2)}`
                                    : '',
                            });
                            this._modalPaymentFormModal.current?.show();
                        } else {
                            this._modalPaymentFormModal.current?.show();
                        }
                        console.log(
                            'number   ',
                            number + ' name      ',
                            cardholderName + 'expiry   ' + expiryMonth + '       ' + expiryYear,
                        );
                        // Display information
                    } else if (action === 'canceled') {
                        // console.log(Cardscan.getConstants())
                        if (canceled_reason === 'enter_card_manually') {
                            console.log(canceled_reason);
                            // the user elected to enter a card manually
                        } else if (canceled_reason === 'camera_error') {
                            console.log(canceled_reason);
                            // there was an error with the camera
                        } else if (canceled_reason === 'fatal_error') {
                            console.log(canceled_reason);
                            // there was an error during the scan
                        } else if (canceled_reason === 'user_canceled') {
                            console.log(canceled_reason);
                            // the user canceled the scan
                        } else {
                            console.log(action);
                            // this._modalManualData.current?.show();
                        }
                    } else if (action === 'skipped') {
                        console.log(canceled_reason);
                        // User skipped
                    } else if (action === 'unknown') {
                        console.log(canceled_reason);
                        // Unknown reason for scan canceled
                    }
                });
            } else {
                console.log('nottttttttt supporteddddddddddddddddd', supported);
            }
        });
    }

    componentDidMount() {
        this.setState({
            chainData: this.props.chainData,
        });
        console.log(this.props.spa);
        this._fetch();
    }
    componentDidUpdate() {
        if (this.state.check) {
            this.props.dishesCategories.map((data: any) => {
                if (data.data) {
                    data.data.map((data1: any) => {
                        this.state.newArray.push(data1);
                    });
                }
            });
            if (this.props.dishesCategories.length != 0) {
                this.setState({
                    check: false,
                });
            }
        }
    }

    _fetch() {
        this.setState({ loadingGet: true });
        this.props.getSpaAllTreatments(
            this.props.spa.id,
            (res) => {
                console.log('DATAXX', res);
                this.setState({
                    treatments: res.treatments,
                    loadingGet: false,
                });
                console.log('spa is success');
            },
            () => {
                console.log('spa is failed');
            },
        );
        console.log('CategoriesXX', this.props.categories);
        console.log('TREATMENTSXX', this.props.treatments);
    }

    _handleBack() {
        Navigation.pop(this.props.componentId);
    }

    proceed_to_card(charges) {
        console.log(this.props.spa);
        console.log('Pushed');
        // Navigation.push(
        //             this.props.componentId,
        //             requestItems,

        //         );

        if (this._isLockFeature()) {
            return false;
        }
        if (this.state.items.length) {
            Navigation.push(
                this.props.componentId,
                PaymentDetailScreen({
                    backGround: false,
                    orderItems: this._handleOrderRoomService,
                    currency: this.props.currency,
                    charges: charges,
                    vat: this.props.vat,
                    backgroundColor: this.props.icon.spa_color,
                    selectedLanguage: this.props.selectedLanguage,
                    holderName: this.state.holderName,
                    cardNumber: this.state.cardNumber,
                    cardAddress: this.state.cardAddress,
                    cardExpiryDate: this.state.expiryDate,
                    cvv: this.state.cvv,
                }),
            );
        } else {
            this.setState({
                text: this.props.selectedLanguage.please_select_atleast_one_item,
                visible: true,
            });
        }

        // this._modalPaymentFormModal.current?.show()

        // if (this.state.items.length) {
        //     Navigation.push(
        //         this.props.componentId,
        //         mycard({
        //             items: this.state.items,
        //             id: this.props.restaurant.id,
        //             _substractTotalDish: this._substractTotalDish,
        //             _addTotalDish: this._addTotalDish,
        //             restaurant: this.props.restaurant,
        //         }),
        //     );
        // } else {
        //     this.setState({
        //         text: this.props.selectedLanguage.please_select_at_least_one_item,
        //         visible: true,
        //     });
        // }
    }

    _onChangeTime(date: Date) {
        this.setState((prevState) => {
            if (prevState.time) {
                return {
                    ...prevState,
                    time: date.toString(),
                };
            }

            return {
                ...prevState,
                time: date.toString(),
            };
        });
        // Alert.alert(date.toString())
    }

    _onChangeDate(date: Date) {
        this.setState((prevState) => {
            if (prevState.date) {
                return {
                    ...prevState,
                    date: date.toString(),
                };
            }

            return {
                ...prevState,
                date: date.toString(),
            };
        });
    }

    toggleModal = () => {
        this.setState({
            visible: false,
        });
    };

    _handleModalNoteOrderItem(item: IDish | null, closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalNoteOrderItem.current) {
                if (closeModal) {
                    this.setState(
                        (prevState) => ({
                            items: prevState.items.map((dish) => {
                                if (dish.id === prevState.selectedItem.id) {
                                    return {
                                        ...dish,
                                        note: prevState.selectedItem.note,
                                    };
                                }

                                return dish;
                            }),
                        }),
                        this._modalNoteOrderItem.current.hide,
                    );
                } else {
                    const selected = find(this.state.items, { id: item ? item.id : 0 });
                    this.setState(
                        { selectedItem: selected ? selected : this.state.selectedItem },
                        this._modalNoteOrderItem.current.show,
                    );
                }
            }
        };
    }

    _handleModalTimePicker(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            if (this._modalTimePicker.current) {
                if (closeModal) {
                    this._modalTimePicker.current.hide();
                    if (
                        this.state.date != undefined ||
                        this.state.date != null ||
                        this.state.date != '' ||
                        this.state.time != undefined ||
                        this.state.time != null ||
                        this.state.time != ''
                    ) {
                        console.log('here');
                        this.setState({
                            tipModal: false,
                        });
                        setTimeout(() => {
                            this.setState({ tipAlert: true });
                        }, 500);
                    } else {
                        toast(this.props.selectedLanguage.please_select_the_correct);
                    }
                } else {
                    this._modalTimePicker.current.show();
                    this.setState({ time: new Date().toString() });
                }
            }
        };
    }

    _onChangeText(text: string) {
        this.setState((prevState) => ({
            selectedItem: {
                ...prevState.selectedItem,
                note: text,
            },
        }));
    }

    _addTotalDish(item: IDish, from: boolean) {
        const index = findIndex(this.state.items, { id: from ? item.id : item.id });
        if (index < 0) {
            this.setState((prevState) => ({
                items: [
                    ...prevState.items,
                    {
                        id: item.id,
                        qty: 1,
                        note: '',
                        name: item.name,
                        rate: Number(item.price),
                    },
                ],
            }));
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((dish) => {
                    if (from) {
                        if (dish.id === item.id) {
                            return {
                                ...dish,
                                qty: dish.qty + 1,
                            };
                        }
                    } else {
                        if (dish.id === item.id) {
                            return {
                                ...dish,
                                qty: dish.qty + 1,
                            };
                        }
                    }
                    return dish;
                }),
            }));
        }
    }

    _substractTotalDish(item: IDish, from: boolean) {
        const selected = find(this.state.items, { id: from ? item.id : item.id });
        if (selected && selected.qty <= 1) {
            if (from) {
                this.setState((prevState) => ({
                    items: prevState.items.filter(({ id }) => id !== item.id),
                }));
            } else {
                this.setState((prevState) => ({
                    items: prevState.items.filter(({ id }) => id !== item.id),
                }));
            }
        } else {
            this.setState((prevState) => ({
                items: prevState.items.map((dish) => {
                    if (from) {
                        if (dish.id === item.id) {
                            return {
                                ...dish,
                                qty: dish.qty - 1,
                            };
                        }
                    } else {
                        if (dish.id === item.id) {
                            return {
                                ...dish,
                                qty: dish.qty - 1,
                            };
                        }
                    }
                    return dish;
                }),
            }));
        }
    }

    _keyExtractor(item: ICategoryDish, index: number) {
        return `${item.name}_${index}`;
    }

    _renderListHeaderComponent() {
        return <View style={{ height: scale.w(30) }} />;
    }

    _renderItemSeparatorComponent() {
        return <View style={{ height: scale.w(0) }} />;
    }

    _handleModalDatePicker(closeModal?: boolean) {
        return () => {
            Keyboard.dismiss();
            this.setState({
                loading: false,
            });
            if (this._modalDatePicker.current) {
                if (closeModal) {
                    this._modalConfirm.current?.hide();
                    this._modalDatePicker.current.hide();
                    if (this.state.date != undefined && this.state.date != null && this.state.date != '') {
                        setTimeout(() => {
                            this._modalTimePicker.current?.show();
                        }, 500);
                    }
                } else {
                    this._modalConfirm.current?.hide();
                    setTimeout(() => {
                        if (this._modalDatePicker.current) this._modalDatePicker.current.show();
                    }, 500);
                    this.setState({ date: new Date().toString() });
                    // this._handleModalTimePicker(true)
                }
            }
        };
    }

    _renderItem({ item }: { item: IDish }) {
        const selected = find(this.state.items, { id: item.id });
        const { color, currency } = this.props;
        return (
            <>
                <View
                    style={{
                        borderRadius: scale.w(20),
                        backgroundColor: '#fff',
                        width: wp(44.5),
                        marginTop: 10,
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,
                            },
                            android: {
                                elevation: 8,
                            },
                        }),
                    }}
                >
                    <TouchableOpacity
                        // onPress={() => {
                        //     this.setState({
                        //         imageUrl: item.image,
                        //         description: item.description,
                        //         dishName: item.name,
                        //         item: item,
                        //     });
                        //     this.setModalVisible(true);
                        // }}
                        activeOpacity={1}
                        // style={{
                        //     flexDirection: 'row',
                        // }}
                    >
                        <Image
                            resizeMode={'cover'}
                            source={{ uri: item.image }}
                            style={{
                                width: wp(44.5),
                                height: 120,
                                borderTopLeftRadius: scale.w(10),
                                borderTopRightRadius: scale.w(10),
                            }}
                        />
                        <View style={{ paddingVertical: 10, paddingHorizontal: 5 }}>
                            <Text style={{ fontSize: scale.w(16), width: wp(43) }}>
                                {item.name
                                    ? item.name.length > 19
                                        ? item.name.substring(0, 18) + '...'
                                        : item.name
                                    : null}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingVertical: 5,
                                }}
                            >
                                <View
                                    style={{
                                        paddingHorizontal: 15,
                                        paddingVertical: 5,
                                        backgroundColor: colors.BUTTON_GREY,
                                        borderRadius: 15,
                                    }}
                                >
                                    <Text style={{ fontSize: scale.w(12), color: colors.WHITE }}>
                                        {'Main'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={debounce(this._handleModalNoteOrderItem(item, false), 1000, {
                                        leading: true,
                                        trailing: false,
                                    })}
                                    activeOpacity={0.7}
                                    style={{ alignSelf: 'center' }}
                                >
                                    <Text style={{ fontSize: scale.w(15), opacity: 0.4 }}>Add Note</Text>
                                </TouchableOpacity>
                            </View>
                            {/* {`${item.description}` != 'null' &&
                                `${item.description}` != undefined &&
                                `${item.description}` != null && (
                                    <View>
                                        <H4 fontSize={scale.w(12)}>
                                            {item.description
                                                ? item.description.length > 40
                                                    ? item.description.substring(0, 40) + '...'
                                                    : item.description
                                                : null}
                                        </H4>
                                    </View>
                                )} */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text style={{ fontSize: scale.w(14) }}>
                                    {`${currency}${numeral(item.price).format('0,0a').toUpperCase()}`}
                                </Text>
                                {/* <View style={{ width: 5 }} /> */}

                                {/* {selected ? ( */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        borderWidth: 1,
                                        borderRadius: scale.w(8),
                                        borderColor: color || colors.BROWN,
                                        paddingHorizontal: scale.w(5),
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        // width : wp(15),
                                        // flex: 1,
                                        paddingVertical: hp(0.2),
                                    }}
                                >
                                    <TouchableOpacity
                                        disabled={selected && selected.qty == 0 ? true : false}
                                        onPress={() => this._substractTotalDish(item, true)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="md-remove" color={colors.GREY} size={scale.w(18)} />
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginHorizontal: 5,
                                        }}
                                    >
                                        <H4 fontSize={scale.w(14)}>{selected ? selected.qty : 0}</H4>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this._addTotalDish(item, true)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="md-add" color={colors.GREY} size={scale.w(18)} />
                                    </TouchableOpacity>
                                </View>
                                {/* ) : (
                            <TouchableOpacity
                                onPress={() => this._addTotalDish(item, true)}
                                activeOpacity={0.7}
                                style={{
                                    flex: 1,
                                    width: '80%',
                                    flexDirection: 'row',
                                    paddingVertical: hp(0.2),
                                }}
                            >
                                <View style={{ flex: 0.3 }}></View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        borderWidth: 1,
                                        borderRadius: scale.w(8),
                                        borderColor: color || colors.BROWN,
                                        flex: 0.7,
                                        paddingHorizontal: scale.w(10),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <H4>{this.props.selectedLanguage.add}</H4>
                                    </View>
                                    <Ionicons
                                        name="md-add"
                                        color={color || colors.BROWN}
                                        size={scale.w(22)}
                                    />
                                </View>
                            </TouchableOpacity>
                        )} */}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    _renderSectionHeader({ section: { title } }: { section: any }) {
        return (
            <View
                style={{
                    paddingLeft: scale.w(20),
                    paddingBottom: scale.h(15),
                    backgroundColor: '#fff',
                }}
            >
                <H2 fontSize={scale.w(20)}>{title}</H2>
            </View>
        );
    }

    _renderSectionFooter() {
        return <View style={{ height: hp(10) }} />;
    }

    Search(val: any) {
        if (val === '') {
            this.setState({ search: false, dataToShow: this.props.dishesCategories });
        } else {
            let arr = this.state.newArray.filter((x: any) => {
                return x.name.toLowerCase().includes(val.toLowerCase());
            });
            this.setState({ dataToShow: arr, search: true });
        }
    }

    _handleSearch() {
        console.log('Search Icon clicked');
    }

    _isLockFeature(feature?: keyof IFeatureHotel) {
        console.log('is checked innnnnn          ', this.props.isCheckedIn);
        console.log('=======feature', feature);
        if (feature !== 'is_check_in_enabled' && !this.props.isCheckedIn) {
            this.setState({
                text: this.props.selectedLanguage.please_check_in_first_to_use_this_service,
                visible: true,
            });
            return true;
        }
        if (feature !== 'is_check_in_enabled' && this.props.status === 'pending') {
            this.setState({
                text: this.props.selectedLanguage
                    .to_use_this_feature_your_check_in_must_be_accepted_by_hotel_admin,
                visible: true,
            });
            return true;
        }
        return false;
    }

    render() {
        const { color, currency } = this.props;
        const { restaurant, proceed_to_card } = this.props.selectedLanguage;
        console.log(JSON.stringify(this.props));
        var total_price = 0;
        this.state.items.map((dish) => {
            let row_price = dish.rate * dish.qty;
            total_price = total_price + row_price;
        });
        console.log(this.state.categories, this.state.treatments);
        if (!this.state.treatments) {
            return null;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Modal
                        onBackdropPress={() => {
                            this.setModalVisible(false);
                        }}
                        animationType="slide"
                        animationInTiming={500}
                        backdropOpacity={0.7}
                        onSwipeComplete={() => this.setState({ modalVisible: false })}
                        isVisible={this.state.modalVisible}
                        onBackButtonPress={() => {
                            this.setModalVisible(false);
                        }}
                        style={
                            Platform.OS == 'ios' && scale.isIphoneX()
                                ? {
                                      paddingVertical: scale.h(45),
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
                                    borderRadius: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: wp(3),
                                }}
                            >
                                <View style={{ height: hp(4) }} />

                                <H3 fontSize={scale.w(20)}>{this.state.dishName}</H3>

                                {this.state.imageUrl && <View style={{ height: hp(1) }} />}
                                {this.state.imageUrl &&
                                    this.state.imageUrl != 'https://cms.servrhotels.com/images/default.jpg' &&
                                    this.state.imageUrl !=
                                        'http://cms.servrhotels.com/images/default.jpg' && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setTimeout(() => {
                                                    this.setModalVisible1(true);
                                                }, 400);
                                                this.setModalVisible(false);
                                            }}
                                            style={{
                                                height: hp(20),
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
                                    <H4 fontSize={scale.w(12)}>{this.state.description}</H4>
                                )}

                                {this.state.description && <View style={{ height: hp(6) }} />}
                                <TouchableOpacity
                                    onPress={() => {
                                        this._addTotalDish(this.state.item);
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
                                            fontSize: scale.w(14),
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
                                    style={{ width: scale.w(30), height: scale.w(30) }}
                                    resizeMode={'contain'}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    <View style={{ flex: 1 }}>
                        {Platform.OS === 'ios' && (
                            <View
                                style={{
                                    width: '100%',
                                    height: heightPercentageToDP(9), // For all devices, even X, XS Max
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
                                    RightIconColor={colors.WHITE}
                                    RightIconName={'search'}
                                    onSearchClick={this._handleSearch}
                                    tintBackColor={colors.WHITE}
                                    titleColor={colors.WHITE}
                                    onClick={this._handleBack}
                                    title={this.props.selectedLanguage.spa_menu}
                                />
                                {/* </ImageBackground> */}
                            </View>
                            <View
                                style={{
                                    height: heightPercentageToDP(90),
                                    width: widthPercentageToDP(100),
                                    backgroundColor: colors.WHITE,
                                    top: -heightPercentageToDP(4.3),
                                    borderTopLeftRadius: scale.w(3.5),
                                    borderTopRightRadius: scale.w(3.5),
                                    paddingTop: heightPercentageToDP(0.75),
                                }}
                            >
                                {this.state.search == false ? (
                                    <>
                                        <View style={{ paddingHorizontal: wp(5) }}>
                                            <FlatList
                                                data={this.props.treatments ? this.props.treatments : []}
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <DropShadow
                                                            style={{
                                                                shadowOffset: {
                                                                    width: 0,
                                                                    height: 2,
                                                                },
                                                                shadowColor: colors.BLACK,
                                                                shadowOpacity: 0.08,
                                                                shadowRadius: 48,
                                                                paddingTop: heightPercentageToDP(4.5),
                                                                paddingBottom: heightPercentageToDP(2),
                                                            }}
                                                        >
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    this.flatlistRef.scrollToIndex({
                                                                        animated: true,
                                                                        index: index,
                                                                    });
                                                                    this.setState({
                                                                        catIndex: index,
                                                                    });
                                                                }}
                                                                style={{
                                                                    backgroundColor:
                                                                        this.state.catIndex == index
                                                                            ? this.props.icon.spa_color
                                                                            : colors.WHITE,
                                                                    paddingHorizontal: wp(7),
                                                                    borderRadius: scale.w(5),
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    height: heightPercentageToDP(4),
                                                                    marginLeft: index != 0 ? wp(3) : 0,
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: scale.w(1.4),
                                                                        color:
                                                                            this.state.catIndex == index
                                                                                ? colors.WHITE
                                                                                : colors.DARK_GREY,
                                                                        letterSpacing: 0.85,
                                                                    }}
                                                                >
                                                                    {item.name
                                                                        ? item.name.length > 12
                                                                            ? item.name.substring(0, 12) +
                                                                              '...'
                                                                            : item.name
                                                                        : null}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </DropShadow>
                                                    );
                                                }}
                                            />
                                        </View>
                                        {this.props.treatments && (
                                            <FlatList
                                                ref={(ref) => {
                                                    this.flatlistRef = ref;
                                                }}
                                                refreshControl={
                                                    <RefreshControl
                                                        onRefresh={this._fetch}
                                                        refreshing={false}
                                                    />
                                                }
                                                data={this.props.treatments}
                                                ListEmptyComponent={() => {
                                                    return (
                                                        <View
                                                            style={{
                                                                height: hp(70),
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            {this.state.loadingGet ? (
                                                                <View
                                                                    style={{
                                                                        width: widthPercentageToDP(100),
                                                                        height: heightPercentageToDP(80),
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <Image
                                                                        resizeMode="contain"
                                                                        style={{
                                                                            width: widthPercentageToDP(30),
                                                                            tintColor:
                                                                                this.props.icon.spa_color,
                                                                            //tintColor: this.props.icon.spa_color
                                                                        }}
                                                                        source={{
                                                                            uri: this.state.chainData.data
                                                                                .logo_gif_dark,
                                                                        }}
                                                                        indicator={<ActivityIndicator />}
                                                                        resizeMode={'cover'}
                                                                        indicatorProps={{
                                                                            size: 20,
                                                                            borderWidth: 0,
                                                                            color: 'rgba(150, 150, 150, 1)',
                                                                            unfilledColor:
                                                                                'rgba(200, 200, 200, 0.2)',
                                                                        }}
                                                                    />
                                                                </View>
                                                            ) : (
                                                                <View
                                                                    style={{
                                                                        width: widthPercentageToDP(90),
                                                                        height: heightPercentageToDP(80),
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <Text style={{ alignSelf: 'center' }}>
                                                                        {
                                                                            this.props.selectedLanguage
                                                                                .no_items_found
                                                                        }
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                    );
                                                }}
                                                renderItem={({ item, index }) => {
                                                    let MyItem = item;
                                                    if (item.treatments)
                                                        return (
                                                            <View
                                                                style={{
                                                                    paddingHorizontal: wp(5),
                                                                    marginBottom:
                                                                        index ==
                                                                        this.state.treatments.length - 1
                                                                            ? hp(10)
                                                                            : 0,
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        // backgroundColor: '#fff',
                                                                        paddingTop: hp(1),
                                                                    }}
                                                                >
                                                                    <H2
                                                                        fontFamily="Harabara"
                                                                        fontSize={scale.w(2.2)}
                                                                    >
                                                                        {item.name
                                                                            ? item.name.length > 30
                                                                                ? item.name.substring(0, 30) +
                                                                                  '...'
                                                                                : item.name
                                                                            : null}
                                                                    </H2>
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'space-between',
                                                                        flexWrap: 'wrap',
                                                                        width: wp(90),
                                                                        alignSelf: 'center',
                                                                    }}
                                                                >
                                                                    {item.treatments &&
                                                                        item.treatments.map((data, i) => {
                                                                            const selected = find(
                                                                                this.state.items,
                                                                                {
                                                                                    id: data.id,
                                                                                },
                                                                            );
                                                                            const { color, currency } =
                                                                                this.props;
                                                                            return (
                                                                                <>
                                                                                    <DropShadow
                                                                                        style={{
                                                                                            shadowOffset: {
                                                                                                width: 0,
                                                                                                height: 10,
                                                                                            },
                                                                                            shadowColor:
                                                                                                colors.EXPERIENCE_SCREEN_BOX_SHADOW,
                                                                                            shadowOpacity: 0.39,
                                                                                            shadowRadius: 28,
                                                                                            borderRadius:
                                                                                                scale.w(5),
                                                                                            paddingTop:
                                                                                                heightPercentageToDP(
                                                                                                    2,
                                                                                                ),
                                                                                        }}
                                                                                    >
                                                                                        <View
                                                                                            style={{
                                                                                                borderRadius:
                                                                                                    scale.w(
                                                                                                        2.5,
                                                                                                    ),
                                                                                                backgroundColor:
                                                                                                    '#fff',
                                                                                                width: wp(43),
                                                                                            }}
                                                                                        >
                                                                                            <TouchableOpacity
                                                                                                // onPress={() => {
                                                                                                //     // this.setState({
                                                                                                //     //     imageUrl: data.image,
                                                                                                //     //     description:
                                                                                                //     //         data.description,
                                                                                                //     //     dishName: data.name,
                                                                                                //     //     item: data,
                                                                                                //     // });
                                                                                                //     // this.setModalVisible(true);
                                                                                                //     // Navigation.push(
                                                                                                //     //     this.props.componentId,
                                                                                                //     //     spaservicedetail,
                                                                                                //     // );
                                                                                                //     console.log('clicked')
                                                                                                // }}
                                                                                                activeOpacity={
                                                                                                    1
                                                                                                }
                                                                                                // style={{
                                                                                                //     flexDirection: 'row',
                                                                                                // }}
                                                                                            >
                                                                                                {data.image ==
                                                                                                    null ||
                                                                                                data.image ==
                                                                                                    'https://cms.servrhotels.com/images/default.jpg' ? (
                                                                                                    <Image
                                                                                                        resizeMode={
                                                                                                            'cover'
                                                                                                        }
                                                                                                        source={{
                                                                                                            uri: 'https://cms.servrhotels.com/images/default.png',
                                                                                                        }}
                                                                                                        style={{
                                                                                                            width: wp(
                                                                                                                43,
                                                                                                            ),
                                                                                                            height: hp(
                                                                                                                19,
                                                                                                            ),
                                                                                                            alignSelf:
                                                                                                                'center',
                                                                                                            borderTopLeftRadius:
                                                                                                                scale.w(
                                                                                                                    2.5,
                                                                                                                ),
                                                                                                            borderTopRightRadius:
                                                                                                                scale.w(
                                                                                                                    2.5,
                                                                                                                ),
                                                                                                        }}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <Image
                                                                                                        resizeMode={
                                                                                                            'cover'
                                                                                                        }
                                                                                                        source={{
                                                                                                            uri: data.image,
                                                                                                        }}
                                                                                                        style={{
                                                                                                            width: wp(
                                                                                                                43,
                                                                                                            ),
                                                                                                            height: hp(
                                                                                                                19,
                                                                                                            ),
                                                                                                            alignSelf:
                                                                                                                'center',
                                                                                                            borderTopLeftRadius:
                                                                                                                scale.w(
                                                                                                                    2.5,
                                                                                                                ),
                                                                                                            borderTopRightRadius:
                                                                                                                scale.w(
                                                                                                                    2.5,
                                                                                                                ),
                                                                                                        }}
                                                                                                    />
                                                                                                )}
                                                                                                <View
                                                                                                    style={{
                                                                                                        paddingBottom:
                                                                                                            hp(
                                                                                                                1,
                                                                                                            ),
                                                                                                        paddingHorizontal:
                                                                                                            wp(
                                                                                                                3,
                                                                                                            ),
                                                                                                        paddingTop:
                                                                                                            hp(
                                                                                                                1,
                                                                                                            ),
                                                                                                    }}
                                                                                                >
                                                                                                    <Text
                                                                                                        style={{
                                                                                                            fontSize:
                                                                                                                scale.w(
                                                                                                                    1.78,
                                                                                                                ),
                                                                                                            width: wp(
                                                                                                                43,
                                                                                                            ),
                                                                                                            fontFamily:
                                                                                                                'Roboto-Medium',
                                                                                                        }}
                                                                                                    >
                                                                                                        {data.name
                                                                                                            ? data.name.trim()
                                                                                                                  .length >
                                                                                                              17
                                                                                                                ? data.name
                                                                                                                      .trim()
                                                                                                                      .substring(
                                                                                                                          0,
                                                                                                                          16,
                                                                                                                      ) +
                                                                                                                  '...'
                                                                                                                : data.name
                                                                                                            : null}
                                                                                                    </Text>
                                                                                                    <View
                                                                                                        style={{
                                                                                                            flexDirection:
                                                                                                                'row',
                                                                                                            justifyContent:
                                                                                                                'space-between',
                                                                                                            paddingTop:
                                                                                                                hp(
                                                                                                                    0.32,
                                                                                                                ),
                                                                                                            paddingBottom:
                                                                                                                hp(
                                                                                                                    1.3,
                                                                                                                ),
                                                                                                        }}
                                                                                                    >
                                                                                                        <View
                                                                                                            style={{
                                                                                                                paddingHorizontal:
                                                                                                                    widthPercentageToDP(
                                                                                                                        3,
                                                                                                                    ),
                                                                                                                paddingVertical:
                                                                                                                    heightPercentageToDP(
                                                                                                                        0.2,
                                                                                                                    ),
                                                                                                                backgroundColor:
                                                                                                                    colors.BUTTON_GREY,
                                                                                                                borderRadius: 15,
                                                                                                            }}
                                                                                                        >
                                                                                                            <Text
                                                                                                                style={{
                                                                                                                    fontSize:
                                                                                                                        scale.w(
                                                                                                                            1.2,
                                                                                                                        ),
                                                                                                                    color: colors.WHITE,
                                                                                                                    fontFamily:
                                                                                                                        'Roboto-Regular',
                                                                                                                }}
                                                                                                            >
                                                                                                                {data
                                                                                                                    .category_name
                                                                                                                    ?.length >
                                                                                                                7
                                                                                                                    ? data.category_name.substring(
                                                                                                                          0,
                                                                                                                          7,
                                                                                                                      ) +
                                                                                                                      '...'
                                                                                                                    : data.category_name}
                                                                                                            </Text>
                                                                                                        </View>
                                                                                                        {/* <TouchableOpacity
                                                                                        onPress={debounce(
                                                                                            this._handleModalNoteOrderItem(
                                                                                                data,
                                                                                                false,
                                                                                            ),
                                                                                            1000,
                                                                                            {
                                                                                                leading: true,
                                                                                                trailing:
                                                                                                    false,
                                                                                            },
                                                                                        )}
                                                                                        activeOpacity={0.7}
                                                                                        style={{
                                                                                            alignSelf:
                                                                                                'center',
                                                                                        }}
                                                                                    >
                                                                                        <Text
                                                                                            style={{ fontSize: scale.w(1.5), opacity: .4, fontFamily : 'Roboto-Regular'  }}
                                                                                        >
                                                                                            Add Note
                                                                                        </Text>
                                                                                    </TouchableOpacity> */}
                                                                                                    </View>
                                                                                                    {/* {`${item.description}` != 'null' &&
                                `${item.description}` != undefined &&
                                `${item.description}` != null && (
                                    <View>
                                        <H4 fontSize={scale.w(12)}>
                                            {item.description
                                                ? item.description.length > 40
                                                    ? item.description.substring(0, 40) + '...'
                                                    : item.description
                                                : null}
                                        </H4>
                                    </View>
                                )} */}
                                                                                                    <View
                                                                                                        style={{
                                                                                                            flexDirection:
                                                                                                                'row',
                                                                                                            justifyContent:
                                                                                                                'space-between',
                                                                                                        }}
                                                                                                    >
                                                                                                        <Text
                                                                                                            style={{
                                                                                                                fontSize:
                                                                                                                    scale.w(
                                                                                                                        1.85,
                                                                                                                    ),
                                                                                                                fontFamily:
                                                                                                                    'Roboto-Medium',
                                                                                                            }}
                                                                                                        >
                                                                                                            {`${currency} ${numeral(
                                                                                                                data.price,
                                                                                                            )
                                                                                                                .format(
                                                                                                                    '0,0a',
                                                                                                                )
                                                                                                                .toUpperCase()}`}
                                                                                                        </Text>
                                                                                                        {/* <View style={{ width: 5 }} /> */}

                                                                                                        {/* {selected ? ( */}
                                                                                                        <View
                                                                                                            style={{
                                                                                                                flexDirection:
                                                                                                                    'row',
                                                                                                                borderWidth: 2,
                                                                                                                borderRadius:
                                                                                                                    scale.w(
                                                                                                                        0.8,
                                                                                                                    ),
                                                                                                                borderColor:
                                                                                                                    colors.CHECKIN_AND_CHECKOUT_BORDER_COLOR,
                                                                                                                //    paddingHorizontal: scale.w(0.1),
                                                                                                                justifyContent:
                                                                                                                    'space-between',
                                                                                                                //    backgroundColor: colors.BLACK,
                                                                                                                width: wp(
                                                                                                                    15,
                                                                                                                ),
                                                                                                                alignItems:
                                                                                                                    'center',
                                                                                                                alignSelf:
                                                                                                                    'flex-end',
                                                                                                                height: heightPercentageToDP(
                                                                                                                    3.1,
                                                                                                                ),
                                                                                                                // alignItems: 'flex-end',
                                                                                                                // flex: 1,
                                                                                                                // backgroundColor: colors.RED,
                                                                                                                // paddingVertical: hp(0.5),
                                                                                                                // alignItems: 'center',
                                                                                                            }}
                                                                                                        >
                                                                                                            <TouchableOpacity
                                                                                                                disabled={
                                                                                                                    selected &&
                                                                                                                    selected.qty ==
                                                                                                                        0
                                                                                                                        ? true
                                                                                                                        : false
                                                                                                                }
                                                                                                                onPress={() =>
                                                                                                                    this._substractTotalDish(
                                                                                                                        data,
                                                                                                                        true,
                                                                                                                    )
                                                                                                                }
                                                                                                                activeOpacity={
                                                                                                                    0.7
                                                                                                                }
                                                                                                                style={{
                                                                                                                    paddingLeft:
                                                                                                                        wp(
                                                                                                                            1.5,
                                                                                                                        ),
                                                                                                                    color: '#707070',
                                                                                                                }}
                                                                                                            >
                                                                                                                <Ionicons
                                                                                                                    name="md-remove"
                                                                                                                    color={
                                                                                                                        colors.GREY
                                                                                                                    }
                                                                                                                    size={scale.w(
                                                                                                                        1.8,
                                                                                                                    )}
                                                                                                                />
                                                                                                            </TouchableOpacity>
                                                                                                            <View
                                                                                                                style={{
                                                                                                                    justifyContent:
                                                                                                                        'center',
                                                                                                                    alignItems:
                                                                                                                        'center',
                                                                                                                    marginHorizontal: 1,
                                                                                                                }}
                                                                                                            >
                                                                                                                <H4
                                                                                                                    fontFamily={
                                                                                                                        'Roboto-Bold'
                                                                                                                    }
                                                                                                                    fontSize={scale.w(
                                                                                                                        1.4,
                                                                                                                    )}
                                                                                                                >
                                                                                                                    {selected
                                                                                                                        ? selected.qty
                                                                                                                        : 0}
                                                                                                                </H4>
                                                                                                            </View>
                                                                                                            <TouchableOpacity
                                                                                                                onPress={() =>
                                                                                                                    this._addTotalDish(
                                                                                                                        data,
                                                                                                                        true,
                                                                                                                    )
                                                                                                                }
                                                                                                                activeOpacity={
                                                                                                                    0.7
                                                                                                                }
                                                                                                                style={{
                                                                                                                    paddingRight:
                                                                                                                        wp(
                                                                                                                            1.5,
                                                                                                                        ),
                                                                                                                    color: '#707070',
                                                                                                                }}
                                                                                                            >
                                                                                                                <Ionicons
                                                                                                                    name="md-add"
                                                                                                                    color={
                                                                                                                        colors.GREY
                                                                                                                    }
                                                                                                                    size={scale.w(
                                                                                                                        1.8,
                                                                                                                    )}
                                                                                                                />
                                                                                                            </TouchableOpacity>
                                                                                                        </View>
                                                                                                        {/* ) : (
                            <TouchableOpacity
                                onPress={() => this._addTotalDish(item, true)}
                                activeOpacity={0.7}
                                style={{
                                    flex: 1,
                                    width: '80%',
                                    flexDirection: 'row',
                                    paddingVertical: hp(0.2),
                                }}
                            >
                                <View style={{ flex: 0.3 }}></View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        borderWidth: 1,
                                        borderRadius: scale.w(8),
                                        borderColor: color || colors.BROWN,
                                        flex: 0.7,
                                        paddingHorizontal: scale.w(10),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <H4>{this.props.selectedLanguage.add}</H4>
                                    </View>
                                    <Ionicons
                                        name="md-add"
                                        color={color || colors.BROWN}
                                        size={scale.w(22)}
                                    />
                                </View>
                            </TouchableOpacity>
                        )} */}
                                                                                                    </View>
                                                                                                </View>
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                    </DropShadow>
                                                                                </>
                                                                            );
                                                                        })}
                                                                </View>
                                                            </View>
                                                        );
                                                }}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <FlatList
                                        refreshControl={
                                            <RefreshControl
                                                onRefresh={this._fetch}
                                                refreshing={this.state.loadingGet}
                                            />
                                        }
                                        ListEmptyComponent={() => {
                                            return (
                                                <View>
                                                    {this.state.loadingGet ? (
                                                        <ActivityIndicator size="large" color={'#fff'} />
                                                    ) : (
                                                        <View style={{ marginTop: heightPercentageToDP(20) }}>
                                                            <Text style={{ alignSelf: 'center' }}>
                                                                {this.props.selectedLanguage.no_items_found}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        }}
                                        data={this.props.treatments ? this.props.treatments : []}
                                        extraData={this.state}
                                        keyExtractor={this._keyExtractor}
                                        ListHeaderComponent={this._renderListHeaderComponent}
                                        ItemSeparatorComponent={this._renderItemSeparatorComponent}
                                        renderItem={({ item }: { item: IDish }) => {
                                            const selected = find(this.state.items, { id: item.id });
                                            const { color, currency } = this.props;
                                            return (
                                                <>
                                                    <View
                                                        style={{
                                                            borderRadius: scale.w(20),
                                                            backgroundColor: '#fff',
                                                            width: wp(44.5),
                                                            marginTop: 10,
                                                            ...Platform.select({
                                                                ios: {
                                                                    shadowColor: '#000',
                                                                    shadowOffset: { width: 0, height: 4 },
                                                                    shadowOpacity: 0.2,
                                                                    shadowRadius: 3,
                                                                },
                                                                android: {
                                                                    elevation: 8,
                                                                },
                                                            }),
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({
                                                                    imageUrl: item.image,
                                                                    description: item.description,
                                                                    dishName: item.name,
                                                                    item: item,
                                                                });
                                                                this.setModalVisible(true);
                                                            }}
                                                            // style={{
                                                            //     flexDirection: 'row',
                                                            // }}
                                                        >
                                                            <Image
                                                                resizeMode={'cover'}
                                                                source={{ uri: item.image }}
                                                                style={{
                                                                    width: wp(44.5),
                                                                    height: 120,
                                                                    borderTopLeftRadius: scale.w(10),
                                                                    borderTopRightRadius: scale.w(10),
                                                                }}
                                                            />
                                                            <View
                                                                style={{
                                                                    paddingVertical: 10,
                                                                    paddingHorizontal: 5,
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: scale.w(16),
                                                                        width: wp(43),
                                                                    }}
                                                                >
                                                                    {item.name
                                                                        ? item.name.length > 19
                                                                            ? item.name.substring(0, 18) +
                                                                              '...'
                                                                            : item.name
                                                                        : null}
                                                                </Text>
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'space-between',
                                                                        paddingVertical: 5,
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            paddingHorizontal: 15,
                                                                            paddingVertical: 5,
                                                                            backgroundColor:
                                                                                colors.BUTTON_GREY,
                                                                            borderRadius: 15,
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                fontSize: scale.w(12),
                                                                                color: colors.WHITE,
                                                                            }}
                                                                        >
                                                                            {'Main'}
                                                                        </Text>
                                                                    </View>
                                                                    <TouchableOpacity
                                                                        onPress={debounce(
                                                                            this._handleModalNoteOrderItem(
                                                                                item,
                                                                                false,
                                                                            ),
                                                                            1000,
                                                                            {
                                                                                leading: true,
                                                                                trailing: false,
                                                                            },
                                                                        )}
                                                                        activeOpacity={0.7}
                                                                        style={{ alignSelf: 'center' }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                fontSize: scale.w(15),
                                                                                opacity: 0.4,
                                                                            }}
                                                                        >
                                                                            Add Note
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                {/* {`${item.description}` != 'null' &&
                                                                    `${item.description}` != undefined &&
                                                                    `${item.description}` != null && (
                                                                        <View>
                                                                            <H4 fontSize={scale.w(12)}>
                                                                                {item.description
                                                                                    ? item.description.length > 40
                                                                                        ? item.description.substring(0, 40) + '...'
                                                                                        : item.description
                                                                                    : null}
                                                                            </H4>
                                                                        </View>
                                                                    )} */}
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'space-between',
                                                                    }}
                                                                >
                                                                    <Text style={{ fontSize: scale.w(14) }}>
                                                                        {`${currency}${numeral(item.price)
                                                                            .format('0,0a')
                                                                            .toUpperCase()}`}
                                                                    </Text>
                                                                    {/* <View style={{ width: 5 }} /> */}

                                                                    {/* {selected ? ( */}
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            borderWidth: 1,
                                                                            borderRadius: scale.w(8),
                                                                            borderColor:
                                                                                color || colors.BROWN,
                                                                            paddingHorizontal: scale.w(5),
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                            // width : wp(15),
                                                                            // flex: 1,
                                                                            paddingVertical: hp(0.2),
                                                                        }}
                                                                    >
                                                                        <TouchableOpacity
                                                                            disabled={
                                                                                selected && selected.qty == 0
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            onPress={() =>
                                                                                this._substractTotalDish(
                                                                                    item,
                                                                                    true,
                                                                                )
                                                                            }
                                                                            activeOpacity={0.7}
                                                                        >
                                                                            <Ionicons
                                                                                name="md-remove"
                                                                                color={colors.GREY}
                                                                                size={scale.w(18)}
                                                                            />
                                                                        </TouchableOpacity>
                                                                        <View
                                                                            style={{
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                marginHorizontal: 5,
                                                                            }}
                                                                        >
                                                                            <H4 fontSize={scale.w(14)}>
                                                                                {selected ? selected.qty : 0}
                                                                            </H4>
                                                                        </View>
                                                                        <TouchableOpacity
                                                                            onPress={() =>
                                                                                this._addTotalDish(item, true)
                                                                            }
                                                                            activeOpacity={0.7}
                                                                        >
                                                                            <Ionicons
                                                                                name="md-add"
                                                                                color={colors.GREY}
                                                                                size={scale.w(18)}
                                                                            />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    {/* ) : (
                                                                <TouchableOpacity
                                                                    onPress={() => this._addTotalDish(item, true)}
                                                                    activeOpacity={0.7}
                                                                    style={{
                                                                        flex: 1,
                                                                        width: '80%',
                                                                        flexDirection: 'row',
                                                                        paddingVertical: hp(0.2),
                                                                    }}
                                                                >
                                                                    <View style={{ flex: 0.3 }}></View>
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            borderWidth: 1,
                                                                            borderRadius: scale.w(8),
                                                                            borderColor: color || colors.BROWN,
                                                                            flex: 0.7,
                                                                            paddingHorizontal: scale.w(10),
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                        }}
                                                                    >
                                                                        <View
                                                                            style={{
                                                                                flex: 1,
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                            }}
                                                                        >
                                                                            <H4>{this.props.selectedLanguage.add}</H4>
                                                                        </View>
                                                                        <Ionicons
                                                                            name="md-add"
                                                                            color={color || colors.BROWN}
                                                                            size={scale.w(22)}
                                                                        />
                                                                    </View>
                                                                </TouchableOpacity>
                                                            )} */}
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </>
                                            );
                                        }}
                                        renderSectionHeader={this._renderSectionHeader}
                                        renderSectionFooter={this._renderSectionFooter}
                                        initialNumToRender={10}
                                    />
                                )}
                            </View>
                            <View
                                style={{
                                    height: Platform.OS == 'android' ? '100%' : null,
                                    bottom: Platform.OS == 'android' ? null : 0,
                                    width: '100%',
                                    justifyContent: 'flex-end',
                                    position: 'absolute',
                                }}
                            >
                                <ProceedPayment
                                    backGroundColor={this.props.icon.spa_color}
                                    price={this.props.currency + ' ' + total_price.toFixed(0)}
                                    total={this.props.selectedLanguage.total}
                                    btnText={this.props.selectedLanguage.checkout}
                                    onPress={() => this.proceed_to_card(total_price.toFixed(0))}
                                />
                            </View>
                        </RootContainer>
                    </View>

                    <CustomModal
                        ref={this._modalPaymentType}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <View
                            style={{
                                width: wp(80),
                                borderRadius: scale.w(2.5),
                                backgroundColor: colors.WHITE,
                                paddingHorizontal: wp(5),
                                alignSelf: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        paymentType: 'cash',
                                        loading: false,
                                    });
                                    this._modalConfirm.current?.show();
                                    this._modalPaymentType.current?.hide();
                                }}
                                style={{
                                    paddingVertical: hp(3),
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text style={{ fontSize: scale.w(2.2), fontFamily: 'Roboto-Bold' }}>
                                    Pay By Cash
                                </Text>
                            </TouchableOpacity>
                            <View style={{ height: 1, backgroundColor: colors.LIGHT_GREY }} />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        paymentType: 'card',
                                        loading: false,
                                    });
                                    this._modalPaymentType.current?.hide();
                                    this._modalConfirm.current?.show();
                                }}
                                style={{
                                    paddingVertical: hp(3),
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text style={{ fontSize: scale.w(2.2), fontFamily: 'Roboto-Bold' }}>
                                    Pay By Card
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </CustomModal>

                    <CustomModal
                        ref={this._modalNoteOrderItem}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <NoteOrderItem
                            value={this.state.selectedItem.note}
                            onChangeText={this._onChangeText}
                            showModal={this._handleModalNoteOrderItem(
                                this.state.itemForNote,
                                true,
                                this.state.indexForNote,
                            )}
                            title={`${this.state.selectedItem.name} Note`}
                            color={color}
                            chainData={this.props.chainData}
                            //description={"write_anything_about_this_item_order"}
                            //done={this.props.selectedLanguage.done}
                        />
                    </CustomModal>

                    {/* <AttentionModal
                        visible={this.state.visible}
                        toggleModal={this.toggleModal}
                        text={this.state.text}
                        //  attention={this.props.selectedLanguage.attention}
                        //ok={this.props.selectedLanguage.ok}
                    />

                    // <ImageExpandModal
                    //     modalVisible={this.state.expandImageModal}
                    //     Image={{ uri: 'https://picsum.photos/200/300' }}
                    //     onBack={() => this.setState({ expandImageModal: false })}
                    //     onBackDr
                    op={() => console.log('hello')}
                    // /> */}

                    <CustomModal ref={this._modalConfirm} animationIn="fadeInUp" animationOut="fadeOutDown">
                        <View
                            style={{
                                width: '100%',
                                backgroundColor: 'white',
                                borderRadius: scale.w(2.5),
                                paddingVertical: hp(2),
                            }}
                        >
                            <RadioForm animation={true}>
                                {/* To create radio buttons, loop through your array of options */}
                                {[
                                    { label: this.props.selectedLanguage.now, value: '0' },
                                    { label: this.props.selectedLanguage.specific_time, value: '1' },
                                ].map((obj, i) => (
                                    <View>
                                        <RadioButton labelHorizontal={true} key={i}>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    await this.setState({
                                                        selectedIndex: i,
                                                        type: obj.value,
                                                    });
                                                }}
                                                style={{
                                                    marginTop: hp(2),
                                                    flexDirection: 'row',
                                                    marginHorizontal: wp(2),
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: '100%',
                                                        paddingHorizontal: wp(3),
                                                        flexDirection: 'row',
                                                        paddingBottom: hp(2),
                                                        borderRadius: scale.w(2),
                                                    }}
                                                >
                                                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                                    <RadioButtonInput
                                                        obj={obj}
                                                        index={i}
                                                        isSelected={this.state.selectedIndex === i}
                                                        onPress={async () => {
                                                            await this.setState({
                                                                selectedIndex: i,
                                                                type: obj.value,
                                                            });
                                                        }}
                                                        borderWidth={1}
                                                        buttonInnerColor={colors.BLUE}
                                                        buttonOuterColor={colors.BLUE}
                                                        buttonSize={15}
                                                        buttonOuterSize={25}
                                                        buttonStyle={{}}
                                                        buttonWrapStyle={{ marginLeft: 10 }}
                                                    />
                                                    <RadioButtonLabel
                                                        obj={obj}
                                                        index={i}
                                                        labelHorizontal={true}
                                                        onPress={async () => {}}
                                                        labelStyle={{ fontSize: 20 }}
                                                        labelWrapStyle={{}}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </RadioButton>
                                        {i != 1 ? (
                                            <View
                                                style={{
                                                    height: hp(0.09),
                                                    backgroundColor: colors.ANONYMOUS1,
                                                    opacity: 0.51,
                                                    width: wp(80),
                                                    alignSelf: 'center',
                                                }}
                                            />
                                        ) : null}
                                    </View>
                                ))}
                            </RadioForm>
                            {/* <View style={{ height: hp(2) }}>

                            <Text>Hello</Text>
                        </View> */}
                            <View style={{ marginHorizontal: wp(5), marginTop: hp(2) }}>
                                <ButtonPrimary
                                    onPress={
                                        this.state.type == '0'
                                            ? () => {
                                                  this.setState({
                                                      loading: false,
                                                  });
                                                  this._modalConfirm.current?.hide();
                                                  this.setState({
                                                      date: new Date().toString(),
                                                      time: new Date().toString(),
                                                  });
                                                  setTimeout(() => {
                                                      this.setState({ tipAlert: true, tipModal: false });
                                                  }, 500);
                                              }
                                            : debounce(this._handleModalDatePicker(false), 1000, {
                                                  leading: true,
                                                  trailing: false,
                                              })
                                    }
                                    loading={this.state.loading}
                                    disabled={this.state.loading}
                                    text={'Confirm'}
                                    backgroundColor={colors.BLUE}
                                />
                            </View>
                            <View style={{ height: hp(2) }}></View>
                        </View>
                    </CustomModal>

                    <CustomModal
                        ref={this._modalTimePicker}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <ModalTimePicker
                            // time={this.state.time !== '' ? new Date(this.state.time) : new Date()}
                            // onTimeChange={(date) => {this.setState({ time: date.toString()}) }}
                            minimumDate={new Date()}
                            onDateChange={(date: Date) => {
                                this.setState((prevState) => {
                                    if (prevState.time) {
                                        return {
                                            ...prevState,
                                            time: date.toString(),
                                        };
                                    }

                                    return {
                                        ...prevState,
                                        time: date.toString(),
                                    };
                                });
                            }}
                            showModal={this._handleModalTimePicker(true)}
                            title={this.props.selectedLanguage.pick_your_time_booking}
                            color={color}
                            selectedLanguage={this.props.selectedLanguage}
                            mode="time"
                        />
                    </CustomModal>

                    <CustomModal
                        ref={this._modalDatePicker}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <ModalTimePicker
                            // time={this.state.date !== '' ? new Date(this.state.date) : new Date()}
                            // onTimeChange={(date) => this.setState({ date: date.toString() })}
                            onDateChange={(val: Date) => {
                                this.setState((prevState) => {
                                    if (prevState.date) {
                                        return {
                                            ...prevState,
                                            date: val.toString(),
                                        };
                                    }

                                    return {
                                        ...prevState,
                                        date: val.toString(),
                                    };
                                });
                            }}
                            minimumDate={new Date()}
                            showModal={this._handleModalDatePicker(true)}
                            title={this.props.selectedLanguage.pick_your_date_booking}
                            color={color}
                            selectedLanguage={this.props.selectedLanguage}
                            mode="date"
                        />
                    </CustomModal>

                    <AttentionModal
                        visible={this.state.visible}
                        toggleModal={this.toggleModal}
                        text={this.state.text}
                        attention={this.props.selectedLanguage.attention}
                        ok={this.props.selectedLanguage.ok}
                    />

                    <ImageExpandModal
                        modalVisible={this.state.expandImageModal}
                        Image={require('../../images/SpaORoomBG.png')}
                        //  Image={{ uri: this.props.restaurant.logo_url }}
                        onBack={() => this.setState({ expandImageModal: false })}
                        onBackDrop={() => console.log('hello')}
                    />

                    <CustomModal
                        style={{ margin: -1 }}
                        ref={this._modalPaymentFormModal}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <PaymentFormModal
                            onBackClick={() => this._modalPaymentFormModal.current?.hide()}
                            onScanIconClick={() => this.scanCard()}
                            holderName={this.state.holderName}
                            onChangeHolderName={(val) => this.setState({ holderName: val })}
                            cardNumber={this.state.cardNumber}
                            onChangeCardNumber={(val) => this.setState({ cardNumber: val })}
                            cardAddress={this.state.cardAddress}
                            isLoading={this.state.loading}
                            onChangeCardAddress={(val) => this.setState({ cardAddress: val })}
                            cardExpiryDate={this.state.expiryDate}
                            onChangeCardExpiry={(val) => this.setState({ expiryDate: val })}
                            onChangeCVV={(val) => this.setState({ cvv: val })}
                            onCardSave={(val) => this.setState({ cardSave: val })}
                            cardSave={this.state.cardSave}
                            onPrimaryClick={() => this._handleOrderRoomService()}
                            chainData={this.props.chainData}
                        />
                    </CustomModal>

                    <CustomModal
                        style={{ margin: -1 }}
                        ref={this._modalProcessCompleteModal}
                        animationIn="fadeInUp"
                        animationOut="fadeOutDown"
                    >
                        <ProcessCompleteModal
                            backgroundColor={this.props.icon.spa_color}
                            processTitle={this.props.selectedLanguage.request_successfull}
                            processDescription={
                                this.props.selectedLanguage
                                    .you_have_successfully_requested_for_spa_room_service
                            }
                            btnText={this.props.selectedLanguage.go_to_home}
                            onButtonPress={() => Navigation.popTo('spaService')}
                            processImage={require('../../images/paymentSuccess.png')}
                            chainData={this.props.chainData}
                            // onBackClick={this._handleModalBack}
                            // onScanIconClick={() => this.scanCard()}
                            // holderName={this.state.holderName}
                            // onChangeHolderName={(val) => this.setState({ holderName : val })}
                            // cardNumber={this.state.cardNumber}
                            // onChangeCardNumber={(val) => this.setState({cardNumber : val})}
                            // cardAddress={this.state.cardAddress}
                            // isLoading={this.state.loading}
                            // onChangeCardAddress={(val) => this.setState({ cardAddress : val})}
                            // cardExpiryDate={this.state.expiryDate}
                            // onChangeCardExpiry={(val) => this.setState({ expiryDate : val })}
                            // onChangeCVV={(val) => this.setState({cvv : val})}
                            // onPrimaryClick={() => Alert.alert("Hello World")}
                        />
                    </CustomModal>

                    <Modal
                        backdropOpacity={0.7}
                        isVisible={this.state.tipAlert}
                        onBackdropPress={() => {
                            this.setState({ tipAlert: false });
                            setTimeout(() => {
                                this.setState({
                                    tipModal: false,
                                });
                            }, 500);
                        }}
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
                                    width: wp(90),
                                    // height: scale.h(200),
                                    backgroundColor: '#fff',
                                    borderRadius: scale.w(2.5),
                                    alignItems: 'center',
                                    paddingVertical: wp(5),
                                }}
                            >
                                {this.state.tipModal ? (
                                    <>
                                        <Menu ref={(ref) => (this.menuRef = ref)}>
                                            <FlatList
                                                data={Data}
                                                contentInsetAdjustmentBehavior="automatic"
                                                keyboardShouldPersistTaps="handled"
                                                keyboardDismissMode="interactive"
                                                style={{ width: '100%', maxHeight: scale.h(200) }}
                                                keyExtractor={(item, index) => JSON.stringify(item)}
                                                nestedScrollEnabled
                                                renderItem={({ item, index }) => {
                                                    let tip = String(item).slice(0, 2);
                                                    return (
                                                        <MenuItem
                                                            textStyle={{
                                                                color: colors.GREY,
                                                            }}
                                                            onPress={() => {
                                                                this.setState({ tip });
                                                                this.menuRef.hide();
                                                            }}
                                                        >
                                                            {String(item)}
                                                        </MenuItem>
                                                    );
                                                }}
                                            />
                                        </Menu>
                                        <Text style={{ fontSize: scale.w(2.2), fontFamily: 'Roboto-Medium' }}>
                                            Add Tip
                                        </Text>
                                        <View style={{ width: '80%', marginTop: hp(5) }}>
                                            <View
                                                ref={(ref) => (this.dropDownRef = ref)}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    borderWidth: 1,
                                                    borderColor: colors.GREY,
                                                    borderRadius: scale.w(0.5),
                                                    marginBottom: hp(3),
                                                }}
                                            >
                                                <InputText
                                                    placeholder="Enter or select tip in %"
                                                    placeholderTextColor={colors.GREY}
                                                    keyboardType="numeric"
                                                    selectionColor={colors.BLUE}
                                                    borderWidth={0}
                                                    flex={1}
                                                    marginTop={0}
                                                    value={this.state.tip}
                                                    onChangeText={(tip) => {
                                                        this.setState({ tip });
                                                    }}
                                                />
                                                {this.state.tip ? <H2>%</H2> : null}
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.menuRef.show(
                                                            this.dropDownRef,
                                                            Position.TOP_RIGHT,
                                                        );
                                                    }}
                                                    style={{
                                                        width: wp(10),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <IonIcon
                                                        name="ios-arrow-down"
                                                        size={wp(4.5)}
                                                        color={color || colors.DARK_BLUE}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <ButtonPrimary
                                                onPress={() => {
                                                    if (this.state.tip == '') {
                                                        toast(
                                                            this.props.selectedLanguage
                                                                .please_enter_tip_to_proceed,
                                                        );
                                                    } else {
                                                        if (this.state.paymentType == 'card') {
                                                            this.setState({
                                                                tipModal: false,
                                                                tipAlert: false,
                                                            });
                                                            this._modalPaymentFormModal.current?.show();
                                                        } else {
                                                            this._handleOrderRoomService();
                                                        }
                                                    }
                                                }}
                                                loading={this.state.loading}
                                                disabled={this.state.loading}
                                                text={'Confirm Order'}
                                                backgroundColor={colors.BLUE}
                                            />
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <Text style={{ fontSize: scale.w(2.5), fontFamily: 'Robo-Medium' }}>
                                            Would you like to add a tip?
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                marginTop: hp(5),
                                                width: wp(73),
                                            }}
                                        >
                                            <View style={{ width: '42%', paddingHorizontal: wp(1) }}>
                                                <ButtonPrimary
                                                    backgroundColor={colors.BLUE}
                                                    onPress={() => {
                                                        this.setState({ tipAlert: false });
                                                        if (this.state.paymentType == 'cash') {
                                                            this._handleOrderRoomService(false);
                                                        } else {
                                                            this._modalPaymentFormModal.current?.show();
                                                        }
                                                    }}
                                                    loading={false}
                                                    disabled={false}
                                                    fontSize={scale.w(2)}
                                                    text={this.props.selectedLanguage.no}
                                                />
                                            </View>
                                            <View style={{ width: '42%', paddingHorizontal: wp(1) }}>
                                                <ButtonPrimary
                                                    backgroundColor={colors.BLUE}
                                                    onPress={() => {
                                                        this.setState({ tipModal: true });
                                                    }}
                                                    loading={false}
                                                    disabled={false}
                                                    fontSize={scale.w(2)}
                                                    text={this.props.selectedLanguage.yes}
                                                />
                                            </View>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>

                    {/* <AttentionModal
                        visible={this.state.visible}
                        toggleModal={this.toggleModal}
                        text={this.state.text}
                        attention={this.props.selectedLanguage.attention}
                        ok={this.props.selectedLanguage.ok}
                    /> */}

                    <ImageExpandModal
                        modalVisible={this.state.expandImageModal}
                        Image={{ uri: DATA.restaurant.logo_url }}
                        onBack={() => this.setState({ expandImageModal: false })}
                        onBackDrop={() => console.log('hello')}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    submit_btn_container: {
        paddingHorizontal: scale.w(57),
        marginTop: scale.w(18),
    },
    searchview: {
        marginHorizontal: scale.w(21),

        height: wp(12),
        // width:wp('100%'),
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 50,
        backgroundColor: '#ECECEC',
        // opacity:0.5
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
    image: {
        alignContent: 'center',
        width: '100%',
        height: hp('100%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        // position: 'relative',
    },
});

export default SpaOrderRoomServiceAllItems;
