export enum EventCategory {
    MENS = 'MENS',
    WOMENS = 'WOMENS',
    TEAM = 'TEAM',
    INDIVIDUAL = 'INDIVIDUAL'
}

export enum EventStatus {
    UPCOMING = 'UPCOMING',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum RegistrationStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    WAITLIST = 'WAITLIST'
}

export interface Event {
    id?: number;
    title: string;
    description: string;
    category: EventCategory;
    startDate: string;
    endDate: string;
    status?: EventStatus;
    registrationStatus?: RegistrationStatus;
    capacityLimit: number;
    locationDetails: string;
    price: number;
    showPrice: boolean;
    requiredEquipment: string;
    ageRestriction: string;
    eventImageId?: number;
    createdAt?: string;
    updatedAt?: string;
}

// Default values for optional fields
export const DEFAULT_EVENT_STATUS = EventStatus.UPCOMING;
export const DEFAULT_REGISTRATION_STATUS = RegistrationStatus.OPEN;
