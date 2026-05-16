import { Request, Response, Router } from 'express';
import { UserImpl } from '../repositories/UserImpl';
import { GetTechniciansUseCase } from '../../application/usecases/users/GetTechniciansUseCase';
import { GetAllUsersUseCase } from '../../application/usecases/users/GetAllUsersUseCase';
import { CreateTechnicianUseCase } from '../../application/usecases/users/CreateTechnicianUseCase';
import { UpdateTechnicianUseCase } from '../../application/usecases/users/UpdateTechnicianUseCase';
import { DeleteTechnicianUseCase } from '../../application/usecases/users/DeleteTechnicianUseCase';
import { authMiddleware, roleMiddleware } from '@/src/frameworks/middleware';
import { SuccessResponse } from '@/src/frameworks/types';

export class UserController {
  public router: Router = Router();
  private userRepository: UserImpl;

  constructor() {
    this.userRepository = new UserImpl();

    // GET /users — Admin only (fetches all users)
    this.router.get(
      '/',
      authMiddleware,
      roleMiddleware(['admin']),
      this.getAllUsers.bind(this)
    );

    // GET /users/technicians — Admin only (for assignment dropdown)
    this.router.get(
      '/technicians',
      authMiddleware,
      roleMiddleware(['admin']),
      this.getTechnicians.bind(this)
    );

    // POST /users/technicians — Admin only (creates a technician)
    this.router.post(
      '/technicians',
      authMiddleware,
      roleMiddleware(['admin']),
      this.createTechnician.bind(this)
    );

    // PUT /users/technicians/:id — Admin only (updates a technician)
    this.router.put(
      '/technicians/:id',
      authMiddleware,
      roleMiddleware(['admin']),
      this.updateTechnician.bind(this)
    );

    // DELETE /users/technicians/:id — Admin only (deletes a technician)
    this.router.delete(
      '/technicians/:id',
      authMiddleware,
      roleMiddleware(['admin']),
      this.deleteTechnician.bind(this)
    );
  }

  async getAllUsers(req: Request, res: Response, next: any) {
    try {
      const result = await new GetAllUsersUseCase(this.userRepository).execute();
      res.status(200).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async getTechnicians(req: Request, res: Response, next: any) {
    try {
      const result = await new GetTechniciansUseCase(this.userRepository).execute();
      res.status(200).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async createTechnician(req: Request, res: Response, next: any) {
    try {
      const result = await new CreateTechnicianUseCase(this.userRepository).execute(req.body);
      res.status(201).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async updateTechnician(req: Request, res: Response, next: any) {
    try {
      const result = await new UpdateTechnicianUseCase(this.userRepository).execute(req.params.id, req.body);
      res.status(200).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async deleteTechnician(req: Request, res: Response, next: any) {
    try {
      await new DeleteTechnicianUseCase(this.userRepository).execute(req.params.id);
      res.status(200).json({ ok: true, data: { success: true } } as SuccessResponse<any>);
    } catch (err) { next(err); }
  }
}
