import { Request, Response, NextFunction } from 'express';
import { AppointmentsService } from '../services/appointments.service.js';

const appointmentsService = new AppointmentsService();

export class AppointmentsController {
  async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await appointmentsService.getAppointments(req.query as any, req.user);
      res.status(200).json({
        success: true,
        data: result.appointments,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAppointmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await appointmentsService.getAppointmentById(req.params.id, req.user);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await appointmentsService.createAppointment(req.body);
      res.status(201).json({
        success: true,
        data: created,
        message: 'Donation appointment scheduled successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAppointmentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await appointmentsService.updateAppointmentStatus(
        req.params.id,
        req.body.status
      );
      res.status(200).json({
        success: true,
        data: updated,
        message: `Appointment status updated to ${req.body.status}.`,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await appointmentsService.deleteAppointment(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
