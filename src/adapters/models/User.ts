export type UserRole = 'admin' | 'technician' | 'staff' | 'student';

export interface User {
  id?: string; // Optional for creation
  name: string;
  email: string;
  password?: string; // Optional because we might omit it when returning to client
  role: UserRole;
  department?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
