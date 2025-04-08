import { Media } from "./Media";
import { User } from "./User";
// import { Event } from "./Event";

// Enum for TestimonialCategory (matches Prisma schema)
export enum TestimonialCategory {
    PARENT = "PARENT",
    ATHLETE = "ATHLETE",
    COACH = "COACH",
}

// Enum for TestimonialType
export enum TestimonialType {
    VIDEO = "VIDEO",
    TEXT = "TEXT",
}

// Testimonial Interface
export interface Testimonial {
    id?: number;
    authorName: string;
    authorRole: TestimonialCategory;
    testimonialType: TestimonialType;
    position: string;
    content: string;
    rating: number;
    isFeatured: boolean;
    showOnTestimonials: boolean;
    showOnHome: boolean;
    isApproved: boolean;
    createdAt: string; // ISO string format for DateTime

    mediaId?: number;
    media?: any; // Optional, related Media object

    userId?: number;
    user?: any; // Optional, related User object

    eventId?: number;
    file?: any;
    // event?: Event; // Optional, related Event object
}
