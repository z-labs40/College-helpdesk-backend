import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config';
import { Logger } from '../shared/logger';
import { User } from '../adapters/models/User';
import { Ticket } from '../adapters/models/Ticket';
import { Comment } from '../adapters/models/Comment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: true, // dev only — use migrations for production
  logging: false,
  entities: [User, Ticket, Comment],
  subscribers: [],
  migrations: [],
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

export async function initializeDataSource() {
  try {
    if (!AppDataSource.isInitialized) {
      Logger.info('🔌 Connecting to PostgreSQL...');
      await AppDataSource.initialize();
      Logger.info('✅ Database connection established successfully.');
    }
  } catch (error) {
    Logger.error(`❌ Failed to initialize database: ${error}`);
    throw error;
  }
}
