import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from '../services/notifications.service.js';

const notificationsService = new NotificationsService();

export class NotificationsController {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationsService.getNotifications(req.user?.id);
      res.status(200).json({
        success: true,
        data: result.notifications,
        meta: {
          unreadCount: result.unreadCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationsService.markAsRead(req.params.id, req.user?.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationsService.markAllAsRead(req.user?.id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
