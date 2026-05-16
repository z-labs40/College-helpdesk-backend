import { User } from '../models/User';
import { IUserRepository } from '../../application/interfaces/IUserRepository';
import { db } from '../../config/firebase';

export class UserImpl implements IUserRepository {
  private collection = db.collection('users');

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection.where('email', '==', email).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as User;
  }

  async create(user: Partial<User>): Promise<User> {
    const data = {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const ref = await this.collection.add(data);
    return { id: ref.id, ...data } as User;
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
  }

  async findByRole(role: string): Promise<User[]> {
    const snapshot = await this.collection.where('role', '==', role).get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
    return users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }
}
