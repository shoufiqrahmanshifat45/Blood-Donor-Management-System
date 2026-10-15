import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { env } from '../config/env.js';

export async function getAdminToken(): Promise<string> {
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin_test@blooddonor.org' },
    update: { role: Role.ADMIN, isActive: true },
    create: {
      name: 'System Admin Tester',
      email: 'admin_test@blooddonor.org',
      password: await bcrypt.hash('AdminPassword123!', 10),
      role: Role.ADMIN,
      isActive: true,
    },
  });

  return jwt.sign(
    { userId: adminUser.id, email: adminUser.email, role: adminUser.role },
    env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}

export async function getDonorToken(): Promise<{ token: string; userId: string }> {
  const donorUser = await prisma.user.upsert({
    where: { email: 'donor_test@blooddonor.org' },
    update: { role: Role.DONOR, isActive: true },
    create: {
      name: 'Standard Donor Tester',
      email: 'donor_test@blooddonor.org',
      password: await bcrypt.hash('DonorPassword123!', 10),
      role: Role.DONOR,
      isActive: true,
    },
  });

  const token = jwt.sign(
    { userId: donorUser.id, email: donorUser.email, role: donorUser.role },
    env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { token, userId: donorUser.id };
}
