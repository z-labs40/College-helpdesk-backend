import { Request, Response, Router } from 'express';
import { UserImpl } from '../repositories/UserImpl';
import { LoginUseCase } from '../../application/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '../../application/usecases/auth/RegisterUseCase';
import { ForgotPasswordUseCase } from '../../application/usecases/auth/ForgotPasswordUseCase';
import { VerifyOTPUseCase } from '../../application/usecases/auth/VerifyOTPUseCase';
import { ResetPasswordUseCase } from '../../application/usecases/auth/ResetPasswordUseCase';
import { ChangePasswordUseCase } from '../../application/usecases/auth/ChangePasswordUseCase';
import { GetMeUseCase } from '../../application/usecases/users/GetMeUseCase';
import { authMiddleware } from '../../frameworks/middleware';
import { SuccessResponse } from '../../frameworks/types';

export class AuthController {
  public router: Router = Router();
  private userRepository: UserImpl;

  constructor() {
    this.userRepository = new UserImpl();
    this.router.post('/login', this.login.bind(this));
    this.router.post('/register', this.register.bind(this));
    this.router.post('/forgot-password', this.forgotPassword.bind(this));
    this.router.post('/verify-otp', this.verifyOTP.bind(this));
    this.router.post('/reset-password', this.resetPassword.bind(this));
    this.router.get('/me', authMiddleware, this.getMe.bind(this));
    this.router.post('/change-password', authMiddleware, this.changePassword.bind(this));
  }

  async login(req: Request, res: Response, next: any) {
    try {
      const { email, password } = req.body;
      const result = await new LoginUseCase(this.userRepository).execute(email, password);
      res.status(200).json({ ok: true, data: result, message: 'Login successful' } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async register(req: Request, res: Response, next: any) {
    try {
      const result = await new RegisterUseCase(this.userRepository).execute(req.body);
      res.status(201).json({ ok: true, data: result, message: 'Account created successfully' } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async forgotPassword(req: Request, res: Response, next: any) {
    try {
      const { email } = req.body;
      const result = await new ForgotPasswordUseCase(this.userRepository).execute(email);
      res.status(200).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async verifyOTP(req: Request, res: Response, next: any) {
    try {
      const { email, otp } = req.body;
      const result = await new VerifyOTPUseCase(this.userRepository).execute(email, otp);
      res.status(200).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async resetPassword(req: Request, res: Response, next: any) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await new ResetPasswordUseCase(this.userRepository).execute(email, otp, newPassword);
      res.status(200).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async getMe(req: any, res: Response, next: any) {
    try {
      const result = await new GetMeUseCase(this.userRepository).execute(req.user.id);
      res.status(200).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async changePassword(req: any, res: Response, next: any) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await new ChangePasswordUseCase(this.userRepository).execute(
        req.user.id,
        currentPassword,
        newPassword
      );
      res.status(200).json({ ok: true, data: result, message: 'Password updated successfully' } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }
}
