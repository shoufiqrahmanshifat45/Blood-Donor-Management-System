import { Router } from 'express';
import { AppointmentsController } from '../controllers/appointments.controller.js';
import { validate } from '../middleware/validate.js';
import { optionalAuthenticate } from '../middleware/auth.js';
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  appointmentQuerySchema,
} from '../validation/appointment.schema.js';
import { idParamSchema } from '../validation/donor.schema.js';

const router = Router();
const controller = new AppointmentsController();

// Listing & detail endpoints
router.get('/', optionalAuthenticate, validate({ query: appointmentQuerySchema }), controller.getAppointments);
router.get('/:id', optionalAuthenticate, validate({ params: idParamSchema }), controller.getAppointmentById);

// Booking appointment
router.post('/', validate({ body: createAppointmentSchema }), controller.createAppointment);

// Status updates
router.patch(
  '/:id/status',
  validate({ params: idParamSchema, body: updateAppointmentStatusSchema }),
  controller.updateAppointmentStatus
);

router.delete('/:id', validate({ params: idParamSchema }), controller.deleteAppointment);

export default router;
