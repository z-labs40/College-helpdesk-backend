import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import { AppDataSource, initializeDataSource } from '../infrastructure/database';
import { User } from '../adapters/models/User';
import { Logger } from '../shared/logger';

async function seed() {
  try {
    await initializeDataSource();
    const userRepository = AppDataSource.getRepository(User);

    const defaultPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@college.edu',
        password: defaultPassword,
        role: 'admin' as const,
        department: 'IT',
      }
    ];

    for (const u of users) {
      const exists = await userRepository.findOneBy({ email: u.email });
      if (!exists) {
        await userRepository.save(userRepository.create(u));
        Logger.info(`✅ Created user: ${u.email} (${u.role})`);
      } else {
        Logger.info(`ℹ️ User already exists: ${u.email}`);
      }
    }

    Logger.info('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    Logger.error(`❌ Seeding failed: ${error}`);
    process.exit(1);
  }
}

seed();
