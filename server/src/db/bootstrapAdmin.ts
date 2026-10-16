import { prisma } from './prisma.js';
import { Role, BloodGroup, Gender, DonorStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Bootstraps the system owner & developer as Super Admin
 */
export async function bootstrapSuperAdmin() {
  try {
    const targetEmail = 'shoufiqrahmanshifat2021@gmail.com';
    const targetName = 'Shoufiq Rahman Shifat';
    const targetPhone = '01302534645';
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Upsert User
    const user = await prisma.user.upsert({
      where: { email: targetEmail },
      update: {
        name: targetName,
        phone: targetPhone,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
      create: {
        name: targetName,
        email: targetEmail,
        phone: targetPhone,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });

    // Ensure linked Donor profile for testing member & donor features
    const existingDonor = await prisma.donor.findFirst({
      where: {
        OR: [{ userId: user.id }, { phone: targetPhone }],
      },
    });

    if (existingDonor) {
      await prisma.donor.update({
        where: { id: existingDonor.id },
        data: {
          userId: user.id,
          name: targetName,
          phone: targetPhone,
          email: targetEmail,
        },
      });
    } else {
      await prisma.donor.create({
        data: {
          userId: user.id,
          name: targetName,
          phone: targetPhone,
          email: targetEmail,
          bloodGroup: BloodGroup.O_POS,
          gender: Gender.MALE,
          age: 24,
          district: 'Dhaka',
          thana: 'Mirpur',
          status: DonorStatus.ELIGIBLE,
          totalDonations: 3,
        },
      });
    }

    // Upsert legacy AdminUser model for compatibility
    await prisma.adminUser.upsert({
      where: { email: targetEmail },
      update: {
        name: targetName,
        role: 'SuperAdmin',
        password: hashedPassword,
      },
      create: {
        name: targetName,
        email: targetEmail,
        password: hashedPassword,
        role: 'SuperAdmin',
      },
    });

    console.log(`👑 [SUPER_ADMIN PROVISIONED]: ${user.name} <${user.email}> - Role: ${user.role}`);
  } catch (error) {
    console.error('⚠️ Failed to bootstrap Super Admin:', error);
  }
}
