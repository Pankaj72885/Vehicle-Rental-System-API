import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';

import { BookingRoutes } from '../modules/bookings/booking.route';
import { UserRoutes } from '../modules/users/user.route';
import { VehicleRoutes } from '../modules/vehicles/vehicle.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/vehicles',
    route: VehicleRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
