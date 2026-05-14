import { ICommentRepository } from '../../interfaces/ICommentRepository';
import { ITicketRepository } from '../../interfaces/ITicketRepository';
import { NotFoundError } from '../../../shared/error';

export class AddCommentUseCase {
  constructor(
    private commentRepository: ICommentRepository,
    private ticketRepository: ITicketRepository
  ) {}

  async execute(ticketId: string, authorId: string, text: string) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) throw new NotFoundError('Ticket not found');

    return this.commentRepository.create({ ticketId, authorId, text });
  }
}
