import { User } from '../../adapters/models/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<void>;
  findAll(): Promise<User[]>;
  findByRole(role: string): Promise<User[]>;
  delete(id: string): Promise<void>;
}
