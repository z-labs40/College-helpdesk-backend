import { TicketComment } from '../models/TicketComment';
import {
  ICommentRepository,
  CreateCommentDTO,
} from '../../application/interfaces/ICommentRepository';
import { db } from '../../config/firebase';
import { User } from '../models/User';

export class CommentImpl implements ICommentRepository {
  private collection = db.collection('comments');

  async create(data: CreateCommentDTO): Promise<TicketComment> {
    const commentData = {
      ticketId: data.ticketId,
      authorId: data.authorId,
      text: data.text,
      createdAt: new Date(),
    };
    const ref = await this.collection.add(commentData);
    return { id: ref.id, ...commentData } as TicketComment;
  }

  async findByTicketId(ticketId: string): Promise<TicketComment[]> {
    const snapshot = await this.collection
      .where('ticketId', '==', ticketId)
      .get();
      
    let comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TicketComment));
    
    // Sort in memory to avoid Firebase Composite Index requirements
    comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Manually populate author
    for (const comment of comments) {
      if (comment.authorId) {
        const userDoc = await db.collection('users').doc(comment.authorId).get();
        if (userDoc.exists) {
          comment.author = { id: userDoc.id, ...userDoc.data() } as User;
        }
      }
    }
    
    return comments;
  }
}
