import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, VerificationPurpose } from '@prisma/client';
import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import { env } from '../config/env.js';
import { notificationService } from './notification.service.js';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '../utils/errors.js';

// Roles permitted to access the administrative dashboard
const ORGANIZATION_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.STAFF,
  Role.HOSPITAL_COORDINATOR,
];

// In-memory debug store for dev integration tests only (cleared in production)
const devCodeMemory = new Map<string, string>();

export class VerificationService {
  /**
   * Initiate Admin / Organization Verification Step 1:
   * Validates credentials and administrative eligibility, then issues a short-lived challenge
   */
  async initiateAdminVerification(data: { email: string; password: string }) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const normalizedEmail = data.email.trim().toLowerCase();

    // 1. Verify user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid account credentials.');
    }

    if (!user.isActive) {
      throw new ForbiddenError('This organization account has been deactivated. Please contact your system administrator.');
    }

    // 2. Validate password
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid account credentials.');
    }

    // 3. Strictly check administrative eligibility
    if (!ORGANIZATION_ROLES.includes(user.role)) {
      throw new ForbiddenError(
        'Access Denied: This account is not provisioned with administrative privileges. Please sign in through the General Member portal.'
      );
    }

    // 4. Rate-limiting verification challenges: Max 5 challenges per 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentChallengeCount = await prisma.verificationChallenge.count({
      where: {
        userId: user.id,
        purpose: VerificationPurpose.ADMIN_LOGIN,
        createdAt: { gte: fifteenMinutesAgo },
      },
    });

    if (recentChallengeCount >= 5) {
      throw new BadRequestError('Too many verification requests. Please wait a few minutes before trying again.');
    }

    // 5. Invalidate any existing unused challenges for this user
    await prisma.verificationChallenge.updateMany({
      where: {
        userId: user.id,
        purpose: VerificationPurpose.ADMIN_LOGIN,
        isUsed: false,
      },
      data: { isUsed: true },
    });

    // 6. Generate unpredictable, short-lived 6-digit numeric verification code
    const rawCode = crypto.randomInt(100000, 1000000).toString();
    const codeHash = await bcrypt.hash(rawCode, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const challenge = await prisma.verificationChallenge.create({
      data: {
        userId: user.id,
        codeHash,
        purpose: VerificationPurpose.ADMIN_LOGIN,
        expiresAt,
        attempts: 0,
        maxAttempts: 5,
        isUsed: false,
      },
    });

    // In dev environment, store raw code in memory for programmatic test scripts (NEVER in API response)
    if (env.NODE_ENV === 'development') {
      devCodeMemory.set(challenge.id, rawCode);
    }

    // 7. Dispatch via configured notification service (or record security audit)
    const dispatchResult = await notificationService.sendVerificationCode(
      user.email,
      rawCode,
      'ADMIN_LOGIN'
    );

    const maskedEmail = notificationService.maskEmail(user.email);

    return {
      success: true,
      challengeId: challenge.id,
      maskedEmail,
      expiresInSeconds: 600,
      provider: dispatchResult.provider,
      providerConfigured: notificationService.getProviderStatus().configured,
      message: `A single-use verification code has been dispatched to ${maskedEmail}. Valid for 10 minutes.`,
    };
  }

  /**
   * Verify Admin / Organization Challenge Step 2:
   * Validates code, expiry, attempt limits, and single-use status before issuing administrative session
   */
  async verifyAdminChallenge(data: { challengeId: string; code: string }) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const { challengeId, code } = data;
    if (!challengeId || !code) {
      throw new BadRequestError('Challenge ID and verification code are required.');
    }

    const challenge = await prisma.verificationChallenge.findUnique({
      where: { id: challengeId },
      include: { user: true },
    });

    if (!challenge || challenge.purpose !== VerificationPurpose.ADMIN_LOGIN) {
      throw new BadRequestError('Invalid or expired verification session.');
    }

    // Check single-use status
    if (challenge.isUsed) {
      throw new BadRequestError('This verification code has already been used. Please request a new code.');
    }

    // Check expiry
    if (new Date() > challenge.expiresAt) {
      throw new BadRequestError('This verification code has expired. Please initiate a new sign-in.');
    }

    // Check attempt limits
    if (challenge.attempts >= challenge.maxAttempts) {
      throw new BadRequestError('Maximum verification attempts exceeded. Please initiate a new sign-in.');
    }

    // Increment attempts count
    const updatedAttempts = challenge.attempts + 1;
    await prisma.verificationChallenge.update({
      where: { id: challenge.id },
      data: { attempts: updatedAttempts },
    });

    // Verify code hash
    const isCodeValid = await bcrypt.compare(code.trim(), challenge.codeHash);
    if (!isCodeValid) {
      const remaining = challenge.maxAttempts - updatedAttempts;
      if (remaining <= 0) {
        throw new BadRequestError('Invalid verification code. Maximum attempts reached. Please initiate a new sign-in.');
      }
      throw new BadRequestError(`Invalid verification code. ${remaining} attempt(s) remaining.`);
    }

    // Mark challenge as used (single-use enforcement)
    await prisma.verificationChallenge.update({
      where: { id: challenge.id },
      data: { isUsed: true },
    });

    // Clean up dev memory
    devCodeMemory.delete(challenge.id);

    // Verify user is still authorized
    const user = challenge.user;
    if (!ORGANIZATION_ROLES.includes(user.role)) {
      throw new ForbiddenError('Unauthorized: Account lacks administrative privileges.');
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Record Security Audit
    console.log(
      `[SECURITY AUDIT] Organization verification SUCCESS for user ${user.id} (${user.email}, role: ${user.role})`
    );

    // Generate JWT token with administrative role
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Request password reset code
   */
  async initiatePasswordReset(email: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Prevent account enumeration by always returning generic message
    if (!user) {
      return {
        success: true,
        message: 'If an account exists with this email, a reset code has been dispatched.',
      };
    }

    // Invalidate existing password reset challenges
    await prisma.verificationChallenge.updateMany({
      where: {
        userId: user.id,
        purpose: VerificationPurpose.PASSWORD_RESET,
        isUsed: false,
      },
      data: { isUsed: true },
    });

    const rawCode = crypto.randomInt(100000, 1000000).toString();
    const codeHash = await bcrypt.hash(rawCode, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const challenge = await prisma.verificationChallenge.create({
      data: {
        userId: user.id,
        codeHash,
        purpose: VerificationPurpose.PASSWORD_RESET,
        expiresAt,
        attempts: 0,
        maxAttempts: 5,
        isUsed: false,
      },
    });

    if (env.NODE_ENV === 'development') {
      devCodeMemory.set(`reset_${challenge.id}`, rawCode);
    }

    await notificationService.sendVerificationCode(user.email, rawCode, 'PASSWORD_RESET');

    return {
      success: true,
      challengeId: challenge.id,
      message: 'If an account exists with this email, a reset code has been dispatched.',
    };
  }

  /**
   * Complete password reset with verified code
   */
  async resetPassword(data: { challengeId: string; code: string; newPassword: string }) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const challenge = await prisma.verificationChallenge.findUnique({
      where: { id: data.challengeId },
      include: { user: true },
    });

    if (!challenge || challenge.purpose !== VerificationPurpose.PASSWORD_RESET) {
      throw new BadRequestError('Invalid or expired password reset request.');
    }

    if (challenge.isUsed || new Date() > challenge.expiresAt || challenge.attempts >= challenge.maxAttempts) {
      throw new BadRequestError('This reset code is invalid, expired, or max attempts have been exceeded.');
    }

    await prisma.verificationChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });

    const isMatch = await bcrypt.compare(data.code.trim(), challenge.codeHash);
    if (!isMatch) {
      throw new BadRequestError('Invalid reset code.');
    }

    await prisma.verificationChallenge.update({
      where: { id: challenge.id },
      data: { isUsed: true },
    });

    const newHash = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: challenge.userId },
      data: { password: newHash },
    });

    return {
      success: true,
      message: 'Password reset successful. You may now sign in with your new password.',
    };
  }

  /**
   * Internal dev helper for integration test scripts only
   */
  getDevCodeForTest(challengeId: string): string | null {
    if (env.NODE_ENV !== 'development') return null;
    return devCodeMemory.get(challengeId) || null;
  }
}

export const verificationService = new VerificationService();
