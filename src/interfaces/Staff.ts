import { Media } from "./Media";

export interface Staff {
    id?: number;
    name: string;
    bio?: string;
    certifications?: string;
    expertise?: string;
    email?: string;
    phoneNumber?: string;
    schedule?: string;
    hierarchy?: string;
    featured: boolean;
    isHeadCoach: boolean;
    createdAt?: string;
    updatedAt?: string;
    staffImageId?: number;
    staffImage?: Media;
}
