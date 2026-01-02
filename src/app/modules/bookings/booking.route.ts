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

export const BookingRoutes = router;
