

    export interface AdditionalService {
        id: number;
        hotel_booking_id: number;
        additional_service_id: number;
        name: string;
        image: string;
        price: string;
        quantity: number;
        created_at: string;
        updated_at: string;
    }

    export interface User {
        user_id: number;
        cardholder_name: string;
        card_number: string;
        card_number_full: string;
        card_expiry_date: string;
        card_cvv_number: string;
        card_description: string;
        card_address: string;
        phone_number: string;
        address_type: string;
        address_line_1: string;
        address_line_2: string;
        city: string;
        state: string;
        postal_code: string;
        country_code: string;
        last_name: string;
        full_name: string;
        email: string;
        profile_image: string;
        sendbird_user_id: string;
        sendbird_access_token: string;
        sendbird_channel_url: string;
        is_chat_active: number;
        total_orders: string;
        total_booking: string;
        login_with: string;
        type: string;
        status: string;
        quick_check_out?: any;
        late_check_out?: any;
        late_check_out_date_time?: any;
        lang: string;
        departure_date: string;
        arrival_date: string;
        note_request: string;
        room_temperature: number;
        signature_photo: string[];
        additional_services: AdditionalService[];
        passport_photos: string[];
        reference: string;
        check_out_time?: any;
        late_checkout_time?: any;
        room_number: string;
        terms_and_conditions: boolean;
    }

    export interface Theme {
        primary_color: string;
        secondary_color: string;
    }

    export interface Icons {
        check_in_color: string;
        check_out_color: string;
        restaurant_color: string;
        spa_color: string;
        concierge_color: string;
        cleaning_color: string;
    }

    export interface Layout {
        theme: Theme;
        icons: Icons;
    }

    export interface HotelFeatures {
        is_stripe_enabled: boolean;
        is_check_in_enabled: boolean;
        is_check_out_enabled: boolean;
        is_spa_enabled: boolean;
        is_restaurant_enabled: boolean;
        is_concierge_enabled: boolean;
        is_cleaning_enabled: boolean;
        is_spa_treatment: boolean;
        is_spa_room_service: boolean;
        is_experience: boolean;
        is_wakeup_call_enabled: boolean;
        is_guest_enabled: boolean;
        is_parking_enabled: boolean;
    }

    export interface Restaurant {
        id: number;
        button_title: string;
        button_slug: string;
        hotel_id: number;
        series: number;
        type: string;
        created_at: string;
        updated_at: string;
    }

    export interface Spa {
        id: number;
        button_title: string;
        button_slug: string;
        hotel_id: number;
        series: number;
        type: string;
        created_at: string;
        updated_at: string;
    }

    export interface DynamicButtons {
        restaurant: Restaurant[];
        spa: Spa[];
    }

    export interface HotelStaticData {
        id: number;
        address?: any;
        vat: number;
        service_charges: number;
        city: string;
        country?: any;
        phone: string;
        code: string;
        name: string;
        description: string;
        hotel_logo_lg: string;
        hotel_logo_md: string;
        hotel_logo_sm: string;
        currency: string;
        mobile_hotel_layout_id: number;
        category: string;
        layout: Layout;
        mobile_hotel_layouts?: any;
        hotel_features: HotelFeatures;
        dynamic_buttons: DynamicButtons;
    }

    export interface Promotion {
        redeem_link: string;
        id?: number;
        path: string;
        type: string;
        reference_id?: any;
        experience_button_id?: number;
    }

    export interface HotelDetail {
        type: string;
        code: string;
        currency: string;
        data: HotelStaticData;
        parking_detail: any[];
        promotion: Promotion[];
    }

    export interface HotelObject {
        booking_token: string;
        user: User;
        hotel_detail: HotelDetail;
    }

   


    export interface HotelData {
        message: string;
        data: HotelObject;
    }
