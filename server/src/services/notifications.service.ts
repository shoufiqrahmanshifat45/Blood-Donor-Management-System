import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import { NotFoundError, ServiceUnavailableError } from '../utils/errors.js';

export class NotificationsService {
  async getNotifications(userId?: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const where: any = {};
    if (userId) {
      where.OR = [
        { userId },
        { userId: null }, // System-wide notifications
      ];
    }

    const records = await prisma.notification.findMany({
      where,
      take: 30,
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = records.filter((n) => !n.isRead).length;

    return {
      notifications: records.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        relatedEntityId: n.relatedEntityId,
        relatedEntityType: n.relatedEntityType,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount,
    };
  }

  async markAsRead(id: string, userId?: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Notification with ID ${id} not found.`);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return {
      id: updated.id,
      isRead: updated.isRead,
    };
  }

  async markAllAsRead(userId?: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const where: any = { isRead: false };
    if (userId) {
      where.OR = [{ userId }, { userId: null }];
    }

    await prisma.notification.updateMany({
      where,
      data: { isRead: true },
    });

    return { message: 'All notifications marked as read.' };
  }
}
