import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { VehicleController } from './vehicle.controller';
import { VehicleValidation } from './vehicle.validation';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(VehicleValidation.createVehicleSchema),
  VehicleController.createVehicle,
);

router.get('/', VehicleController.getAllVehicles);

router.get('/:vehicleId', VehicleController.getVehicleById);

router.put(
  '/:vehicleId',
  auth('admin'),
  validateRequest(VehicleValidation.updateVehicleSchema),
  VehicleController.updateVehicle,
);

router.delete('/:vehicleId', auth('admin'), VehicleController.deleteVehicle);

export const VehicleRoutes = router;
