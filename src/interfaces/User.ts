import {UserRole} from "@/interfaces/UserRole";

export interface User {
    id?: number;
    name: string;
    email: string;
    role: UserRole // Replace with your actual role enum values
    bio?: string | undefined;
    expertise?: string | undefined;
    contactInfo?: string | undefined;
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
    passwordChangedAt?: string | undefined; // ISO date string
    imageId?: number | undefined;
    imageUrl?: string | undefined;
    image?: any;
    password?: string;
    newPassword?: string | undefined;
}