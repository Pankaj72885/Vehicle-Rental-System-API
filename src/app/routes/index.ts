import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
