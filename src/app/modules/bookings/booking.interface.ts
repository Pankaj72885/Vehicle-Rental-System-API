export type TBookingStatus = 'active' | 'cancelled' | 'returned';

export type TBooking = {
  id?: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: Date;
  rent_end_date: Date;
  total_price: number;
  status: TBookingStatus;
  created_at?: Date;
  updated_at?: Date;
};
