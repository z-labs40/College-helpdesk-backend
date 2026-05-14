import { DataSource, Repository } from 'typeorm';
import { User } from '../models/User';
import { IUserRepository } from '../../application/interfaces/IUserRepository';

export class UserImpl implements IUserRepository {
  private repository: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.repository.update(id, data);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findByRole(role: string): Promise<User[]> {
    return this.repository.find({
      where: { role: role as any },
      order: { name: 'ASC' },
    });
  }
}
