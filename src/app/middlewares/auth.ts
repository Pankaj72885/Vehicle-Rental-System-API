import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import pool from '../../config/db';
import { TUserRole } from '../modules/users/user.interface';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'You are not authorized');
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
    } catch (err) {
      throw new AppError(401, 'Unauthorized');
    }

    const { role, email } = decoded;

    // Check if user exists
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    // Check role
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(403, 'You are not authorized to access this route');
    }

    req.user = decoded;
    next();
  });
};

export default auth;
