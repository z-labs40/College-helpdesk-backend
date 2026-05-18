import { User } from './User';
import { TicketComment } from './TicketComment';

export type TicketStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketCategory =
  | 'Hardware'
  | 'Software'
  | 'Network'
  | 'Electrical'
  | 'Plumbing'
  | 'Furniture'
  | 'Other';

export interface Resolution {
  title: string;
  notes: string;
  materials?: string;
  timeSpent?: number; // in minutes
  resolvedAt: string;
  imageUrls?: string[];
}

export interface Ticket {
  id?: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  location?: string;
  status: TicketStatus;
  imageUrl?: string;
  image?: string;
  imageUrls?: string[];
  
  createdBy?: User;
  createdById: string;
  
  assignedTo?: User;
  assignedToId?: string;
  
  resolution?: Resolution;
  comments?: TicketComment[];
  
  createdAt: Date;
  updatedAt: Date;
}
