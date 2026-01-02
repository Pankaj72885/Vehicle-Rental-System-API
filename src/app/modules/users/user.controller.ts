import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = req.user; // From auth middleware

  // Authorization check: Admin OR Own Profile
  if (user.role !== 'admin' && user.id !== Number(userId)) {
    throw new AppError(403, 'You are not authorized to update this profile');
  }

  // Prevent customers from changing their role to admin
  if (user.role !== 'admin' && req.body.role && req.body.role === 'admin') {
    throw new AppError(403, 'You cannot promote yourself to admin');
  }

  const result = await UserService.updateUser(Number(userId), req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  await UserService.deleteUser(Number(userId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

export const UserController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
