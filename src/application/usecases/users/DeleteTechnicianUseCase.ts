import { IUserRepository } from '../../interfaces/IUserRepository';
import { BadRequestError } from '../../../shared/error';

export class DeleteTechnicianUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BadRequestError('User not found');

    await this.userRepository.delete(id);
  }
}
