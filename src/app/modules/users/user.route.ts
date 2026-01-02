import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/', auth('admin'), UserController.getAllUsers);

router.put(
  '/:userId',
  auth('admin', 'customer'),
  validateRequest(UserValidation.updateUserSchema),
  UserController.updateUser,
);

router.delete('/:userId', auth('admin'), UserController.deleteUser);

export const UserRoutes = router;
