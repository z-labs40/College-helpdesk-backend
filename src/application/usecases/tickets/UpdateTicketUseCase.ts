import { ITicketRepository, UpdateTicketDTO } from '../../interfaces/ITicketRepository';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../../shared/error';
import { TicketStatus } from '../../../adapters/models/Ticket';

// Valid status transitions for each role
const allowedTransitions: Record<string, TicketStatus[]> = {
  admin: ['Assigned', 'Closed'],
  technician: ['In Progress', 'Resolved'],
  student: ['Closed', 'In Progress'], // In Progress = Reopen
  staff: ['Closed', 'In Progress'],   // In Progress = Reopen
};

export class UpdateTicketUseCase {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(
    ticketId: string,
    actorId: string,
    actorRole: string,
    data: UpdateTicketDTO
  ) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) throw new NotFoundError('Ticket not found');

    // Validate status transition
    if (data.status) {
      const allowed = allowedTransitions[actorRole] ?? [];
      if (!allowed.includes(data.status)) {
        throw new ForbiddenError(`Role '${actorRole}' cannot set status to '${data.status}'`);
      }
    }

    // Validate resolution is provided when resolving
    if (data.status === 'Resolved' && !data.resolution) {
      throw new BadRequestError('Resolution details are required when resolving a ticket');
    }

    // Validate only admin can assign
    if (data.assignedToId && actorRole !== 'admin') {
      throw new ForbiddenError('Only admins can assign tickets');
    }

    await this.ticketRepository.update(ticketId, data);
    return this.ticketRepository.findById(ticketId);
  }
}
