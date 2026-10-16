import { z } from 'zod';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const genders = ['Male', 'Female', 'Other'] as const;
const donorStatuses = ['Eligible', 'Ineligible', 'Pending'] as const;

export const createDonorSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  bloodGroup: z.enum(bloodGroups, { message: 'Invalid blood group. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-' }),
  gender: z.enum(genders, { message: 'Gender must be Male, Female, or Other' }),
  age: z.coerce.number().int().min(18, 'Donor must be at least 18 years old').max(65, 'Donor must be 65 years or younger'),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{7,20}$/, 'Invalid phone number format'),
  email: z.string().trim().email('Invalid email address format').optional().nullable(),
  district: z.string().trim().min(2, 'District is required').max(100),
  thana: z.string().trim().min(2, 'Thana/Upazila is required').max(100),
  address: z.string().trim().max(255).optional().nullable(),
  weightKg: z.coerce.number().min(40).max(200).optional().nullable(),
  lastDonationDate: z.string().datetime().optional().nullable().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()),
  totalDonations: z.coerce.number().int().min(0, 'Blood donation count cannot be negative').max(500, 'Donation count seems unusually high').optional().nullable(),
  isAvailable: z.boolean().optional(),
  readyForEmergency: z.boolean().optional(),
});

export const updateDonorSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  bloodGroup: z.enum(bloodGroups).optional(),
  gender: z.enum(genders).optional(),
  age: z.coerce.number().int().min(18).max(65).optional(),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{7,20}$/).optional(),
  email: z.string().trim().email().optional().nullable(),
  district: z.string().trim().min(2).max(100).optional(),
  thana: z.string().trim().min(2).max(100).optional(),
  address: z.string().trim().max(255).optional().nullable(),
  status: z.enum(donorStatuses).optional(),
  isAvailable: z.boolean().optional(),
  readyForEmergency: z.boolean().optional(),
  weightKg: z.coerce.number().min(40).max(200).optional().nullable(),
  totalDonations: z.coerce.number().int().min(0, 'Blood donation count cannot be negative').max(500, 'Donation count seems unusually high').optional().nullable(),
  lastDonationDate: z.string().optional().nullable(),
  nextEligibleDate: z.string().optional().nullable(),
  ineligibilityReason: z.string().max(500).optional().nullable(),
});

export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean().optional(),
  readyForEmergency: z.boolean().optional(),
});

export const searchDonorsQuerySchema = z.object({
  bloodGroup: z.string().optional(),
  district: z.string().optional(),
  thana: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(donorStatuses).optional(),
  isAvailable: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID parameter is required'),
});
