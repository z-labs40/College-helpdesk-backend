import { IUserRepository } from '../../interfaces/IUserRepository';
import { NotFoundError } from '../../../shared/error';
import { Logger } from '../../../shared/logger';
import { config } from '../../../config';
import { OTPStore } from '../../../shared/OTPStore';
import { sendOTPEmail } from '../../../infrastructure/emailService';

export class ForgotPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundError('No account found with that email');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);

    OTPStore.setOTP(email, otp, expiry);
    await sendOTPEmail(email, otp);

    Logger.info(`[FORGOT_PASSWORD] OTP sent to ${email}`);

    return {
      message: 'OTP sent to your email',
      expiryMinutes: config.otpExpiryMinutes,
    };
  }
}
