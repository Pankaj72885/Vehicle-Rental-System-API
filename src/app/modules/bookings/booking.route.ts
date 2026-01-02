import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingController } from './booking.controller';
import { BookingValidation } from './booking.validation';

const router = express.Router();

router.post(
  '/',
  auth('customer', 'admin'),
  validateRequest(BookingValidation.createBookingSchema),
  BookingController.createBooking,
);

router.get('/', auth('admin', 'customer'), BookingController.getAllBookings);

router.put(
  '/:bookingId',
  auth('admin', 'customer'),
  validateRequest(BookingValidation.updateBookingSchema),
  BookingController.updateBooking,
);

export const BookingRoutes = router;
