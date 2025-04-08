import {Media} from "@/interfaces/Media";
import {GalleryType} from "@/interfaces/GalleryType";
import {GalleryCategory} from "@/interfaces/GalleryCategory";
import { EventCategory } from "./Event";

export interface Gallery {
    id: number;
    title: string;
    eventYear?: number; // nullable or optional in Prisma => "number | null"; in TS, you can represent it as optional
    season?: string;
    type: GalleryType;
    createdAt: string; // or Date if you parse it
    updatedAt: string; // or Date if you parse it

    category?: string; // can be optional if not always eager-loaded

    // If there's a relation to Event:
    eventId?: number;
    Event?: Event; // optional if not always loaded

    media?: Media[]; // optional if not always loaded
}