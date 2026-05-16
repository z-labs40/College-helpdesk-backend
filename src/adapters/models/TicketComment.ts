import { User } from './User';
import { Ticket } from './Ticket';

export interface TicketComment {
  id?: string;
  text: string;
  
  ticket?: Ticket;
  ticketId: string;
  
  author?: User;
  authorId: string;
  
  createdAt: Date;
}
