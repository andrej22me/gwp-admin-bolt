import { Event } from "./Event";

export enum Gender {
    Male = 'Male',
    Female = 'Female',
}

export interface JoinUs {
    id: number;
    name: string;
    email: string;
    phone: string;
    club: string;
    gender: Gender;
    birthDate: Date;
    highSchool: string;
    cityCountry: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    eventId?: number;
    event?: Event;
}
