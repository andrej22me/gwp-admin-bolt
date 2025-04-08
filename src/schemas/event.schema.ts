import { z } from 'zod';
import { EventCategory, EventStatus, RegistrationStatus } from '@/interfaces/Event';

// Convert enum to union type for Zod
// const eventCategoryEnum = Object.values(EventCategory) as [string, ...string[]];

export const createEventSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  category: z.nativeEnum(EventCategory, {
    required_error: "Category is required",
  }),
  startDate: z.string().datetime({
    message: "Start date must be a valid ISO date string",
  }),
  endDate: z.string().datetime({
    message: "End date must be a valid ISO date string",
  }),
  location: z.string().optional(),
  locationDetails: z.string().optional(),
  price: z.number().optional(),
  showPrice: z.boolean().optional(),
  requiredEquipment: z.string().optional(),
  ageRestriction: z.string().optional(),
  status: z.nativeEnum(EventStatus).optional(),
  registrationStatus: z.nativeEnum(RegistrationStatus).optional(),
  capacityLimit: z.number().optional(),
  eventImageId: z.number().optional(),
});

// Infer the type from the schema
export type CreateEventInput = z.infer<typeof createEventSchema>;

// Add custom validation for date range
export const validateEventDates = (data: CreateEventInput) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (endDate < startDate) {
    throw new Error("End date cannot be before start date");
  }

  return data;
};
