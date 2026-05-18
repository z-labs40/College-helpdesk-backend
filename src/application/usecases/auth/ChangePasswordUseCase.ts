import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../interfaces/IUserRepository';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../../../shared/error';

export class ChangePasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, currentPass: string, newPass: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.password) {
      throw new BadRequestError('User does not have a set password');
    }

    const isValid = await bcrypt.compare(currentPass, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Incorrect current password');
    }

    const hashed = await bcrypt.hash(newPass, 10);
    await this.userRepository.update(userId, { password: hashed });

    return { message: 'Password updated successfully' };
  }
}
