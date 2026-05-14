import { DataSource, Repository } from 'typeorm';
import { Comment } from '../models/Comment';
import {
  ICommentRepository,
  CreateCommentDTO,
} from '../../application/interfaces/ICommentRepository';

export class CommentImpl implements ICommentRepository {
  private repository: Repository<Comment>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Comment);
  }

  async create(data: CreateCommentDTO): Promise<Comment> {
    const comment = this.repository.create({
      ticketId: data.ticketId,
      authorId: data.authorId,
      text: data.text,
    });
    return this.repository.save(comment);
  }

  async findByTicketId(ticketId: string): Promise<Comment[]> {
    return this.repository.find({
      where: { ticketId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }
}
