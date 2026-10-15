import { z } from 'zod';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const createDonationSchema = z.object({
  donorId: z.string().min(1, 'Donor ID is required'),
  bloodRequestId: z.string().optional().nullable(),
  bloodGroup: z.enum(bloodGroups, { message: 'Invalid blood group' }),
  units: z.coerce.number().int().min(1).max(5).default(1),
  location: z.string().trim().min(2, 'Location is required').max(150),
  donationDate: z.string().optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const donationQuerySchema = z.object({
  donorId: z.string().optional(),
  bloodRequestId: z.string().optional(),
  bloodGroup: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
