import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
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
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'enum',
    enum: ['Hardware', 'Software', 'Network', 'Electrical', 'Plumbing', 'Furniture', 'Other'],
  })
  category!: TicketCategory;

  @Column({
    type: 'enum',
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  })
  priority!: TicketPriority;

  @Column({ nullable: true })
  location?: string;

  @Column({
    type: 'enum',
    enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
  })
  status!: TicketStatus;

  // Creator (Student or Staff)
  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @Column()
  createdById!: string;

  // Assigned Technician (nullable until assigned)
  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @Column({ nullable: true })
  assignedToId?: string;

  // Resolution details (JSON column)
  @Column({ type: 'jsonb', nullable: true })
  resolution?: Resolution;

  @OneToMany(() => TicketComment, (comment) => comment.ticket)
  comments?: TicketComment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
