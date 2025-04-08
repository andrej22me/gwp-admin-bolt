import {Component} from "@/interfaces/Component";

export interface Section {
    id: number;
    title: string;
    label: string;
    description?: string;
    pageId: number;
    components: Component[];
}
