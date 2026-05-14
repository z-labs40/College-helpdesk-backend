import { Express } from 'express';
import { AuthController } from '../adapters/controller/AuthController';
import { UserController } from '../adapters/controller/UserController';
import { TicketController } from '../adapters/controller/TicketController';
import { Logger } from '../shared/logger';

export default (app: Express) => {
  const authController = new AuthController();
  const userController = new UserController();
  const ticketController = new TicketController();

  app.use('/api/auth', authController.router);
  app.use('/api/users', userController.router);
  app.use('/api/tickets', ticketController.router);

  Logger.info('✅ Routes registered successfully');
};
