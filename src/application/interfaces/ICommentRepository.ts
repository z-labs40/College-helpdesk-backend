import { Comment } from '../../adapters/models/Comment';

export interface CreateCommentDTO {
  ticketId: string;
  authorId: string;
  text: string;
}

export interface ICommentRepository {
  create(data: CreateCommentDTO): Promise<Comment>;
  findByTicketId(ticketId: string): Promise<Comment[]>;
}
