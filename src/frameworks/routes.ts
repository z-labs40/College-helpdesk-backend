import { Express } from 'express';
import { AuthController } from '../adapters/controller/AuthController';
import { UserController } from '../adapters/controller/UserController';
import { TicketController } from '../adapters/controller/TicketController';
import { UploadController } from '../adapters/controller/UploadController';
import { Logger } from '../shared/logger';

export default (app: Express) => {
  const authController = new AuthController();
  const userController = new UserController();
  const ticketController = new TicketController();
  const uploadController = new UploadController();

  app.use('/api/auth', authController.router);
  app.use('/api/users', userController.router);
  app.use('/api/tickets', ticketController.router);
  app.use('/api/uploads', uploadController.router);

  Logger.info('✅ Routes registered successfully');
};
