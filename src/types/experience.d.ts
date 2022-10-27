import { IError } from './responseApi';

export interface IExperience {
    id: number;
    name: string;
    logo_url: string[];
    experiences: {
        categories: [];
        experience_buttons: [];
    };
}
export interface IExperienceHotelMap {
    // id: number;
    // name: string;
    // logo_url: string[];
    // galleries: string[];
}

// export interface IExperienceTreatment {
//     id: number;
//     name: string;
//     description: string | null;
//     duration: string;
//     price: number;
// }

export interface IExperienceState {
    experience: IExperience;
    hotelMap: IExperienceHotelMap;
    // treatments: IExperienceTreatment[];
    error: Partial<IError>;
}
