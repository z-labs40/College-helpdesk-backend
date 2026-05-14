import { ITicketRepository, CreateTicketDTO } from '../../interfaces/ITicketRepository';

export class CreateTicketUseCase {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(data: CreateTicketDTO) {
    return this.ticketRepository.create(data);
  }
}
