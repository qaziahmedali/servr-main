//    export interface 02 {
//         tax_title: string;
//         tax_value: string;
//     }

//     export interface 2902 {
//         tax_title: string;
//         tax_value: string;
//     }

export interface Partial {
    tax_title: string;
    tax_value: string;
}

export interface Restaurants {
    res_id: Partial[];
    // 290: 2902[];
    // 327: 3272[];
}

// export interface 03 {
//     tax_title: string;
//     tax_value: string;
// }

// export interface 1802 {
//     tax_title: string;
//     tax_value: string;
// }

export interface Spa {
    spa_id: Partial[];
    // 180: 1802[];
}

export interface IhotelTaxesState {
    data: {
        additional_services: any[];
        laundry_services: any[];
        restaurants: Restaurants;
        spa: Spa;
        valet_parking: any[];
    };
}

export interface IhotelTaxesRoot {
    status: boolean;
    message: string;
    data: IhotelTaxesState;
}
