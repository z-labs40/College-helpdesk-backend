import { IUserRepository } from '../../interfaces/IUserRepository';

export class GetTechniciansUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute() {
    const technicians = await this.userRepository.findByRole('technician');
    return technicians.map(t => ({
      id: t.id,
      name: t.name,
      email: t.email,
      department: t.department,
    }));
  }
}
