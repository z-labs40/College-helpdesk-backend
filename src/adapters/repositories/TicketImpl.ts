import { Ticket } from '../models/Ticket';
import { User } from '../models/User';
import { TicketComment } from '../models/TicketComment';
import {
  ITicketRepository,
  CreateTicketDTO,
  UpdateTicketDTO,
} from '../../application/interfaces/ITicketRepository';
import { db } from '../../config/firebase';
import { CommentImpl } from './CommentImpl';

export class TicketImpl implements ITicketRepository {
  private collection = db.collection('tickets');
  private commentRepo = new CommentImpl();

  private async populateTicketRelations(ticketData: any): Promise<Ticket> {
    const ticket = { ...ticketData } as Ticket;
    
    // Populate createdBy
    if (ticket.createdById) {
      const userDoc = await db.collection('users').doc(ticket.createdById).get();
      if (userDoc.exists) ticket.createdBy = { id: userDoc.id, ...userDoc.data() } as User;
    }
    
    // Populate assignedTo
    if (ticket.assignedToId) {
      const userDoc = await db.collection('users').doc(ticket.assignedToId).get();
      if (userDoc.exists) ticket.assignedTo = { id: userDoc.id, ...userDoc.data() } as User;
    }

    // Populate comments
    if (ticket.id) {
      ticket.comments = await this.commentRepo.findByTicketId(ticket.id);
    }
    
    return ticket;
  }

  async create(data: CreateTicketDTO): Promise<Ticket> {
    const ticketData = {
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      location: data.location || null,
      createdById: data.createdById,
      status: 'Open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const ref = await this.collection.add(ticketData);
    return this.populateTicketRelations({ id: ref.id, ...ticketData });
  }

  async findAll(): Promise<Ticket[]> {
    const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
    const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return Promise.all(tickets.map(t => this.populateTicketRelations(t)));
  }

  async findById(id: string): Promise<Ticket | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return this.populateTicketRelations({ id: doc.id, ...doc.data() });
  }

  async findByCreatedById(userId: string): Promise<Ticket[]> {
    const snapshot = await this.collection.where('createdById', '==', userId).get();
    let tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
    tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return Promise.all(tickets.map(t => this.populateTicketRelations(t)));
  }

  async findByAssignedToId(techId: string): Promise<Ticket[]> {
    const snapshot = await this.collection.where('assignedToId', '==', techId).get();
    let tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
    tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return Promise.all(tickets.map(t => this.populateTicketRelations(t)));
  }

  async update(id: string, data: UpdateTicketDTO): Promise<void> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
  }
}
