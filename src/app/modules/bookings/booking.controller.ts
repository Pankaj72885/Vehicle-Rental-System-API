import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
  // If customer_id is not provided in body, default to logged in user
  const customerId = req.body.customer_id || req.user.id;

  // For Admins creating bookings for others, they might send customer_id.
  // For Customers, they must only book for themselves?
  // Usually, yes.
  // If role is customer, force customer_id = req.user.id
  if (req.user.role === 'customer') {
    req.body.customer_id = req.user.id;
  } else {
    req.body.customer_id = customerId;
  }

  const result = await BookingService.createBooking(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  // Cast to any to avoid type conflict with Partial<TUser>
  const result = await BookingService.getAllBookings(req.user as any);

  const message =
    req.user.role === 'admin'
      ? 'Bookings retrieved successfully'
      : 'Your bookings retrieved successfully';

  if (result.length === 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'No bookings found',
      data: result,
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message,
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
};
