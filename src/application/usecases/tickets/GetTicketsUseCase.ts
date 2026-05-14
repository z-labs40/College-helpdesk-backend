import { ITicketRepository } from '../../interfaces/ITicketRepository';

export type UserRole = 'admin' | 'technician' | 'staff' | 'student';

export class GetTicketsUseCase {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(userId: string, role: UserRole) {
    switch (role) {
      case 'admin':
        // Admin sees all tickets
        return this.ticketRepository.findAll();

      case 'technician':
        // Technician sees only their assigned tickets
        return this.ticketRepository.findByAssignedToId(userId);

      case 'student':
      case 'staff':
        // Student/Staff see only their own tickets
        return this.ticketRepository.findByCreatedById(userId);

      default:
        return [];
    }
  }
}
