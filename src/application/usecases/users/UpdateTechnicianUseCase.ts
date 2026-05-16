import { IUserRepository } from '../../interfaces/IUserRepository';
import { BadRequestError } from '../../../shared/error';

export class UpdateTechnicianUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: { name?: string; email?: string; department?: string }) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BadRequestError('User not found');

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing) throw new BadRequestError('Email already in use');
    }

    await this.userRepository.update(id, data);
    return { ...user, ...data };
  }
}
