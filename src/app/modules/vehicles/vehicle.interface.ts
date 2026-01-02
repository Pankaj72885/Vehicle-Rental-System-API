export type TVehicleType = 'car' | 'bike' | 'van' | 'SUV';
export type TVehicleStatus = 'available' | 'booked';

export type TVehicle = {
  id?: number;
  vehicle_name: string;
  type: TVehicleType;
  registration_number: string;
  daily_rent_price: number;
  availability_status: TVehicleStatus;
  created_at?: Date;
  updated_at?: Date;
};
