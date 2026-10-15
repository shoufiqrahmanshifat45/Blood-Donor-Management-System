import { z } from 'zod';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const appointmentStatuses = ['Scheduled', 'Completed', 'Cancelled', 'NoShow'] as const;

export const createAppointmentSchema = z.object({
  donorName: z.string().trim().min(2, 'Donor name is required').max(100),
  donorPhone: z.string().trim().regex(/^\+?[0-9\s-]{7,20}$/, 'Valid contact phone number is required'),
  bloodGroup: z.enum(bloodGroups, { message: 'Invalid blood group' }),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  appointmentTime: z.string().min(1, 'Appointment time is required'),
  location: z.string().trim().min(2, 'Location is required').max(150),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(appointmentStatuses, { message: 'Status must be Scheduled, Completed, Cancelled, or NoShow' }),
});

export const appointmentQuerySchema = z.object({
  status: z.enum(appointmentStatuses).optional(),
  date: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});
