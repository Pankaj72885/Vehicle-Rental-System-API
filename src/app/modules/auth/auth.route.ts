import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(AuthValidation.signupSchema),
  AuthController.signup,
);

router.post(
  '/signin',
  validateRequest(AuthValidation.signinSchema),
  AuthController.signin,
);

export const AuthRoutes = router;
