import {Gallery} from "@/interfaces/Gallery";

export interface GalleryCategory {
    id: number;
    name: string;
    createdAt?: string; // Optional since it might not be needed everywhere
}