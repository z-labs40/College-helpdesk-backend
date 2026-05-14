import { Request, Response, Router } from 'express';
import { TicketImpl } from '../repositories/TicketImpl';
import { CommentImpl } from '../repositories/CommentImpl';
import { AppDataSource } from '../../infrastructure/database';
import { CreateTicketUseCase } from '../../application/usecases/tickets/CreateTicketUseCase';
import { GetTicketsUseCase } from '../../application/usecases/tickets/GetTicketsUseCase';
import { GetTicketByIdUseCase } from '../../application/usecases/tickets/GetTicketByIdUseCase';
import { UpdateTicketUseCase } from '../../application/usecases/tickets/UpdateTicketUseCase';
import { AddCommentUseCase } from '../../application/usecases/tickets/AddCommentUseCase';
import { authMiddleware, roleMiddleware } from '../../frameworks/middleware';
import { SuccessResponse } from '../../frameworks/types';

export class TicketController {
  public router: Router = Router();
  private ticketRepository: TicketImpl;
  private commentRepository: CommentImpl;

  constructor() {
    this.ticketRepository = new TicketImpl(AppDataSource);
    this.commentRepository = new CommentImpl(AppDataSource);

    // All authenticated users
    this.router.get('/', authMiddleware, this.getTickets.bind(this));
    this.router.get('/:id', authMiddleware, this.getTicketById.bind(this));
    this.router.post('/:id/comments', authMiddleware, this.addComment.bind(this));

    // Student & Staff only — create ticket
    this.router.post(
      '/',
      authMiddleware,
      roleMiddleware(['student', 'staff']),
      this.createTicket.bind(this)
    );

    // All authenticated — update ticket (use case enforces per-role transitions)
    this.router.patch('/:id', authMiddleware, this.updateTicket.bind(this));
  }

  async getTickets(req: any, res: Response, next: any) {
    try {
      const { id, role } = req.user;
      const result = await new GetTicketsUseCase(this.ticketRepository).execute(id, role);
      res.status(200).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async getTicketById(req: any, res: Response, next: any) {
    try {
      const result = await new GetTicketByIdUseCase(this.ticketRepository).execute(req.params['id']);
      res.status(200).json({ ok: true, data: result } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async createTicket(req: any, res: Response, next: any) {
    try {
      const result = await new CreateTicketUseCase(this.ticketRepository).execute({
        ...req.body,
        createdById: req.user.id,
      });
      res.status(201).json({ ok: true, data: result, message: 'Ticket created successfully' } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async updateTicket(req: any, res: Response, next: any) {
    try {
      const { id: actorId, role: actorRole } = req.user;
      const result = await new UpdateTicketUseCase(this.ticketRepository).execute(
        req.params['id'],
        actorId,
        actorRole,
        req.body
      );
      res.status(200).json({ ok: true, data: result, message: 'Ticket updated successfully' } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }

  async addComment(req: any, res: Response, next: any) {
    try {
      const { text } = req.body;
      const result = await new AddCommentUseCase(this.commentRepository, this.ticketRepository).execute(
        req.params['id'],
        req.user.id,
        text
      );
      res.status(201).json({ ok: true, data: result, message: 'Comment added' } as SuccessResponse<typeof result>);
    } catch (err) { next(err); }
  }
}
