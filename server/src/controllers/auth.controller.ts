import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getClearAuthCookieOptions,
} from '../utils/cookies.js';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);

      // Set secure HttpOnly session cookie
      res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());

      res.status(201).json({
        success: true,
        data: result,
        message: 'Account registered successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      // Set secure HttpOnly session cookie
      res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful.',
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response) {
    // Clear secure session cookie
    res.clearCookie(AUTH_COOKIE_NAME, getClearAuthCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.user!.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await authService.updateProfile(req.user!.id, req.body);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Profile updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.changePassword(
        req.user!.id,
        req.body.currentPassword,
        req.body.newPassword
      );
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Initiate organization admin sign-in challenge
   */
  async initiateOrganizationLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { verificationService } = await import('../services/verification.service.js');
      const result = await verificationService.initiateAdminVerification(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete organization admin verification challenge
   */
  async verifyOrganizationLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { verificationService } = await import('../services/verification.service.js');
      const result = await verificationService.verifyAdminChallenge(req.body);

      // Set secure HttpOnly session cookie
      res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());

      res.status(200).json({
        success: true,
        data: result,
        message: 'Organization verification successful. Welcome back.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset code
   */
  async initiatePasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { verificationService } = await import('../services/verification.service.js');
      const result = await verificationService.initiatePasswordReset(req.body.email);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete password reset with code
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { verificationService } = await import('../services/verification.service.js');
      const result = await verificationService.resetPassword(req.body);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Local development test helper for integration scripts (disabled in production)
   */
  async getDevCode(req: Request, res: Response, next: NextFunction) {
    try {
      if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ success: false, error: 'Endpoint not found.' });
      }
      const { verificationService } = await import('../services/verification.service.js');
      const code = verificationService.getDevCodeForTest(req.params.challengeId);
      res.status(200).json({ success: true, code });
    } catch (error) {
      next(error);
    }
  }
}

