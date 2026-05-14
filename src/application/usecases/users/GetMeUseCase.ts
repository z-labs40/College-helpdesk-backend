import { IUserRepository } from '../../interfaces/IUserRepository';
import { NotFoundError } from '../../../shared/error';

export class GetMeUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    };
  }
}
