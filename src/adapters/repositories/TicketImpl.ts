import { DataSource, Repository } from 'typeorm';
import { Ticket } from '../models/Ticket';
import {
  ITicketRepository,
  CreateTicketDTO,
  UpdateTicketDTO,
} from '../../application/interfaces/ITicketRepository';

export class TicketImpl implements ITicketRepository {
  private repository: Repository<Ticket>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Ticket);
  }

  async create(data: CreateTicketDTO): Promise<Ticket> {
    const ticket = this.repository.create({
      title: data.title,
      description: data.description,
      category: data.category as any,
      priority: data.priority as any,
      location: data.location,
      createdById: data.createdById,
      status: 'Open',
    });
    return this.repository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.repository.find({
      relations: ['createdBy', 'assignedTo', 'comments', 'comments.author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Ticket | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo', 'comments', 'comments.author'],
    });
  }

  async findByCreatedById(userId: string): Promise<Ticket[]> {
    return this.repository.find({
      where: { createdById: userId },
      relations: ['createdBy', 'assignedTo', 'comments', 'comments.author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAssignedToId(techId: string): Promise<Ticket[]> {
    return this.repository.find({
      where: { assignedToId: techId },
      relations: ['createdBy', 'assignedTo', 'comments', 'comments.author'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, data: UpdateTicketDTO): Promise<void> {
    await this.repository.update(id, data as any);
  }
}
