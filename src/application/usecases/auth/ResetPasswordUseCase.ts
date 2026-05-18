import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../interfaces/IUserRepository';
import { BadRequestError, NotFoundError } from '../../../shared/error';
import { OTPStore } from '../../../shared/OTPStore';

export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, otp: string, newPassword: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundError('User not found');

    const isValid = OTPStore.verifyOTP(email, otp);
    if (!isValid) throw new BadRequestError('Invalid or expired OTP');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id!, { password: hashed });

    OTPStore.clearOTP(email);

    return { message: 'Password reset successfully' };
  }
}
