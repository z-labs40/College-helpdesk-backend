import { Request, Response, Router } from 'express';
import { UserImpl } from '../repositories/UserImpl';
import { AppDataSource } from '../../infrastructure/database';
import { GetTechniciansUseCase } from '../../application/usecases/users/GetTechniciansUseCase';
import { authMiddleware, roleMiddleware } from '../../frameworks/middleware';
import { SuccessResponse } from '../../frameworks/types';

export class UserController {
  public router: Router = Router();
  private userRepository: UserImpl;

  constructor() {
    this.userRepository = new UserImpl(AppDataSource);

    // GET /users/technicians — Admin only (for assignment dropdown)
    this.router.get(
      '/technicians',
      authMiddleware,
      roleMiddleware(['admin']),
      this.getTechnicians.bind(this)
    );
  }

  async getTechnicians(req: Request, res: Response, next: any) {
    try {
      const result = await new GetTechniciansUseCase(this.userRepository).execute();
      res.status(200).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }
}
