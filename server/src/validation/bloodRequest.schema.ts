import { z } from 'zod';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const urgencies = ['Urgent', 'Pending', 'Fulfilled', 'Cancelled'] as const;

export const createBloodRequestSchema = z.object({
  patientName: z.string().trim().min(2, 'Patient name is required').max(100),
  hospital: z.string().trim().min(2, 'Hospital name is required').max(150),
  bloodGroup: z.enum(bloodGroups, { message: 'Invalid blood group. Must be A+, A-, B+, B-, AB+, AB-, O+, O-' }),
  units: z.coerce.number().int().min(1, 'Minimum 1 unit required').max(20, 'Maximum 20 units per request'),
  urgency: z.enum(urgencies).default('Urgent'),
  contactPhone: z.string().trim().regex(/^\+?[0-9\s-]{7,20}$/, 'Valid contact phone number is required'),
  contactName: z.string().trim().max(100).optional().nullable(),
  requiredDate: z.string().optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const updateBloodRequestSchema = z.object({
  patientName: z.string().trim().min(2).max(100).optional(),
  hospital: z.string().trim().min(2).max(150).optional(),
  bloodGroup: z.enum(bloodGroups).optional(),
  units: z.coerce.number().int().min(1).max(20).optional(),
  urgency: z.enum(urgencies).optional(),
  contactPhone: z.string().trim().regex(/^\+?[0-9\s-]{7,20}$/).optional(),
  contactName: z.string().trim().max(100).optional().nullable(),
  requiredDate: z.string().optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
  fulfilledUnits: z.coerce.number().int().min(0).optional(),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(urgencies, { message: 'Status must be Urgent, Pending, Fulfilled, or Cancelled' }),
});

export const bloodRequestQuerySchema = z.object({
  urgency: z.enum(urgencies).optional(),
  bloodGroup: z.string().optional(),
  hospital: z.string().optional(),
  requesterId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
