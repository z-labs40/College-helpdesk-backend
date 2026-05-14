import { ITicketRepository } from '../../interfaces/ITicketRepository';
import { NotFoundError } from '../../../shared/error';

export class GetTicketByIdUseCase {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(id: string) {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new NotFoundError('Ticket not found');
    return ticket;
  }
}
