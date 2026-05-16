import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../interfaces/IUserRepository';
import { BadRequestError } from '../../../shared/error';

export class CreateTechnicianUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: {
    name: string;
    email: string;
    password: string;
    department?: string;
  }) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new BadRequestError('Email already in use');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'technician',
      department: data.department,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    };
  }
}
