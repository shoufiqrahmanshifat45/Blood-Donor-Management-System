import { Request, Response, NextFunction } from 'express';
import { AppointmentsService } from '../services/appointments.service.js';

const appointmentsService = new AppointmentsService();

export async function getAppointments(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await appointmentsService.getAppointments();
    res.status(200).json({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await appointmentsService.createAppointment(req.body);
    res.status(201).json({
      success: true,
      data: created,
      message: 'Appointment booked successfully!',
    });
  } catch (error) {
    next(error);
  }
}
