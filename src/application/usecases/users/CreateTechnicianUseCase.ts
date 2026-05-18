import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../interfaces/IUserRepository';
import { BadRequestError } from '../../../shared/error';
import { sendTechnicianInviteEmail } from '../../../infrastructure/emailService';
import { config } from '../../../config';

export class CreateTechnicianUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: {
    name: string;
    email: string;
    department?: string;
    phoneNumber?: string;
  }) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new BadRequestError('Email already in use');

    // Generate a secure temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'technician',
      department: data.department,
      phoneNumber: data.phoneNumber,
    });

    // Send invitation email automatically
    const loginLink = `${config.frontendUrl}/login`;
    await sendTechnicianInviteEmail(user.email, user.name, tempPassword, loginLink);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phoneNumber: user.phoneNumber,
    };
  }
}
