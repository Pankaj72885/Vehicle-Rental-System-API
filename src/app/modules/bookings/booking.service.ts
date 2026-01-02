import pool from '../../../config/db';
import AppError from '../../utils/AppError';
import { TUser } from '../users/user.interface';
import { TVehicle } from '../vehicles/vehicle.interface';
import { TBooking } from './booking.interface';

const createBooking = async (
  payload: Partial<TBooking> & {
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
  },
) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Check vehicle availability
    const vehicleQuery = 'SELECT * FROM vehicles WHERE id = $1';
    const vehicleResult = await client.query(vehicleQuery, [
      payload.vehicle_id,
    ]);

    if (vehicleResult.rows.length === 0) {
      throw new AppError(404, 'Vehicle not found');
    }

    const vehicle: TVehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== 'available') {
      throw new AppError(400, 'Vehicle is not available');
    }

    // 2. Calculate Total Price
    const startDate = new Date(payload.rent_start_date);
    const endDate = new Date(payload.rent_end_date);
    const durationTime = endDate.getTime() - startDate.getTime();
    const durationDays = durationTime / (1000 * 3600 * 24); // milliseconds to days

    if (durationDays < 0) {
      throw new AppError(400, 'End date must be after start date');
    }

    // Using Math.ceil to ensure at least 1 day or part of day counts?
    // Logic note: rent_end_date - rent_start_date could be exact.
    // Usually car rental is per day. Let's assume exact calc or ceil.
    // If exact hours matter, floating point might be used.
    // Let's use duration as days (floating allowed or rounded?).
    // "total_price = daily_rent_price x number_of_days"
    // Let's assume number_of_days is durationDays.

    // To be safe and logical for a rental system:
    // If I rent today leaving at 10am and return tomorrow 10am, that's 1 day = 24h.
    // If I rent today 10am and return today 8pm, that's 0.4 days? Or 1 day?
    // Usually min 1 day.
    // Let's go with exact math first.
    let days = durationDays;
    if (days === 0) days = 1; // Minimum 1 day charge maybe?
    // Let's stick to simple math: price * days.

    const totalPrice = vehicle.daily_rent_price * days;

    // 3. Create Booking
    const createQuery = `
      INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *
    `;

    const values = [
      payload.customer_id,
      payload.vehicle_id,
      payload.rent_start_date,
      payload.rent_end_date,
      totalPrice,
    ];

    const bookingResult = await client.query(createQuery, values);
    const booking = bookingResult.rows[0];

    // 4. Update Vehicle Status
    // "When booking is created -> Vehicle status changes to 'booked'"
    await client.query(
      "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
      [payload.vehicle_id],
    );

    await client.query('COMMIT');

    // 5. Populate return data (Vehicle details)
    // API Ref shows: data: { ..., vehicle: { vehicle_name, daily_rent_price } }
    return {
      ...booking,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
      },
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getAllBookings = async (user: Partial<TUser>) => {
  // Admin sees all, Customer sees own
  let query = `
    SELECT 
        b.*, 
        json_build_object(
            'id', v.id, 
            'vehicle_name', v.vehicle_name, 
            'registration_number', v.registration_number,
            'type', v.type
        ) as vehicle,
        json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email
        ) as customer
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    JOIN users u ON b.customer_id = u.id
  `;

  const values: any[] = [];

  if (user.role === 'customer') {
    query += ' WHERE b.customer_id = $1';
    values.push(user.id);
  }

  // Order by latest
  query += ' ORDER BY b.created_at DESC';

  const result = await pool.query(query, values);
  return result.rows;
};

export const BookingService = {
  createBooking,
  getAllBookings,
};
