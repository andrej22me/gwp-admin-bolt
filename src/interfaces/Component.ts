export interface Component {
    id: number;
    title: string;
    description?: string;
    label: string;
    key: string;
    buttonText: string;
    link: string;
    componentFileId?: number | null;
    componentFile: any;
    type: "IMAGE" | "BUTTON" | "TEXT" | "ICON" | "TEXTAREA"; // Enum based on Prisma schema
    sectionId: number;
}
