import { User } from "./User"; // Assuming you have a User interface

export interface Media {
    id: number;
    title: string;
    description: string;
    caption: string;
    url: string;
    thumbnail: string;
    size: string;
    dimensions?: string | null; // Optional field for dimensions
    uploadedBy: string;
    preview?: string;
    fileType: string;
    user?: User; // Optional field, assuming it's a relation
}
