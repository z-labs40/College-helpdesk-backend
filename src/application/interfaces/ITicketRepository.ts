import { Ticket, TicketStatus } from '../../adapters/models/Ticket';
import { Resolution } from '../../adapters/models/Ticket';

export interface CreateTicketDTO {
  title: string;
  description: string;
  category: string;
  priority: string;
  location?: string;
  createdById: string;
}

export interface UpdateTicketDTO {
  status?: TicketStatus;
  assignedToId?: string;
  resolution?: Resolution;
}

export interface ITicketRepository {
  create(data: CreateTicketDTO): Promise<Ticket>;
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  findByCreatedById(userId: string): Promise<Ticket[]>;
  findByAssignedToId(techId: string): Promise<Ticket[]>;
  update(id: string, data: UpdateTicketDTO): Promise<void>;
}
