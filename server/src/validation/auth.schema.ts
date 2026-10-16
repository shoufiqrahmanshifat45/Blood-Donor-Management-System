import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Invalid email address format').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{7,20}$/, 'Invalid phone number format').optional(),
  // Public registration role is strictly enforced on the backend as DONOR
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address format').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const organizationInitiateSchema = z.object({
  email: z.string().trim().email('Invalid organizational email format').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const organizationVerifySchema = z.object({
  challengeId: z.string().uuid('Invalid verification challenge identifier'),
  code: z.string().trim().min(6, 'Verification code must be 6 digits').max(8),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address format').toLowerCase(),
});

export const resetPasswordSchema = z.object({
  challengeId: z.string().uuid('Invalid reset challenge identifier'),
  code: z.string().trim().min(6, 'Reset code must be 6 digits').max(8),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(100),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{7,20}$/, 'Invalid phone number format').optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  donor: z
    .object({
      bloodGroup: z.string().optional(),
      age: z.coerce.number().int().min(18).max(65).optional(),
      gender: z.string().optional(),
      district: z.string().optional(),
      thana: z.string().optional(),
      totalDonations: z.coerce.number().int().min(0).max(500).optional(),
      readyForEmergency: z.boolean().optional(),
      isAvailable: z.boolean().optional(),
      weightKg: z.coerce.number().min(40).max(200).optional().nullable(),
    })
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(100),
});
