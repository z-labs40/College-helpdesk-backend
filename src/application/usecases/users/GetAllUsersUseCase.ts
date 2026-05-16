import { IUserRepository } from '../../interfaces/IUserRepository';

export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute() {
    const users = await this.userRepository.findAll();
    // Return users without sensitive password information
    return users.map((u) => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
  }
}
