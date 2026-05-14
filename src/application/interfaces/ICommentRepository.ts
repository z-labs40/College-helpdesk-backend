import { TicketComment } from '../../adapters/models/TicketComment';

export interface CreateCommentDTO {
  ticketId: string;
  authorId: string;
  text: string;
}

export interface ICommentRepository {
  create(data: CreateCommentDTO): Promise<TicketComment>;
  findByTicketId(ticketId: string): Promise<TicketComment[]>;
}
