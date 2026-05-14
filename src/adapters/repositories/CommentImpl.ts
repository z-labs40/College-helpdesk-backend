import { DataSource, Repository } from 'typeorm';
import { TicketComment } from '../models/TicketComment';
import {
  ICommentRepository,
  CreateCommentDTO,
} from '../../application/interfaces/ICommentRepository';

export class CommentImpl implements ICommentRepository {
  private repository: Repository<TicketComment>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(TicketComment);
  }

  async create(data: CreateCommentDTO): Promise<TicketComment> {
    const comment = this.repository.create({
      ticketId: data.ticketId,
      authorId: data.authorId,
      text: data.text,
    });
    return this.repository.save(comment);
  }

  async findByTicketId(ticketId: string): Promise<TicketComment[]> {
    return this.repository.find({
      where: { ticketId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }
}
