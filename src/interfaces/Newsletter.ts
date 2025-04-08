export enum Gender {
    Male = 'Male',
    Female = 'Female',
}

export interface Newsletter {
    id: number;
    name: string;
    email: string;
    birthDate: Date;
    gender: Gender;
    club: string;
    phone: string;
    highSchool: string;
    cityCountry: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    message: string;
}
