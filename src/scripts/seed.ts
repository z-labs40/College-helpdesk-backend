import bcrypt from 'bcryptjs';
import { db } from '../config/firebase';
import { Logger } from '../shared/logger';
import { UserRole } from '../adapters/models/User';

async function seed() {
  try {
    const usersRef = db.collection('users');

    const defaultPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@college.edu',
        password: defaultPassword,
        role: 'admin' as UserRole,
        department: 'IT',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    for (const u of users) {
      const snapshot = await usersRef.where('email', '==', u.email).get();
      if (snapshot.empty) {
        await usersRef.add(u);
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
