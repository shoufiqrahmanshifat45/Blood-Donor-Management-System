import { z } from 'zod';

const VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const bloodGroupParamSchema = z.object({
  bloodGroup: z.enum(VALID_BLOOD_GROUPS, {
    message: 'Invalid blood group. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
  }),
});

export const updateBloodStockSchema = z.object({
  deltaUnits: z.coerce.number().int({ message: 'Delta units must be an integer' }).min(-1000).max(1000),
});
