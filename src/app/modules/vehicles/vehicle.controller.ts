import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VehicleService } from './vehicle.service';

const createVehicle = catchAsync(async (req, res) => {
  const result = await VehicleService.createVehicle(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Vehicle created successfully',
    data: result,
  });
});

const getAllVehicles = catchAsync(async (req, res) => {
  const result = await VehicleService.getAllVehicles();

  if (result.length === 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true, // As per API REF: Success Response - Empty List (200 OK)
      message: 'No vehicles found',
      data: result,
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicles retrieved successfully',
    data: result,
  });
});

const getVehicleById = catchAsync(async (req, res) => {
  const { vehicleId } = req.params;
  const result = await VehicleService.getVehicleById(Number(vehicleId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicle retrieved successfully',
    data: result,
  });
});

const updateVehicle = catchAsync(async (req, res) => {
  const { vehicleId } = req.params;
  const result = await VehicleService.updateVehicle(
    Number(vehicleId),
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicle updated successfully',
    data: result,
  });
});

const deleteVehicle = catchAsync(async (req, res) => {
  const { vehicleId } = req.params;
  await VehicleService.deleteVehicle(Number(vehicleId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicle deleted successfully',
    data: null, // As per API REF, data is implicit or not shown in example, usually null or check specific
  });
});

// API REF Example for DELETE success:
/*
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
Wait, sendResponse enforces data field. 
In the API Ref example for DELETE, there is no "data" field shown.
However, our generic helper adds "data". 
To Strictly follow API Ref, we might need to adjust or pass undefined?
Let's pass 'null' for now or the helper sends it.
If strictly adhering, we might need to make data optional in sendResponse or just pass something.
Most tools allow extra fields. 
*/

export const VehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
